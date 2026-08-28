require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./db');

const DEMO_PASSWORD = 'demo1234'; // סיסמת דמו לכל המוכרים הזרועים — לשימוש בבדיקות בלבד

const SELLERS = [
  { name: 'מוסך הרצל — חלקי חילוף', city: 'תל אביב', phone: '03-5551234', whatsapp: '972501234567', email: 'hertzel@example.com', rating: 4.8, reviews_count: 312, verified: 1 },
  { name: 'אוטו-פארט חיפה', city: 'חיפה', phone: '04-5559876', whatsapp: '972502345678', email: 'haifa@example.com', rating: 4.6, reviews_count: 198, verified: 1 },
  { name: 'רכב+ ראשון לציון', city: 'ראשון לציון', phone: '03-5553456', whatsapp: '972503456789', email: 'rishon@example.com', rating: 4.3, reviews_count: 87, verified: 0 },
  { name: 'גל חלקי רכב — באר שבע', city: 'באר שבע', phone: '08-5557890', whatsapp: '972504567890', email: 'gal@example.com', rating: 4.9, reviews_count: 421, verified: 1 },
];

// key: part_no -> { sellerIndex (0-based into SELLERS), interchange: [{number, brand}] }
const PARTS = [
  { name: 'רפידות בלם קדמיות', sub: 'תואם: טויוטה קורולה 2015–2022', category: 'brakes', part_no: 'BRK-4471', price: 189, stock: 'in', icon: '🛑', sellerIndex: 0,
    interchange: [{ number: '04465-02310', brand: 'OEM Toyota' }, { number: 'GDB3410', brand: 'TRW' }, { number: 'P83073', brand: 'Bosch' }] },
  { name: 'דיסק בלם אחורי', sub: 'תואם: יונדאי i20 / i30', category: 'brakes', part_no: 'BRK-2290', price: 245, stock: 'low', icon: '🛑', sellerIndex: 1,
    interchange: [{ number: '58411-2Kxxx', brand: 'OEM Hyundai' }, { number: 'DF6543', brand: 'TRW' }] },
  { name: 'מסנן שמן מנוע', sub: 'תואם: מזדה 3 / מזדה 6', category: 'filters', part_no: 'FLT-1183', price: 42, stock: 'in', icon: '🧰', sellerIndex: 2,
    interchange: [{ number: 'PE01-14-302', brand: 'OEM Mazda' }, { number: 'OC90', brand: 'Mahle' }, { number: 'W712/75', brand: 'Mann-Filter' }] },
  { name: 'מסנן אוויר תא נוסעים', sub: "תואם: קיה ספורטאז' 2018+", category: 'filters', part_no: 'FLT-3765', price: 68, stock: 'in', icon: '🧰', sellerIndex: 1,
    interchange: [{ number: '97133-D9000', brand: 'OEM Kia' }, { number: 'CUK2939', brand: 'Mann-Filter' }] },
  { name: 'מצבר 60 אמפר', sub: 'תואם: רוב הרכבים המשפחתיים', category: 'battery', part_no: 'BAT-6012', price: 410, stock: 'in', icon: '🔋', sellerIndex: 3,
    interchange: [{ number: 'L2-60', brand: 'Varta' }, { number: 'DIN60', brand: 'Universal' }] },
  { name: 'מצבר 45 אמפר קומפקטי', sub: 'תואם: רכבי סופר-מיני', category: 'battery', part_no: 'BAT-4509', price: 355, stock: 'low', icon: '🔋', sellerIndex: 3,
    interchange: [{ number: 'L1-45', brand: 'Varta' }, { number: 'DIN45', brand: 'Universal' }] },
  { name: 'פנס ראשי ימני LED', sub: 'תואם: סקודה אוקטביה 2020+', category: 'lights', part_no: 'LGT-2201', price: 520, stock: 'in', icon: '💡', sellerIndex: 0,
    interchange: [{ number: '5E1-941-006', brand: 'OEM Skoda' }, { number: 'LPL584', brand: 'Hella' }] },
  { name: 'נורת איתות אחורית', sub: 'תואם: אוניברסלי, סט זוגי', category: 'lights', part_no: 'LGT-0087', price: 34, stock: 'in', icon: '💡', sellerIndex: 2,
    interchange: [{ number: 'WY21W', brand: 'Universal' }, { number: '7440', brand: 'Universal' }] },
  { name: 'שמן מנוע סינטטי 5W-30', sub: 'מיכל 4 ליטר', category: 'oil', part_no: 'OIL-5304', price: 159, stock: 'in', icon: '🛢️', sellerIndex: 1,
    interchange: [{ number: '5W30-C3', brand: 'Castrol' }, { number: '5W30-LL', brand: 'Mobil 1' }] },
  { name: 'שמן גיר אוטומטי ATF', sub: 'מיכל 1 ליטר', category: 'oil', part_no: 'OIL-1102', price: 79, stock: 'low', icon: '🛢️', sellerIndex: 1,
    interchange: [{ number: 'ATF-DW1', brand: 'OEM' }, { number: 'ATF-3309', brand: 'Motul' }] },
  { name: 'בולם זעזועים קדמי', sub: 'תואם: הונדה סיוויק 2016–2021', category: 'suspension', part_no: 'SUS-7734', price: 310, stock: 'in', icon: '⚙️', sellerIndex: 3,
    interchange: [{ number: '51606-TBA-A02', brand: 'OEM Honda' }, { number: '333374', brand: 'Monroe' }, { number: 'G8563', brand: 'Bilstein' }] },
  { name: 'זרוע היגוי תחתונה', sub: 'תואם: פורד פוקוס 2012–2018', category: 'suspension', part_no: 'SUS-3390', price: 225, stock: 'in', icon: '⚙️', sellerIndex: 0,
    interchange: [{ number: '1719872', brand: 'OEM Ford' }, { number: 'RBJ500280', brand: 'Delphi' }] },
];

