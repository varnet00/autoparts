/* ================= כרטיס ספק: מה שהחיפוש, המסך והקישור מציגים =============

   ספק אינו רק שם שמתחת למחיר. כשאותו מק״ט מוצע אצל ארבעה, הבחירה
   בין ההצעות היא בחירה בין ספקים — ולכן צריך להיות מקום אחד שאומר
   מי הספק הזה, מה הוא מספק ואיך פונים אליו. הכרטיס נבנה כאן, וגם
   תוצאות החיפוש וגם עמוד הספק מציגים את אותו הדבר. */
const db = require('./db');

/* אימייל הוא שם המשתמש להתחברות לקבינט, ולכן הוא אינו יוצא החוצה
   גם כשהכול מותר. מי שרוצה ליצור קשר מקבל טלפון וואטסאפ. */
function publicSeller(row) {
  if (!row) return null;
  const { password_hash, email, ...rest } = row;
  return rest;
}

// כרטיס ספק כפי שהוא מוצג לספק עצמו בקבינט — האימייל שלו נשאר
function ownSeller(row) {
  if (!row) return null;
  const { password_hash, ...rest } = row;
  return rest;
}

/* מה שהספק מוכר, במספרים. "12 מק״טים" אומר יותר מ"12 מודעות":
   שני כרטיסים של אותו מק״ט הם הצעה אחת מבחינת הקונה. */
const statsStmt = db.prepare(
  `SELECT COUNT(*) AS offers,
          COUNT(DISTINCT position_id) AS positions,
          SUM(CASE WHEN stock = 'in' AND qty > 0 THEN 1 ELSE 0 END) AS in_stock,
          MIN(price) AS min_price
   FROM parts WHERE seller_id = ?`
);
/* המדף של הספק לפי מערכות. אצל ספק עם מאות פריטים "מה עוד יש לו"
   בלי חלוקה הוא גלילה, לא תשובה: הקונה חושב במערכות — בלמים, מתלים,
   חשמל — ורוצה לבחור אחת ולראות מה יש בה. הספירה נשלחת יחד עם
   השמות, כי מסנן שמוביל לרשימה ריקה הוא הבטחה שבורה. */
const catsStmt = db.prepare(
  `SELECT category, COUNT(*) AS n FROM parts WHERE seller_id = ?
   GROUP BY category ORDER BY n DESC, category`
);
const kindsStmt = db.prepare(
  `SELECT kind, COUNT(*) AS n FROM parts WHERE seller_id = ? GROUP BY kind ORDER BY n DESC`
);

function sellerStats(id) {
  const s = statsStmt.get(id) || {};
  return {
    offers: s.offers || 0,
    positions: s.positions || 0,
    in_stock: s.in_stock || 0,
    min_price: s.min_price === null || s.min_price === undefined ? null : Math.round(s.min_price),
    categories: catsStmt.all(id).map((c) => ({ id: c.category, n: c.n })),
    kinds: kindsStmt.all(id).map((k) => k.kind),
  };
}

function sellerCard(row) {
  if (!row) return null;
  return { ...publicSeller(row), stats: sellerStats(row.id) };
}

/* חיפוש ספקים לצד חיפוש חלקים. מי שמקליד "פירוקים אשדוד" מחפש עסק
   ולא מק״ט, ועד היום קיבל "לא נמצא" — כי חיפשנו רק בקטלוג.

   העיר נכללת בכוונה: "אשדוד" היא שאלה לגיטימית של קונה שרוצה לאסוף
   בעצמו. מק״ט לעולם לא ייתפס כאן, ולכן החיפוש הזה יכול לרוץ תמיד
   בלי להרעיש על חיפוש מספרים. */
/* INSTR ולא LIKE: ב-LIKE הסימנים % ו-_ הם תווי חיפוש, וחיפוש של
   "%" היה מחזיר את כל הספקים כאילו זו תשובה. */
const searchStmt = db.prepare(
  `SELECT * FROM sellers
   WHERE INSTR(UPPER(name), UPPER(@q)) > 0
      OR INSTR(UPPER(city), UPPER(@q)) > 0
      OR INSTR(UPPER(supplies), UPPER(@q)) > 0
   ORDER BY (INSTR(UPPER(name), UPPER(@q)) = 1) DESC, verified DESC, rating DESC
   LIMIT @limit`
);

function searchSellers(q, limit = 4) {
  const raw = String(q || '').trim();
  // שתי אותיות עדיין אינן שם עסק, והן היו מחזירות את כל הרשימה
  if (raw.length < 2) return [];
  return searchStmt.all({ q: raw, limit }).map(sellerCard);
}

module.exports = { publicSeller, ownSeller, sellerCard, sellerStats, searchSellers };
