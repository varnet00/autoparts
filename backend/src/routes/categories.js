const express = require('express');
const { DEPARTMENTS } = require('../categories');

const router = express.Router();

// GET /api/categories — המחלקות והקטגוריות שלהן.
// המבנה קבוע ולא נגזר מהמלאי: מדף ריק עדיין צריך להופיע בסינון.
router.get('/', (req, res) => {
  res.json({ departments: DEPARTMENTS });
});

module.exports = router;
