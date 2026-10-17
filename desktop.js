/* ============================================================
   autoparts — גרסת מחשב
   אותו שירות ואותו API כמו באפליקציה, בפריסה של אתר: ניווט אחד
   למעלה, מסננים ברצועה קבועה, ותוכן ברוחב קריא. במסך גדול אין
   סיבה להסתיר דברים מאחורי מחוות — הכול פרוש, וכל מסך עונה על
   שאלה אחת: מה מחפשים, מה נמצא, ממי קונים.
   ============================================================ */

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));
const shekel = (n) => `${Number(n).toLocaleString('he-IL')} ₪`;
const NOTE_FIT = 'המידע להתרשמות בלבד. כדי לוודא שהחלק אכן מתאים, צרו קשר עם הספק.';
const KIND_LABEL = { orig: 'מקורי', copy: 'חלופי', used: 'משומש' };
const KIND_LIST = [['all', 'הכל'], ['orig', 'מקורי'], ['copy', 'חלופי'], ['used', 'משומש']];
const YEARS = (() => {
  const top = new Date().getFullYear() + 1;
  return Array.from({ length: top - 1979 }, (_, i) => top - i);
})();

const S = {
  screen: 'catalog',
  token: localStorage.getItem('ap_token'),
  role: localStorage.getItem('ap_role'),
  me: null,
  // מסננים
  q: '', dept: 'all', category: 'all', kind: 'all',
  vkind: 'all', vmake: 'all', vmodel: '', vyear: '',
  // נתונים
  depts: [], vehicles: [], models: [],
  items: [], total: 0, loading: false,
  part: null,
  // חיפוש מחזיר פוזיציות ולא הצעות: פוזיציה אחת למעלה — זו של המק״ט
  // שהוקלד — ומתחתיה מנפיקים אחרים שמתאימים לאותו מספר ייחוס
  groups: null,
  pos: null, posOffers: [], posCompat: [], posEmpty: 0, posLoading: false, partBack: 'catalog',
  compatNote: false,
  // כמה נטען מול כמה יש: רשימה שנחתכת בשקט משאירה את המשתמש בטוח
  // שראה הכול
  posTotal: 0, posPage: 1, browseTotal: 0, browsePage: 1, loadingMore: false,
  convs: [], conv: null, msgs: [],
  stock: [], stats: null, reqs: [],
  // עמוד הספק: מי הוא, ומה עוד יש אצלו
  sup: null, supStats: null, supParts: [], supTotal: 0, supPage: 1, supBack: 'catalog', supLoading: false,
  supCat: 'all',   // איזו מערכת נבחרה במדף של הספק
  /* שאלה קצרה שממתינה לתשובה, ובקשת ההזמנה שנפתחת בצ׳אט. השאלה
     הייתה confirm() של הדפדפן — חלון מערכת באמצע ממשק עברי. */
  ask: null, orderOpen: false,
  draft: null, cutout: true,
  auth: { open: false, tab: 'buyer', mode: 'login' },
};

const isSeller = () => S.role === 'seller';
const authed = () => Boolean(S.token);

