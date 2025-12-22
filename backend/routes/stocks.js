const express = require('express');
const router = express.Router();
const {
  getAllStocks,
  getStockBySymbol,
  getStocksBySector,
  searchStocks,
  getTopGainers
} = require('../controllers/stockController');

// @route   GET /api/stocks
// @desc    Get all stocks
// @access  Public
router.get('/', getAllStocks);

// @route   GET /api/stocks/search
// @desc    Search stocks by symbol, name, or sector
// @access  Public
router.get('/search', searchStocks);

// @route   GET /api/stocks/top-gainers
// @desc    Get top 5 gaining stocks
// @access  Public
router.get('/top-gainers', getTopGainers);

// @route   GET /api/stocks/sector/:sector
// @desc    Get stocks by sector
// @access  Public
router.get('/sector/:sector', getStocksBySector);

// @route   GET /api/stocks/:symbol
// @desc    Get single stock by symbol
// @access  Public
router.get('/:symbol', getStockBySymbol);

module.exports = router;