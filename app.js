'use strict';

/* ============================ אייקונים ============================
   האייקונים משורבבים כ-SVG במקום להיטען מ-CDN: פחות תלות חיצונית,
   ועובד גם בלי רשת. */
const I = (d, o) => `<svg width="${(o && o.s) || 19}" height="${(o && o.s) || 19}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const ICON = {
  sliders: o => I('<path d="M4 8.5h16M4 15.5h16"/><circle cx="9" cy="8.5" r="2.4"/><circle cx="15" cy="15.5" r="2.4"/>', o),
  gear: o => I('<path d="M12 4 13.4 5.9a6.3 6.3 0 0 1 2.1 1.2l2.3-.4.9 1.6-1.5 1.8a6 6 0 0 1 0 2.5l1.5 1.8-.9 1.6-2.3-.4a6.3 6.3 0 0 1-2.1 1.2L12 20l-1.4-1.9a6.3 6.3 0 0 1-2.1-1.2l-2.3.4-.9-1.6L6.8 14a6 6 0 0 1 0-2.5L5.3 9.7l.9-1.6 2.3.4a6.3 6.3 0 0 1 2.1-1.2z"/><circle cx="12" cy="12" r="2.7"/>', o),
  droplet: o => I('<path d="M12 3.5s5.5 6 5.5 9.6a5.5 5.5 0 0 1-11 0C6.5 9.5 12 3.5 12 3.5z"/>', o),
  tyre: o => I('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.2"/>', o),
  bolt: o => I('<path d="M13.2 2.5 5 13.6h5.6l-.8 7.9 8.2-11.1h-5.6z"/>', o),
  search: o => I('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', o),
  user: o => I('<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>', o),
  house: o => I('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>', o),
  package: o => I('<path d="m7.5 4.3 9 5.2M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>', o),
  chat: o => I('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>', o),
  plus: o => I('<path d="M12 5v14M5 12h14"/>', o),
  chevron: o => I('<path d="m15 18-6-6 6-6"/>', o),
  back: o => I('<path d="M5 12h14M12 5l7 7-7 7"/>', o),
  // חץ החזרה יושב בפינה השמאלית העליונה, ולכן הוא מצביע שמאלה —
  // כיוון החץ וכיוון התנועה חייבים להיות אותו דבר
  backL: o => I('<path d="M19 12H5M12 19l-7-7 7-7"/>', o),
  close: o => I('<path d="M18 6 6 18M6 6l12 12"/>', o),
  check: o => I('<path d="M20 6 9 17l-5-5"/>', o),
  badge: o => I('<path d="M12 2 14.4 4.6 18 4.2l.4 3.6L22 9l-1.7 3.2L22 15l-3.6 1.2-.4 3.6-3.6-.4L12 22l-2.4-2.6-3.6.4-.4-3.6L2 15l1.7-3.2L2 9l3.6-1.2.4-3.6 3.6.4z"/><path d="m9 12 2 2 4-4"/>', o),
  phone: o => I('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>', o),
  pencil: o => I('<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>', o),
  trash: o => I('<path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>', o),
  camera: o => I('<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3.5"/>', o),
  send: o => I('<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>', o),
  warn: o => I('<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>', o),
  settings: o => I('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>', o),
  logout: o => I('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>', o),
};

const LOGO = `<svg width="39" height="26" viewBox="71 180 496 333" fill="none" aria-hidden="true">
  <path fill="#dd6612" fill-rule="evenodd" d="M72 180 L72 190 L108 365 L129 477 L134 489 L147 504 L160 511 L168 513 L468 513 L476 511 L490 503 L502 489 L507 476 L535 332 L567 182 L566 180 Z M97 202 L138 416 L166 351 L225 202 Z M412 202 L474 357 L484 378 L485 384 L497 410 L498 416 L500 415 L541 202 Z M318 245 L273 356 L270 360 L269 366 L256 394 L250 412 L247 416 L243 429 L240 433 L232 456 L224 472 L218 487 L219 489 L418 488 L399 440 L315 440 L315 436 L322 422 L339 377 L372 376 L319 245 Z"/>
