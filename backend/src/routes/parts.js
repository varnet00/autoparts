const express = require('express');
const db = require('../db');

const router = express.Router();

function attachSellerAndInterchange(parts) {
  const sellerStmt = db.prepare('SELECT id, name, city, phone, whatsapp, rating, reviews_count, verified FROM sellers WHERE id = ?');
  const interchangeStmt = db.prepare('SELECT id, number, brand FROM interchange_numbers WHERE part_id = ?');

  return parts.map((part) => ({
    ...part,
    seller: part.seller_id ? sellerStmt.get(part.seller_id) : null,
    interchange_numbers: interchangeStmt.all(part.id),
  }));
}

// GET /api/parts?category=brakes&q=בלם&page=1&limit=20
router.get('/', (req, res) => {
  const { category, q } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
  const offset = (page - 1) * limit;

  let where = [];
  let params = {};

  if (category && category !== 'all') {
    where.push('category = @category');
    params.category = category;
  }
  if (q) {
    where.push(`(
      name LIKE @q OR sub LIKE @q OR part_no LIKE @q
      OR id IN (SELECT part_id FROM interchange_numbers WHERE number LIKE @q)
    )`);
    params.q = `%${q}%`;
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const total = db.prepare(`SELECT COUNT(*) AS count FROM parts ${whereClause}`).get(params).count;

  const rows = db
    .prepare(`SELECT * FROM parts ${whereClause} ORDER BY id ASC LIMIT @limit OFFSET @offset`)
    .all({ ...params, limit, offset });

  const items = attachSellerAndInterchange(rows);

  res.json({
    items,
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

module.exports = router;
