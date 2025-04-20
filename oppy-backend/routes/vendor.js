// File: routes/vendor.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const verifyToken = require('../middleware/verifyToken');
const { createItem, getVendorItems } = require('../controllers/vendorController');
const Item = require('../models/Item');
const Vendor = require('../models/Vendor');

//
// ✅ POST /api/vendors/login
//    Vendor login using email/password, JWT issued
//
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`🛂 Vendor login attempt: ${email}`);

  try {
    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      console.log('❌ Vendor not found');
      return res.status(401).json({ message: 'Vendor not found' });
    }

    const isMatch = await bcrypt.compare(password, vendor.passwordHash);
    if (!isMatch) {
      console.log('❌ Password does not match for', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (vendor.status !== 'approved') {
      console.log('⚠️ Vendor is not approved:', vendor.status);
      return res.status(403).json({ message: 'Your store is pending approval.' });
    }

    const token = jwt.sign(
      {
        sub: vendor._id,
        role: 'vendor',
        email: vendor.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Vendor login successful for', email);
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Vendor login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

//
// ✅ GET /api/vendors/dashboard
//
router.get('/dashboard', verifyToken(['vendors']), (req, res) => {
  const email = req.user.email || req.user.username;
  res.json({ message: `Welcome, vendor ${email}!`, email });
});

//
// ✅ POST /api/vendors/items
//
router.post('/items', verifyToken(['vendors']), async (req, res) => {
  try {
    const vendorId = req.user.sub || req.user.id;

    const itemCount = await Item.countDocuments({ vendorId });
    if (itemCount >= 30) {
      return res.status(403).json({ message: 'Item limit reached (30). Delete an item to add more.' });
    }

    req.vendorId = vendorId;
    return createItem(req, res);
  } catch (err) {
    console.error('Error uploading item:', err);
    return res.status(500).json({ message: 'Error uploading item' });
  }
});

//
// ✅ GET /api/vendors/items
//
router.get('/items', verifyToken(['vendors']), async (req, res) => {
  try {
    const vendorId = req.user.sub || req.user.id;
    req.vendorId = vendorId;
    return getVendorItems(req, res);
  } catch (err) {
    console.error('Error fetching vendor items:', err);
    return res.status(500).json({ message: 'Error fetching items' });
  }
});

module.exports = router;
