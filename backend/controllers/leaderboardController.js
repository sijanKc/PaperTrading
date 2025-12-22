const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');

// Get Leaderboard Data
const getLeaderboard = async (req, res) => {
  try {
    const { timeframe = 'weekly', category = 'all' } = req.query;
    const userId = req.user._id;

    // Get all active users
    const users = await User.find({ isActive: true })
      .select('fullName username virtualBalance portfolioValue totalProfitLoss createdAt avatar')
      .lean();

    const leaderboardData = [];

    for (const user of users) {
      // Get user's portfolio for current value
      const portfolio = await Portfolio.find({ userId: user._id })
        .populate('stockId', 'currentPrice');
      
      // Calculate current portfolio value
      let currentPortfolioValue = 0;
      portfolio.forEach(item => {
        currentPortfolioValue += item.quantity * item.stockId.currentPrice;
      });

      // Get transactions for timeframe analysis
      const transactions = await Transaction.find({ 
        userId: user._id,
        status: 'COMPLETED'
      });

      // Calculate timeframe profit
      const timeframeProfit = await calculateTimeframeProfit(user, transactions, timeframe);
      
      // Calculate trading statistics
      const stats = await calculateTradingStats(transactions);
      
      // Determine strategy
      const strategy = await determineTradingStrategy(transactions, portfolio);

      // Filter by category
      if (category !== 'all' && !strategy.toLowerCase().includes(category)) {
        continue;
      }

      leaderboardData.push({
        userId: user._id,
        name: user.fullName,
        username: `@${user.username}`,
        profit: Math.round(timeframeProfit),
        profitPercent: calculateProfitPercent(timeframeProfit, user.virtualBalance),
        trades: stats.totalTrades,
        winRate: stats.winRate,
        avatar: user.avatar || getAvatarForUser(user._id),
        strategy: strategy,
        change: await calculateRankChange(user._id, timeframe),
        isCurrentUser: user._id.toString() === userId.toString(),
        portfolioValue: currentPortfolioValue
      });
    }

    // Sort by profit and assign ranks
    const sortedData = leaderboardData
      .sort((a, b) => b.profit - a.profit)
      .map((trader, index) => ({
        ...trader,
        rank: index + 1
      }));

    // Get community stats
    const communityStats = await getCommunityStats();

    res.json({
      success: true,
      data: {
        [timeframe]: sortedData,
        communityStats: communityStats
      }
    });

  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard data'
    });
  }
};

