const Stock = require('../models/Stock');
const TechnicalAnalysis = require('../utils/technicalAnalysis');

// Get all stocks
const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find({ isActive: true })
      .select('symbol name sector currentPrice previousClose dayHigh dayLow volume')
      .sort({ symbol: 1 });

    res.json({
      success: true,
      count: stocks.length,
      stocks: stocks
    });
  } catch (error) {
    console.error('Get stocks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stocks'
    });
  }
};

// Get single stock by symbol
const getStockBySymbol = async (req, res) => {
  try {
    const { symbol } = req.params;
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found'
      });
    }

    res.json({
      success: true,
      stock: stock
    });
  } catch (error) {
    console.error('Get stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stock'
    });
  }
};

// Get stocks by sector
const getStocksBySector = async (req, res) => {
  try {
    const { sector } = req.params;
    const stocks = await Stock.find({
      sector: new RegExp(sector, 'i'),
      isActive: true
    });

    res.json({
      success: true,
      sector: sector,
      count: stocks.length,
      stocks: stocks
    });
  } catch (error) {
    console.error('Get sector stocks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sector stocks'
    });
  }
};

// Search stocks
const searchStocks = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query required'
      });
    }

    const stocks = await Stock.find({
      $or: [
        { symbol: new RegExp(q, 'i') },
        { name: new RegExp(q, 'i') },
        { sector: new RegExp(q, 'i') }
      ],
      isActive: true
    }).limit(10);

    res.json({
      success: true,
      query: q,
      count: stocks.length,
      stocks: stocks
    });
  } catch (error) {
    console.error('Search stocks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching stocks'
    });
  }
};

// Get top gainers
const getTopGainers = async (req, res) => {
  try {
    const stocks = await Stock.find({ isActive: true })
      .select('symbol name currentPrice previousClose')
      .sort({ currentPrice: -1 })
      .limit(5);

    // Calculate percentage change
    const stocksWithChange = stocks.map(stock => ({
      ...stock.toObject(),
      change: ((stock.currentPrice - stock.previousClose) / stock.previousClose * 100).toFixed(2)
    }));

    res.json({
      success: true,
      stocks: stocksWithChange
    });
  } catch (error) {
    console.error('Get top gainers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top gainers'
    });
  }
};

// ADMIN: Get all stocks (including inactive/hidden)
const getAdminStocks = async (req, res) => {
  try {
    const stocks = await Stock.find({}).sort({ symbol: 1 });
    res.json({ success: true, count: stocks.length, stocks });
  } catch (error) {
    console.error('Get admin stocks error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ADMIN: Create new stock
const createStock = async (req, res) => {
  try {
    const { symbol, name, sector, currentPrice, volume, marketCap, lotSize, enabled } = req.body;

    if (!symbol || !name || !currentPrice) {
      return res.status(400).json({ success: false, message: 'Please provide required fields' });
    }

    const existingStock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (existingStock) {
      return res.status(400).json({ success: false, message: 'Stock with this symbol already exists' });
    }

    const newStock = await Stock.create({
      symbol: symbol.toUpperCase(),
      name,
      sector: sector || 'Others',
      currentPrice,
      previousClose: currentPrice, // Default for new stock
      basePrice: currentPrice,     // Default
      dayHigh: currentPrice,       // Default
      dayLow: currentPrice,        // Default
      volume: volume || 0,
      marketCap: marketCap || 0,
      lotSize: lotSize || 10,
      isActive: enabled !== undefined ? enabled : true
      // defaults for other fields will be handled by schema
    });

    res.status(201).json({ success: true, message: 'Stock created successfully', stock: newStock });
  } catch (error) {
    console.error('Create stock error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ADMIN: Update stock
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent symbol change duplicates
    if (updates.symbol) {
      const existing = await Stock.findOne({ symbol: updates.symbol.toUpperCase(), _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Symbol already in use' });
      }
      updates.symbol = updates.symbol.toUpperCase();
    }

    const stock = await Stock.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }

    res.json({ success: true, message: 'Stock updated', stock });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ADMIN: Delete stock
const deleteStock = async (req, res) => {
  try {
    const { id } = req.params;
    const stock = await Stock.findByIdAndDelete(id);

    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }

    res.json({ success: true, message: 'Stock deleted successfully' });
  } catch (error) {
    console.error('Delete stock error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ADMIN: Bulk update prices
const bulkUpdatePrice = async (req, res) => {
  try {
    const { percentage, filter = {} } = req.body;

    if (percentage === undefined || isNaN(percentage)) {
      return res.status(400).json({ success: false, message: 'Invalid percentage' });
    }

    const stocks = await Stock.find(filter);
    const updates = stocks.map(async (stock) => {
      const newPrice = stock.currentPrice * (1 + (percentage / 100));
      stock.currentPrice = Math.round(newPrice * 100) / 100;
      return stock.save();
    });

    await Promise.all(updates);

    res.json({
      success: true,
      message: `Successfully updated ${stocks.length} stocks by ${percentage}%`
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get stock technical analysis (SMA, RSI)
const getStockAnalytics = async (req, res) => {
  try {
    const { symbol } = req.params;
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });

    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }

    // Extract prices from priceHistory
    const prices = stock.priceHistory.map(p => p.price);

    // Calculate metrics using DSA algorithms
    const sma20 = TechnicalAnalysis.calculateSMA(prices, 20);
    const rsi = TechnicalAnalysis.calculateRSI(prices, 14);

    res.json({
      success: true,
      symbol: stock.symbol,
      analytics: {
        currentPrice: stock.currentPrice,
        sma20: sma20[sma20.length - 1] || null, // Latest SMA
        rsi: rsi,
        recommendation: rsi > 70 ? 'SELL (Overbought)' : rsi < 30 ? 'BUY (Oversold)' : 'HOLD (Neutral)'
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getAllStocks,
  getStockBySymbol,
  getStocksBySector,
  searchStocks,
  getTopGainers,
  getAdminStocks,
  createStock,
  updateStock,
  deleteStock,
  bulkUpdatePrice,
  getStockAnalytics
};