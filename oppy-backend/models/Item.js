const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Get all items for a specific vendor
router.get('/vendor/:vendorId', async (req, res) => {
  try {
    const items = await Item.find({ vendorId: req.params.vendorId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vendor items' });
  }
});

// Create a new item
router.post('/', async (req, res) => {
  try {
    const {
      vendorId,
      name,
      description,
      price,
      images,
      location
    } = req.body;

    // Count items to assign a number
    const itemCount = await Item.countDocuments({ vendorId });
    if (itemCount >= 30) {
      return res.status(400).json({ error: 'Maximum item limit reached (30)' });
    }

    const newItem = new Item({
      vendorId,
      itemNumber: itemCount + 1,
      name,
      description,
      price,
      images,
      location
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

module.exports = router;
