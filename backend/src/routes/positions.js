const express = require('express');
const db = require('../db');
const { card, compatibleCards, posStmt } = require('../position-view');

const router = express.Router();

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
