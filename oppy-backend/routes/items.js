// File: backend/routes/items.js

const express = require('express');
const router = express.Router();
const verifyVendorAccess = require('../middleware/storeAuth');
const Item = require('../models/Item');
const { getVendorItems } = require('../controllers/vendorController');

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

// Apply vendor authentication middleware to protected routes
router.use(verifyVendorAccess);

// Create a new item
router.post('/', async (req, res) => {
  try {
    const item = new Item({
      vendorId: req.vendorId,
      ...req.body
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Get all items for the vendor
router.get('/', async (req, res) => {
  try {
    const items = await Item.find({ vendorId: req.vendorId });
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Get items by status
router.get('/status/:status', async (req, res) => {
  try {
    const items = await Item.find({ 
      vendorId: req.vendorId,
      status: req.params.status 
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching items by status:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Get items by location
router.get('/location/:location', async (req, res) => {
  try {
    const items = await Item.find({ 
      vendorId: req.vendorId,
      location: req.params.location 
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching items by location:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Update an item
router.put('/:itemId', async (req, res) => {
  try {
    const updatedItem = await Item.findOneAndUpdate(
      { _id: req.params.itemId, vendorId: req.vendorId },
      { $set: req.body },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found or unauthorized' });
    }
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete an item
router.delete('/:itemId', async (req, res) => {
  try {
    const result = await Item.findOneAndDelete({ 
      _id: req.params.itemId, 
      vendorId: req.vendorId 
    });
    if (!result) {
      return res.status(404).json({ error: 'Item not found or unauthorized' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;
