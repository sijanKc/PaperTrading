const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Order = require('../models/Order');
const TradingRule = require('../models/TradingRule');

/**
 * Monitors all user portfolios and triggers stop-loss sells
 * Should be called periodically (e.g., every minute during market hours)
 */
const checkStopLoss = async () => {
    try {
        const rules = await TradingRule.findOne();
        if (!rules || !rules.stopLossEnabled) {
            return; // Stop-loss not enabled
        }

        // Get all portfolio positions
        const portfolios = await Portfolio.find({}).populate('stockId');

        let stopLossTriggered = 0;

        for (const position of portfolios) {
            if (!position.stockId) continue;

            const currentPrice = position.stockId.currentPrice;
            const averageBuyPrice = position.averageBuyPrice;

            // Calculate loss percentage
            const lossPercent = ((averageBuyPrice - currentPrice) / averageBuyPrice) * 100;

            // Check if stop-loss threshold exceeded
            if (lossPercent >= rules.stopLossPercent) {
                // Trigger automatic sell
                await executeStopLossSell(position, rules.stopLossPercent);
                stopLossTriggered++;
            }
        }

        if (stopLossTriggered > 0) {
            console.log(`⚠️ Stop-loss triggered for ${stopLossTriggered} positions`);
        }
    } catch (error) {
        console.error('Error checking stop-loss:', error);
    }
};

/**
 * Execute automatic stop-loss sell
 */
const executeStopLossSell = async (portfolio, stopLossPercent) => {
    try {
        const stock = portfolio.stockId;
        const user = await User.findById(portfolio.userId);

        if (!user) return;

        const quantity = portfolio.quantity;
        const totalAmount = quantity * stock.currentPrice;

        // Remove portfolio position
        await Portfolio.findByIdAndDelete(portfolio._id);

        // Add to user balance
        user.virtualBalance += totalAmount;
        await user.save();

        // Create transaction record
        const transaction = new Transaction({
            userId: portfolio.userId,
            stockId: stock._id,
            symbol: stock.symbol,
            type: 'SELL',
            quantity: quantity,
            price: stock.currentPrice,
            totalAmount: totalAmount,
            status: 'COMPLETED',
            note: `Automatic stop-loss sell at ${stopLossPercent}% loss`
        });

        // Create order record
        const order = new Order({
            userId: portfolio.userId,
            stockId: stock._id,
            symbol: stock.symbol,
            orderType: 'SELL',
            quantity: quantity,
            price: stock.currentPrice,
            totalAmount: totalAmount,
            orderStatus: 'EXECUTED',
            executedPrice: stock.currentPrice,
            executedAt: new Date(),
            note: `STOP-LOSS: ${stopLossPercent}% threshold`
        });

        await Promise.all([transaction.save(), order.save()]);

        console.log(`🛑 Stop-loss executed for ${user.username}: Sold ${quantity} ${stock.symbol} at ₹${stock.currentPrice}`);
    } catch (error) {
        console.error('Error executing stop-loss sell:', error);
    }
};

module.exports = {
    checkStopLoss
};
