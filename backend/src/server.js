require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const partsRoutes = require('./routes/parts');
const categoriesRoutes = require('./routes/categories');
const sellersRoutes = require('./routes/sellers');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'turbo-chalakim-backend' });
});

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
  console.log(`🚀 Turbo Chalakim API רץ על http://localhost:${PORT}`);
});
