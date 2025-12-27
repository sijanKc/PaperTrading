const TradingRule = require('../models/TradingRule');
const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');

/**
 * Validates a trade against the current trading rules
 * @param {Object} params - Trade parameters
 * @param {String} params.userId - User ID making the trade
 * @param {String} params.type - 'BUY' or 'SELL'
 * @param {Number} params.quantity - Quantity of shares
 * @param {Number} params.price - Price per share
 * @param {Object} params.stock - Stock object with sector info
 * @param {Number} params.userBalance - Current user balance
 * @returns {Object} {valid: Boolean, error: String}
 */
const validateTrade = async ({ userId, type, quantity, price, stock, userBalance }) => {
    try {
        // Fetch trading rules
        const rules = await TradingRule.findOne();
        if (!rules) {
            return { valid: true }; // No rules set, allow trade
        }

        const totalAmount = quantity * price;

        // 1. Check daily loss percentage (for both BUY and SELL)
        if (type === 'BUY' || type === 'SELL') {
            const User = require('../models/User');
            const user = await User.findById(userId);

            if (user) {
                // Check if we need to reset daily start balance (new day)
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const lastReset = new Date(user.dailyStartDate);
                lastReset.setHours(0, 0, 0, 0);

                if (today > lastReset) {
                    // New day - reset the daily start balance
                    user.dailyStartBalance = user.virtualBalance + (user.portfolioValue || 0);
                    user.dailyStartDate = new Date();
                    await user.save();
                }

                // Calculate current total value
                const currentTotalValue = user.virtualBalance + (user.portfolioValue || 0);

                // Calculate daily loss percentage
                const dailyLoss = user.dailyStartBalance - currentTotalValue;
                const dailyLossPercent = (dailyLoss / user.dailyStartBalance) * 100;

                if (dailyLossPercent > rules.maxDailyLossPercent) {
                    return {
                        valid: false,
                        error: `You've reached your maximum daily loss limit (${rules.maxDailyLossPercent}%). You've lost ${dailyLossPercent.toFixed(2)}% today. Trading will resume tomorrow.`
                    };
                }
            }
        }

        // 2. Check portfolio loss percentage (overall account health)
        if (type === 'BUY' || type === 'SELL') {
            const User = require('../models/User');
            const user = await User.findById(userId);

            if (user && user.initialBalance) {
                const currentTotalValue = user.virtualBalance + (user.portfolioValue || 0);
                const portfolioLoss = user.initialBalance - currentTotalValue;
                const portfolioLossPercent = (portfolioLoss / user.initialBalance) * 100;

                if (portfolioLossPercent > rules.maxPortfolioLossPercent) {
                    return {
                        valid: false,
                        error: `Your account has exceeded the maximum portfolio loss limit (${rules.maxPortfolioLossPercent}%). Total loss: ${portfolioLossPercent.toFixed(2)}%. Your account is temporarily suspended. Please contact support.`
                    };
                }
            }
        }

        // 3. Check minimum trade amount
        if (totalAmount < rules.minTradeAmount) {
            return {
                valid: false,
                error: `Minimum trade amount is ₹${rules.minTradeAmount}. Your trade amount: ₹${totalAmount}`
            };
        }

        // 2. Check per-trade limit
        if (totalAmount > rules.perTradeLimit) {
            return {
                valid: false,
                error: `Per-trade limit is ₹${rules.perTradeLimit}. Your trade amount: ₹${totalAmount}`
            };
        }

        // 3. Check daily trading limit (for BUY only)
        if (type === 'BUY') {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const todayTransactions = await Transaction.find({
                userId,
                type: 'BUY',
                createdAt: { $gte: startOfDay }
            });

            const todayTotal = todayTransactions.reduce((sum, t) => sum + t.totalAmount, 0);

            if (todayTotal + totalAmount > rules.dailyTradeLimit) {
                return {
                    valid: false,
                    error: `Daily trading limit is ₹${rules.dailyTradeLimit}. You've already traded ₹${todayTotal} today. Remaining: ₹${rules.dailyTradeLimit - todayTotal}`
                };
            }
        }

        // 4. Check sector exposure limits (for BUY only)
        if (type === 'BUY' && stock.sector) {
            const portfolios = await Portfolio.find({ userId }).populate('stockId');

            // Calculate total portfolio value
            let totalPortfolioValue = userBalance;
            portfolios.forEach(p => {
                if (p.stockId) {
                    totalPortfolioValue += p.quantity * p.stockId.currentPrice;
                }
            });

            // Calculate sector exposure after this trade
            const sectorKey = stock.sector.toLowerCase();
            let sectorTotal = totalAmount;

            portfolios.forEach(p => {
                if (p.stockId && p.stockId.sector && p.stockId.sector.toLowerCase() === sectorKey) {
                    sectorTotal += p.quantity * p.stockId.currentPrice;
                }
            });

            const sectorPercent = (sectorTotal / (totalPortfolioValue + totalAmount)) * 100;
            const sectorLimit = rules.sectorLimits[sectorKey] || rules.sectorLimits.others || 15;

            if (sectorPercent > sectorLimit) {
                return {
                    valid: false,
                    error: `Sector limit for ${stock.sector} is ${sectorLimit}%. This trade would result in ${sectorPercent.toFixed(2)}% exposure.`
                };
            }
        }

        // 5. Check circuit breaker (if stock is paused due to volatility)
        if (rules.volatilityCircuitBreaker && stock._id) {
            const CircuitBreaker = require('../models/CircuitBreaker');
            const activeBreaker = await CircuitBreaker.findOne({
                stockId: stock._id,
                isActive: true,
                resumesAt: { $gt: new Date() }
            });

            if (activeBreaker) {
                const resumeTime = new Date(activeBreaker.resumesAt);
                const resumeString = `${resumeTime.getHours().toString().padStart(2, '0')}:${resumeTime.getMinutes().toString().padStart(2, '0')}`;

                return {
                    valid: false,
                    error: `Trading paused for ${stock.symbol} due to high volatility (${activeBreaker.priceChange.toFixed(2)}% price change). Trading resumes at ${resumeString}.`
                };
            }
        }

        // 6. Check market hours
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        if (currentTime < rules.marketOpenTime || currentTime > rules.marketCloseTime) {
            return {
                valid: false,
                error: `Trading is only allowed between ${rules.marketOpenTime} and ${rules.marketCloseTime}. Current time: ${currentTime}`
            };
        }

        // 6. Check short selling (for SELL only)
        if (type === 'SELL' && !rules.shortSellingAllowed) {
            // This is already checked in the trade controller by verifying portfolio
            // but we include it here for completeness
        }

        // All validations passed
        return { valid: true };

    } catch (error) {
        console.error('Trade validation error:', error);
        return {
            valid: false,
            error: 'Error validating trade. Please try again.'
        };
    }
};

/**
 * Get current trading rules (cached or from DB)
 */
const getTradingRules = async () => {
    try {
        let rules = await TradingRule.findOne();
        if (!rules) {
            rules = new TradingRule({});
            await rules.save();
        }
        return rules;
    } catch (error) {
        console.error('Error fetching trading rules:', error);
        return null;
    }
};

module.exports = {
    validateTrade,
    getTradingRules
};
