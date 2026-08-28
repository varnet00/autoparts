const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/categories
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT DISTINCT category FROM parts ORDER BY category').all();
  res.json({ categories: rows.map((r) => r.category) });
});

module.exports = router;
