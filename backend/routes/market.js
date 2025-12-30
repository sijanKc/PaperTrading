const express = require('express');
const router = express.Router();
const { getAllStocks, getStockData, getChartData } = require('../controllers/marketController');
const { getStockAnalytics } = require('../controllers/stockController');

// GET /api/market/stocks - All stocks
router.get('/stocks', getAllStocks);

// GET /api/market/analytics/:symbol - Technical analysis (DSA)
router.get('/analytics/:symbol', getStockAnalytics);

// GET /api/market/stock/:symbol - Single stock data
router.get('/stock/:symbol', getStockData);

// GET /api/market/chart/:symbol - Chart data for specific stock
router.get('/chart/:symbol', getChartData);

module.exports = router;