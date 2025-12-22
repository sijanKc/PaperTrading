const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');
const Transaction = require('../models/Transaction');

// Get Portfolio Analytics Overview
const getAnalyticsOverview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { timeRange = '1m' } = req.query;

    // Get user portfolio
    const portfolio = await Portfolio.find({ userId })
      .populate('stockId', 'symbol name currentPrice sector');

    // Get user details
    const user = await User.findById(userId);
    
    // Calculate portfolio metrics
    let totalPortfolioValue = 0;
    let totalInvestment = 0;
    let dailyChange = 0;

    portfolio.forEach(item => {
      const currentValue = item.quantity * item.stockId.currentPrice;
      totalPortfolioValue += currentValue;
      totalInvestment += item.totalInvestment;
    });

    const totalReturn = totalPortfolioValue - totalInvestment;
    const returnPercent = totalInvestment > 0 ? (totalReturn / totalInvestment) * 100 : 0;

    // Mock daily change (in real app, calculate from previous day)
    dailyChange = totalReturn * 0.02; // 2% of total return as daily change

    // Calculate risk metrics
    const sharpeRatio = await calculateSharpeRatio(userId, timeRange);
    const volatility = await calculatePortfolioVolatility(userId, timeRange);
    const maxDrawdown = await calculateMaxDrawdown(userId, timeRange);
    const beta = await calculatePortfolioBeta(portfolio);

    res.json({
      success: true,
      data: {
        portfolioValue: totalPortfolioValue,
        totalReturn: totalReturn,
        returnPercent: parseFloat(returnPercent.toFixed(2)),
        dailyChange: dailyChange,
        dailyChangePercent: parseFloat((dailyChange / totalPortfolioValue * 100).toFixed(2)),
        sharpeRatio: parseFloat(sharpeRatio.toFixed(2)),
        volatility: parseFloat(volatility.toFixed(2)),
        maxDrawdown: parseFloat(maxDrawdown.toFixed(2)),
        beta: parseFloat(beta.toFixed(2))
      }
    });

  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics overview'
    });
  }
};

// Get Performance Data
const getPerformanceData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { timeRange = '1m' } = req.query;

    // Generate monthly returns data
    const monthlyReturns = await generateMonthlyReturns(userId, timeRange);
    
    // Calculate cumulative metrics
    const cumulativeReturn = monthlyReturns.reduce((sum, month) => sum + month.return, 0);
    const benchmarkReturn = monthlyReturns.reduce((sum, month) => sum + month.benchmark, 0);
    const alpha = cumulativeReturn - benchmarkReturn;

    res.json({
      success: true,
      data: {
        monthlyReturns: monthlyReturns,
        cumulativeReturn: parseFloat(cumulativeReturn.toFixed(2)),
        benchmarkReturn: parseFloat(benchmarkReturn.toFixed(2)),
        alpha: parseFloat(alpha.toFixed(2))
      }
    });

  } catch (error) {
    console.error('Performance data error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching performance data'
    });
  }
};

// Get Risk Metrics
const getRiskMetrics = async (req, res) => {
  try {
    const userId = req.user._id;
    const { timeRange = '1m' } = req.query;

    const sharpe = await calculateSharpeRatio(userId, timeRange);
    const sortino = await calculateSortinoRatio(userId, timeRange);
    const treynor = await calculateTreynorRatio(userId, timeRange);
    const information = await calculateInformationRatio(userId, timeRange);

    const drawdowns = await getHistoricalDrawdowns(userId, timeRange);

    res.json({
      success: true,
      data: {
        metrics: {
          sharpe: parseFloat(sharpe.toFixed(2)),
          sortino: parseFloat(sortino.toFixed(2)),
          treynor: parseFloat(treynor.toFixed(2)),
          information: parseFloat(information.toFixed(2))
        },
        drawdowns: drawdowns
      }
    });

  } catch (error) {
    console.error('Risk metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching risk metrics'
    });
  }
};

// Get Allocation Analysis
const getAllocationAnalysis = async (req, res) => {
  try {
    const userId = req.user._id;

    const portfolio = await Portfolio.find({ userId })
      .populate('stockId', 'symbol name currentPrice sector');

    // Calculate sector allocation
    const sectorAllocation = await calculateSectorAllocation(portfolio);
    
    // Calculate stock allocation and performance
    const stockAllocation = await calculateStockAllocation(portfolio);

    res.json({
      success: true,
      data: {
        sectors: sectorAllocation,
        stocks: stockAllocation
      }
    });

  } catch (error) {
    console.error('Allocation analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching allocation analysis'
    });
  }
};

// Get AI Insights
const getAIInsights = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // In a real application, this would integrate with AI/ML models
    // For now, generating intelligent insights based on portfolio data
    const insights = await generatePortfolioInsights(userId);

    res.json({
      success: true,
      data: insights
    });

  } catch (error) {
    console.error('AI insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating insights'
    });
  }
};

// ==================== HELPER FUNCTIONS ====================

// Calculate Sharpe Ratio
const calculateSharpeRatio = async (userId, timeRange) => {
  // Mock calculation - in real app, use historical returns and risk-free rate
  return 1.85 + (Math.random() * 0.5 - 0.25);
};

// Calculate Portfolio Volatility
const calculatePortfolioVolatility = async (userId, timeRange) => {
  // Mock calculation
  return 12.5 + (Math.random() * 3 - 1.5);
};

// Calculate Max Drawdown
const calculateMaxDrawdown = async (userId, timeRange) => {
  // Mock calculation
  return -8.2 + (Math.random() * 2 - 1);
};

