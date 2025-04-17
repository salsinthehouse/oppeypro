// File: controllers/itemController.js
const Item = require('../models/Item');
const CartItem = require('../models/CartItem');
const Reveal = require('../models/Reveal');
const { isSubscribed } = require('../utils/subscriptionUtils');

const getAllItems = async (req, res) => {
  try {
    const items = await Item.find({ active: true }).lean();

    const heldItems = await CartItem.find({
      expiresAt: { $gt: new Date() }
    }).select('itemId');
    const heldIds = heldItems.map(c => c.itemId.toString());

    let revealedMap = {};
    const customerId = req.user?.sub;
    if (customerId) {
      const reveals = await Reveal.find({ customerId }).select('itemId');
      revealedMap = Object.fromEntries(reveals.map(r => [r.itemId.toString(), true]));
    }

    const itemsWithStatus = items.map(item => ({
      ...item,
      isHeld: heldIds.includes(item._id.toString()),
      location: revealedMap[item._id.toString()] ? item.location : null
    }));

    res.status(200).json(itemsWithStatus);
  } catch (err) {
    console.error('❌ Error fetching items:', err.message);
    res.status(500).json({ message: 'Failed to fetch items.', error: err.message });
  }
};

const revealItem = async (req, res) => {
  const customerId = req.user.sub;
  const { id: itemId } = req.params;

  try {
    const alreadyRevealed = await Reveal.findOne({ customerId, itemId });
    if (alreadyRevealed) {
      return res.status(200).json({ message: 'Location already revealed.' });
    }

    const subscribed = await isSubscribed(customerId);

    if (!subscribed) {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const revealCount = await Reveal.countDocuments({
        customerId,
        revealedAt: { $gte: startOfToday }
      });

      if (revealCount >= 1) {
        return res.status(403).json({
          message: 'Free reveal limit reached. Please subscribe to reveal more.'
        });
      }
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    await new Reveal({ customerId, itemId }).save();

    res.status(200).json({ message: 'Item location revealed.', location: item.location });
  } catch (err) {
    console.error('❌ Reveal error:', err.message);
    res.status(500).json({ message: 'Failed to reveal item.' });
  }
};

const getRevealStatus = async (req, res) => {
  const customerId = req.user.sub;

  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const revealCount = await Reveal.countDocuments({
      customerId,
      revealedAt: { $gte: startOfToday }
    });

    const remaining = Math.max(0, 1 - revealCount);
    const resetTime = new Date();
    resetTime.setHours(24, 0, 0, 0);

    res.json({
      revealsUsedToday: revealCount,
      revealsRemaining: remaining,
      resetAt: resetTime.toISOString()
    });
  } catch (err) {
    console.error('❌ Reveal status error:', err.message);
    res.status(500).json({ message: 'Failed to fetch reveal status.' });
  }
};

module.exports = { getAllItems, revealItem, getRevealStatus };
