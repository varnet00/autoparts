require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const partsRoutes = require('./routes/parts');
const categoriesRoutes = require('./routes/categories');
const sellersRoutes = require('./routes/sellers');
const conversationsRoutes = require('./routes/conversations');
const statsRoutes = require('./routes/stats');

// בלי סוד ל-JWT השרת עולה אבל כל ההתחברות נשברת רק בזמן ריצה —
// עדיף ליפול מיד עם הסבר ברור.
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET חסר. העתק את .env.example ל-.env והגדר סוד ארוך ואקראי.');
  process.exit(1);
}

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'autoparts-backend' });
});

// --- פרונטאנד: אפליקציה אחת עם ניווט תחתון ---
const ROOT = path.join(__dirname, '..', '..');
const STOREFRONT = path.join(ROOT, 'index.html');

// מניפסט ואייקונים — כדי ש"הוסף למסך הבית" ייתן אפליקציה במסך מלא.
// רק public/ נחשף; שאר התיקייה (קוד השרת, .git) לא.
app.use(express.static(path.join(ROOT, 'public'), { maxAge: '1h' }));

app.get('/', (req, res) => res.sendFile(STOREFRONT));
app.get('/app.js', (req, res) => res.sendFile(path.join(ROOT, 'app.js')));
// הקבינט הפך למסך בתוך האפליקציה — הקישור הישן ממשיך לעבוד
app.get('/cabinet.html', (req, res) => res.redirect(302, '/'));

app.use('/api/auth', authRoutes);
app.use('/api/parts', partsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/sellers', sellersRoutes);
app.use('/api/conversations', conversationsRoutes);
app.use('/api/stats', statsRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'הנתיב לא נמצא' });
});

// Error handler
app.use((err, req, res, next) => {
  // JSON פגום זו שגיאה של הלקוח, לא של השרת — 400 ולא 500.
  if (err && (err.type === 'entity.parse.failed' || (err instanceof SyntaxError && 'body' in err))) {
    return res.status(400).json({ error: 'גוף הבקשה אינו JSON תקין' });
  }
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'גוף הבקשה גדול מדי' });
  }
  console.error(err);
  return res.status(500).json({ error: 'שגיאת שרת פנימית' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 autoparts API רץ על http://localhost:${PORT}`);
});
