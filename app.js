'use strict';

/* ============================ אייקונים ============================
   האייקונים משורבבים כ-SVG במקום להיטען מ-CDN: פחות תלות חיצונית,
   ועובד גם בלי רשת. */
const I = (d, o) => `<svg width="${(o && o.s) || 19}" height="${(o && o.s) || 19}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const ICON = {
  search: o => I('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', o),
  scan: o => I('<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M3 12h18"/>', o),
  bell: o => I('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>', o),
  user: o => I('<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>', o),
  house: o => I('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>', o),
  package: o => I('<path d="m7.5 4.3 9 5.2M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>', o),
  chat: o => I('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>', o),
  plus: o => I('<path d="M12 5v14M5 12h14"/>', o),
  chevron: o => I('<path d="m15 18-6-6 6-6"/>', o),
  back: o => I('<path d="M5 12h14M12 5l7 7-7 7"/>', o),
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

const LOGO = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
  <rect width="28" height="28" rx="9" fill="#f2761b"/>
  <path d="M8.6 19.4 13 8.6h2l4.4 10.8h-2.3l-1-2.6h-4.2l-1 2.6zm4-4.5h2.8L14 11.2z" fill="#16140f"/>
</svg>`;

/* ============================ עזרים ============================ */
const $ = (sel, root) => (root || document).querySelector(sel);
const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shekel = (n) => `₪ ${Number(n).toLocaleString('he-IL')}`;

const KIND_LABEL = { orig: 'מקורי', copy: 'חלופי', used: 'משומש' };
const CATEGORY_LABEL = {
  brakes: 'בלמים', filters: 'מסננים', battery: 'מצברים',
  lights: 'תאורה', oil: 'שמנים', suspension: 'מתלים',
};

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
  analogs: [],
  supOpen: true,
  stock: [],
  stats: null,
  sellerStats: null,
  conversations: [],
  conv: null,
  messages: [],
  requests: [],
  loading: false,
  draft: null,
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
function topBar(opts) {
  const o = opts || {};
  const right = o.back
    ? `<button class="iconbtn" data-act="${esc(o.back)}">${ICON.back()}</button>`
    : `<span class="brand">${LOGO}<b>AUTOPARTS</b></span>`;
  const title = o.title ? `<span style="font:600 16px var(--disp)">${esc(o.title)}</span>` : '';
  const left = o.actions === undefined
    ? `<span class="row" style="gap:8px">
         <button class="iconbtn" data-act="chats">${ICON.chat({ s: 17 })}</button>
         <button class="iconbtn" data-act="profile">${ICON.user({ s: 17 })}</button>
       </span>`
    : o.actions;
  return `<div class="top">${right}${title}${left}</div>`;
}

function kindTag(kind) {
  const k = KIND_LABEL[kind] ? kind : 'copy';
  return `<span class="tag ${k}">${KIND_LABEL[k]}</span>`;
}

function thumb(part, size) {
  const s = size || 72;
  const bg = part.image_url ? `background-image:url('${esc(part.image_url)}')` : '';
  return `<div class="thumb" style="width:${s}px;height:${s}px;${bg}">${part.image_url ? '' : 'תמונה'}</div>`;
}

function partNums(part, max) {
  const nums = (part.interchange_numbers || []).slice(0, max || 3);
  if (!nums.length) return '';
  return `<div class="chips" style="gap:5px">${nums.map((n) => `<span class="num">${esc(n.number)}</span>`).join('')}</div>`;
}

function emptyState(icon, title, sub) {
  return `<div class="center">
    <div style="color:var(--muted)">${icon}</div>
    <div style="font:600 16px var(--disp)">${esc(title)}</div>
    ${sub ? `<div class="label" style="max-width:260px">${esc(sub)}</div>` : ''}
  </div>`;
}

function loader() {
  return `<div class="center"><div class="spin"></div></div>`;
}

