const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Public route to get all items
router.get('/all', async (req, res) => {
  try {
    const items = await Item.find({}).sort({ itemNumber: 1 });
    res.json(items);
  } catch (err) {
    console.error('❌ Failed to load items:', err.message);
    res.status(500).json({ message: 'Failed to load items.' });
  }
});

module.exports = router; 