const User = require('../models/User');
const Stock = require('../models/Stock');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const Order = require('../models/Order');
const Competition = require('../models/Competition');
const CompetitionParticipant = require('../models/CompetitionParticipant');
const { validateTrade } = require('../utils/ruleValidator');

// Buy Stock
const buyStock = async (req, res) => {
  try {
    const { symbol, quantity, competitionId = null } = req.body;
    const userId = req.user._id;

    // Find stock
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found'
      });
    }

    let user = null;
    let participant = null;
    let competition = null;
    let balance = 0;

    // 1. Get Balance and Participation Context
    if (competitionId) {
      competition = await Competition.findById(competitionId);
      if (!competition) return res.status(404).json({ success: false, message: 'Competition not found' });

      participant = await CompetitionParticipant.findOne({ competitionId, userId });
      if (!participant) {
        return res.status(403).json({ success: false, message: 'You are not a participant in this competition' });
      }

      if (competition.status !== 'active') {
        return res.status(400).json({ success: false, message: `Competition is ${competition.status}` });
      }

      balance = participant.currentBalance;

      // 2. Competition Rule Validation (Simple for now)
      if (competition.rules.allowedSectors && !competition.rules.allowedSectors.includes('All')) {
        if (!competition.rules.allowedSectors.includes(stock.sector)) {
          return res.status(400).json({
            success: false,
            message: `Trading for sector '${stock.sector}' is not allowed in this competition. Allowed: ${competition.rules.allowedSectors.join(', ')}`
          });
        }
      }

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const tradesToday = await Transaction.countDocuments({
        userId,
        competitionId,
        createdAt: { $gte: startOfDay }
      });

      if (tradesToday >= competition.rules.maxDailyTrades) {
        return res.status(400).json({
          success: false,
          message: `Daily trade limit of ${competition.rules.maxDailyTrades} reached for this competition.`
        });
      }

    } else {
      user = await User.findById(userId);
      balance = user.virtualBalance;
    }

    const totalCost = quantity * stock.currentPrice;

    // Check if enough balance
    if (balance < totalCost) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Required: Rs. ${totalCost}, Available: Rs. ${balance.toFixed(2)}`
      });
    }

    // Check minimum quantity (1 share)
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Minimum quantity is 1 share'
      });
    }

    // Validate against global trading rules (passing balance)
    const validation = await validateTrade({
      userId,
      type: 'BUY',
      quantity,
      price: stock.currentPrice,
      stock,
      userBalance: balance
    });

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.error
      });
    }

    // Find existing portfolio entry for this context
    let portfolio = await Portfolio.findOne({ userId, stockId: stock._id, competitionId });

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
        totalInvestment: totalCost,
        sector: stock.sector,
        competitionId
      });
    }

    // Deduct balance
    if (competitionId) {
      participant.currentBalance -= totalCost;
      participant.tradesCount += 1;
    } else {
      user.virtualBalance -= totalCost;
    }

    // Create records
    const transaction = new Transaction({
      userId,
      stockId: stock._id,
      symbol: stock.symbol,
      type: 'BUY',
      quantity: quantity,
      price: stock.currentPrice,
      totalAmount: totalCost,
      status: 'COMPLETED',
      orderType: 'Market',
      fees: 0,
      competitionId
    });

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
      executedAt: new Date(),
      competitionId
    });

    // Save all changes
    const savePromises = [portfolio.save(), transaction.save(), order.save()];
    if (competitionId) {
      savePromises.push(participant.save());
    } else {
      savePromises.push(user.save());
    }
    await Promise.all(savePromises);

    res.json({
      success: true,
      message: `Successfully bought ${quantity} shares of ${stock.symbol} at Rs. ${stock.currentPrice} ${competitionId ? 'for competition' : ''}`,
      order: {
        symbol: stock.symbol,
        quantity: quantity,
        price: stock.currentPrice,
        totalAmount: totalCost,
        remainingBalance: competitionId ? participant.currentBalance : user.virtualBalance
      }
    });

  } catch (error) {
    console.error('Buy stock error:', error);
    res.status(500).json({
      success: false,
      message: `Error executing buy order: ${error.message || 'Internal Server Error'}`
    });
  }
};

// Sell Stock
const sellStock = async (req, res) => {
  try {
    const { symbol, quantity, competitionId = null } = req.body;
    const userId = req.user._id;

    // Find stock
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found'
      });
    }

    // Find portfolio entry for this context
    const portfolio = await Portfolio.findOne({ userId, stockId: stock._id, competitionId });

    if (!portfolio || portfolio.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient shares. You have ${portfolio?.quantity || 0} shares of ${symbol} in this ${competitionId ? 'competition' : 'portfolio'}`
      });
    }

    const totalAmount = quantity * stock.currentPrice;

    let user = null;
    let participant = null;
    let balance = 0;

    if (competitionId) {
      participant = await CompetitionParticipant.findOne({ competitionId, userId });
      if (!participant) return res.status(403).json({ success: false, message: 'Not a participant' });
      balance = participant.currentBalance;
    } else {
      user = await User.findById(userId);
      balance = user.virtualBalance;
    }

    // Validate against trading rules
    const validation = await validateTrade({
      userId,
      type: 'SELL',
      quantity,
      price: stock.currentPrice,
      stock,
      userBalance: balance
    });

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.error
      });
    }

    // Update portfolio
    const newQuantity = portfolio.quantity - quantity;

    if (newQuantity === 0) {
      await Portfolio.findByIdAndDelete(portfolio._id);
    } else {
      portfolio.quantity = newQuantity;
      portfolio.totalInvestment = portfolio.averageBuyPrice * newQuantity;
      await portfolio.save();
    }

    // Add to balance
    if (competitionId) {
      participant.currentBalance += totalAmount;
      participant.tradesCount += 1;
    } else {
      user.virtualBalance += totalAmount;
    }

    // Create transaction record
    const transaction = new Transaction({
      userId,
      stockId: stock._id,
      symbol: stock.symbol,
      type: 'SELL',
      quantity: quantity,
      price: stock.currentPrice,
      totalAmount: totalAmount,
      status: 'COMPLETED',
      orderType: 'Market',
      fees: 0,
      competitionId
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
      executedAt: new Date(),
      competitionId
    });

    // Save all changes
    const savePromises = [transaction.save(), order.save()];
    if (competitionId) {
      savePromises.push(participant.save());
    } else {
      savePromises.push(user.save());
    }
    await Promise.all(savePromises);

    res.json({
      success: true,
      message: `Successfully sold ${quantity} shares of ${stock.symbol} at Rs. ${stock.currentPrice} ${competitionId ? 'for competition' : ''}`,
      order: {
        symbol: stock.symbol,
        quantity: quantity,
        price: stock.currentPrice,
        totalAmount: totalAmount,
        remainingBalance: competitionId ? participant.currentBalance : user.virtualBalance
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
    const { competitionId = null } = req.query;

    const portfolio = await Portfolio.find({ userId, competitionId })
      .populate('stockId', 'symbol name currentPrice sector')
      .sort({ symbol: 1 });

    // Calculate total portfolio value
    let totalPortfolioValue = 0;
    let totalInvestment = 0;

    const portfolioWithDetails = portfolio.map(item => {
      const currentValue = item.quantity * item.stockId.currentPrice;
      const profitLoss = currentValue - item.totalInvestment;
      const profitLossPercentage = item.totalInvestment > 0 ? (profitLoss / item.totalInvestment) * 100 : 0;

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

    let balance = 0;

    if (competitionId) {
      // Update competition participant record
      const participant = await CompetitionParticipant.findOneAndUpdate(
        { competitionId, userId },
        {
          portfolioValue: totalPortfolioValue,
          totalProfitLoss: totalProfitLoss
        },
        { new: true }
      );
      balance = participant?.currentBalance || 0;
    } else {
      // Update user's main portfolio value
      const user = await User.findByIdAndUpdate(userId, {
        portfolioValue: totalPortfolioValue,
        totalProfitLoss: totalProfitLoss
      }, { new: true });
      balance = user.virtualBalance;
    }

    res.json({
      success: true,
      data: {
        holdings: portfolioWithDetails,
        virtualBalance: balance,
        summary: {
          totalPortfolioValue,
          totalInvestment,
          totalProfitLoss,
          totalProfitLossPercentage: totalProfitLossPercentage.toFixed(2)
        }
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
    const { limit = 50, competitionId = null } = req.query;

    const query = { userId, competitionId };

    const transactions = await Transaction.find(query)
      .populate('stockId', 'symbol name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    let balance = 0;
    if (competitionId) {
      const participant = await CompetitionParticipant.findOne({ competitionId, userId });
      balance = participant?.currentBalance || 0;
    } else {
      const user = await User.findById(userId).select('virtualBalance');
      balance = user.virtualBalance;
    }

    res.json({
      success: true,
      data: transactions.map(t => ({
        _id: t._id,
        symbol: t.stockId?.symbol || t.symbol,
        name: t.stockId?.name || 'N/A',
        type: t.type.toLowerCase(),
        quantity: t.quantity,
        price: t.price,
        totalAmount: t.totalAmount,
        status: t.status.toLowerCase(),
        orderType: t.orderType || 'Market',
        fees: t.fees || 0,
        createdAt: t.createdAt
      })),
      virtualBalance: balance
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