/* ---------------------------- רשת ---------------------------- */
async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...(S.token ? { authorization: `Bearer ${S.token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) { clearAuth(); }
    throw new Error(data.error || 'משהו השתבש');
  }
  return data;
}

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

let toastTimer = null;
function toast(text, bad = false) {
  const el = $('#toast');
  el.textContent = text;
  el.classList.toggle('bad', bad);
  el.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('on'), 2600);
}

/* ------------------------ עזרי תצוגה ------------------------ */
const ICON = {
  user: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  chat: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z"/></svg>',
  back: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  plus: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  close: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  cam: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-2h6l2 2h3v11H4z"/><circle cx="12" cy="13" r="3.4"/></svg>',
};

const kindTag = (k) => `<span class="tag ${KIND_LABEL[k] ? k : 'copy'}">${KIND_LABEL[k] || KIND_LABEL.copy}</span>`;
const deptOf = (cat) => S.depts.find((d) => d.categories.some((c) => c.id === cat));
const catLabel = (id) => {
  for (const d of S.depts) { const hit = d.categories.find((c) => c.id === id); if (hit) return hit.label; }
  return id;
};
const deptLabel = (id) => (S.depts.find((d) => d.id === id) || {}).label || id;
const currentDept = () => S.depts.find((d) => d.id === S.dept);

/* --------------------------- ניווט --------------------------- */
function go(screen) {
  S.screen = screen;
  window.scrollTo({ top: 0, behavior: 'instant' });
  render();
}

function filterParams(extra = {}) {
  const p = new URLSearchParams();
  if (S.q) p.set('q', S.q);
  if (S.dept !== 'all') p.set('department', S.dept);
  if (S.category !== 'all') p.set('category', S.category);
  if (S.kind !== 'all') p.set('kind', S.kind);
  if (S.vkind !== 'all') p.set('vehicle_kind', S.vkind);
  if (S.vmake !== 'all') p.set('vehicle_make', S.vmake);
  if (S.vmodel) p.set('vehicle_model', S.vmodel);
  if (S.vyear) p.set('year', S.vyear);
  for (const [k, v] of Object.entries(extra)) p.set(k, v);
  return p;
}

function anyFilter() {
  return Boolean(S.q) || S.dept !== 'all' || S.category !== 'all' || S.kind !== 'all'
    || S.vkind !== 'all' || S.vmake !== 'all' || Boolean(S.vmodel) || Boolean(S.vyear);
}

function resetFilters() {
  S.q = ''; S.dept = 'all'; S.category = 'all'; S.kind = 'all';
  S.vkind = 'all'; S.vmake = 'all'; S.vmodel = ''; S.vyear = ''; S.models = [];
  const box = $('#q'); if (box) box.value = '';
}

/* ------------------------- טעינת נתונים ------------------------- */
/* חיפוש לפי מק״ט או שם מחזיר פוזיציות; דפדוף לפי מדף ומסננים נשאר
   רשימת הצעות. אלה שתי שאלות שונות — "מי מוכר את החלק הזה" מול
   "מה יש במדף" — ולכל אחת מבנה תשובה משלה. */
async function loadCatalog() {
  S.loading = true; render();
  const q = (S.q || '').trim();
  try {
    if (q) {
      // המסננים נשלחים, אבל בשרת הם פועלים רק בחיפוש לפי שם:
      // מק״ט מדויק לא ייעלם בגלל מסנן שנשאר פתוח מקודם
      const data = await api(`/search?${filterParams()}`);
      S.groups = data;
      S.total = data.exact.length + data.compatible.length;
    } else {
      /* גם הדפדוף מחזיר פוזיציות: אותו חלק היה מופיע במדף אצל כל
         מוכר בנפרד, וזו אותה תקלה שהחיפוש תוקן בגללה. */
      const data = await api(`/positions?${filterParams({ limit: 48 })}`);
      S.groups = { query: { mode: 'browse' }, exact: data.items, compatible: [], compatible_without_offers: 0 };
      S.total = data.pagination.total;
      S.browseTotal = data.pagination.total; S.browsePage = 1;
    }
  } catch (e) { toast(e.message, true); S.groups = null; S.total = 0; }
  S.loading = false; render();
}

/* התמצית ורשימת המוכרים נטענות בנפרד: ראש המסך נצבע מיד ולא מחכה
   לרשימה, שאצל פוזיציה מבוקשת יכולה להיות ארוכה. */
/* "עוד" קיים כי רשימה שנגמרת בשקט משכנעת שזה כל מה שיש. */
async function loadMoreBrowse() {
  if (S.loadingMore || !S.groups) return;
  S.loadingMore = true; render();
  try {
    const data = await api(`/positions?${filterParams({ limit: 48, page: S.browsePage + 1 })}`);
    S.browsePage += 1;
    S.groups = { ...S.groups, exact: [...S.groups.exact, ...data.items] };
  } catch (e) { toast(e.message, true); }
  S.loadingMore = false; render();
}

async function loadMoreOffers() {
  if (S.loadingMore || !S.pos) return;
  S.loadingMore = true; render();
  try {
    const { offers } = await api(`/positions/${S.pos.id}/offers?page=${S.posPage + 1}`);
    S.posPage += 1;
    S.posOffers = [...S.posOffers, ...offers];
  } catch (e) { toast(e.message, true); }
  S.loadingMore = false; render();
}

/* עמוד הספק נטען בבקשה אחת: פרופיל, מספרים והעמוד הראשון של המדף.
   מאיפה הגיעו נשמר — נכנסים לכאן מתוצאות החיפוש ומכרטיס הצעה. */
async function loadSeller(id, from) {
  S.sup = null; S.supStats = null; S.supParts = []; S.supTotal = 0; S.supPage = 1;
  S.supLoading = true; S.supCat = 'all'; S.supBack = from || 'catalog';
  go('seller');
  try {
    const data = await api(`/sellers/${id}`);
    S.sup = data.seller; S.supStats = data.stats;
    S.supParts = data.parts; S.supTotal = data.pagination.total;
  } catch (e) { toast(e.message, true); }
  S.supLoading = false; render();
}

// המערכת שנבחרה נשלחת גם ב"עוד": בלעדיה העמוד השני היה מחזיר את כל
// המדף ומערבב פנימה פריטים ממערכות אחרות
function supQuery(extra) {
  const qs = new URLSearchParams(extra || {});
  if (S.supCat !== 'all') qs.set('category', S.supCat);
  return qs.toString();
}

async function loadMoreSup() {
  if (S.loadingMore || !S.sup) return;
  S.loadingMore = true; render();
  try {
    const data = await api(`/sellers/${S.sup.id}?${supQuery({ page: S.supPage + 1 })}`);
    S.supPage += 1;
    S.supParts = [...S.supParts, ...data.parts];
  } catch (e) { toast(e.message, true); }
  S.loadingMore = false; render();
}

/* בחירת מערכת טוענת מחדש רק את המדף — הפרופיל והספירות אינם תלויים
   במסנן, ואין סיבה שהמסך כולו יהבהב. */
async function loadSupCat(cat) {
  if (!S.sup || S.supCat === cat) return;
  S.supCat = cat; S.supPage = 1; S.supLoading = true; render();
  try {
    const data = await api(`/sellers/${S.sup.id}?${supQuery()}`);
    S.supParts = data.parts; S.supTotal = data.pagination.total;
  } catch (e) { toast(e.message, true); }
  S.supLoading = false; render();
}

async function loadPosition(id) {
  S.pos = null; S.posOffers = []; S.posCompat = []; S.posEmpty = 0; S.posLoading = true;
  S.posTotal = 0; S.posPage = 1;
  go('position');
  try {
    const data = await api(`/positions/${id}`);
    S.pos = data.position; S.posCompat = data.compatible; S.posEmpty = data.compatible_without_offers;
    render();
    const { offers, pagination } = await api(`/positions/${id}/offers`);
    S.posOffers = offers; S.posTotal = pagination.total; S.posPage = 1;
  } catch (e) { toast(e.message, true); }
  S.posLoading = false; render();
}

async function loadModels() {
  if (S.vmake === 'all') { S.models = []; return; }
  try {
    const p = new URLSearchParams({ make: S.vmake });
    if (S.vkind !== 'all') p.set('kind', S.vkind);
    S.models = (await api(`/vehicles/models?${p}`)).models;
  } catch (e) { S.models = []; }
}

async function openPart(id, from) {
  S.part = null; S.partBack = from || 'catalog'; go('part');
  try {
    const { part } = await api(`/parts/${id}`);
    S.part = part;
  } catch (e) { toast(e.message, true); }
  render();
}

async function loadChats() {
  S.loading = true; render();
  try { S.convs = (await api('/conversations')).conversations; }
  catch (e) { toast(e.message, true); S.convs = []; }
  S.loading = false; render();
}

async function openConv(id) {
  try {
    const data = await api(`/conversations/${id}`);
    S.conv = data.conversation; S.msgs = data.messages;
    // בקשות ההזמנה הן חלק מהשיחה, לא מסך נפרד: הן נשלחות בתוכה
    // ונענות בתוכה. באתר הן פשוט לא נטענו, ולכן הקבינט הראה מונה
    // "בקשות פתוחות" שאי אפשר היה להזיז ממנו
    S.reqs = data.order_requests || [];
    S.orderOpen = false;
    render();
    const box = $('#msgs'); if (box) box.scrollTop = box.scrollHeight;
  } catch (e) { toast(e.message, true); }
}

async function loadCabinet() {
  S.loading = true; render();
  try {
    const [{ parts }, stats] = await Promise.all([api('/sellers/me/parts'), api('/sellers/me/stats')]);
    S.stock = parts; S.stats = stats;
  } catch (e) { toast(e.message, true); }
  S.loading = false; render();
}

async function loadMe() {
  if (!authed()) return;
  try { S.me = isSeller() ? (await api('/sellers/me/profile')).seller : (await api('/auth/me')).user; }
  catch (e) { /* טוקן שפג כבר נוקה */ }
}

/* ============================ מסכים ============================ */

function railFilters() {
  const dep = currentDept();
  const kindObj = S.vehicles.find((v) => v.id === S.vkind);
  const makes = kindObj ? kindObj.makes : [];

  return `
    <aside class="rail">
      <div class="railgroup">
        <div class="railhead">
          <span>מה מחפשים</span>
          ${anyFilter() ? '<button class="link" data-act="clear">נקה הכל</button>' : ''}
        </div>
        <div class="card" style="overflow:hidden">
          ${S.depts.map((d) => `
            <button class="row" data-act="dept" data-dept="${esc(d.id)}" aria-pressed="${S.dept === d.id}"
              style="width:100%;gap:10px;padding:11px 14px;border-top:${S.depts[0] === d ? '0' : '1px solid var(--line)'};
                     background:${S.dept === d.id ? 'var(--ink)' : 'transparent'};color:${S.dept === d.id ? '#fff' : 'inherit'}">
              <span style="font:500 var(--fs-sub) var(--sans)">${esc(d.label)}</span>
              <span style="margin-inline-start:auto;font-size:var(--fs-micro);opacity:.6">${esc(d.hint || '')}</span>
            </button>`).join('') || '<div class="pad label">טוען…</div>'}
        </div>
      </div>

      ${dep ? `<div class="railgroup">
        <div class="railhead"><span>${dep.id === 'parts' ? 'איזו מערכת' : 'מה בדיוק'}</span></div>
        <div class="chips">
          <button class="chip" data-act="cat" data-cat="all" aria-pressed="${S.category === 'all'}">הכל</button>
          ${dep.categories.map((c) => `<button class="chip" data-act="cat" data-cat="${esc(c.id)}" aria-pressed="${S.category === c.id}">${esc(c.label)}</button>`).join('')}
        </div>
      </div>` : ''}

      <div class="railgroup">
        <div class="railhead"><span>הרכב</span></div>
        <div class="field"><select data-act="vkind">
          <option value="all">כל סוגי הרכב</option>
          ${S.vehicles.map((v) => `<option value="${esc(v.id)}" ${S.vkind === v.id ? 'selected' : ''}>${esc(v.label)}</option>`).join('')}
        </select></div>
        <div class="field"><select data-act="vmake" ${makes.length ? '' : 'disabled'}>
          <option value="all">כל היצרנים</option>
          ${makes.map((m) => `<option value="${esc(m)}" ${S.vmake === m ? 'selected' : ''}>${esc(m)}</option>`).join('')}
        </select></div>
        ${S.vmake !== 'all' ? `<div class="field"><input data-act="vmodel" list="modelList" value="${esc(S.vmodel)}" placeholder="דגם — למשל Corolla E210" autocomplete="off">
          <datalist id="modelList">${S.models.map((m) => `<option value="${esc(m)}"></option>`).join('')}</datalist></div>` : ''}
        <div class="field"><select data-act="vyear">
          <option value="">כל השנים</option>
          ${YEARS.map((y) => `<option value="${y}" ${String(S.vyear) === String(y) ? 'selected' : ''}>${y}</option>`).join('')}
        </select></div>
      </div>

      <div class="railgroup">
        <div class="railhead"><span>מצב החלק</span></div>
        <div class="chips">
          ${KIND_LIST.map(([k, t]) => `<button class="chip" data-act="kind" data-kind="${k}" aria-pressed="${S.kind === k}">${t}</button>`).join('')}
        </div>
      </div>
    </aside>`;
}

/* חיפוש לפי מק״ט מתעלם מהסינון בכוונה, ולכן אסור שהפירורים ימשיכו
   להציג אותו כאילו הוא פועל. */
function byNumber() {
  return Boolean(S.groups && S.groups.query
    && (S.groups.query.mode === 'exact' || S.groups.query.mode === 'prefix'));
}

function crumbs() {
  const vk = S.vehicles.find((v) => v.id === S.vkind);
  const parts = [
    S.q ? ['q', `"${S.q}"`] : null,
    S.dept !== 'all' ? ['dept', deptLabel(S.dept)] : null,
    S.category !== 'all' ? ['cat', catLabel(S.category)] : null,
    vk ? ['vkind', vk.label] : null,
    S.vmake !== 'all' ? ['vmake', S.vmake] : null,
    S.vmodel ? ['vmodel', S.vmodel] : null,
    S.vyear ? ['vyear', String(S.vyear)] : null,
    S.kind !== 'all' ? ['kind', KIND_LABEL[S.kind]] : null,
  ].filter(Boolean);
  if (!parts.length) return '';
  return `<div class="crumbs">${parts.map(([key, text]) => `
    <span class="on">${esc(text)}<button data-act="drop" data-key="${key}" aria-label="הסר">${ICON.close}</button></span>`).join('')}</div>`;
}


/* רשימת האנלוגים ירדה מכרטיס המוכר: היא הייתה בדיוק מה שמסך
   הפוזיציה עושה, רק שערבבה מוכרים של אותו מק״ט עם מנפיקים אחרים.
   שתי רשימות שאומרות אותו דבר בשתי צורות זה בלבול, לא בחירה. */

/* ============ כרטיס פוזיציה ============
   בתוצאות מופיעות פוזיציות ולא הצעות: חיפוש של 04465-02220 היה
   מחזיר ארבעה כרטיסים שהם חלק אחד אצל ארבעה מוכרים.

   בראש הכרטיס המחיר הנמוך ביותר ולא הממוצע: את הממוצע אי אפשר
   לקנות. הממוצע נשאר מתחתיו כהקשר — כדי ש-120 של חלק פירוק לא
   ייקרא כמחיר של חדש מקורי. */
function posCard(c) {
  return `
    <article class="item" data-act="open-pos" data-id="${c.id}">
      <div class="body">
        <div class="row" style="gap:8px;align-items:baseline;flex-wrap:wrap">
          <span class="mono" style="font-weight:600;font-size:var(--fs-lead)">${esc(c.number || '')}</span>
          <span class="label">${esc(c.brand)}</span>
        </div>
        ${c.name ? `<h3 style="font-weight:400;color:var(--muted)">${esc(c.name)}</h3>` : ''}
        ${c.matched_number && c.matched_number !== c.number
          ? `<span class="label" style="font-size:var(--fs-micro);color:var(--brand)">חיפשתם <span class="mono">${esc(c.matched_number)}</span> · המק״ט הראשי היום</span>`
          : c.aka.length ? `<span class="label" style="font-size:var(--fs-micro)">ידוע גם כ <span class="mono">${esc(c.aka.join(' · '))}</span></span>` : ''}
        ${c.fits && c.fits.length ? `<span class="mono muted" style="font-size:var(--fs-micro)">${esc(c.fits[0])}${c.fits.length > 1 ? ` +${c.fits.length - 1}` : ''}</span>` : ''}
        <div class="foot">
          <div class="row" style="gap:6px;flex-wrap:wrap">
            ${c.by_kind.map((k) => kindTag(k.kind)).join('')}
            <span class="label">${c.offers === 1 ? 'ספק אחד' : `${c.offers} ספקים`}</span>
          </div>
          ${c.price ? `<span class="stack" style="gap:2px;align-items:flex-end">
              ${c.price.min !== c.price.max ? '<span class="label" style="font-size:var(--fs-micro)">החל מ</span>' : ''}
              <span class="price">${shekel(c.price.min)}</span>
              ${c.price.min !== c.price.max ? `<span class="mono muted" style="font-size:var(--fs-micro)">ממוצע ${shekel(c.price.avg)}</span>` : ''}
            </span>` : '<span class="label">אין הצעות</span>'}
        </div>
      </div>
    </article>`;
}

/* הכותרת עומדת לפני הרשימה ולא על כל כרטיס: היותן של מנפיקים אחרים
   היא תכונה של הקבוצה כולה.

   ההסתייגות מאחורי סימן שאלה ולא בשורה שנייה קבועה: אזהרה שתמיד
   על המסך מפסיקים לראות, ומי שמתלבט לוחץ ומקבל אותה. */
function compatHead(empty) {
  return `<div class="stack" style="gap:8px;margin: var(--s6) 0 var(--s4)">
    <div class="row between" style="gap: var(--s4)">
      <span class="row" style="gap:8px">
        <span style="font:600 var(--fs-lead) var(--disp)">עשוי להתאים</span>
        <button class="qmark" data-act="compat-note" aria-expanded="${S.compatNote}"
                aria-controls="compatNote" aria-label="על ההתאמה">?</button>
      </span>
      ${empty ? `<span class="label">עוד ${empty} מק״טים · אין במלאי</span>` : ''}
    </div>
    ${S.compatNote ? `<div class="note" id="compatNote">${NOTE_FIT}</div>` : ''}
  </div>`;
}

/* מק״ט שלא נמצא הוא מבוי סתום: "לא נמצא" לבדו לא אומר מה לעשות
   עכשיו. מספר שאינו בקטלוג עדיין יכול להימצא אצל ספק. */
function deadEnd() {
  const numberish = S.groups && S.groups.query && S.groups.query.numberish;
  return numberish
    ? `<span style="font:600 var(--fs-lead) var(--disp);color:var(--ink)">המק״ט ${esc(S.q.trim())} לא נמצא</span>
       <span>בדקו את המספר, או חפשו לפי שם החלק — מק״ט שאינו בקטלוג עדיין יכול להיות אצל ספק</span>`
    : `<span style="font:600 var(--fs-lead) var(--disp);color:var(--ink)">לא נמצאו חלקים</span>
       <span>נסו מק״ט אחר, או הסירו חלק מהמסננים</span>`;
}

/* המונה סופר את מה שמצויר ולא את מה שהשרת החזיר, ובעברית יחיד
   ורבים אינם אותה מילה. */
function shownCount() {
  const g = S.groups;
  if (!g) return `${S.total} מק״טים`;
  // במדף סופרים את הסך הכול; "עוד" למטה אומר כמה כבר נטענו
  if (g.query && g.query.mode === 'browse') return `${S.browseTotal} מק״טים`;
  const pick = (l) => (S.kind === 'all' ? l : l.filter((c) => c.by_kind.some((k) => k.kind === S.kind)));
  const n = pick(g.exact).length + pick(g.compatible).length;
  const sup = (g.sellers || []).length;
  // ספק שנמצא בשם הוא תוצאה: "אין תוצאות" מעל כרטיס ספק הוא שקר
  const supWord = sup ? ` · ${sup === 1 ? 'ספק אחד' : `${sup} ספקים`}` : '';
  if (!n) return sup ? `אין מק״טים${supWord}` : 'אין תוצאות';
  return (n === 1 ? 'מק״ט אחד' : `${n} מק״טים`) + supWord;
}

/* "עוד" רק כשנשאר עוד, ותמיד עם המספרים — אחרת השאלה "נגמר או שיש
   עוד?" נשארת פתוחה. */
function moreBtn(shown, total, act, label) {
  if (!total || shown >= total) return '';
  return `<div class="row" style="justify-content:center;margin-top: var(--s5)">
    <button class="btn ghost" data-act="${act}"${S.loadingMore ? ' disabled' : ''}>
      ${S.loadingMore ? 'טוען…' : `${label} · מוצגים ${shown} מתוך ${total}`}</button></div>`;
}

/* ספק בלי פריטים אינו "0 מק״טים" — הוא פשוט עוד לא פרסם כלום */
function shelfLine(st) {
  const s = st || {};
  if (!s.positions) return 'עדיין לא פרסם מלאי';
  return `${s.positions === 1 ? 'מק״ט אחד' : `${s.positions} מק״טים`}${s.in_stock ? '' : ' · אין במלאי'}`;
}

/* כרטיס ספק בתוצאות. לחיפוש יש שתי תשובות אפשריות — מק״ט או ספק —
   ו"פירוקים אשדוד" הוא שם של עסק, לא מספר. הספקים הם רשימה נפרדת
   עם כותרת משלה: שני דברים שונים שעונים על שתי שאלות שונות. */
function supCard(s) {
  const st = s.stats || {};
  return `
    <article class="item" data-act="open-sup" data-id="${s.id}">
      <div class="body">
        <div class="row" style="gap:8px;align-items:baseline;flex-wrap:wrap">
          <span style="font:600 var(--fs-lead) var(--disp)">${esc(s.name)}</span>
          <span class="label">${esc(s.city || '')}${s.verified ? ' · מאומת' : ''}</span>
        </div>
        ${s.supplies ? `<h3 style="font-weight:400;color:var(--muted)">${esc(s.supplies)}</h3>` : ''}
        <div class="foot">
          <span class="label">${shelfLine(st)}</span>
        </div>
      </div>
    </article>`;
}

function supResults() {
  const sellers = (S.groups && S.groups.sellers) || [];
  if (!sellers.length) return '';
  return `<div class="stack" style="gap:8px;margin: var(--s6) 0 var(--s4)">
      <span style="font:600 var(--fs-lead) var(--disp)">ספקים</span>
      <span class="label">עסקים שהשם או התחום שלהם מתאים לחיפוש</span>
    </div>
    <div class="results">${sellers.map(supCard).join('')}</div>`;
}

function groupResults() {
  const g = S.groups;
  // סינון המצב פועל על הפוזיציות שיש בהן הצעה כזאת — המצב הוא תכונה
  // של ההצעה, לא של המק״ט
  const pick = (list) => (S.kind === 'all' ? list : list.filter((c) => c.by_kind.some((k) => k.kind === S.kind)));
  const exact = pick(g.exact); const compat = pick(g.compatible);
  const sup = supResults();
  if (!exact.length && !compat.length) {
    // בקטלוג לא נמצא כלום, אבל ספק בשם הזה כן — וזו תשובה, לא כישלון.
    // המונה שבראש המסך כבר אומר "אין מק״טים · ספק אחד"
    return sup || null;
  }
  return `
    <div class="results">${exact.map(posCard).join('')}</div>
    ${g.query && g.query.mode === 'browse' ? moreBtn(exact.length, S.browseTotal, 'more-browse', 'עוד מק״טים') : ''}
    ${compat.length ? compatHead(g.compatible_without_offers) + `<div class="results">${compat.map(posCard).join('')}</div>` : ''}
    ${sup}`;
}

function viewCatalog() {
  return `
    <div class="wrap cols">
      ${railFilters()}
      <section>
        <div class="toolbar">
          <div class="stack" style="gap:6px">
            <h1 style="margin:0;font:600 var(--fs-hero)/1.2 var(--disp)">${S.q ? 'תוצאות חיפוש' : 'קטלוג החלקים'}</h1>
            <span class="label">${S.loading ? 'מחפש…' : shownCount()}</span>
          </div>
          ${crumbs()}
          ${byNumber() ? '<span class="label">חיפוש לפי מק״ט · הסינון לא הופעל</span>' : ''}
        </div>
        ${S.loading ? '<div class="spin"></div>'
          : (S.groups && groupResults())
            || `<div class="empty">${deadEnd()}
                 ${anyFilter() ? '<button class="btn ghost" data-act="clear">נקה סינון</button>' : ''}</div>`}
      </section>
    </div>`;
}


/* ============================ מסך: פוזיציה ============================
   התמצית עונה קודם על "מה זה בעצם" — איזה חלק, באילו מק״טים הוא
   נקרא, על איזה רכב הוא עולה וכמה הוא עולה — ורק אחריה באים
   המוכרים. לפני שיודעים מה זה, אין טעם להשוות מחירים. */
function viewPosition() {
  const c = S.pos;
  if (!c) return '<div class="wrap"><div class="spin"></div></div>';
  const nums = [c.number, ...c.aka].filter(Boolean);
  const kinds = c.by_kind.filter((k) => k.offers);
  return `
    <div class="wrap">
      <button class="link row" data-act="back" style="gap:6px;margin-bottom: var(--s5)">${ICON.back} חזרה לקטלוג</button>
      <div class="cols" style="grid-template-columns:1fr 380px">
        <section class="stack" style="gap: var(--s5)">
          <div class="card stack" style="gap: var(--s4);padding: var(--s6)">
            <div class="stack" style="gap:6px">
              <span class="label">${esc(c.brand)}</span>
              <span class="mono" style="font:600 32px/1.1 var(--mono)">${esc(c.number || '')}</span>
              ${c.name ? `<h1 style="margin:0;font:400 var(--fs-lead)/1.3 var(--sans);color:var(--muted)">${esc(c.name)}</h1>` : ''}
            </div>
            <div class="stack" style="gap:0;border-top:1px solid var(--line)">
              ${nums.length > 1 ? posRow('מק״טים', `<span class="mono">${esc(nums.join(' · '))}</span>`) : ''}
              ${c.fits && c.fits.length ? posRow('מתאים ל', c.fits.map((f) => `<span class="mono">${esc(f)}</span>`).join('<br>')) : ''}
              ${kinds.length > 1 ? posRow('לפי מצב', kinds.map((k) =>
                `<span class="row" style="gap:6px;align-items:baseline;justify-content:flex-end">${kindTag(k.kind)}<span>מ־<span class="mono">${shekel(k.min)}</span></span></span>`).join('')) : ''}
              ${posRow('ספקים', `<span><span class="mono">${c.offers}</span>${c.in_stock < c.offers ? ` · <span class="mono">${c.in_stock}</span> במלאי` : ''}</span>`)}
            </div>
          </div>

          <div class="stack" style="gap:4px">
            <span style="font:600 var(--fs-lead) var(--disp)">ספקים</span>
            <span class="label">אותו מק״ט אצל ספקים שונים · הזול קודם</span>
          </div>
          ${S.posLoading ? '<div class="spin"></div>' : S.posOffers.length
            ? `<div class="card" style="overflow:hidden"><table>
                 <thead><tr><th>ספק</th><th>מצב</th><th>יצרן</th><th>מלאי</th><th>מחיר</th></tr></thead>
                 <tbody>${S.posOffers.map(offerRow).join('')}</tbody></table></div>
               ${moreBtn(S.posOffers.length, S.posTotal, 'more-offers', 'עוד ספקים')}`
            : `<div class="empty"><span style="font:600 var(--fs-lead) var(--disp);color:var(--ink)">אין הצעות כרגע</span>
                 <span>המק״ט מוכר לנו, אבל אף ספק לא מציע אותו</span></div>`}
        </section>

        <aside class="stack" style="gap: var(--s4)">
          ${c.price ? `<div class="card stack" style="gap:6px;padding: var(--s5)">
            <span class="label">${c.price.min !== c.price.max ? 'מחיר החל מ' : 'מחיר'}</span>
            <span class="price" style="font-size:30px">${shekel(c.price.min)}</span>
            ${c.price.min !== c.price.max ? `<span class="mono muted" style="font-size:var(--fs-label)">ממוצע ${shekel(c.price.avg)} · עד ${shekel(c.price.max)}</span>` : ''}
          </div>` : ''}
          ${S.posCompat.length ? `<div class="stack" style="gap: var(--s3)">
            ${compatHead(S.posEmpty)}
            ${S.posCompat.map(posCard).join('')}
          </div>` : ''}
        </aside>
      </div>
    </div>`;
}

function posRow(label, value) {
  return `<div class="row between" style="gap: var(--s5);padding: var(--s3) 0;border-bottom:1px solid var(--line);align-items:flex-start">
    <span class="label" style="flex:none">${esc(label)}</span>
    <span style="text-align:end;min-width:0;font-size:var(--fs-sub)">${value}</span>
  </div>`;
}

/* שורת מוכר בתוך פוזיציה. המק״ט אינו חוזר כאן — הוא בכותרת המסך
   וזהה לכולם; מה שמבדיל הוא מחיר, מצב ומלאי. */
function offerRow(p) {
  const s = p.seller;
  return `<tr data-act="open-offer" data-id="${p.id}" style="cursor:pointer">
    <td><span style="font-weight:500">${esc((s && s.name) || 'ספק')}</span>
        <span class="label" style="display:block">${esc((s && s.city) || '')}${s && s.verified ? ' · מאומת' : ''}</span></td>
    <td>${kindTag(p.kind)}${p.kind === 'used' && p.condition_pct ? ` <span class="label">מצב <span class="mono">${p.condition_pct}%</span></span>` : ''}</td>
    <td class="mono muted">${esc(p.maker || '—')}</td>
    <td class="label">${p.stock === 'in' && p.qty > 0 ? `${p.qty} במלאי` : 'אזל'}</td>
    <td><span class="price">${shekel(p.price)}</span></td>
  </tr>`;
}

/* מק״ט מנוקה מסימנים, להשוואה בלבד */
const numKey = (v) => String(v == null ? '' : v).toUpperCase().replace(/[^A-Z0-9]/g, '');

function viewPart() {
  const p = S.part;
  if (!p) return '<div class="wrap"><div class="spin"></div></div>';
  /* המספר של הכרטיס עצמו יורד מהרשימות: מוכר של החלק המקורי רושם
     את המק״ט שלו גם כמספר מקורי, ואז המסך אומר שהחלק מחליף את עצמו */
  const self = numKey(p.part_no);
  const all = (p.interchange_numbers || []).filter((n) => numKey(n.number) !== self);
  const oems = all.filter((n) => n.is_oem);
  const nums = all.filter((n) => !n.is_oem);
  const s = p.seller;

  return `
    <div class="wrap">
      <button class="link row" data-act="back" style="gap:6px;margin-bottom: var(--s5)">${ICON.back} ${
        S.partBack === 'position' ? 'חזרה למק״ט' : S.partBack === 'seller' ? 'חזרה לספק' : 'חזרה לקטלוג'}</button>

      <div class="cols" style="grid-template-columns:1fr 380px">
        <section class="stack" style="gap: var(--s5)">
          <div class="card" style="display:grid;grid-template-columns:${p.image_url ? '260px 1fr' : '1fr'};gap: var(--s6);padding: var(--s6)">
            ${p.image_url ? `<div style="height:220px;border-radius:14px;background:#f1eeea url('${esc(p.image_url)}') center/contain no-repeat"></div>` : ''}
            <div class="stack" style="gap: var(--s3);min-width:0">
              <h1 style="margin:0;font:600 var(--fs-hero)/1.2 var(--disp)">${esc(p.name)}</h1>
              <span class="mono" style="font-weight:600;font-size:var(--fs-lead)">${esc(p.part_no)}</span>
              <div class="row" style="gap: var(--s2);flex-wrap:wrap">
                ${kindTag(p.kind)}
                ${p.maker ? `<span class="mono muted" style="font-size:var(--fs-label)">${esc(p.maker)}</span>` : ''}
                <span class="label">${catLabel(p.category)}</span>
              </div>
              ${p.fits ? `<span class="mono muted" style="font-size:var(--fs-label)">${esc(p.fits)}</span>` : ''}
              <div class="row" style="gap: var(--s4);margin-top:auto;padding-top: var(--s4)">
                <span class="price" style="font-size:26px">${shekel(p.price)}</span>
                <span class="label">${p.qty > 0 ? `${p.qty} במלאי` : 'אזל מהמלאי'}</span>
              </div>
            </div>
          </div>

          ${(oems.length || nums.length) ? `<div class="card" style="overflow:hidden">
            ${oems.length ? `<div class="row" style="gap: var(--s5);padding: var(--s4) var(--s5);align-items:flex-start">
              <span class="label" style="width:150px;flex:none;padding-top:4px">מק״ט מקורי</span>
              <div class="chips">${oems.map((n) => `<span class="num oem" style="font-size:var(--fs-label);padding:5px 11px">${esc(n.number)}</span>`).join('')}</div>
            </div>` : ''}
            ${nums.length ? `<div class="row" style="gap: var(--s5);padding: var(--s4) var(--s5);align-items:flex-start;border-top:${oems.length ? '1px solid var(--line)' : '0'}">
              <span class="label" style="width:150px;flex:none;padding-top:4px">מק״טים חופפים</span>
              <div class="chips">${nums.map((n) => `<span class="num" style="font-size:var(--fs-label);padding:5px 11px" title="${esc(n.brand || '')}">${esc(n.number)}</span>`).join('')}</div>
            </div>` : ''}
          </div>` : ''}

          ${p.position_id ? `<div class="card row between" style="gap: var(--s4);padding: var(--s5);cursor:pointer"
               data-act="open-pos" data-id="${p.position_id}">
            <div class="stack" style="gap:4px">
              <span style="font:600 var(--fs-lead) var(--disp)">כל הספקים של המק״ט הזה</span>
              <span class="label">${p.catalog && p.catalog.others > 0
                ? `עוד ${p.catalog.others === 1 ? 'ספק אחד' : `${p.catalog.others} ספקים`} · להשוות מחיר, מצב ומלאי`
                : 'להשוות מחיר, מצב ומלאי במקום אחד'}</span>
            </div>
            ${p.catalog && numKey(p.catalog.number) !== self
              ? `<span class="mono" style="font-weight:600;font-size:var(--fs-lead)">${esc(p.catalog.number)}</span>` : ICON.back}
          </div>` : ''}
        </section>

        <aside class="stack" style="gap: var(--s4);position:sticky;top:calc(var(--head) + var(--s6))">
          <div class="card pad stack" style="gap: var(--s4)">
            <div class="stack" style="gap:2px;min-width:0">
              <span style="font:500 var(--fs-body) var(--sans)">${esc(s ? s.name : 'לא ידוע')}</span>
              <span class="label">${esc(s ? s.city : '')}${s && s.verified ? ' · מאומת' : ''}${s ? ` · דירוג <span class="mono">${s.rating}</span> (${s.reviews_count})` : ''}</span>
            </div>
            <div class="stack" style="gap: var(--s2)">
              <div class="row" style="justify-content:space-between"><span class="label">טלפון</span><span class="mono" style="font-size:var(--fs-sub)">${esc(s ? s.phone : '—')}</span></div>
              ${s && s.address ? `<div class="row" style="justify-content:space-between;gap: var(--s4)"><span class="label">כתובת</span><span style="font-size:var(--fs-sub);text-align:end">${esc(s.address)}</span></div>` : ''}
              ${s && s.hours ? `<div class="row" style="justify-content:space-between;gap: var(--s4)"><span class="label">שעות</span><span style="font-size:var(--fs-sub);text-align:end">${esc(s.hours)}</span></div>` : ''}
            </div>
            <button class="btn wide" data-act="ask" data-id="${p.id}" data-seller="${s ? s.id : ''}">שליחת הודעה למוכר</button>
            ${s && s.whatsapp ? `<a class="btn line wide" href="https://wa.me/${esc(String(s.whatsapp).replace(/[^0-9]/g, ''))}" target="_blank" rel="noopener">וואטסאפ</a>` : ''}
            ${s && s.id ? `<button class="btn ghost wide" data-act="open-sup" data-id="${s.id}">לעמוד הספק · כל מה שהוא מוכר</button>` : ''}
          </div>
        </aside>
      </div>
    </div>`;
}

/* בקשת הזמנה בתוך השיחה. אצל המוכר יש עליה שני כפתורים — זו הנקודה
   שבה "בקשה פתוחה" הופכת לתשובה, ובלעדיהם המונה בקבינט לא זז. */
function orderCard(r) {
  const mine = !isSeller();
  const label = r.status === 'sent' ? 'ממתינה' : r.status === 'accepted' ? 'אושרה' : 'נדחתה';
  return `<div class="card stack" style="gap: var(--s3);padding: var(--s4) var(--s5);max-width:82%;align-self:${mine ? 'flex-end' : 'flex-start'}">
    <span class="label">בקשת הזמנה · ${label}</span>
    <div class="stack" style="gap:6px">
      <div class="row between" style="gap: var(--s5)"><span class="label">מק״ט</span><span class="mono" style="font-size:var(--fs-sub)">${esc(r.part_no || '—')}</span></div>
      <div class="row between" style="gap: var(--s5)"><span class="label">כמות</span><span class="mono" style="font-size:var(--fs-sub)">${r.qty}</span></div>
      ${r.vehicle ? `<div class="row between" style="gap: var(--s5)"><span class="label">רכב</span><span style="font-size:var(--fs-sub)">${esc(r.vehicle)}</span></div>` : ''}
    </div>
    ${isSeller() && r.status === 'sent' ? `<div class="row" style="gap: var(--s3)">
      <button class="btn" data-act="answer" data-id="${r.id}" data-status="accepted" style="flex:1">אישור</button>
      <button class="btn line" data-act="answer" data-id="${r.id}" data-status="declined">דחייה</button>
    </div>` : ''}
  </div>`;
}

function viewChats() {
  if (!authed()) return signInWall('כדי לפנות למוכרים צריך חשבון');
  const other = (c) => (isSeller() ? (c.buyer && c.buyer.name) : (c.seller && c.seller.name)) || '—';

  return `
    <div class="wrap">
      <h1 style="margin:0 0 var(--s5);font:600 var(--fs-hero)/1.2 var(--disp)">הודעות</h1>
      ${S.loading ? '<div class="spin"></div>' : !S.convs.length
        ? '<div class="empty"><span style="font:600 var(--fs-lead) var(--disp);color:var(--ink)">אין עדיין שיחות</span><span>שיחה נפתחת מכרטיס החלק</span></div>'
        : `<div class="chatcols">
        <div class="threadlist">
          ${S.convs.map((c) => `<button class="thread" data-act="open-conv" data-id="${c.id}" aria-current="${S.conv && S.conv.id === c.id}">
            <span style="font:500 var(--fs-sub) var(--sans)">${esc(other(c))}</span>
            <span class="label" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(c.last_message ? c.last_message.body : (c.part ? c.part.name : 'שיחה חדשה'))}</span>
          </button>`).join('')}
        </div>
        <div class="card" style="display:flex;flex-direction:column;overflow:hidden">
          ${S.conv ? `
            <div class="row" style="gap: var(--s3);padding: var(--s4) var(--s5);border-bottom:1px solid var(--line)">
              <span style="font:500 var(--fs-body) var(--sans)">${esc(other(S.conv))}</span>
              ${S.conv.part ? `<span class="mono muted" style="font-size:var(--fs-label)">${esc(S.conv.part.part_no)}</span>` : ''}
            </div>
            <div class="msgs" id="msgs">
              ${S.msgs.map((m) => {
                const mine = isSeller() ? m.sender_role === 'seller' : m.sender_role === 'buyer';
                return `<div class="bubble ${mine ? 'me' : 'them'}">${esc(m.body)}</div>`;
              }).join('')}
              ${S.reqs.map(orderCard).join('')}
            </div>
            ${S.orderOpen && !isSeller() && S.conv.part ? `
            <form class="stack" data-act="order-submit" style="gap: var(--s3);padding: var(--s4) var(--s5);border-top:1px solid var(--line);background:var(--card)">
              <div class="row between" style="align-items:baseline">
                <span style="font:500 var(--fs-sub) var(--sans)">בקשת הזמנה</span>
                <span class="mono muted" style="font-size:var(--fs-label)">${esc(S.conv.part.part_no)}</span>
              </div>
              <div class="row" style="gap: var(--s4);align-items:flex-end">
                <div class="field" style="width:110px"><span>כמות</span>
                  <input class="mono" name="qty" type="number" min="1" value="1" required></div>
                <div class="field" style="flex:1"><span>רכב · לא חובה</span>
                  <input name="vehicle" placeholder="Corolla 2019" autocomplete="off"></div>
                <button class="btn line" type="button" data-act="order-form">ביטול</button>
                <button class="btn" type="submit">שליחת הבקשה</button>
              </div>
            </form>` : ''}
            <form class="row" data-act="send" style="gap: var(--s3);padding: var(--s4) var(--s5);border-top:1px solid var(--line)">
              ${!isSeller() && S.conv.part ? `<button class="btn ghost" type="button" data-act="order-form"
                aria-pressed="${S.orderOpen}">בקשת הזמנה</button>` : ''}
              <input name="body" placeholder="כתבו הודעה" autocomplete="off"
                     style="flex:1;background:var(--chip);border:0;border-radius:10px;padding:10px 14px;outline:none">
              <button class="btn" type="submit">שליחה</button>
            </form>`
          : '<div class="empty"><span>בחרו שיחה מהרשימה</span></div>'}
        </div>
      </div>`}
    </div>`;
}

function viewCabinet() {
  if (!authed() || !isSeller()) return signInWall('הקבינט הוא לחשבון מוכר');
  const st = S.stats;

  return `
    <div class="wrap">
      <div class="toolbar">
        <div class="stack" style="gap:6px">
          <h1 style="margin:0;font:600 var(--fs-hero)/1.2 var(--disp)">המלאי שלי</h1>
          <span class="label">${esc(S.me ? S.me.name : '')}</span>
        </div>
        <button class="btn row" data-act="new-part" style="gap:8px">${ICON.plus} פוזיציה חדשה</button>
      </div>

      <div class="results" style="grid-template-columns:repeat(3,1fr);margin-bottom: var(--s6)">
        ${[['במלאי', st ? st.in_stock : '—'], ['אזלו', st ? st.out_of_stock : '—'], ['בקשות פתוחות', st ? st.requests : '—']]
          .map(([t, v]) => `<div class="card pad stack" style="gap:4px">
            <span class="label">${t}</span>
            <span class="mono" style="font:600 26px var(--mono)">${v}</span>
          </div>`).join('')}
      </div>

      ${sellerProfileCard()}

      ${S.loading ? '<div class="spin"></div>' : !S.stock.length
        ? '<div class="empty"><span style="font:600 var(--fs-lead) var(--disp);color:var(--ink)">המלאי ריק</span><span>הפוזיציה הראשונה לוקחת דקה</span><button class="btn" data-act="new-part">פוזיציה חדשה</button></div>'
        : `<div class="card" style="overflow:hidden">
        <table>
          <thead><tr>
            <th style="width:34%">החלק</th><th>מק״ט</th><th>מצב</th><th>התאמה</th><th>מלאי</th><th>מחיר</th><th></th>
          </tr></thead>
          <tbody>
            ${S.stock.map((p) => `<tr>
              <td>
                <div class="row" style="gap: var(--s3)">
                  <div style="width:40px;height:40px;border-radius:10px;flex:none;background:#f1eeea ${p.image_url ? `url('${esc(p.image_url)}') center/contain no-repeat` : ''}"></div>
                  <span style="font:500 var(--fs-sub) var(--sans)">${esc(p.name)}</span>
                </div>
              </td>
              <td><span class="mono" style="font-size:var(--fs-label)">${esc(p.part_no)}</span></td>
              <td>${kindTag(p.kind)}</td>
              <td><span class="label">${esc(p.vehicle_make ? `${p.vehicle_make} ${p.vehicle_model || ''}` : '—')}</span></td>
              <td><span class="mono ${p.qty > 0 ? '' : 'muted'}" style="font-size:var(--fs-sub)">${p.qty > 0 ? p.qty : 'אזל'}</span></td>
              <td><span class="mono" style="font-weight:600">${shekel(p.price)}</span></td>
              <td style="text-align:end;white-space:nowrap">
                <button class="link" data-act="edit-part" data-id="${p.id}">עריכה</button>
                <button class="link" data-act="del-part" data-id="${p.id}" style="margin-inline-start:10px">מחיקה</button>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>`}
    </div>`;
}

/* ============================ מסך: עמוד הספק ============================

   מי שהגיע להצעה של ספק שואל מיד "מי זה, ומה עוד יש לו". עד היום
   התשובה הייתה שם ועיר בתוך כרטיס חלק, כלומר לא היה מקום לענות בו.
   כאן העסק מציג את עצמו, ומתחת נפרש המדף שלו — אותם פריטים, עם
   המחיר שהוא נקב ועם המק״ט שמוביל להשוואה מול כל השאר. */
function viewSeller() {
  const s = S.sup;
  if (!s) return '<div class="wrap"><div class="spin"></div></div>';
  const st = S.supStats || {};
  const wa = s.whatsapp ? String(s.whatsapp).replace(/[^0-9]/g, '') : '';
  const row = (label, value) => (value ? posRow(label, `<span>${esc(value)}</span>`) : '');
  return `
    <div class="wrap">
      <button class="link row" data-act="back" style="gap:6px;margin-bottom: var(--s5)">${ICON.back} חזרה</button>
      <div class="cols" style="grid-template-columns:1fr 380px">
        <section class="stack" style="gap: var(--s5)">
          <div class="card stack" style="gap: var(--s4);padding: var(--s6)">
            <div class="stack" style="gap:6px">
              <h1 style="margin:0;font:600 var(--fs-hero)/1.2 var(--disp)">${esc(s.name)}</h1>
              <span class="label">${esc(s.city || '')}${s.verified ? ' · ספק מאומת' : ''} · דירוג <span class="mono">${s.rating}</span> (${s.reviews_count})</span>
            </div>
            ${s.about ? `<p style="margin:0;font:400 var(--fs-body)/1.6 var(--sans)">${esc(s.about)}</p>` : ''}
            <div class="stack" style="gap:0;border-top:1px solid var(--line)">
              ${row('מספק', s.supplies)}
              ${row('כתובת', s.address)}
              ${row('שעות', s.hours)}
              ${st.positions ? posRow('מק״טים', `<span><span class="mono">${st.positions}</span>${
                st.in_stock < st.offers ? ` · <span class="mono">${st.in_stock}</span> במלאי` : ''}</span>`) : ''}
            </div>
          </div>

          <div class="stack" style="gap:4px">
            <span style="font:600 var(--fs-lead) var(--disp)">מה שהוא מוכר</span>
            <span class="label">אותם כרטיסים, עם המחיר שהוא נקב · במלאי קודם</span>
          </div>
          ${supCatBar(st)}
          ${S.supLoading ? '<div class="spin"></div>' : S.supParts.length
            ? `<div class="card" style="overflow:hidden"><table>
                 <thead><tr><th style="width:34%">החלק</th><th>מק״ט</th><th>מצב</th><th>מלאי</th><th>מחיר</th></tr></thead>
                 <tbody>${S.supParts.map(supPartRow).join('')}</tbody></table></div>
               ${moreBtn(S.supParts.length, S.supTotal, 'more-sup', 'עוד פריטים')}`
            : `<div class="empty"><span style="font:600 var(--fs-lead) var(--disp);color:var(--ink)">${
                 S.supCat === 'all' ? 'אין פריטים כרגע' : 'אין פריטים במערכת הזאת'}</span>
                 <span>${S.supCat === 'all' ? 'הספק עדיין לא פרסם מלאי' : 'בחרו מערכת אחרת או "הכל"'}</span></div>`}
        </section>

        <aside class="stack" style="gap: var(--s4);position:sticky;top:calc(var(--head) + var(--s6))">
          <div class="card pad stack" style="gap: var(--s4)">
            <div class="row" style="justify-content:space-between"><span class="label">טלפון</span><span class="mono" style="font-size:var(--fs-sub)">${esc(s.phone)}</span></div>
            <a class="btn wide" href="tel:${esc(s.phone)}" style="text-align:center;text-decoration:none">התקשרות</a>
            ${wa ? `<a class="btn line wide" href="https://wa.me/${esc(wa)}" target="_blank" rel="noopener">וואטסאפ</a>` : ''}
          </div>
        </aside>
      </div>
    </div>`;
}

/* המדף של הספק לפי מערכות. הקונה חושב במערכות — בלמים, מתלים,
   חשמל — ו"מה עוד יש לו" בלי חלוקה זה גלילה, לא תשובה. הספירה על כל
   לשונית מגיעה מהשרת, ולכן אין כאן מסנן שמוביל למסך ריק. */
function supCatBar(st) {
  const cats = (st && st.categories) || [];
  if (cats.length < 2) return '';
  const chip = (id, label, n) => `<button class="chip" data-act="sup-cat" data-cat="${esc(id)}"
    aria-pressed="${S.supCat === id}">${esc(label)}${n ? ` · <span class="mono">${n}</span>` : ''}</button>`;
  return `<div class="chips">
    ${chip('all', 'הכל', st.offers)}
    ${cats.map((c) => chip(c.id, catLabel(c.id), c.n)).join('')}
  </div>`;
}

/* פריט במדף של הספק. המק״ט המוצג הוא זה שבקטלוג ולא זה שהמוכר
   הקליד — ממנו משווים מחירים, ואליו מוביל המסך הבא. */
function supPartRow(p) {
  const num = (p.catalog && p.catalog.number) || p.part_no;
  return `<tr data-act="open-offer" data-id="${p.id}" data-from="seller" style="cursor:pointer">
    <td><span style="font-weight:500">${esc(p.name)}</span>
        <span class="label" style="display:block">${esc(catLabel(p.category))}</span></td>
    <td><span class="mono" style="font-size:var(--fs-label)">${esc(num)}</span></td>
    <td>${kindTag(p.kind)}${p.kind === 'used' && p.condition_pct ? ` <span class="label">מצב <span class="mono">${p.condition_pct}%</span></span>` : ''}</td>
    <td class="label">${p.stock === 'in' && p.qty > 0 ? `${p.qty} במלאי` : 'אזל'}</td>
    <td><span class="price">${shekel(p.price)}</span></td>
  </tr>`;
}

/* מה שהספק מספר על עצמו. זה אינו טופס הגדרות אלא חלון הראווה של
   העסק: בדיוק המילים האלה מופיעות בעמוד הספק ולצד כל הצעה שלו,
   ולכן יש כאן קישור לראות את התוצאה בעיניים של הקונה.

   השדות מחולקים לשתיים — איך פונים אליכם, ומה הקונה קורא. שמונה
   שדות זהים ברצף הם רשימה שצריך לפענח; שתי קבוצות עם כותרת נקראות
   בהצצה. */
function sellerProfileCard() {
  const me = S.me || {};
  const f = (name, label, value, hint) =>
    `<div class="field"><span>${esc(label)}</span><input name="${name}" value="${esc(value || '')}" placeholder="${esc(hint || '')}"></div>`;
  const group = (title, sub, body) => `
    <div class="stack" style="gap: var(--s3)">
      <div class="stack" style="gap:2px">
        <span style="font:500 var(--fs-body) var(--sans)">${esc(title)}</span>
        <span class="label">${esc(sub)}</span>
      </div>
      ${body}
    </div>`;

  return `
    <form class="card pad stack" style="gap: var(--s5);margin-bottom: var(--s6)" data-act="save-profile">
      <div class="row between" style="align-items:baseline">
        <span style="font:600 var(--fs-lead) var(--disp)">העסק שלי</span>
        ${me.id ? `<button type="button" class="link" data-act="open-sup" data-id="${me.id}">איך זה נראה לקונה</button>` : ''}
      </div>

      ${group('איך פונים אליכם', 'מופיע בכל הצעה שלכם ובעמוד הספק', `
        <div class="row" style="gap: var(--s4);flex-wrap:wrap">
          <div style="flex:2;min-width:220px">${f('name', 'שם העסק', me.name)}</div>
          <div style="flex:1;min-width:140px">${f('city', 'עיר', me.city)}</div>
          <div style="flex:1;min-width:150px">${f('phone', 'טלפון', me.phone)}</div>
          <div style="flex:1;min-width:150px">${f('whatsapp', 'וואטסאפ', me.whatsapp, '9725…')}</div>
        </div>
        <div class="row" style="gap: var(--s4);flex-wrap:wrap">
          <div style="flex:1;min-width:220px">${f('address', 'כתובת', me.address, 'רחוב, מספר, אזור')}</div>
          <div style="flex:1;min-width:220px">${f('hours', 'שעות פעילות', me.hours, 'א׳—ה׳ 08:00—17:00')}</div>
        </div>`)}

      ${group('מה הקונה קורא עליכם', 'זה מה שמבדיל אתכם מספק אחר באותו מק״ט', `
        ${f('supplies', 'מה אנחנו מספקים', me.supplies, 'מותגים, מערכות, סוגי רכב')}
        <div class="field"><span>על העסק</span>
          <textarea name="about" rows="3" placeholder="מי אתם, כמה שנים, איך אתם עובדים">${esc(me.about || '')}</textarea>
        </div>`)}

      <div class="row" style="justify-content:flex-start"><button class="btn" type="submit">שמירה</button></div>
    </form>`;
}

function signInWall(text) {
  return `<div class="wrap"><div class="empty">
    <span style="font:600 var(--fs-lead) var(--disp);color:var(--ink)">${esc(text)}</span>
    <button class="btn" data-act="auth">כניסה או הרשמה</button>
  </div></div>`;
}

const VIEWS = { catalog: viewCatalog, position: viewPosition, part: viewPart, seller: viewSeller, chats: viewChats, cabinet: viewCabinet };

/* ---------------------------- שכבות ---------------------------- */

/* שאלה שדורשת תשובה, בתוך האפליקציה ולא confirm() של הדפדפן */
function askBox() {
  const a = S.ask;
  if (!a) return '';
  return `
    <div class="scrim open" data-act="ask-no" style="z-index:60;display:flex;align-items:center;justify-content:center">
      <div class="card stack" data-stop style="gap: var(--s4);padding: var(--s6);max-width:380px;width:100%;box-shadow:0 18px 44px rgba(22,20,15,.26)">
        <div class="stack" style="gap:4px">
          <span style="font:600 var(--fs-lead) var(--disp)">${esc(a.title)}</span>
          ${a.text ? `<span class="label">${esc(a.text)}</span>` : ''}
        </div>
        <div class="row" style="gap: var(--s3);justify-content:flex-end">
          <button class="btn line" data-act="ask-no">ביטול</button>
          <button class="btn" data-act="ask-yes">${esc(a.ok)}</button>
        </div>
      </div>
    </div>`;
}

function ask(title, text, ok, run) { S.ask = { title, text, ok, run }; render(); }

/* הוספת מק״ט מתוך שדה בטופס, במקום prompt של הדפדפן. כפילות נבלעת
   בשקט — אותו מספר פעמיים אינו טעות שצריך להתלונן עליה. */
function addNumber(field, input) {
  syncDraft();
  const el = document.querySelector(`input[name="${input}"]`);
  const raw = el ? el.value.trim() : '';
  if (!raw) { if (el) el.focus(); return; }
  const list = S.draft[field] || (S.draft[field] = []);
  const key = (v) => String(v).toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!list.some((n) => key(n) === key(raw))) list.push(raw);
  if (el) el.value = '';
  render();
  const again = document.querySelector(`input[name="${input}"]`);
  if (again) again.focus();
}

