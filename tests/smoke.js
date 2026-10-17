/* ============================ בדיקת עשן ============================

   מה שנשבר פעם אחת נשבר שוב. הבדיקות האלה עוברות על הנתיבים שבלעדיהם
   האתר חסר טעם — חיפוש מק״ט, מסך המק״ט, עמוד הספק, הקבינט והשיחה עם
   בקשת ההזמנה — בשני המסכים, ובודקות גם מה שקל לשבור בלי לשים לב:
   חלונות מערכת (prompt/confirm) שאינם מוצגים באפליקציה מותקנת.

   להרצה:  node src/server.js  (בתיקיית backend) ואז  node tests/smoke.js
   דורש playwright. אם הוא מותקן גלובלית:  NODE_PATH=$(npm root -g) node tests/smoke.js
*/
const BASE = process.env.BASE || 'http://localhost:4000';

let pass = 0; const fails = [];
const chk = (name, ok, extra = '') => {
  if (ok) pass++;
  else fails.push(name + (extra ? ` — ${extra}` : ''));
};
const get = async (path) => (await fetch(BASE + path)).json();
const post = async (path, body, token) => (await fetch(BASE + path, {
  method: 'POST',
  headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
  body: JSON.stringify(body),
})).json();

async function api() {
  console.log('— API —');
  chk('שרת חי', (await get('/api/health')).status === 'ok');

  // החיפוש מחזיר מק״טים, לא מודעות: אותו חלק אצל ארבעה מוכרים הוא
  // שורה אחת עם ארבעה מחירים בתוכה
  const exact = await get('/api/search?q=04465-02220');
  chk('מק״ט מדויק נמצא', exact.exact.length === 1, JSON.stringify(exact.exact.map((c) => c.number)));
  chk('בתוכו כמה ספקים', exact.exact[0] && exact.exact[0].offers >= 3);
  chk('יש "עשוי להתאים"', exact.compatible.length >= 1);
  chk('מק״ט אינו שם של עסק', exact.sellers.length === 0);

  const byName = await get('/api/search?q=' + encodeURIComponent('פירוקים'));
  chk('חיפוש מוצא ספק בשם', byName.sellers.length === 1, JSON.stringify(byName.sellers.map((s) => s.name)));

  // % ו-_ הם תווי LIKE. פעם חיפוש של "%" החזיר את כל הקטלוג כאילו זו תשובה
  chk('"%" אינו תו חיפוש', (await get('/api/search?q=%25')).exact.length === 0);
  chk('"%" אינו תו חיפוש גם במדף', (await get('/api/sellers/1?q=%25')).pagination.total === 0);
  chk('"%" אינו תו חיפוש גם במסנן', (await get('/api/positions?make_q=%25')).pagination.total === 0);
  chk('חיפוש רגיל עדיין עובד', (await get('/api/positions?make_q=toy')).pagination.total > 0);

  const seller = await get('/api/sellers/1');
  chk('עמוד ספק: פרופיל', Boolean(seller.seller.name && seller.seller.phone));
  chk('עמוד ספק: בלי אימייל', !('email' in seller.seller));
  chk('עמוד ספק: מה שהוא מספר על עצמו', typeof seller.seller.about === 'string');
  chk('עמוד ספק: מדף עם דפדוף', seller.pagination.total > 0 && Array.isArray(seller.parts));
  chk('עמוד ספק: מערכות עם ספירה', seller.stats.categories.length > 0 && 'n' in seller.stats.categories[0]);
  const cat = seller.stats.categories[0];
  const filtered = await get(`/api/sellers/1?category=${cat.id}`);
  chk('מסנן מערכת מחזיר בדיוק את הספירה', filtered.pagination.total === cat.n, `${filtered.pagination.total} ≠ ${cat.n}`);
  chk('מערכת לא תקינה נדחית', Boolean((await get('/api/sellers/1?category=zzz')).error));
  chk('ספק שלא קיים', Boolean((await get('/api/sellers/99999')).error));

  // הזמנה: קונה שולח בקשה, מוכר עונה, והמונה בקבינט זז
  const mail = `smoke${Date.now()}@example.com`;
  const buyer = await post('/api/auth/register', { name: 'בודק', email: mail, password: '12345678' });
  chk('הרשמת קונה', Boolean(buyer.token));
  const seller4 = await post('/api/sellers/login', { email: 'ashdod@example.com', password: 'demo1234' });
  chk('כניסת מוכר', Boolean(seller4.token));
  const before = (await (await fetch(`${BASE}/api/sellers/me/stats`, { headers: { authorization: `Bearer ${seller4.token}` } })).json()).requests;

  const conv = await post('/api/conversations', { seller_id: 4, part_id: 4 }, buyer.token);
  chk('שיחה נפתחת מכרטיס החלק', Boolean(conv.conversation));
  const req = await post(`/api/conversations/${conv.conversation.id}/order-request`, { qty: 2, vehicle: 'Corolla 2019' }, buyer.token);
  chk('בקשת הזמנה נשלחת', Boolean(req.request || req.order_request));
  const afterOpen = (await (await fetch(`${BASE}/api/sellers/me/stats`, { headers: { authorization: `Bearer ${seller4.token}` } })).json()).requests;
  chk('המונה בקבינט עלה', afterOpen === before + 1, `${before} → ${afterOpen}`);

  const full = await (await fetch(`${BASE}/api/conversations/${conv.conversation.id}`, { headers: { authorization: `Bearer ${seller4.token}` } })).json();
  chk('המוכר רואה את הבקשה', full.order_requests.length === 1);
  const answer = await (await fetch(`${BASE}/api/conversations/${conv.conversation.id}/order-requests/${full.order_requests[0].id}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${seller4.token}` },
    body: JSON.stringify({ status: 'accepted' }),
  })).json();
  chk('המוכר עונה', (answer.request || {}).status === 'accepted' || (answer.order_request || {}).status === 'accepted');
  const afterAnswer = (await (await fetch(`${BASE}/api/sellers/me/stats`, { headers: { authorization: `Bearer ${seller4.token}` } })).json()).requests;
  chk('המונה חזר אחרי התשובה', afterAnswer === before, `${afterOpen} → ${afterAnswer}`);
}

