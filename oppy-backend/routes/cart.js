const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
  holdItem,
  getCart,
  releaseItem,
  getHeldItems // ✅ New controller for held items
} = require('../controllers/cartController');

// Customer holds an item
router.post('/hold/:itemId', verifyToken(['customers']), holdItem);

// Customer views their cart
router.get('/', verifyToken(['customers']), getCart);

// Customer views their held items (with populated item details)
router.get('/held', verifyToken(['customers']), getHeldItems); // ✅ NEW ROUTE

// Customer releases a held item
router.delete('/release/:itemId', verifyToken(['customers']), releaseItem);

module.exports = router;
