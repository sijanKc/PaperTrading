const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getJournalEntries,
  addJournalEntry,
  getJournalAnalytics
} = require('../controllers/journalController');

// @route   GET /api/journal/entries
// @desc    Get trading journal entries
// @access  Private
router.get('/entries', auth, getJournalEntries);

// @route   POST /api/journal/entries
// @desc    Add journal entry
// @access  Private
router.post('/entries', auth, addJournalEntry);

// @route   GET /api/journal/analytics
// @desc    Get journal analytics
// @access  Private
router.get('/analytics', auth, getJournalAnalytics);

// @route   PUT /api/journal/entries/:id
// @desc    Update journal entry
// @access  Private
router.put('/entries/:id', auth, require('../controllers/journalController').updateJournalEntry);

// @route   DELETE /api/journal/entries/:id
// @desc    Delete journal entry
// @access  Private
router.delete('/entries/:id', auth, require('../controllers/journalController').deleteJournalEntry);

module.exports = router;