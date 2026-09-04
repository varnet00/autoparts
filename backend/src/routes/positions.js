const express = require('express');
const db = require('../db');
const { card, compatibleCards, posStmt, filterSql } = require('../position-view');

const router = express.Router();

/* GET /api/positions — דפדוף במדפים, גם הוא בפוזיציות.

   קודם החיפוש החזיר פוזיציות והדפדוף החזיר הצעות, ואותו חלק הופיע
   במדף ארבע פעמים אצל ארבעה מוכרים. זו בדיוק התקלה שהחיפוש תוקן
   בגללה, רק בכניסה השנייה. עכשיו יש מודל אחד: בכל מקום שבו רואים
   רשימה של חלקים — רואים מק״טים, וההשוואה בין מוכרים בתוך המק״ט.

   פוזיציה בלי הצעות אינה במדף: אין מה לקנות בה. */
router.get('/', (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 30, 1), 100);
  const { where, params } = filterSql(req.query);
  where.push('EXISTS (SELECT 1 FROM parts WHERE position_id = p.id)');
  const clause = `WHERE ${where.join(' AND ')}`;

  const total = db.prepare(`SELECT COUNT(*) AS n FROM positions p ${clause}`).get(params).n;
  /* סדר: קודם מה שיש במלאי, אחר כך מה שיש לו יותר ספקים — שם יש מה
     להשוות — ובתוך זה הזול. מק״ט שאין לו מלאי יורד למטה ולא נעלם:
     לפעמים דווקא הוא המספר הנכון לפנות איתו. */
  const rows = db
    .prepare(
      `SELECT p.*,
              (SELECT COUNT(*) FROM parts WHERE position_id = p.id) AS n_offers,
              (SELECT COUNT(*) FROM parts WHERE position_id = p.id AND stock = 'in' AND qty > 0) AS n_stock,
              (SELECT MIN(price) FROM parts WHERE position_id = p.id) AS min_price
       FROM positions p ${clause}
       ORDER BY (n_stock > 0) DESC, n_offers DESC, min_price ASC, p.id
       LIMIT @limit OFFSET @offset`
    )
    .all({ ...params, limit, offset: (page - 1) * limit });

  res.json({
    items: rows.map((r) => card(r)),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

/* GET /api/positions/:id — התמצית שבראש המסך.
   נפרד מרשימת המוכרים בכוונה: התמצית מגיעה מיד ונצבעת, והמוכרים
   נטענים בעמודים. אצל פוזיציה מבוקשת יש הרבה מוכרים, וראש המסך
   לא אמור לחכות להם. */
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'מזהה לא תקין' });
  const pos = posStmt.get(id);
  if (!pos) return res.status(404).json({ error: 'הפוזיציה לא נמצאה' });
  const { items, empty } = compatibleCards(id);
  res.json({ position: card(pos), compatible: items, compatible_without_offers: empty });
});

const sellerStmt = db.prepare(
  'SELECT id, name, city, phone, whatsapp, rating, reviews_count, verified FROM sellers WHERE id = ?'
);

/* GET /api/positions/:id/offers — כרטיסי המוכרים.
   סדר: קודם מה שיש במלאי, ובתוך זה הזול ביותר. מוכר שאזל מהמלאי
   אינו נעלם — הוא יורד למטה, כי לפעמים דווקא הוא המספר הנכון
   ליצור איתו קשר. */
router.get('/:id/offers', (req, res) => {
  const id = parseInt(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'מזהה לא תקין' });
  if (!posStmt.get(id)) return res.status(404).json({ error: 'הפוזיציה לא נמצאה' });

  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
  const total = db.prepare('SELECT COUNT(*) AS n FROM parts WHERE position_id = ?').get(id).n;
  const rows = db
    .prepare(
      `SELECT * FROM parts WHERE position_id = @id
       ORDER BY (stock = 'in' AND qty > 0) DESC, price ASC, id ASC
       LIMIT @limit OFFSET @offset`
    )
    .all({ id, limit, offset: (page - 1) * limit });

  res.json({
    offers: rows.map((p) => ({ ...p, seller: p.seller_id ? sellerStmt.get(p.seller_id) : null })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

module.exports = router;
