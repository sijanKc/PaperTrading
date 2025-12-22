const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  getPortfolioOverview, 
  getPortfolioHoldings,
  getPortfolioSummary
} = require('../controllers/portfolioController');

// GET /api/portfolio/overview - For OverviewCards component
router.get('/overview', auth, getPortfolioOverview);

// GET /api/portfolio/holdings - For PortfolioPreview component  
router.get('/holdings', auth, getPortfolioHoldings);

// GET /api/portfolio/summary - For dashboard summary cards
router.get('/summary', auth, getPortfolioSummary);

module.exports = router;