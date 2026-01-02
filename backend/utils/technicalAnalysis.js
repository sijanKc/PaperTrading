/**
 * TechnicalAnalysis.js
 * 
 * This module implements core Data Structures and Algorithms (DSA) 
 * for financial data processing.
 */

class TechnicalAnalysis {
    /**
     * ALGORITHM: Sliding Window
     * PURPOSE: Calculate Simple Moving Average (SMA) efficiently.
     * 
     * WHY THIS ALGORITHM?
     * Traditional calculation uses nested loops O(n * k), which is slow.
     * Sliding Window reduces complexity to O(n) by maintaining a running sum.
     * It subtracts the 'tail' (oldest price) and adds the 'head' (newest price).
     */
    static calculateSMA(prices, period) {
        if (!prices || prices.length < period) return [];

        const smas = [];
        let windowSum = 0;

        // 1. Initial window sum: O(k)
        for (let i = 0; i < period; i++) {
            windowSum += prices[i];
        }
        smas.push(Number((windowSum / period).toFixed(2)));

        // 2. Slide the window: O(n - k)
        // Complexity: Total O(n)
        for (let i = period; i < prices.length; i++) {
            windowSum = windowSum - prices[i - period] + prices[i];
            smas.push(Number((windowSum / period).toFixed(2)));
        }

        return smas;
    }

    /**
     * ALGORITHM: Relative Strength Index (RSI) calculation
     * Uses Modified Sliding Window (Exponential approach)
     */
    static calculateRSI(prices, period = 14) {
        if (prices.length <= period) return 50; // Neutral

        let gains = 0;
        let losses = 0;

        // Initial gains/losses
        for (let i = 1; i <= period; i++) {
            const diff = prices[i] - prices[i - 1];
            if (diff >= 0) gains += diff;
            else losses -= diff;
        }

        let avgGain = gains / period;
        let avgLoss = losses / period;

        // Slide and smooth
        for (let i = period + 1; i < prices.length; i++) {
            const diff = prices[i] - prices[i - 1];
            const currentGain = diff >= 0 ? diff : 0;
            const currentLoss = diff < 0 ? -diff : 0;

            avgGain = (avgGain * (period - 1) + currentGain) / period;
            avgLoss = (avgLoss * (period - 1) + currentLoss) / period;
        }

        if (avgLoss === 0) return 100;
        const rs = avgGain / avgLoss;
        return Number((100 - (100 / (1 + rs))).toFixed(2));
    }
    /**
     * ALGORITHM: Bounded Knapsack (Dynamic Programming)
     * PURPOSE: Optimize stock portfolio while respecting per-stock investment limits.
     * 
     * WHY THIS ALGORITHM?
     * It extends the Unbounded Knapsack by adding a 'count' constraint (maxQty).
     * This ensures the portfolio is diversified and doesn't exceed 
     * business rules like "Max Rs. 10,000 per stock".
     * 
     * Complexity: O(W * N * maxQty)
     */
    static solveKnapsack(budget, stocks, perStockLimit = 10000) {
        if (!stocks || stocks.length === 0 || budget <= 0) return { recommendedPortfolio: [], optimizedReturnScore: 0, budgetUsed: 0 };

        const W = Math.floor(budget);
        const N = stocks.length;

        // dp[i][w] = max profit using first i stocks with budget w
        const dp = Array.from({ length: N + 1 }, () => new Float64Array(W + 1).fill(0));
        // keep[i][w] = how many units of stock i were used
        const keep = Array.from({ length: N + 1 }, () => new Int32Array(W + 1).fill(0));

        for (let i = 1; i <= N; i++) {
            const stock = stocks[i - 1];
            const price = Math.floor(stock.currentPrice);
            const value = stock.changePercent > 0 ? stock.changePercent : 0;

            // Limit units to stay under Rs. 10,000 per stock
            const maxQty = Math.floor(perStockLimit / price);

            for (let w = 0; w <= W; w++) {
                // Option 0: Don't pick this stock
                dp[i][w] = dp[i - 1][w];
                keep[i][w] = 0;

                // Try picking k units (from 1 to maxQty)
                for (let k = 1; k <= maxQty && k * price <= w; k++) {
                    const currentProfit = dp[i - 1][w - k * price] + (k * value);
                    if (currentProfit > dp[i][w]) {
                        dp[i][w] = currentProfit;
                        keep[i][w] = k;
                    }
                }
            }
        }

        // Backtrack to assemble portfolio
        const resultItems = [];
        let tempW = W;
        for (let i = N; i > 0; i--) {
            const qty = keep[i][tempW];
            if (qty > 0) {
                const stock = stocks[i - 1];
                resultItems.push({
                    symbol: stock.symbol,
                    name: stock.name,
                    price: stock.currentPrice,
                    quantity: qty
                });
                tempW -= qty * Math.floor(stock.currentPrice);
            }
        }

        return {
            recommendedPortfolio: resultItems,
            optimizedReturnScore: Number(dp[N][W].toFixed(2)),
            budgetUsed: W - tempW
        };
    }
}

module.exports = TechnicalAnalysis;
