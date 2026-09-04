const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { conditionOf, rebuildCatalog } = require('../catalog');
const { requireSellerAuth } = require('../middleware/sellerAuth');
const { asyncHandler } = require('../asyncHandler');
const { isKind, isMakeOfKind } = require('../vehicles');
const { isCategory } = require('../categories');

const router = express.Router();

const KINDS = new Set(['orig', 'copy', 'used']);

// התאמת הרכב נבדקת כזוג: יצרן תקף רק בתוך הסוג שלו, ושנים חייבות
// להיות טווח הגיוני — אחרת החלק פשוט לא יימצא במסננים.
function vehicleError(body, current) {
  const kind = body.vehicle_kind !== undefined ? body.vehicle_kind : (current && current.vehicle_kind);
  const make = body.vehicle_make !== undefined ? body.vehicle_make : (current && current.vehicle_make);
  const from = body.year_from !== undefined ? body.year_from : (current && current.year_from);
  const to = body.year_to !== undefined ? body.year_to : (current && current.year_to);
  // יצרן שנבחר מהרשימה נבדק מולה; יצרן שהוקלד ביד ("אחר") רק נבדק באורך,
  // כי בדיוק בשבילו השדה קיים — רכב שאינו אחד מהנפוצים.
  const custom = body.vehicle_make_custom === true;

  if (kind && !isKind(kind)) return 'סוג רכב לא תקין';
  if (make && !kind) return 'נא לבחור סוג רכב לפני היצרן';
  if (make && custom && String(make).trim().length > 40) return 'שם היצרן ארוך מדי';
  if (make && !custom && !isMakeOfKind(kind, make)) return 'היצרן אינו מתאים לסוג הרכב שנבחר';

  const year = (y) => y === null || y === undefined || (Number.isInteger(y) && y >= 1950 && y <= 2100);
  if (!year(from) || !year(to)) return 'שנת דגם חייבת להיות בין 1950 ל-2100';
  if (from && to && from > to) return 'שנת ההתחלה מאוחרת משנת הסיום';
  return null;
}



function signSellerToken(seller) {
  return jwt.sign(
    { sub: seller.id, email: seller.email, name: seller.name, role: 'seller' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// כרטיס ספק כפי שהוא נחשף לכל העולם — בלי הסיסמה ובלי האימייל,
// שהוא גם שם המשתמש להתחברות לקבינט.
function publicSeller(row) {
  if (!row) return null;
  const { password_hash, email, ...rest } = row;
  return rest;
}

// כרטיס ספק כפי שהוא מוצג לספק עצמו בקבינט — האימייל שלו נשאר.
function ownSeller(row) {
  if (!row) return null;
  const { password_hash, ...rest } = row;
  return rest;
}

/* איפה ההצעה נחתה בקטלוג. זה לא קישוט למוכר: הצעה שלא התחברה
   למק״ט מוכר לא תימצא בחיפוש חלופי, כלומר היא כמעט בלתי נראית —
   והמוכר אינו יכול לדעת את זה בלי שנגיד לו. איכות הקטלוג היא מה
   שגורם לחיפוש לעבוד, והיא נבנית כאן. */
const { categoryIdsOf } = require('../categories');
// מק״ט מקורי קיים רק לחלקי רכב. למגבר, לערכת כלים או לשמן אין
// מק״ט של יצרן רכב שאפשר להצביע עליו, ואזהרה עליהם היא רעש.
const CROSSABLE = new Set(categoryIdsOf('parts'));

const catalogStmt = db.prepare(
  `SELECT p.id, p.brand, p.category,
          (SELECT number FROM position_numbers WHERE position_id = p.id ORDER BY is_primary DESC, number LIMIT 1) AS number,
          (SELECT COUNT(*) FROM parts WHERE position_id = p.id) AS offers,
          (SELECT COUNT(*) FROM oe_refs WHERE position_id = p.id OR anchor_id = p.id) AS links
   FROM positions p WHERE p.id = ?`
);

function attachInterchange(parts) {
  const stmt = db.prepare(
    'SELECT id, number, brand, is_oem FROM interchange_numbers WHERE part_id = ? ORDER BY is_oem DESC, id'
  );
  return parts.map((p) => {
    const pos = p.position_id ? catalogStmt.get(p.position_id) : null;
    return {
      ...p,
      interchange_numbers: stmt.all(p.id),
      catalog: pos ? {
        position_id: pos.id, brand: pos.brand, number: pos.number,
        offers: pos.offers, others: Math.max(0, pos.offers - 1),
        // "יתום": חלק רכב שאיש לא מפנה למק״ט שלו ואיש אחר לא מוכר
        // אותו — כלומר חיפוש חלופי לא יביא אליו אף אחד
        orphan: CROSSABLE.has(pos.category) && pos.links === 0 && pos.offers <= 1,
      } : null,
    };
  });
}

/* ---------- ציבורי ---------- */

// GET /api/sellers — רשימת כל הספקים
router.get('/', (req, res) => {
  const sellers = db.prepare('SELECT * FROM sellers ORDER BY rating DESC').all();
  res.json({ sellers: sellers.map(publicSeller) });
});

// GET /api/sellers/:id — כרטיס ספק ציבורי + החלקים שהוא מציע
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'מזהה לא תקין' });

  const seller = db.prepare('SELECT * FROM sellers WHERE id = ?').get(id);
  if (!seller) return res.status(404).json({ error: 'הספק לא נמצא' });

  const parts = attachInterchange(
    db.prepare('SELECT * FROM parts WHERE seller_id = ? ORDER BY id DESC').all(id)
  );

  res.json({ seller: publicSeller(seller), parts });
});

