const express = require('express');
const db = require('../db');
const { requireAnyAuth } = require('../middleware/anyAuth');

const router = express.Router();

const MAX_BODY = 2000;

const partBrief = db.prepare('SELECT id, name, part_no, price, kind, image_url FROM parts WHERE id = ?');
const sellerBrief = db.prepare('SELECT id, name, city, phone, rating, verified FROM sellers WHERE id = ?');
const buyerBrief = db.prepare('SELECT id, name FROM users WHERE id = ?');

// שיחה שייכת לקונה ולמוכר שלה בלבד — בלי הבדיקה הזאת כל אחד יכול לקרוא הכול.
function loadOwnConversation(req, res) {
  const id = parseInt(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'מזהה לא תקין' });
    return null;
  }
  const conv = db.prepare('SELECT * FROM conversations WHERE id = ?').get(id);
  const mine =
    conv &&
    (req.actor.role === 'buyer' ? conv.buyer_id === req.actor.id : conv.seller_id === req.actor.id);
  if (!mine) {
    res.status(404).json({ error: 'השיחה לא נמצאה' });
    return null;
  }
  return conv;
}

function decorate(conv) {
  const last = db
    .prepare('SELECT body, created_at, sender_role FROM messages WHERE conversation_id = ? ORDER BY id DESC LIMIT 1')
    .get(conv.id);
  return {
    ...conv,
    part: conv.part_id ? partBrief.get(conv.part_id) : null,
    seller: sellerBrief.get(conv.seller_id),
    buyer: buyerBrief.get(conv.buyer_id),
    last_message: last || null,
  };
}

// POST /api/conversations — קונה פותח (או ממשיך) שיחה על חלק מסוים
router.post('/', requireAnyAuth, (req, res) => {
  if (req.actor.role !== 'buyer') {
    return res.status(403).json({ error: 'רק קונה יכול לפתוח שיחה' });
  }
  const partId = parseInt((req.body || {}).part_id);
  if (Number.isNaN(partId)) return res.status(400).json({ error: 'נא לציין חלק' });

  const part = db.prepare('SELECT * FROM parts WHERE id = ?').get(partId);
  if (!part) return res.status(404).json({ error: 'החלק לא נמצא' });
  if (!part.seller_id) return res.status(400).json({ error: 'לחלק הזה אין מוכר משויך' });

  const existing = db
    .prepare('SELECT * FROM conversations WHERE buyer_id = ? AND seller_id = ? AND part_id = ?')
    .get(req.actor.id, part.seller_id, partId);

  if (existing) return res.json({ conversation: decorate(existing) });

  const result = db
    .prepare('INSERT INTO conversations (buyer_id, seller_id, part_id) VALUES (?, ?, ?)')
    .run(req.actor.id, part.seller_id, partId);
  const conv = db.prepare('SELECT * FROM conversations WHERE id = ?').get(result.lastInsertRowid);

  res.status(201).json({ conversation: decorate(conv) });
});

// GET /api/conversations — רשימת השיחות של המשתמש המחובר
router.get('/', requireAnyAuth, (req, res) => {
  const column = req.actor.role === 'buyer' ? 'buyer_id' : 'seller_id';
  const rows = db
    .prepare(`SELECT * FROM conversations WHERE ${column} = ? ORDER BY updated_at DESC, id DESC`)
    .all(req.actor.id);
  res.json({ conversations: rows.map(decorate) });
});

// GET /api/conversations/:id — השיחה עצמה: הודעות ובקשות הזמנה
router.get('/:id', requireAnyAuth, (req, res) => {
  const conv = loadOwnConversation(req, res);
  if (!conv) return undefined;

  const messages = db
    .prepare('SELECT id, sender_role, body, created_at FROM messages WHERE conversation_id = ? ORDER BY id ASC')
    .all(conv.id);
  const requests = db
    .prepare('SELECT * FROM order_requests WHERE conversation_id = ? ORDER BY id ASC')
    .all(conv.id);

  return res.json({ conversation: decorate(conv), messages, order_requests: requests });
});

// POST /api/conversations/:id/messages
router.post('/:id/messages', requireAnyAuth, (req, res) => {
  const conv = loadOwnConversation(req, res);
  if (!conv) return undefined;

  const body = (req.body || {}).body;
  if (typeof body !== 'string' || !body.trim()) {
    return res.status(400).json({ error: 'ההודעה ריקה' });
  }
  if (body.length > MAX_BODY) {
    return res.status(400).json({ error: `ההודעה ארוכה מדי (עד ${MAX_BODY} תווים)` });
  }

  const send = db.transaction(() => {
    const result = db
      .prepare('INSERT INTO messages (conversation_id, sender_role, body) VALUES (?, ?, ?)')
      .run(conv.id, req.actor.role, body.trim());
    db.prepare("UPDATE conversations SET updated_at = datetime('now') WHERE id = ?").run(conv.id);
    return result.lastInsertRowid;
  });

  const id = send();
  const message = db.prepare('SELECT id, sender_role, body, created_at FROM messages WHERE id = ?').get(id);
  return res.status(201).json({ message });
});

// POST /api/conversations/:id/order-request — הקונה שולח בקשת הזמנה
router.post('/:id/order-request', requireAnyAuth, (req, res) => {
  const conv = loadOwnConversation(req, res);
  if (!conv) return undefined;
  if (req.actor.role !== 'buyer') {
    return res.status(403).json({ error: 'רק קונה יכול לשלוח בקשת הזמנה' });
  }

  const { qty, vehicle } = req.body || {};
  if (!Number.isInteger(qty) || qty < 1) {
    return res.status(400).json({ error: 'הכמות חייבת להיות מספר שלם חיובי' });
  }

  const part = conv.part_id ? db.prepare('SELECT * FROM parts WHERE id = ?').get(conv.part_id) : null;

  const create = db.transaction(() => {
    const result = db
      .prepare(
        `INSERT INTO order_requests (conversation_id, part_id, part_no, qty, vehicle, status)
         VALUES (?, ?, ?, ?, ?, 'sent')`
      )
      .run(conv.id, conv.part_id, part ? part.part_no : null, qty, vehicle || null);
    db.prepare("UPDATE conversations SET updated_at = datetime('now') WHERE id = ?").run(conv.id);
    return result.lastInsertRowid;
  });

  const request = db.prepare('SELECT * FROM order_requests WHERE id = ?').get(create());
  return res.status(201).json({ order_request: request });
});

// PATCH /api/conversations/:id/order-requests/:requestId — המוכר מאשר או דוחה
router.patch('/:id/order-requests/:requestId', requireAnyAuth, (req, res) => {
  const conv = loadOwnConversation(req, res);
  if (!conv) return undefined;
  if (req.actor.role !== 'seller') {
    return res.status(403).json({ error: 'רק המוכר יכול לענות לבקשה' });
  }

  const requestId = parseInt(req.params.requestId);
  const status = (req.body || {}).status;
  if (!['accepted', 'declined'].includes(status)) {
    return res.status(400).json({ error: 'סטטוס חייב להיות accepted או declined' });
  }

  const request = db
    .prepare('SELECT * FROM order_requests WHERE id = ? AND conversation_id = ?')
    .get(requestId, conv.id);
  if (!request) return res.status(404).json({ error: 'הבקשה לא נמצאה' });

  db.prepare('UPDATE order_requests SET status = ? WHERE id = ?').run(status, requestId);
  const updated = db.prepare('SELECT * FROM order_requests WHERE id = ?').get(requestId);
  return res.json({ order_request: updated });
});

module.exports = router;