function partForm() {
  const d = S.draft || {};
  const dep = deptOf(d.category) || S.depts[0] || { id: '', categories: [] };
  const vKind = d.vehicle_kind || '';
  const vMakes = (S.vehicles.find((v) => v.id === vKind) || {}).makes || [];
  const vCustom = Boolean(d.vehicle_make) && !vMakes.includes(d.vehicle_make);
  const needsOem = (d.kind || 'copy') !== 'orig';
  const oems = d.oems || [];
  const nums = d.nums || [];

  const chipRow = (list, act) => list.map((n, i) => `<span class="num ${act === 'rm-oem' ? 'oem' : ''}" style="display:inline-flex;align-items:center;gap:6px;padding:5px 10px;font-size:var(--fs-label)">${esc(n)}<button data-act="${act}" data-i="${i}" aria-label="הסר">${ICON.close}</button></span>`).join('');

  return `
    <div class="scrim" data-act="close-modal">
      <div class="modal" data-stop>
        <div class="top">
          <span style="font:600 var(--fs-lead) var(--disp)">${d.id ? 'עריכת פוזיציה' : 'פוזיציה חדשה'}</span>
          <button class="iconbtn" data-act="close-modal">${ICON.close}</button>
        </div>
        <form class="stack" data-act="save-part" style="gap: var(--s5);padding: var(--s6)">

          <div class="row" style="gap: var(--s5);align-items:flex-start">
            <label style="width:132px;height:132px;flex:none;border-radius:14px;border:1px ${d.image_url ? 'solid var(--line)' : 'dashed var(--hair)'};
                          background:var(--card) ${d.image_url ? `url('${esc(d.image_url)}') center/contain no-repeat` : ''};
                          display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:var(--muted);cursor:pointer;position:relative">
              <input type="file" accept="image/*" data-act="pick-photo" hidden>
              ${d.image_url ? `<button type="button" class="iconbtn" data-act="drop-photo" style="position:absolute;top:-10px;inset-inline-start:-10px;width:26px;height:26px;background:var(--ink);color:#fff;border-radius:999px">${ICON.close}</button>`
                : `${ICON.cam}<span style="font-size:var(--fs-label)">הוסף תמונה</span>`}
            </label>
            <div class="stack" style="flex:1;gap: var(--s4)">
              <div class="field"><span>שם החלק</span>
                <input name="name" required value="${esc(d.name || '')}" placeholder="רפידות בלימה קדמיות"></div>
              <label class="row" style="gap:8px;font:400 var(--fs-label) var(--sans);color:var(--muted)">
                <input type="checkbox" name="cutout" ${S.cutout ? 'checked' : ''} data-act="toggle-cutout" style="width:17px;height:17px;accent-color:var(--ink)">
                הסרת רקע אוטומטית מהתמונה
              </label>
              <div class="field"><span>מספר מק״ט ראשי · חובה</span>
                <input class="mono" name="part_no" required value="${esc(d.part_no || '')}" placeholder="04465-02220"></div>
            </div>
          </div>

          <div class="row" style="gap: var(--s4)">
            <div class="field" style="flex:1"><span>מחלקה</span>
              <select name="department">
                ${S.depts.map((x) => `<option value="${esc(x.id)}" ${dep.id === x.id ? 'selected' : ''}>${esc(x.label)}</option>`).join('')}
              </select></div>
            <div class="field" style="flex:1"><span>קטגוריה</span>
              <select name="category">
                ${dep.categories.map((c) => `<option value="${esc(c.id)}" ${d.category === c.id ? 'selected' : ''}>${esc(c.label)}</option>`).join('')}
              </select></div>
            <div class="field" style="flex:1"><span>מצב</span>
              <div class="chips">
                ${Object.entries(KIND_LABEL).map(([k, t]) => `<button type="button" class="chip" data-act="set-kind" data-kind="${k}" aria-pressed="${(d.kind || 'copy') === k}">${t}</button>`).join('')}
              </div></div>
          </div>

          ${needsOem ? `<div class="field">
            <span>מק״ט מקורי · את איזה חלק זה מחליף</span>
            <div class="chips">${chipRow(oems, 'rm-oem')}</div>
            <div class="row" style="gap: var(--s3)">
              <input class="mono" name="oem_new" autocomplete="off" style="flex:1"
                     placeholder="${oems.length ? 'עוד מק״ט מקורי' : 'מק״ט של יצרן הרכב'}">
              <button type="button" class="btn ghost" data-act="add-oem">הוספה</button>
            </div>
            <span class="label" style="font-size:var(--fs-micro)">${oems.length ? 'הקונים מחפשים לפי המספר הזה' : 'בלי המספר המקורי קשה למצוא את החלק'}</span>
          </div>` : ''}

          <div class="field">
            <span>מק״טים מתחלפים · יופיעו בחיפוש</span>
            <div class="chips">${chipRow(nums, 'rm-num')}</div>
            <div class="row" style="gap: var(--s3)">
              <input class="mono" name="num_new" autocomplete="off" style="flex:1" placeholder="מק״ט נוסף של אותו חלק">
              <button type="button" class="btn ghost" data-act="add-num">הוספה</button>
            </div>
          </div>

          <div class="row" style="gap: var(--s4)">
            <div class="field" style="flex:1"><span>סוג רכב</span>
              <select name="vehicle_kind">
                <option value="">ללא התאמה</option>
                ${S.vehicles.map((v) => `<option value="${esc(v.id)}" ${vKind === v.id ? 'selected' : ''}>${esc(v.label)}</option>`).join('')}
              </select></div>
            <div class="field" style="flex:1"><span>יצרן</span>
              <select name="vehicle_make" ${vMakes.length ? '' : 'disabled'}>
                <option value="">כל היצרנים</option>
                ${vMakes.map((m) => `<option value="${esc(m)}" ${d.vehicle_make === m ? 'selected' : ''}>${esc(m)}</option>`).join('')}
                <option value="other" ${vCustom ? 'selected' : ''}>אחר…</option>
              </select></div>
            <div class="field" style="flex:1"><span>דגם</span>
              <input class="mono" name="vehicle_model" list="formModels" value="${esc(d.vehicle_model || '')}" placeholder="COROLLA E210" autocomplete="off">
              <datalist id="formModels"></datalist></div>
          </div>
          <input name="vehicle_make_other" value="${esc(vCustom ? d.vehicle_make : '')}" placeholder="שם היצרן" ${vCustom ? '' : 'hidden'}
                 style="background:var(--card);border:1px solid var(--line);border-radius:10px;padding:9px 12px;outline:none">

          <div class="row" style="gap: var(--s4)">
            <div class="field" style="flex:2"><span>יצרן החלק</span><input class="mono" name="maker" value="${esc(d.maker || '')}" placeholder="ADVICS"></div>
            <div class="field" style="flex:1"><span>משנת</span><input class="mono" name="year_from" type="number" min="1950" max="2100" value="${esc(d.year_from ?? '')}" placeholder="2016"></div>
            <div class="field" style="flex:1"><span>עד שנת</span><input class="mono" name="year_to" type="number" min="1950" max="2100" value="${esc(d.year_to ?? '')}" placeholder="2023"></div>
          </div>

          <div class="row" style="gap: var(--s4)">
            <div class="field" style="flex:1"><span>מחיר ₪</span><input class="mono" name="price" type="number" min="0" required value="${esc(d.price ?? '')}" placeholder="210"></div>
            <div class="field" style="flex:1"><span>כמות במלאי</span><input class="mono" name="qty" type="number" min="0" required value="${esc(d.qty ?? 0)}" placeholder="6"></div>
          </div>

          <div class="row" style="gap: var(--s3);justify-content:flex-end">
            <button type="button" class="btn ghost" data-act="close-modal">ביטול</button>
            <button class="btn" type="submit">${d.id ? 'שמירת שינויים' : 'פרסום פוזיציה'}</button>
          </div>
        </form>
      </div>
    </div>`;
}

