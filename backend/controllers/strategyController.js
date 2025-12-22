const Stock = require('../models/Stock');
const Strategy = require('../models/Strategy');
const Transaction = require('../models/Transaction');

// Run Strategy Backtest
const runBacktest = async (req, res) => {
  try {
    const {
      name,
      symbol,
      timeframe,
      startDate,
      endDate,
      initialCapital,
      fastMA,
      slowMA,
      stopLoss,
      takeProfit
    } = req.body;

    // Get historical data for the symbol
    const stock = await Stock.findOne({ symbol });
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found'
      });
    }

    // Simulate backtest (in real app, use actual historical data)
    const backtestResults = await simulateBacktest({
      symbol,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      initialCapital,
      fastMA,
      slowMA,
      stopLoss,
      takeProfit
    });

    res.json({
      success: true,
      data: backtestResults
    });

  } catch (error) {
    console.error('Backtest error:', error);
    res.status(500).json({
      success: false,
      message: 'Error running backtest'
    });
  }
};

// Get User Strategies - REAL DATABASE VERSION
const getUserStrategies = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch strategies from database
    const strategies = await Strategy.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    // Transform to match frontend expectations
    const formattedStrategies = strategies.map(strategy => ({
      id: strategy._id,
      name: strategy.name,
      symbol: strategy.symbol,
      timeframe: strategy.timeframe,
      parameters: strategy.parameters,
      results: {
        winRate: strategy.results?.winRate || 0,
        totalReturn: strategy.results?.totalReturn || 0,
        lastTest: strategy.results?.lastTest || strategy.createdAt
      },
      isActive: strategy.isActive
    }));

    res.json({
      success: true,
      data: formattedStrategies
    });

  } catch (error) {
    console.error('Get strategies error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching strategies'
    });
  }
};

// Save Strategy - REAL DATABASE VERSION
const saveStrategy = async (req, res) => {
  try {
    const userId = req.user._id;
    const strategyData = req.body;

    // Create new strategy document
    const newStrategy = new Strategy({
      userId,
      name: strategyData.name,
      symbol: strategyData.symbol,
      timeframe: strategyData.timeframe,
      parameters: {
        fastMA: strategyData.fastMA,
        slowMA: strategyData.slowMA,
        stopLoss: strategyData.stopLoss,
        takeProfit: strategyData.takeProfit
      },
      results: strategyData.results || {},
      isActive: strategyData.isActive || false
    });

    // Save to database
    await newStrategy.save();

    res.json({
      success: true,
      message: 'Strategy saved successfully',
      data: {
        id: newStrategy._id,
        name: newStrategy.name,
        symbol: newStrategy.symbol
      }
    });

  } catch (error) {
    console.error('Save strategy error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving strategy'
    });
  }
};

// Helper Functions
const simulateBacktest = async (params) => {
  const {
    symbol,
    startDate,
    endDate,
    initialCapital,
    fastMA,
    slowMA,
    stopLoss,
    takeProfit
  } = params;

  // Simulate trading based on MA crossover strategy
  const totalTrades = Math.floor(Math.random() * 30) + 20;
  const winningTrades = Math.floor(totalTrades * (0.5 + Math.random() * 0.3));
  const losingTrades = totalTrades - winningTrades;

  const winRate = (winningTrades / totalTrades) * 100;
  const totalReturn = initialCapital * (0.05 + Math.random() * 0.15);
  const maxDrawdown = -(2 + Math.random() * 8);
  const sharpeRatio = 1.2 + Math.random() * 1.0;

  const profitFactor = 1.5 + Math.random() * 1.0;
  const avgWin = totalReturn * 0.6 / winningTrades;
  const avgLoss = totalReturn * 0.4 / losingTrades * -1;

  const bestTrade = avgWin * (1.5 + Math.random() * 1.0);
  const worstTrade = avgLoss * (1.2 + Math.random() * 0.8);

  // Generate monthly performance
  const performance = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  for (let i = 0; i < 6; i++) {
    performance.push({
      month: months[i],
      return: parseFloat((Math.random() * 8 - 2).toFixed(1))
    });
  }

  return {
    totalTrades,
    winningTrades,
    losingTrades,
    winRate: parseFloat(winRate.toFixed(1)),
    totalReturn: Math.round(totalReturn),
    returnPercent: parseFloat((totalReturn / initialCapital * 100).toFixed(1)),
    maxDrawdown: parseFloat(maxDrawdown.toFixed(1)),
    sharpeRatio: parseFloat(sharpeRatio.toFixed(2)),
    profitFactor: parseFloat(profitFactor.toFixed(1)),
    avgWin: Math.round(avgWin),
    avgLoss: Math.round(avgLoss),
    bestTrade: Math.round(bestTrade),
    worstTrade: Math.round(worstTrade),
    performance
  };
};

module.exports = {
  runBacktest,
  getUserStrategies,
  saveStrategy
};