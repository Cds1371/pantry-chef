const pool = require('../db');
const axios = require('axios');

const getProfile = async (req, res) => {
  try {
    // Get user info
    const user = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    // Get stats
    const pantryCount = await pool.query(
      'SELECT COUNT(*) FROM pantry_items WHERE user_id = $1',
      [req.user.id]
    );
    const savedCount = await pool.query(
      'SELECT COUNT(*) FROM saved_recipes WHERE user_id = $1',
      [req.user.id]
    );
    const journalCount = await pool.query(
      'SELECT COUNT(*) FROM recipe_journal WHERE user_id = $1',
      [req.user.id]
    );

    // Get recent journal entries
    const recentJournal = await pool.query(
      'SELECT * FROM recipe_journal WHERE user_id = $1 ORDER BY cooked_on DESC LIMIT 5',
      [req.user.id]
    );

    // Get recent saved recipes
    const recentSaved = await pool.query(
      'SELECT * FROM saved_recipes WHERE user_id = $1 ORDER BY saved_at DESC LIMIT 5',
      [req.user.id]
    );

    res.json({
      user: user.rows[0],
      stats: {
        pantryCount: parseInt(pantryCount.rows[0].count),
        savedCount: parseInt(savedCount.rows[0].count),
        journalCount: parseInt(journalCount.rows[0].count),
      },
      recentJournal: recentJournal.rows,
      recentSaved: recentSaved.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPersonalizedRecipes = async (req, res) => {
  try {
    // Get ingredients from journal entries and saved recipes to build preferences
    const journalTitles = await pool.query(
      'SELECT recipe_title FROM recipe_journal WHERE user_id = $1 ORDER BY cooked_on DESC LIMIT 10',
      [req.user.id]
    );

    const pantryItems = await pool.query(
      'SELECT ingredient_name FROM pantry_items WHERE user_id = $1',
      [req.user.id]
    );

    if (pantryItems.rows.length === 0) {
      return res.json([]);
    }

    // Build search query from pantry + journal history
    const ingredients = pantryItems.rows.map(i => i.ingredient_name).join(',');

    // Get recipe suggestions based on pantry
    const response = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
      params: {
        ingredients,
        number: 6,
        ranking: 2,
        ignorePantry: true,
        apiKey: process.env.SPOONACULAR_API_KEY
      }
    });

    // If user has journal history, also search by keywords from past recipes
    let extraRecipes = [];
    if (journalTitles.rows.length > 0) {
      const keyword = journalTitles.rows[0].recipe_title.split(' ')[0];
      const extraResponse = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
        params: {
          query: keyword,
          number: 4,
          addRecipeInformation: true,
          apiKey: process.env.SPOONACULAR_API_KEY
        }
      });
      extraRecipes = extraResponse.data.results;
    }

    res.json({
      pantryBased: response.data,
      historyBased: extraRecipes
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProfile, getPersonalizedRecipes };