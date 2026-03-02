const pool = require('../db');
const axios = require('axios');

// Get all shopping list items
const getShoppingList = async (req, res) => {
  try {
    const items = await pool.query(
      'SELECT * FROM shopping_list WHERE user_id = $1 ORDER BY added_at DESC',
      [req.user.id]
    );
    res.json(items.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add item to shopping list
const addShoppingItem = async (req, res) => {
  const { ingredient_name, amount, unit } = req.body;
  try {
    const item = await pool.query(
      'INSERT INTO shopping_list (user_id, ingredient_name, amount, unit) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, ingredient_name, amount, unit]
    );
    res.status(201).json(item.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle item checked/unchecked
const toggleShoppingItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await pool.query(
      'UPDATE shopping_list SET is_checked = NOT is_checked WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );
    res.json(item.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete item from shopping list
const deleteShoppingItem = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      'DELETE FROM shopping_list WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Clear all checked items
const clearCheckedItems = async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM shopping_list WHERE user_id = $1 AND is_checked = TRUE',
      [req.user.id]
    );
    res.json({ message: 'Checked items cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Auto generate shopping list from missing recipe ingredients
const generateShoppingList = async (req, res) => {
  try {
    const pantryItems = await pool.query(
      'SELECT ingredient_name FROM pantry_items WHERE user_id = $1',
      [req.user.id]
    );

    if (pantryItems.rows.length === 0) {
      return res.status(400).json({ message: 'Your pantry is empty!' });
    }

    const ingredients = pantryItems.rows.map(item => item.ingredient_name).join(',');

    const response = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
      params: {
        ingredients,
        number: 5,
        ranking: 1,
        ignorePantry: true,
        apiKey: process.env.SPOONACULAR_API_KEY
      }
    });

    // Collect all missing ingredients
    const missingIngredients = [];
    response.data.forEach(recipe => {
      recipe.missedIngredients.forEach(ing => {
        if (!missingIngredients.find(i => i.name === ing.name)) {
          missingIngredients.push({
            ingredient_name: ing.name,
            amount: String(ing.amount),
            unit: ing.unit
          });
        }
      });
    });

    // Add all missing ingredients to shopping list
    for (const item of missingIngredients) {
      await pool.query(
        'INSERT INTO shopping_list (user_id, ingredient_name, amount, unit) VALUES ($1, $2, $3, $4)',
        [req.user.id, item.ingredient_name, item.amount, item.unit]
      );
    }

    res.json({ message: `Added ${missingIngredients.length} items to your shopping list!`, items: missingIngredients });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getShoppingList, addShoppingItem, toggleShoppingItem, deleteShoppingItem, clearCheckedItems, generateShoppingList };