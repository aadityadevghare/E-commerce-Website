const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const db = require('./database/db');
const seedDatabase = require('./database/seed');

const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const wishlistRoutes = require('./routes/wishlist');
const couponsRoutes = require('./routes/coupons');
const futuristicRoutes = require('./routes/futuristic');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve Static Frontend Files
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/futuristic', futuristicRoutes);

// Fallback to 404 page for unmatched non-API html routes
app.use((req, res, next) => {
  if (req.accepts('html') && !req.path.startsWith('/api/')) {
    return res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
  }
  next();
});

// Centralized Error Handler
app.use(errorHandler);

// Start Server and Seed DB
async function startServer() {
  await seedDatabase();
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 AURA 2050 Futuristic E-Commerce Server running on http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = app;