function authModal() {
  const seller = S.auth.tab === 'seller';
  const reg = S.auth.mode === 'register';
  return `
    <div class="scrim" data-act="close-modal">
      <div class="modal" data-stop style="width:min(440px,100%)">
        <div class="top">
          <span style="font:600 var(--fs-lead) var(--disp)">${reg ? 'הרשמה' : 'כניסה'}</span>
          <button class="iconbtn" data-act="close-modal">${ICON.close}</button>
        </div>
        <form class="stack" data-act="auth-submit" style="gap: var(--s4);padding: var(--s6)">
          <div class="chips" style="gap:6px">
            <button type="button" class="chip" data-act="auth-tab" data-tab="buyer" aria-pressed="${!seller}" style="flex:1;justify-content:center">קונה</button>
            <button type="button" class="chip" data-act="auth-tab" data-tab="seller" aria-pressed="${seller}" style="flex:1;justify-content:center">מוכר</button>
          </div>
          ${reg ? `<div class="field"><span>${seller ? 'שם העסק' : 'שם'}</span><input name="name" required></div>` : ''}
          ${reg && seller ? `<div class="row" style="gap: var(--s3)">
            <div class="field" style="flex:1"><span>עיר</span><input name="city" required></div>
            <div class="field" style="flex:1"><span>טלפון</span><input class="mono" name="phone" required></div>
          </div>` : ''}
          <div class="field"><span>אימייל</span><input class="mono" name="email" type="email" required></div>
          <div class="field"><span>סיסמה</span><input name="password" type="password" required minlength="6"></div>
          <button class="btn wide" type="submit">${reg ? 'יצירת חשבון' : 'כניסה'}</button>
          <button type="button" class="link" data-act="auth-mode" style="align-self:center">
            ${reg ? 'כבר יש חשבון? כניסה' : 'אין חשבון? הרשמה'}
          </button>
        </form>
      </div>
    </div>`;
}

