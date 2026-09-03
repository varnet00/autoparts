/* ============ כרטיס פוזיציה: מה שהחיפוש ומסך הפוזיציה מציגים ============

   הכרטיס נבנה במקום אחד, ולכן מה שרואים בתוצאות החיפוש ומה שרואים
   בראש מסך הפוזיציה תמיד מספרים את אותו הדבר. אם המחיר הממוצע היה
   מחושב פעמיים, מספיק תיקון בצד אחד כדי שהמסכים יסתרו זה את זה. */
const db = require('./db');

const numsStmt = db.prepare(
  'SELECT number, is_primary FROM position_numbers WHERE position_id = ? ORDER BY is_primary DESC, number'
);
const fitStmt = db.prepare(
  `SELECT vehicle_kind, vehicle_make, vehicle_model, year_from, year_to
   FROM position_fitment WHERE position_id = ? ORDER BY id`
);
/* המלאי נספר בנפרד מהמחיר: מוכר עם 0 יחידות עדיין מראה מחיר, אבל
   הוא אינו "יש במלאי", ולערבב את השניים יבטיח לקונה מה שאין. */
const statsStmt = db.prepare(
  `SELECT COUNT(*) AS offers,
          SUM(CASE WHEN stock = 'in' AND qty > 0 THEN 1 ELSE 0 END) AS in_stock,
          MIN(price) AS min, MAX(price) AS max, AVG(price) AS avg
   FROM parts WHERE position_id = ?`
);
/* פילוח לפי סוג. ממוצע אחד על חדש מקורי ועל פירוק נותן מחיר שאיש
   אינו מוכר בו, ולכן הפילוח נשלח תמיד — המסך מחליט מה להראות. */
const kindStmt = db.prepare(
  `SELECT kind, COUNT(*) AS offers, MIN(price) AS min, AVG(price) AS avg
   FROM parts WHERE position_id = ? GROUP BY kind ORDER BY MIN(price)`
);

function money(v) {
  return v === null || v === undefined ? null : Math.round(v);
}

/* שנים מוצגות כטווח אחד: 2016—2023 ולא שתי שורות זהות שנבדלות
   רק בדגם. מי שמחפש רוצה לדעת אם רכבו בפנים, לא לקרוא טבלה. */
function fitLine(rows) {
  if (!rows.length) return null;
  const seen = new Set();
  const out = [];
  for (const r of rows) {
    const model = [r.vehicle_make, r.vehicle_model].filter(Boolean).join(' ');
    if (!model) continue;
    const years = r.year_from || r.year_to
      ? ` · ${r.year_from || ''}—${r.year_to || ''}`.replace('—undefined', '')
      : '';
    const line = model + years;
    if (seen.has(line)) continue;
    seen.add(line);
    out.push(line);
  }
  return out.length ? out : null;
}

function card(pos, matchedNumber) {
  const nums = numsStmt.all(pos.id);
  const primary = nums.find((n) => n.is_primary) || nums[0];
  const stats = statsStmt.get(pos.id) || {};
  return {
    id: pos.id,
    brand: pos.brand,
    name: pos.name,
    category: pos.category,
    is_anchor: !!pos.is_anchor,
    number: primary ? primary.number : null,
    aka: nums.filter((n) => !n.is_primary).map((n) => n.number),
    matched_number: matchedNumber || null,
    fits: fitLine(fitStmt.all(pos.id)),
    offers: stats.offers || 0,
    in_stock: stats.in_stock || 0,
    price: stats.offers
      ? { min: money(stats.min), avg: money(stats.avg), max: money(stats.max) }
      : null,
    by_kind: kindStmt.all(pos.id).map((k) => ({
      kind: k.kind, offers: k.offers, min: money(k.min), avg: money(k.avg),
    })),
  };
}

const posStmt = db.prepare('SELECT * FROM positions WHERE id = ?');

/* "עשוי להתאים": פוזיציות של מנפיקים אחרים שמפנות לאותו מספר ייחוס.
   מחפשים לשני הכיוונים — גם כשנכנסו מהעוגן וגם כשנכנסו מחלופה,
   ואז האחיות שלה נמצאות דרך העוגן המשותף. */
const anchorsOf = db.prepare('SELECT anchor_id FROM oe_refs WHERE position_id = ?');
const childrenOf = db.prepare('SELECT position_id FROM oe_refs WHERE anchor_id = ?');

function compatibleIds(positionId) {
  const ids = new Set();
  for (const r of childrenOf.all(positionId)) ids.add(r.position_id);
  for (const a of anchorsOf.all(positionId)) {
    ids.add(a.anchor_id);
    for (const r of childrenOf.all(a.anchor_id)) ids.add(r.position_id);
  }
  ids.delete(positionId);
  return [...ids];
}

/* פוזיציה בלי אף הצעה היא מבוי סתום: הקונה נכנס ומוצא מסך ריק.
   לכן היא אינה ברשימה, אבל היא נספרת — "עוד 2 מק״טים מתאימים ואף
   אחד לא מוכר אותם כרגע" זה מידע, בניגוד לכרטיס שאי אפשר לקנות בו. */
function compatibleCards(positionId) {
  const cards = compatibleIds(positionId).map((id) => card(posStmt.get(id)));
  const live = cards.filter((c) => c.offers > 0);
  live.sort((a, b) => (b.in_stock > 0) - (a.in_stock > 0) || a.price.min - b.price.min);
  return { items: live, empty: cards.length - live.length };
}

module.exports = { card, compatibleCards, compatibleIds, posStmt };