// Calculate timeframe-specific profit
const calculateTimeframeProfit = async (user, transactions, timeframe) => {
  const now = new Date();
  let startDate;

  switch (timeframe) {
    case 'weekly':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'monthly':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'allTime':
      return user.totalProfitLoss || 0;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  // Filter transactions by timeframe
  const timeframeTxs = transactions.filter(t => t.createdAt >= startDate);
  
  // Calculate profit from closed trades in timeframe
  let profit = 0;
  const tradePairs = {};

  // Group buy and sell transactions
  timeframeTxs.forEach(tx => {
    if (!tradePairs[tx.symbol]) {
      tradePairs[tx.symbol] = [];
    }
    tradePairs[tx.symbol].push(tx);
  });

  // Calculate profit for each symbol
  Object.values(tradePairs).forEach(symbolTxs => {
    const buys = symbolTxs.filter(t => t.type === 'BUY');
    const sells = symbolTxs.filter(t => t.type === 'SELL');
    
    const minLength = Math.min(buys.length, sells.length);
    for (let i = 0; i < minLength; i++) {
      const buy = buys[i];
      const sell = sells[i];
      const tradeProfit = (sell.price - buy.price) * buy.quantity;
      profit += tradeProfit;
    }
  });

  return profit;
};

// Calculate trading statistics
const calculateTradingStats = (transactions) => {
  const closedTrades = getClosedTrades(transactions);
  const totalTrades = closedTrades.length;
  const winningTrades = closedTrades.filter(trade => trade.profit > 0).length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  return {
    totalTrades,
    winningTrades,
    winRate: parseFloat(winRate.toFixed(1))
  };
};

// Get closed trades from transactions
const getClosedTrades = (transactions) => {
  const trades = [];
  const symbolMap = {};

  transactions.forEach(tx => {
    if (!symbolMap[tx.symbol]) {
      symbolMap[tx.symbol] = [];
    }
    symbolMap[tx.symbol].push(tx);
  });

  Object.values(symbolMap).forEach(symbolTxs => {
    const buys = symbolTxs.filter(t => t.type === 'BUY').sort((a, b) => a.createdAt - b.createdAt);
    const sells = symbolTxs.filter(t => t.type === 'SELL').sort((a, b) => a.createdAt - b.createdAt);

    const minLength = Math.min(buys.length, sells.length);
    for (let i = 0; i < minLength; i++) {
      const buy = buys[i];
      const sell = sells[i];
      const profit = (sell.price - buy.price) * buy.quantity;
      
      trades.push({
        symbol: buy.symbol,
        buyPrice: buy.price,
        sellPrice: sell.price,
        quantity: buy.quantity,
        profit: profit,
        holdingPeriod: (sell.createdAt - buy.createdAt) / (1000 * 60 * 60 * 24)
      });
    }
  });

  return trades;
};

// Determine trading strategy
const determineTradingStrategy = async (transactions, portfolio) => {
  if (transactions.length === 0) return 'Beginner';
  
  const closedTrades = getClosedTrades(transactions);
  if (closedTrades.length === 0) return 'Beginner';

  const holdingPeriods = closedTrades.map(t => t.holdingPeriod);
  const avgHoldingPeriod = holdingPeriods.reduce((a, b) => a + b, 0) / holdingPeriods.length;

  // Analyze trading frequency
  const tradingDays = new Set(transactions.map(t => 
    t.createdAt.toISOString().split('T')[0]
  )).size;

  const tradesPerDay = transactions.length / Math.max(tradingDays, 1);

  if (tradesPerDay > 3) return 'Day Trading';
  if (avgHoldingPeriod <= 5) return 'Swing Trading';
  if (avgHoldingPeriod <= 30) return 'Momentum';
  return 'Value Investing';
};

// Other helper functions remain similar but improved
const calculateProfitPercent = (profit, balance) => {
  return balance > 0 ? parseFloat(((profit / balance) * 100).toFixed(1)) : 0;
};

const getAvatarForUser = (userId) => {
  const avatars = ['👑', '🚀', '⭐', '💫', '🔥', '😊', '🎯', '💰', '📈', '⚡'];
  // Consistent avatar for same user
  const hash = userId.toString().split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const index = Math.abs(hash) % avatars.length;
  return avatars[index];
};

const calculateRankChange = async (userId, timeframe) => {
  // Implement proper rank change calculation
  // For now, return mock data
  const changes = ['+2', '+3', '-1', '+5', '-2', '+1', '0', '+4', '-3'];
  const hash = userId.toString().split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const index = Math.abs(hash) % changes.length;
  return changes[index];
};

// Get Community Statistics (improved)
const getCommunityStats = async () => {
  const totalUsers = await User.countDocuments({ isActive: true });
  
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const activeTraders = await Transaction.distinct('userId', {
    createdAt: { $gte: lastWeek }
  });

  const weeklyTransactions = await Transaction.find({
    createdAt: { $gte: lastWeek },
    status: 'COMPLETED'
  });

  const closedTrades = getClosedTrades(weeklyTransactions);
  const totalProfit = closedTrades.reduce((sum, trade) => sum + trade.profit, 0);
  const winningTrades = closedTrades.filter(trade => trade.profit > 0).length;
  const averageWinRate = closedTrades.length > 0 ? 
    (winningTrades / closedTrades.length) * 100 : 0;

  return {
    activeTraders: activeTraders.length,
    averageWinRate: parseFloat(averageWinRate.toFixed(1)),
    totalCommunityProfit: Math.round(totalProfit),
    totalTrades: weeklyTransactions.length,
    totalUsers
  };
};

module.exports = {
  getLeaderboard,
  getCommunityStats
};