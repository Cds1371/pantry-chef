const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getSuggestedRecipes,
  getRecipeDetails,
  saveRecipe,
  getSavedRecipes,
  deleteSavedRecipe,
  searchRecipes,
  getVegetarianRecipes
} = require('../controllers/recipeController');

router.get('/suggestions', authMiddleware, getSuggestedRecipes);
router.get('/saved/all', authMiddleware, getSavedRecipes);
router.get('/search', authMiddleware, searchRecipes);
router.get('/vegetarian', authMiddleware, getVegetarianRecipes);
router.post('/save', authMiddleware, saveRecipe);
router.delete('/saved/:id', authMiddleware, deleteSavedRecipe);
router.get('/:id', authMiddleware, getRecipeDetails);

module.exports = router;