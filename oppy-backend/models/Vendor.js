const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  cognitoId: { type: String, required: true, unique: true },
  approvedAt: { type: Date, default: Date.now },
  status: { type: String, default: 'approved' }
});

module.exports = mongoose.model('Vendor', vendorSchema);