/* ============================ מסך: בית ============================ */
function viewHome() {
  const st = S.stats;
  const quick = ['רפידות בלימה', 'מסנן שמן', 'מצבר'];
  return `
    ${topBar({})}
    <div class="scroll" style="display:flex;flex-direction:column">
      <div class="center" style="padding:30px 26px 26px;gap:26px">
        <div style="font:600 27px/1.35 var(--disp);text-wrap:pretty">כל חלק. כל רכב.<br>מחיר אחד וברור.</div>
        <div class="stack" style="width:100%;gap:11px">
          <form class="searchbar" data-act="search-submit">
            ${ICON.search({ s: 19 })}
            <input name="q" placeholder="שם חלק או מספר מק״ט" value="${esc(S.q)}" autocomplete="off">
            <button type="submit" aria-label="חיפוש">${ICON.scan({ s: 19 })}</button>
          </form>
          <div class="chips" style="justify-content:center">
            ${quick.map((t) => `<button class="chip" data-act="quick" data-q="${esc(t)}">${esc(t)}</button>`).join('')}
          </div>
        </div>
        <div class="row" style="gap:14px;font:400 11.5px var(--sans);color:var(--muted)">
          ${st ? `<span>${st.numbers} מק״טים</span>
                  <span style="width:4px;height:4px;border-radius:999px;background:#c8c1b7"></span>
                  <span>${st.verified_sellers} מוכרים מאומתים</span>` : '<span>טוען…</span>'}
        </div>
      </div>
      <div class="pad stack" style="gap:11px;padding-bottom:30px;flex:none">
        <span class="label">קטגוריות</span>
        <div class="chips">
          ${Object.keys(CATEGORY_LABEL).map((c) => `<button class="chip" data-act="cat" data-cat="${c}">${CATEGORY_LABEL[c]}</button>`).join('')}
        </div>
      </div>
    </div>`;
}

/* ============================ מסך: חיפוש ============================ */
function viewSearch() {
  const kinds = [['all', 'הכל'], ['orig', 'מקורי'], ['copy', 'חלופי'], ['used', 'משומש']];
  return `
    ${topBar({})}
    <div class="scroll">
      <div class="pad stack" style="gap:11px;padding-top:16px">
        <form class="searchbar" data-act="search-submit">
          ${ICON.search({ s: 18 })}
          <input name="q" placeholder="חיפוש לפי תיאור או מספר מק״ט" value="${esc(S.q)}" autocomplete="off">
        </form>
        <div class="chips">
          ${kinds.map(([k, t]) => `<button class="chip" data-act="kind" data-kind="${k}" aria-pressed="${S.kind === k}">${t}</button>`).join('')}
        </div>
        ${S.category !== 'all' ? `<div class="row between">
          <span class="label">קטגוריה: ${esc(CATEGORY_LABEL[S.category] || S.category)}</span>
          <button class="label" data-act="cat" data-cat="all" style="text-decoration:underline">נקה</button>
        </div>` : ''}
      </div>
      <div class="pad row between" style="padding-top:18px">
        <span class="label">תוצאות</span>
        <span class="label mono">${S.total}</span>
      </div>
      <div class="pad stack" style="gap:9px;padding-top:10px">
        ${S.loading ? loader()
          : S.items.length
            ? S.items.map(resultCard).join('')
            : emptyState(ICON.search({ s: 30 }), 'לא נמצאו חלקים', 'נסו מק״ט אחר או נקו את הסינון')}
      </div>
    </div>`;
}

// הכרטיס ברשימה מציג רק שם, מק״ט ותמונה; השאר נפתח בלחיצה
function resultCard(p) {
  const open = S.openPart === p.id;
  return `<div class="card">
    <div class="row" style="align-items:flex-start;gap:14px;padding:16px 17px;cursor:pointer" data-act="toggle" data-id="${p.id}">
      <div class="stack" style="flex:1;gap:8px;min-width:0">
        <span style="font:500 15.5px/1.25 var(--sans)">${esc(p.name)}</span>
        <span class="mono" style="font-weight:600;font-size:13.5px;letter-spacing:.4px">${esc(p.part_no)}</span>
        ${p.fits ? `<span class="mono muted" style="font-size:10.5px">${esc(p.fits)}</span>` : ''}
        ${partNums(p)}
        <span>${kindTag(p.kind)}</span>
      </div>
      <div class="row" style="gap:9px">
        <div class="stack" style="align-items:center;gap:8px">
          ${thumb(p, 72)}
          <span class="price">${shekel(p.price)}</span>
        </div>
        <span style="color:#b8b0a6;transform:rotate(${open ? '-90' : '0'}deg);transition:.15s">${ICON.chevron({ s: 18 })}</span>
      </div>
    </div>
    ${open ? `<div class="hr stack" style="padding:15px 17px;gap:12px">
      <div class="row between">
        <span class="label">מוכר</span>
        <span style="font:500 12.5px var(--sans)">${esc(p.seller ? p.seller.name : '—')}</span>
      </div>
      <div class="row between">
        <span class="label">עיר</span>
        <span style="font:500 12.5px var(--sans)">${esc(p.seller ? p.seller.city : '—')}</span>
      </div>
      <div class="row between">
        <span class="label">מלאי</span>
        <span class="mono" style="font-size:12.5px">${p.qty > 0 ? `${p.qty} יח׳` : 'אזל'}</span>
      </div>
      <button class="btn" data-act="open-part" data-id="${p.id}">לכרטיס החלק</button>
    </div>` : ''}
  </div>`;
}