/* ---------------------------- ציור ---------------------------- */
function renderNav() {
  const tabs = [['catalog', 'קטלוג'], ['chats', 'הודעות']];
  if (isSeller()) tabs.push(['cabinet', 'המלאי שלי']);
  // עמוד הספק שייך ללשונית שממנה נכנסו אליו — מהקבינט הוא הקבינט
  const cur = ['part', 'position'].includes(S.screen) ? 'catalog'
    : S.screen === 'seller' ? (S.supBack === 'cabinet' ? 'cabinet' : 'catalog')
    : S.screen;
  $('#nav').innerHTML = tabs.map(([k, t]) =>
    `<button data-act="tab" data-tab="${k}" aria-current="${cur === k ? 'page' : 'false'}">${t}</button>`).join('');

  $('#acct').innerHTML = authed()
    ? `<button class="iconbtn" data-act="tab" data-tab="chats" title="הודעות">${ICON.chat}</button>
       <button class="btn ghost" data-act="logout" style="padding:8px 14px">${esc((S.me && S.me.name) || 'יציאה')}</button>`
    : `<button class="btn" data-act="auth" style="padding:9px 16px">כניסה</button>`;
}

function render() {
  renderNav();
  const view = VIEWS[S.screen] || viewCatalog;
  $('#view').innerHTML = view();
  $('#layer').innerHTML = (S.draft ? partForm() : (S.auth.open ? authModal() : '')) + askBox();
  const box = $('#msgs');
  if (box) box.scrollTop = box.scrollHeight;
}

