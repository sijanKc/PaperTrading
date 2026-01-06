const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock',
    required: true
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  averageBuyPrice: {
    type: Number,
    required: true
  },
  totalInvestment: {
    type: Number,
    required: true
  },
  sector: {
    type: String,
    required: true
  },
  competitionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Competition',
    default: null // null means main portfolio
  }
}, {
  timestamps: true
});

// Create compound index for faster queries
portfolioSchema.index({ userId: 1, stockId: 1, competitionId: 1 }, { unique: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);