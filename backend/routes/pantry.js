const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getPantryItems, addPantryItem, deletePantryItem } = require('../controllers/pantryController');

router.get('/', authMiddleware, getPantryItems);
router.post('/', authMiddleware, addPantryItem);
router.delete('/:id', authMiddleware, deletePantryItem);

module.exports = router;