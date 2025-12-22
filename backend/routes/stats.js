const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  getPaperStats,
  getStatsOverview
} = require('../controllers/statsController');

// GET /api/stats/overview - For OverviewCards component
router.get('/overview', auth, getStatsOverview);

// GET /api/stats/paper - For detailed paper trading stats
router.get('/paper', auth, getPaperStats);

module.exports = router;