/* ---------- הרשמה / התחברות ---------- */

// POST /api/sellers/register — יצירת כרטיס ספק חדש עם כל הפרטים
router.post('/register', asyncHandler(async (req, res) => {
  const { name, city, phone, whatsapp, email, password } = req.body || {};

  if (!name || !city || !phone || !email || !password) {
    return res.status(400).json({ error: 'נא למלא שם עסק, עיר, טלפון, אימייל וסיסמה' });
  }
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'אימייל וסיסמה חייבים להיות טקסט' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'כתובת אימייל לא תקינה' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'הסיסמה חייבת להכיל לפחות 6 תווים' });
  }

  const existing = db.prepare('SELECT id FROM sellers WHERE email = ?').get(email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'כבר קיים חשבון ספק עם אימייל זה' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = db
    .prepare(
      `INSERT INTO sellers (name, city, phone, whatsapp, email, password_hash, rating, reviews_count, verified)
       VALUES (?, ?, ?, ?, ?, ?, 5.0, 0, 0)`
    )
    .run(name, city, phone, whatsapp || null, email.toLowerCase(), passwordHash);

  const seller = db.prepare('SELECT * FROM sellers WHERE id = ?').get(result.lastInsertRowid);
  const token = signSellerToken(seller);

  res.status(201).json({ token, seller: ownSeller(seller) });
}));

// POST /api/sellers/login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'נא למלא אימייל וסיסמה' });
  }
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'אימייל וסיסמה חייבים להיות טקסט' });
  }

  const seller = db.prepare('SELECT * FROM sellers WHERE email = ?').get(email.toLowerCase());
  if (!seller || !seller.password_hash) {
    return res.status(401).json({ error: 'אימייל או סיסמה שגויים' });
  }

  const valid = await bcrypt.compare(password, seller.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'אימייל או סיסמה שגויים' });
  }

  const token = signSellerToken(seller);
  res.json({ token, seller: ownSeller(seller) });
}));

/* ---------- קבינט הספק (דורש התחברות) ---------- */

