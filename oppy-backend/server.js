// File: server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logger for debugging
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const vendorRoutes = require('./routes/vendor');
const adminRoutes = require('./routes/admin');
const itemRoutes = require('./routes/item');

app.use('/api/auth', authRoutes);
console.log('✅ Auth routes mounted at /api/auth');

app.use('/api/vendor', vendorRoutes);
console.log('✅ Vendor routes mounted at /api/vendor');

app.use('/api/admin', adminRoutes);
console.log('✅ Admin routes mounted at /api/admin');

app.use('/api/items', itemRoutes);
console.log('✅ Public item routes mounted at /api/items');

const cartRoutes = require('./routes/cart');
app.use('/api/cart', cartRoutes);
console.log('✅ Cart routes mounted at /api/cart');

// Webhook must be raw body BEFORE express.json()
const webhookRoutes = require('./routes/webhook');
app.use('/webhook', webhookRoutes);

// Connect to MongoDB, then start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
