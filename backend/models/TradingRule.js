const mongoose = require('mongoose');

const tradingRuleSchema = new mongoose.Schema({
    // There should only be one document in this collection
    // representing the current active trading rules

    // Basic Limits
    dailyTradeLimit: {
        type: Number,
        default: 50000,
        required: true
    },
    perTradeLimit: {
        type: Number,
        default: 10000,
        required: true
    },
    minTradeAmount: {
        type: Number,
        default: 500,
        required: true
    },

    // Risk Management
    maxDailyLossPercent: {
        type: Number,
        default: 20,
        required: true
    },
    maxPortfolioLossPercent: {
        type: Number,
        default: 30,
        required: true
    },
    stopLossEnabled: {
        type: Boolean,
        default: true
    },
    stopLossPercent: {
        type: Number,
        default: 10
    },

    // Trading Hours (NEPSE)
    marketOpenTime: {
        type: String,
        default: "09:15",
        required: true
    },
    marketCloseTime: {
        type: String,
        default: "15:30",
        required: true
    },
    preMarketOpen: {
        type: String,
        default: "09:00"
    },
    postMarketClose: {
        type: String,
        default: "16:00"
    },

    // Stock Limits
    maxStocksPerTrade: {
        type: Number,
        default: 5,
        required: true
    },
    maxHoldingsPerStock: {
        type: Number,
        default: 1000
    },
    minHoldingPeriod: {
        type: Number,
        default: 1 // days
    },

    // Commission & Fees
    commissionRate: {
        type: Number,
        default: 0.001 // 0.1%
    },
    dpCharge: {
        type: Number,
        default: 25
    },
    sebonFee: {
        type: Number,
        default: 0.00015 // 0.015%
    },

    // Sector Limits (percentage)
    sectorLimits: {
        banking: { type: Number, default: 40 },
        finance: { type: Number, default: 30 },
        insurance: { type: Number, default: 25 },
        hydropower: { type: Number, default: 20 },
        others: { type: Number, default: 15 }
    },

    // Order Types
    allowedOrderTypes: {
        type: [String],
        default: ['market', 'limit']
    },
    shortSellingAllowed: {
        type: Boolean,
        default: false
    },
    marginTradingAllowed: {
        type: Boolean,
        default: false
    },

    // Advanced Rules
    volatilityCircuitBreaker: {
        type: Boolean,
        default: true
    },
    maxPriceChangePercent: {
        type: Number,
        default: 10
    },
    coolOffPeriod: {
        type: Number,
        default: 15 // minutes
    },

    // Metadata
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
tradingRuleSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('TradingRule', tradingRuleSchema);