/* --------------------------- תמונות --------------------------- */
const CUT_TOLERANCE = 46;
function cutoutBackground(canvas) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const { width: w, height: h } = canvas;
  const img = ctx.getImageData(0, 0, w, h);
  const px = img.data;
  const edge = [];
  for (let x = 0; x < w; x += 2) edge.push(x * 4, (x + (h - 1) * w) * 4);
  for (let y = 0; y < h; y += 2) edge.push((y * w) * 4, (w - 1 + y * w) * 4);
  const mid = (ch) => {
    const vals = edge.map((i) => px[i + ch]).sort((a, b) => a - b);
    return vals[Math.floor(vals.length / 2)];
  };
  const bg = [mid(0), mid(1), mid(2)];
  const near = (i, tol) => Math.abs(px[i] - bg[0]) + Math.abs(px[i + 1] - bg[1]) + Math.abs(px[i + 2] - bg[2]) < tol;

  const seen = new Uint8Array(w * h);
  const queue = [];
  for (let x = 0; x < w; x++) queue.push(x, x + (h - 1) * w);
  for (let y = 0; y < h; y++) queue.push(y * w, w - 1 + y * w);
  while (queue.length) {
    const p = queue.pop();
    if (seen[p]) continue;
    seen[p] = 1;
    const i = p * 4;
    if (!near(i, CUT_TOLERANCE * 3)) continue;
    px[i + 3] = 0;
    const x = p % w, y = (p / w) | 0;
    if (x > 0) queue.push(p - 1);
    if (x < w - 1) queue.push(p + 1);
    if (y > 0) queue.push(p - w);
    if (y < h - 1) queue.push(p + w);
  }
  const out = new Uint8ClampedArray(px);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const p = x + y * w, i = p * 4;
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

