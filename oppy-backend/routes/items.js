// File: backend/routes/items.js

const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// ✅ GET all items (for customers)
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('Error fetching all items:', err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// ✅ GET vendor-specific items
router.get('/vendor/:vendorId', async (req, res) => {
  try {
    const items = await Item.find({ vendorId: req.params.vendorId });
    res.json(items);
  } catch (err) {
    console.error('Error fetching vendor items:', err);
    res.status(500).json({ error: 'Failed to fetch vendor items' });
  }
});

// ✅ Create a new item
router.post('/', async (req, res) => {
  try {
    const { vendorId, name, description, price, images, location } = req.body;

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
    console.error('Create item error:', err);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// ✅ Edit existing item
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (err) {
    console.error('Edit item error:', err);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// ✅ DELETE an item
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Delete item error:', err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;
