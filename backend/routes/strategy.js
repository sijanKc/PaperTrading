const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  runBacktest,
  getUserStrategies,
  saveStrategy
} = require('../controllers/strategyController');

// @route   POST /api/strategy/backtest
// @desc    Run strategy backtest
// @access  Private
router.post('/backtest', auth, runBacktest);

// @route   GET /api/strategy/user
// @desc    Get user's saved strategies
// @access  Private
router.get('/user', auth, getUserStrategies);

// @route   POST /api/strategy/save
// @desc    Save trading strategy
// @access  Private
router.post('/save', auth, saveStrategy);

module.exports = router;