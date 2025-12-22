const mongoose = require('mongoose');

const strategySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    symbol: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    timeframe: {
        type: String,
        required: true,
        enum: ['1m', '5m', '15m', '30m', '1H', '4H', '1D', '1W']
    },
    parameters: {
        fastMA: Number,
        slowMA: Number,
        stopLoss: Number,
        takeProfit: Number,
        rsiOversold: Number,
        rsiOverbought: Number
    },
    results: {
        totalTrades: Number,
        winningTrades: Number,
        losingTrades: Number,
        winRate: Number,
        totalReturn: Number,
        returnPercent: Number,
        maxDrawdown: Number,
        sharpeRatio: Number,
        profitFactor: Number,
        avgWin: Number,
        avgLoss: Number,
        bestTrade: Number,
        worstTrade: Number,
        lastTest: Date
    },
    isActive: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
strategySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Strategy = mongoose.model('Strategy', strategySchema);

module.exports = Strategy;
