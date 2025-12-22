const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getNewsFeed, getNewsDetails } = require('../controllers/newsController');

// @route   GET /api/news
// @desc    Get news feed with filters
// @access  Private
router.get('/', auth, getNewsFeed);

// @route   GET /api/news/:id
// @desc    Get specific news article details
// @access  Private
router.get('/:id', auth, getNewsDetails);

module.exports = router;