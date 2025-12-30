const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    status: {
        type: String,
        enum: ['upcoming', 'active', 'completed'],
        default: 'upcoming'
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    maxParticipants: {
        type: Number,
        default: 100
    },
    entryFee: {
        type: Number,
        default: 0
    },
    prizePool: {
        type: Number,
        default: 0
    },
    startingBalance: {
        type: Number,
        required: true,
        default: 100000
    },
    rules: {
        maxDailyTrades: { type: Number, default: 10 },
        allowedSectors: { type: [String], default: ['All'] },
        minHoldingPeriod: { type: Number, default: 1 }, // in days
        shortSelling: { type: Boolean, default: false },
        marginTrading: { type: Boolean, default: false }
    },
    prizes: [
        {
            position: Number,
            prize: String
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Competition', competitionSchema);
