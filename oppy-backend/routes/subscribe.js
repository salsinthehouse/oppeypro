// File: routes/subscribe.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

console.log('📦 subscribe.js is loaded');

// ✅ Test route to confirm route is active
router.get('/test', (req, res) => {
  console.log('✅ GET /api/subscribe/test was hit!');
  res.json({ message: 'Subscribe test successful!' });
});

// ✅ Real Stripe Checkout route
router.post('/', async (req, res) => {
  console.log('🔔 POST /api/subscribe was hit!');

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/subscribe-success`,
      cancel_url: `${process.env.CLIENT_URL}/subscribe-cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('❌ Stripe session creation failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
