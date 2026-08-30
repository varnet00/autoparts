const express = require('express');
const { PART_CATEGORIES } = require('../categories');

const router = express.Router();

// GET /api/categories — קטגוריות החלקים והתוויות שלהן.
// הרשימה קבועה ולא נגזרת מהמלאי: קטגוריה ריקה עדיין צריכה להופיע בסינון.
router.get('/', (req, res) => {
  res.json({ categories: PART_CATEGORIES });
});

module.exports = router;
