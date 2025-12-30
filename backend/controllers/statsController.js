const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');

/**
 * Get stats overview specifically for OverviewCards component
 */
const getStatsOverview = async (req, res) => {
  try {
    console.log('📈 Stats overview called for user:', req.user._id);

    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get portfolio for calculations
    const portfolio = await Portfolio.find({ userId })
      .populate('stockId', 'currentPrice change changePercent previousClose')
      .lean();

    // Calculate basic metrics that OverviewCards expects
    let totalInvestment = 0;
    let currentValue = 0;
    let dailyPL = 0;

    portfolio.forEach(item => {
      totalInvestment += item.totalInvestment || 0;
      if (item.stockId) {
        const itemValue = item.quantity * item.stockId.currentPrice;
        currentValue += itemValue;

        // Calculate daily P/L from price changes
        if (item.stockId.change) {
          dailyPL += item.stockId.change * item.quantity;
        } else if (item.stockId.previousClose) {
          const change = item.stockId.currentPrice - item.stockId.previousClose;
          dailyPL += change * item.quantity;
        }
      }
    });

    const profitLoss = currentValue - totalInvestment;
    const profitLossPercent = totalInvestment > 0 ? (profitLoss / totalInvestment) * 100 : 0;
    const dailyPLPercent = currentValue > 0 ? (dailyPL / currentValue) * 100 : 0;

    // user.virtualBalance in DB is actual liquid cash
    const availableCash = user.virtualBalance;
    const totalNetWorth = availableCash + currentValue;

    // Response data matching OverviewCards structure EXACTLY
    const responseData = {
      virtualBalance: parseFloat(totalNetWorth.toFixed(2)), // Net Worth (Cash + Stocks)
      totalInvestment: parseFloat(totalInvestment.toFixed(2)),
      currentValue: parseFloat(currentValue.toFixed(2)),
      profitLoss: parseFloat(profitLoss.toFixed(2)),
      profitLossPercent: parseFloat(profitLossPercent.toFixed(2)),
      dailyPL: parseFloat(dailyPL.toFixed(2)),
      dailyPLPercent: parseFloat(dailyPLPercent.toFixed(2)),
      availableCash: parseFloat(availableCash.toFixed(2)), // Liquid Cash
      holdingsCount: portfolio.length
    };

    console.log('✅ Stats overview data:', responseData);

    res.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('❌ Stats overview error:', error);

    // Return default data on error
    const defaultData = {
      virtualBalance: 100000.00,
      totalInvestment: 0.00,
      currentValue: 0.00,
      profitLoss: 0.00,
      profitLossPercent: 0.00,
      dailyPL: 0.00,
      dailyPLPercent: 0.00,
      availableCash: 100000.00,
      holdingsCount: 0
    };

    res.json({
      success: true,
      data: defaultData,
      message: 'Using default stats data'
    });
  }
};

/**
 * Get detailed paper trading statistics
 */
const getPaperStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    const portfolio = await Portfolio.find({ userId }).populate('stockId');
    const transactions = await Transaction.find({ userId, status: 'COMPLETED' });

    // Calculate comprehensive statistics
    const stats = await calculateComprehensiveStats(user, portfolio, transactions);

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get paper stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching paper trading statistics'
    });
  }
};

