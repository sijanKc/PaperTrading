const Stock = require('../models/Stock');
const CircuitBreaker = require('../models/CircuitBreaker');
const TradingRule = require('../models/TradingRule');

/**
 * Monitors stock price changes and triggers circuit breakers
 * This should be called whenever stock prices are updated
 */
const checkPriceViolations = async (stockId, oldPrice, newPrice) => {
    try {
        const rules = await TradingRule.findOne();
        if (!rules || !rules.volatilityCircuitBreaker) {
            return; // Circuit breakers not enabled
        }

        const priceChange = Math.abs(((newPrice - oldPrice) / oldPrice) * 100);

        if (priceChange > rules.maxPriceChangePercent) {
            const stock = await Stock.findById(stockId);
            if (!stock) return;

            // Check if already has active circuit breaker
            const existing = await CircuitBreaker.findOne({
                stockId,
                isActive: true
            });

            if (existing) {
                return; // Already paused
            }

            // Calculate resume time
            const resumesAt = new Date();
            resumesAt.setMinutes(resumesAt.getMinutes() + rules.coolOffPeriod);

            // Create circuit breaker
            const breaker = new CircuitBreaker({
                stockId,
                symbol: stock.symbol,
                triggeredAt: new Date(),
                resumesAt,
                priceChange,
                oldPrice,
                newPrice
            });

            await breaker.save();

            console.log(`🚨 Circuit breaker triggered for ${stock.symbol}: ${priceChange.toFixed(2)}% change. Resumes at ${resumesAt.toLocaleTimeString()}`);
        }
    } catch (error) {
        console.error('Error checking price violations:', error);
    }
};

/**
 * Cleanup expired circuit breakers
 * Should be called periodically
 */
const cleanupExpiredBreakers = async () => {
    try {
        const result = await CircuitBreaker.updateMany(
            {
                isActive: true,
                resumesAt: { $lte: new Date() }
            },
            {
                isActive: false
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`✅ Resumed trading for ${result.modifiedCount} stocks`);
        }
    } catch (error) {
        console.error('Error cleaning up circuit breakers:', error);
    }
};

module.exports = {
    checkPriceViolations,
    cleanupExpiredBreakers
};
