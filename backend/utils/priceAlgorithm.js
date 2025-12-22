const Stock = require('../models/Stock');

class ProfessionalPriceSimulator {
  constructor() {
    this.tradingDaysPerYear = 252;
    this.marketState = {
      overallTrend: 0.06,      // 6% market growth annually
      volatilityMultiplier: 1.0,
      lastUpdate: new Date()
    };
  }

  // Standard Normal Distribution using Box-Muller transform
  standardNormalRandom() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  // Geometric Brownian Motion - Industry Standard
  geometricBrownianMotion(currentPrice, annualVolatility, annualDrift, timeDelta = 1/252) {
    const dailyDrift = annualDrift * timeDelta;
    const dailyVolatility = annualVolatility * Math.sqrt(timeDelta);
    const randomShock = dailyVolatility * this.standardNormalRandom();
    
    // GBM Formula: S_t = S_0 * exp((μ - σ²/2)t + σW_t)
    const newPrice = currentPrice * Math.exp(dailyDrift - (dailyVolatility * dailyVolatility) / 2 + randomShock);
    
    return Math.max(0.01, newPrice); // Prevent negative prices
  }

  // Calculate market momentum based on all stocks
  async calculateMarketMomentum() {
    try {
      const stocks = await Stock.find({ isActive: true });
      if (stocks.length === 0) return 0;

      let totalMarketCap = 0;
      let weightedMomentum = 0;

      stocks.forEach(stock => {
        const stockMarketCap = stock.currentPrice * (stock.volume || 1000);
        totalMarketCap += stockMarketCap;
        weightedMomentum += stock.annualDrift * stockMarketCap;
      });

      const marketMomentum = weightedMomentum / totalMarketCap;
      return Math.max(-0.15, Math.min(0.15, marketMomentum));
    } catch (error) {
      console.error('Error calculating market momentum:', error);
      return 0.05; // Default bullish trend
    }
  }

  // Apply sector-specific adjustments
  applySectorEffects(price, sector, marketMomentum) {
    const sectorMultipliers = {
      'Commercial Banks': 1.1,      // More correlated with market
      'Insurance': 1.05,
      'HydroPower': 0.8,           // Less correlated
      'Finance': 1.2,              // More volatile
      'Development Bank': 0.9
    };

    const multiplier = sectorMultipliers[sector] || 1.0;
    const sectorAdjustedChange = (price * marketMomentum * multiplier) - price;
    
    return price + (sectorAdjustedChange * 0.3); // 30% sector influence
  }

  // Apply volume-based volatility
  applyVolumeEffects(price, volume, baseVolatility) {
    const volumeFactor = Math.log10(volume + 100) / Math.log10(10000);
    const adjustedVolatility = baseVolatility * (0.8 + volumeFactor * 0.4);
    
    return Math.max(0.05, Math.min(0.5, adjustedVolatility));
  }

  // Main function to update all stock prices
  async updateAllPrices() {
    try {
      const stocks = await Stock.find({ isActive: true });
      const marketMomentum = await this.calculateMarketMomentum();
      
      console.log(`🔄 Updating ${stocks.length} stocks (Market Momentum: ${(marketMomentum * 100).toFixed(2)}%)...`);

      const updatePromises = stocks.map(async (stock) => {
        try {
          // Calculate time delta (2 minutes = 2/(24*60) of trading day)
          const timeDelta = 2 / (24 * 60); // 2 minutes in trading days
          
          // Adjust volatility based on volume
          const adjustedVolatility = this.applyVolumeEffects(
            stock.currentPrice, 
            stock.volume, 
            stock.annualVolatility
          );

          // Adjust drift based on market momentum and stock beta
          const adjustedDrift = stock.annualDrift + (marketMomentum * stock.beta);

          // Generate new price using GBM
          let newPrice = this.geometricBrownianMotion(
            stock.currentPrice,
            adjustedVolatility,
            adjustedDrift,
            timeDelta
          );

          // Apply sector effects
          newPrice = this.applySectorEffects(newPrice, stock.sector, marketMomentum);

          // Ensure reasonable bounds (30% to 300% of base price)
          newPrice = Math.max(stock.basePrice * 0.3, newPrice);
          newPrice = Math.min(stock.basePrice * 3.0, newPrice);

          // Round to 2 decimal places
          newPrice = Math.round(newPrice * 100) / 100;

          // Generate random volume increase (100-5000 shares)
          const volumeIncrease = Math.floor(100 + Math.random() * 4900);

          // Update stock
          await Stock.findByIdAndUpdate(stock._id, {
            previousClose: stock.currentPrice,
            currentPrice: newPrice,
            dayHigh: Math.max(stock.dayHigh || newPrice, newPrice),
            dayLow: Math.min(stock.dayLow || newPrice, newPrice),
            volume: stock.volume + volumeIncrease,
            $push: {
              priceHistory: {
                price: newPrice,
                timestamp: new Date()
              }
            }
          });

          const change = ((newPrice - stock.currentPrice) / stock.currentPrice * 100);
          console.log(`📈 ${stock.symbol}: ₹${stock.currentPrice} → ₹${newPrice} (${change > 0 ? '+' : ''}${change.toFixed(2)}%)`);

          return { symbol: stock.symbol, oldPrice: stock.currentPrice, newPrice, change };
        } catch (error) {
          console.error(`Error updating ${stock.symbol}:`, error);
          return null;
        }
      });

      const results = await Promise.all(updatePromises);
      const successfulUpdates = results.filter(r => r !== null);
      
      console.log(`✅ ${successfulUpdates.length}/${stocks.length} stocks updated successfully!`);
      this.marketState.lastUpdate = new Date();
      
      return successfulUpdates;
    } catch (error) {
      console.error('❌ Error in updateAllPrices:', error);
      throw error;
    }
  }

  // Get market statistics
  async getMarketStats() {
    const stocks = await Stock.find({ isActive: true });
    const totalChange = stocks.reduce((sum, stock) => {
      return sum + ((stock.currentPrice - stock.previousClose) / stock.previousClose);
    }, 0);
    
    const averageChange = (totalChange / stocks.length) * 100;
    
    return {
      totalStocks: stocks.length,
      averageDailyChange: averageChange.toFixed(2) + '%',
      lastUpdate: this.marketState.lastUpdate,
      marketSentiment: averageChange >= 0 ? 'Bullish' : 'Bearish'
    };
  }
}

module.exports = ProfessionalPriceSimulator;