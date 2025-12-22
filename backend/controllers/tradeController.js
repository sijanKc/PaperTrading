const User = require('../models/User');
const Stock = require('../models/Stock');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const Order = require('../models/Order');

// Buy Stock
const buyStock = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;
    const userId = req.user._id;

    // Find stock
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found'
      });
    }

    // Get user with current balance
    const user = await User.findById(userId);
    const totalCost = quantity * stock.currentPrice;

    // Check if user has enough balance
    if (user.virtualBalance < totalCost) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Required: ₹${totalCost}, Available: ₹${user.virtualBalance}`
      });
    }

    // Check minimum quantity (1 share)
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Minimum quantity is 1 share'
      });
    }

    // Find existing portfolio entry
    let portfolio = await Portfolio.findOne({ userId, stockId: stock._id });

    if (portfolio) {
      // Update existing portfolio - Calculate new average price
      const newQuantity = portfolio.quantity + quantity;
      const newTotalInvestment = portfolio.totalInvestment + totalCost;
      const newAveragePrice = newTotalInvestment / newQuantity;

      portfolio.quantity = newQuantity;
      portfolio.averageBuyPrice = newAveragePrice;
      portfolio.totalInvestment = newTotalInvestment;
    } else {
      // Create new portfolio entry
      portfolio = new Portfolio({
        userId,
        stockId: stock._id,
        symbol: stock.symbol,
        quantity: quantity,
        averageBuyPrice: stock.currentPrice,
        totalInvestment: totalCost
      });
    }

    // Deduct from user balance
    user.virtualBalance -= totalCost;

    // Create transaction record
    const transaction = new Transaction({
      userId,
      stockId: stock._id,
      symbol: stock.symbol,
      type: 'BUY',
      quantity: quantity,
      price: stock.currentPrice,
      totalAmount: totalCost,
      status: 'COMPLETED'
    });

    // Create order record
    const order = new Order({
      userId,
      stockId: stock._id,
      symbol: stock.symbol,
      orderType: 'BUY',
      quantity: quantity,
      price: stock.currentPrice,
      totalAmount: totalCost,
      orderStatus: 'EXECUTED',
      executedPrice: stock.currentPrice,
      executedAt: new Date()
    });

    // Save all changes
    await Promise.all([
      portfolio.save(),
      user.save(),
      transaction.save(),
      order.save()
    ]);

    res.json({
      success: true,
      message: `Successfully bought ${quantity} shares of ${stock.symbol} at ₹${stock.currentPrice}`,
      order: {
        symbol: stock.symbol,
        quantity: quantity,
        price: stock.currentPrice,
        totalAmount: totalCost,
        remainingBalance: user.virtualBalance
      }
    });

  } catch (error) {
    console.error('Buy stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Error executing buy order'
    });
  }
};

// Sell Stock
const sellStock = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;
    const userId = req.user._id;

    // Find stock
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found'
      });
    }

    // Find portfolio entry
    const portfolio = await Portfolio.findOne({ userId, stockId: stock._id });
    
    if (!portfolio || portfolio.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient shares. You have ${portfolio?.quantity || 0} shares of ${symbol}`
      });
    }

    const totalAmount = quantity * stock.currentPrice;
    const user = await User.findById(userId);

    // Update portfolio
    const newQuantity = portfolio.quantity - quantity;
    
    if (newQuantity === 0) {
      // Remove portfolio entry if no shares left
      await Portfolio.findByIdAndDelete(portfolio._id);
    } else {
      // Update portfolio with remaining shares
      portfolio.quantity = newQuantity;
      portfolio.totalInvestment = portfolio.averageBuyPrice * newQuantity;
      await portfolio.save();
    }

    // Add to user balance
    user.virtualBalance += totalAmount;

    // Create transaction record
    const transaction = new Transaction({
      userId,
      stockId: stock._id,
      symbol: stock.symbol,
      type: 'SELL',
      quantity: quantity,
      price: stock.currentPrice,
      totalAmount: totalAmount,
      status: 'COMPLETED'
    });

    // Create order record
    const order = new Order({
      userId,
      stockId: stock._id,
      symbol: stock.symbol,
      orderType: 'SELL',
      quantity: quantity,
      price: stock.currentPrice,
      totalAmount: totalAmount,
      orderStatus: 'EXECUTED',
      executedPrice: stock.currentPrice,
      executedAt: new Date()
    });

    // Save all changes
    await Promise.all([
      user.save(),
      transaction.save(),
      order.save()
    ]);

    res.json({
      success: true,
      message: `Successfully sold ${quantity} shares of ${stock.symbol} at ₹${stock.currentPrice}`,
      order: {
        symbol: stock.symbol,
        quantity: quantity,
        price: stock.currentPrice,
        totalAmount: totalAmount,
        remainingBalance: user.virtualBalance
      }
    });

  } catch (error) {
    console.error('Sell stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Error executing sell order'
    });
  }
};

// Get User Portfolio
const getPortfolio = async (req, res) => {
  try {
    const userId = req.user._id;

    const portfolio = await Portfolio.find({ userId })
      .populate('stockId', 'symbol name currentPrice sector')
      .sort({ symbol: 1 });

    // Calculate total portfolio value
    let totalPortfolioValue = 0;
    let totalInvestment = 0;

    const portfolioWithDetails = portfolio.map(item => {
      const currentValue = item.quantity * item.stockId.currentPrice;
      const profitLoss = currentValue - item.totalInvestment;
      const profitLossPercentage = (profitLoss / item.totalInvestment) * 100;

      totalPortfolioValue += currentValue;
      totalInvestment += item.totalInvestment;

      return {
        symbol: item.stockId.symbol,
        name: item.stockId.name,
        sector: item.stockId.sector,
        quantity: item.quantity,
        averageBuyPrice: item.averageBuyPrice,
        currentPrice: item.stockId.currentPrice,
        totalInvestment: item.totalInvestment,
        currentValue: currentValue,
        profitLoss: profitLoss,
        profitLossPercentage: profitLossPercentage
      };
    });

    const totalProfitLoss = totalPortfolioValue - totalInvestment;
    const totalProfitLossPercentage = totalInvestment > 0 ? 
      (totalProfitLoss / totalInvestment) * 100 : 0;

    // Update user's portfolio value
    await User.findByIdAndUpdate(userId, {
      portfolioValue: totalPortfolioValue,
      totalProfitLoss: totalProfitLoss
    });

    res.json({
      success: true,
      portfolio: portfolioWithDetails,
      summary: {
        totalPortfolioValue,
        totalInvestment,
        totalProfitLoss,
        totalProfitLossPercentage: totalProfitLossPercentage.toFixed(2)
      }
    });

  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching portfolio'
    });
  }
};

// Get Transaction History
const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 50 } = req.query;

    const transactions = await Transaction.find({ userId })
      .populate('stockId', 'symbol name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      transactions: transactions.map(t => ({
        symbol: t.stockId.symbol,
        name: t.stockId.name,
        type: t.type,
        quantity: t.quantity,
        price: t.price,
        totalAmount: t.totalAmount,
        timestamp: t.createdAt
      }))
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transaction history'
    });
  }
};

module.exports = {
  buyStock,
  sellStock,
  getPortfolio,
  getTransactionHistory
};