const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_PATH = process.env.DB_PATH || './data/autoparts.db';

const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// --- סכימה ---
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sellers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT UNIQUE,
    password_hash TEXT,
    rating REAL NOT NULL DEFAULT 5.0,
    reviews_count INTEGER NOT NULL DEFAULT 0,
    verified INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- מק״ט אינו ייחודי גלובלית: אותו חלק מוצע במקביל על ידי כמה מוכרים,
  -- וזה בדיוק מה שמאפשר להשוות מחירים. הייחודיות היא בתוך המוכר.
  CREATE TABLE IF NOT EXISTS parts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sub TEXT,
    category TEXT NOT NULL,
    part_no TEXT NOT NULL,
    price INTEGER NOT NULL,
    stock TEXT NOT NULL DEFAULT 'in',
    icon TEXT DEFAULT '🔧',
    seller_id INTEGER REFERENCES sellers(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (seller_id, part_no)
  );

  CREATE TABLE IF NOT EXISTS interchange_numbers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    part_id INTEGER NOT NULL REFERENCES parts(id) ON DELETE CASCADE,
    number TEXT NOT NULL,
    brand TEXT
  );

  CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    buyer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id INTEGER NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    part_id INTEGER REFERENCES parts(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (buyer_id, seller_id, part_id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_role TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS order_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    part_id INTEGER REFERENCES parts(id) ON DELETE SET NULL,
    part_no TEXT,
    qty INTEGER NOT NULL DEFAULT 1,
    vehicle TEXT,
    status TEXT NOT NULL DEFAULT 'sent',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_interchange_number ON interchange_numbers(number);
  CREATE INDEX IF NOT EXISTS idx_parts_seller ON parts(seller_id);
  CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id);
`);

// --- מיגרציות: עמודות שנוספו עם העיצוב החדש ---
// SQLite לא תומך ב-ADD COLUMN IF NOT EXISTS, אז בודקים מה כבר קיים.
const partColumns = new Set(db.prepare('PRAGMA table_info(parts)').all().map((c) => c.name));
const newPartColumns = [
  ["kind", "TEXT NOT NULL DEFAULT 'copy'"],   // orig | copy | used
  ['maker', 'TEXT'],                           // ADVICS, TRW, TOYOTA GENUINE…
  ['fits', 'TEXT'],                            // טקסט חופשי להצגה
  ['qty', 'INTEGER NOT NULL DEFAULT 0'],
  ['image_url', 'TEXT'],
  // התאמה מובנית לרכב — מה שמאפשר לסנן, בניגוד ל-fits שהוא טקסט חופשי
  ['vehicle_kind', 'TEXT'],                    // car | van | truck | moto …
  ['vehicle_make', 'TEXT'],                    // Toyota, Volvo, Yamaha …
  ['vehicle_model', 'TEXT'],                   // Corolla E210
  ['year_from', 'INTEGER'],
  ['year_to', 'INTEGER'],
];
for (const [name, type] of newPartColumns) {
  if (!partColumns.has(name)) {
    db.exec(`ALTER TABLE parts ADD COLUMN ${name} ${type}`);
  }
}

// מק״ט הוא שדה חובה, אבל הוא היה גם ייחודי גלובלית — וכך מוכר שני לא יכול היה
// להציע את אותו חלק, וזו בדיוק ההשוואה שהאתר קיים בשבילה. הייחודיות עוברת
// להיות בתוך המוכר. ב-SQLite משנים מגבלות רק בבנייה מחדש של הטבלה.
const hasGlobalPartNoUnique = db
  .prepare('PRAGMA index_list(parts)')
  .all()
  .filter((idx) => idx.unique)
  .some((idx) => {
    const cols = db.prepare(`PRAGMA index_info(${JSON.stringify(idx.name)})`).all();
    return cols.length === 1 && cols[0].name === 'part_no';
  });

const partNoColumn = db.prepare('PRAGMA table_info(parts)').all().find((c) => c.name === 'part_no');
const partNoNullable = partNoColumn && !partNoColumn.notnull;

if (hasGlobalPartNoUnique || partNoNullable) {
  // מק״ט הוא שדה חובה, אז שורות ישנות בלי מק״ט מקבלות ממלא מקום
  // במקום להימחק — עדיף שהמוכר יתקן אותן מהקבינט מאשר שיאבד פוזיציה.
  db.prepare(
    "UPDATE parts SET part_no = 'NO-SKU-' || id WHERE part_no IS NULL OR TRIM(part_no) = ''"
  ).run();

  db.pragma('foreign_keys = OFF');
  db.transaction(() => {
    db.exec(`
      CREATE TABLE parts_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        sub TEXT,
        category TEXT NOT NULL,
        part_no TEXT NOT NULL,
        price INTEGER NOT NULL,
        stock TEXT NOT NULL DEFAULT 'in',
        icon TEXT DEFAULT '🔧',
        seller_id INTEGER REFERENCES sellers(id) ON DELETE SET NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        kind TEXT NOT NULL DEFAULT 'copy',
        maker TEXT,
        fits TEXT,
        qty INTEGER NOT NULL DEFAULT 0,
        image_url TEXT,
        vehicle_kind TEXT,
        vehicle_make TEXT,
        vehicle_model TEXT,
        year_from INTEGER,
        year_to INTEGER,
        UNIQUE (seller_id, part_no)
      );
      INSERT INTO parts_new
        SELECT id, name, sub, category, part_no, price, stock, icon, seller_id,
               created_at, kind, maker, fits, qty, image_url,
               vehicle_kind, vehicle_make, vehicle_model, year_from, year_to
        FROM parts;
      DROP TABLE parts;
      ALTER TABLE parts_new RENAME TO parts;
      CREATE INDEX IF NOT EXISTS idx_parts_seller ON parts(seller_id);
    `);
  })();
  db.pragma('foreign_keys = ON');
}

// --- מיגרציה: קטגוריות לפי מערכות הרכב ---
// המלאי הישן ישב על מדפים ("מסננים", "שמנים"), והמסננים החדשים מדברים
// במערכות. מעבירים את מה שיש ולא מוחקים כלום — פוזיציה בלי קטגוריה
// מוכרת נופלת ל"אחר" והמוכר יכול לתקן אותה מהקבינט.
const { CATEGORY_IDS, LEGACY_CATEGORY_MAP } = require('./categories');
{
  const setCategory = db.prepare('UPDATE parts SET category = ? WHERE category = ?');
  const moveLegacy = db.transaction(() => {
    for (const [from, to] of Object.entries(LEGACY_CATEGORY_MAP)) setCategory.run(to, from);
    const known = [...CATEGORY_IDS];
    db.prepare(
      `UPDATE parts SET category = 'other'
       WHERE category NOT IN (${known.map(() => '?').join(', ')})`
    ).run(known);
  });
  moveLegacy();
}

// אינדקסים לסינון לפי רכב — נוצרים אחרי המיגרציה, כשהעמודות כבר קיימות
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_parts_vehicle ON parts(vehicle_kind, vehicle_make);
`);

module.exports = db;
