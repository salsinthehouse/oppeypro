const Item = require('../models/Item');

const createItem = async (req, res) => {
  const vendorId = req.user.sub;
  const { name, description, price, location, images = [] } = req.body;

  try {
    // Enforce 30-item limit
    const existingItems = await Item.find({ vendorId }).sort({ itemNumber: 1 });

    if (existingItems.length >= 30) {
      return res.status(403).json({ message: 'Limit reached: You can only list 30 items.' });
    }

    // Determine the next available itemNumber (1–30, fill gaps)
    const usedNumbers = new Set(existingItems.map(item => item.itemNumber));
    let itemNumber = 1;
    while (usedNumbers.has(itemNumber) && itemNumber <= 30) {
      itemNumber++;
    }

    const newItem = new Item({
      vendorId,
      itemNumber,
      name,
      description,
      price,
      location,
      images // this should be an array of image URLs
    });

    await newItem.save();

    res.status(201).json({ message: 'Item listed successfully.', item: newItem });
  } catch (err) {
    console.error('❌ Error listing item:', err.message);
    res.status(500).json({ message: 'Failed to list item.' });
  }
};

const getVendorItems = async (req, res) => {
  const vendorId = req.user.sub;

  try {
    const items = await Item.find({ vendorId }).sort({ itemNumber: 1 });
    res.json(items);
  } catch (err) {
    console.error('❌ Failed to load vendor items:', err.message);
    res.status(500).json({ message: 'Failed to load items.' });
  }
};

module.exports = {
  createItem,
  getVendorItems
};
