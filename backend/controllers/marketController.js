const Stock = require('../models/Stock');

// ✅ Get All Stocks
const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find().sort({ symbol: 1 });
    
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
  
  let points = 78;
  let timeMultiplier = 1;

  switch (timeframe) {
    case '1D':
      points = 78; // 6.5 hours * 12 points per hour
      timeMultiplier = 1;
      break;
    case '1W':
      points = 35; // 7 days * 5 points per day
      timeMultiplier = 7;
      break;
    case '1M':
      points = 30; // 30 days
      timeMultiplier = 30;
      break;
    case '3M':
      points = 90; // 90 days
      timeMultiplier = 90;
      break;
    case '1Y':
      points = 52; // 52 weeks
      timeMultiplier = 365;
      break;
  }

  const basePrice = stock.currentPrice;
  const volatility = stock.volatility || 0.02;
  
  let currentPrice = basePrice;

  // Market trend based on stock performance
  let marketTrend = 0;
  if (stock.previousClose) {
    const priceChange = ((stock.currentPrice - stock.previousClose) / stock.previousClose) * 100;
    marketTrend = priceChange / 100; // Convert to decimal
  }

  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * (timeMultiplier * 60 * 60 * 1000) / points);
    
    // Realistic price movement with trend
    const open = currentPrice;
    const randomChange = (Math.random() - 0.5) * 2 * volatility * currentPrice;
    const trendChange = marketTrend * currentPrice * (i / points);
    const totalChange = randomChange + trendChange;
    
    const high = open + Math.abs(totalChange) * (0.5 + Math.random() * 0.5);
    const low = open - Math.abs(totalChange) * (0.5 + Math.random() * 0.5);
    const close = open + totalChange;

    // Ensure realistic values
    const actualHigh = Math.max(open, close, high);
    const actualLow = Math.min(open, close, low);

    currentPrice = close;

    // Realistic volume based on timeframe and price movement
    let volume = 0;
    const priceMovement = Math.abs(totalChange) / open;
    
    if (timeframe === '1D') {
      // Market hours (11 AM - 3 PM) ma high volume
      const hour = time.getHours();
      if (hour >= 11 && hour <= 15) {
        volume = Math.floor(Math.random() * 800000) + 200000 + (priceMovement * 1000000);
      } else {
        volume = Math.floor(Math.random() * 200000) + 50000 + (priceMovement * 200000);
      }
    } else {
      volume = Math.floor(Math.random() * 1000000) + 100000 + (priceMovement * 500000);
    }

    data.push({
      time: time.getTime(),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(actualHigh.toFixed(2)),
      low: parseFloat(actualLow.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(volume)
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