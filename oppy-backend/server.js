// ✅ Core modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const connectDB = require('./db');

// ✅ Create app
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Validate environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY not defined in .env');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.warn('⚠️ JWT_SECRET not defined — vendor login may fail');
}

// ✅ Stripe setup
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// ✅ Stripe webhook (must come BEFORE express.json)
const stripeWebhook = require('./routes/stripeWebhook');
app.use('/webhook', stripeWebhook); // Uses express.raw internally

// ✅ Middleware
app.use(cors({
  origin: ['https://oppy.co.nz', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// ✅ Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Logger
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Mount API routes
try {
  app.use('/api/auth', require('./routes/auth'));
  console.log('✅ Auth routes mounted at /api/auth');

  app.use('/api/vendors', require('./routes/vendors'));
  console.log('✅ Vendor routes mounted at /api/vendors');

  app.use('/api/items', require('./routes/items'));
  console.log('✅ Items routes mounted at /api/items');

  app.use('/api/public/items', require('./routes/publicItems'));
  console.log('✅ Public items routes mounted at /api/public/items');

  app.use('/api/cart', require('./routes/cart'));
  console.log('✅ Cart routes mounted at /api/cart');

  app.use('/api/subscribe', require('./routes/subscribe'));
  console.log('✅ Subscription route mounted at /api/subscribe');

  app.use('/api/upload', require('./routes/upload'));
  console.log('✅ Upload route mounted at /api/upload');
} catch (err) {
  console.error('❌ Failed to mount a route:', err.message);
}

// ✅ Stripe test route
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

// ✅ Start server after DB connection
console.log('🔎 Checking MongoDB connection...');

const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
};

startServer();
