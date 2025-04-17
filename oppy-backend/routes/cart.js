// File: routes/cart.js

const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
  holdItem,
  getCart,
  releaseItem
} = require('../controllers/cartController');

// Customer holds an item
router.post('/hold/:itemId', verifyToken(['customers']), holdItem);

// Customer views their held items
router.get('/', verifyToken(['customers']), getCart);

// Customer releases a held item
router.delete('/release/:itemId', verifyToken(['customers']), releaseItem);

module.exports = router;