// GET /api/sellers/me/profile — פרטי הספק המחובר
router.get('/me/profile', requireSellerAuth, (req, res) => {
  const seller = db.prepare('SELECT * FROM sellers WHERE id = ?').get(req.seller.id);
  if (!seller) return res.status(404).json({ error: 'הספק לא נמצא' });
  res.json({ seller: ownSeller(seller) });
});

// PATCH /api/sellers/me/profile — עדכון פרטי הספק
router.patch('/me/profile', requireSellerAuth, (req, res) => {
  const { name, city, phone, whatsapp } = req.body || {};
  const current = db.prepare('SELECT * FROM sellers WHERE id = ?').get(req.seller.id);
  if (!current) return res.status(404).json({ error: 'הספק לא נמצא' });

  db.prepare(
    `UPDATE sellers SET name = @name, city = @city, phone = @phone, whatsapp = @whatsapp WHERE id = @id`
  ).run({
    name: name || current.name,
    city: city || current.city,
    phone: phone || current.phone,
    whatsapp: whatsapp !== undefined ? whatsapp : current.whatsapp,
    id: req.seller.id,
  });

  const updated = db.prepare('SELECT * FROM sellers WHERE id = ?').get(req.seller.id);
  res.json({ seller: ownSeller(updated) });
});

// GET /api/sellers/me/parts — כל כרטיסי המוצר של הספק המחובר
router.get('/me/parts', requireSellerAuth, (req, res) => {
  const parts = attachInterchange(
    db.prepare('SELECT * FROM parts WHERE seller_id = ? ORDER BY id DESC').all(req.seller.id)
  );
  res.json({ parts });
});

// GET /api/sellers/me/stats — המספרים שמופיעים בראש מסך "המלאי שלי"
router.get('/me/stats', requireSellerAuth, (req, res) => {
  const inStock = db
    .prepare('SELECT COALESCE(SUM(qty), 0) AS c FROM parts WHERE seller_id = ?')
    .get(req.seller.id).c;
  const outOfStock = db
    .prepare('SELECT COUNT(*) AS c FROM parts WHERE seller_id = ? AND qty = 0')
    .get(req.seller.id).c;
  const requests = db
    .prepare(
      `SELECT COUNT(*) AS c FROM order_requests r
       JOIN conversations c ON c.id = r.conversation_id
       WHERE c.seller_id = ? AND r.status = 'sent'`
    )
    .get(req.seller.id).c;

  res.json({ in_stock: inStock, out_of_stock: outOfStock, requests });
});

