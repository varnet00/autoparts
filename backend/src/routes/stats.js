const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/stats — המספרים שמופיעים במסך הבית
router.get('/', (req, res) => {
  const parts = db.prepare('SELECT COUNT(*) AS c FROM parts').get().c;
  const numbers = db.prepare('SELECT COUNT(DISTINCT number) AS c FROM interchange_numbers').get().c;
  const sellers = db.prepare('SELECT COUNT(*) AS c FROM sellers WHERE verified = 1').get().c;
  res.json({ parts, numbers, verified_sellers: sellers });
});

module.exports = router;
