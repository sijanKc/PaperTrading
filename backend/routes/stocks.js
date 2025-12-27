const express = require('express');
const router = express.Router();
// Admin Middleware
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
  getAllStocks,
  getStockBySymbol,
  getStocksBySector,
  searchStocks,
  getTopGainers,
  getAdminStocks,
  createStock,
  updateStock,
  deleteStock
} = require('../controllers/stockController');

// ... Public Routes above ...

// @route   GET /api/stocks/admin/all
// @desc    Get all stocks for admin
// @access  Admin
router.get('/admin/all', authMiddleware, adminMiddleware, getAdminStocks);

// @route   POST /api/stocks
// @desc    Create a new stock
// @access  Admin
router.post('/', authMiddleware, adminMiddleware, createStock);

// @route   PUT /api/stocks/:id
// @desc    Update stock
// @access  Admin
router.put('/:id', authMiddleware, adminMiddleware, updateStock);

// @route   DELETE /api/stocks/:id
// @desc    Delete stock
// @access  Admin
router.delete('/:id', authMiddleware, adminMiddleware, deleteStock);

// Put generic /:symbol route LAST to avoid conflicts with /admin/all
// @route   GET /api/stocks/:symbol
// @desc    Get single stock by symbol
// @access  Public
router.get('/:symbol', getStockBySymbol);

module.exports = router;