const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const Subscription = require('../models/Subscription');
const Customer = require('../models/Customer'); // ✅ Add this

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Stripe requires raw body parsing for webhooks
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('❌ Stripe webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('📩 Stripe webhook received:', event.type);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const newSub = new Subscription({
      customerId: session.customer,
      email: session.customer_email,
      userId: session.metadata?.userId,
      plan: session.metadata?.tier || 'default',
      stripeSubscriptionId: session.subscription,
      sessionId: session.id,
      createdAt: new Date(),
    });

    try {
      await newSub.save();
      console.log(`✅ Subscription saved for: ${session.customer_email}`);

      // ✅ Mark customer as active
      if (session.metadata?.userId) {
        await Customer.findOneAndUpdate(
          { cognitoId: session.metadata.userId },
          {
            subscriptionActive: true,
            subscriptionTier: session.metadata.tier || 'default',
            stripeCustomerId: session.customer,
          },
          { upsert: true }
        );
        console.log(`✅ Customer ${session.metadata.userId} marked as subscribed`);
      }
    } catch (err) {
      console.error('❌ Failed to save subscription or update customer:', err.message);
      return res.status(500).send('DB error');
    }
  }

  res.status(200).send('Received');
});

module.exports = router;
