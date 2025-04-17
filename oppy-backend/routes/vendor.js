const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { createItem, getVendorItems } = require('../controllers/vendorController');

// Vendor dashboard
router.get('/dashboard', verifyToken(['vendors']), (req, res) => {
  const email = req.user.email || req.user.username;
  res.json({ message: `Welcome, vendor ${email}!`, email });
});

// Upload new item (limited to 30)
router.post('/items', verifyToken(['vendors']), createItem);

// Get all items uploaded by vendor
router.get('/items', verifyToken(['vendors']), getVendorItems);

module.exports = router;
