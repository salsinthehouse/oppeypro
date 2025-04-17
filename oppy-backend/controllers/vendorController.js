const Item = require('../models/Item');

const createItem = async (req, res) => {
  const vendorId = req.user.sub;
  const { name, description, price, location } = req.body;

  try {
    // Count how many items this vendor has already
    const itemCount = await Item.countDocuments({ vendorId });

    if (itemCount >= 30) {
      return res.status(403).json({ message: 'Limit reached: You can only list 30 items.' });
    }

    // Set itemNumber as next sequential number (1–30)
    const lastItem = await Item.findOne({ vendorId }).sort({ itemNumber: -1 });
    const itemNumber = lastItem ? lastItem.itemNumber + 1 : 1;

    const newItem = new Item({
      vendorId,
      itemNumber,
      name,
      description,
      price,
      location
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
    const items = await Item.find({ vendorId });
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