// POST /api/sellers/me/parts — יצירת כרטיס מוצר חדש
router.post('/me/parts', requireSellerAuth, (req, res) => {
  const { name, sub, category, part_no, price, kind, maker, fits, qty, image_url, icon, interchange_numbers,
          condition_pct, vehicle_kind, vehicle_make, vehicle_model, year_from, year_to } = req.body || {};

  if (!name || !category || !part_no || price === undefined) {
    return res.status(400).json({ error: 'נא למלא שם, קטגוריה, מק״ט ומחיר' });
  }
  if (!isCategory(category)) {
    return res.status(400).json({ error: 'קטגוריה לא תקינה' });
  }
  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'המחיר חייב להיות מספר חיובי' });
  }
  if (kind !== undefined && !KINDS.has(kind)) {
    return res.status(400).json({ error: 'מצב החלק חייב להיות מקורי, חלופי או משומש' });
  }
  if (qty !== undefined && (!Number.isInteger(qty) || qty < 0)) {
    return res.status(400).json({ error: 'הכמות חייבת להיות מספר שלם אי-שלילי' });
  }
  const vehErr = vehicleError(req.body || {}, null);
  if (vehErr) return res.status(400).json({ error: vehErr });

  // מק״ט ייחודי בתוך המוכר בלבד — אותו חלק מוצע במקביל על ידי מוכרים אחרים.
  const existing = db
    .prepare('SELECT id FROM parts WHERE part_no = ? AND seller_id = ?')
    .get(part_no, req.seller.id);
  if (existing) {
    return res.status(409).json({ error: 'כבר קיים אצלך חלק עם מק״ט זה' });
  }

  const createPart = db.transaction(() => {
    const result = db
      .prepare(
        `INSERT INTO parts (name, sub, category, part_no, price, kind, maker, fits, qty, image_url, icon, seller_id,
                            condition_pct, vehicle_kind, vehicle_make, vehicle_model, year_from, year_to)
         VALUES (@name, @sub, @category, @part_no, @price, @kind, @maker, @fits, @qty, @image_url, @icon, @seller_id,
                 @condition_pct, @vehicle_kind, @vehicle_make, @vehicle_model, @year_from, @year_to)`
      )
      .run({
        name,
        sub: sub || null,
        category,
        part_no,
        price,
        kind: kind || 'copy',
        maker: maker || null,
        // אחוז מצב שייך לחלק משומש בלבד — ראה conditionOf
        condition_pct: conditionOf(kind || 'copy', condition_pct),
        fits: fits || null,
        qty: qty === undefined ? 0 : qty,
        image_url: image_url || null,
        icon: icon || '🔧',
        seller_id: req.seller.id,
        vehicle_kind: vehicle_kind || null,
        vehicle_make: vehicle_make || null,
        vehicle_model: vehicle_model || null,
        year_from: year_from ?? null,
        year_to: year_to ?? null,
      });

    const partId = result.lastInsertRowid;

    if (Array.isArray(interchange_numbers)) {
      const insertAlt = db.prepare('INSERT INTO interchange_numbers (part_id, number, brand, is_oem) VALUES (?, ?, ?, ?)');
      for (const alt of interchange_numbers) {
        if (alt && alt.number) insertAlt.run(partId, alt.number, alt.brand || null, alt.is_oem ? 1 : 0);
      }
    }

    return partId;
  });

  const partId = createPart();
  refreshCatalog();
  const [part] = attachInterchange([db.prepare('SELECT * FROM parts WHERE id = ?').get(partId)]);

  res.status(201).json({ part });
});

/* הקטלוג נגזר מההצעות והמספרים החופפים, ולכן כל כתיבה מרעננת אותו.
   בנייה מחדש שלמה ולא נקודתית, כי הצעה חדשה יכולה לאחד שתי פוזיציות
   שהיו נפרדות: מוכר שמוסיף מק״ט שמחבר ביניהן משנה את שתיהן. המזהים
   נשמרים בבנייה מחדש, ולכן כרטיס שפתוח אצל קונה אינו מתחלף.
   בקטלוג גדול זה יהיה כבד מדי, ואז המקום הזה עובר לעדכון נקודתי. */
function refreshCatalog() { rebuildCatalog(db); }

