const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');

// Get Trading Journal Entries
const getJournalEntries = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 50, page = 1 } = req.query;

    const transactions = await Transaction.find({ userId })
      .populate('stockId', 'symbol name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Transform transactions into journal entries
    const journalEntries = await Promise.all(transactions.map(async (tx) => ({
      id: tx._id,
      symbol: tx.stockId ? tx.stockId.symbol : tx.symbol,
      type: tx.type,
      quantity: tx.quantity,
      entryPrice: tx.price,
      exitPrice: null,
      entryDate: tx.createdAt,
      exitDate: tx.type === 'SELL' ? tx.createdAt : null,
      profitLoss: await calculateProfitLoss(tx),
      profitLossPercent: await calculateProfitPercent(tx),
      notes: tx.notes || '',
      status: tx.type === 'BUY' ? 'Open' : 'Closed',
      strategy: determineStrategy(tx)
    })));

    // Get journal statistics
    const stats = await getJournalStats(userId);

    res.json({
      success: true,
      data: {
        entries: journalEntries,
        stats: stats,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: await Transaction.countDocuments({ userId })
        }
      }
    });

  } catch (error) {
    console.error('Get journal entries error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching journal entries'
    });
  }
};

// Add Journal Entry
const addJournalEntry = async (req, res) => {
  try {
    const userId = req.user._id;
    const journalData = req.body;

    // Create transaction record
    const transaction = new Transaction({
      userId,
      stockId: await getStockIdBySymbol(journalData.symbol),
      symbol: journalData.symbol,
      type: journalData.type,
      quantity: journalData.quantity,
      price: journalData.entryPrice,
      totalAmount: journalData.quantity * journalData.entryPrice,
      notes: journalData.notes,
      strategy: journalData.strategy,
      status: 'COMPLETED',
      createdAt: new Date(journalData.entryDate)
    });

    await transaction.save();

    res.json({
      success: true,
      message: 'Journal entry added successfully',
      data: { id: transaction._id }
    });

  } catch (error) {
    console.error('Add journal entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding journal entry'
    });
  }
};

// Get Journal Analytics
const getJournalAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await getJournalStats(userId);
    const strategyPerformance = await getStrategyPerformance(userId);
    const monthlyPerformance = await getMonthlyPerformance(userId);

    res.json({
      success: true,
      data: {
        stats: stats,
        strategyPerformance: strategyPerformance,
        monthlyPerformance: monthlyPerformance
      }
    });

  } catch (error) {
    console.error('Get journal analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching journal analytics'
    });
  }
};

// Update Journal Entry
const updateJournalEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const journalData = req.body;
    const userId = req.user._id;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    // Make sure user owns the transaction
    if (transaction.userId.toString() !== userId.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Update fields
    if (journalData.symbol) {
      transaction.symbol = journalData.symbol;
      transaction.stockId = await getStockIdBySymbol(journalData.symbol);
    }

    if (journalData.type) transaction.type = journalData.type.toUpperCase();
    if (journalData.quantity) transaction.quantity = journalData.quantity;
    if (journalData.entryPrice) transaction.price = journalData.entryPrice;
    if (journalData.notes !== undefined) transaction.notes = journalData.notes;
    if (journalData.strategy) transaction.strategy = journalData.strategy;
    if (journalData.entryDate) transaction.createdAt = new Date(journalData.entryDate);

    // Recalculate total amount
    transaction.totalAmount = transaction.quantity * transaction.price;

    await transaction.save();

    res.json({
      success: true,
      message: 'Journal entry updated successfully',
      data: transaction
    });

  } catch (error) {
    console.error('Update journal entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating journal entry'
    });
  }
};

// Delete Journal Entry
const deleteJournalEntry = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    // Make sure user owns the transaction
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Journal entry removed'
    });
  } catch (error) {
    console.error('Delete journal entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting journal entry'
    });
  }
};

