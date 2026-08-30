require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./db');

const DEMO_PASSWORD = 'demo1234';

const sellers = [
  { name: 'חלקי צפון בע״מ', city: 'חיפה', phone: '04-812-4410', whatsapp: '972481244100', email: 'hertzel@example.com', rating: 4.9, reviews_count: 812, verified: 1 },
  { name: 'אוטו-לינק סחר', city: 'ראשון לציון', phone: '03-954-7720', whatsapp: '972395477200', email: 'autolink@example.com', rating: 4.8, reviews_count: 1204, verified: 1 },
  { name: 'מרכז חלקים תל אביב', city: 'תל אביב', phone: '03-611-8080', whatsapp: '972361180800', email: 'merkaz@example.com', rating: 4.7, reviews_count: 3190, verified: 1 },
  { name: 'פירוקים אשדוד', city: 'אשדוד', phone: '08-852-3311', whatsapp: '972885233110', email: 'ashdod@example.com', rating: 4.4, reviews_count: 640, verified: 0 },
];

// אותו חלק מוצע על ידי כמה מוכרים — מספרים חופפים הופכים אותם לאנלוגים זה של זה.
const parts = [
  { seller: 1, name: 'רפידות בלימה קדמיות', category: 'brakes', part_no: '04465-02220', vehicle_kind: 'car', vehicle_make: 'Toyota', vehicle_model: 'Corolla E210', yf: 2016, yt: 2023, price: 210, kind: 'orig', maker: 'ADVICS', fits: 'TOYOTA COROLLA E210 · 2016—2023', qty: 6,
    nums: [['04465-02220', 'OEM Toyota'], ['04465-YZZQ7', 'Toyota Genuine'], ['GDB3426', 'TRW'], ['P83133', 'Brembo']] },
  { seller: 2, name: 'רפידות בלימה TRW', category: 'brakes', part_no: 'GDB3426', vehicle_kind: 'car', vehicle_make: 'Toyota', vehicle_model: 'Corolla E180/E210', yf: 2013, yt: 2023, price: 245, kind: 'copy', maker: 'TRW', fits: 'TOYOTA COROLLA E180/E210 · 2013—2023', qty: 4,
    nums: [['GDB3426', 'TRW'], ['04465-02220', 'OEM Toyota'], ['DB1943', 'Bendix']] },
  { seller: 3, name: 'רפידות בלימה מקוריות', category: 'brakes', part_no: '04465-YZZQ7', vehicle_kind: 'car', vehicle_make: 'Toyota', vehicle_model: 'Corolla E210', yf: 2016, yt: 2023, price: 465, kind: 'orig', maker: 'TOYOTA GENUINE', fits: 'TOYOTA COROLLA E210 · 2016—2023', qty: 12,
    nums: [['04465-YZZQ7', 'Toyota Genuine'], ['04465-02220', 'OEM Toyota'], ['P83133', 'Brembo']] },
  { seller: 4, name: 'רפידות בלימה · פירוק', category: 'brakes', part_no: '04465-02220', vehicle_kind: 'car', vehicle_make: 'Toyota', vehicle_model: 'Corolla E210', yf: 2016, yt: 2023, price: 120, kind: 'used', maker: 'USED · 60%', fits: 'TOYOTA COROLLA E210 · 2016—2023', qty: 1,
    nums: [['04465-02220', 'OEM Toyota'], ['GDB3426', 'TRW']] },

  { seller: 1, name: 'מסנן שמן', category: 'service', part_no: '90915-YZZD2', vehicle_kind: 'car', vehicle_make: 'Toyota', vehicle_model: 'Corolla / Lexus', yf: 2010, yt: 2024, price: 38, kind: 'orig', maker: 'TOYOTA GENUINE', fits: 'TOYOTA / LEXUS · 1.6—2.5', qty: 60,
    nums: [['90915-YZZD2', 'OEM Toyota'], ['90915-10003', 'OEM Toyota'], ['C-111', 'Mann-Filter'], ['OC90', 'Mahle']] },
  { seller: 2, name: 'מסנן שמן Mann', category: 'service', part_no: 'W712/75', vehicle_kind: 'car', vehicle_make: 'Toyota', vehicle_model: 'Corolla / Lexus', yf: 2010, yt: 2024, price: 29, kind: 'copy', maker: 'MANN-FILTER', fits: 'TOYOTA / LEXUS · 1.6—2.5', qty: 25,
    nums: [['W712/75', 'Mann-Filter'], ['90915-YZZD2', 'OEM Toyota'], ['OC90', 'Mahle']] },

  { seller: 3, name: 'דיסק בלם אחורי', category: 'brakes', part_no: '58411-2K000', vehicle_kind: 'car', vehicle_make: 'Hyundai', vehicle_model: 'i20 / i30', yf: 2014, yt: 2021, price: 245, kind: 'orig', maker: 'HYUNDAI GENUINE', fits: 'HYUNDAI i20 / i30 · 2014—2021', qty: 8,
    nums: [['58411-2K000', 'OEM Hyundai'], ['DF6543', 'TRW']] },
  { seller: 2, name: 'דיסק בלם אחורי TRW', category: 'brakes', part_no: 'DF6543', vehicle_kind: 'car', vehicle_make: 'Hyundai', vehicle_model: 'i20 / i30', yf: 2014, yt: 2021, price: 198, kind: 'copy', maker: 'TRW', fits: 'HYUNDAI i20 / i30 · 2014—2021', qty: 3,
    nums: [['DF6543', 'TRW'], ['58411-2K000', 'OEM Hyundai']] },

  { seller: 1, name: 'מצבר 60 אמפר', category: 'batteries', part_no: 'BAT-6012', vehicle_kind: 'car', vehicle_make: 'Toyota', vehicle_model: 'אוניברסלי', yf: null, yt: null, price: 410, kind: 'copy', maker: 'VARTA', fits: 'רוב הרכבים המשפחתיים', qty: 14,
    nums: [['DIN60', 'Universal'], ['L2-60', 'Varta']] },
  { seller: 4, name: 'מצבר 45 אמפר קומפקטי', category: 'batteries', part_no: 'BAT-4509', vehicle_kind: 'car', vehicle_make: 'Kia', vehicle_model: 'Picanto / Rio', yf: 2015, yt: 2023, price: 355, kind: 'copy', maker: 'VARTA', fits: 'רכבי סופר-מיני', qty: 2,
    nums: [['DIN45', 'Universal'], ['L1-45', 'Varta']] },

  { seller: 3, name: 'פנס ראשי ימני LED', category: 'electrical', part_no: 'LGT-2201', vehicle_kind: 'car', vehicle_make: 'Skoda', vehicle_model: 'Octavia', yf: 2020, yt: 2024, price: 520, kind: 'copy', maker: 'HELLA', fits: 'SKODA OCTAVIA · 2020+', qty: 5,
    nums: [['5E1-941-006', 'OEM Skoda'], ['LPL584', 'Hella']] },
  { seller: 1, name: 'נורת איתות אחורית', category: 'bulbs', part_no: 'LGT-0087', vehicle_kind: 'car', vehicle_make: 'Volkswagen', vehicle_model: 'אוניברסלי', yf: null, yt: null, price: 34, kind: 'copy', maker: 'OSRAM', fits: 'אוניברסלי, בית זוגי', qty: 40,
    nums: [['7440', 'Universal'], ['WY21W', 'Osram']] },

  { seller: 2, name: 'שמן מנוע סינתטי 5W-30', category: 'oil_engine', part_no: 'OIL-5304', vehicle_kind: 'car', vehicle_make: 'Toyota', vehicle_model: 'אוניברסלי', yf: null, yt: null, price: 159, kind: 'copy', maker: 'CASTROL', fits: 'מיכל 4 ליטר', qty: 30,
    nums: [['5W30-C3', 'Castrol'], ['5W30-LL', 'Mobil 1']] },
  { seller: 4, name: 'שמן גיר אוטומטי ATF', category: 'oil_gear', part_no: 'OIL-1102', vehicle_kind: 'car', vehicle_make: 'Honda', vehicle_model: 'אוניברסלי', yf: null, yt: null, price: 79, kind: 'copy', maker: 'MOTUL', fits: 'מיכל 1 ליטר', qty: 0,
    nums: [['ATF-DW1', 'OEM Honda'], ['ATF-3309', 'Motul']] },

  { seller: 3, name: 'בולם זעזועים קדמי', category: 'suspension', part_no: 'SUS-7734', vehicle_kind: 'car', vehicle_make: 'Honda', vehicle_model: 'Civic', yf: 2016, yt: 2021, price: 310, kind: 'copy', maker: 'MONROE', fits: 'HONDA CIVIC · 2016—2021', qty: 6,
    nums: [['TBA-A02-51606', 'OEM Honda'], ['G8563', 'Bilstein'], ['333374', 'Monroe']] },
  { seller: 1, name: 'זרוע היגוי תחתונה', category: 'suspension', part_no: 'SUS-3390', vehicle_kind: 'car', vehicle_make: 'Ford', vehicle_model: 'Focus', yf: 2012, yt: 2018, price: 225, kind: 'copy', maker: 'DELPHI', fits: 'FORD FOCUS · 2012—2018', qty: 4,
    nums: [['1719872', 'OEM Ford'], ['RBJ500280', 'Delphi']] },

  { seller: 1, name: 'צינור מים עליון', category: 'cooling', part_no: '16571-0T030', vehicle_kind: 'car', vehicle_make: 'Toyota', vehicle_model: 'Corolla', yf: 2014, yt: 2019, price: 95, kind: 'copy', maker: 'GATES', fits: 'TOYOTA COROLLA · 2014—2019', qty: 2,
    nums: [['16571-0T030', 'OEM Toyota'], ['CST-1215', 'Gates']] },
  // אזל מהמלאי — מופיע בקבינט כאזהרה
  { seller: 1, name: 'גומיות מייצב', category: 'suspension', part_no: '48815-02200', vehicle_kind: 'car', vehicle_make: 'Toyota', vehicle_model: 'Corolla E210', yf: 2016, yt: 2023, price: 45, kind: 'copy', maker: 'FEBEST', fits: 'TOYOTA COROLLA E210 · 2016—2023', qty: 0,
    nums: [['48815-02200', 'OEM Toyota'], ['TSB-ZRE151', 'Febest']] },

  // --- כימיה, אביזרים ואלקטרוניקה: מדפים שאינם תלויים בדגם הרכב ---
  { seller: 2, name: 'נוזל בלמים DOT4', category: 'brake_fluid', part_no: 'DOT4-1L', price: 39, kind: 'copy', maker: 'BOSCH', fits: 'מיכל 1 ליטר', qty: 40,
    nums: [['DOT4-1L', 'Bosch']] },
  { seller: 3, name: 'נוזל קירור אדום מרוכז', category: 'coolant', part_no: 'CLT-RED-4', price: 68, kind: 'copy', maker: 'TOTAL', fits: 'מיכל 4 ליטר', qty: 22,
    nums: [['CLT-RED-4', 'Total']] },
  { seller: 1, name: 'נוזל שמשות קיץ', category: 'washer_fluid', part_no: 'WSH-SUM-4', price: 19, kind: 'copy', maker: 'SONAX', fits: 'מיכל 4 ליטר', qty: 55,
    nums: [['WSH-SUM-4', 'Sonax']] },
  { seller: 4, name: 'ספריי ניקוי פנים הרכב', category: 'car_care', part_no: 'CAR-INT-500', price: 34, kind: 'copy', maker: 'SONAX', fits: 'בקבוק 500 מ״ל', qty: 30,
    nums: [['CAR-INT-500', 'Sonax']] },
  { seller: 2, name: 'צמיג 205/55R16', category: 'tyres', part_no: 'TYR-2055516', price: 320, kind: 'copy', maker: 'MICHELIN', fits: '205/55R16 91V', qty: 16,
    nums: [['TYR-2055516', 'Michelin']] },
  { seller: 3, name: 'חישוק פלדה 16 אינץ׳', category: 'rims', part_no: 'RIM-16-5X114', price: 240, kind: 'copy', maker: 'ALCAR', fits: '16" · 5x114.3', qty: 8,
    nums: [['RIM-16-5X114', 'Alcar']] },
  { seller: 1, name: 'ערכת כלים 108 חלקים', category: 'tools', part_no: 'TLS-108', price: 289, kind: 'copy', maker: 'STANLEY', fits: 'מזוודה קשיחה', qty: 6,
    nums: [['TLS-108', 'Stanley']] },
  { seller: 4, name: 'ג׳ק הידראולי 2 טון', category: 'repair', part_no: 'JCK-2T', price: 199, kind: 'copy', maker: 'UNICRAFT', fits: 'עד 2 טון', qty: 4,
    nums: [['JCK-2T', 'Unicraft']] },
  { seller: 2, name: 'מצלמת דרך Full HD', category: 'dashcam', part_no: 'DVR-FHD-70', price: 349, kind: 'copy', maker: '70MAI', fits: 'הקלטה 1080p', qty: 11,
    nums: [['DVR-FHD-70', '70mai']] },
  { seller: 3, name: 'ערכת נתיכים 120 יחידות', category: 'fuses', part_no: 'FUS-120', price: 45, kind: 'copy', maker: 'BOSCH', fits: 'מיני ורגיל', qty: 25,
    nums: [['FUS-120', 'Bosch']] },
  { seller: 1, name: 'מערכת שמע 2DIN אנדרואיד', category: 'stereo', part_no: 'STR-2DIN-9', price: 890, kind: 'copy', maker: 'PIONEER', fits: 'מסך 9 אינץ׳', qty: 3,
    nums: [['STR-2DIN-9', 'Pioneer']] },
  { seller: 4, name: 'מחזיק טלפון מגנטי', category: 'accessories', part_no: 'ACC-MAG-01', price: 49, kind: 'copy', maker: 'BASEUS', fits: 'צמוד לפתח מיזוג', qty: 60,
    nums: [['ACC-MAG-01', 'Baseus']] },
];