async function processPhoto(file, cutout) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 800 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  if (cutout) cutoutBackground(canvas);
  const webp = canvas.toDataURL('image/webp', 0.86);
  return webp.startsWith('data:image/webp') ? webp : canvas.toDataURL('image/png');
}

/* ---------------------- טופס: שמירת מצב ביניים ---------------------- */
function syncDraft() {
  const form = $('form[data-act="save-part"]');
  if (!form || !S.draft) return;
  const fd = new FormData(form);
  const t = (k) => (fd.get(k) || '').toString();
  const d = S.draft;
  d.name = t('name'); d.part_no = t('part_no'); d.maker = t('maker');
  d.category = t('category') || d.category;
  const makeSel = t('vehicle_make');
  d.vehicle_kind = t('vehicle_kind');
  d.vehicle_make = makeSel === 'other' ? t('vehicle_make_other') : makeSel;
  d.vehicle_model = t('vehicle_model');
  d.year_from = t('year_from') === '' ? null : Number(t('year_from'));
  d.year_to = t('year_to') === '' ? null : Number(t('year_to'));
  d.price = t('price') === '' ? null : Number(t('price'));
  d.qty = t('qty') === '' ? 0 : Number(t('qty'));
}

/* ---------------------------- אירועים ---------------------------- */
document.addEventListener('click', async (ev) => {
  const el = ev.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act;
  if (el.tagName === 'FORM' || (el.tagName === 'A' && el.href)) return;

  // ניווט
  if (act === 'home') { resetFilters(); go('catalog'); loadCatalog(); return; }
  if (act === 'tab') {
    const tab = el.dataset.tab;
    go(tab);
    if (tab === 'catalog') loadCatalog();
    if (tab === 'chats') loadChats();
    if (tab === 'cabinet') loadCabinet();
    return;
  }
  // "חזרה" מכרטיס מוכר מחזיר לפוזיציה שממנה נכנסו, לא לקטלוג
  if (act === 'back') {
    if (S.screen === 'part') { go(S.partBack || 'catalog'); return; }
    if (S.screen === 'seller') { go(S.supBack || 'catalog'); return; }
    go('catalog'); return;
  }
  if (act === 'open-offer') { openPart(Number(el.dataset.id), el.dataset.from || 'position'); return; }
  if (act === 'open-sup') {
    const supId = Number(el.dataset.id);
    if (!supId) return;
    // הגענו להצעה מעמוד הספק ולוחצים על שורת הספק שבתוכה — זו חזרה,
    // לא כניסה חדשה. אחרת נוצרת לולאה בין ההצעה לספק בלי מוצא
    if (S.screen === 'part' && S.partBack === 'seller' && S.sup && S.sup.id === supId) {
      go('seller'); return;
    }
    loadSeller(supId, S.screen === 'seller' ? S.supBack : S.screen);
    return;
  }
  if (act === 'open-pos') { loadPosition(Number(el.dataset.id)); return; }
  if (act === 'more-browse') { loadMoreBrowse(); return; }
  if (act === 'more-offers') { loadMoreOffers(); return; }
  if (act === 'more-sup') { loadMoreSup(); return; }
  if (act === 'sup-cat') { loadSupCat(el.dataset.cat); return; }
  if (act === 'compat-note') { S.compatNote = !S.compatNote; render(); return; }

  // מסננים
  if (act === 'dept') {
    const next = el.dataset.dept;
    S.dept = S.dept === next ? 'all' : next;
    S.category = 'all';
    go('catalog'); loadCatalog(); return;
  }
  if (act === 'cat') {
    const next = el.dataset.cat;
    S.category = next === 'all' || S.category === next ? 'all' : next;
    loadCatalog(); return;
  }
  if (act === 'kind') {
    const next = el.dataset.kind;
    S.kind = next === 'all' || S.kind === next ? 'all' : next;
    loadCatalog(); return;
  }
  if (act === 'clear') { resetFilters(); loadCatalog(); return; }
  if (act === 'drop') {
    const key = el.dataset.key;
    if (key === 'q') { S.q = ''; const b = $('#q'); if (b) b.value = ''; }
    if (key === 'dept') { S.dept = 'all'; S.category = 'all'; }
    if (key === 'cat') S.category = 'all';
    if (key === 'vkind') { S.vkind = 'all'; S.vmake = 'all'; S.vmodel = ''; S.models = []; }
    if (key === 'vmake') { S.vmake = 'all'; S.vmodel = ''; S.models = []; }
    if (key === 'vmodel') S.vmodel = '';
    if (key === 'vyear') S.vyear = '';
    if (key === 'kind') S.kind = 'all';
    loadCatalog(); return;
  }

  // שיחות
  if (act === 'open-conv') { openConv(Number(el.dataset.id)); return; }
  if (act === 'ask') {
    if (!authed()) { S.auth = { open: true, tab: 'buyer', mode: 'login' }; render(); return; }
    try {
      const { conversation } = await api('/conversations', {
        method: 'POST',
        body: { seller_id: Number(el.dataset.seller), part_id: Number(el.dataset.id) },
      });
      await loadChats();
      go('chats');
      openConv(conversation.id);
    } catch (e) { toast(e.message, true); }
    return;
  }

  // קבינט
  if (act === 'new-part') {
    S.draft = { kind: 'copy', category: 'brakes', qty: 0, nums: [], oems: [] };
    render(); return;
  }
  if (act === 'edit-part') {
    const p = S.stock.find((x) => x.id === Number(el.dataset.id));
    if (!p) return;
    const all = p.interchange_numbers || [];
    S.draft = {
      ...p,
      nums: all.filter((n) => !n.is_oem).map((n) => n.number),
      oems: all.filter((n) => n.is_oem).map((n) => n.number),
    };
    render();
    fillFormModels(p.vehicle_kind, p.vehicle_make);
    return;
  }
  if (act === 'del-part') {
    const id = el.dataset.id;
    const part = S.stock.find((x) => String(x.id) === String(id));
    ask('למחוק את הפוזיציה?', part ? `${part.name} · ${part.part_no}` : '', 'מחיקה', async () => {
      try { await api(`/sellers/me/parts/${id}`, { method: 'DELETE' }); toast('נמחק'); loadCabinet(); }
      catch (e) { toast(e.message, true); }
    });
    return;
  }
  if (act === 'order-form') { S.orderOpen = !S.orderOpen; render(); return; }
  if (act === 'answer') {
    try {
      await api(`/conversations/${S.conv.id}/order-requests/${el.dataset.id}`, { method: 'PATCH', body: { status: el.dataset.status } });
      openConv(S.conv.id);
      loadCabinet();
    } catch (e) { toast(e.message, true); }
    return;
  }
  if (act === 'ask-no') { S.ask = null; render(); return; }
  if (act === 'ask-yes') {
    const run = S.ask && S.ask.run;
    S.ask = null; render();
    if (run) await run();
    return;
  }
  if (act === 'set-kind') { syncDraft(); S.draft.kind = el.dataset.kind; render(); return; }
  if (act === 'add-num') { addNumber('nums', 'num_new'); return; }
  if (act === 'rm-num') { syncDraft(); S.draft.nums.splice(Number(el.dataset.i), 1); render(); return; }
  if (act === 'add-oem') { addNumber('oems', 'oem_new'); return; }
  if (act === 'rm-oem') { syncDraft(); S.draft.oems.splice(Number(el.dataset.i), 1); render(); return; }
  if (act === 'drop-photo') { ev.preventDefault(); syncDraft(); S.draft.image_url = null; render(); return; }

  // חשבון ושכבות
  if (act === 'auth') { S.auth = { open: true, tab: 'buyer', mode: 'login' }; render(); return; }
  if (act === 'auth-tab') { S.auth.tab = el.dataset.tab; render(); return; }
  if (act === 'auth-mode') { S.auth.mode = S.auth.mode === 'register' ? 'login' : 'register'; render(); return; }
  if (act === 'logout') { clearAuth(); toast('התנתקת'); go('catalog'); loadCatalog(); return; }
  if (act === 'close-modal') {
    if (el.classList.contains('scrim') && ev.target.closest('[data-stop]')) return;
    S.draft = null; S.auth.open = false; render(); return;
  }
});

