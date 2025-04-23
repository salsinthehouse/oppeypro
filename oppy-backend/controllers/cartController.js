const CartItem = require('../models/CartItem');
const Item = require('../models/Item');
const Notification = require('../models/Notification'); // ✅ Added for notifications

// ✅ Hold an item
const holdItem = async (req, res) => {
  const customerId = req.user.sub;
  const { itemId } = req.params;
  const { viewingTime } = req.body;

  try {
    const now = new Date();
    const viewTime = new Date(viewingTime);
    const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    if (isNaN(viewTime.getTime()) || viewTime < now || viewTime > twentyFourHoursLater) {
      return res.status(400).json({ message: 'Viewing time must be within the next 24 hours.' });
    }

    // Check if item is already held and not expired
    const existing = await CartItem.findOne({
      itemId,
      expiresAt: { $gt: now }
    });

    if (existing) {
      return res.status(400).json({ message: 'Item is already held by another user.' });
    }

    // Save the hold
    const hold = new CartItem({
      customerId,
      itemId,
      viewingTime: viewTime,
      expiresAt: twentyFourHoursLater
    });
    await hold.save();

    // ✅ Notify the vendor
    const item = await Item.findById(itemId);
    if (item && item.vendorId) {
      const notification = new Notification({
        vendorId: item.vendorId,
        itemId,
        customerId,
        message: `A customer has held your item: "${item.name}"`
      });
      await notification.save();
    }

    res.status(201).json({ message: 'Item successfully held.', viewingTime: viewTime });
  } catch (err) {
    console.error('Hold error:', err.message);
    res.status(500).json({ message: 'Failed to hold item.' });
  }
};

// ✅ View active held items in cart (raw item objects only)
const getCart = async (req, res) => {
  const customerId = req.user.sub;

  try {
    const now = new Date();
    const cartItems = await CartItem.find({
      customerId,
      expiresAt: { $gt: now }
    }).populate('itemId');

    res.json(cartItems.map(c => c.itemId)); // return only the item details
  } catch (err) {
    console.error('Fetch cart error:', err.message);
    res.status(500).json({ message: 'Failed to load cart.' });
  }
};

// ✅ Get held items with full hold details (for "My Holds" page)
const getHeldItems = async (req, res) => {
  const customerId = req.user.sub;

  try {
    const now = new Date();
    const heldItems = await CartItem.find({
      customerId,
      expiresAt: { $gt: now }
    }).populate('itemId');

    res.status(200).json(heldItems); // includes expiresAt, viewingTime, and full itemId details
  } catch (err) {
    console.error('Fetch held items error:', err.message);
    res.status(500).json({ message: 'Failed to load held items.' });
  }
};

// ✅ Release a held item
const releaseItem = async (req, res) => {
  const customerId = req.user.sub;
  const { itemId } = req.params;

  try {
    const result = await CartItem.findOneAndDelete({ customerId, itemId });

    if (!result) {
      return res.status(404).json({ message: 'Item not found in your cart.' });
    }

    res.json({ message: 'Item successfully released.' });
  } catch (err) {
    console.error('Release error:', err.message);
    res.status(500).json({ message: 'Failed to release item.' });
  }
};

module.exports = {
  holdItem,
  getCart,
  getHeldItems,
  releaseItem
};
