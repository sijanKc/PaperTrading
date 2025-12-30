const mongoose = require('mongoose');

const competitionParticipantSchema = new mongoose.Schema({
    competitionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Competition',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    currentBalance: {
        type: Number,
        required: true
    },
    portfolioValue: {
        type: Number,
        default: 0
    },
    totalProfitLoss: {
        type: Number,
        default: 0
    },
    tradesCount: {
        type: Number,
        default: 0
    },
    rank: {
        type: Number
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

// Compound index to ensure a user can only join a competition once
competitionParticipantSchema.index({ competitionId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('CompetitionParticipant', competitionParticipantSchema);
