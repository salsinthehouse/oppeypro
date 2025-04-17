const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { getAllItems, revealItem, getRevealStatus } = require('../controllers/itemController');

// ✅ Get all items
router.get('/', getAllItems);

// ✅ Reveal usage status — must go BEFORE dynamic routes
router.get('/reveal/status', verifyToken(['customers']), getRevealStatus);

// ✅ Reveal a specific item
router.post('/:id/reveal', verifyToken(['customers']), revealItem);

module.exports = router;
