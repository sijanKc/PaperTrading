const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAnalyticsOverview,
  getPerformanceData,
  getRiskMetrics,
  getAllocationAnalysis,
  getAIInsights
} = require('../controllers/analyticsController');
const { getInvestmentRecommendations } = require('../controllers/recommendationController');

// @route   GET /api/analytics/overview
// @desc    Get portfolio analytics overview
// @access  Private
router.get('/overview', auth, getAnalyticsOverview);

// @route   GET /api/analytics/performance
// @desc    Get performance data and metrics
// @access  Private
router.get('/performance', auth, getPerformanceData);

// @route   GET /api/analytics/risk
// @desc    Get risk analysis metrics
// @access  Private
router.get('/risk', auth, getRiskMetrics);

// @route   GET /api/analytics/allocation
// @desc    Get portfolio allocation analysis
// @access  Private
router.get('/allocation', auth, getAllocationAnalysis);

// @route   GET /api/analytics/insights
// @desc    Get AI-powered portfolio insights
// @access  Private
router.get('/insights', auth, getAIInsights);

// @route   GET /api/analytics/recommendations
// @desc    Get optimized investment recommendations (Knapsack DP)
// @access  Private
router.get('/recommendations', auth, getInvestmentRecommendations);

module.exports = router;