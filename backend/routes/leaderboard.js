const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getLeaderboard, getCommunityStats } = require('../controllers/leaderboardController');

// @route   GET /api/leaderboard
// @desc    Get trading leaderboard
// @access  Private
router.get('/', auth, getLeaderboard);

// @route   GET /api/leaderboard/stats
// @desc    Get community statistics
// @access  Private
router.get('/stats', auth, getCommunityStats);

module.exports = router;