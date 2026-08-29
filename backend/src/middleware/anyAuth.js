const jwt = require('jsonwebtoken');

// הצ׳אט משותף לקונה ולמוכר, אז המידלוור מקבל את שני סוגי הטוקנים
// ומסמן ב-req.actor מי מדבר.
function requireAnyAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'נדרשת התחברות — לא נמצא טוקן' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const role = payload.role === 'seller' ? 'seller' : 'buyer';
    req.actor = { role, id: payload.sub, name: payload.name, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'טוקן לא תקין או שפג תוקפו' });
  }
}

module.exports = { requireAnyAuth };
