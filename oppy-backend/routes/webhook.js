const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const Subscription = require('../models/Subscription');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Stripe requires raw body parsing for webhooks
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('❌ Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('📩 Stripe webhook hit!');
  console.log('🔔 Event type:', event.type);

  // ✅ Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const stripeCustomerId = session.customer;
    const stripeSubscriptionId = session.subscription;
    const customerId = session.metadata?.customerId || 'unknown';

    console.log('✅ Received checkout.session.completed!');
    console.log('📦 Session data:', JSON.stringify(session, null, 2));
    console.log('🧾 customerId:', customerId);
    console.log('💳 stripeCustomerId:', stripeCustomerId);
    console.log('🔄 stripeSubscriptionId:', stripeSubscriptionId);

    try {
      await Subscription.findOneAndUpdate(
        { customerId },
        {
          customerId,
          stripeCustomerId,
          stripeSubscriptionId,
          active: true,
          startedAt: new Date()
        },
        { upsert: true }
      );
      console.log(`✅ Subscription saved to MongoDB for customer: ${customerId}`);
    } catch (dbError) {
      console.error('❌ Failed to save subscription to MongoDB:', dbError.message);
    }
  }

  res.status(200).json({ received: true });
});

module.exports = router;
