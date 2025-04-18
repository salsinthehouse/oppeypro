// File: server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// ✅ Stripe webhook route (must be added BEFORE express.json)
const stripeWebhook = require('./routes/stripeWebhook');
app.use('/webhook', stripeWebhook); // Use only this for webhooks

// ✅ Middleware
app.use(cors());
app.use(express.json()); // JSON parser AFTER webhook

// ✅ Logger
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ API Routes
app.use('/api/auth', require('./routes/auth'));
console.log('✅ Auth routes mounted at /api/auth');

app.use('/api/vendor', require('./routes/vendor'));
console.log('✅ Vendor routes mounted at /api/vendor');

app.use('/api/admin', require('./routes/admin'));
console.log('✅ Admin routes mounted at /api/admin');

app.use('/api/items', require('./routes/item'));
console.log('✅ Public item routes mounted at /api/items');

app.use('/api/cart', require('./routes/cart'));
console.log('✅ Cart routes mounted at /api/cart');

// ✅ Subscription route with error handling
try {
  app.use('/api/subscribe', require('./routes/subscribe'));
  console.log('✅ Subscription route mounted at /api/subscribe');
} catch (err) {
  console.error('❌ Failed to mount /api/subscribe:', err.message);
}

// ✅ Optional Stripe test route
app.get('/api/test-stripe', async (req, res) => {
  try {
    const balance = await stripe.balance.retrieve();
    res.json({ balance });
  } catch (err) {
    console.error('❌ Stripe test failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🔎 Debug: Check DB connection status
console.log('🔎 DB Status:', mongoose.connection.readyState);

// ✅ Start server after DB connects
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
