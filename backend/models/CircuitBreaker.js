const mongoose = require('mongoose');

const circuitBreakerSchema = new mongoose.Schema({
    stockId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stock',
        required: true,
        unique: true  // Only one circuit breaker per stock
    },
    symbol: {
        type: String,
        required: true
    },
    triggeredAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    resumesAt: {
        type: Date,
        required: true
    },
    priceChange: {
        type: Number,  // The percentage change that triggered it
        required: true
    },
    oldPrice: {
        type: Number,
        required: true
    },
    newPrice: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

// Index for quick lookups
circuitBreakerSchema.index({ stockId: 1, isActive: 1 });
circuitBreakerSchema.index({ resumesAt: 1 });

module.exports = mongoose.model('CircuitBreaker', circuitBreakerSchema);
