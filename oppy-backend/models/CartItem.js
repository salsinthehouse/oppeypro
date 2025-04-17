const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  viewingTime: { type: Date, required: true },
  heldAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

// Automatically remove expired holds
cartItemSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('CartItem', cartItemSchema);
