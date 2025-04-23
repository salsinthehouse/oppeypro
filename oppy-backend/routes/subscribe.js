// File: routes/subscribe.js

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const verifyToken = require('../middleware/verifyToken');

console.log('📦 subscribe.js is loaded');

// ✅ Test route
router.get('/test', (req, res) => {
  console.log('✅ GET /api/subscribe/test was hit!');
  res.json({ message: 'Subscribe test successful!' });
});

// ✅ Main route for creating Stripe Checkout session
router.post('/', verifyToken(['customer']), async (req, res) => {
  console.log('🔔 POST /api/subscribe was hit!');
  const { tier } = req.body;

  const priceIds = {
    1: process.env.STRIPE_PRICE_ID_TIER1,
    2: process.env.STRIPE_PRICE_ID_TIER2,
    3: process.env.STRIPE_PRICE_ID_TIER3,
  };

  const selectedPrice = priceIds[tier];
  const userId = req.user.sub;
  const email = req.user.email;

  if (!selectedPrice) {
    return res.status(400).json({ error: 'Invalid subscription tier selected.' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: selectedPrice,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/customer-dashboard?sub_success=true`,
      cancel_url: `${process.env.CLIENT_URL}/customer-dashboard?sub_cancel=true`,
      metadata: {
        userId,
        tier,
      },
    });

    console.log('✅ Stripe session created:', session.id);
    res.json({ url: session.url });
  } catch (err) {
    console.error('❌ Stripe session creation failed:', err.message);
    res.status(500).json({ error: 'Could not create checkout session' });
  }
});

module.exports = router;
