const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Models
const Stock = require('./models/Stock');
const initialStocks = require('./data/initialStocks');

// Import Price Algorithm
const ProfessionalPriceSimulator = require('./utils/priceAlgorithm');
const priceSimulator = new ProfessionalPriceSimulator();

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Atlas Connected Successfully');

    // Load initial stocks if database is empty
    await loadInitialStocks();
  } catch (error) {
    console.log('❌ MongoDB Connection Failed:', error.message);
  }
};

// Function to load initial stocks
const loadInitialStocks = async () => {
  try {
    const stockCount = await Stock.countDocuments();

    if (stockCount === 0) {
      console.log('📈 Loading initial stocks...');

      for (const stockData of initialStocks) {
        const stock = new Stock({
          ...stockData,
          currentPrice: stockData.basePrice,
          previousClose: stockData.basePrice,
          dayHigh: stockData.basePrice,
          dayLow: stockData.basePrice
        });
        await stock.save();
      }

      console.log(`✅ ${initialStocks.length} stocks loaded successfully!`);
    } else {
      console.log(`✅ ${stockCount} stocks already in database`);
    }
  } catch (error) {
    console.log('❌ Error loading stocks:', error.message);
  }
};

connectDB();

// ==================== ROUTES ====================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stocks', require('./routes/stocks'));
app.use('/api/trade', require('./routes/trade'));

// 🆕 NEW ROUTES FOR FRONTEND COMPONENTS
app.use('/api/portfolio', require('./routes/portfolio')); // For OverviewCards & PortfolioPreview
app.use('/api/market', require('./routes/market'));       // For MarketList & ChartWidget
app.use('/api/analytics', require('./routes/analytics')); // For Analytics page

// 🆕 NEW ROUTES FOR ADDITIONAL COMPONENTS
app.use('/api/leaderboard', require('./routes/leaderboard')); // For Leaderboard
app.use('/api/strategy', require('./routes/strategy'));       // For StrategyTester
app.use('/api/journal', require('./routes/journal'));         // For TradingJournal
app.use('/api/stats', require('./routes/stats'));             // For PaperTradingStats 🆕 ADDED
app.use('/api/admin', require('./routes/admin'));             // For Admin Dashboard 🆕 ADDED

// ==================== BASIC ROUTES ====================
// Basic Route
app.get('/', (req, res) => {
  res.json({
    message: 'Paper Trading Backend is Running! 🚀',
    status: 'Active',
    version: '2.0',
    features: [
      'User Authentication',
      'Real-time Stock Trading',
      'Portfolio Management',
      'Live Market Data',
      'Chart Data API',
      'Advanced Analytics',
      'Trading Leaderboard',
      'Strategy Testing',
      'Trading Journal',
      'Paper Trading Statistics'
    ]
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    uptime: process.uptime(),
    routes: [
      'Authentication: /api/auth',
      'Stocks: /api/stocks',
      'Trading: /api/trade',
      'Portfolio: /api/portfolio',
      'Market: /api/market',
      'Analytics: /api/analytics',
      'Leaderboard: /api/leaderboard',
      'Strategy: /api/strategy',
      'Journal: /api/journal',
      'Stats: /api/stats'
    ]
  });
});