function seed() {
  const passwordHash = bcrypt.hashSync(DEMO_PASSWORD, 10);

  const insertSeller = db.prepare(`
    INSERT INTO sellers (name, city, phone, whatsapp, email, password_hash, rating, reviews_count, verified)
    VALUES (@name, @city, @phone, @whatsapp, @email, @password_hash, @rating, @reviews_count, @verified)
  `);

  const insertPart = db.prepare(`
    INSERT INTO parts (name, sub, category, part_no, price, stock, icon, seller_id)
    VALUES (@name, @sub, @category, @part_no, @price, @stock, @icon, @seller_id)
    ON CONFLICT(part_no) DO UPDATE SET
      name=excluded.name, sub=excluded.sub, category=excluded.category,
      price=excluded.price, stock=excluded.stock, icon=excluded.icon, seller_id=excluded.seller_id
  `);

  const getPartId = db.prepare('SELECT id FROM parts WHERE part_no = ?');
  const clearInterchange = db.prepare('DELETE FROM interchange_numbers WHERE part_id = ?');
  const insertInterchange = db.prepare('INSERT INTO interchange_numbers (part_id, number, brand) VALUES (?, ?, ?)');

  const runAll = db.transaction(() => {
    // רק אם אין עדיין מוכרים — כדי לא לשכפל בהרצות חוזרות
    const sellerCount = db.prepare('SELECT COUNT(*) AS c FROM sellers').get().c;
    let sellerIds = [];
    if (sellerCount === 0) {
      for (const s of SELLERS) {
        const result = insertSeller.run({ ...s, password_hash: passwordHash });
        sellerIds.push(result.lastInsertRowid);
      }
    } else {
      sellerIds = db.prepare('SELECT id FROM sellers ORDER BY id ASC').all().map((r) => r.id);
    }

    for (const p of PARTS) {
      const seller_id = sellerIds[p.sellerIndex] || null;
      insertPart.run({
        name: p.name, sub: p.sub, category: p.category, part_no: p.part_no,
        price: p.price, stock: p.stock, icon: p.icon, seller_id,
      });

      const partId = getPartId.get(p.part_no).id;
      clearInterchange.run(partId);
      for (const alt of p.interchange) {
        insertInterchange.run(partId, alt.number, alt.brand || null);
      }
    }
  });

  runAll();
  console.log(`✅ מוכרים: ${SELLERS.length} | חלקים: ${PARTS.length} | מספרים חלופיים: ${PARTS.reduce((n, p) => n + p.interchange.length, 0)}`);
  console.log(`🔑 סיסמת דמו לכל המוכרים הזרועים: ${DEMO_PASSWORD}`);
}

seed();
