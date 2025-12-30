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
}

module.exports = TechnicalAnalysis;
