import axios from 'axios';

// Direct connection to your backend - make sure your backend is running on port 5000
const API_BASE_URL = 'http://localhost:5000/api';

const marketService = {
  // Get all stocks from your backend
  getAllStocks: async () => {
    try {
      console.log('📡 Fetching stocks from backend...');
      const response = await axios.get(`${API_BASE_URL}/market/stocks`);
      console.log('✅ Stocks data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching stocks from backend:', error);
      
      // Fallback data in case backend is not reachable
      return {
        success: true,
        data: [
          {
            symbol: 'NEPSE',
            name: 'NEPSE Index',
            currentPrice: 2100.50,
            previousClose: 2085.75,
            sector: 'Index',
            volatility: 0.015
          },
          {
            symbol: 'NABIL',
            name: 'Nabil Bank',
            currentPrice: 845.25,
            previousClose: 838.50,
            sector: 'Commercial Banks',
            volatility: 0.022
          }
        ]
      };
    }
  },

  // Get chart data for specific stock
  getChartData: async (symbol, timeframe = '1D') => {
    try {
      console.log(`📊 Fetching chart data for ${symbol}, timeframe: ${timeframe}`);
      const response = await axios.get(`${API_BASE_URL}/market/chart/${symbol}`, {
        params: { timeframe }
      });
      console.log('✅ Chart data received for:', symbol);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching chart data:', error);
      
      // Fallback chart data
      return {
        success: true,
        symbol: symbol,
        timeframe: timeframe,
        data: generateFallbackChartData(symbol, timeframe)
      };
    }
  },

  // Get single stock data
  getStockData: async (symbol) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/market/stock/${symbol}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stock data:', error);
      throw error;
    }
  }
};

// Fallback chart data generator
const generateFallbackChartData = (symbol, timeframe) => {
  const data = [];
  const now = new Date();
  
  let points = 78;
  let timeMultiplier = 1;
  let basePrice = 1000;

  // Base prices for different stocks
  const priceMap = {
    'NEPSE': 2100, 'NABIL': 845, 'SCB': 382, 'EBL': 518, 'NLIC': 768,
    'HBL': 280, 'NICA': 750, 'CZBIL': 380, 'SBI': 450, 'SANIMA': 320,
    'PRVU': 450, 'NIFRA': 180, 'NMB': 220, 'KBL': 240, 'ADBL': 380,
    'NTC': 680, 'NCELL': 280, 'RHPC': 180, 'SHPC': 220, 'UMHL': 320
  };

  basePrice = priceMap[symbol] || 1000;

  switch (timeframe) {
    case '1D': points = 78; timeMultiplier = 1; break;
    case '1W': points = 35; timeMultiplier = 7; break;
    case '1M': points = 30; timeMultiplier = 30; break;
    case '3M': points = 90; timeMultiplier = 90; break;
    case '1Y': points = 52; timeMultiplier = 365; break;
  }

  let currentPrice = basePrice;
  const volatility = 0.02;

  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * (timeMultiplier * 60 * 60 * 1000) / points);
    
    const open = currentPrice;
    const change = (Math.random() - 0.5) * 2 * volatility * currentPrice;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * volatility * currentPrice;
    const low = Math.min(open, close) - Math.random() * volatility * currentPrice;

    currentPrice = close;

    const volume = Math.floor(Math.random() * 1000000) + 100000;

    data.push({
      time: time.getTime(),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: volume
    });
  }

  return data;
};

export { marketService };