// Helper Functions
const getJournalStats = async (userId) => {
  const transactions = await Transaction.find({ userId, status: 'COMPLETED' });
  const closedTrades = await getClosedTrades(userId);

  const totalTrades = closedTrades.length;
  const winningTrades = closedTrades.filter(trade => trade.profitLoss > 0).length;
  const losingTrades = closedTrades.filter(trade => trade.profitLoss < 0).length;
  const openTrades = await Portfolio.countDocuments({ userId });

  const totalProfit = closedTrades.reduce((sum, trade) => sum + trade.profitLoss, 0);
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  return {
    totalTrades,
    winningTrades,
    losingTrades,
    openTrades,
    totalProfit: Math.round(totalProfit),
    winRate: parseFloat(winRate.toFixed(1))
  };
};

const getClosedTrades = async (userId) => {
  const transactions = await Transaction.find({
    userId,
    status: 'COMPLETED'
  }).sort({ createdAt: 1 });

  const closedTrades = [];

  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].type === 'BUY') {
      for (let j = i + 1; j < transactions.length; j++) {
        if (transactions[j].type === 'SELL' &&
          transactions[j].symbol === transactions[i].symbol) {

          const profitLoss = (transactions[j].price - transactions[i].price) * transactions[i].quantity;
          closedTrades.push({
            ...transactions[i].toObject(),
            profitLoss,
            exitPrice: transactions[j].price,
            exitDate: transactions[j].createdAt
          });
          break;
        }
      }
    }
  }

  return closedTrades;
};

// Calculate real profit/loss based on transaction pairs
const calculateProfitLoss = async (transaction) => {
  // For BUY transactions, P&L is 0 (not yet realized)
  if (transaction.type === 'BUY') return 0;

  // For SELL transactions, find the corresponding BUY transaction
  try {
    const buyTransaction = await Transaction.findOne({
      userId: transaction.userId,
      symbol: transaction.symbol,
      type: 'BUY',
      createdAt: { $lt: transaction.createdAt },
      status: 'COMPLETED'
    }).sort({ createdAt: -1 });

    if (buyTransaction) {
      // Calculate P&L: (Sell Price - Buy Price) * Quantity
      const profitLoss = (transaction.price - buyTransaction.price) * transaction.quantity;
      return Math.round(profitLoss);
    }
  } catch (error) {
    console.error('Error calculating P&L:', error);
  }

  return 0;
};

const calculateProfitPercent = async (transaction) => {
  const pl = await calculateProfitLoss(transaction);
  return transaction.price > 0 ? parseFloat((pl / (transaction.price * transaction.quantity) * 100).toFixed(2)) : 0;
};

// Allow users to specify strategy, or default to 'Not Specified'
const determineStrategy = (transaction) => {
  return transaction.strategy || 'Not Specified';
};

const getStockIdBySymbol = async (symbol) => {
  const stock = await Stock.findOne({ symbol });
  return stock ? stock._id : null;
};

const getStrategyPerformance = async (userId) => {
  const closedTrades = await getClosedTrades(userId);
  const strategyMap = {};

  closedTrades.forEach(trade => {
    const strategy = determineStrategy(trade);
    if (!strategyMap[strategy]) {
      strategyMap[strategy] = { profit: 0, trades: 0 };
    }
    strategyMap[strategy].profit += trade.profitLoss;
    strategyMap[strategy].trades += 1;
  });

  return Object.entries(strategyMap).map(([strategy, data]) => ({
    strategy,
    profit: Math.round(data.profit),
    trades: data.trades
  }));
};

const getMonthlyPerformance = async (userId) => {
  // Generate mock monthly performance data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(month => ({
    month,
    return: parseFloat((Math.random() * 10 - 2).toFixed(1))
  }));
};

module.exports = {
  getJournalEntries,
  addJournalEntry,
  getJournalAnalytics,
  updateJournalEntry,
  deleteJournalEntry
};