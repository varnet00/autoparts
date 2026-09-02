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
  part: null, analogs: [],
  convs: [], conv: null, msgs: [],
  stock: [], stats: null,
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
async function loadCatalog() {
  S.loading = true; render();
  try {
    const data = await api(`/parts?${filterParams({ limit: 60 })}`);
    S.items = data.items; S.total = data.pagination.total;
  } catch (e) { toast(e.message, true); S.items = []; S.total = 0; }
  S.loading = false; render();
}

async function loadModels() {
  if (S.vmake === 'all') { S.models = []; return; }
  try {
    const p = new URLSearchParams({ make: S.vmake });
    if (S.vkind !== 'all') p.set('kind', S.vkind);
    S.models = (await api(`/vehicles/models?${p}`)).models;
  } catch (e) { S.models = []; }
}

async function openPart(id) {
  S.part = null; S.analogs = []; go('part');
  try {
    const [{ part }, { analogs }] = await Promise.all([api(`/parts/${id}`), api(`/parts/${id}/analogs`)]);
    S.part = part; S.analogs = analogs;
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

function itemCard(p) {
  const oem = (p.interchange_numbers || []).filter((n) => n.is_oem);
  return `
    <article class="item" data-act="open-part" data-id="${p.id}">
      <div class="pic ${p.image_url ? '' : 'empty'}" ${p.image_url ? `style="background-image:url('${esc(p.image_url)}')"` : ''}>
        ${p.image_url ? '' : esc(catLabel(p.category))}
      </div>
      <div class="body">
        <h3>${esc(p.name)}</h3>
        <span class="mono" style="font-weight:600;font-size:var(--fs-sub)">${esc(p.part_no)}</span>
        ${p.fits ? `<span class="mono muted" style="font-size:var(--fs-micro)">${esc(p.fits)}</span>` : ''}
        ${oem.length ? `<div class="row" style="gap:5px;flex-wrap:wrap"><span class="label" style="font-size:var(--fs-micro)">מחליף</span>${oem.slice(0, 2).map((n) => `<span class="num oem">${esc(n.number)}</span>`).join('')}</div>` : ''}
        <div class="foot">
          ${kindTag(p.kind)}
          <span class="price">${shekel(p.price)}</span>
        </div>
      </div>
    </article>`;
}

function viewCatalog() {
  return `
    <div class="wrap cols">
      ${railFilters()}
      <section>
        <div class="toolbar">
          <div class="stack" style="gap:6px">
            <h1 style="margin:0;font:600 var(--fs-hero)/1.2 var(--disp)">${S.q ? 'תוצאות חיפוש' : 'קטלוג החלקים'}</h1>
            <span class="label">${S.loading ? 'מחפש…' : `${S.total} פוזיציות`}</span>
          </div>
          ${crumbs()}
        </div>
        ${S.loading ? '<div class="spin"></div>'
          : S.items.length
            ? `<div class="results">${S.items.map(itemCard).join('')}</div>`
            : `<div class="empty"><span style="font:600 var(--fs-lead) var(--disp);color:var(--ink)">לא נמצאו חלקים</span>
                 <span>נסו מק״ט אחר, או הסירו חלק מהמסננים</span>
                 ${anyFilter() ? '<button class="btn ghost" data-act="clear">נקה סינון</button>' : ''}</div>`}
      </section>
    </div>`;
}

function viewPart() {
  const p = S.part;
  if (!p) return '<div class="wrap"><div class="spin"></div></div>';
  const all = p.interchange_numbers || [];
  const oems = all.filter((n) => n.is_oem);
  const nums = all.filter((n) => !n.is_oem);
  const s = p.seller;
  const cheaper = S.analogs.filter((a) => a.price < p.price).length;

  return `
    <div class="wrap">
      <button class="link row" data-act="back" style="gap:6px;margin-bottom: var(--s5)">${ICON.back} חזרה לקטלוג</button>

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

          <div class="stack" style="gap: var(--s4)">
            <div class="railhead">
              <span style="font:600 var(--fs-lead) var(--disp);color:var(--ink)">אותו חלק אצל מוכרים אחרים</span>
              <span class="label">${S.analogs.length ? `${S.analogs.length} הצעות${cheaper ? ` · ${cheaper} זולות יותר` : ''}` : 'אין כרגע'}</span>
            </div>
            ${S.analogs.length ? `<div class="card" style="overflow:hidden">
              <table>
                <tbody>
                  ${S.analogs.map((a) => `<tr data-act="open-part" data-id="${a.id}" style="cursor:pointer">
                    <td style="width:46%">
                      <div class="stack" style="gap:3px">
                        <span style="font:500 var(--fs-sub) var(--sans)">${esc(a.name)}</span>
                        <span class="mono muted" style="font-size:var(--fs-micro)">${esc(a.part_no)}</span>
                      </div>
                    </td>
                    <td>${kindTag(a.kind)}</td>
                    <td><span class="label">${esc(a.seller ? a.seller.name : '—')}</span></td>
                    <td style="text-align:start"><span class="mono" style="font-weight:600">${shekel(a.price)}</span>
                      ${a.price < p.price ? `<span class="tag orig" style="margin-inline-start:6px">−${shekel(p.price - a.price)}</span>` : ''}</td>
                  </tr>`).join('')}
                </tbody>
              </table>
            </div>` : ''}
          </div>
        </section>

        <aside class="stack" style="gap: var(--s4);position:sticky;top:calc(var(--head) + var(--s6))">
          <div class="card pad stack" style="gap: var(--s4)">
            <div class="row" style="gap: var(--s3)">
              <div style="width:40px;height:40px;border-radius:999px;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:center;font:600 var(--fs-sub) var(--mono)">${esc(s && s.name ? s.name.trim()[0] : '?')}</div>
              <div class="stack" style="gap:2px;min-width:0">
                <span style="font:500 var(--fs-body) var(--sans)">${esc(s ? s.name : 'לא ידוע')}</span>
                <span class="label">${esc(s ? s.city : '')}${s && s.verified ? ' · מאומת' : ''}</span>
              </div>
            </div>
            <div class="stack" style="gap: var(--s2)">
              <div class="row" style="justify-content:space-between"><span class="label">דירוג</span><span class="mono" style="font-size:var(--fs-sub)">${s ? s.rating : '—'} · ${s ? s.reviews_count : 0}</span></div>
              <div class="row" style="justify-content:space-between"><span class="label">טלפון</span><span class="mono" style="font-size:var(--fs-sub)">${esc(s ? s.phone : '—')}</span></div>
            </div>
            <button class="btn wide" data-act="ask" data-id="${p.id}" data-seller="${s ? s.id : ''}">שליחת הודעה למוכר</button>
            ${s && s.whatsapp ? `<a class="btn line wide" href="https://wa.me/${esc(s.whatsapp)}" target="_blank" rel="noopener">וואטסאפ</a>` : ''}
          </div>
        </aside>
      </div>
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
            </div>
            <form class="row" data-act="send" style="gap: var(--s3);padding: var(--s4) var(--s5);border-top:1px solid var(--line)">
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

function signInWall(text) {
  return `<div class="wrap"><div class="empty">
    <span style="font:600 var(--fs-lead) var(--disp);color:var(--ink)">${esc(text)}</span>
    <button class="btn" data-act="auth">כניסה או הרשמה</button>
  </div></div>`;
}

const VIEWS = { catalog: viewCatalog, part: viewPart, chats: viewChats, cabinet: viewCabinet };

/* ---------------------------- שכבות ---------------------------- */
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
            <div class="chips">
              ${chipRow(oems, 'rm-oem')}
              <button type="button" class="chip" data-act="add-oem">${ICON.plus} ${oems.length ? 'עוד מק״ט מקורי' : 'הוסף מק״ט מקורי'}</button>
            </div>
            <span class="label" style="font-size:var(--fs-micro)">${oems.length ? 'הקונים מחפשים לפי המספר הזה' : 'בלי המספר המקורי קשה למצוא את החלק'}</span>
          </div>` : ''}

          <div class="field">
            <span>מק״טים מתחלפים · יופיעו בחיפוש</span>
            <div class="chips">
              ${chipRow(nums, 'rm-num')}
              <button type="button" class="chip" data-act="add-num">${ICON.plus} הוסף מק״ט</button>
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
  const cur = S.screen === 'part' ? 'catalog' : S.screen;
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
  $('#layer').innerHTML = S.draft ? partForm() : (S.auth.open ? authModal() : '');
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
  if (act === 'back') { go('catalog'); return; }
  if (act === 'open-part') { openPart(Number(el.dataset.id)); return; }

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
    if (!confirm('למחוק את הפוזיציה?')) return;
    try { await api(`/sellers/me/parts/${el.dataset.id}`, { method: 'DELETE' }); toast('נמחק'); loadCabinet(); }
    catch (e) { toast(e.message, true); }
    return;
  }
  if (act === 'set-kind') { syncDraft(); S.draft.kind = el.dataset.kind; render(); return; }
  if (act === 'add-num') {
    syncDraft();
    const n = prompt('מק״ט מתחלף');
    if (n && n.trim()) { S.draft.nums = [...(S.draft.nums || []), n.trim()]; render(); }
    return;
  }
  if (act === 'rm-num') { syncDraft(); S.draft.nums.splice(Number(el.dataset.i), 1); render(); return; }
  if (act === 'add-oem') {
    syncDraft();
    const n = prompt('מק״ט מקורי — המספר של היצרן');
    if (n && n.trim()) { S.draft.oems = [...(S.draft.oems || []), n.trim()]; render(); }
    return;
  }
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
  if (ev.key === '/' && !/input|select|textarea/i.test(document.activeElement.tagName)) {
    ev.preventDefault();
    $('#q').focus();
  }
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
  const scene = new Promise((done) => setTimeout(done, 2500));
  const [cats, veh] = await Promise.allSettled([api('/categories'), api('/vehicles')]);
  if (cats.status === 'fulfilled') S.depts = cats.value.departments;
  if (veh.status === 'fulfilled') S.vehicles = veh.value.kinds;
  await loadMe();
  render();
  await loadCatalog();
  await scene;
  hideSplash();
})();
