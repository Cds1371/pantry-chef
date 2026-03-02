const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getShoppingList,
  addShoppingItem,
  toggleShoppingItem,
  deleteShoppingItem,
  clearCheckedItems,
  generateShoppingList
} = require('../controllers/shoppingController');

router.get('/', authMiddleware, getShoppingList);
router.post('/', authMiddleware, addShoppingItem);
router.put('/:id/toggle', authMiddleware, toggleShoppingItem);
router.delete('/clear', authMiddleware, clearCheckedItems);
router.delete('/:id', authMiddleware, deleteShoppingItem);
router.post('/generate', authMiddleware, generateShoppingList);

module.exports = router;