async function ui() {
  let chromium;
  try { ({ chromium } = require('playwright')); }
  catch { console.log('— דילוג על בדיקות המסך: playwright אינו מותקן —'); return; }

  const browser = await chromium.launch();
  /* חלון מערכת הוא כישלון, לא אזהרה: באפליקציה שהותקנה למסך הבית
     חלק מהדפדפנים אינם מציגים prompt/confirm, והלחיצה לא עושה כלום. */
  let dialogs = 0;

  const open = async (url, w, h) => {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    page.on('dialog', async (d) => { dialogs++; await d.dismiss(); });
    page.on('pageerror', (e) => fails.push('שגיאת דף: ' + e));
    await page.goto(BASE + url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#splash', { state: 'detached', timeout: 12000 }).catch(() => {});
    await page.waitForTimeout(600);
    return page;
  };
  const login = (page, email) => page.evaluate(async (e) => {
    const r = await fetch('/api/sellers/login', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: e, password: 'demo1234' }),
    });
    const d = await r.json(); setAuth(d.token, 'seller'); S.me = d.seller;
  }, email);

  console.log('— האפליקציה —');
  const m = await open('/', 390, 844);
  await m.evaluate(() => { S.q = '04465-02220'; go('search'); loadSearch(); });
  await m.waitForTimeout(1200);
  chk('תוצאות הן מק״טים', (await m.$$('[data-act="open-pos"]')).length >= 1);
  await m.click('[data-act="open-pos"]'); await m.waitForTimeout(1300);
  chk('מסך המק״ט', await m.evaluate(() => S.screen) === 'position');
  chk('הספקים בפנים', (await m.$$('[data-act="open-offer"]')).length >= 3);
  await m.click('[data-act="open-offer"]'); await m.waitForTimeout(1300);
  chk('כרטיס ההצעה', await m.evaluate(() => S.screen) === 'part');
  const offer = await m.textContent('#screen');
  chk('מחיר בכותרת', /₪/.test(offer));
  chk('דרך לעמוד הספק', offer.includes('לעמוד הספק'));
  await m.click('[data-act="open-sup"]'); await m.waitForTimeout(1400);
  chk('עמוד הספק', await m.evaluate(() => S.screen) === 'seller');
  const cats = await m.$$('[data-act="sup-cat"]');
  chk('המדף מחולק למערכות', cats.length >= 3, String(cats.length));
  if (cats.length > 1) {
    const all = (await m.$$('[data-act="open-offer"]')).length;
    await cats[1].click(); await m.waitForTimeout(1100);
    const one = (await m.$$('[data-act="open-offer"]')).length;
    chk('בחירת מערכת מצמצמת', one >= 1 && one < all, `${all} → ${one}`);
  }

  // קבינט: מספרים נוספים בלי prompt, מחיקה בלי confirm
  await login(m, 'merkaz@example.com');
  await m.evaluate(() => { goTab('stock'); });
  await m.waitForTimeout(1600);
  const stock0 = await m.evaluate(() => S.stock.length);
  await m.evaluate(() => { S.draft = { kind: 'copy', category: 'brakes', qty: 0, nums: [], oems: [] }; go('create'); });
  await m.waitForTimeout(700);
  await m.fill('input[name=num_new]', 'SMOKE-1');
  await m.press('input[name=num_new]', 'Enter'); await m.waitForTimeout(400);
  chk('מק״ט נוסף בלי חלון מערכת', (await m.evaluate(() => S.draft.nums)).includes('SMOKE-1'));
  chk('Enter אינו מפרסם את הפוזיציה', await m.evaluate(() => S.screen) === 'create');
  await m.evaluate(() => { S.draft = null; goTab('stock'); }); await m.waitForTimeout(1500);
  await m.click('[data-act="delete"]'); await m.waitForTimeout(500);
  chk('שאלה בתוך האפליקציה', Boolean(await m.$('.askbox')));
  await m.click('.askbox [data-act="ask-no"]'); await m.waitForTimeout(400);
  chk('ביטול לא מוחק', await m.evaluate(() => S.stock.length) === stock0);

  console.log('— האתר —');
  const d = await open('/desktop', 1440, 950);
  await d.fill('#q', '04465-02220'); await d.press('#q', 'Enter'); await d.waitForTimeout(1200);
  chk('תוצאות באתר', (await d.$$('.item')).length >= 1);
  await d.click('.item'); await d.waitForTimeout(1300);
  chk('מסך המק״ט באתר', await d.evaluate(() => S.screen) === 'position');
  chk('טבלת ספקים', (await d.$$('tr[data-act="open-offer"]')).length >= 3);

  // בקשת הזמנה מקצה לקצה באתר
  const mail = `smokeui${Date.now()}@example.com`;
  await d.evaluate(async (e) => {
    const r = await fetch('/api/auth/register', { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'בודק', email: e, password: '12345678' }) });
    const j = await r.json(); setAuth(j.token, 'buyer'); S.me = j.user; render();
  }, mail);
  await d.click('tr[data-act="open-offer"]'); await d.waitForTimeout(1300);
  await d.click('[data-act="ask"]'); await d.waitForTimeout(1800);
  chk('שיחה נפתחה באתר', await d.evaluate(() => S.screen) === 'chats');
  chk('יש כפתור בקשת הזמנה', Boolean(await d.$('[data-act="order-form"]')));
  await d.click('[data-act="order-form"]'); await d.waitForTimeout(500);
  await d.fill('input[name=qty]', '2');
  await d.click('form[data-act="order-submit"] button[type=submit]'); await d.waitForTimeout(1700);
  chk('הבקשה נשלחה מהאתר', (await d.evaluate(() => (S.reqs || []).length)) === 1);
  chk('היא נראית בשיחה', (await d.textContent('#view')).includes('בקשת הזמנה'));

  chk('אין חלונות מערכת באף מסך', dialogs === 0, `נספרו ${dialogs}`);
  await browser.close();
}

(async () => {
  try {
    await api();
    await ui();
  } catch (e) {
    fails.push('נפילה: ' + e.message);
  }
  console.log(`\nעבר: ${pass} | נכשל: ${fails.length}`);
  if (fails.length) { console.log(fails.map((f) => '  ✗ ' + f).join('\n')); process.exit(1); }
})();
