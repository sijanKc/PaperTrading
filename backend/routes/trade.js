const express = require('express');
const router = express.Router();
const {
  buyStock,
  sellStock,
  getPortfolio,
  getTransactionHistory
} = require('../controllers/tradeController');

// Import auth middleware
const auth = require('../middleware/auth');

// @route   POST /api/trade/buy
// @desc    Buy stocks
// @access  Private
router.post('/buy', auth, buyStock);

// @route   POST /api/trade/sell
// @desc    Sell stocks
// @access  Private
router.post('/sell', auth, sellStock);

// @route   GET /api/trade/portfolio
// @desc    Get user portfolio
// @access  Private
router.get('/portfolio', auth, getPortfolio);

// @route   GET /api/trade/transactions
// @desc    Get user transaction history
// @access  Private
router.get('/transactions', auth, getTransactionHistory);

module.exports = router;