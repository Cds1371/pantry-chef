const pool = require('../db');
const axios = require('axios');

// Get recipe suggestions based on pantry items
const getSuggestedRecipes = async (req, res) => {
  try {
    // Get user's pantry items
    const pantryItems = await pool.query(
      'SELECT ingredient_name FROM pantry_items WHERE user_id = $1',
      [req.user.id]
    );

    if (pantryItems.rows.length === 0) {
      return res.status(400).json({ message: 'Your pantry is empty! Add some ingredients first.' });
    }

    // Build ingredients string
    const ingredients = pantryItems.rows.map(item => item.ingredient_name).join(',');

    // Call Spoonacular API
    const response = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
      params: {
        ingredients,
        number: 10,
        ranking: 1,
        ignorePantry: true,
        apiKey: process.env.SPOONACULAR_API_KEY
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get recipe details
const getRecipeDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
      params: {
        apiKey: process.env.SPOONACULAR_API_KEY
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Save a recipe
const saveRecipe = async (req, res) => {
  const { recipe_id, recipe_title, recipe_image } = req.body;
  try {
    const saved = await pool.query(
      'INSERT INTO saved_recipes (user_id, recipe_id, recipe_title, recipe_image) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, recipe_id, recipe_title, recipe_image]
    );
    res.status(201).json(saved.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get saved recipes
const getSavedRecipes = async (req, res) => {
  try {
    const recipes = await pool.query(
      'SELECT * FROM saved_recipes WHERE user_id = $1 ORDER BY saved_at DESC',
      [req.user.id]
    );
    res.json(recipes.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete saved recipe
const deleteSavedRecipe = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      'DELETE FROM saved_recipes WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    res.json({ message: 'Recipe removed from saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search recipes by name
const searchRecipes = async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params: {
        query,
        number: 12,
        addRecipeInformation: true,
        apiKey: process.env.SPOONACULAR_API_KEY
      }
    });
    res.json(response.data.results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getSuggestedRecipes, getRecipeDetails, saveRecipe, getSavedRecipes, deleteSavedRecipe, searchRecipes };