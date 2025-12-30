const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  previousClose: {
    type: Number,
    required: true
  },
  change: {
    type: Number,
    default: 0
  },
  changePercent: {
    type: Number,
    default: 0
  },
  volume: {
    type: Number,
    default: 0
  },
  sector: {
    type: String,
    required: true
  },
  dayHigh: {
    type: Number,
    required: true
  },
  dayLow: {
    type: Number,
    required: true
  },
  marketCap: {
    type: Number,
    default: 0
  },
  lotSize: {
    type: Number,
    default: 10
  },
  isActive: {
    type: Boolean,
    default: true
  },

  // 🔥 NEW FIELDS FOR ANALYTICS & PRICE SIMULATION
  basePrice: {
    type: Number,
    required: true
  },
  annualVolatility: {
    type: Number,
    default: 0.2,
    min: 0.05,
    max: 0.8
  },
  annualDrift: {
    type: Number,
    default: 0.08
  },
  beta: {
    type: Number,
    default: 1.0,
    min: 0.1,
    max: 2.5
  },
  priceHistory: [{
    price: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    volume: {
      type: Number,
      default: 0
    }
  }],

  // 📊 ADDITIONAL ANALYTICS FIELDS
  averageVolume: {
    type: Number,
    default: 0
  },
  peRatio: {
    type: Number,
    default: 0
  },
  dividendYield: {
    type: Number,
    default: 0
  },
  eps: {
    type: Number,
    default: 0
  },

  // 🏢 COMPANY INFORMATION
  companyInfo: {
    description: String,
    founded: Date,
    employees: Number,
    headquarters: String,
    website: String
  },

  // 📈 TECHNICAL INDICATORS (for advanced analytics)
  technicals: {
    movingAverage20: Number,
    movingAverage50: Number,
    rsi: Number,
    macd: Number,
    support: Number,
    resistance: Number
  },

  // 🔍 RISK METRICS
  riskMetrics: {
    standardDeviation: Number,
    var95: Number, // Value at Risk 95%
    expectedShortfall: Number
  }

}, {
  timestamps: true
});

// Calculate change and changePercent before save
stockSchema.pre('save', function (next) {
  if (this.previousClose && this.currentPrice) {
    this.change = this.currentPrice - this.previousClose;
    this.changePercent = (this.change / this.previousClose) * 100;
  }

  // Update day high and low if current price exceeds them
  if (this.currentPrice > this.dayHigh) {
    this.dayHigh = this.currentPrice;
  }
  if (this.currentPrice < this.dayLow) {
    this.dayLow = this.currentPrice;
  }

  // Add to price history when price changes significantly
  if (this.isModified('currentPrice')) {
    const lastPrice = this.priceHistory.length > 0 ?
      this.priceHistory[this.priceHistory.length - 1].price : null;

    if (!lastPrice || Math.abs(this.currentPrice - lastPrice) / lastPrice > 0.001) {
      this.priceHistory.push({
        price: this.currentPrice,
        timestamp: new Date(),
        volume: this.volume
      });

      // Keep only last 1000 price points to prevent bloating
      if (this.priceHistory.length > 1000) {
        this.priceHistory = this.priceHistory.slice(-1000);
      }
    }
  }

  next();
});

// Index for better query performance
stockSchema.index({ symbol: 1 });
stockSchema.index({ sector: 1 });
stockSchema.index({ isActive: 1 });
stockSchema.index({ 'priceHistory.timestamp': 1 });
stockSchema.index({ currentPrice: 1 });
stockSchema.index({ changePercent: 1 });

// Virtual for market cap (if not provided)
stockSchema.virtual('calculatedMarketCap').get(function () {
  if (this.marketCap > 0) return this.marketCap;

  // Simple calculation based on average volume and price
  const avgVolume = this.averageVolume || this.volume;
  return this.currentPrice * avgVolume * 0.1; // Rough estimate
});

// Method to get historical prices for a time range
stockSchema.methods.getHistoricalPrices = function (startDate, endDate) {
  return this.priceHistory.filter(entry =>
    entry.timestamp >= startDate && entry.timestamp <= endDate
  ).sort((a, b) => a.timestamp - b.timestamp);
};

// Method to calculate volatility
stockSchema.methods.calculateVolatility = function (days = 30) {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

  const historicalPrices = this.getHistoricalPrices(startDate, endDate);
  if (historicalPrices.length < 2) return this.annualVolatility;

  const returns = [];
  for (let i = 1; i < historicalPrices.length; i++) {
    const returnVal = (historicalPrices[i].price - historicalPrices[i - 1].price) / historicalPrices[i - 1].price;
    returns.push(returnVal);
  }

  const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
  const dailyVolatility = Math.sqrt(variance);

  // Convert to annual volatility (assuming 252 trading days)
  return dailyVolatility * Math.sqrt(252);
};

// Static method to find stocks by performance
stockSchema.statics.findByPerformance = function (minReturn = 0, maxVolatility = 1) {
  return this.find({
    changePercent: { $gte: minReturn },
    annualVolatility: { $lte: maxVolatility },
    isActive: true
  }).sort({ changePercent: -1 });
};

// Static method to get sector performance
stockSchema.statics.getSectorPerformance = async function () {
  const sectors = await this.distinct('sector');
  const sectorPerformance = [];

  for (const sector of sectors) {
    const stocks = await this.find({ sector, isActive: true });
    const avgReturn = stocks.reduce((sum, stock) => sum + stock.changePercent, 0) / stocks.length;
    const avgVolatility = stocks.reduce((sum, stock) => sum + stock.annualVolatility, 0) / stocks.length;

    sectorPerformance.push({
      sector,
      averageReturn: parseFloat(avgReturn.toFixed(2)),
      averageVolatility: parseFloat(avgVolatility.toFixed(2)),
      stockCount: stocks.length
    });
  }

  return sectorPerformance.sort((a, b) => b.averageReturn - a.averageReturn);
};

module.exports = mongoose.model('Stock', stockSchema);