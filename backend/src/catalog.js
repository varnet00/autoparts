/* ============ שכבת הקטלוג: מק״ט, פוזיציה, מחלקת התאמה ============

   עד כאן שורה ב-parts שיחקה שלושה תפקידים בבת אחת: הצעה של מוכר,
   רשומת קטלוג ורשימת מספרים חופפים. אי אפשר היה להבדיל בין "אותו
   מנפיק מספר, מק״ט מעודכן" לבין "יצרן אחר שמתאים" — וזה בדיוק
   ההבדל שהמסך של החיפוש בנוי עליו.

   פוזיציה = שושלת מק״טים של מנפיק אחד. טויוטה שינתה 04465-02220
   ל-04465-YZZQ7 — זו לא פוזיציה חדשה, זה מק״ט נוסף לאותה פוזיציה.
   מי שמייצר את הסחורה בקופסה (ADVICS, טויוטה מקורי, פירוק) הוא
   תכונה של ההצעה ולא של הפוזיציה: כולם מוכרים את אותו מק״ט.

   מחלקת התאמה = פוזיציית העוגן וכל מי שמפנה אליה. היא אינה טבלה
   בפני עצמה אלא נגזרת: לטבלה מפורשת יש מחיר תפעולי — מחלקות צריך
   לאחד ולפצל ביד, ובלי צורך מוכח זה עודף.

   הכול נגזר מ-interchange_numbers בקוד אחד, ולכן מסד קיים שעובר
   מיגרציה ומסד טרי מהזרעים מגיעים בדיוק לאותה תוצאה. */

/* אנשים מקלידים 04465-02220, 0446502220 ו-04465 02220 — זה חייב
   להיות אותו חיפוש. שומרים גם את הצורה המודפסת וגם את המנורמלת. */