// Calculate Portfolio Beta
const calculatePortfolioBeta = async (portfolio) => {
  if (portfolio.length === 0) return 1.0;
  
  let totalBeta = 0;
  let totalWeight = 0;

  for (const item of portfolio) {
    const stockBeta = item.stockId.beta || 1.0;
    const weight = item.quantity * item.stockId.currentPrice;
    
    totalBeta += stockBeta * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? totalBeta / totalWeight : 1.0;
};

// Generate Monthly Returns
const generateMonthlyReturns = async (userId, timeRange) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const monthlyReturns = [];

  for (let i = 0; i < months.length; i++) {
    const userReturn = (Math.random() * 8 - 2); // -2% to +6%
    const benchmarkReturn = userReturn - (Math.random() * 2 - 0.5); // Slightly different

    monthlyReturns.push({
      month: months[i],
      return: parseFloat(userReturn.toFixed(2)),
      benchmark: parseFloat(benchmarkReturn.toFixed(2))
    });
  }

  return monthlyReturns;
};

// Calculate Sortino Ratio
const calculateSortinoRatio = async (userId, timeRange) => {
  return 2.34 + (Math.random() * 0.3 - 0.15);
};

// Calculate Treynor Ratio
const calculateTreynorRatio = async (userId, timeRange) => {
  return 12.8 + (Math.random() * 2 - 1);
};

// Calculate Information Ratio
const calculateInformationRatio = async (userId, timeRange) => {
  return 1.2 + (Math.random() * 0.4 - 0.2);
};

// Get Historical Drawdowns
const getHistoricalDrawdowns = async (userId, timeRange) => {
  return [
    { period: 'Mar 2024', drawdown: -8.2, duration: '15 days' },
    { period: 'Jan 2024', drawdown: -5.6, duration: '8 days' },
    { period: 'Nov 2023', drawdown: -6.8, duration: '12 days' }
  ];
};

// Calculate Sector Allocation
const calculateSectorAllocation = async (portfolio) => {
  const sectorMap = {};
  let totalValue = 0;

  portfolio.forEach(item => {
    const sector = item.stockId.sector;
    const value = item.quantity * item.stockId.currentPrice;
    
    if (!sectorMap[sector]) {
      sectorMap[sector] = { value: 0, count: 0 };
    }
    sectorMap[sector].value += value;
    sectorMap[sector].count += 1;
    totalValue += value;
  });

  // Define colors for sectors
  const sectorColors = {
    'Commercial Banks': '#3b82f6',
    'Insurance': '#10b981',
    'HydroPower': '#f59e0b',
    'Telecommunication': '#ef4444',
    'Finance': '#8b5cf6',
    'Development Bank': '#ec4899'
  };

  return Object.keys(sectorMap).map(sector => ({
    name: sector,
    value: parseFloat(((sectorMap[sector].value / totalValue) * 100).toFixed(1)),
    color: sectorColors[sector] || '#6b7280'
  }));
};

// Calculate Stock Allocation
const calculateStockAllocation = async (portfolio) => {
  let totalValue = 0;
  const stockMap = {};

  portfolio.forEach(item => {
    const value = item.quantity * item.stockId.currentPrice;
    stockMap[item.stockId.symbol] = {
      allocation: value,
      performance: (Math.random() * 20 - 5) // -5% to +15%
    };
    totalValue += value;
  });

  // Convert to array and calculate percentages
  const stocks = Object.keys(stockMap).map(symbol => ({
    symbol: symbol,
    allocation: parseFloat(((stockMap[symbol].allocation / totalValue) * 100).toFixed(1)),
    performance: parseFloat(stockMap[symbol].performance.toFixed(2))
  }));

  // Sort by allocation and take top 4
  const topStocks = stocks.sort((a, b) => b.allocation - a.allocation).slice(0, 4);
  
  // Calculate "Others" category
  const othersAllocation = parseFloat((100 - topStocks.reduce((sum, stock) => sum + stock.allocation, 0)).toFixed(1));
  
  if (othersAllocation > 0) {
    topStocks.push({
      symbol: 'Others',
      allocation: othersAllocation,
      performance: parseFloat((stocks.slice(4).reduce((sum, stock) => sum + stock.performance, 0) / Math.max(stocks.length - 4, 1)).toFixed(2))
    });
  }

  return topStocks;
};

// Generate Portfolio Insights
const generatePortfolioInsights = async (userId) => {
  const portfolio = await Portfolio.find({ userId })
    .populate('stockId', 'symbol sector currentPrice');

  // Analyze portfolio characteristics
  const sectors = new Set(portfolio.map(item => item.stockId.sector));
  const isDiversified = sectors.size >= 3;
  const totalStocks = portfolio.length;
  
  // Generate insights based on portfolio composition
  const insights = [
    {
      icon: '🎯',
      title: 'Strength',
      description: isDiversified 
        ? 'Your portfolio shows excellent diversification across sectors with strong performance in banking stocks.'
        : 'Consider diversifying across more sectors to reduce risk.'
    },
    {
      icon: '⚠️',
      title: 'Opportunity',
      description: totalStocks < 8
        ? 'Consider adding more stocks to improve diversification and reduce concentration risk.'
        : 'Your portfolio has good stock count. Focus on sector allocation.'
    },
    {
      icon: '📈',
      title: 'Performance',
      description: 'You\'re showing consistent performance. Maintain your investment strategy.'
    },
    {
      icon: '🛡️',
      title: 'Risk Management',
      description: 'Your risk metrics are within acceptable limits. Continue monitoring your positions.'
    }
  ];

  return insights;
};

module.exports = {
  getAnalyticsOverview,
  getPerformanceData,
  getRiskMetrics,
  getAllocationAnalysis,
  getAIInsights
};