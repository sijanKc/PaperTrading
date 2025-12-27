const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
  orderType: {
    type: String,
    enum: ['BUY', 'SELL'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0.01
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  orderStatus: {
    type: String,
    enum: ['PENDING', 'EXECUTED', 'CANCELLED', 'FAILED'],
    default: 'PENDING'
  },
  executedPrice: {
    type: Number
  },
  executedAt: {
    type: Date
  },
  note: {
    type: String  // For stop-loss, circuit breaker, etc.
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);