/* ============================ מסך: כרטיס חלק ============================ */
function viewPart() {
  const p = S.part;
  if (!p) return `${topBar({ back: 'search' })}${loader()}`;
  const s = p.seller;
  const nums = p.interchange_numbers || [];

  return `
    ${topBar({ back: 'search', actions: '' })}
    <div class="scroll">
      <div class="pad row" style="align-items:flex-start;gap:14px;padding-top:20px">
        <div class="stack" style="flex:1;gap:9px;min-width:0">
          <span style="font:600 19px/1.25 var(--disp)">${esc(p.name)}</span>
          <span class="mono" style="font-weight:600;font-size:15px;letter-spacing:.4px">${esc(p.part_no)}</span>
          <div class="row" style="gap:7px;flex-wrap:wrap">
            ${kindTag(p.kind)}
            ${p.maker ? `<span class="mono muted" style="font-size:11px">${esc(p.maker)}</span>` : ''}
          </div>
          ${p.fits ? `<span class="mono muted" style="font-size:11px">${esc(p.fits)}</span>` : ''}
        </div>
        ${thumb(p, 96)}
      </div>

      ${nums.length ? `<div class="pad stack" style="gap:9px;padding-top:20px">
        <span class="label">מק״טים של אותו חלק · ${nums.length}</span>
        <div class="chips" style="gap:6px">
          ${nums.map((n) => `<span class="num" style="font-size:12px;padding:6px 10px;color:var(--ink)" title="${esc(n.brand || '')}">${esc(n.number)}</span>`).join('')}
        </div>
      </div>` : ''}

      <div class="pad" style="padding-top:16px">
        <div class="card">
          <div class="row" style="gap:11px;padding:15px 17px;cursor:pointer" data-act="toggle-sup">
            <div style="width:32px;height:32px;border-radius:999px;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:center;font:600 12px var(--mono)">${esc((s && s.name ? s.name.trim()[0] : '?'))}</div>
            <div class="stack" style="flex:1;gap:2px;min-width:0">
              <span style="font:500 14px var(--sans)">${esc(s ? s.name : 'לא ידוע')}</span>
              <span class="label">המוכר · ${esc(s ? s.city : '')}</span>
            </div>
            ${s && s.verified ? `<span class="row" style="gap:6px;padding:6px 10px;border:1px solid #b9c4ae;border-radius:6px;background:#eef3e8;color:var(--orig-fg);font:600 10px var(--sans)">${ICON.badge({ s: 12 })}מאומת</span>` : ''}
            <span class="label">${S.supOpen ? 'הסתר' : 'הצג'}</span>
          </div>
          ${S.supOpen && s ? `<div class="hr stack" style="padding:15px 17px;gap:12px">
            <div class="row between"><span class="label">טלפון</span><span class="mono" style="font-size:12.5px">${esc(s.phone)}</span></div>
            <div class="row between"><span class="label">מלאי</span><span style="font:500 12.5px var(--sans)">${p.qty > 0 ? `${p.qty} יחידות` : 'אזל מהמלאי'}</span></div>
            <div class="row between"><span class="label">דירוג</span><span class="mono" style="font-size:12.5px">${s.rating} · ${s.reviews_count}</span></div>
            <div class="row between" style="align-items:baseline"><span style="font:500 13px var(--sans)">מחיר</span><span class="mono" style="font:600 22px var(--mono)">${shekel(p.price)}</span></div>
            <div class="row" style="gap:8px">
              <button class="btn" data-act="start-chat" data-id="${p.id}" style="flex:1">בקשה בצ׳אט</button>
              <a class="btn ghost" href="tel:${esc(s.phone)}" style="width:50px;display:flex;align-items:center;justify-content:center;text-decoration:none">${ICON.phone({ s: 17 })}</a>
            </div>
          </div>` : ''}
        </div>
      </div>

      <div class="pad stack" style="gap:9px;padding-top:20px">
        <div class="row between">
          <span class="label">אנלוגים זמינים</span>
          <span class="label mono">${S.analogs.length}</span>
        </div>
        ${S.analogs.length
          ? S.analogs.map((a) => `<div class="card row" style="gap:11px;padding:14px 16px;cursor:pointer" data-act="open-part" data-id="${a.id}">
              <div class="stack" style="flex:1;gap:5px;min-width:0">
                <span class="mono" style="font-weight:600;font-size:12.5px">${esc(a.part_no)}</span>
                <span class="mono muted" style="font-size:10.5px">${esc(a.maker || (a.seller ? a.seller.name : ''))}</span>
              </div>
              ${kindTag(a.kind)}
              <span class="price" style="font-size:13px">${shekel(a.price)}</span>
            </div>`).join('')
          : `<div class="card" style="padding:16px 17px"><span class="label">לא נמצאו הצעות מקבילות</span></div>`}
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
    ${topBar({ actions: `<button class="iconbtn" data-act="profile">${ICON.settings({ s: 17 })}</button>` })}
    <div class="scroll">
      <div class="pad stack" style="gap:3px;padding-top:20px">
        <span style="font:600 21px var(--disp)">המלאי שלי</span>
        <span class="label">${esc(S.me ? S.me.name : '')}${S.me && S.me.verified ? ' · מוכר מאומת' : ''}</span>
      </div>
      <div class="pad row" style="gap:8px;padding-top:16px">
        <div class="stack" style="flex:1;background:var(--ink);color:#fff;border-radius:16px;padding:15px 16px;gap:5px">
          <span class="mono" style="font:600 22px var(--mono)">${st ? st.in_stock : '—'}</span>
          <span style="font:400 10.5px var(--sans);color:rgba(255,255,255,.6)">יחידות במלאי</span>
        </div>
        <div class="stack" style="flex:1;background:var(--card);border-radius:16px;padding:15px 16px;gap:5px">
          <span class="mono" style="font:600 22px var(--mono)">${st ? st.out_of_stock : '—'}</span>
          <span class="label" style="font-size:10.5px">אזלו</span>
        </div>
        <div class="stack" style="flex:1;background:var(--card);border-radius:16px;padding:15px 16px;gap:5px">
          <span class="mono" style="font:600 22px var(--mono)">${st ? st.requests : '—'}</span>
          <span class="label" style="font-size:10.5px">בקשות</span>
        </div>
      </div>
      <div class="pad row between" style="padding-top:20px">
        <span class="label">הפוזיציות שלי</span>
        <span class="label mono">${S.stock.length}</span>
      </div>
      <div class="pad stack" style="gap:9px;padding-top:10px">
        ${S.loading ? loader() : S.stock.map(stockCard).join('')}
        ${!S.loading && !S.stock.length ? emptyState(ICON.package({ s: 30 }), 'אין עדיין פוזיציות', 'הוסיפו את החלק הראשון עם הכפתור למטה') : ''}
        ${st && st.out_of_stock > 0 ? `<div class="card row" style="gap:12px;padding:16px 17px;border-inline-start:3px solid #d1791f">
          ${ICON.warn({ s: 19 })}
          <div class="stack" style="flex:1;gap:3px">
            <span style="font:500 13.5px var(--sans)">${st.out_of_stock} פוזיציות אזלו מהמלאי</span>
            <span class="label">קונים רואים אותן כלא זמינות</span>
          </div>
        </div>` : ''}
      </div>
    </div>`;
}

