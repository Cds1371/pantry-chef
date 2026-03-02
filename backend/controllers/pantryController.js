const pool = require('../db');

// Get all pantry items for logged in user
const getPantryItems = async (req, res) => {
  try {
    const items = await pool.query(
      'SELECT * FROM pantry_items WHERE user_id = $1 ORDER BY added_at DESC',
      [req.user.id]
    );
    res.json(items.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a pantry item
const addPantryItem = async (req, res) => {
  const { ingredient_name, quantity, unit } = req.body;
  try {
    const newItem = await pool.query(
      'INSERT INTO pantry_items (user_id, ingredient_name, quantity, unit) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, ingredient_name, quantity, unit]
    );
    res.status(201).json(newItem.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a pantry item
const deletePantryItem = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      'DELETE FROM pantry_items WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getPantryItems, addPantryItem, deletePantryItem };