</svg>`;

/* ============================ עזרים ============================ */
const $ = (sel, root) => (root || document).querySelector(sel);
const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shekel = (n) => `₪ ${Number(n).toLocaleString('he-IL')}`;

const NOTE_FIT = 'המידע להתרשמות בלבד. כדי לוודא שהחלק אכן מתאים, צרו קשר עם הספק.';
const KIND_LABEL = { orig: 'מקורי', copy: 'חלופי', used: 'משומש' };
// מבנה המדפים (מחלקות וקטגוריות) מגיע מהשרת — אותו מקור שמאמת
// כל פוזיציה, כדי שהרשימות לא ייפרדו זו מזו.
function catLabel(id) {
  for (const d of S.depts) {
    const hit = d.categories.find((c) => c.id === id);
    if (hit) return hit.label;
  }
  return id;
}

function deptOf(categoryId) {
  return S.depts.find((d) => d.categories.some((c) => c.id === categoryId)) || null;
}

function deptLabel(id) {
  const d = S.depts.find((x) => x.id === id);
  return d ? d.label : id;
}

function currentDept() {
  return S.depts.find((d) => d.id === S.dept) || null;
}

// שנות הדגם שאפשר לבחור בסינון — מהשנה הקרובה אחורה, כמה שאנשים באמת מחפשים
const YEARS = (() => {
  const top = new Date().getFullYear() + 1;
  return Array.from({ length: top - 1979 }, (_, i) => top - i);
})();

function timeOf(iso) {
  if (!iso) return '';
  const d = new Date(iso.replace(' ', 'T') + 'Z');
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
}

/* ============================ מצב ============================ */
const S = {
  screen: 'home',
  token: localStorage.getItem('ap_token') || null,
  role: localStorage.getItem('ap_role') || null,
  me: null,
  q: '',
  kind: 'all',
  category: 'all',
  items: [],
  total: 0,
  openPart: null,       // איזה כרטיס פתוח ברשימה
  part: null,
  // תוצאות החיפוש הן רשימה של רשימות: פוזיציה אחת למעלה — זו של
  // המק״ט שהוקלד — ומתחתיה פוזיציות של מנפיקים אחרים שמתאימות לה
  groups: null,
  pos: null, posOffers: [], posCompat: [], posEmpty: 0, compatNote: false,
  /* איפה כל לשונית נעצרה. מי שהיה בתוצאות חיפוש, קפץ להודעות וחזר,
     חוזר לתוצאות — ולא למסך בית ריק. בלי זה כל הצצה בלשונית אחרת
     מוחקת את מה שהמשתמש בנה, וזה הופך את האי התחתון למסוכן. */
  tabAt: { home: 'home', stock: 'stock', chats: 'chats', profile: 'profile' },
  scrollAt: {}, restoreScroll: false,
  supOpen: true,
  stock: [],
  stockOems: new Set(),  // אילו כרטיסים פתחו את כל המק״טים המקוריים
  sellerStats: null,
  conversations: [],
  conv: null,
  messages: [],
  requests: [],
  loading: false,
  draft: null,
  sheet: false,   // הפאנל התחתון של מסך הבית
  depts: [],      // מחלקות החנות והקטגוריות שלהן, מהשרת
  dept: null,     // המחלקה הפתוחה בפאנל; null = עמוד ארבע המחלקות
  vehicles: [],   // מיון סוגי רכב ויצרנים, מהשרת
  vkind: 'all',   // סוג רכב שנבחר במסנן
  vmake: 'all',   // יצרן מהרשימה, או 'other' ליצרן שהוקלד ביד
  vmakeq: '',     // היצרן שהוקלד כש"אחר" נבחר
  vmodel: '',     // דגם — טקסט חופשי עם הצעות מהקטלוג
  vyear: '',      // שנת ייצור
  models: [],     // הצעות דגמים ליצרן שנבחר
  sheetCount: null, // כמה תוצאות מחכות מאחורי המסננים שנבחרו
  cutout: true,   // להסיר רקע מתמונת מוצר חדשה
};

const isSeller = () => S.role === 'seller';
const authed = () => Boolean(S.token);

function setAuth(token, role) {
  S.token = token; S.role = role;
  localStorage.setItem('ap_token', token);
  localStorage.setItem('ap_role', role);
}
function clearAuth() {
  S.token = null; S.role = null; S.me = null;
  localStorage.removeItem('ap_token');
  localStorage.removeItem('ap_role');
}

/* ============================ API ============================ */
async function api(path, opts) {
  const o = opts || {};
  const headers = { ...(o.headers || {}) };
  if (o.body !== undefined) headers['Content-Type'] = 'application/json';
  if (S.token) headers.Authorization = `Bearer ${S.token}`;

  const res = await fetch(`/api${path}`, {
    method: o.method || 'GET',
    headers,
    body: o.body === undefined ? undefined : JSON.stringify(o.body),
  });

  let data = null;
  try { data = await res.json(); } catch (e) { data = null; }

  if (!res.ok) {
    // טוקן שפג — מנקים כדי שלא ניתקע במסך שגיאה מתמשך
    if (res.status === 401 && authed()) clearAuth();
    throw new Error((data && data.error) || `שגיאה ${res.status}`);
  }
  return data;
}

let toastTimer = null;
function toast(msg, isError) {
  const old = $('.toast');
  if (old) old.remove();
  const el = document.createElement('div');
  el.className = 'toast' + (isError ? ' err' : '');
  el.textContent = msg;
  $('#app').appendChild(el);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.remove(), 3200);
}

/* ============================ רכיבים משותפים ============================ */
/* בממשק RTL האיבר הראשון בשורה יושב מימין והאחרון משמאל.

   חץ החזרה הוא האחרון בקבוצה השמאלית, ולכן הוא בפינה השמאלית
   העליונה — באותו צד שממנו מחליקים כדי לחזור. הלוגו אינו זז בין
   מסכים: הוא נשאר במקומו והחץ מתווסף לשמאלו. */
function topBar(opts) {
  const o = opts || {};
  const nav = o.back
    ? `<button class="iconbtn" data-act="${esc(o.back)}" aria-label="חזרה">${ICON.backL()}</button>`
    : '';
  const actions = o.actions === undefined
    ? `<span class="row" style="gap: var(--s2)">
         <button class="iconbtn" data-act="chats">${ICON.chat({ s: 18 })}</button>
         <button class="iconbtn" data-act="profile">${ICON.user({ s: 18 })}</button>
       </span>`
    : o.actions;
  const title = o.title ? `<span style="font:600 var(--fs-lead) var(--disp)">${esc(o.title)}</span>` : '';
  const brand = `<span class="brand">${LOGO}<b>AUTOPARTS</b></span>`;
  // הכפתורים נעטפים תמיד, גם כשאין אף אחד: כך בשורה יש בדיוק שני צדדים
  // ו-space-between שולח את הלוגו לקצה. שוליים לוגיים לא מתאימים כאן —
  // ל-.brand יש direction:ltr משלו, והם נמדדים לפיו ולא לפי השורה.
  return `<div class="top">
    <span class="row" style="gap: var(--s2)">${actions}</span>
    ${title}
    <span class="row" style="gap: var(--s2)">${brand}${nav}</span>
  </div>`;
}

function kindTag(kind) {
  const k = KIND_LABEL[kind] ? kind : 'copy';
  return `<span class="tag ${k}">${KIND_LABEL[k]}</span>`;
}

function thumb(part, size) {
  const s = size || 72;
  if (!part.image_url) return '';
  return `<div class="thumb" style="width:${s}px;height:${s}px;background-image:url('${esc(part.image_url)}')"></div>`;
}

function emptyState(icon, title, sub) {
  return `<div class="center">
    <div style="color:var(--muted)">${icon}</div>
    <div style="font:600 var(--fs-body) var(--disp)">${esc(title)}</div>
    ${sub ? `<div class="label" style="max-width:260px">${esc(sub)}</div>` : ''}
  </div>`;
}

function loader() {
  return `<div class="center"><div class="spin"></div></div>`;
}

/* ============================ מסך: בית ============================ */
function viewHome() {
  const open = S.sheet ? ' open' : '';

  return `
    ${topBar({})}

    <!-- המסך עצמו: כותרת, חיפוש, וידית למשיכת הפאנל -->
    <div class="home">
      <div class="hero">
        <div style="font:600 var(--fs-hero)/1.35 var(--disp);text-wrap:pretty">כל חלק. כל רכב.<br>מחיר אחד וברור.</div>
        <form class="searchbar" data-act="search-submit">
          <input name="q" placeholder="שם חלק או מספר מק״ט" value="${esc(S.q)}" autocomplete="off">
          <button class="searchgo" type="submit" aria-label="חיפוש">${ICON.search({ s: 18 })}</button>
        </form>
      </div>


    </div>

    <div class="scrim${open}" data-act="sheet-close"></div>

    <div class="sheetwrap${open}" data-sheet>
      <section class="sheet">
        <div class="sheethead" data-sheet-head>${sheetHead()}</div>
        <div class="sheetscroll" data-sheet-body>${sheetBody()}</div>
      </section>
      <div class="sheetbar" data-sheet-foot>${sheetFoot()}</div>
    </div>`;
}

/* תוכן הפאנל התחתון. הסדר הוא סדר החשיבה של מי שמחפש חלק:
   קודם הרכב — סוג, יצרן, דגם ושנה — ורק אז איזו מערכת ברכב.
   התוכן מוחלף בתוך הפאנל הקיים ולא דרך ציור המסך מחדש, כך שהמעבר
   בין המצבים נשאר רציף והגובה רץ בהנפשה. */
function sheetBody() {
  return S.dept ? sheetDepartment() : sheetDepartments();
}

// הכותרת: ידית משיכה, שם המדף הפתוח, וחזרה למדפים
function sheetHead() {
  const dep = currentDept();
  return `
    <span class="grab"></span>
    <div class="row" style="gap: var(--s3)">
      ${dep ? `<button class="iconbtn" data-act="dept-back" aria-label="חזרה">${ICON.back({ s: 18 })}</button>` : ''}
      <span class="sheettitle">${dep ? esc(dep.label) : 'פילטר'}</span>
    </div>`;
}

// עמוד ראשון: ארבעה מדפים. בוחרים אחד ונכנסים למסננים שלו.
function sheetDepartments() {
  const icons = { parts: ICON.gear, chemistry: ICON.droplet, accessories: ICON.tyre, electronics: ICON.bolt };
  return `
    <div class="stack" style="gap: var(--s5);padding:0 var(--s5)">
      <div class="tiles">
        ${S.depts.map((d) => `<button class="tile" data-act="dept" data-dept="${esc(d.id)}">
          <span class="tile-i">${(icons[d.id] || ICON.package)({ s: 20 })}</span>
          <span class="tile-t">${esc(d.label)}</span>
          <span class="tile-s">${esc(d.hint || '')}</span>
        </button>`).join('') || '<span class="label">טוען…</span>'}
      </div>
    </div>`;
}

// מסננים של מדף אחד. בחלקי חילוף זה מסלול הרכב — סוג, יצרן, דגם, שנה
// ואז המערכת; בשאר המדפים די ברשימת הקטגוריות.
function sheetDepartment() {
  const dep = currentDept();
  if (!dep) return sheetDepartments();
  const isParts = dep.id === 'parts';
  const chosen = S.vehicles.find((v) => v.id === S.vkind);
  const makes = chosen ? chosen.makes : [];
  const other = S.vmake === 'other';
  const makeChosen = S.vmake !== 'all';
  const modelKnown = S.models.includes(S.vmodel);
  const modelCustom = Boolean(S.vmodel) && !modelKnown;
  const section = (id, label, inner) => `
    <div class="stack" data-sec="${id}" style="gap: var(--s3)">
      <span class="label">${label}</span>
      ${inner}
    </div>`;

  return `
    <div class="stack" style="gap: var(--s6);padding:0 var(--s5)">
      ${isParts ? `
        ${section('kind', 'סוג הרכב', `<div class="chips">
          ${S.vehicles.map((v) => `<button class="chip" data-act="vkind" data-vkind="${esc(v.id)}" aria-pressed="${S.vkind === v.id}">${esc(v.label)}</button>`).join('')
            || '<span class="label">טוען…</span>'}
        </div>`)}

        ${makes.length ? section('make', 'יצרן הרכב', `<div class="chips">
          ${makes.map((m) => `<button class="chip" data-act="vmake" data-vmake="${esc(m)}" aria-pressed="${S.vmake === m}">${esc(m)}</button>`).join('')}
          <button class="chip" data-act="vmake" data-vmake="other" aria-pressed="${other}">אחר</button>
        </div>
        ${other ? `<input class="fieldline" data-field="makeq" value="${esc(S.vmakeq)}"
                          placeholder="שם היצרן — למשל Chery" autocomplete="off">` : ''}`) : ''}

        ${makeChosen ? section('model', 'דגם', `
          <select data-field="model-select">${modelOptions()}</select>
          <input class="fieldline" data-field="model" value="${modelCustom ? esc(S.vmodel) : ''}"
                 placeholder="שם הדגם" autocomplete="off" ${modelCustom ? '' : 'hidden'}>`) : ''}

        ${makeChosen ? section('year', 'שנת ייצור', `
          <select data-field="year">
            <option value="">כל השנים</option>
            ${YEARS.map((y) => `<option value="${y}" ${String(S.vyear) === String(y) ? 'selected' : ''}>${y}</option>`).join('')}
          </select>`) : ''}
      ` : ''}

      ${section('cat', isParts ? 'איזה חלק דרוש' : 'מה בדיוק', `<div class="chips">
        <button class="chip" data-act="cat" data-cat="all" aria-pressed="${S.category === 'all'}">הכל</button>
        ${dep.categories.map((c) => `<button class="chip" data-act="cat" data-cat="${esc(c.id)}" aria-pressed="${S.category === c.id}">${esc(c.label)}</button>`).join('')}
      </div>`)}
    </div>`;
}

// אפשרויות הדגם: הרשימה של היצרן, ובסופה אפשרות להקליד דגם שאינו בה
function modelOptions() {
  const known = S.models.includes(S.vmodel);
  const custom = Boolean(S.vmodel) && !known;
  return `<option value="">כל הדגמים</option>` +
    S.models.map((m) => `<option value="${esc(m)}" ${S.vmodel === m ? 'selected' : ''}>${esc(m)}</option>`).join('') +
    `<option value="other" ${custom ? 'selected' : ''}>אחר…</option>`;
}

// הכפתור יושב מחוץ לאזור הנגלל, ולכן נשאר במקומו גם ברשימות ארוכות
function sheetFoot() {
  return `
    ${anyFilter() ? `<button class="isle-x" data-act="clear-filters" aria-label="נקה הכל">${ICON.close({ s: 18 })}</button>` : ''}
    <button class="btn isle" data-act="sheet-search" data-count>${countLabel()}</button>`;
}

// האם נבחר משהו — לפי זה מופיע "נקה הכל" ומשתנה תווית כפתור החיפוש
function anyFilter() {
  return Boolean(S.dept) || S.category !== 'all' || S.vkind !== 'all' || S.vmake !== 'all'
    || Boolean(S.vmodel.trim()) || Boolean(S.vyear);
}

function countLabel() {
  if (!anyFilter()) return 'חיפוש בכל הקטלוג';
  if (S.sheetCount === null) return 'חיפוש';
  if (S.sheetCount === 0) return 'אין תוצאות מתאימות';
  if (S.sheetCount === 1) return 'הצג תוצאה אחת';
  return `הצג ${S.sheetCount} תוצאות`;
}

/* ============================ מסך: חיפוש ============================ */
function viewSearch() {
  const kinds = [['all', 'הכל'], ['orig', 'מקורי'], ['copy', 'חלופי'], ['used', 'משומש']];
  const vk = S.vehicles.find((v) => v.id === S.vkind);
  const activeFilters = [
    S.dept ? deptLabel(S.dept) : null,
    vk ? vk.label : null,
    S.vmake === 'other' ? (S.vmakeq.trim() || 'יצרן אחר') : (S.vmake !== 'all' ? S.vmake : null),
    S.vmodel.trim() || null,
    S.vyear || null,
    S.category !== 'all' ? catLabel(S.category) : null,
  ].filter(Boolean);
  return `
    ${topBar({})}
    <div class="scroll">
      <div class="pad stack" style="gap: var(--s3);padding-top: var(--s4)">
        <form class="searchbar" data-act="search-submit">
          <input name="q" placeholder="שם חלק או מספר מק״ט" value="${esc(S.q)}" autocomplete="off">
          <button class="searchgo" type="submit" aria-label="חיפוש">${ICON.search({ s: 18 })}</button>
        </form>
        <div class="chips">
          ${kinds.map(([k, t]) => `<button class="chip" data-act="kind" data-kind="${k}" aria-pressed="${S.kind === k}">${t}</button>`).join('')}
        </div>
      </div>
      <div class="pad row between" style="padding-top: var(--s5)">
        <span class="label">${S.loading ? 'מחפש…' : resultsWord(shownCount())}</span>
        ${activeFilters.length ? `<button class="label" data-act="clear-filters" style="text-decoration:underline">נקה סינון</button>` : ''}
      </div>
      ${activeFilters.length ? `<div class="pad" style="padding-top: var(--s2)">
        <span class="label">${esc(activeFilters.join(' · '))}</span>
      </div>` : ''}
      <div class="pad stack" style="gap: var(--s3);padding-top: var(--s3)">
        ${S.loading ? loader() : groupResults()}
      </div>
    </div>`;
}


// עברית מבדילה יחיד מרבים, ו"1 ספקים" נקרא כמו טקסט שנוצר במכונה
function suppliersWord(n) { return n === 1 ? 'ספק אחד' : `${n} ספקים`; }

/* המונה סופר את מה שמצויר על המסך ולא את מה שהשרת החזיר: אחרת
   הכותרת אומרת "2 תוצאות" מעל מסך שכתוב בו "אין הצעות". */
function shownCount() {
  if (!S.groups) return S.total;
  return ofKind(S.groups.exact).length + ofKind(S.groups.compatible).length;
}
function resultsWord(n) {
  if (!n) return 'אין תוצאות';
  return n === 1 ? 'תוצאה אחת' : `${n} תוצאות`;
}

/* סינון המצב פועל על הפוזיציות שיש בהן הצעה כזאת: המצב הוא תכונה
   של ההצעה, ולכן פוזיציה נשארת אם מישהו מוכר אותה במצב המבוקש. */
function ofKind(list) {
  if (S.kind === 'all') return list;
  return list.filter((c) => c.by_kind.some((k) => k.kind === S.kind));
}

function groupResults() {
  const g = S.groups;
  if (!g) return loader();
  const exact = ofKind(g.exact);
  const compat = ofKind(g.compatible);

  /* המק״ט נמצא, אבל מסנן המצב הסתיר אותו. מסך ריק כאן הוא שקר:
     יש הצעות, פשוט לא במצב שנבחר. אומרים בדיוק את זה, ונותנים
     כפתור אחד לחזור — במקום להשאיר אדם מול "לא נמצא" על מק״ט
     שהוא בדיוק הקליד. */
  if (!exact.length && !compat.length && (g.exact.length || g.compatible.length)) {
    return `${emptyState(ICON.search({ s: 30 }), 'אין הצעות במצב הזה',
      `המק״ט קיים אצל ${suppliersWord(g.exact.reduce((n, c) => n + c.offers, 0))}, אבל לא במצב שנבחר`)}
      <div class="pad"><button class="btn" data-act="kind" data-kind="all">להראות את כל המצבים</button></div>`;
  }

  if (!exact.length && !compat.length) {
    /* מק״ט שלא נמצא הוא מבוי סתום: "לא נמצא" לבדו לא אומר לאדם מה
       לעשות עכשיו. אם הוקלד מספר — מציעים לבדוק אותו ולפנות לספקים,
       כי מק״ט שאין בקטלוג עדיין יכול להימצא אצל מוכר. */
    return g.query && g.query.numberish
      ? emptyState(ICON.search({ s: 30 }), `המק״ט ${S.q.trim()} לא נמצא`,
          'בדקו את המספר, או חפשו לפי שם החלק — מק״ט שאינו בקטלוג עדיין יכול להיות אצל ספק')
      : emptyState(ICON.search({ s: 30 }), 'לא נמצאו חלקים', 'נסו מק״ט אחר או נקו את הסינון');
  }
  return `
    ${exact.map((c) => posCard(c)).join('')}
    ${compat.length ? compatHead(g.compatible_without_offers) + compat.map((c) => posCard(c)).join('') : ''}`;
}

/* ============ כרטיס פוזיציה ============
   בתוצאות מופיעות פוזיציות ולא הצעות. חיפוש של 04465-02220 היה
   מחזיר ארבעה כרטיסים שהם חלק אחד אצל ארבעה מוכרים; עכשיו זה
   כרטיס אחד, וההשוואה בין המוכרים נמצאת בתוכו.

   המחיר הממוצע יושב בראש הכרטיס, כי זו השאלה הראשונה. לצידו הטווח:
   ממוצע לבדו על חדש מקורי ועל פירוק נותן מחיר שאיש אינו מוכר בו. */
function posCard(c, opts) {
  const o = opts || {};
  const price = c.price
    ? `<div class="stack" style="gap:2px;align-items:flex-end">
         <span class="price">${shekel(c.price.avg)}</span>
         ${c.price.min !== c.price.max
           ? `<span class="mono muted" style="font-size:var(--fs-micro)">${shekel(c.price.min)}—${shekel(c.price.max)}</span>`
           : `<span class="mono muted" style="font-size:var(--fs-micro)">מחיר יחיד</span>`}
       </div>`
    : `<span class="label">אין הצעות</span>`;
  return `<div class="card" data-act="open-pos" data-id="${c.id}" style="cursor:pointer">
    <div class="row" style="align-items:flex-start;gap: var(--s4);padding: var(--s4) 17px">
      <div class="stack" style="flex:1;gap: var(--s2);min-width:0">
        <div class="row" style="gap: var(--s2);align-items:baseline;flex-wrap:wrap">
          <span class="mono" style="font-weight:600;font-size:var(--fs-body);letter-spacing:.4px">${esc(c.number || '')}</span>
          <span class="label">${esc(c.brand)}</span>
        </div>
        ${c.name ? `<span style="font:400 var(--fs-sub)/1.3 var(--sans);color:var(--muted)">${esc(c.name)}</span>` : ''}
        ${c.matched_number && c.matched_number !== c.number
          ? `<span class="label" style="font-size:var(--fs-micro);color:var(--orange)">חיפשתם <span class="mono">${esc(c.matched_number)}</span> · המק״ט הראשי היום</span>`
          : c.aka.length ? `<span class="label" style="font-size:var(--fs-micro)">ידוע גם כ <span class="mono">${esc(c.aka.join(' · '))}</span></span>` : ''}
        ${c.fits && c.fits.length ? `<span class="mono muted" style="font-size:var(--fs-label)">${esc(c.fits[0])}</span>` : ''}
        <div class="row" style="gap: var(--s2);flex-wrap:wrap;padding-top:2px">
          ${c.by_kind.map((k) => kindTag(k.kind)).join('')}
          <span class="label">${c.offers === 1 ? 'ספק אחד' : `${c.offers} ספקים`}${c.in_stock ? '' : ' · אין במלאי'}</span>
        </div>
      </div>
      ${price}
    </div>
  </div>`;
}

/* כותרת "עשוי להתאים" עומדת לפני הרשימה ולא על כל כרטיס: הפוזיציות
   שמתחתיה הן של מנפיקים אחרים, וזו תכונה של הקבוצה כולה.

   ההסתייגות יושבת מאחורי סימן שאלה ולא בשורה שנייה קבועה: מי שכבר
   הבין את הכותרת אינו צריך לקרוא אותה שוב בכל חיפוש, ומי שמתלבט
   לוחץ ומקבל אותה. אזהרה שתמיד על המסך מפסיקים לראות. */
function compatHead(empty) {
  return `<div class="stack" style="gap: var(--s2);padding-top: var(--s4)">
    <div class="row between" style="gap: var(--s3)">
      <span class="row" style="gap: var(--s2)">
        <span style="font:500 var(--fs-body) var(--sans)">עשוי להתאים</span>
        <button class="qmark" data-act="compat-note" aria-expanded="${S.compatNote}"
                aria-controls="compatNote" aria-label="על ההתאמה">?</button>
      </span>
      ${empty ? `<span class="label">עוד ${empty} מק״טים · אין במלאי</span>` : ''}
    </div>
    ${S.compatNote ? `<div class="note" id="compatNote">${NOTE_FIT}</div>` : ''}
  </div>`;
}

/* ============================ מסך: כרטיס חלק ============================ */
function viewPart() {
  const p = S.part;
  if (!p) return `${topBar({ back: S.partBack || 'search' })}${loader()}`;
  const s = p.seller;
  const all = p.interchange_numbers || [];
  const oems = all.filter((n) => n.is_oem);
  const nums = all.filter((n) => !n.is_oem);

  return `
    ${topBar({ back: S.partBack || 'search', actions: '' })}
    <div class="scroll">
      <div class="pad row" style="align-items:flex-start;gap: var(--s4);padding-top: var(--s5)">
        <div class="stack" style="flex:1;gap: var(--s3);min-width:0">
          <span style="font:600 var(--fs-lead)/1.25 var(--disp)">${esc(p.name)}</span>
          <span class="mono" style="font-weight:600;font-size:var(--fs-body);letter-spacing:.4px">${esc(p.part_no)}</span>
          <div class="row" style="gap: var(--s2);flex-wrap:wrap">
            ${kindTag(p.kind)}
            ${p.maker ? `<span class="mono muted" style="font-size:var(--fs-label)">${esc(p.maker)}</span>` : ''}
          </div>
          ${p.fits ? `<span class="mono muted" style="font-size:var(--fs-label)">${esc(p.fits)}</span>` : ''}
        </div>
        ${thumb(p, 96)}
      </div>

      ${oems.length ? `<div class="pad stack" style="gap: var(--s3);padding-top: var(--s5)">
        <span class="label">מק״ט מקורי · החלק שזה מחליף</span>
        <div class="chips" style="gap: var(--s2)">
          ${oems.map((n) => `<span class="num oem" style="font-size:var(--fs-sub);padding: var(--s2) 10px" title="${esc(n.brand || '')}">${esc(n.number)}</span>`).join('')}
        </div>
      </div>` : ''}

      ${nums.length ? `<div class="pad stack" style="gap: var(--s3);padding-top: var(--s5)">
        <span class="label">מק״טים של אותו חלק · ${nums.length}</span>
        <div class="chips" style="gap: var(--s2)">
          ${nums.map((n) => `<span class="num" style="font-size:var(--fs-sub);padding: var(--s2) 10px;color:var(--ink)" title="${esc(n.brand || '')}">${esc(n.number)}</span>`).join('')}
        </div>
      </div>` : ''}

      <div class="pad" style="padding-top: var(--s4)">
        <div class="card">
          <div class="row" style="gap: var(--s3);padding: var(--s4) 17px;cursor:pointer" data-act="toggle-sup">
            <div style="width:32px;height:32px;border-radius:999px;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:center;font:600 var(--fs-sub) var(--mono)">${esc((s && s.name ? s.name.trim()[0] : '?'))}</div>
            <div class="stack" style="flex:1;gap: var(--s1);min-width:0">
              <span style="font:500 var(--fs-body) var(--sans)">${esc(s ? s.name : 'לא ידוע')}</span>
              <span class="label">המוכר · ${esc(s ? s.city : '')}</span>
            </div>
            ${s && s.verified ? `<span class="row" style="gap: var(--s2);padding: var(--s2) 10px;border:1px solid #b9c4ae;border-radius:6px;background:#eef3e8;color:var(--orig-fg);font:600 var(--fs-micro) var(--sans)">${ICON.badge({ s: 12 })}מאומת</span>` : ''}
            <span class="label">${S.supOpen ? 'הסתר' : 'הצג'}</span>
          </div>
          ${S.supOpen && s ? `<div class="hr stack" style="padding: var(--s4) 17px;gap: var(--s3)">
            <div class="row between"><span class="label">טלפון</span><span class="mono" style="font-size:var(--fs-sub)">${esc(s.phone)}</span></div>
            <div class="row between"><span class="label">מלאי</span><span style="font:500 var(--fs-sub) var(--sans)">${p.qty > 0 ? `${p.qty} יחידות` : 'אזל מהמלאי'}</span></div>
            <div class="row between"><span class="label">דירוג</span><span class="mono" style="font-size:var(--fs-sub)">${s.rating} · ${s.reviews_count}</span></div>
            <div class="row between" style="align-items:baseline"><span style="font:500 var(--fs-sub) var(--sans)">מחיר</span><span class="mono" style="font:600 var(--fs-lead) var(--mono)">${shekel(p.price)}</span></div>
            <div class="row" style="gap: var(--s2)">
              <button class="btn" data-act="start-chat" data-id="${p.id}" style="flex:1">בקשה בצ׳אט</button>
              <a class="btn ghost" href="tel:${esc(s.phone)}" style="width:50px;display:flex;align-items:center;justify-content:center;text-decoration:none">${ICON.phone({ s: 17 })}</a>
            </div>
          </div>` : ''}
        </div>
      </div>

      ${p.position_id ? `<div class="pad" style="padding-top: var(--s5)">
        <div class="card row between" style="gap: var(--s3);padding: var(--s4) 17px;cursor:pointer"
             data-act="open-pos" data-id="${p.position_id}">
          <div class="stack" style="gap: var(--s1);min-width:0">
            <span style="font:500 var(--fs-sub) var(--sans)">כל הספקים של המק״ט הזה</span>
            <span class="label">להשוות מחיר, מצב ומלאי</span>
          </div>
          <span class="mono" style="font-weight:600">${esc(p.part_no)}</span>
        </div>
      </div>` : ''}
      </div>
    </div>`;
}

/* ============================ מסך: המלאי שלי ============================ */
function viewStock() {
  if (!authed() || !isSeller()) {
    return `${topBar({})}${emptyState(ICON.package({ s: 30 }), 'הקבינט סגור', 'התחברו כמוכר כדי לנהל את המלאי')}
      <div class="pad" style="padding-bottom:120px"><button class="btn" data-act="profile">להתחברות</button></div>`;
  }
  const st = S.sellerStats;
  return `
    ${topBar({ actions: `<button class="iconbtn" data-act="profile">${ICON.settings({ s: 18 })}</button>` })}
    <div class="scroll">
      <div class="pad stack" style="gap: var(--s1);padding-top: var(--s5)">
        <span style="font:600 var(--fs-lead) var(--disp)">המלאי שלי</span>
        <span class="label">${esc(S.me ? S.me.name : '')}${S.me && S.me.verified ? ' · מוכר מאומת' : ''}</span>
      </div>
      <div class="pad row" style="gap: var(--s2);padding-top: var(--s4)">
        <div class="stack" style="flex:1;background:var(--ink);color:#fff;border-radius:16px;padding: var(--s4) 16px;gap: var(--s2)">
          <span class="mono" style="font:600 var(--fs-lead) var(--mono)">${st ? st.in_stock : '—'}</span>
          <span style="font:400 var(--fs-label) var(--sans);color:rgba(255,255,255,.6)">יחידות במלאי</span>
        </div>
        <div class="stack" style="flex:1;background:var(--card);border-radius:16px;padding: var(--s4) 16px;gap: var(--s2)">
          <span class="mono" style="font:600 var(--fs-lead) var(--mono)">${st ? st.out_of_stock : '—'}</span>
          <span class="label" style="font-size:var(--fs-label)">אזלו</span>
        </div>
        <div class="stack" style="flex:1;background:var(--card);border-radius:16px;padding: var(--s4) 16px;gap: var(--s2)">
          <span class="mono" style="font:600 var(--fs-lead) var(--mono)">${st ? st.requests : '—'}</span>
          <span class="label" style="font-size:var(--fs-label)">בקשות</span>
        </div>
      </div>
      <div class="pad row between" style="padding-top: var(--s5)">
        <span class="label">הפוזיציות שלי</span>
        <span class="label mono">${S.stock.length}</span>
      </div>
      <div class="pad stack" style="gap: var(--s3);padding-top: var(--s3)">
        ${S.loading ? loader() : S.stock.map(stockCard).join('')}
        ${!S.loading && !S.stock.length ? emptyState(ICON.package({ s: 30 }), 'אין עדיין פוזיציות', 'הוסיפו את החלק הראשון עם הכפתור למטה') : ''}
        ${st && st.out_of_stock > 0 ? `<div class="card row" style="gap: var(--s3);padding: var(--s4) 17px;border-inline-start:3px solid #d1791f">
          ${ICON.warn({ s: 19 })}
          <div class="stack" style="flex:1;gap: var(--s1)">
            <span style="font:500 var(--fs-sub) var(--sans)">${st.out_of_stock} פוזיציות אזלו מהמלאי</span>
            <span class="label">קונים רואים אותן כלא זמינות</span>
          </div>
        </div>` : ''}
      </div>
    </div>`;
}

/* כרטיס מלאי: המחיר והכמות בעמודה שבצד, יחד עם התמונה, והעמודה
   ממורכזת לגובה מול הטקסט — לא נצמדת לקצה העליון. המק״ט המקורי
   יושב מתחת לשם, כי זה מה שהקונה מחפש; כשיש כמה, מוצגים שניים
   וכפתור פותח את השאר. המק״טים החלופיים נשארים למטה ולא
   מתערבבים איתם. */
const OEM_SHOWN = 2;

function stockCard(p) {
  const all = p.interchange_numbers || [];
  const oems = all.filter((n) => n.is_oem);
  const alts = all.filter((n) => !n.is_oem);
  const open = S.stockOems.has(p.id);
  const shown = open ? oems : oems.slice(0, OEM_SHOWN);
  return `<div class="card stack" style="padding: var(--s4) 17px;gap: var(--s4)">
    <div class="row" style="align-items:center;gap: var(--s4)">
      <div class="stack" style="flex:1;gap: var(--s2);min-width:0">
        <span style="font:500 var(--fs-body)/1.25 var(--sans)">${esc(p.name)}</span>
        <span class="mono" style="font-weight:600;font-size:var(--fs-sub)">${esc(p.part_no)}</span>
        ${oems.length ? `<div class="chips" style="gap: var(--s2);align-items:center">
          <span class="label">מק״ט מקורי</span>
          ${shown.map((n) => `<span class="num oem">${esc(n.number)}</span>`).join('')}
          ${oems.length > OEM_SHOWN ? `<button data-act="toggle-oems" data-id="${p.id}"
            style="font:500 var(--fs-label) var(--sans);color:var(--ink);text-decoration:underline;text-underline-offset:3px;padding: var(--s2) 0"
            >${open ? 'הסתר' : `הצג הכול · ${oems.length}`}</button>` : ''}
        </div>` : ''}
        ${p.fits ? `<span class="mono muted" style="font-size:var(--fs-label)">${esc(p.fits)}</span>` : ''}
        <span>${kindTag(p.kind)}</span>
      </div>
      <div class="stack" style="align-items:center;gap: var(--s2);flex:none">
        ${thumb(p, 66)}
        <span class="price" style="font-size:var(--fs-body)">${shekel(p.price)}</span>
        <span class="mono muted" style="font-size:var(--fs-label)">${p.qty > 0 ? `×${p.qty} במלאי` : 'אזל'}</span>
      </div>
    </div>
    ${alts.length ? `<div class="stack" style="gap: var(--s2)"><span class="label">מק״טים חלופיים</span>
      <div class="chips" style="gap: var(--s2)">${alts.slice(0, 4).map((n) => `<span class="num">${esc(n.number)}</span>`).join('')}</div></div>` : ''}
    <div class="row hr" style="gap: var(--s2);padding-top: var(--s3)">
      <button class="btn row" data-act="edit" data-id="${p.id}" style="flex:1;justify-content:center;gap: var(--s2);padding: var(--s3);font-size:var(--fs-sub)">${ICON.pencil({ s: 14 })}ערוך</button>
      <button class="btn ghost" data-act="delete" data-id="${p.id}" style="width:46px;padding: var(--s3);display:flex;align-items:center;justify-content:center">${ICON.trash({ s: 16 })}</button>
    </div>
  </div>`;
}

// שורת ההתאמה שמופיעה בכרטיס נבנית מהשדות המובנים, כדי שהתצוגה
// והמסננים לא יסתרו זה את זה.
function fitsText(make, model, from, to) {
  const head = [make, model].filter(Boolean).join(' ');
  const years = from && to ? `${from}—${to}` : (from ? `${from}+` : (to ? `עד ${to}` : ''));
  if (!head) return years || null;
  return years ? `${head} · ${years}` : head;
}

/* רשימת היצרנים תלויה בסוג הרכב, ומתחלפת גם בלי ציור מחדש של הטופס */
function categoryOptions(dep, selected) {
  return dep.categories
    .map((c) => `<option value="${esc(c.id)}" ${selected === c.id ? 'selected' : ''}>${esc(c.label)}</option>`)
    .join('');
}

function makeOptions(makes, selected) {
  const known = makes.includes(selected);
  return `<option value="">יצרן</option>` +
    makes.map((m) => `<option value="${esc(m)}" ${selected === m ? 'selected' : ''}>${esc(m)}</option>`).join('') +
    `<option value="other" ${selected && !known ? 'selected' : ''}>אחר…</option>`;
}


/* ============================ מסך: פוזיציה ============================
   התמצית למעלה עונה על "מה זה בעצם": איזה חלק, באילו מק״טים הוא
   נקרא, על איזה רכב הוא עולה וכמה הוא עולה. רק אחר כך, בגלילה,
   מגיעים המוכרים — כי לפני שיודעים מה זה, אין טעם להשוות מחיר. */
function viewPosition() {
  const c = S.pos;
  if (!c) return `${topBar({ back: 'search' })}${loader()}`;
  const nums = [c.number, ...c.aka].filter(Boolean);
  const kinds = c.by_kind.filter((k) => k.offers);
  return `
    ${topBar({ back: 'search', actions: '' })}
    <div class="scroll">
      <div class="pad stack" style="gap: var(--s4);padding-top: var(--s5)">
        <div class="stack" style="gap: var(--s2)">
          <span class="label">${esc(c.brand)}</span>
          <span class="mono" style="font:600 var(--fs-hero)/1.1 var(--mono);letter-spacing:.5px">${esc(c.number || '')}</span>
          ${c.name ? `<span style="font:400 var(--fs-body)/1.35 var(--sans);color:var(--muted)">${esc(c.name)}</span>` : ''}
        </div>

        <div class="card stack" style="gap:0;padding:0">
          ${nums.length > 1 ? posRow('מק״טים', `<span class="mono" style="font-size:var(--fs-sub)">${esc(nums.join(' · '))}</span>`) : ''}
          ${c.fits && c.fits.length ? posRow('מתאים ל', c.fits.map((f) => `<span class="mono" style="font-size:var(--fs-sub)">${esc(f)}</span>`).join('<br>')) : ''}
          ${c.price ? posRow('מחיר ממוצע',
            `<span class="row" style="gap: var(--s3);align-items:baseline">
               <span style="font:600 var(--fs-lead) var(--disp)">${shekel(c.price.avg)}</span>
               ${c.price.min !== c.price.max ? `<span class="mono muted" style="font-size:var(--fs-label)">${shekel(c.price.min)}—${shekel(c.price.max)}</span>` : ''}
             </span>`) : ''}
          ${kinds.length > 1 ? posRow('לפי מצב', kinds.map((k) =>
            `<span class="row" style="gap: var(--s2);align-items:baseline">${kindTag(k.kind)}<span style="font:400 var(--fs-sub) var(--sans)">מ־<span class="mono">${shekel(k.min)}</span></span></span>`).join('')) : ''}
          ${posRow('ספקים', `<span style="font:400 var(--fs-sub) var(--sans)"><span class="mono">${c.offers}</span>${c.in_stock < c.offers ? ` · <span class="mono">${c.in_stock}</span> במלאי` : ''}</span>`)}
        </div>

        <div class="stack" style="gap:2px;padding-top: var(--s2)">
          <span style="font:500 var(--fs-body) var(--sans)">ספקים</span>
          <span class="label">אותו מק״ט אצל ספקים שונים · הזול קודם</span>
        </div>
      </div>

      <div class="pad stack" style="gap: var(--s3)">
        ${S.posLoading ? loader()
          : S.posOffers.length
            ? S.posOffers.map(offerCard).join('')
            : emptyState(ICON.search({ s: 30 }), 'אין הצעות כרגע', 'המק״ט מוכר לנו, אבל אף ספק לא מציע אותו')}
      </div>

      ${S.posCompat.length ? `<div class="pad stack" style="gap: var(--s3)">
        ${compatHead(S.posEmpty)}
        ${S.posCompat.map((x) => posCard(x)).join('')}
      </div>` : ''}
      <div style="height:calc(var(--dock-h) + var(--s8))"></div>
    </div>`;
}

function posRow(label, value) {
  return `<div class="row between" style="gap: var(--s4);padding: var(--s3) 17px;border-top:1px solid var(--line);align-items:flex-start">
    <span class="label" style="flex:none">${esc(label)}</span>
    <span style="text-align:end;min-width:0">${value}</span>
  </div>`;
}

/* כרטיס מוכר בתוך פוזיציה. המק״ט אינו חוזר כאן — הוא בכותרת המסך
   וזהה לכולם; מה שמבדיל בין המוכרים הוא מחיר, מצב ומלאי. */
function offerCard(p) {
  const out = p.stock !== 'in' || !p.qty;
  return `<div class="card row" style="align-items:flex-start;gap: var(--s4);padding: var(--s4) 17px;cursor:pointer" data-act="open-offer" data-id="${p.id}">
    <div class="stack" style="flex:1;gap: var(--s2);min-width:0">
      <span style="font:500 var(--fs-body)/1.25 var(--sans)">${esc((p.seller && p.seller.name) || 'ספק')}</span>
      <span class="label">${esc((p.seller && p.seller.city) || '')}${p.seller && p.seller.verified ? ' · מאומת' : ''}</span>
      <div class="row" style="gap: var(--s2);flex-wrap:wrap;padding-top:2px">
        ${kindTag(p.kind)}
        ${p.maker ? `<span class="mono muted" style="font-size:var(--fs-label)">${esc(p.maker)}</span>` : ''}
        ${p.kind === 'used' && p.condition_pct ? `<span class="label">מצב <span class="mono">${p.condition_pct}%</span></span>` : ''}
        ${out ? `<span class="label" style="color:#a3560f">אזל</span>` : ''}
      </div>
    </div>
    <span class="price">${shekel(p.price)}</span>
  </div>`;
}

/* ============================ מסך: פוזיציה חדשה ============================ */
function viewCreate() {
  const d = S.draft || {};
  const editing = Boolean(d.id);
  const kinds = [['orig', 'מקורי'], ['copy', 'חלופי'], ['used', 'משומש']];
  const nums = d.nums || [];
  const oems = d.oems || [];
  // חלק חלופי או משומש נמצא לפי המק״ט המקורי שהוא מחליף, ולכן השדה
  // הזה נפתח בדיוק כשהמצב אינו "מקורי"
  const needsOem = (d.kind || 'copy') !== 'orig';
  // אחוז מצב הוא תכונה של חלק משומש בלבד: חלק חדש "במצב 80%" הוא
  // סתירה, ולכן השדה כלל אינו קיים אצלו ולא רק מוסתר
  const cond = d.condition_pct == null ? 70 : d.condition_pct;
  const vKind = d.vehicle_kind || '';
  const vMakes = (S.vehicles.find((v) => v.id === vKind) || {}).makes || [];
  // יצרן שאינו ברשימה נשמר כמו שהוקלד, והטופס חוזר אליו במצב "אחר"
  const vCustom = Boolean(d.vehicle_make) && !vMakes.includes(d.vehicle_make);
  // המחלקה נגזרת מהקטגוריה השמורה — אין שדה נפרד בטבלה, ולכן אי אפשר
  // שהשניים ייצאו מסונכרנים
  const formDept = deptOf(d.category) || S.depts[0] || { id: '', categories: [] };
  return `
    <div class="top">
      <button class="iconbtn" data-act="stock">${ICON.close({ s: 18 })}</button>
      <span style="font:600 var(--fs-body) var(--disp)">${editing ? 'עריכת פוזיציה' : 'פוזיציה חדשה'}</span>
      <span style="width:40px"></span>
    </div>
    <div class="scroll">
      <form class="pad stack" style="gap: var(--s4);padding-top: var(--s5)" data-act="save-part">
        <div class="row" style="gap: var(--s3);align-items:flex-start">
          <label class="photo${d.image_url ? ' has' : ''}" style="${d.image_url ? `background-image:url('${esc(d.image_url)}')` : ''}">
            <input type="file" accept="image/*" data-act="pick-photo" hidden>
            ${d.image_url ? `<button type="button" class="photo-x" data-act="drop-photo" aria-label="הסר תמונה">${ICON.close({ s: 12 })}</button>`
              : `${ICON.camera({ s: 20 })}<span style="font:400 var(--fs-label) var(--sans)">הוסף תמונה</span>`}
          </label>
          <div class="field" style="flex:1">
            <span class="label">שם החלק</span>
            <input name="name" required value="${esc(d.name || '')}" placeholder="רפידות בלימה קדמיות">
            <label class="row" style="gap: var(--s2);font:400 var(--fs-label) var(--sans);color:var(--muted)">
              <input type="checkbox" name="cutout" ${S.cutout ? 'checked' : ''} data-act="toggle-cutout">
              הסרת רקע אוטומטית
            </label>
          </div>
        </div>
        <div class="field">
          <span class="label">מספר מק״ט ראשי · חובה</span>
          <input class="mono" name="part_no" required value="${esc(d.part_no || '')}" placeholder="04465-02220">
        </div>
        ${needsOem ? `<div class="field">
          <span class="label">מק״ט מקורי · את איזה חלק זה מחליף</span>
          <div class="chips">
            ${oems.map((n, i) => `<span class="num oem" style="display:flex;align-items:center;gap: var(--s2);padding: var(--s2) 12px;font-size:var(--fs-label)">${esc(n)}<button type="button" data-act="rm-oem" data-i="${i}" aria-label="הסר">${ICON.close({ s: 11 })}</button></span>`).join('')}
            <button type="button" class="row" data-act="add-oem" style="gap: var(--s2);padding: var(--s2) 12px;border-radius:999px;border:1px dashed #c9c2b8;font:500 var(--fs-label) var(--sans);color:var(--muted)">${ICON.plus({ s: 12 })}${oems.length ? 'עוד מק״ט מקורי' : 'הוסף מק״ט מקורי'}</button>
          </div>
          <span class="label" style="font-size:var(--fs-label)">${oems.length ? 'הקונים מחפשים לפי המספר הזה' : 'בלי המספר המקורי קשה למצוא את החלק'}</span>
        </div>` : ''}

        <div class="field">
          <span class="label">מק״טים מתחלפים · יופיעו בחיפוש</span>
          <div class="chips" id="numsBox">
            ${nums.map((n, i) => `<span class="num" style="display:flex;align-items:center;gap: var(--s2);padding: var(--s2) 12px;font-size:var(--fs-label);color:var(--ink)">${esc(n)}<button type="button" data-act="rm-num" data-i="${i}" aria-label="הסר">${ICON.close({ s: 11 })}</button></span>`).join('')}
            <button type="button" class="row" data-act="add-num" style="gap: var(--s2);padding: var(--s2) 12px;border-radius:999px;border:1px dashed #c9c2b8;font:500 var(--fs-label) var(--sans);color:var(--muted)">${ICON.plus({ s: 12 })}הוסף מק״ט</button>
          </div>
        </div>
        <div class="row" style="gap: var(--s3);align-items:flex-start">
          <div class="field" style="flex:1"><span class="label">יצרן</span><input class="mono" name="maker" value="${esc(d.maker || '')}" placeholder="ADVICS"></div>
          <div class="field" style="flex:1">
            <span class="label">מצב</span>
            <div class="row" style="gap: var(--s2)">
              ${kinds.map(([k, t]) => `<button type="button" class="chip" data-act="set-kind" data-kind="${k}" aria-pressed="${(d.kind || 'copy') === k}" style="flex:1;text-align:center;border-radius:12px;padding: var(--s3) 0">${t}</button>`).join('')}
            </div>
          </div>
        </div>
        ${(d.kind || 'copy') === 'used' ? `<div class="field">
          <div class="row between">
            <span class="label">מצב החלק</span>
            <span class="mono" id="condOut" style="font:600 var(--fs-body) var(--mono)">${cond}%</span>
          </div>
          <input class="cond" type="range" name="condition_pct" min="10" max="100" step="5"
                 value="${cond}" style="--p:${Math.round((cond - 10) / 0.9)}" aria-label="מצב החלק באחוזים">
          <div class="row between"><span class="label">שחוק</span><span class="label">כמעט חדש</span></div>
        </div>` : ''}
        <div class="row" style="gap: var(--s3)">
          <div class="field" style="flex:1">
            <span class="label">מחלקה</span>
            <select name="department">
              ${S.depts.map((dep) => `<option value="${esc(dep.id)}" ${formDept.id === dep.id ? 'selected' : ''}>${esc(dep.label)}</option>`).join('')}
            </select>
          </div>
          <div class="field" style="flex:1">
            <span class="label">קטגוריה</span>
            <select name="category">${categoryOptions(formDept, d.category)}</select>
          </div>
        </div>
        <div class="field">
          <span class="label">התאמה לרכב · לא חובה</span>
          <div class="row" style="gap: var(--s3)">
            <select name="vehicle_kind" style="flex:1">
              <option value="">סוג רכב</option>
              ${S.vehicles.map((v) => `<option value="${esc(v.id)}" ${vKind === v.id ? 'selected' : ''}>${esc(v.label)}</option>`).join('')}
            </select>
            <select name="vehicle_make" style="flex:1" ${vMakes.length ? '' : 'disabled'}>
              ${makeOptions(vMakes, d.vehicle_make || '')}
            </select>
          </div>
          <input name="vehicle_make_other" value="${esc(vCustom ? d.vehicle_make : '')}"
                 placeholder="שם היצרן" ${vCustom ? '' : 'hidden'}>
        </div>
        <div class="row" style="gap: var(--s3)">
          <div class="field" style="flex:2"><span class="label">דגם</span><input class="mono" name="vehicle_model" list="formModels" value="${esc(d.vehicle_model || '')}" placeholder="COROLLA E210" autocomplete="off"><datalist id="formModels"></datalist></div>
          <div class="field" style="flex:1"><span class="label">משנת</span><input class="mono" name="year_from" type="number" min="1950" max="2100" value="${esc(d.year_from != null ? d.year_from : '')}" placeholder="2016"></div>
          <div class="field" style="flex:1"><span class="label">עד שנת</span><input class="mono" name="year_to" type="number" min="1950" max="2100" value="${esc(d.year_to != null ? d.year_to : '')}" placeholder="2023"></div>
        </div>
        <div class="row" style="gap: var(--s3)">
          <div class="field" style="flex:1"><span class="label">מחיר ₪</span><input class="mono" name="price" type="number" min="0" required value="${esc(d.price != null ? d.price : '')}" placeholder="210"></div>
          <div class="field" style="flex:1"><span class="label">כמות</span><input class="mono" name="qty" type="number" min="0" required value="${esc(d.qty != null ? d.qty : 0)}" placeholder="6"></div>
        </div>
        <button class="btn" type="submit" style="margin-top: var(--s1)">${editing ? 'שמור שינויים' : 'פרסם פוזיציה'}</button>
      </form>
    </div>`;
}

/* ============================ מסך: רשימת שיחות ============================ */
function viewChats() {
  if (!authed()) {
    return `${topBar({})}${emptyState(ICON.chat({ s: 30 }), 'אין עדיין שיחות', 'התחברו כדי לפנות למוכרים')}
      <div class="pad" style="padding-bottom:120px"><button class="btn" data-act="profile">להתחברות</button></div>`;
  }
  return `
    ${topBar({ actions: '' })}
    <div class="scroll">
      <div class="pad" style="padding-top: var(--s5)"><span style="font:600 var(--fs-lead) var(--disp)">הודעות</span></div>
      <div class="pad stack" style="gap: var(--s3);padding-top: var(--s4)">
        ${S.loading ? loader()
          : S.conversations.length
            ? S.conversations.map((c) => {
                const other = isSeller() ? (c.buyer && c.buyer.name) : (c.seller && c.seller.name);
                return `<div class="card row" style="gap: var(--s3);padding: var(--s4) 16px;cursor:pointer" data-act="open-chat" data-id="${c.id}">
                  <div style="width:40px;height:40px;border-radius:999px;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:center;font:600 var(--fs-sub) var(--mono)">${esc(other ? other.trim()[0] : '?')}</div>
                  <div class="stack" style="flex:1;gap: var(--s1);min-width:0">
                    <span style="font:500 var(--fs-body) var(--sans)">${esc(other || '—')}</span>
                    <span class="label" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(c.last_message ? c.last_message.body : (c.part ? c.part.name : ''))}</span>
                  </div>
                  ${c.part ? `<span class="mono muted" style="font-size:var(--fs-label)">${esc(c.part.part_no)}</span>` : ''}
                </div>`;
              }).join('')
            : emptyState(ICON.chat({ s: 30 }), 'אין עדיין שיחות', 'פנו למוכר מתוך כרטיס החלק')}
      </div>
    </div>`;
}

/* ============================ מסך: שיחה ============================ */
function viewChat() {
  const c = S.conv;
  if (!c) return `${topBar({ back: 'chats' })}${loader()}`;
  const other = isSeller() ? c.buyer : c.seller;
  const p = c.part;
  const pending = S.requests.filter((r) => r.status === 'sent');

  return `
    <div class="top" style="padding-bottom: var(--s4);border-bottom:1px solid var(--line)">
      <div class="row" style="flex:1;gap: var(--s3);margin-inline-end:11px">
        <div style="width:40px;height:40px;border-radius:999px;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:center;font:600 var(--fs-sub) var(--mono)">${esc(other && other.name ? other.name.trim()[0] : '?')}</div>
        <div class="stack" style="flex:1;gap: var(--s1);min-width:0">
          <div class="row" style="gap: var(--s2)">
            <span style="font:500 var(--fs-body) var(--sans)">${esc(other ? other.name : '—')}</span>
            ${!isSeller() && c.seller && c.seller.verified ? `<span style="color:var(--orig-fg)">${ICON.badge({ s: 14 })}</span>` : ''}
          </div>
          ${!isSeller() && c.seller ? `<span class="label">${esc(c.seller.city)}</span>` : ''}
        </div>
      </div>
      <button class="iconbtn" data-act="chats" aria-label="חזרה">${ICON.backL({ s: 18 })}</button>
    </div>

    ${p ? `<div class="pad" style="padding-top: var(--s4)">
      <div class="card row" style="gap: var(--s3);padding: var(--s4) 15px">
        ${thumb(p, 46)}
        <div class="stack" style="flex:1;gap: var(--s2);min-width:0">
          <span style="font:500 var(--fs-sub) var(--sans)">${esc(p.name)}</span>
          <span class="mono" style="font-weight:600;font-size:var(--fs-sub)">${esc(p.part_no)}</span>
        </div>
        <span class="price" style="font-size:var(--fs-sub)">${shekel(p.price)}</span>
      </div>
    </div>` : ''}

    <div class="scroll" id="thread" style="padding-bottom: var(--s5)">
      <div class="pad stack" style="gap: var(--s3);padding-top: var(--s4)">
        ${S.messages.length ? '' : `<span class="label" style="align-self:center">אין עדיין הודעות</span>`}
        ${S.messages.map((m) => {
          const mine = m.sender_role === S.role;
          return `<div class="bubble ${mine ? 'me' : 'them'}">${esc(m.body)}</div>
                  <span class="time" style="align-self:${mine ? 'flex-end' : 'flex-start'}">${timeOf(m.created_at)}</span>`;
        }).join('')}

        ${S.requests.map((r) => `<div class="card stack" style="align-self:${isSeller() ? 'flex-start' : 'flex-end'};width:88%;padding: var(--s4) 16px;gap: var(--s3)">
          <span class="label">בקשת הזמנה · ${r.status === 'sent' ? 'ממתינה' : r.status === 'accepted' ? 'אושרה' : 'נדחתה'}</span>
          <div class="stack" style="gap: var(--s2)">
            <div class="row between"><span class="label">מק״ט</span><span class="mono" style="font-size:var(--fs-sub)">${esc(r.part_no || '—')}</span></div>
            <div class="row between"><span class="label">כמות</span><span class="mono" style="font-size:var(--fs-sub)">${r.qty}</span></div>
            ${r.vehicle ? `<div class="row between"><span class="label">רכב</span><span class="mono" style="font-size:var(--fs-sub)">${esc(r.vehicle)}</span></div>` : ''}
          </div>
          ${isSeller() && r.status === 'sent' ? `<div class="row" style="gap: var(--s2)">
            <button class="btn" data-act="answer" data-id="${r.id}" data-status="accepted" style="flex:1;padding: var(--s4);font-size:var(--fs-sub)">אשר</button>
            <button class="btn ghost" data-act="answer" data-id="${r.id}" data-status="declined" style="padding: var(--s4) 16px;font-size:var(--fs-sub)">דחה</button>
          </div>` : ''}
        </div>`).join('')}
      </div>
    </div>

    <div class="row" style="padding: var(--s3) 18px calc(24px + env(safe-area-inset-bottom));gap: var(--s3);flex:none">
      ${!isSeller() && p ? `<button class="iconbtn" data-act="order-form" style="border-radius:999px;width:46px;height:46px">${ICON.plus({ s: 18 })}</button>` : ''}
      <form class="row" data-act="send-msg" style="flex:1;gap: var(--s3)">
        <input name="body" placeholder="כתוב הודעה…" autocomplete="off"
               style="flex:1;background:var(--card);border-radius:999px;padding: var(--s4) 18px;border:0;outline:none;font-size:var(--fs-body);min-width:0">
        <button type="submit" style="width:46px;height:46px;border-radius:999px;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:center">${ICON.send({ s: 18 })}</button>
      </form>
    </div>`;
}

/* ============================ מסך: פרופיל / התחברות ============================ */
function viewProfile() {
  if (authed()) {
    return `
      ${topBar({ actions: '' })}
      <div class="scroll">
        <div class="pad stack" style="gap: var(--s5);padding-top: var(--s6)">
          <div class="stack" style="gap: var(--s1)">
            <span style="font:600 var(--fs-lead) var(--disp)">${esc(S.me ? S.me.name : 'החשבון שלי')}</span>
            <span class="label">${isSeller() ? 'חשבון מוכר' : 'חשבון קונה'}${S.me && S.me.city ? ' · ' + esc(S.me.city) : ''}</span>
          </div>
          ${isSeller() ? `<button class="btn ghost" data-act="stock">למלאי שלי</button>` : ''}
          <button class="btn line row" data-act="logout" style="justify-content:center;gap: var(--s2)">${ICON.logout({ s: 16 })}התנתקות</button>
        </div>
      </div>`;
  }

  const asSeller = S.authTab === 'seller';
  const reg = S.authMode === 'register';
  return `
    ${topBar({ actions: '' })}
    <div class="scroll">
      <div class="pad stack" style="gap: var(--s2);padding-top: var(--s8);padding-bottom: var(--s7)">
        <span style="font:600 var(--fs-hero)/1.2 var(--disp)">ברוכים הבאים</span>
        <span class="label">${asSeller ? 'נהלו את כרטיסי המוצר שלכם' : 'מצאו כל חלק לפי מק״ט'}</span>
      </div>
      <div class="pad stack" style="gap: var(--s4)">
        <div class="row" style="gap: var(--s2);background:var(--card);border-radius:14px;padding: var(--s2)">
          <button class="chip" data-act="auth-tab" data-tab="buyer" aria-pressed="${!asSeller}" style="flex:1;text-align:center;border-radius:10px;padding: var(--s3) 0;${!asSeller ? '' : 'background:transparent'}">קונה</button>
          <button class="chip" data-act="auth-tab" data-tab="seller" aria-pressed="${asSeller}" style="flex:1;text-align:center;border-radius:10px;padding: var(--s3) 0;${asSeller ? '' : 'background:transparent'}">מוכר</button>
        </div>
        <form class="stack" style="gap: var(--s3)" data-act="auth-submit">
          ${reg ? `<div class="field"><span class="label">${asSeller ? 'שם העסק' : 'שם'}</span><input name="name" required></div>` : ''}
          ${reg && asSeller ? `<div class="field"><span class="label">עיר</span><input name="city" required></div>
                               <div class="field"><span class="label">טלפון</span><input class="mono" name="phone" required></div>` : ''}
          <div class="field"><span class="label">אימייל</span><input class="mono" name="email" type="email" required></div>
          <div class="field"><span class="label">סיסמה</span><input name="password" type="password" required minlength="6"></div>
          <button class="btn" type="submit">${reg ? 'הרשמה' : 'כניסה'}</button>
        </form>
        <button class="label" data-act="auth-mode" style="text-align:center;text-decoration:underline">
          ${reg ? 'כבר יש חשבון? כניסה' : 'אין חשבון? הרשמה'}
        </button>
        ${!asSeller ? '' : `<span class="label" style="text-align:center">דמו: hertzel@example.com · demo1234</span>`}
      </div>
    </div>`;
}

/* ============================ ניווט תחתון ============================ */
/* ============================ האי התחתון ============================
   אפשר ללחוץ על לשונית, ואפשר לתפוס את העיגול ולגרור אותו: המסך
   מתחלף תוך כדי, ברגע שהעיגול עובר ללשונית אחרת. */
const TABS = ['home', 'stock', 'chats', 'profile'];

/* לשונית אחרת — חוזרים אליה כמו שהשארנו אותה, כולל הגלילה. בלי זה
   חיפוש שנבנה בעמל או טופס שמולא למחצה נמחקים בכל הצצה בהודעות.

   לחיצה על הלשונית שאנחנו כבר בתוכה היא הדבר ההפוך: "תחזיר אותי
   להתחלה". שם — ורק שם — הסינון מתאפס, אחרת לא הייתה שום דרך לחזור
   למסך בית נקי. */
function goTab(name) {
  const here = tabOf(S.screen) === name;
  if (here) {
    S.tabAt[name] = name;
    if (name === 'home') {
      S.q = ''; S.dept = null; S.category = 'all'; S.sheetCount = null;
      S.groups = null;
      resetVehicleFilters();
    }
    S.scrollAt[name] = 0;
  } else {
    S.restoreScroll = true;
  }
  const at = here ? name : (S.tabAt[name] || name);
  go(at);
  // טוענים מחדש רק את שורש הלשונית: מסך פנימי כבר מחזיק את הנתונים שלו
  if (at === 'stock') loadStock();
  else if (at === 'chats') loadChats();
  else if (at === 'profile') loadMe();
  else if (at === 'search') loadSearch();
}

let pillDrag = null;
let pillTx = 0;          // כמה העיגול מוסט מהלשונית הראשונה, בפיקסלים

// offsetLeft הוא פיזי, ולכן החישוב נכון גם בממשק מימין לשמאל
// בלי להתעסק בסימנים
function pillOffsets(tabs) {
  return tabs.map((tab) => tab.offsetLeft - tabs[0].offsetLeft);
}

function placePill(pill, tabs, index) {
  pillTx = pillOffsets(tabs)[index] || 0;
  pill.style.transform = `translateX(${pillTx}px)`;
}

function nearestTab(clientX, tabs) {
  let best = 0;
  let bestDist = Infinity;
  tabs.forEach((tab, i) => {
    const r = tab.getBoundingClientRect();
    const d = Math.abs(clientX - (r.left + r.width / 2));
    if (d < bestDist) { bestDist = d; best = i; }
  });
  return best;
}

document.addEventListener('pointerdown', (ev) => {
  const island = ev.target.closest && ev.target.closest('.island');
  if (!island || ev.button > 0) return;
  const pill = island.querySelector('.tabpill');
  const tabs = [...island.querySelectorAll('.tab')];
  if (!pill || !tabs.length) return;
  const offsets = pillOffsets(tabs);
  pillDrag = {
    id: ev.pointerId, pill, tabs, offsets,
    x0: ev.clientX, y0: ev.clientY, startTx: pillTx,
    min: Math.min(...offsets), max: Math.max(...offsets),
    index: Math.max(0, TABS.indexOf(S.screen)),
    pending: true, moved: false,
  };
});

document.addEventListener('pointermove', (ev) => {
  if (!pillDrag || ev.pointerId !== pillDrag.id) return;
  if (pillDrag.pending) {
    const dx = ev.clientX - pillDrag.x0;
    const dy = ev.clientY - pillDrag.y0;
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
    if (Math.abs(dy) >= Math.abs(dx)) { pillDrag = null; return; }   // אנכית — זה הפאנל
    pillDrag.pending = false;
    pillDrag.moved = true;
    pillDrag.pill.classList.add('dragging');
  }
  const { pill, tabs } = pillDrag;
  // העיגול הולך אחרי האצבע, בתוך גבולות השורה
  pillTx = Math.max(pillDrag.min, Math.min(pillDrag.max, pillDrag.startTx + (ev.clientX - pillDrag.x0)));
  pill.style.transform = `translateX(${pillTx}px)`;

  const index = nearestTab(ev.clientX, tabs);
  if (index !== pillDrag.index) {
    pillDrag.index = index;
    goTab(TABS[index]);                     // המסך מתחלף תוך כדי הגרירה
  }
}, { passive: true });

function endPillDrag() {
  if (!pillDrag) return;
  const { pill, tabs, moved, index } = pillDrag;
  pillDrag = null;
  if (!moved) return;                       // לחיצה רגילה על לשונית
  swallowClick = true;
  pill.classList.remove('dragging');        // ההנפשה חוזרת
  placePill(pill, tabs, index);             // ומחליקה מהמקום שבו שוחרר אל הלשונית
}

document.addEventListener('pointerup', endPillDrag);
document.addEventListener('pointercancel', endPillDrag);

function renderDock() {
  const hidden = S.screen === 'create' || S.screen === 'chat';
  const dock = $('#dock');
  if (hidden) { dock.innerHTML = ''; return; }

  // אם האי כבר מצויר, רק מזיזים את הגלולה ומחליפים סימון —
  // ציור מחדש היה יוצר אלמנט חדש והתנועה הייתה נבלעת
  const pill = dock.querySelector('.tabpill');
  if (pill) {
    const cur = tabOf(S.screen);
    const at = Math.max(0, TABS.indexOf(cur));
    const tabs = [...dock.querySelectorAll('.tab')];
    if (!pillDrag) placePill(pill, tabs, at);           // בזמן גרירה האצבע מובילה
    tabs.forEach((el, i) => {
      el.setAttribute('aria-current', i === at ? 'page' : 'false');
    });
    return;
  }

  const tabs = [
    ['home', ICON.house({ s: 20 })],
    ['stock', ICON.package({ s: 20 })],
    ['chats', ICON.chat({ s: 20 })],
    ['profile', ICON.user({ s: 20 })],
  ];
  const current = tabOf(S.screen);
  const active = Math.max(0, tabs.findIndex(([k]) => k === current));
  // הסדר בשורה: פילטר בצד אחד, האי באמצע, הוספה בצד השני
  dock.innerHTML = `
    <button class="circ glass" data-act="sheet-open" aria-label="פילטר">${ICON.sliders({ s: 22 })}</button>
    <div class="island glass">
      <span class="tabpill" aria-hidden="true"></span>
      ${tabs.map(([k, ic]) => `<button class="tab" data-act="${k}" aria-current="${current === k ? 'page' : 'false'}" aria-label="${k}">${ic}</button>`).join('')}
    </div>
    <button class="fab rim" data-act="create" aria-label="פוזיציה חדשה">${ICON.plus({ s: 24 })}</button>`;

  // אחרי שהאי צויר אפשר למדוד את הלשוניות ולהציב את העיגול
  const drawnPill = dock.querySelector('.tabpill');
  const drawnTabs = [...dock.querySelectorAll('.tab')];
  if (drawnPill && drawnTabs.length) {
    drawnPill.classList.add('dragging');     // הצבה ראשונה בלי הנפשה
    placePill(drawnPill, drawnTabs, active);
    void drawnPill.offsetWidth;
    drawnPill.classList.remove('dragging');
  }
}

/* ============================ ציור ============================ */
const VIEWS = {
  home: viewHome, search: viewSearch, position: viewPosition, part: viewPart, stock: viewStock,
  create: viewCreate, chats: viewChats, chat: viewChat, profile: viewProfile,
};

function render() {
  const view = VIEWS[S.screen] || viewHome;
  const el = $('#screen');
  const keepScroll = el.querySelector('.scroll');
  const y = keepScroll ? keepScroll.scrollTop : 0;
  // הגלילה של המסך שיוצא נשמרת, כדי שחזרה אליו תיפול לאותו מקום
  if (S.rendered && keepScroll) S.scrollAt[S.rendered] = y;

  el.innerHTML = view();
  // ניקוי שאריות של דפדוף שנקטע באמצע
  if (!drag) { el.style.transform = ''; el.style.opacity = ''; el.style.transition = ''; }
  renderDock();

  // בשיחה גוללים לסוף; בשאר המסכים שומרים על מיקום הגלילה
  const scroll = el.querySelector('.scroll');
  if (scroll) {
    if (S.screen === 'chat') scroll.scrollTop = scroll.scrollHeight;
    else if (S.keepScroll) scroll.scrollTop = y;
    // חזרה ללשונית נופלת לאותו מקום; חיפוש חדש או פתיחת מסך מתחילים מלמעלה
    else scroll.scrollTop = S.restoreScroll ? (S.scrollAt[S.screen] || 0) : 0;
  }
  S.keepScroll = false;
  S.restoreScroll = false;
  S.rendered = S.screen;

  // הפאנל נמדד ומוצב מיד אחרי הציור, בלי הנפשה — אחרת כל ציור מחדש
  // היה נראה כאילו הוא נפתח או נסגר מעצמו
  if (S.screen === 'home') {
    sizeSheet(false);
    const sheet = sheetEl();
    if (sheet) {
      sheet.classList.add('dragging');
      sheet.style.transform = S.sheet ? 'translateY(0px)' : 'translateY(calc(100% + 24px))';
      void sheet.offsetHeight;
      sheet.classList.remove('dragging');
    }
    refreshCount();
  }
}

/* לאיזו לשונית שייך המסך. חיפוש, פוזיציה וכרטיס הם עדיין "בית";
   טופס הפרסום שייך למלאי, ושיחה — להודעות. */
const TAB_OF = {
  home: 'home', search: 'home', position: 'home', part: 'home',
  stock: 'stock', create: 'stock',
  chats: 'chats', chat: 'chats',
  profile: 'profile',
};
function tabOf(screen) { return TAB_OF[screen] || screen; }

function go(screen) {
  if (screen !== 'home') S.sheet = false;
  S.screen = screen;
  S.tabAt[tabOf(screen)] = screen;      // הלשונית זוכרת איפה נעצרה
  render();
}

/* ============================ טעינת נתונים ============================ */
async function loadVehicles() {
  // הרשימה מגיעה אחרי הציור הראשון, ולכן מציירים מחדש — אחרת הפאנל
  // נשאר עם "טוען…" עד לניווט הבא.
  try { S.vehicles = (await api('/vehicles')).kinds; render(); } catch (e) { /* המסננים פשוט יהיו ריקים */ }
}

// כל המסננים שנבחרו, בשאילתה אחת — גם לחיפוש עצמו וגם למונה
// התוצאות שרץ בכפתור בזמן שבוחרים.
function filterParams(extra = {}) {
  const params = new URLSearchParams();
  if (S.q) params.set('q', S.q);
  if (S.kind !== 'all') params.set('kind', S.kind);
  if (S.dept) params.set('department', S.dept);
  if (S.category !== 'all') params.set('category', S.category);
  if (S.vkind !== 'all') params.set('vehicle_kind', S.vkind);
  if (S.vmake !== 'all' && S.vmake !== 'other') params.set('vehicle_make', S.vmake);
  if (S.vmake === 'other' && S.vmakeq.trim()) params.set('make_q', S.vmakeq.trim());
  if (S.vmodel.trim()) params.set('vehicle_model', S.vmodel.trim());
  if (S.vyear) params.set('year', S.vyear);
  for (const [k, v] of Object.entries(extra)) params.set(k, v);
  return params;
}

async function loadCategories() {
  try {
    S.depts = (await api('/categories')).departments;
    render();
  } catch (e) { /* המדפים פשוט יהיו ריקים עד הרענון הבא */ }
}

async function fetchModels(kind, make) {
  if (!make || make === 'all' || make === 'other') return [];
  try {
    const p = new URLSearchParams({ make });
    if (kind && kind !== 'all') p.set('kind', kind);
    return (await api(`/vehicles/models?${p}`)).models;
  } catch (e) { return []; }
}

async function loadModels() {
  S.models = await fetchModels(S.vkind, S.vmake);
}

// הצעות הדגמים בטופס הפוזיציה. הטופס לא נוגע במסנני מסך הבית,
// ולכן הן נכתבות ישירות לרשימה ולא דרך המצב.
async function fillFormModels(kind, make) {
  const models = await fetchModels(kind, make);
  const list = document.getElementById('formModels');
  if (list) list.innerHTML = models.map((m) => `<option value="${esc(m)}"></option>`).join('');
}

/* חיפוש לפי מק״ט או שם מחזיר פוזיציות; דפדוף לפי מדף ומסננים
   נשאר רשימת הצעות שטוחה. אלה שתי שאלות שונות: "מי מוכר את החלק
   הזה" מול "מה יש במדף", וכל אחת רוצה תשובה במבנה אחר. */
async function loadSearch() {
  S.loading = true; render();
  const q = (S.q || '').trim();
  try {
    if (q) {
      // המסננים נשלחים, אבל בשרת הם פועלים רק בחיפוש לפי שם:
      // מק״ט מדויק לא ייעלם בגלל מסנן שנשאר פתוח מקודם
      const data = await api(`/search?${filterParams()}`);
      S.groups = data;
      S.items = [];
      S.total = data.exact.length + data.compatible.length;
    } else {
      /* גם הדפדוף במדפים מחזיר פוזיציות. קודם החיפוש החזיר מק״טים
         והדפדוף החזיר הצעות, ואותו חלק הופיע במדף ארבע פעמים אצל
         ארבעה מוכרים — אותה תקלה שהחיפוש תוקן בגללה, רק בכניסה
         השנייה. עכשיו בכל מקום רואים מק״טים. */
      const data = await api(`/positions?${filterParams({ limit: 60 })}`);
      S.groups = { query: { mode: 'browse' }, exact: data.items, compatible: [], compatible_without_offers: 0 };
      S.items = [];
      S.total = data.pagination.total;
    }
  } catch (e) {
    toast(e.message, true); S.items = []; S.groups = null; S.total = 0;
  }
  S.loading = false; render();
}

/* התמצית והמוכרים נטענים בנפרד: ראש המסך נצבע מיד, ורשימת המוכרים
   מגיעה אחריו. אצל פוזיציה מבוקשת יש הרבה מוכרים, ואין סיבה
   שהכותרת תחכה להם. */
async function loadPosition(id) {
  S.pos = null; S.posOffers = []; S.posCompat = []; S.posEmpty = 0; S.posLoading = true;
  go('position');
  try {
    const data = await api(`/positions/${id}`);
    S.pos = data.position; S.posCompat = data.compatible; S.posEmpty = data.compatible_without_offers;
    render();
    const { offers } = await api(`/positions/${id}/offers`);
    S.posOffers = offers;
  } catch (e) { toast(e.message, true); }
  S.posLoading = false; render();
}

/* מאיפה הגיעו לכרטיס: מהחיפוש או מתוך פוזיציה. בלי זה "חזרה" היה
   מחזיר תמיד לחיפוש, ומי שהשווה מוכרים בתוך פוזיציה היה מאבד אותה. */
/* רשימת האנלוגים ירדה מכאן: היא הייתה בדיוק מה שמסך הפוזיציה עושה,
   רק שהיא ערבבה מוכרים של אותו מק״ט עם מנפיקים אחרים. שתי רשימות
   שאומרות אותו דבר בשתי צורות שונות זה בלבול, לא בחירה. במקומה יש
   שורה אחת שמובילה לפוזיציה — ובקשה אחת פחות לשרת. */
async function loadPart(id, from) {
  S.part = null; S.supOpen = true;
  S.partBack = from || 'search';
  go('part');
  try {
    const { part } = await api(`/parts/${id}`);
    S.part = part;
  } catch (e) { toast(e.message, true); }
  render();
}

async function loadStock() {
  if (!authed() || !isSeller()) { render(); return; }
  S.loading = true; render();
  try {
    const [{ parts }, stats, { seller }] = await Promise.all([
      api('/sellers/me/parts'), api('/sellers/me/stats'), api('/sellers/me/profile'),
    ]);
    S.stock = parts; S.sellerStats = stats; S.me = seller;
  } catch (e) { toast(e.message, true); }
  S.loading = false; render();
}

async function loadChats() {
  if (!authed()) { render(); return; }
  S.loading = true; render();
  try { S.conversations = (await api('/conversations')).conversations; }
  catch (e) { toast(e.message, true); }
  S.loading = false; render();
}

async function loadChat(id) {
  S.conv = null; S.messages = []; S.requests = [];
  go('chat');
  try {
    const data = await api(`/conversations/${id}`);
    S.conv = data.conversation; S.messages = data.messages; S.requests = data.order_requests;
  } catch (e) { toast(e.message, true); }
  render();
}

async function loadMe() {
  if (!authed()) return;
  try {
    S.me = isSeller() ? (await api('/sellers/me/profile')).seller : (await api('/auth/me')).user;
  } catch (e) { /* טוקן שפג כבר נוקה ב-api */ }
  render();
}

/* טופס הפוזיציה מצויר מחדש בכל שינוי מצב (בחירת מצב, הוספת מק״ט),
   אז קודם שומרים את מה שכבר הוקלד — אחרת המשתמש מאבד את הכל. */
function syncDraft() {
  const form = document.querySelector('form[data-act="save-part"]');
  if (!form || !S.draft) return;
  const fd = new FormData(form);
  const text = (k) => (fd.get(k) || '').toString();
  S.draft.name = text('name');
  S.draft.part_no = text('part_no');
  S.draft.maker = text('maker');
  S.draft.category = text('category') || S.draft.category;
  S.draft.vehicle_kind = text('vehicle_kind');
  const makeSel = text('vehicle_make');
  S.draft.vehicle_make = makeSel === 'other' ? text('vehicle_make_other') : makeSel;
  S.draft.vehicle_model = text('vehicle_model');
  const yFrom = text('year_from');
  const yTo = text('year_to');
  S.draft.year_from = yFrom === '' ? null : Number(yFrom);
  S.draft.year_to = yTo === '' ? null : Number(yTo);
  const price = text('price');
  const qty = text('qty');
  S.draft.price = price === '' ? null : Number(price);
  S.draft.qty = qty === '' ? 0 : Number(qty);
  const cond = text('condition_pct');
  if (cond !== '') S.draft.condition_pct = Number(cond);
}

// בחירת סוג רכב מחליפה את רשימת היצרנים. מעדכנים את ה-select במקום
// ולא מציירים מחדש — כדי שלא לאבד את מה שכבר הוקלד בטופס.
// הקלדה בפאנל לא מציירת אותו מחדש — רק נשמרת ומעדכנת את מונה התוצאות,
// אחרת הפוקוס היה קופץ מהשדה בכל תו.
document.addEventListener('input', (ev) => {
  const el = ev.target;
  /* המחוון מדווח ב-input ולא ב-change: change נורה רק בשחרור, והספרה
     הייתה קופאת בזמן הגרירה. הכתיבה ישירה ולא דרך ציור מחדש — ציור
     מחדש היה מחליף את הפקד והאצבע הייתה מאבדת אותו באמצע התנועה. */
  if (el.matches && el.matches('input[name="condition_pct"]')) {
    const out = $('#condOut');
    if (out) out.textContent = `${el.value}%`;
    el.style.setProperty('--p', Math.round((Number(el.value) - 10) / 0.9));
    if (S.draft) S.draft.condition_pct = Number(el.value);
    return;
  }
  if (!el.matches || !el.matches('.sheetwrap [data-field]')) return;
  syncSheetInputs();
  refreshCount();
});

document.addEventListener('change', (ev) => {
  const el = ev.target;
  if (el.matches && el.matches('.sheetwrap [data-field="year"]')) {
    syncSheetInputs();
    refreshCount();
    return;
  }
  // "אחר…" ברשימת הדגמים פותח שדה הקלדה, בלי לצייר את הפאנל מחדש
  if (el.matches && el.matches('.sheetwrap [data-field="model-select"]')) {
    const free = document.querySelector('.sheetwrap [data-field="model"]');
    if (free) {
      free.hidden = el.value !== 'other';
      if (!free.hidden) free.focus(); else free.value = '';
    }
    syncSheetInputs();
    refreshCount();
    return;
  }
  // מחלקה בטופס הפוזיציה קובעת אילו קטגוריות מוצעות
  if (el.matches && el.matches('select[name="department"]')) {
    const form = el.closest('form');
    const cat = form && form.querySelector('select[name="category"]');
    const dep = S.depts.find((x) => x.id === el.value);
    if (cat && dep) cat.innerHTML = categoryOptions(dep, '');
    return;
  }
  // "אחר…" בטופס הפוזיציה פותח שדה להקלדת יצרן שאינו ברשימה
  if (el.matches && el.matches('select[name="vehicle_make"]')) {
    const form = el.closest('form');
    const custom = form && form.querySelector('input[name="vehicle_make_other"]');
    if (custom) {
      custom.hidden = el.value !== 'other';
      if (!custom.hidden) custom.focus(); else custom.value = '';
    }
    // הצעות דגמים ליצרן שנבחר, כדי שהמוכר לא ימציא כתיב משלו
    const kindSel = form && form.querySelector('select[name="vehicle_kind"]');
    fillFormModels(kindSel ? kindSel.value : '', el.value);
    return;
  }
  if (!el.matches || !el.matches('select[name="vehicle_kind"]')) return;
  const form = el.closest('form');
  const make = form && form.querySelector('select[name="vehicle_make"]');
  if (!make) return;
  const chosen = S.vehicles.find((v) => v.id === el.value);
  make.innerHTML = makeOptions(chosen ? chosen.makes : [], '');
  make.disabled = !chosen;
  const custom = form.querySelector('input[name="vehicle_make_other"]');
  if (custom) { custom.hidden = true; custom.value = ''; }
  const list = document.getElementById('formModels');
  if (list) list.innerHTML = '';
});


// פותח וסוגר את הפאנל בלי לצייר את המסך מחדש: מחליף מחלקה על
// האלמנט שכבר קיים, וכך המעבר באמת רץ במקום שהאלמנט יופיע פתוח.
/* ============================ משיכת הפאנל ============================
   הפאנל לא "קופץ": הוא הולך אחרי האצבע. מושכים את הידית למעלה והוא
   עולה בדיוק כמה שמשכו, משחררים — והוא משלים לכיוון שאליו נמשך,
   לפי המהירות ולפי המרחק. אותה תנועה בדיוק סוגרת אותו מהכותרת. */

const sheetEl = () => document.querySelector('.sheetwrap');
const scrimEl = () => document.querySelector('.scrim');

// y=0 הפאנל פתוח לגמרי, y=גובה הפאנל הוא סגור לגמרי
function paintSheet(y, height) {
  const sheet = sheetEl();
  const scrim = scrimEl();
  const dock = $('#dock');
  if (!sheet) return;
  sheet.style.transform = `translateY(${y}px)`;
  const shown = 1 - Math.min(Math.max(y / height, 0), 1);
  if (scrim) {
    scrim.style.visibility = shown > 0 ? 'visible' : '';
    scrim.style.opacity = shown > 0 ? String(shown) : '';
  }
  // האי התחתון מתחלף בכפתור החיפוש: ככל שהפאנל עולה הוא נמוג
  if (dock) dock.style.opacity = String(1 - shown);
}

function setSheet(open, animate = true) {
  const sheet = sheetEl();
  const scrim = scrimEl();
  S.sheet = open;
  if (!sheet || !scrim) { render(); return; }
  if (open) { sizeSheet(false); refreshCount(); }
  if (!animate) sheet.classList.add('dragging');
  sheet.classList.remove('dragging');
  const dock = $('#dock');
  if (dock) { dock.style.opacity = ''; dock.classList.toggle('under', open); }
  // ספארי צובע את הסרגל התחתון שלו בצבע העמוד. כשהמסך מוצל והסרגל
  // נשאר בהיר, זה נראה כמו מדף מתחת לאפליקציה — אז הצבע מוצל איתו.
  const theme = document.querySelector('meta[name="theme-color"]');
  if (theme) theme.setAttribute('content', open ? '#d7d4d1' : '#efece8');
  sheet.style.transform = open ? 'translateY(0px)' : 'translateY(calc(100% + 24px))';
  scrim.style.opacity = '';
  scrim.style.visibility = '';
  sheet.classList.toggle('open', open);
  scrim.classList.toggle('open', open);
}

let drag = null;
let swallowClick = false;

// איפה התחילה הנגיעה: כל מסך הבית מושך את הפאנל למעלה, וכל שטח
// הפאנל מוריד אותו חזרה. לא צריך לכוון לידית.
// המסך שהאי מסמן כרגע: חיפוש וכרטיס חלק הם עדיין "בית"
function dockScreen() { return tabOf(S.screen); }

/* לאן חוזרים מהמסך הנוכחי. אותו יעד משמש את חץ החזרה ואת ההחלקה,
   ולכן אין מצב שהחץ מוביל למקום אחד וההחלקה למקום אחר. */
function backTarget() {
  if (S.screen === 'part') return S.partBack || 'search';
  if (S.screen === 'position') return 'search';
  if (S.screen === 'search') return 'home';
  if (S.screen === 'create') return 'stock';
  if (S.screen === 'chat') return 'chats';
  return null;
}

function onDragStart(ev) {
  if (ev.button > 0) return;
  // בשדות טקסט הנגיעה שייכת לשדה — סימון, סמן, מקלדת
  if (ev.target.closest('input, select, textarea')) return;

  const inSheet = Boolean(ev.target.closest('.sheetwrap'));
  const onDock = Boolean(ev.target.closest('.dock'));
  // משיכה אנכית פותחת וסוגרת את הפאנל — גם מהאי התחתון
  const canSheet = S.screen === 'home' && (inSheet || onDock || Boolean(ev.target.closest('.home')));
  /* החלקה משמאל לימין חוזרת אחורה. במסך שיש לו לאן לחזור זו
     המשמעות שלה, ובשורש לשונית — שאין לו לאן — היא מדפדפת בין
     הלשוניות כמו לחיצה על האי. שתי המשמעויות לא יכולות לחיות
     באותו מסך: אחת מהן הייתה גוזלת מהשנייה חצי מהמחוות. */
  const free = !S.sheet && !inSheet && !onDock;
  const back = free ? backTarget() : null;
  const canPage = free && !back && TABS.includes(dockScreen());
  if (!canSheet && !canPage && !back) return;

  const sheet = sheetEl();
  if (canSheet && sheet && !S.sheet) sizeSheet(false);   // מודדים לפני שמתחילים לזוז
  const scroller = ev.target.closest('.sheetscroll');
  const height = sheet ? sheet.offsetHeight : 0;

  // הקשה על כפתור היא קודם כל הקשה: רק תנועה ארוכה יותר הופכת אותה
  // לגרירה, אחרת יד שרועדת קצת "מבטלת" את הלחיצה
  const onControl = Boolean(ev.target.closest('button, a, [data-act]'));
  drag = {
    slop: onControl ? 16 : 8,
    id: ev.pointerId, canSheet: canSheet && Boolean(sheet), canPage, back, mode: null,
    height, x0: ev.clientX, y0: ev.clientY,
    y: S.sheet ? 0 : height, base: S.sheet ? 0 : height,
    lastY: ev.clientY, lastX: ev.clientX, lastT: performance.now(), v: 0, vx: 0,
    // רשימה שכבר נגללה שייכת לעצמה; מהראש שלה אפשר למשוך את הפאנל
    inScroller: Boolean(scroller) && scroller.scrollTop > 0,
    pending: true, active: false, moved: false, dx: 0,
  };
}

function onDragMove(ev) {
  if (!drag || ev.pointerId !== drag.id) return;
  const dy = ev.clientY - drag.y0;
  const dx = ev.clientX - drag.x0;

  // ההכרעה נופלת בתנועה הראשונה: אנכית זה הפאנל, אופקית זה דפדוף,
  // וברשימה שכבר נגללה זו פשוט גלילה
  if (drag.pending) {
    if (Math.abs(dy) < drag.slop && Math.abs(dx) < drag.slop) return;
    const horizontal = Math.abs(dx) > Math.abs(dy);
    if (horizontal && drag.back) {
      drag.mode = 'back';
    } else if (horizontal && drag.canPage) {
      drag.mode = 'page';
    } else if (!horizontal && drag.canSheet && !drag.inScroller
               && !(ev.target.closest('.sheetscroll') && dy < 0)) {
      drag.mode = 'sheet';
      const sheet = sheetEl();
      if (sheet) sheet.classList.add('dragging');
    } else {
      drag = null;
      return;
    }
    drag.pending = false;
    drag.active = true;
    drag.x0 = ev.clientX; drag.y0 = ev.clientY;   // מתחילים מנקודת ההכרעה, בלי קפיצה
    return;
  }

  const now = performance.now();
  if (now > drag.lastT) {
    drag.v = (ev.clientY - drag.lastY) / (now - drag.lastT);
    drag.vx = (ev.clientX - drag.lastX) / (now - drag.lastT);
  }
  drag.lastY = ev.clientY; drag.lastX = ev.clientX; drag.lastT = now;
  drag.moved = true;

  /* חזרה: המסך הולך אחרי האצבע כמעט אחד לאחד. לכיוון ההפוך אין
     לאן לחזור, ולכן שם יש התנגדות — התנועה נעצרת ומרגישה כמו קיר. */
  if (drag.mode === 'back') {
    const raw = ev.clientX - drag.x0;
    drag.dx = raw > 0 ? raw : raw / 4;
    paintPage({ transition: 'none', transform: `translateX(${(drag.dx * 0.9).toFixed(1)}px)` });
    return;
  }

  if (drag.mode === 'page') {
    // התוכן זז מעט אחרי האצבע — מספיק כדי להרגיש שהוא מתחלף, בלי לעוף
    drag.dx = ev.clientX - drag.x0;
    paintPage({ transition: 'none', transform: `translateX(${drag.dx * 0.45}px)` });
    return;
  }

  let y = drag.base + (ev.clientY - drag.y0);
  // התנגדות בקצוות, כדי שהמשיכה תרגיש כמו חומר ולא כמו מתג
  if (y < 0) y /= 3;
  if (y > drag.height) y = drag.height + (y - drag.height) / 3;
  drag.y = y;
  paintSheet(y, drag.height);
}

// מה שמשיכה יכולה להשאיר אחריה: מחלקת dragging, הצללה שנשארת פרושה
// וחוסמת הקשות, ואי שקוף למחצה
function clearDragTraces() {
  const sheet = sheetEl();
  if (sheet) sheet.classList.remove('dragging');
  const scrim = scrimEl();
  if (scrim && !S.sheet) { scrim.style.opacity = ''; scrim.style.visibility = ''; }
  const dock = $('#dock');
  if (dock) dock.style.opacity = '';
  paintPage({ transition: '', transform: '', opacity: '' });
}

function onDragEnd() {
  if (!drag) return;
  const { v, vx, y, height, moved, mode, dx, back } = drag;
  drag = null;
  // בלי תנועה זו לחיצה רגילה. מנקים רק את מה שהמשיכה הספיקה להשאיר,
  // ובשום אופן לא מציירים את המסך מחדש: ציור כזה מוחק את הכפתור
  // שמתחת לאצבע לפני שהלחיצה עליו נשלחת, והיא פשוט נעלמת.
  if (!moved) { clearDragTraces(); return; }
  swallowClick = true;

  if (mode === 'back') {
    // מהירות מכריעה קודם: תנועה החלטית מסיימת גם באמצע הדרך
    if (dx > 70 || vx > 0.4) {
      paintPage({
        transition: 'transform .26s var(--ease), opacity .26s var(--ease)',
        transform: 'translateX(56%)', opacity: '0',
      });
      // המסך החדש נצבע כשהיוצא כבר כמעט בחוץ, ולכן לא רואים חפיפה
      setTimeout(() => go(back), 170);
    } else {
      paintPage({ transition: 'transform .3s var(--ease)', transform: 'translateX(0px)', opacity: '1' });
    }
    return;
  }

  if (mode === 'page') {
    const decisive = Math.abs(dx) > 70 || Math.abs(vx) > 0.4;
    // הדף הולך לאן שהאצבע הולכת, והלשונית שנחשפת היא זו שמאותו צד
    swipePage(decisive ? (dx > 0 ? 1 : -1) : 0, dx);
    return;
  }

  // מהירות מכריעה קודם: תנועה החלטית מסיימת את הכיוון גם באמצע הדרך
  const open = v < -0.35 ? true : (v > 0.35 ? false : y < height / 2);
  setSheet(open);
}

/* דפדוף בין המסכים: המסך הנוכחי יוצא לכיוון ההחלקה, המסך הבא נכנס
   מהצד הנגדי. תזוזה קצרה בלבד — לא זום ולא טשטוש. */
/* מה שחוזר בין המסכים — הלוגו וכפתורי הכותרת — לא זז. מחליק רק
   התוכן שמתחתיו, ולכן המסך מתחלף מתחת לכותרת קבועה. */
function pageParts() {
  const el = $('#screen');
  if (!el) return [];
  return [...el.children].filter((c) => !c.classList.contains('top')
    && !c.classList.contains('sheetwrap') && !c.classList.contains('scrim'));
}

function paintPage(style) {
  for (const part of pageParts()) Object.assign(part.style, style);
}

function swipePage(step, dx) {
  const at = Math.max(0, TABS.indexOf(dockScreen()));
  const next = at + step;

  if (!step || next < 0 || next >= TABS.length) {
    paintPage({ transition: 'transform .3s var(--ease)', transform: 'translateX(0px)', opacity: '1' });
    return;
  }

  const out = dx > 0 ? 54 : -54;    // יוצא לכיוון שאליו נמשך
  paintPage({ transition: 'transform .15s ease-out, opacity .15s ease-out', transform: `translateX(${out}px)`, opacity: '0' });
  setTimeout(() => {
    goTab(TABS[next]);
    paintPage({ transition: 'none', transform: `translateX(${-out}px)`, opacity: '0' });
    void $('#screen').offsetWidth;
    paintPage({ transition: 'transform .26s var(--ease), opacity .26s var(--ease)', transform: 'translateX(0px)', opacity: '1' });
  }, 150);
}

// כל נגיעה חדשה מתחילה מדף נקי: אחרת דגל שנשאר מגרירה קודמת
// היה בולע את ההקשה הבאה, וזה נראה כאילו הכפתור לא מגיב
document.addEventListener('pointerdown', () => { swallowClick = false; }, true);

document.addEventListener('pointerdown', onDragStart);
document.addEventListener('pointermove', onDragMove, { passive: true });
document.addEventListener('pointerup', onDragEnd);
document.addEventListener('pointercancel', onDragEnd);

/* ============================ המסך לא זז ============================
   הדף עצמו לא נגלל ולא נמתח: מה שאין לו לאן לגלול פשוט לא זז, וכך
   אין את הקפיצה האפורה של ספארי מעל האפליקציה. גם צביטה לזום
   חסומה — באפליקציה מצפים שהמסך יישאר במידה שלו. */
document.addEventListener('touchmove', (ev) => {
  if (ev.touches.length > 1) { ev.preventDefault(); return; }   // צביטה
  if (drag && drag.active) { ev.preventDefault(); return; }     // הפאנל זז, לא הדף
  const scroller = ev.target.closest && ev.target.closest('.scroll, .sheetscroll');
  if (!scroller) ev.preventDefault();
}, { passive: false });

for (const type of ['gesturestart', 'gesturechange', 'gestureend']) {
  document.addEventListener(type, (ev) => ev.preventDefault());
}

/* הפאנל גבוה כמו התוכן שלו, ולא יותר מ-88% מהמסך: מספיק גבוה כדי
   לעבוד בו בנוחות, ועדיין רואים שהמסך ממשיך מאחוריו. */
function sizeSheet(animate) {
  const sheet = document.querySelector('.sheetwrap');
  if (!sheet) return;
  const frame = sheet.parentElement;
  const max = Math.round((frame ? frame.clientHeight : window.innerHeight) * 0.88);
  const from = sheet.getBoundingClientRect().height;
  sheet.style.height = 'auto';
  const to = Math.min(sheet.scrollHeight, max);
  if (!animate) { sheet.style.height = `${to}px`; return; }
  sheet.style.height = `${from}px`;
  void sheet.offsetHeight;   // בלי חישוב מחדש הדפדפן מאחד את שתי ההשמות והמעבר נבלע
  sheet.style.height = `${to}px`;
}

/* מחליף רק את תוכן הפאנל ומזיז את גובהו. המסך שמאחור לא מצויר מחדש —
   הלוגו, הכותרת והכפתורים נשארים בדיוק במקומם, וזז רק הפאנל.
   מי שקורא לפונקציה קורא קודם ל-syncSheetInputs, אחרת טקסט שהוקלד יימחק. */
function updateSheet(opts) {
  const o = typeof opts === 'string' ? { reveal: opts } : (opts || {});
  const sheet = document.querySelector('.sheetwrap');
  const head = sheet && sheet.querySelector('[data-sheet-head]');
  const body = sheet && sheet.querySelector('[data-sheet-body]');
  const foot = sheet && sheet.querySelector('[data-sheet-foot]');
  if (!head || !body || !foot) { render(); return; }

  const swap = () => {
    const y = body.scrollTop;
    head.innerHTML = sheetHead();
    body.innerHTML = sheetBody();
    foot.innerHTML = sheetFoot();
    body.scrollTop = o.fade ? 0 : y;
    sizeSheet(true);
    refreshCount();
    // מה שנפתח עכשיו יכול להיות מתחת לקצה — מגלגלים אליו בעדינות
    if (o.reveal) {
      const box = body.querySelector(`[data-sec="${o.reveal}"]`);
      if (box) box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // מעבר בין עמודים שלמים: התוכן מתחלף בהמסה קצרה בזמן שהגובה זז,
  // אחרת רואים החלפה חדה ואז תנועה — שתי פעולות במקום אחת
  if (!o.fade) { swap(); return; }
  body.style.transition = 'opacity .13s ease-out';
  body.style.opacity = '0';
  setTimeout(() => {
    swap();
    body.style.transition = 'opacity .26s var(--ease)';
    body.style.opacity = '1';
  }, 130);
}

function resetVehicleFilters() {
  S.vkind = 'all'; S.vmake = 'all'; S.vmakeq = ''; S.vmodel = ''; S.vyear = ''; S.models = [];
}

// מה שהוקלד או נבחר בפאנל חי ב-DOM בלבד עד שנשמר כאן
function syncSheetInputs() {
  const sheet = document.querySelector('.sheetwrap');
  if (!sheet) return;
  const makeq = sheet.querySelector('[data-field="makeq"]');
  const modelSel = sheet.querySelector('[data-field="model-select"]');
  const modelFree = sheet.querySelector('[data-field="model"]');
  const year = sheet.querySelector('[data-field="year"]');
  if (makeq) S.vmakeq = makeq.value;
  if (modelSel) {
    S.vmodel = modelSel.value === 'other' ? (modelFree ? modelFree.value : '') : modelSel.value;
  }
  if (year) S.vyear = year.value;
}

/* מונה התוצאות בכפתור. רץ בהשהיה קצרה כדי לא לשלוח בקשה על כל תו,
   ומתעלם מתשובה ישנה שהגיעה אחרי חדשה. */
let countTimer = null;
let countSeq = 0;
function refreshCount() {
  const el = document.querySelector('[data-count]');
  if (!el) return;
  clearTimeout(countTimer);
  if (!anyFilter()) { S.sheetCount = null; el.textContent = countLabel(); return; }
  const seq = ++countSeq;
  countTimer = setTimeout(async () => {
    try {
      const data = await api(`/positions?${filterParams({ limit: 1 })}`);
      if (seq !== countSeq) return;
      S.sheetCount = data.pagination.total;
    } catch (e) {
      if (seq !== countSeq) return;
      S.sheetCount = null;
    }
    const now = document.querySelector('[data-count]');
    if (now) now.textContent = countLabel();
  }, 220);
}

/* ============================ תמונת מוצר ============================
   רקע אחיד — שולחן, נייר, קיר — נמחק כאן בדפדפן, בלי שרת ובלי מודל:
   מתחילים מהשוליים, שם הרקע בוודאות, וזוחלים פנימה כל עוד הצבע דומה
   לו. חלק מצולם על משטח נקי יוצא חתוך; רקע עמוס יישאר כמו שהוא. */
const CUT_TOLERANCE = 46;

function cutoutBackground(canvas) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const { width: w, height: h } = canvas;
  const img = ctx.getImageData(0, 0, w, h);
  const px = img.data;

  // צבע הרקע = החציון של פיקסלי המסגרת
  const edge = [];
  for (let x = 0; x < w; x += 2) { edge.push((x + 0 * w) * 4, (x + (h - 1) * w) * 4); }
  for (let y = 0; y < h; y += 2) { edge.push((0 + y * w) * 4, (w - 1 + y * w) * 4); }
  const mid = (ch) => {
    const vals = edge.map((i) => px[i + ch]).sort((a, b) => a - b);
    return vals[Math.floor(vals.length / 2)];
  };
  const bg = [mid(0), mid(1), mid(2)];

  const near = (i, tol) => {
    const d = Math.abs(px[i] - bg[0]) + Math.abs(px[i + 1] - bg[1]) + Math.abs(px[i + 2] - bg[2]);
    return d < tol;
  };

  // מציפים מהשוליים פנימה
  const seen = new Uint8Array(w * h);
  const queue = [];
  for (let x = 0; x < w; x++) { queue.push(x, x + (h - 1) * w); }
  for (let y = 0; y < h; y++) { queue.push(y * w, w - 1 + y * w); }
  while (queue.length) {
    const p = queue.pop();
    if (seen[p]) continue;
    seen[p] = 1;
    const i = p * 4;
    if (!near(i, CUT_TOLERANCE * 3)) continue;
    px[i + 3] = 0;
    const x = p % w;
    const y = (p / w) | 0;
    if (x > 0) queue.push(p - 1);
    if (x < w - 1) queue.push(p + 1);
    if (y > 0) queue.push(p - w);
    if (y < h - 1) queue.push(p + w);
  }

  // ריכוך הקצה: פיקסל אטום שנוגע בשקוף מקבל שקיפות חלקית
  const out = new Uint8ClampedArray(px);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const p = x + y * w;
      const i = p * 4;
      if (px[i + 3] === 0) continue;
      let open = 0;
      if (px[(p - 1) * 4 + 3] === 0) open++;
      if (px[(p + 1) * 4 + 3] === 0) open++;
      if (px[(p - w) * 4 + 3] === 0) open++;
      if (px[(p + w) * 4 + 3] === 0) open++;
      if (open) out[i + 3] = Math.round(255 * (1 - open / 5));
    }
  }
  ctx.putImageData(new ImageData(out, w, h), 0, 0);
}

// קובץ → קנבס מוקטן → data URL. webp כשאפשר: אותה שקיפות, רבע משקל
async function processPhoto(file, cutout) {
  const bitmap = await createImageBitmap(file);
  const max = 800;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  if (cutout) cutoutBackground(canvas);
  const webp = canvas.toDataURL('image/webp', 0.86);
  return webp.startsWith('data:image/webp') ? webp : canvas.toDataURL('image/png');
}

document.addEventListener('change', async (ev) => {
  const el = ev.target;
  if (!el.matches || !el.matches('input[data-act="pick-photo"]')) return;
  const file = el.files && el.files[0];
  if (!file) return;
  if (!S.draft) return;
  syncDraft();
  toast('מעבד תמונה…');
  try {
    S.draft.image_url = await processPhoto(file, S.cutout);
    S.keepScroll = true;
    render();
  } catch (e) {
    toast('לא הצלחתי לקרוא את התמונה', true);
  }
});

/* ============================ אירועים ============================ */
document.addEventListener('click', async (ev) => {
  if (swallowClick) { swallowClick = false; return; }   // סוף משיכה, לא לחיצה

  // הקשה על שורת החיפוש — בכל מקום בה — פותחת את השדה
  const bar = ev.target.closest && ev.target.closest('.searchbar');
  if (bar && !ev.target.closest('button')) {
    const field = bar.querySelector('input');
    if (field && document.activeElement !== field) field.focus();
  }
  const el = ev.target.closest('[data-act]');
  if (!el || el.tagName === 'FORM') return;
  const act = el.dataset.act;

  // ניווט
  if (TABS.includes(act)) { goTab(act); return; }
  if (act === 'search') { go('search'); return; }
  if (act === 'open-pos') { loadPosition(Number(el.dataset.id)); return; }
  if (act === 'position') { go('position'); return; }
  if (act === 'compat-note') { S.compatNote = !S.compatNote; S.keepScroll = true; render(); return; }

  if (act === 'create') {
    if (!authed() || !isSeller()) { toast('התחברו כמוכר כדי להוסיף פוזיציה', true); go('profile'); return; }
    S.draft = { kind: 'copy', category: 'brakes', qty: 0, nums: [], oems: [] };
    go('create'); return;
  }

  if (act === 'sheet-open') {
    if (S.screen !== 'home') { go('home'); }
    setSheet(true);
    return;
  }
  if (act === 'sheet-close') { setSheet(false); return; }

  // בחירה בפאנל לא מעיפה למסך אחר: הבחירה נשמרת, הפאנל מתעדכן במקום
  // ומשנה גובה, והמעבר לתוצאות קורה רק בלחיצה על כפתור החיפוש.
  // בחירת מדף מחליפה את תוכן הפאנל; החזרה מנקה את מה שנבחר בו,
  // כדי שלא יישאר מסנן פעיל שכבר לא רואים
  if (act === 'dept') {
    syncSheetInputs();
    S.dept = el.dataset.dept;
    S.category = 'all';
    resetVehicleFilters();
    updateSheet({ fade: true });
    return;
  }
  if (act === 'dept-back') {
    S.dept = null; S.category = 'all';
    resetVehicleFilters();
    updateSheet({ fade: true });
    return;
  }
  if (act === 'cat') {
    syncSheetInputs();
    const next = el.dataset.cat;
    S.category = (next === 'all' || S.category === next) ? 'all' : next;
    if (S.screen === 'home') { updateSheet(); } else { loadSearch(); }
    return;
  }
  if (act === 'vkind') {
    syncSheetInputs();
    const next = el.dataset.vkind;
    S.vkind = S.vkind === next ? 'all' : next;
    // יצרן, דגם ושנה תלויים בסוג — החלפת סוג מאפסת אותם
    S.vmake = 'all'; S.vmakeq = ''; S.vmodel = ''; S.models = [];
    updateSheet({ reveal: S.vkind === 'all' ? null : 'make' });
    return;
  }
  if (act === 'vmake') {
    syncSheetInputs();
    const next = el.dataset.vmake;
    S.vmake = (next === 'all' || S.vmake === next) ? 'all' : next;
    S.vmodel = '';
    if (S.vmake === 'all') { S.vmakeq = ''; S.vyear = ''; }
    updateSheet({ reveal: S.vmake === 'all' ? null : (S.vmake === 'other' ? 'make' : 'model') });
    // רשימת הדגמים מגיעה מהשרת ונכנסת לבורר כשהיא כאן
    loadModels().then(() => {
      const sel = document.querySelector('.sheetwrap [data-field="model-select"]');
      if (sel) sel.innerHTML = modelOptions();
    });
    // בחירת "אחר" פותחת שדה הקלדה — הפוקוס עובר אליו מיד
    if (S.vmake === 'other') {
      const input = document.querySelector('[data-field="makeq"]');
      if (input) input.focus();
    }
    return;
  }
  if (act === 'sheet-search') {
    syncSheetInputs();
    setSheet(false);
    go('search'); loadSearch();
    return;
  }

  if (act === 'clear-filters') {
    S.dept = null; S.category = 'all'; S.sheetCount = null;
    resetVehicleFilters();
    if (S.screen === 'home') { updateSheet(); } else { loadSearch(); }
    return;
  }
  if (act === 'kind') { S.kind = el.dataset.kind; loadSearch(); return; }
  if (act === 'toggle') { S.openPart = S.openPart === Number(el.dataset.id) ? null : Number(el.dataset.id); S.keepScroll = true; render(); return; }
  if (act === 'open-part') { loadPart(el.dataset.id); return; }
  if (act === 'open-offer') { loadPart(el.dataset.id, 'position'); return; }
  if (act === 'toggle-sup') { S.supOpen = !S.supOpen; S.keepScroll = true; render(); return; }
  if (act === 'toggle-oems') {
    const id = Number(el.dataset.id);
    if (S.stockOems.has(id)) S.stockOems.delete(id); else S.stockOems.add(id);
    S.keepScroll = true; render(); return;
  }

  // צ׳אט
  if (act === 'start-chat') {
    if (!authed()) { toast('התחברו כדי לפנות למוכר', true); go('profile'); return; }
    if (isSeller()) { toast('בקשה נשלחת מחשבון קונה', true); return; }
    try {
      const { conversation } = await api('/conversations', { method: 'POST', body: { part_id: Number(el.dataset.id) } });
      loadChat(conversation.id);
    } catch (e) { toast(e.message, true); }
    return;
  }
  if (act === 'open-chat') { loadChat(el.dataset.id); return; }
  if (act === 'answer') {
    try {
      await api(`/conversations/${S.conv.id}/order-requests/${el.dataset.id}`, { method: 'PATCH', body: { status: el.dataset.status } });
      loadChat(S.conv.id);
    } catch (e) { toast(e.message, true); }
    return;
  }
  if (act === 'order-form') {
    const qty = prompt('כמות?', '1');
    if (qty === null) return;
    const n = Number(qty);
    if (!Number.isInteger(n) || n < 1) { toast('כמות חייבת להיות מספר שלם חיובי', true); return; }
    const vehicle = prompt('רכב (לא חובה)', '') || null;
    try {
      await api(`/conversations/${S.conv.id}/order-request`, { method: 'POST', body: { qty: n, vehicle } });
      loadChat(S.conv.id);
    } catch (e) { toast(e.message, true); }
    return;
  }

  // קבינט
  if (act === 'edit') {
    const p = S.stock.find((x) => x.id === Number(el.dataset.id));
    if (!p) return;
    const all = p.interchange_numbers || [];
    S.draft = {
      ...p,
      nums: all.filter((n) => !n.is_oem).map((n) => n.number),
      oems: all.filter((n) => n.is_oem).map((n) => n.number),
    };
    go('create');
    fillFormModels(p.vehicle_kind, p.vehicle_make);
    return;
  }
  if (act === 'delete') {
    if (!confirm('למחוק את הפוזיציה?')) return;
    try { await api(`/sellers/me/parts/${el.dataset.id}`, { method: 'DELETE' }); toast('נמחק'); loadStock(); }
    catch (e) { toast(e.message, true); }
    return;
  }
  if (act === 'drop-photo') { syncDraft(); S.draft.image_url = null; S.keepScroll = true; render(); return; }
  if (act === 'toggle-cutout') { S.cutout = el.checked; return; }
  if (act === 'set-kind') { syncDraft(); S.draft.kind = el.dataset.kind; S.keepScroll = true; render(); return; }
  if (act === 'add-num') {
    syncDraft();
    const n = prompt('מספר מק״ט מתחלף');
    if (n && n.trim()) { S.draft.nums.push(n.trim()); S.keepScroll = true; render(); }
    return;
  }
  if (act === 'rm-num') { syncDraft(); S.draft.nums.splice(Number(el.dataset.i), 1); S.keepScroll = true; render(); return; }
  if (act === 'add-oem') {
    syncDraft();
    const n = prompt('מק״ט מקורי — המספר של היצרן');
    if (n && n.trim()) { S.draft.oems = [...(S.draft.oems || []), n.trim()]; S.keepScroll = true; render(); }
    return;
  }
  if (act === 'rm-oem') { syncDraft(); S.draft.oems.splice(Number(el.dataset.i), 1); S.keepScroll = true; render(); return; }

  // חשבון
  if (act === 'auth-tab') { S.authTab = el.dataset.tab; render(); return; }
  if (act === 'auth-mode') { S.authMode = S.authMode === 'register' ? 'login' : 'register'; render(); return; }
  if (act === 'logout') { clearAuth(); S.stock = []; S.conversations = []; toast('התנתקת'); go('home'); return; }
});

document.addEventListener('submit', async (ev) => {
  const form = ev.target.closest('[data-act]');
  if (!form) return;
  ev.preventDefault();
  const act = form.dataset.act;
  const fd = new FormData(form);

  if (act === 'search-submit') {
    S.q = (fd.get('q') || '').toString().trim();
    S.category = 'all';
    go('search'); loadSearch(); return;
  }

  if (act === 'send-msg') {
    const body = (fd.get('body') || '').toString().trim();
    if (!body) return;
    form.reset();
    try {
      await api(`/conversations/${S.conv.id}/messages`, { method: 'POST', body: { body } });
      loadChat(S.conv.id);
    } catch (e) { toast(e.message, true); }
    return;
  }

  if (act === 'save-part') {
    const d = S.draft || {};
    const num = (k) => {
      const v = (fd.get(k) || '').toString().trim();
      return v === '' ? null : Number(v);
    };
    const vehicleKind = (fd.get('vehicle_kind') || '').toString() || null;
    const makeSelected = (fd.get('vehicle_make') || '').toString();
    const makeCustom = makeSelected === 'other';
    const vehicleMake = (makeCustom ? (fd.get('vehicle_make_other') || '').toString().trim() : makeSelected) || null;
    const vehicleModel = (fd.get('vehicle_model') || '').toString().trim() || null;
    const yearFrom = num('year_from');
    const yearTo = num('year_to');
    const payload = {
      name: (fd.get('name') || '').toString().trim(),
      part_no: (fd.get('part_no') || '').toString().trim(),
      category: fd.get('category'),
      maker: (fd.get('maker') || '').toString().trim() || null,
      kind: d.kind || 'copy',
      condition_pct: (d.kind || 'copy') === 'used' ? num('condition_pct') : null,
      vehicle_kind: vehicleKind,
      vehicle_make: vehicleKind ? vehicleMake : null,
      vehicle_make_custom: makeCustom,
      image_url: d.image_url || null,
      vehicle_model: vehicleModel,
      year_from: yearFrom,
      year_to: yearTo,
      fits: fitsText(vehicleMake, vehicleModel, yearFrom, yearTo) || (d.fits || null),
      price: Number(fd.get('price')),
      qty: Number(fd.get('qty')),
      // המקוריים נשמרים מסומנים, כדי שיוצגו בנפרד בכרטיס
      interchange_numbers: [
        ...((d.kind || 'copy') !== 'orig' ? (d.oems || []) : []).map((n) => ({ number: n, is_oem: true })),
        ...(d.nums || []).map((n) => ({ number: n })),
      ],
    };
    if (!payload.part_no) { toast('מק״ט הוא שדה חובה', true); return; }
    try {
      if (d.id) await api(`/sellers/me/parts/${d.id}`, { method: 'PATCH', body: payload });
      else await api('/sellers/me/parts', { method: 'POST', body: payload });
      toast(d.id ? 'הפוזיציה עודכנה' : 'הפוזיציה פורסמה');
      S.draft = null;
      go('stock'); loadStock();
    } catch (e) { toast(e.message, true); }
    return;
  }

  if (act === 'auth-submit') {
    const seller = S.authTab === 'seller';
    const reg = S.authMode === 'register';
    const body = {
      email: (fd.get('email') || '').toString().trim(),
      password: (fd.get('password') || '').toString(),
    };
    if (reg) {
      body.name = (fd.get('name') || '').toString().trim();
      if (seller) {
        body.city = (fd.get('city') || '').toString().trim();
        body.phone = (fd.get('phone') || '').toString().trim();
      }
    }
    const path = seller
      ? (reg ? '/sellers/register' : '/sellers/login')
      : (reg ? '/auth/register' : '/auth/login');
    try {
      const data = await api(path, { method: 'POST', body });
      setAuth(data.token, seller ? 'seller' : 'buyer');
      S.me = seller ? data.seller : data.user;
      toast(`שלום, ${S.me.name}`);
      if (seller) { go('stock'); loadStock(); } else { go('home'); }
    } catch (e) { toast(e.message, true); }
    return;
  }
});


/* ============================ מחוות ============================
   במחשב אין אצבע — גלגלת כלפי מטה פותחת את הפאנל, כלפי מעלה סוגרת.
   באפליקציה עצמה המשיכה בידית היא הדרך, ולכן אין כאן יותר מזה. */
let wheelLock = 0;
document.addEventListener('wheel', (ev) => {
  if (S.screen !== 'home') return;
  const list = ev.target.closest ? ev.target.closest('.sheetscroll') : null;
  if (list && list.scrollTop > 0) return;   // הגלגלת גוללת את הרשימה, לא סוגרת
  const now = Date.now();
  if (now - wheelLock < 600) return;
  if (ev.deltaY > 24 && !S.sheet) { wheelLock = now; setSheet(true); }
  else if (ev.deltaY < -24 && S.sheet) { wheelLock = now; setSheet(false); }
}, { passive: true });

/* ============================ אתחול ============================ */

// מסך הפתיחה יורד רק אחרי שהשרת ענה — כך ההמתנה לשרת שנרדם
// נראית כמו טעינה ולא כמו מסך ריק. מינימום קצר כדי שלא יהבהב.
function hideSplash() {
  const el = document.getElementById('splash');
  if (!el) return;
  el.classList.add('gone');
  setTimeout(() => el.remove(), 400);
}

S.authTab = 'buyer';
S.authMode = 'login';
render();

// רצף השרטוט נגמר ב-2.28 שניות; מחזיקים עוד רגע כדי שהשרטוט הגמור
// ייראה ולא ייחתך בדיוק ברגע שהקו האחרון נחת
const splashFloor = new Promise((resolve) => setTimeout(resolve, 2700));
Promise.allSettled([loadMe(), loadVehicles(), loadCategories()])
  .then(() => splashFloor)
  .then(hideSplash);
