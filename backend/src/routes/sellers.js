const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { requireSellerAuth } = require('../middleware/sellerAuth');

const router = express.Router();

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

function publicSeller(row) {
  if (!row) return null;
  const { password_hash, ...rest } = row;
  return rest;
}

function attachInterchange(parts) {
  const stmt = db.prepare('SELECT id, number, brand FROM interchange_numbers WHERE part_id = ?');
  return parts.map((p) => ({ ...p, interchange_numbers: stmt.all(p.id) }));
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
router.post('/register', async (req, res) => {
  const { name, city, phone, whatsapp, email, password } = req.body || {};

  if (!name || !city || !phone || !email || !password) {
    return res.status(400).json({ error: 'נא למלא שם עסק, עיר, טלפון, אימייל וסיסמה' });
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

  res.status(201).json({ token, seller: publicSeller(seller) });
});

// POST /api/sellers/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'נא למלא אימייל וסיסמה' });
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
  res.json({ token, seller: publicSeller(seller) });
});

/* ---------- קבינט הספק (דורש התחברות) ---------- */

// GET /api/sellers/me/profile — פרטי הספק המחובר
router.get('/me/profile', requireSellerAuth, (req, res) => {
  const seller = db.prepare('SELECT * FROM sellers WHERE id = ?').get(req.seller.id);
  if (!seller) return res.status(404).json({ error: 'הספק לא נמצא' });
  res.json({ seller: publicSeller(seller) });
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
  res.json({ seller: publicSeller(updated) });
});

// GET /api/sellers/me/parts — כל כרטיסי המוצר של הספק המחובר
router.get('/me/parts', requireSellerAuth, (req, res) => {
  const parts = attachInterchange(
    db.prepare('SELECT * FROM parts WHERE seller_id = ? ORDER BY id DESC').all(req.seller.id)
  );
  res.json({ parts });
});

// POST /api/sellers/me/parts — יצירת כרטיס מוצר חדש
router.post('/me/parts', requireSellerAuth, (req, res) => {
  const { name, sub, category, part_no, price, stock, icon, interchange_numbers } = req.body || {};

  if (!name || !category || !part_no || price === undefined) {
    return res.status(400).json({ error: 'נא למלא שם, קטגוריה, מק״ט ומחיר' });
  }
  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'המחיר חייב להיות מספר חיובי' });
  }

  const existing = db.prepare('SELECT id FROM parts WHERE part_no = ?').get(part_no);
  if (existing) {
    return res.status(409).json({ error: 'כבר קיים חלק עם מק״ט זה' });
  }

  const createPart = db.transaction(() => {
    const result = db
      .prepare(
        `INSERT INTO parts (name, sub, category, part_no, price, stock, icon, seller_id)
         VALUES (@name, @sub, @category, @part_no, @price, @stock, @icon, @seller_id)`
      )
      .run({
        name,
        sub: sub || null,
        category,
        part_no,
        price,
        stock: stock === 'low' ? 'low' : 'in',
        icon: icon || '🔧',
        seller_id: req.seller.id,
      });

    const partId = result.lastInsertRowid;

    if (Array.isArray(interchange_numbers)) {
      const insertAlt = db.prepare('INSERT INTO interchange_numbers (part_id, number, brand) VALUES (?, ?, ?)');
      for (const alt of interchange_numbers) {
        if (alt && alt.number) insertAlt.run(partId, alt.number, alt.brand || null);
      }
    }

    return partId;
  });

  const partId = createPart();
  const [part] = attachInterchange([db.prepare('SELECT * FROM parts WHERE id = ?').get(partId)]);

  res.status(201).json({ part });
});

// PATCH /api/sellers/me/parts/:id — עדכון כרטיס מוצר קיים (רק של הספק עצמו)
router.patch('/me/parts/:id', requireSellerAuth, (req, res) => {
  const partId = parseInt(req.params.id);
  const current = db.prepare('SELECT * FROM parts WHERE id = ?').get(partId);

  if (!current || current.seller_id !== req.seller.id) {
    return res.status(404).json({ error: 'הכרטיס לא נמצא בקבינט שלך' });
  }

  const { name, sub, category, price, stock, icon, interchange_numbers } = req.body || {};

  db.prepare(
    `UPDATE parts SET name=@name, sub=@sub, category=@category, price=@price, stock=@stock, icon=@icon WHERE id=@id`
  ).run({
    name: name ?? current.name,
    sub: sub ?? current.sub,
    category: category ?? current.category,
    price: price ?? current.price,
    stock: stock ?? current.stock,
    icon: icon ?? current.icon,
    id: partId,
  });

  if (Array.isArray(interchange_numbers)) {
    const replaceAlts = db.transaction(() => {
      db.prepare('DELETE FROM interchange_numbers WHERE part_id = ?').run(partId);
      const insertAlt = db.prepare('INSERT INTO interchange_numbers (part_id, number, brand) VALUES (?, ?, ?)');
      for (const alt of interchange_numbers) {
        if (alt && alt.number) insertAlt.run(partId, alt.number, alt.brand || null);
      }
    });
    replaceAlts();
  }

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
  res.json({ success: true });
});

module.exports = router;
