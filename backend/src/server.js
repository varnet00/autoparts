require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const partsRoutes = require('./routes/parts');
const categoriesRoutes = require('./routes/categories');
const sellersRoutes = require('./routes/sellers');

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

// --- Фронтенд: витрина и кабинет продавца ---
const STOREFRONT = path.join(__dirname, '..', '..', 'index.html');
const CABINET = path.join(__dirname, '..', 'cabinet.html');

app.get('/', (req, res) => res.sendFile(STOREFRONT));
app.get('/cabinet.html', (req, res) => res.sendFile(CABINET));

app.use('/api/auth', authRoutes);
app.use('/api/parts', partsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/sellers', sellersRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'הנתיב לא נמצא' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'שגיאת שרת פנימית' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 autoparts API רץ על http://localhost:${PORT}`);
});