function stockCard(p) {
  return `<div class="card stack" style="padding:16px 17px;gap:13px">
    <div class="row" style="align-items:flex-start;gap:14px">
      <div class="stack" style="flex:1;gap:7px;min-width:0">
        <span style="font:500 15px/1.25 var(--sans)">${esc(p.name)}</span>
        <span class="mono" style="font-weight:600;font-size:13px">${esc(p.part_no)}</span>
        ${p.fits ? `<span class="mono muted" style="font-size:10.5px">${esc(p.fits)}</span>` : ''}
        <span>${kindTag(p.kind)}</span>
      </div>
      <div class="stack" style="align-items:center;gap:8px">
        ${thumb(p, 66)}
        <span class="price" style="font-size:14px">${shekel(p.price)}</span>
        <span class="mono muted" style="font-size:10.5px">${p.qty > 0 ? `×${p.qty} במלאי` : 'אזל'}</span>
      </div>
    </div>
    ${partNums(p, 4) ? `<div class="stack" style="gap:8px"><span class="label">מק״טים חלופיים</span>${partNums(p, 4)}</div>` : ''}
    <div class="row hr" style="gap:8px;padding-top:12px">
      <button class="btn line row" data-act="edit" data-id="${p.id}" style="flex:1;justify-content:center;gap:7px;padding:11px;font-size:12px">${ICON.pencil({ s: 14 })}ערוך</button>
      <button class="btn ghost" data-act="delete" data-id="${p.id}" style="width:46px;padding:11px;display:flex;align-items:center;justify-content:center">${ICON.trash({ s: 16 })}</button>
    </div>
  </div>`;
}

