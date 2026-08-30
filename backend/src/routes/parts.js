const express = require('express');
const db = require('../db');
const { isKind } = require('../vehicles');
const { isCategory, isDepartment, categoryIdsOf } = require('../categories');

const router = express.Router();

const KINDS = new Set(['orig', 'copy', 'used']);

// % ו-_ הם תווי חיפוש של LIKE — בלי בריחה, חיפוש "%" מחזיר את כל הקטלוג
function like(value) {
  return String(value).replace(/[\\%_]/g, (c) => `\\${c}`);
}

const sellerStmt = db.prepare(
  'SELECT id, name, city, phone, whatsapp, rating, reviews_count, verified FROM sellers WHERE id = ?'
);
const interchangeStmt = db.prepare('SELECT id, number, brand FROM interchange_numbers WHERE part_id = ?');

function attachSellerAndInterchange(parts) {
  return parts.map((part) => ({
    ...part,
    seller: part.seller_id ? sellerStmt.get(part.seller_id) : null,
    interchange_numbers: interchangeStmt.all(part.id),
  }));
}

// GET /api/parts?category=brakes&kind=orig&q=בלם&page=1&limit=20
// סינון רכב: vehicle_kind, vehicle_make (מהרשימה) או make_q (יצרן חופשי,
// למי שרכבו לא ברשימה), vehicle_model ו-year.
router.get('/', (req, res) => {
  const { department, category, kind, q, vehicle_kind: vk, vehicle_make: vm,
          make_q: mq, vehicle_model: vmodel, year } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
  const offset = (page - 1) * limit;

  const where = [];
  const params = {};

  // מחלקה שלמה = כל הקטגוריות שלה, וזה מה שכפתור "הכל" שולח
  if (department && department !== 'all') {
    if (!isDepartment(department)) return res.status(400).json({ error: 'מחלקה לא תקינה' });
    const ids = categoryIdsOf(department);
    where.push(`category IN (${ids.map((_, i) => `@dep${i}`).join(', ')})`);
    ids.forEach((id, i) => { params[`dep${i}`] = id; });
  }
  if (category && category !== 'all') {
    if (!isCategory(category)) return res.status(400).json({ error: 'קטגוריה לא תקינה' });
    where.push('category = @category');
    params.category = category;
  }
  if (kind && kind !== 'all') {
    if (!KINDS.has(kind)) return res.status(400).json({ error: 'סוג חלק לא תקין' });
    where.push('kind = @kind');
    params.kind = kind;
  }
  if (vk && vk !== 'all') {
    if (!isKind(vk)) return res.status(400).json({ error: 'סוג רכב לא תקין' });
    where.push('vehicle_kind = @vk');
    params.vk = vk;
  }
  if (vm && vm !== 'all') {
    where.push('vehicle_make = @vm');
    params.vm = vm;
  }
  // יצרן שהוקלד ביד ("אחר") — התאמה חלקית, כי אנשים כותבים
  // "מרצדס" ו-"Mercedes" ו-"mercedes benz" לאותו רכב.
  if (mq && String(mq).trim()) {
    where.push("vehicle_make LIKE @mq ESCAPE '\\'");
    params.mq = `%${like(mq)}%`;
  }
  if (vmodel && String(vmodel).trim()) {
    where.push("(vehicle_model LIKE @vmodel ESCAPE '\\' OR fits LIKE @vmodel ESCAPE '\\')");
    params.vmodel = `%${like(vmodel)}%`;
  }
  // שנה: חלק בלי טווח שנים מתאים לכל השנים, ולכן NULL נחשב פתוח.
  if (year) {
    const y = parseInt(year);
    if (Number.isNaN(y) || y < 1950 || y > 2100) {
      return res.status(400).json({ error: 'שנה לא תקינה' });
    }
    where.push('(year_from IS NULL OR year_from <= @year) AND (year_to IS NULL OR year_to >= @year)');
    params.year = y;
  }
  if (q) {
    where.push(`(
      name LIKE @q ESCAPE '\\' OR sub LIKE @q ESCAPE '\\' OR part_no LIKE @q ESCAPE '\\'
      OR maker LIKE @q ESCAPE '\\' OR fits LIKE @q ESCAPE '\\'
      OR vehicle_make LIKE @q ESCAPE '\\' OR vehicle_model LIKE @q ESCAPE '\\'
      OR id IN (SELECT part_id FROM interchange_numbers WHERE number LIKE @q ESCAPE '\\')
    )`);
    params.q = `%${like(q)}%`;
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const total = db.prepare(`SELECT COUNT(*) AS count FROM parts ${whereClause}`).get(params).count;

  const rows = db
    .prepare(`SELECT * FROM parts ${whereClause} ORDER BY price ASC, id ASC LIMIT @limit OFFSET @offset`)
    .all({ ...params, limit, offset });

  res.json({
    items: attachSellerAndInterchange(rows),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

// GET /api/parts/:id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'מזהה לא תקין' });

  const row = db.prepare('SELECT * FROM parts WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: 'החלק לא נמצא' });

  const [part] = attachSellerAndInterchange([row]);
  res.json({ part });
});

// GET /api/parts/:id/analogs — הצעות מקבילות: אותו מק״ט אצל מוכר אחר,
// או חלק שחולק לפחות מספר חלופי אחד. זה מה שמאפשר להשוות מחיר.
router.get('/:id/analogs', (req, res) => {
  const id = parseInt(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'מזהה לא תקין' });

  const part = db.prepare('SELECT * FROM parts WHERE id = ?').get(id);
  if (!part) return res.status(404).json({ error: 'החלק לא נמצא' });

  const rows = db
    .prepare(
      `SELECT * FROM parts
       WHERE id != @id
         AND (
           part_no = @part_no
           OR id IN (
             SELECT part_id FROM interchange_numbers
             WHERE number IN (SELECT number FROM interchange_numbers WHERE part_id = @id)
                OR number = @part_no
           )
         )
       ORDER BY price ASC`
    )
    .all({ id, part_no: part.part_no });

  res.json({ analogs: attachSellerAndInterchange(rows) });
});

module.exports = router;
