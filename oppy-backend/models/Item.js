// File: models/Item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  vendorId: { type: String, required: true }, // You may change this to ObjectId later for referencing
  itemNumber: { type: Number, required: true }, // 1–30 per vendor
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, default: 0 },
  images: { type: [String], default: [] }, // Array of image URLs
  location: { type: String, default: '' }, // Will remain hidden from customers unless purchased/unlocked
  active: { type: Boolean, default: true },

  // Item held status
  heldBy: { type: String, default: null }, // customerId (optional)
  holdExpiresAt: { type: Date, default: null },

  // Simple analytics
  views: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

// Ensure uniqueness of itemNumber per vendor
itemSchema.index({ vendorId: 1, itemNumber: 1 }, { unique: true });

module.exports = mongoose.model('Item', itemSchema);
