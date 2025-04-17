const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  customerId: { type: String, required: true }, // from Cognito
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  active: { type: Boolean, default: true },
  startedAt: { type: Date, default: Date.now },
  expiresAt: Date
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