function norm(value) {
  return String(value == null ? '' : value).toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/* המותג בשדה brand נכתב בכמה צורות לאותו מנפיק: "OEM Toyota",
   "Toyota Genuine" ו-"TOYOTA GENUINE" הם טויוטה. בלי איחוד היו
   נוצרות שלוש פוזיציות נפרדות לאותה שושלת מק״טים. */
const BRAND_ALIASES = {
  TOYOTA: 'Toyota', LEXUS: 'Lexus', HYUNDAI: 'Hyundai', KIA: 'Kia',
  HONDA: 'Honda', FORD: 'Ford', SKODA: 'Skoda', VOLKSWAGEN: 'Volkswagen',
  VW: 'Volkswagen', MANNFILTER: 'Mann-Filter', MANN: 'Mann-Filter',
  MAHLE: 'Mahle', TRW: 'TRW', BREMBO: 'Brembo', BENDIX: 'Bendix',
  BOSCH: 'Bosch', DELPHI: 'Delphi', MONROE: 'Monroe', BILSTEIN: 'Bilstein',
  GATES: 'Gates', FEBEST: 'Febest', HELLA: 'Hella', OSRAM: 'Osram',
  VARTA: 'Varta', MOTUL: 'Motul', CASTROL: 'Castrol', MOBIL1: 'Mobil 1',
  TOTAL: 'Total', SONAX: 'Sonax', MICHELIN: 'Michelin', ALCAR: 'Alcar',
  STANLEY: 'Stanley', UNICRAFT: 'Unicraft', PIONEER: 'Pioneer',
  BASEUS: 'Baseus', '70MAI': '70mai', UNIVERSAL: 'Universal',
};

function canonBrand(raw) {
  const cleaned = String(raw == null ? '' : raw)
    .replace(/\bOEM\b/gi, '')
    .replace(/\bGENUINE\b/gi, '')
    .replace(/\bORIGINAL\b/gi, '')
    .trim();
  if (!cleaned) return null;
  const key = cleaned.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return BRAND_ALIASES[key] || cleaned;
}

/* שדה maker תיאר לפעמים מצב ולא יצרן ("USED · 60%"). ערך כזה אינו
   מנפיק מק״טים, ופוזיציה שתיבנה ממנו היא זבל. */
function makerBrand(raw) {
  const s = String(raw == null ? '' : raw).trim();
  if (!s || /^USED\b/i.test(s) || /\d\s*%/.test(s)) return null;
  return canonBrand(s);
}

/* מצב בפרוצנטים הוא תכונה של חלק משומש בלבד. חלק חדש במצב 80%
   הוא סתירה, ולכן הערך נמחק ולא "מתוקן" בשקט לערך אחר. */
function conditionOf(kind, value) {
  if (kind !== 'used') return null;
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return null;
  return Math.min(100, Math.max(10, n));
}

const SCHEMA = `
  -- פוזיציה: שושלת מק״טים של מנפיק אחד
  CREATE TABLE IF NOT EXISTS positions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand TEXT NOT NULL,
    name TEXT,
    category TEXT,
    -- מספר הייחוס של המחלקה: המק״ט של יצרן הרכב, ובמדפים שאין בהם
    -- יצרן רכב (מצברים, נורות) התקן שכולם מפנים אליו
    is_anchor INTEGER NOT NULL DEFAULT 0
  );

  -- כל המק״טים שבהם נקראה אותה פוזיציה. הכיוון של ההחלפה אינו
  -- נגזר מהנתונים שיש היום, ולכן אין כאן "ישן/חדש" אלא ראשי וחלופי:
  -- ראשי הוא זה שהשוק בפועל משתמש בו.
  CREATE TABLE IF NOT EXISTS position_numbers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    position_id INTEGER NOT NULL REFERENCES positions(id) ON DELETE CASCADE,
    number TEXT NOT NULL,
    number_norm TEXT NOT NULL,
    is_primary INTEGER NOT NULL DEFAULT 0,
    UNIQUE (position_id, number_norm)
  );

  -- "הפוזיציה הזאת מחליפה את מספר הייחוס ההוא" — מזה נבנה "עשוי להתאים"
  CREATE TABLE IF NOT EXISTS oe_refs (
    position_id INTEGER NOT NULL REFERENCES positions(id) ON DELETE CASCADE,
    anchor_id INTEGER NOT NULL REFERENCES positions(id) ON DELETE CASCADE,
    PRIMARY KEY (position_id, anchor_id)
  );

  -- ההתאמה לרכב עולה מההצעה לפוזיציה: שני מוכרים של אותו חלק לא
  -- אמורים לחלוק על השאלה על איזה רכב הוא עולה
  CREATE TABLE IF NOT EXISTS position_fitment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    position_id INTEGER NOT NULL REFERENCES positions(id) ON DELETE CASCADE,
    vehicle_kind TEXT, vehicle_make TEXT, vehicle_model TEXT,
    year_from INTEGER, year_to INTEGER
  );

  CREATE INDEX IF NOT EXISTS idx_posnum_norm ON position_numbers(number_norm);
  CREATE INDEX IF NOT EXISTS idx_posnum_pos ON position_numbers(position_id);
  CREATE INDEX IF NOT EXISTS idx_oeref_anchor ON oe_refs(anchor_id);
  CREATE INDEX IF NOT EXISTS idx_fitment_pos ON position_fitment(position_id);
`;

/* בנייה מחדש של הקטלוג מתוך ההצעות והמספרים החופפים.

   האיחוד חייב להיות טרנזיטיבי: אם הצעה א׳ מחברת שני מק״טים של
   טויוטה, והצעה ב׳ מחברת אחד מהם למק״ט שלישי — שלושתם פוזיציה
   אחת. לכן קודם אוספים קבוצות במבנה union-find ורק אחר כך כותבים
   שורות, במקום ליצור פוזיציה בכל שורה ולנסות לאחד אחרי מעשה. */
function rebuildCatalog(db) {
  const parts = db.prepare('SELECT * FROM parts').all();
  const nums = db.prepare('SELECT * FROM interchange_numbers').all();
  const byPart = new Map();
  for (const n of nums) {
    if (!byPart.has(n.part_id)) byPart.set(n.part_id, []);
    byPart.get(n.part_id).push(n);
  }

  /* מי הנפיק את המספר, כשהמוכר לא אמר.

     טופס הפרסום אינו שואל מי הנפיק כל מק״ט חלופי, ובצדק: זו שאלה
     שקשה לענות עליה נכון ואי אפשר לסמוך על התשובה. בלי המידע הזה
     כל הצעה של מוכר הייתה נוחתת בפוזיציה נפרדת משלה ולא מצטרפת
     לקיימת — כלומר הקטלוג היה עובד רק על נתוני הזרעים.

     המספר עצמו עונה על השאלה: אם הקטלוג כבר מכיר אותו, הוא מכיר גם
     את המנפיק. לומדים מכל מי שכן ציין מותג, וגם מהקטלוג הקודם — כדי
     שמותג שנלמד פעם לא ייעלם כשההצעה היחידה שציינה אותו נמחקת. */
  const brandOfNumber = new Map();
  for (const r of db.prepare(
    'SELECT p.brand, n.number_norm FROM position_numbers n JOIN positions p ON p.id = n.position_id'
  ).all()) {
    if (r.brand !== 'ללא יצרן') brandOfNumber.set(r.number_norm, r.brand);
  }
  for (const n of nums) {
    const b = canonBrand(n.brand);
    if (b) brandOfNumber.set(norm(n.number), b);
  }
  for (const p of parts) {
    const b = makerBrand(p.maker);
    if (b && !brandOfNumber.has(norm(p.part_no))) brandOfNumber.set(norm(p.part_no), b);
  }
  const brandOf = (raw, number) => canonBrand(raw) || brandOfNumber.get(norm(number)) || null;

  const parent = new Map();
  function find(k) {
    if (!parent.has(k)) { parent.set(k, k); return k; }
    let r = k;
    while (parent.get(r) !== r) r = parent.get(r);
    while (parent.get(k) !== r) { const nx = parent.get(k); parent.set(k, r); k = nx; }
    return r;
  }
  function union(a, b) { const ra = find(a), rb = find(b); if (ra !== rb) parent.set(ra, rb); }
  const key = (brand, n) => `${brand} ${n}`;

  // המידע שנאסף לכל מפתח: הצורה המודפסת, כמה הצעות משתמשות בו,
  // והאם הוא סומן כמספר הייחוס
  const info = new Map();
  function touch(brand, number, { printed, anchor, used }) {
    const nn = norm(number);
    if (!brand || !nn) return null;
    const k = key(brand, nn);
    find(k);
    const cur = info.get(k) || { brand, norm: nn, printed, anchor: 0, used: 0 };
    if (printed && printed.length > (cur.printed || '').length) cur.printed = printed;
    if (anchor) cur.anchor = 1;
    if (used) cur.used += used;
    info.set(k, cur);
    return k;
  }

  // מה שכל הצעה תורמת: קבוצת מק״טים לפי מנפיק, ומי העוגן שלה
  const partPlan = [];
  for (const p of parts) {
    const rows = byPart.get(p.id) || [];
    const groups = new Map();          // brand -> [{number, is_oem}]
    for (const r of rows) {
      const b = brandOf(r.brand, r.number);
      if (!b || !norm(r.number)) continue;
      if (!groups.has(b)) groups.set(b, []);
      groups.get(b).push(r);
    }
    // המק״ט שההצעה מפורסמת תחתיו חייב להיות בקטלוג גם אם הוא לא
    // הופיע ברשימת המספרים החופפים — אחרת ההצעה תישאר בלי פוזיציה
    const ownBrand = [...groups.entries()]
      .find(([, rs]) => rs.some((r) => norm(r.number) === norm(p.part_no)));
    let listedBrand = ownBrand ? ownBrand[0]
      : (brandOfNumber.get(norm(p.part_no)) || makerBrand(p.maker));
    if (!listedBrand) listedBrand = 'ללא יצרן';
    if (!groups.has(listedBrand)) groups.set(listedBrand, []);
    if (!groups.get(listedBrand).some((r) => norm(r.number) === norm(p.part_no))) {
      groups.get(listedBrand).push({ number: p.part_no, brand: listedBrand, is_oem: 0 });
    }

    let anchorKey = null;
    const keys = [];
    for (const [brand, rs] of groups) {
      let first = null;
      for (const r of rs) {
        const k = touch(brand, r.number, {
          printed: r.number,
          anchor: r.is_oem ? 1 : 0,
          used: norm(r.number) === norm(p.part_no) ? 1 : 0,
        });
        if (!k) continue;
        if (first) union(first, k); else first = k;   // אותו מנפיק — אותה פוזיציה
        if (r.is_oem) anchorKey = k;
      }
      if (first) keys.push({ brand, key: first });
    }
    partPlan.push({
      part: p,
      listedKey: touch(listedBrand, p.part_no, { printed: p.part_no, used: 0 }),
      anchorKey,
      keys,
    });
  }

  // מדף בלי מק״ט יצרן רכב (מצברים, כימיה) — אין לו עוגן טבעי, ואז
  // "עשוי להתאים" יישאר ריק. זה נכון: אין למה להפנות.
  /* בנייה מחדש חייבת לשמור מזהים. מוכר שמוסיף הצעה מפעיל בנייה
     מחדש, ואם הפוזיציות היו מקבלות מזהים חדשים — קונה שכרטיס פתוח
     אצלו היה מוצא פתאום חלק אחר. לכן קבוצה שאחד ממק״טיה כבר היה
     בקטלוג יורשת את המזהה שלו. */
  const oldId = new Map();
  for (const r of db.prepare(
    'SELECT p.brand, n.number_norm, n.position_id FROM position_numbers n JOIN positions p ON p.id = n.position_id'
  ).all()) oldId.set(key(r.brand, r.number_norm), r.position_id);

  const write = db.transaction(() => {
    db.prepare('DELETE FROM position_fitment').run();
    db.prepare('DELETE FROM oe_refs').run();
    db.prepare('DELETE FROM position_numbers').run();
    db.prepare('DELETE FROM positions').run();
    db.prepare("DELETE FROM sqlite_sequence WHERE name IN ('position_numbers','position_fitment')").run();

    const roots = new Map();                       // root -> [keys]
    for (const k of info.keys()) {
      const r = find(k);
      if (!roots.has(r)) roots.set(r, []);
      roots.get(r).push(k);
    }

    const insPos = db.prepare('INSERT INTO positions (brand, name, category, is_anchor) VALUES (?, ?, ?, ?)');
    const insPosId = db.prepare('INSERT INTO positions (id, brand, name, category, is_anchor) VALUES (?, ?, ?, ?, ?)');
    const takenIds = new Set();
    const insNum = db.prepare(
      'INSERT OR IGNORE INTO position_numbers (position_id, number, number_norm, is_primary) VALUES (?, ?, ?, ?)'
    );
    const posOf = new Map();                       // key -> position_id

    for (const [root, keys] of roots) {
      const items = keys.map((k) => info.get(k));
      const brand = items[0].brand;
      const anchor = items.some((i) => i.anchor) ? 1 : 0;
      // המק״ט הראשי הוא זה שהשוק משתמש בו בפועל: הכי הרבה הצעות
      // מפורסמות תחתיו. שוויון נשבר לטובת מספר הייחוס.
      const primary = items.slice().sort(
        (a, b) => b.used - a.used || b.anchor - a.anchor || a.norm.localeCompare(b.norm)
      )[0];
      // אם אחד המק״טים כבר היה בקטלוג — יורשים את מזהה הפוזיציה שלו
      let keep = null;
      for (const it of items) {
        const prev = oldId.get(key(it.brand, it.norm));
        if (prev && !takenIds.has(prev)) { keep = prev; break; }
      }
      const id = keep
        ? (takenIds.add(keep), insPosId.run(keep, brand, null, null, anchor), keep)
        : insPos.run(brand, null, null, anchor).lastInsertRowid;
      for (const it of items) {
        insNum.run(id, it.printed || it.norm, it.norm, it === primary ? 1 : 0);
        posOf.set(key(it.brand, it.norm), id);
      }
      posOf.set(root, id);
    }

    // שם וקטגוריה לפוזיציה נלקחים מההצעה שמפורסמת תחתיה: היא
    // מתארת את החלק, לא את הקופסה של מוכר מסוים
    const setMeta = db.prepare(
      'UPDATE positions SET name = COALESCE(name, ?), category = COALESCE(category, ?) WHERE id = ?'
    );
    const setPart = db.prepare('UPDATE parts SET position_id = ? WHERE id = ?');
    const insRef = db.prepare('INSERT OR IGNORE INTO oe_refs (position_id, anchor_id) VALUES (?, ?)');
    const insFit = db.prepare(
      `INSERT INTO position_fitment (position_id, vehicle_kind, vehicle_make, vehicle_model, year_from, year_to)
       VALUES (?, ?, ?, ?, ?, ?)`
    );
    const seenFit = new Set();

    for (const plan of partPlan) {
      const pid = plan.listedKey ? posOf.get(plan.listedKey) : null;
      setPart.run(pid || null, plan.part.id);
      if (!pid) continue;
      setMeta.run(plan.part.name, plan.part.category, pid);

      const anchorId = plan.anchorKey ? posOf.get(plan.anchorKey) : null;
      if (anchorId) {
        for (const { key: k } of plan.keys) {
          const other = posOf.get(k);
          if (other && other !== anchorId) insRef.run(other, anchorId);
        }
      }

      if (plan.part.vehicle_make || plan.part.vehicle_model) {
        const fk = [pid, plan.part.vehicle_kind, plan.part.vehicle_make,
                    plan.part.vehicle_model, plan.part.year_from, plan.part.year_to].join('|');
        if (!seenFit.has(fk)) {
          seenFit.add(fk);
          insFit.run(pid, plan.part.vehicle_kind, plan.part.vehicle_make,
                     plan.part.vehicle_model, plan.part.year_from, plan.part.year_to);
        }
      }
    }
  });
  write();
  return db.prepare('SELECT COUNT(*) AS n FROM positions').get().n;
}

module.exports = { norm, canonBrand, makerBrand, conditionOf, rebuildCatalog, SCHEMA };
