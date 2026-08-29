const express = require('express');
const db = require('../db');
const { isKind } = require('../vehicles');

const router = express.Router();

const KINDS = new Set(['orig', 'copy', 'used']);

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
router.get('/', (req, res) => {
  const { category, kind, q, vehicle_kind: vk, vehicle_make: vm } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
  const offset = (page - 1) * limit;

  const where = [];
  const params = {};

  if (category && category !== 'all') {
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
  if (q) {
    where.push(`(
      name LIKE @q ESCAPE '\\' OR sub LIKE @q ESCAPE '\\' OR part_no LIKE @q ESCAPE '\\'
      OR maker LIKE @q ESCAPE '\\' OR fits LIKE @q ESCAPE '\\'
      OR vehicle_make LIKE @q ESCAPE '\\' OR vehicle_model LIKE @q ESCAPE '\\'
      OR id IN (SELECT part_id FROM interchange_numbers WHERE number LIKE @q ESCAPE '\\')
    )`);
    // % ו-_ הם תווי חיפוש של LIKE — בלי בריחה, חיפוש "%" מחזיר את כל הקטלוג
    params.q = `%${String(q).replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
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