/* ============================ מסך: פוזיציה חדשה ============================ */
function viewCreate() {
  const d = S.draft || {};
  const editing = Boolean(d.id);
  const kinds = [['orig', 'מקורי'], ['copy', 'חלופי'], ['used', 'משומש']];
  const nums = d.nums || [];
  return `
    <div class="top">
      <button class="iconbtn" data-act="stock">${ICON.close({ s: 17 })}</button>
      <span style="font:600 16px var(--disp)">${editing ? 'עריכת פוזיציה' : 'פוזיציה חדשה'}</span>
      <span style="width:40px"></span>
    </div>
    <div class="scroll">
      <form class="pad stack" style="gap:15px;padding-top:20px" data-act="save-part">
        <div class="row" style="gap:10px;align-items:flex-start">
          <div class="stack" style="width:96px;height:96px;border-radius:16px;border:1px dashed #c9c2b8;background:var(--card);align-items:center;justify-content:center;gap:6px;color:var(--muted)">
            ${ICON.camera({ s: 20 })}<span style="font:400 10.5px var(--sans)">הוסף תמונה</span>
          </div>
          <div class="field" style="flex:1">
            <span class="label">שם החלק</span>
            <input name="name" required value="${esc(d.name || '')}" placeholder="רפידות בלימה קדמיות">
            <span class="label" style="font-size:10.5px">הצילום מגדיל סיכוי למכירה</span>
          </div>
        </div>
        <div class="field">
          <span class="label">מספר מק״ט ראשי · חובה</span>
          <input class="mono" name="part_no" required value="${esc(d.part_no || '')}" placeholder="04465-02220">
        </div>
        <div class="field">
          <span class="label">מק״טים מתחלפים · יופיעו בחיפוש</span>
          <div class="chips" id="numsBox">
            ${nums.map((n, i) => `<span class="num" style="display:flex;align-items:center;gap:7px;padding:8px 12px;font-size:11.5px;color:var(--ink)">${esc(n)}<button type="button" data-act="rm-num" data-i="${i}" aria-label="הסר">${ICON.close({ s: 11 })}</button></span>`).join('')}
            <button type="button" class="row" data-act="add-num" style="gap:6px;padding:8px 12px;border-radius:999px;border:1px dashed #c9c2b8;font:500 11.5px var(--sans);color:var(--muted)">${ICON.plus({ s: 12 })}הוסף מק״ט</button>
          </div>
        </div>
        <div class="row" style="gap:9px;align-items:flex-start">
          <div class="field" style="flex:1"><span class="label">יצרן</span><input class="mono" name="maker" value="${esc(d.maker || '')}" placeholder="ADVICS"></div>
          <div class="field" style="flex:1">
            <span class="label">מצב</span>
            <div class="row" style="gap:5px">
              ${kinds.map(([k, t]) => `<button type="button" class="chip" data-act="set-kind" data-kind="${k}" aria-pressed="${(d.kind || 'copy') === k}" style="flex:1;text-align:center;border-radius:12px;padding:12px 0">${t}</button>`).join('')}
            </div>
          </div>
        </div>
        <div class="field">
          <span class="label">קטגוריה</span>
          <select name="category">
            ${Object.keys(CATEGORY_LABEL).map((c) => `<option value="${c}" ${d.category === c ? 'selected' : ''}>${CATEGORY_LABEL[c]}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <span class="label">דגם ושנים</span>
          <input class="mono" name="fits" value="${esc(d.fits || '')}" placeholder="TOYOTA COROLLA E210 · 2016—2023">
        </div>
        <div class="row" style="gap:9px">
          <div class="field" style="flex:1"><span class="label">מחיר ₪</span><input class="mono" name="price" type="number" min="0" required value="${esc(d.price != null ? d.price : '')}" placeholder="210"></div>
          <div class="field" style="flex:1"><span class="label">כמות</span><input class="mono" name="qty" type="number" min="0" required value="${esc(d.qty != null ? d.qty : 0)}" placeholder="6"></div>
        </div>
        <button class="btn" type="submit" style="margin-top:4px">${editing ? 'שמור שינויים' : 'פרסם פוזיציה'}</button>
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
      <div class="pad" style="padding-top:20px"><span style="font:600 21px var(--disp)">הודעות</span></div>
      <div class="pad stack" style="gap:9px;padding-top:16px">
        ${S.loading ? loader()
          : S.conversations.length
            ? S.conversations.map((c) => {
                const other = isSeller() ? (c.buyer && c.buyer.name) : (c.seller && c.seller.name);
                return `<div class="card row" style="gap:11px;padding:14px 16px;cursor:pointer" data-act="open-chat" data-id="${c.id}">
                  <div style="width:40px;height:40px;border-radius:999px;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:center;font:600 13px var(--mono)">${esc(other ? other.trim()[0] : '?')}</div>
                  <div class="stack" style="flex:1;gap:3px;min-width:0">
                    <span style="font:500 14px var(--sans)">${esc(other || '—')}</span>
                    <span class="label" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(c.last_message ? c.last_message.body : (c.part ? c.part.name : ''))}</span>
                  </div>
                  ${c.part ? `<span class="mono muted" style="font-size:10.5px">${esc(c.part.part_no)}</span>` : ''}
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
    <div class="top" style="padding-bottom:14px;border-bottom:1px solid var(--line)">
      <button class="iconbtn" data-act="chats">${ICON.back({ s: 17 })}</button>
      <div class="row" style="flex:1;gap:11px;margin-inline-start:11px">
        <div style="width:40px;height:40px;border-radius:999px;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:center;font:600 13px var(--mono)">${esc(other && other.name ? other.name.trim()[0] : '?')}</div>
        <div class="stack" style="flex:1;gap:2px;min-width:0">
          <div class="row" style="gap:6px">
            <span style="font:500 14px var(--sans)">${esc(other ? other.name : '—')}</span>
            ${!isSeller() && c.seller && c.seller.verified ? `<span style="color:var(--orig-fg)">${ICON.badge({ s: 14 })}</span>` : ''}
          </div>
          ${!isSeller() && c.seller ? `<span class="label">${esc(c.seller.city)}</span>` : ''}
        </div>
      </div>
    </div>

    ${p ? `<div class="pad" style="padding-top:14px">
      <div class="card row" style="gap:12px;padding:13px 15px">
        ${thumb(p, 46)}
        <div class="stack" style="flex:1;gap:5px;min-width:0">
          <span style="font:500 13.5px var(--sans)">${esc(p.name)}</span>
          <span class="mono" style="font-weight:600;font-size:12px">${esc(p.part_no)}</span>
        </div>
        <span class="price" style="font-size:13px">${shekel(p.price)}</span>
      </div>
    </div>` : ''}

    <div class="scroll" id="thread" style="padding-bottom:20px">
      <div class="pad stack" style="gap:9px;padding-top:16px">
        ${S.messages.length ? '' : `<span class="label" style="align-self:center">אין עדיין הודעות</span>`}
        ${S.messages.map((m) => {
          const mine = m.sender_role === S.role;
          return `<div class="bubble ${mine ? 'me' : 'them'}">${esc(m.body)}</div>
                  <span class="time" style="align-self:${mine ? 'flex-end' : 'flex-start'}">${timeOf(m.created_at)}</span>`;
        }).join('')}

        ${S.requests.map((r) => `<div class="card stack" style="align-self:${isSeller() ? 'flex-start' : 'flex-end'};width:88%;padding:15px 16px;gap:11px">
          <span class="label">בקשת הזמנה · ${r.status === 'sent' ? 'ממתינה' : r.status === 'accepted' ? 'אושרה' : 'נדחתה'}</span>
          <div class="stack" style="gap:7px">
            <div class="row between"><span class="label">מק״ט</span><span class="mono" style="font-size:12px">${esc(r.part_no || '—')}</span></div>
            <div class="row between"><span class="label">כמות</span><span class="mono" style="font-size:12px">${r.qty}</span></div>
            ${r.vehicle ? `<div class="row between"><span class="label">רכב</span><span class="mono" style="font-size:12px">${esc(r.vehicle)}</span></div>` : ''}
          </div>
          ${isSeller() && r.status === 'sent' ? `<div class="row" style="gap:8px">
            <button class="btn" data-act="answer" data-id="${r.id}" data-status="accepted" style="flex:1;padding:13px;font-size:12.5px">אשר</button>
            <button class="btn ghost" data-act="answer" data-id="${r.id}" data-status="declined" style="padding:13px 16px;font-size:12.5px">דחה</button>
          </div>` : ''}
        </div>`).join('')}
      </div>
    </div>

    <div class="row" style="padding:12px 18px 24px;gap:9px;flex:none">
      ${!isSeller() && p ? `<button class="iconbtn" data-act="order-form" style="border-radius:999px;width:46px;height:46px">${ICON.plus({ s: 18 })}</button>` : ''}
      <form class="row" data-act="send-msg" style="flex:1;gap:9px">
        <input name="body" placeholder="כתוב הודעה…" autocomplete="off"
               style="flex:1;background:var(--card);border-radius:999px;padding:15px 18px;border:0;outline:none;font-size:14px;min-width:0">
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
        <div class="pad stack" style="gap:20px;padding-top:24px">
          <div class="stack" style="gap:4px">
            <span style="font:600 21px var(--disp)">${esc(S.me ? S.me.name : 'החשבון שלי')}</span>
            <span class="label">${isSeller() ? 'חשבון מוכר' : 'חשבון קונה'}${S.me && S.me.city ? ' · ' + esc(S.me.city) : ''}</span>
          </div>
          ${isSeller() ? `<button class="btn ghost" data-act="stock">למלאי שלי</button>` : ''}
          <button class="btn line row" data-act="logout" style="justify-content:center;gap:8px">${ICON.logout({ s: 16 })}התנתקות</button>
        </div>
      </div>`;
  }

  const asSeller = S.authTab === 'seller';
  const reg = S.authMode === 'register';
  return `
    ${topBar({ actions: '' })}
    <div class="scroll">
      <div class="center" style="padding:36px 26px 12px;gap:10px">
        ${LOGO}
        <span style="font:600 20px var(--disp)">ברוכים הבאים ל-autoparts</span>
        <span class="label" style="max-width:280px">${asSeller ? 'נהלו את כרטיסי המוצר שלכם' : 'מצאו כל חלק לפי מק״ט'}</span>
      </div>
      <div class="pad stack" style="gap:14px">
        <div class="row" style="gap:5px;background:var(--card);border-radius:14px;padding:5px">
          <button class="chip" data-act="auth-tab" data-tab="buyer" aria-pressed="${!asSeller}" style="flex:1;text-align:center;border-radius:10px;padding:11px 0;${!asSeller ? '' : 'background:transparent'}">קונה</button>
          <button class="chip" data-act="auth-tab" data-tab="seller" aria-pressed="${asSeller}" style="flex:1;text-align:center;border-radius:10px;padding:11px 0;${asSeller ? '' : 'background:transparent'}">מוכר</button>
        </div>
        <form class="stack" style="gap:11px" data-act="auth-submit">
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
function renderDock() {
  const hidden = S.screen === 'create' || S.screen === 'chat';
  const dock = $('#dock');
  if (hidden) { dock.innerHTML = ''; return; }

  const tabs = [
    ['home', ICON.house()],
    ['stock', ICON.package()],
    ['chats', ICON.chat()],
    ['profile', ICON.user()],
  ];
  const current = S.screen === 'search' || S.screen === 'part' ? 'home' : S.screen;

  dock.innerHTML = `
    <div class="island">
      ${tabs.map(([k, ic]) => `<button class="tab" data-act="${k}" aria-current="${current === k ? 'page' : 'false'}" aria-label="${k}">${ic}</button>`).join('')}
    </div>
    <button class="fab" data-act="create" aria-label="פוזיציה חדשה">${ICON.plus({ s: 24 })}</button>`;
}

/* ============================ ציור ============================ */
const VIEWS = {
  home: viewHome, search: viewSearch, part: viewPart, stock: viewStock,
  create: viewCreate, chats: viewChats, chat: viewChat, profile: viewProfile,
};

function render() {
  const view = VIEWS[S.screen] || viewHome;
  const el = $('#screen');
  const keepScroll = el.querySelector('.scroll');
  const y = keepScroll ? keepScroll.scrollTop : 0;

  el.innerHTML = view();
  renderDock();

  // בשיחה גוללים לסוף; בשאר המסכים שומרים על מיקום הגלילה
  const scroll = el.querySelector('.scroll');
  if (scroll) scroll.scrollTop = S.screen === 'chat' ? scroll.scrollHeight : (S.keepScroll ? y : 0);
  S.keepScroll = false;
}

function go(screen) {
  S.screen = screen;
  render();
}

/* ============================ טעינת נתונים ============================ */
async function loadStats() {
  try { S.stats = await api('/stats'); render(); } catch (e) { /* המסך עובד גם בלי */ }
}

async function loadSearch() {
  S.loading = true; render();
  try {
    const params = new URLSearchParams();
    if (S.q) params.set('q', S.q);
    if (S.kind !== 'all') params.set('kind', S.kind);
    if (S.category !== 'all') params.set('category', S.category);
    params.set('limit', '50');
    const data = await api(`/parts?${params}`);
    S.items = data.items;
    S.total = data.pagination.total;
  } catch (e) {
    toast(e.message, true); S.items = []; S.total = 0;
  }
  S.loading = false; render();
}

async function loadPart(id) {
  S.part = null; S.analogs = []; S.supOpen = true;
  go('part');
  try {
    const [{ part }, { analogs }] = await Promise.all([api(`/parts/${id}`), api(`/parts/${id}/analogs`)]);
    S.part = part; S.analogs = analogs;
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
  S.draft.fits = text('fits');
  S.draft.category = text('category') || S.draft.category;
  const price = text('price');
  const qty = text('qty');
  S.draft.price = price === '' ? null : Number(price);
  S.draft.qty = qty === '' ? 0 : Number(qty);
}

/* ============================ אירועים ============================ */
document.addEventListener('click', async (ev) => {
  const el = ev.target.closest('[data-act]');
  if (!el || el.tagName === 'FORM') return;
  const act = el.dataset.act;

  // ניווט
  if (act === 'home') { S.q = ''; S.category = 'all'; go('home'); loadStats(); return; }
  if (act === 'search') { go('search'); return; }
  if (act === 'stock') { go('stock'); loadStock(); return; }
  if (act === 'chats') { go('chats'); loadChats(); return; }
  if (act === 'profile') { go('profile'); loadMe(); return; }

  if (act === 'create') {
    if (!authed() || !isSeller()) { toast('התחברו כמוכר כדי להוסיף פוזיציה', true); go('profile'); return; }
    S.draft = { kind: 'copy', category: 'brakes', qty: 0, nums: [] };
    go('create'); return;
  }

  if (act === 'quick') { S.q = el.dataset.q; S.kind = 'all'; S.category = 'all'; go('search'); loadSearch(); return; }
  if (act === 'cat') {
    S.category = el.dataset.cat; S.q = '';
    go('search'); loadSearch(); return;
  }
  if (act === 'kind') { S.kind = el.dataset.kind; loadSearch(); return; }
  if (act === 'toggle') { S.openPart = S.openPart === Number(el.dataset.id) ? null : Number(el.dataset.id); S.keepScroll = true; render(); return; }
  if (act === 'open-part') { loadPart(el.dataset.id); return; }
  if (act === 'toggle-sup') { S.supOpen = !S.supOpen; S.keepScroll = true; render(); return; }

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
    S.draft = { ...p, nums: (p.interchange_numbers || []).map((n) => n.number) };
    go('create'); return;
  }
  if (act === 'delete') {
    if (!confirm('למחוק את הפוזיציה?')) return;
    try { await api(`/sellers/me/parts/${el.dataset.id}`, { method: 'DELETE' }); toast('נמחק'); loadStock(); }
    catch (e) { toast(e.message, true); }
    return;
  }
  if (act === 'set-kind') { syncDraft(); S.draft.kind = el.dataset.kind; S.keepScroll = true; render(); return; }
  if (act === 'add-num') {
    syncDraft();
    const n = prompt('מספר מק״ט מתחלף');
    if (n && n.trim()) { S.draft.nums.push(n.trim()); S.keepScroll = true; render(); }
    return;
  }
  if (act === 'rm-num') { syncDraft(); S.draft.nums.splice(Number(el.dataset.i), 1); S.keepScroll = true; render(); return; }

  // חשבון
  if (act === 'auth-tab') { S.authTab = el.dataset.tab; render(); return; }
  if (act === 'auth-mode') { S.authMode = S.authMode === 'register' ? 'login' : 'register'; render(); return; }
  if (act === 'logout') { clearAuth(); S.stock = []; S.conversations = []; toast('התנתקת'); go('home'); loadStats(); return; }
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
    const payload = {
      name: (fd.get('name') || '').toString().trim(),
      part_no: (fd.get('part_no') || '').toString().trim(),
      category: fd.get('category'),
      maker: (fd.get('maker') || '').toString().trim() || null,
      fits: (fd.get('fits') || '').toString().trim() || null,
      kind: d.kind || 'copy',
      price: Number(fd.get('price')),
      qty: Number(fd.get('qty')),
      interchange_numbers: (d.nums || []).map((n) => ({ number: n })),
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
      if (seller) { go('stock'); loadStock(); } else { go('home'); loadStats(); }
    } catch (e) { toast(e.message, true); }
    return;
  }
});

/* ============================ אתחול ============================ */
S.authTab = 'buyer';
S.authMode = 'login';
render();
loadStats();
loadMe();
