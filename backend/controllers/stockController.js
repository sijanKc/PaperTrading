const Stock = require('../models/Stock');

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

module.exports = {
  getAllStocks,
  getStockBySymbol,
  getStocksBySector,
  searchStocks,
  getTopGainers
};