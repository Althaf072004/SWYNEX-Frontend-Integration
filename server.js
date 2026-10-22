// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db'); // database connection pool

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const familyRoutes = require('./routes/familyRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000' }));
app.use(express.json({ limit: '10mb' }));

// Test database connection on startup
(async () => {
  try {
    await db.query('SELECT 1');
    console.log('✅ MySQL connected');
  } catch (err) {
    console.error('❌ MySQL connection error:', err);
    process.exit(1);
  }
})();

// Health endpoint for deployment checks and frontend diagnostics
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ success: true, status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(503).json({ success: false, status: 'error', message: 'Database unavailable' });
  }
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/families', familyRoutes);
app.use('/api/transactions', transactionRoutes);

// ✅ 404 handler – NO wildcard pattern
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));