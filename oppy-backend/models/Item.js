const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  vendorId: {
    type: String,
    required: true,
  },
  itemNumber: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: [{
    type: String,
  }],
  location: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  heldBy: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'held'],
    default: 'active',
  },
}, {
  timestamps: true,
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
