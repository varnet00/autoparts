const express = require('express');
const db = require('../db');
const { norm } = require('../catalog');
const { card, compatibleCards, filterSql } = require('../position-view');

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
  const { where, params } = filterSql(f);
  where.unshift("(p.name LIKE '%' || @q || '%' OR p.brand LIKE '%' || @q || '%')");
  params.q = q;
  return db
    .prepare(`SELECT DISTINCT p.* FROM positions p WHERE ${where.join(' AND ')} ORDER BY p.id LIMIT 12`)
    .all(params);
}

/* האם הוקלד מק״ט ולא שם. כשחיפוש של מק״ט לא מצא כלום, "לא נמצא"
   לבדו הוא מבוי סתום: צריך להציע לבדוק את המספר או לפנות לספקים.
   בחיפוש לפי שם אותה הודעה הייתה מיותרת. */
function numberish(raw) {
  const nn = norm(raw);
  return nn.length >= 4 && /\d/.test(nn);
}

router.get('/', (req, res) => {
  const raw = String(req.query.q || '').trim();
  if (!raw) return res.status(400).json({ error: 'נא להקליד מק״ט או שם חלק' });
  const nn = norm(raw);

  let rows = nn ? exactStmt.all(nn) : [];
  let mode = 'exact';
  if (!rows.length && nn.length >= 3) { rows = prefixStmt.all(nn); mode = 'prefix'; }
  if (!rows.length) { rows = textSearch(raw, req.query); mode = 'text'; }

  const found = rows.map((r) => card(r, r.matched || null));

  /* "עשוי להתאים" נמדד תמיד ביחס למק״ט אחד. בחיפוש לפי שם אין מק״ט
     כזה, ולכן אין למה למדוד: חיפוש "TRW" היה מחזיר רפידות לטויוטה
     ודיסק להיונדאי תחת אותה כותרת, ומי שקורא אותה שואל בצדק —
     מתאים למה? לכן בחיפוש לפי שם התוצאות הן רשימה אחת ותו לא. */
  if (mode === 'text') {
    return res.json({
      query: { raw, norm: nn, mode, numberish: numberish(raw) },
      exact: found, compatible: [], compatible_without_offers: 0,
    });
  }

  /* כשהמק״ט נמצא, הפוזיציה שלו היא התוצאה הראשונה והיא היחידה
     ב"מדויק" — כל השאר נמצאים מתחת, כמותאמים. שני מנפיקים שונים
     עם אותם ספרות זה מקרה נדיר אבל אפשרי, ואז שניהם למעלה. */
  const seen = new Set(found.map((c) => c.id));
  const compatible = [];
  let emptyCount = 0;
  for (const c of found) {
    const { items, empty } = compatibleCards(c.id);
    emptyCount += empty;
    for (const it of items) if (!seen.has(it.id)) { seen.add(it.id); compatible.push(it); }
  }

  res.json({
    query: { raw, norm: nn, mode, numberish: numberish(raw) },
    exact: found,
    compatible,
    compatible_without_offers: emptyCount,
  });
});

module.exports = router;
