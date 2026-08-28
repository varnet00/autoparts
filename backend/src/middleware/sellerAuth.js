const jwt = require('jsonwebtoken');

function requireSellerAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'נדרשת התחברות כספק — לא נמצא טוקן' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== 'seller') {
      return res.status(403).json({ error: 'הטוקן הזה אינו של חשבון ספק' });
    }
    req.seller = { id: payload.sub, email: payload.email, name: payload.name };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'טוקן לא תקין או שפג תוקפו' });
  }
}

module.exports = { requireSellerAuth };
