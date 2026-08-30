const express = require('express');
const db = require('../db');
const { VEHICLE_KINDS, isKind } = require('../vehicles');
const { modelsFor } = require('../vehicle-models');

const router = express.Router();

// GET /api/vehicles — סוגי הרכב והיצרנים שלהם, למסננים ולטופס הפוזיציה
router.get('/', (req, res) => {
  res.json({ kinds: VEHICLE_KINDS });
});

// GET /api/vehicles/models?kind=car&make=Toyota — הדגמים של אותו יצרן.
// הרשימה הקבועה קודמת, ומה שמוכרים כבר הקלידו ואינו בה נוסף בסוף,
// כדי שדגם נדיר שכבר במלאי לא ייעלם מהסינון.
router.get('/models', (req, res) => {
  const { kind, make } = req.query;
  if (kind && !isKind(kind)) return res.status(400).json({ error: 'סוג רכב לא תקין' });
  if (!make) return res.json({ models: [] });

  const known = kind ? modelsFor(kind, make) : [];
  const rows = db
    .prepare(
      `SELECT DISTINCT vehicle_model AS model FROM parts
       WHERE vehicle_make = @make AND vehicle_model IS NOT NULL AND TRIM(vehicle_model) != ''
         AND (@kind IS NULL OR vehicle_kind = @kind)
       ORDER BY vehicle_model LIMIT 60`
    )
    .all({ make, kind: kind || null });

  const seen = new Set(known.map((m) => m.toLowerCase()));
  const extra = rows.map((r) => r.model).filter((m) => !seen.has(m.toLowerCase()));

  res.json({ models: [...known, ...extra] });
});

module.exports = router;
