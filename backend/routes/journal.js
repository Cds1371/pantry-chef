const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getJournalEntries, addJournalEntry, deleteJournalEntry } = require('../controllers/journalController');

router.get('/', authMiddleware, getJournalEntries);
router.post('/', authMiddleware, addJournalEntry);
router.delete('/:id', authMiddleware, deleteJournalEntry);

module.exports = router;