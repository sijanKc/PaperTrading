const Stock = require('../models/Stock');

// ✅ Get All Stocks
const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find({ isActive: true }).sort({ symbol: 1 });

    res.status(200).json({
      success: true,
      count: stocks.length,
      data: stocks
    });
  } catch (error) {
    console.error('Error fetching all stocks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stocks data'
    });
  }
};

// ✅ Get Single Stock Data
const getStockData = async (req, res) => {
  try {
    const { symbol } = req.params;

    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found'
      });
    }

    res.status(200).json({
      success: true,
      data: stock
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stock data'
    });
  }
};

// ✅ Get Chart Data
const getChartData = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '1D' } = req.query;

    console.log(`📊 Chart data requested for: ${symbol}, timeframe: ${timeframe}`);

    // Stock khojne
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found'
      });
    }

    // Real stock data bata chart data generate garne
    const chartData = await generateChartDataFromStock(timeframe, stock);

    res.json({
      success: true,
      symbol: stock.symbol,
      name: stock.name,
      timeframe: timeframe,
      data: chartData
    });

  } catch (error) {
    console.error('Chart data error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chart data'
    });
  }
};

// ✅ Real Stock Data bata Chart Data Generate Garne
const generateChartDataFromStock = async (timeframe, stock) => {
  const data = [];
  const now = new Date();

  // Use real history if available
  if (stock.priceHistory && stock.priceHistory.length > 0) {
    let historyToShow = [];
    const points = getPointsForTimeframe(timeframe);
    const startTime = getStartTimeForTimeframe(timeframe);

    // Filter history by timeframe
    const filteredHistory = stock.priceHistory.filter(h => h.timestamp >= startTime);

    if (filteredHistory.length > 5) {
      // If we have enough real history, use it
      return filteredHistory.map((h, i) => {
        const prev = i > 0 ? filteredHistory[i - 1] : h;
        return {
          time: h.timestamp.getTime(),
          open: parseFloat(prev.price.toFixed(2)),
          high: parseFloat(Math.max(h.price, prev.price).toFixed(2)),
          low: parseFloat(Math.min(h.price, prev.price).toFixed(2)),
          close: parseFloat(h.price.toFixed(2)),
          volume: h.volume || Math.floor(Math.random() * 100000)
        };
      });
    }
  }

  // Fallback to simulation if history is empty or too short
  return simulateChartData(timeframe, stock);
};

// Helper to get needed data points
const getPointsForTimeframe = (timeframe) => {
  const map = { '1D': 78, '1W': 35, '1M': 30, '3M': 90, '1Y': 52 };
  return map[timeframe] || 78;
};

// Helper to get start time
const getStartTimeForTimeframe = (timeframe) => {
  const now = new Date();
  switch (timeframe) {
    case '1D': return new Date(now.setHours(now.getHours() - 24));
    case '1W': return new Date(now.setDate(now.getDate() - 7));
    case '1M': return new Date(now.setMonth(now.setMonth() - 1));
    case '3M': return new Date(now.setMonth(now.setMonth() - 3));
    case '1Y': return new Date(now.setFullYear(now.getFullYear() - 1));
    default: return new Date(now.setHours(now.getHours() - 24));
  }
};

// Original simulation logic moved to helper
const simulateChartData = (timeframe, stock) => {
  const data = [];
  const now = new Date();
  const points = getPointsForTimeframe(timeframe);
  const basePrice = stock.currentPrice;
  const volatility = stock.volatility || 0.02;

  let currentPrice = basePrice;
  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - (i * 15 * 60 * 1000)); // 15 min steps
    const open = currentPrice;
    const change = (Math.random() - 0.5) * 2 * volatility * currentPrice;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 0.005 * currentPrice;
    const low = Math.min(open, close) - Math.random() * 0.005 * currentPrice;
    currentPrice = close;

    data.push({
      time: time.getTime(),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(Math.random() * 500000) + 100000
    });
  }
  return data;
};

// ✅ Export all functions
module.exports = {
  getAllStocks,
  getStockData, // ✅ Add this missing function
  getChartData
};