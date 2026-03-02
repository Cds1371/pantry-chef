const pool = require('../db');

// Get all journal entries for logged in user
const getJournalEntries = async (req, res) => {
  try {
    const entries = await pool.query(
      'SELECT * FROM recipe_journal WHERE user_id = $1 ORDER BY cooked_on DESC',
      [req.user.id]
    );
    res.json(entries.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a journal entry
const addJournalEntry = async (req, res) => {
  const { recipe_id, recipe_title, cooked_on, rating, notes } = req.body;
  try {
    const entry = await pool.query(
      'INSERT INTO recipe_journal (user_id, recipe_id, recipe_title, cooked_on, rating, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.user.id, recipe_id, recipe_title, cooked_on, rating, notes]
    );
    res.status(201).json(entry.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a journal entry
const deleteJournalEntry = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      'DELETE FROM recipe_journal WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    res.json({ message: 'Entry deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getJournalEntries, addJournalEntry, deleteJournalEntry };