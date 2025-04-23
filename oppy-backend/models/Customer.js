const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  cognitoId: { type: String, required: true, unique: true },
  subscriptionActive: { type: Boolean, default: false },
  subscriptionTier: String,
  stripeCustomerId: String,
});

module.exports = mongoose.model('Customer', customerSchema);