document.addEventListener('change', async (ev) => {
  const el = ev.target;
  if (!el.matches) return;

  // מסנני הרצועה
  if (el.matches('select[data-act="vkind"]')) {
    S.vkind = el.value; S.vmake = 'all'; S.vmodel = ''; S.models = [];
    loadCatalog(); return;
  }
  if (el.matches('select[data-act="vmake"]')) {
    S.vmake = el.value; S.vmodel = '';
    await loadModels();
    loadCatalog(); return;
  }
  if (el.matches('select[data-act="vyear"]')) { S.vyear = el.value; loadCatalog(); return; }

  // טופס הפוזיציה
  if (el.matches('select[name="department"]')) {
    const dep = S.depts.find((d) => d.id === el.value);
    const cat = el.closest('form').querySelector('select[name="category"]');
    if (dep && cat) cat.innerHTML = dep.categories.map((c) => `<option value="${esc(c.id)}">${esc(c.label)}</option>`).join('');
    return;
  }
  if (el.matches('select[name="vehicle_kind"]')) {
    const form = el.closest('form');
    const make = form.querySelector('select[name="vehicle_make"]');
    const chosen = S.vehicles.find((v) => v.id === el.value);
    make.innerHTML = `<option value="">כל היצרנים</option>`
      + (chosen ? chosen.makes.map((m) => `<option value="${esc(m)}">${esc(m)}</option>`).join('') : '')
      + `<option value="other">אחר…</option>`;
    make.disabled = !chosen;
    const custom = form.querySelector('input[name="vehicle_make_other"]');
    if (custom) { custom.hidden = true; custom.value = ''; }
    const list = $('#formModels'); if (list) list.innerHTML = '';
    return;
  }
  if (el.matches('select[name="vehicle_make"]')) {
    const form = el.closest('form');
    const custom = form.querySelector('input[name="vehicle_make_other"]');
    if (custom) {
      custom.hidden = el.value !== 'other';
      if (!custom.hidden) custom.focus(); else custom.value = '';
    }
    const kindSel = form.querySelector('select[name="vehicle_kind"]');
    fillFormModels(kindSel ? kindSel.value : '', el.value);
    return;
  }
  if (el.matches('input[data-act="toggle-cutout"]')) { S.cutout = el.checked; return; }
  if (el.matches('input[data-act="pick-photo"]')) {
    const file = el.files && el.files[0];
    if (!file || !S.draft) return;
    syncDraft();
    toast('מעבד תמונה…');
    try { S.draft.image_url = await processPhoto(file, S.cutout); render(); }
    catch (e) { toast('לא הצלחתי לקרוא את התמונה', true); }
  }
});

async function fillFormModels(kind, make) {
  const list = $('#formModels');
  if (!list || !make || make === 'other') return;
  try {
    const p = new URLSearchParams({ make });
    if (kind) p.set('kind', kind);
    const { models } = await api(`/vehicles/models?${p}`);
    list.innerHTML = models.map((m) => `<option value="${esc(m)}"></option>`).join('');
  } catch (e) { /* הצעות בלבד */ }
}

// דגם בסינון — טקסט חופשי, ולכן מחכים לרגע שקט לפני שמחפשים
let modelTimer = null;
document.addEventListener('input', (ev) => {
  if (!ev.target.matches || !ev.target.matches('input[data-act="vmodel"]')) return;
  S.vmodel = ev.target.value;
  clearTimeout(modelTimer);
  modelTimer = setTimeout(loadCatalog, 320);
});

document.addEventListener('submit', async (ev) => {
  const form = ev.target.closest('[data-act]');
  if (!form) return;
  ev.preventDefault();
  const act = form.dataset.act;
  const fd = new FormData(form);

  if (act === 'search') {
    S.q = (fd.get('q') || '').toString().trim();
    go('catalog'); loadCatalog(); return;
  }

  if (act === 'save-profile') {
    const body = {};
    for (const k of ['name', 'city', 'phone', 'whatsapp', 'address', 'hours', 'supplies', 'about']) {
      body[k] = (fd.get(k) || '').toString().trim();
    }
    try {
      const { seller } = await api('/sellers/me/profile', { method: 'PATCH', body });
      S.me = seller; toast('נשמר'); render();
    } catch (e) { toast(e.message, true); }
    return;
  }

  if (act === 'order-submit') {
    const n = Number((fd.get('qty') || '').toString());
    if (!Number.isInteger(n) || n < 1) { toast('כמות חייבת להיות מספר שלם חיובי', true); return; }
    const vehicle = (fd.get('vehicle') || '').toString().trim() || null;
    try {
      await api(`/conversations/${S.conv.id}/order-request`, { method: 'POST', body: { qty: n, vehicle } });
      openConv(S.conv.id);
    } catch (e) { toast(e.message, true); }
    return;
  }

  if (act === 'send') {
    const body = (fd.get('body') || '').toString().trim();
    if (!body || !S.conv) return;
    form.reset();
    try { await api(`/conversations/${S.conv.id}/messages`, { method: 'POST', body: { body } }); openConv(S.conv.id); }
    catch (e) { toast(e.message, true); }
    return;
  }

  if (act === 'save-part') {
    const d = S.draft || {};
    const t = (k) => (fd.get(k) || '').toString().trim();
    const num = (k) => (t(k) === '' ? null : Number(t(k)));
    const makeSel = (fd.get('vehicle_make') || '').toString();
    const makeCustom = makeSel === 'other';
    const vehicleKind = (fd.get('vehicle_kind') || '').toString() || null;
    const vehicleMake = (makeCustom ? t('vehicle_make_other') : makeSel) || null;
    const model = t('vehicle_model') || null;
    const from = num('year_from');
    const to = num('year_to');
    const years = from && to ? `${from}—${to}` : (from ? `${from}+` : (to ? `עד ${to}` : ''));
    const head = [vehicleMake, model].filter(Boolean).join(' ');

    const payload = {
      name: t('name'),
      part_no: t('part_no'),
      category: fd.get('category'),
      maker: t('maker') || null,
      kind: d.kind || 'copy',
      price: Number(fd.get('price')),
      qty: Number(fd.get('qty')),
      image_url: d.image_url || null,
      vehicle_kind: vehicleKind,
      vehicle_make: vehicleKind ? vehicleMake : null,
      vehicle_make_custom: makeCustom,
      vehicle_model: model,
      year_from: from,
      year_to: to,
      fits: head ? (years ? `${head} · ${years}` : head) : (years || d.fits || null),
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
      loadCabinet();
    } catch (e) { toast(e.message, true); }
    return;
  }

  if (act === 'auth-submit') {
    const seller = S.auth.tab === 'seller';
    const reg = S.auth.mode === 'register';
    const body = {
      email: (fd.get('email') || '').toString().trim(),
      password: (fd.get('password') || '').toString(),
    };
    if (reg) body.name = (fd.get('name') || '').toString().trim();
    if (reg && seller) {
      body.city = (fd.get('city') || '').toString().trim();
      body.phone = (fd.get('phone') || '').toString().trim();
    }
    const path = seller ? (reg ? '/sellers/register' : '/sellers/login') : (reg ? '/auth/register' : '/auth/login');
    try {
      const data = await api(path, { method: 'POST', body });
      setAuth(data.token, seller ? 'seller' : 'buyer');
      S.me = seller ? data.seller : data.user;
      S.auth.open = false;
      toast(`שלום, ${S.me.name}`);
      if (seller) { go('cabinet'); loadCabinet(); } else { go('catalog'); loadCatalog(); }
    } catch (e) { toast(e.message, true); }
  }
});

// "/" מציב את הסמן בחיפוש, Esc סוגר שכבה
document.addEventListener('keydown', (ev) => {
  // Enter בשדה מק״ט מוסיף מספר ואינו שולח את הטופס
  if (ev.key === 'Enter' && ev.target.matches && ev.target.matches('input[name="num_new"], input[name="oem_new"]')) {
    ev.preventDefault();
    addNumber(ev.target.name === 'oem_new' ? 'oems' : 'nums', ev.target.name);
    return;
  }
  if (ev.key === '/' && !/input|select|textarea/i.test(document.activeElement.tagName)) {
    ev.preventDefault();
    $('#q').focus();
  }
  if (ev.key === 'Escape' && S.ask) { S.ask = null; render(); return; }
  if (ev.key === 'Escape' && (S.draft || S.auth.open)) { S.draft = null; S.auth.open = false; render(); }
});

/* ---------------------------- אתחול ---------------------------- */
// מסך הפתיחה יורד רק אחרי שהנתונים כאן, ולא לפני שהסצנה סיימה לרוץ:
// שרת שנרדם הופך את ההמתנה לטעינה שרואים, לא למסך ריק
function hideSplash() {
  const el = document.getElementById('splash');
  if (!el) return;
  el.classList.add('gone');
  setTimeout(() => el.remove(), 600);
}

(async function boot() {
  const scene = new Promise((done) => setTimeout(done, 2700));
  const [cats, veh] = await Promise.allSettled([api('/categories'), api('/vehicles')]);
  if (cats.status === 'fulfilled') S.depts = cats.value.departments;
  if (veh.status === 'fulfilled') S.vehicles = veh.value.kinds;
  await loadMe();
  render();
  await loadCatalog();
  await scene;
  hideSplash();
})();
