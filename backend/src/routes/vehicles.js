const express = require('express');
const { VEHICLE_KINDS } = require('../vehicles');

const router = express.Router();

// GET /api/vehicles — סוגי הרכב והיצרנים שלהם, למסננים ולטופס הפוזיציה
router.get('/', (req, res) => {
  res.json({ kinds: VEHICLE_KINDS });
});

module.exports = router;
