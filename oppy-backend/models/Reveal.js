const mongoose = require('mongoose');

const revealSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  revealedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reveal', revealSchema);
