const User = require('../models/User');
const Stock = require('../models/Stock');
const TradingRule = require('../models/TradingRule');
const TechnicalAnalysis = require('../utils/technicalAnalysis');

/**
 * Get AI-powered investment recommendations using Knapsack DP
 */
const getInvestmentRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Get user and their current virtual balance
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const budget = user.virtualBalance;

        // 2. Get all active stocks and trading rules
        const stocks = await Stock.find({ isActive: true });
        const rules = await TradingRule.findOne();
        const perStockLimit = rules ? rules.perTradeLimit : 10000;

        if (!stocks || stocks.length === 0) {
            return res.status(404).json({ success: false, message: 'No active stocks found for analysis' });
        }

        // 3. Run the DSA Algorithm: Managed Knapsack
        const result = TechnicalAnalysis.solveKnapsack(budget, stocks, perStockLimit);

        res.json({
            success: true,
            data: {
                budget,
                ...result,
                explanation: `This portfolio was optimized using the Knapsack Algorithm (Dynamic Programming) to maximize predicted returns, while respecting a maximum investment of Rs. ${perStockLimit.toLocaleString()} per stock.`
            }
        });

    } catch (error) {
        console.error('Recommendation Error:', error);
        res.status(500).json({ success: false, message: 'Server error processing recommendations' });
    }
};

module.exports = {
    getInvestmentRecommendations
};