// PATCH /api/sellers/me/parts/:id — עדכון כרטיס מוצר קיים (רק של הספק עצמו)
router.patch('/me/parts/:id', requireSellerAuth, (req, res) => {
  const partId = parseInt(req.params.id);
  const current = db.prepare('SELECT * FROM parts WHERE id = ?').get(partId);

  if (!current || current.seller_id !== req.seller.id) {
    return res.status(404).json({ error: 'הכרטיס לא נמצא בקבינט שלך' });
  }

  const { name, sub, category, part_no, price, kind, maker, fits, qty, image_url, icon, interchange_numbers,
          condition_pct, vehicle_kind, vehicle_make, vehicle_model, year_from, year_to } = req.body || {};

  if (price !== undefined && (typeof price !== 'number' || price < 0)) {
    return res.status(400).json({ error: 'המחיר חייב להיות מספר חיובי' });
  }
  if (kind !== undefined && !KINDS.has(kind)) {
    return res.status(400).json({ error: 'מצב החלק חייב להיות מקורי, חלופי או משומש' });
  }
  if (category !== undefined && !isCategory(category)) {
    return res.status(400).json({ error: 'קטגוריה לא תקינה' });
  }
  if (qty !== undefined && (!Number.isInteger(qty) || qty < 0)) {
    return res.status(400).json({ error: 'הכמות חייבת להיות מספר שלם אי-שלילי' });
  }
  const vehErrPatch = vehicleError(req.body || {}, current);
  if (vehErrPatch) return res.status(400).json({ error: vehErrPatch });
  if (part_no !== undefined) {
    if (!part_no) return res.status(400).json({ error: 'מק״ט הוא שדה חובה' });
    const clash = db
      .prepare('SELECT id FROM parts WHERE part_no = ? AND seller_id = ? AND id != ?')
      .get(part_no, req.seller.id, partId);
    if (clash) return res.status(409).json({ error: 'כבר קיים אצלך חלק עם מק״ט זה' });
  }

  db.prepare(
    `UPDATE parts SET name=@name, sub=@sub, category=@category, part_no=@part_no, price=@price,
            kind=@kind, maker=@maker, fits=@fits, qty=@qty, image_url=@image_url, icon=@icon,
            condition_pct=@condition_pct,
            vehicle_kind=@vehicle_kind, vehicle_make=@vehicle_make, vehicle_model=@vehicle_model,
            year_from=@year_from, year_to=@year_to
     WHERE id=@id`
  ).run({
    name: name ?? current.name,
    sub: sub ?? current.sub,
    category: category ?? current.category,
    part_no: part_no ?? current.part_no,
    price: price ?? current.price,
    kind: kind ?? current.kind,
    maker: maker ?? current.maker,
    condition_pct: conditionOf(kind ?? current.kind,
      condition_pct !== undefined ? condition_pct : current.condition_pct),
    fits: fits ?? current.fits,
    qty: qty ?? current.qty,
    image_url: image_url ?? current.image_url,
    icon: icon ?? current.icon,
    // כאן null הוא בקשה למחוק את ההתאמה, ולכן בודקים undefined ולא ??
    vehicle_kind: vehicle_kind !== undefined ? (vehicle_kind || null) : current.vehicle_kind,
    vehicle_make: vehicle_make !== undefined ? (vehicle_make || null) : current.vehicle_make,
    vehicle_model: vehicle_model !== undefined ? (vehicle_model || null) : current.vehicle_model,
    year_from: year_from !== undefined ? (year_from ?? null) : current.year_from,
    year_to: year_to !== undefined ? (year_to ?? null) : current.year_to,
    id: partId,
  });

  if (Array.isArray(interchange_numbers)) {
    const replaceAlts = db.transaction(() => {
      db.prepare('DELETE FROM interchange_numbers WHERE part_id = ?').run(partId);
      const insertAlt = db.prepare('INSERT INTO interchange_numbers (part_id, number, brand, is_oem) VALUES (?, ?, ?, ?)');
      for (const alt of interchange_numbers) {
        if (alt && alt.number) insertAlt.run(partId, alt.number, alt.brand || null, alt.is_oem ? 1 : 0);
      }
    });
    replaceAlts();
  }

  refreshCatalog();
  const [part] = attachInterchange([db.prepare('SELECT * FROM parts WHERE id = ?').get(partId)]);
  res.json({ part });
});

// DELETE /api/sellers/me/parts/:id
router.delete('/me/parts/:id', requireSellerAuth, (req, res) => {
  const partId = parseInt(req.params.id);
  const current = db.prepare('SELECT * FROM parts WHERE id = ?').get(partId);

  if (!current || current.seller_id !== req.seller.id) {
    return res.status(404).json({ error: 'הכרטיס לא נמצא בקבינט שלך' });
  }

  db.prepare('DELETE FROM parts WHERE id = ?').run(partId);
  refreshCatalog();
  res.json({ success: true });
});

module.exports = router;