const seed = db.transaction(() => {
  db.prepare('DELETE FROM order_requests').run();
  db.prepare('DELETE FROM messages').run();
  db.prepare('DELETE FROM conversations').run();
  db.prepare('DELETE FROM interchange_numbers').run();
  db.prepare('DELETE FROM parts').run();
  db.prepare('DELETE FROM sellers').run();
  db.prepare("DELETE FROM sqlite_sequence WHERE name IN ('parts','sellers','interchange_numbers')").run();

  const hash = bcrypt.hashSync(DEMO_PASSWORD, 10);
  const insSeller = db.prepare(
    `INSERT INTO sellers (name, city, phone, whatsapp, email, password_hash, rating, reviews_count, verified)
     VALUES (@name, @city, @phone, @whatsapp, @email, @password_hash, @rating, @reviews_count, @verified)`
  );
  const sellerIds = sellers.map((s) => insSeller.run({ ...s, password_hash: hash }).lastInsertRowid);

  const insPart = db.prepare(
    `INSERT INTO parts (name, category, part_no, price, kind, maker, fits, qty, seller_id,
                        vehicle_kind, vehicle_make, vehicle_model, year_from, year_to)
     VALUES (@name, @category, @part_no, @price, @kind, @maker, @fits, @qty, @seller_id,
             @vehicle_kind, @vehicle_make, @vehicle_model, @year_from, @year_to)`
  );
  const insNum = db.prepare('INSERT INTO interchange_numbers (part_id, number, brand) VALUES (?, ?, ?)');

  let numCount = 0;
  for (const p of parts) {
    const partId = insPart.run({
      name: p.name, category: p.category, part_no: p.part_no, price: p.price,
      kind: p.kind, maker: p.maker, fits: p.fits, qty: p.qty,
      seller_id: sellerIds[p.seller - 1],
      vehicle_kind: p.vehicle_kind || null,
      vehicle_make: p.vehicle_make || null,
      vehicle_model: p.vehicle_model || null,
      year_from: p.yf ?? null,
      year_to: p.yt ?? null,
    }).lastInsertRowid;
    for (const [number, brand] of p.nums) { insNum.run(partId, number, brand); numCount += 1; }
  }
  return numCount;
});

function run() {
  const numCount = seed();
  const counts = db.prepare('SELECT COUNT(*) AS parts FROM parts').get();
  const outOfStock = db.prepare('SELECT COUNT(*) AS c FROM parts WHERE qty = 0').get().c;

  console.log(`✅ מוכרים: ${sellers.length} | חלקים: ${counts.parts} (מהם ${outOfStock} אזלו מהמלאי) | מספרים חלופיים: ${numCount}`);
  console.log(`🔑 סיסמת דמו לכל המוכרים: ${DEMO_PASSWORD}`);
}

// באחסון חינמי הדיסק נמחק בכל פריסה, אז שרת שעולה על בסיס ריק
// ממלא את עצמו — אחרת המשתמש מקבל קטלוג ריק בלי להבין למה.
function seedIfEmpty() {
  const { c } = db.prepare('SELECT COUNT(*) AS c FROM parts').get();
  if (c > 0) return false;
  console.log('📦 בסיס הנתונים ריק — ממלא נתוני דמו');
  run();
  return true;
}

if (require.main === module) run();

module.exports = { run, seedIfEmpty, DEMO_PASSWORD };
