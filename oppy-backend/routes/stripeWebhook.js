// File: routes/stripeWebhook.js

const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const Subscription = require('../models/Subscription');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Required for raw body parsing
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('❌ Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('📩 Stripe webhook received:', event.type);

  // ✅ Handle the checkout completion event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const subscription = new Subscription({
      customerId: session.customer,
      email: session.customer_email,
      plan: session.metadata.plan || 'default',
      stripeSubscriptionId: session.subscription,
      startDate: new Date(),
    });

    await subscription.save();
    console.log('✅ Subscription recorded for:', session.customer_email);
  }

  res.status(200).send('Received');
});

module.exports = router;
