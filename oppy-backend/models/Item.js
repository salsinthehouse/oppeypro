// File: models/Item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  vendorId: { type: String, required: true },
  itemNumber: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, default: 0 },
  location: { type: String, default: '' },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', itemSchema);