const express = require('express');
const db = require('../db');
const { norm } = require('../catalog');
const { isCategory, isDepartment, categoryIdsOf } = require('../categories');
const { card, compatibleCards } = require('../position-view');

const router = express.Router();

/* GET /api/search?q=04465-02220

   מחזיר רשימה של רשימות ולא רשימה של הצעות: למעלה הפוזיציה שהמק״ט
   שהוקלד שייך לה — היא ושושלת המק״טים שלה — ומתחתיה, תחת הכותרת
   "עשוי להתאים", פוזיציות של מנפיקים אחרים שמפנות לאותו מספר ייחוס.

   ההצעות עצמן אינן כאן בכוונה. היום חיפוש של 04465-02220 מחזיר
   ארבעה כרטיסים שהם בעצם חלק אחד אצל ארבעה מוכרים; ההצעות שייכות
   לתוך מסך הפוזיציה, ושם הן משוות מחיר במקום לשכפל את החלק. */

const exactStmt = db.prepare(
  `SELECT DISTINCT p.*, n.number AS matched
   FROM position_numbers n JOIN positions p ON p.id = n.position_id
   WHERE n.number_norm = ?`
);
/* מק״ט מוקלד חלקית או עם טעות בסוף: 044650222 ימצא את 04465-02220.
   קידומת ולא הכלה — מי שמקליד מק״ט מתחיל מההתחלה שלו. */
const prefixStmt = db.prepare(
  `SELECT DISTINCT p.*, n.number AS matched
   FROM position_numbers n JOIN positions p ON p.id = n.position_id
   WHERE n.number_norm LIKE ? || '%'
   ORDER BY LENGTH(n.number_norm) LIMIT 8`
);
/* חיפוש חופשי — כשלא הוקלד מק״ט אלא שם ("רפידות בלימה"). רק כאן
   המסננים פועלים.

   כשהוקלד מק״ט הם מושתקים בכוונה: מי שהקליד 04465-02220 שאל שאלה
   מדויקת, ומסנן ישן שנשאר פתוח מקודם היה מחביא ממנו בדיוק את מה
   שביקש. "לא נמצא" על מק״ט שכן קיים הוא התשובה הגרועה ביותר שיש. */
function textSearch(q, f) {
  const where = ["(p.name LIKE '%' || @q || '%' OR p.brand LIKE '%' || @q || '%')"];
  const params = { q };
  if (f.department && f.department !== 'all' && isDepartment(f.department)) {
    const ids = categoryIdsOf(f.department);
    where.push(`p.category IN (${ids.map((_, i) => `@d${i}`).join(', ')})`);
    ids.forEach((id, i) => { params[`d${i}`] = id; });
  }
  if (f.category && f.category !== 'all' && isCategory(f.category)) {
    where.push('p.category = @category');
    params.category = f.category;
  }
  const fit = [];
  if (f.vehicle_make && f.vehicle_make !== 'all') { fit.push('vehicle_make = @vmake'); params.vmake = f.vehicle_make; }
  if (f.make_q) { fit.push("vehicle_make LIKE '%' || @mq || '%'"); params.mq = f.make_q; }
  if (f.vehicle_model) { fit.push("vehicle_model LIKE '%' || @vmodel || '%'"); params.vmodel = f.vehicle_model; }
  if (f.vehicle_kind && f.vehicle_kind !== 'all') { fit.push('vehicle_kind = @vkind'); params.vkind = f.vehicle_kind; }
  const y = parseInt(f.year);
  // חלק בלי טווח שנים מתאים לכל השנים, ולכן NULL נחשב פתוח
  if (!Number.isNaN(y)) {
    fit.push('(year_from IS NULL OR year_from <= @year) AND (year_to IS NULL OR year_to >= @year)');
    params.year = y;
  }
  if (fit.length) {
    where.push(`EXISTS (SELECT 1 FROM position_fitment WHERE position_id = p.id AND ${fit.join(' AND ')})`);
  }
  return db
    .prepare(`SELECT DISTINCT p.* FROM positions p WHERE ${where.join(' AND ')} ORDER BY p.id LIMIT 12`)
    .all(params);
}

router.get('/', (req, res) => {
  const raw = String(req.query.q || '').trim();
  if (!raw) return res.status(400).json({ error: 'נא להקליד מק״ט או שם חלק' });
  const nn = norm(raw);

  let rows = nn ? exactStmt.all(nn) : [];
  let mode = 'exact';
  if (!rows.length && nn.length >= 3) { rows = prefixStmt.all(nn); mode = 'prefix'; }
  if (!rows.length) { rows = textSearch(raw, req.query); mode = 'text'; }

  /* כשהמק״ט נמצא, הפוזיציה שלו היא התוצאה הראשונה והיא היחידה
     ב"מדויק" — כל השאר נמצאים מתחת, כמותאמים. שני מנפיקים שונים
     עם אותם ספרות זה מקרה נדיר אבל אפשרי, ואז שניהם למעלה. */
  const exact = rows.map((r) => card(r, r.matched || null));
  const seen = new Set(exact.map((c) => c.id));
  const compatible = [];
  let emptyCount = 0;
  for (const c of exact) {
    const { items, empty } = compatibleCards(c.id);
    emptyCount += empty;
    for (const it of items) if (!seen.has(it.id)) { seen.add(it.id); compatible.push(it); }
  }

  res.json({
    query: { raw, norm: nn, mode },
    exact,
    compatible,
    compatible_without_offers: emptyCount,
  });
});

module.exports = router;
