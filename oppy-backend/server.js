// File: server.js

// ✅ Core modules
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');

const app = express();

// ✅ Validate required env variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY not defined in .env');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.warn('⚠️ JWT_SECRET not defined — vendor login will not work');
}

// ✅ Stripe setup
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// ✅ Stripe webhook (must come BEFORE express.json)
const stripeWebhook = require('./routes/stripeWebhook');
app.use('/webhook', stripeWebhook);

// ✅ Core middleware
app.use(cors());
app.use(express.json());

// ✅ Logger
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ API routes
app.use('/api/auth', require('./routes/auth'));
console.log('✅ Auth routes mounted at /api/auth');

app.use('/api/vendors', require('./routes/vendor'));
console.log('✅ Vendor routes mounted at /api/vendors');

app.use('/api/admin', require('./routes/admin'));
console.log('✅ Admin routes mounted at /api/admin');

app.use('/api/items', require('./routes/item'));
console.log('✅ Public item routes mounted at /api/items');

app.use('/api/cart', require('./routes/cart'));
console.log('✅ Cart routes mounted at /api/cart');

try {
  app.use('/api/subscribe', require('./routes/subscribe'));
  console.log('✅ Subscription route mounted at /api/subscribe');
} catch (err) {
  console.error('❌ Failed to mount /api/subscribe:', err.message);
}

// ✅ Stripe test endpoint
app.get('/api/test-stripe', async (req, res) => {
  try {
    const balance = await stripe.balance.retrieve();
    res.json({ balance });
  } catch (err) {
    console.error('❌ Stripe test failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Catch unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
console.log('🔎 DB Status:', mongoose.connection.readyState);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to the database:', err.message);
    process.exit(1);
  }
};

startServer();