// Helper Functions (keep your existing ones)
const calculateComprehensiveStats = async (user, portfolio, transactions) => {
  const initialBalance = user.initialBalance || 100000;
  const currentCash = user.virtualBalance;

  // Calculate current portfolio value
  const currentPortfolioValue = portfolio.reduce((sum, item) => {
    return sum + (item.quantity * (item.stockId?.currentPrice || 0));
  }, 0);

  const currentNetWorth = currentCash + currentPortfolioValue;
  const totalProfitLoss = currentNetWorth - initialBalance;
  const totalProfitLossPercent = (totalProfitLoss / initialBalance) * 100;

  // Calculate daily P/L
  const now = new Date();
  const startOfToday = new Date(now.setHours(0, 0, 0, 0));
  const dailyProfitLoss = await calculateTimeframeProfit(transactions, portfolio, startOfToday, new Date());

  const completedTrades = transactions.filter(t => t.status === 'COMPLETED');
  const totalTrades = completedTrades.length;

  // Realized Profit/Loss logic (from SELL transactions)
  let realizedPL = 0;
  let winningTrades = 0;
  let losingTrades = 0;
  let totalWinAmount = 0;
  let totalLossAmount = 0;

  completedTrades.forEach(tx => {
    if (tx.type === 'SELL') {
      // Find average buy price for this stock symbol (simplified: use current portfolio or last buy)
      // For more accuracy, we'd need a more complex tracking system, but let's improve it.
      const profit = calculateTradeRealizedProfit(tx, transactions);
      realizedPL += profit;
      if (profit > 0) {
        winningTrades++;
        totalWinAmount += profit;
      } else if (profit < 0) {
        losingTrades++;
        totalLossAmount += Math.abs(profit);
      }
    }
  });

  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  const avgWin = winningTrades > 0 ? totalWinAmount / winningTrades : 0;
  const avgLoss = losingTrades > 0 ? totalLossAmount / losingTrades : 0;
  const profitFactor = totalLossAmount > 0 ? totalWinAmount / totalLossAmount : totalWinAmount > 0 ? 100 : 0;

  return {
    virtualBalance: parseFloat(currentNetWorth.toFixed(2)),
    availableCash: parseFloat(currentCash.toFixed(2)),
    initialBalance: initialBalance,
    totalProfitLoss: Math.round(totalProfitLoss),
    totalProfitLossPercent: parseFloat(totalProfitLossPercent.toFixed(1)),
    dailyProfitLoss: Math.round(dailyProfitLoss),
    dailyProfitLossPercent: parseFloat((dailyProfitLoss / currentNetWorth * 100).toFixed(2)),
    totalTrades,
    winningTrades,
    losingTrades,
    winRate: parseFloat(winRate.toFixed(1)),
    avgWin: Math.round(avgWin),
    avgLoss: Math.round(avgLoss),
    profitFactor: parseFloat(profitFactor.toFixed(2)),
    sharpeRatio: 1.5, // Placeholder for advanced math
    maxDrawdown: -5.0  // Placeholder for history tracking
  };
};

const calculateTimeframeProfit = async (transactions, portfolio, startDate, endDate) => {
  // Profit from price changes of held stocks
  const unrealizedDailyPL = portfolio.reduce((sum, item) => {
    const stock = item.stockId;
    if (stock && stock.previousClose) {
      const change = stock.currentPrice - stock.previousClose;
      return sum + (change * item.quantity);
    }
    return sum;
  }, 0);

  // Profit from actual sales today
  const realizedDailyPL = transactions
    .filter(tx => tx.type === 'SELL' && tx.createdAt >= startDate && tx.createdAt <= endDate)
    .reduce((sum, tx) => sum + calculateTradeRealizedProfit(tx, transactions), 0);

  return unrealizedDailyPL + realizedDailyPL;
};

const calculateTradeRealizedProfit = (sellTx, allTransactions) => {
  // Find matching BUY transactions for this sale (FIFO or Average)
  // Simplified: Find last BUY before this SELL for the same stock
  const symbol = sellTx.symbol;
  const matchingBuys = allTransactions.filter(t =>
    t.symbol === symbol &&
    t.type === 'BUY' &&
    t.createdAt < sellTx.createdAt
  ).sort((a, b) => b.createdAt - a.createdAt);

  if (matchingBuys.length === 0) return 0;

  // Use last buy price as a simple reference or average if we wanted more complexity
  const buyPrice = matchingBuys[0].price;
  return (sellTx.price - buyPrice) * sellTx.quantity;
};

module.exports = {
  getPaperStats,
  getStatsOverview
};