// Market Stats Endpoint
app.get('/api/market/stats', async (req, res) => {
  try {
    const stats = await priceSimulator.getMarketStats();
    res.json({ success: true, ...stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching market stats' });
  }
});

// API Documentation
app.get('/api/docs', (req, res) => {
  res.json({
    message: "📚 Paper Trading API Documentation",
    version: "2.0",
    endpoints: {
      auth: {
        "POST /api/auth/register": "Register new user",
        "POST /api/auth/login": "Login user"
      },
      market: {
        "GET /api/market/stocks": "Get all stocks for MarketList",
        "GET /api/market/chart/:symbol": "Get chart data for ChartWidget",
        "GET /api/market/stats": "Get market statistics"
      },
      portfolio: {
        "GET /api/portfolio/overview": "Get portfolio overview for OverviewCards",
        "GET /api/portfolio/holdings": "Get portfolio holdings for PortfolioPreview",
        "GET /api/portfolio/summary": "Get portfolio summary for dashboard"
      },
      trade: {
        "POST /api/trade/buy": "Buy stocks",
        "POST /api/trade/sell": "Sell stocks",
        "GET /api/trade/portfolio": "Get user portfolio",
        "GET /api/trade/transactions": "Get transaction history"
      },
      analytics: {
        "GET /api/analytics/overview": "Get portfolio analytics overview",
        "GET /api/analytics/performance": "Get performance data and metrics",
        "GET /api/analytics/risk": "Get risk analysis metrics",
        "GET /api/analytics/allocation": "Get portfolio allocation analysis",
        "GET /api/analytics/insights": "Get AI-powered portfolio insights"
      },
      leaderboard: {
        "GET /api/leaderboard": "Get trading leaderboard",
        "GET /api/leaderboard/stats": "Get community statistics"
      },
      strategy: {
        "POST /api/strategy/backtest": "Run strategy backtest",
        "GET /api/strategy/user": "Get user's saved strategies",
        "POST /api/strategy/save": "Save trading strategy"
      },
      journal: {
        "GET /api/journal/entries": "Get trading journal entries",
        "POST /api/journal/entries": "Add journal entry",
        "GET /api/journal/analytics": "Get journal analytics"
      },
      stats: {
        "GET /api/stats/overview": "Get paper trading statistics for OverviewCards",
        "GET /api/stats/paper": "Get detailed paper trading statistics"
      }
    }
  });
});

// ==================== ERROR HANDLING ====================
// 404 Handler - COMPREHENSIVE VERSION
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'GET /api/docs',
      'GET /api/market/stats',

      // Auth Routes
      'POST /api/auth/register',
      'POST /api/auth/login',

      // Portfolio Routes
      'GET /api/portfolio/overview',
      'GET /api/portfolio/holdings',
      'GET /api/portfolio/summary',

      // Market Routes
      'GET /api/market/stocks',
      'GET /api/market/chart/:symbol',

      // Stocks Routes
      'GET /api/stocks',
      'GET /api/stocks/search',
      'GET /api/stocks/top-gainers',
      'GET /api/stocks/sector/:sector',
      'GET /api/stocks/:symbol',

      // Trade Routes
      'POST /api/trade/buy',
      'POST /api/trade/sell',
      'GET /api/trade/portfolio',
      'GET /api/trade/transactions',

      // Analytics Routes
      'GET /api/analytics/overview',
      'GET /api/analytics/performance',
      'GET /api/analytics/risk',
      'GET /api/analytics/allocation',
      'GET /api/analytics/insights',

      // Leaderboard Routes
      'GET /api/leaderboard',
      'GET /api/leaderboard/stats',

      // Strategy Routes
      'POST /api/strategy/backtest',
      'GET /api/strategy/user',
      'POST /api/strategy/save',

      // Journal Routes
      'GET /api/journal/entries',
      'POST /api/journal/entries',
      'GET /api/journal/analytics',

      // Stats Routes
      'GET /api/stats/overview',
      'GET /api/stats/paper'
    ],
    documentation: 'Visit GET /api/docs for complete API documentation'
  });
});

// Global Error Handler
app.use((error, req, res, next) => {
  console.error('🚨 Server Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// ==================== SERVER START ====================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🎯 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📈 Analytics API: http://localhost:${PORT}/api/analytics`);
  console.log(`🏆 Leaderboard API: http://localhost:${PORT}/api/leaderboard`);
  console.log(`🔬 Strategy API: http://localhost:${PORT}/api/strategy`);
  console.log(`📓 Journal API: http://localhost:${PORT}/api/journal`);
  console.log(`📊 Stats API: http://localhost:${PORT}/api/stats`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api/docs`);
});

// ==================== PRICE UPDATE SCHEDULER ====================
const UPDATE_INTERVAL = 2 * 60 * 1000; // 2 minutes in milliseconds

console.log(`⏰ Starting price updates every ${UPDATE_INTERVAL / 1000 / 60} minutes...`);

// Initial update after 10 seconds
setTimeout(() => {
  console.log('🔄 Performing initial price update...');
  priceSimulator.updateAllPrices();
}, 10000);

// Regular updates every 2 minutes
const priceUpdateInterval = setInterval(() => {
  console.log('🔄 Scheduled price update running...');
  priceSimulator.updateAllPrices();
}, UPDATE_INTERVAL);

// ==================== GRACEFUL SHUTDOWN ====================
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  clearInterval(priceUpdateInterval);
  server.close(() => {
    console.log('✅ Server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  clearInterval(priceUpdateInterval);
  server.close(() => {
    console.log('✅ Server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;