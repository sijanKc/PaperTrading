const Stock = require('../models/Stock');
const User = require('../models/User');

// Get News Feed
const getNewsFeed = async (req, res) => {
  try {
    const { category = 'all', search = '', page = 1, limit = 20 } = req.query;
    const userId = req.user._id;

    // In a real app, you'd fetch from a news API or database
    // For now, generating realistic NEPSE news
    const newsItems = await generateNepseNews();

    // Filter by category
    let filteredNews = newsItems;
    if (category !== 'all') {
      filteredNews = newsItems.filter(item => item.category === category);
    }

    // Filter by search term
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredNews = filteredNews.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.summary.toLowerCase().includes(searchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        item.relatedStocks.some(stock => stock.toLowerCase().includes(searchTerm))
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedNews = filteredNews.slice(startIndex, endIndex);

    // Get market sentiment and trending stocks
    const marketSentiment = await getMarketSentiment();
    const trendingStocks = await getTrendingStocks();

    res.json({
      success: true,
      data: {
        news: paginatedNews,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(filteredNews.length / limit),
          totalItems: filteredNews.length
        },
        marketSentiment,
        trendingStocks,
        stats: {
          totalNews: newsItems.length,
          positive: newsItems.filter(n => n.sentiment === 'positive').length,
          negative: newsItems.filter(n => n.sentiment === 'negative').length,
          highImpact: newsItems.filter(n => n.impact === 'high').length
        }
      }
    });

  } catch (error) {
    console.error('Get news feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching news feed'
    });
  }
};

// Get News Details
const getNewsDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // In real app, fetch from database
    const newsItem = await generateNewsById(id);

    if (!newsItem) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    // Track news view (for analytics)
    await trackNewsView(req.user._id, id);

    res.json({
      success: true,
      data: newsItem
    });

  } catch (error) {
    console.error('Get news details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching news details'
    });
  }
};

// Get Market Sentiment
const getMarketSentiment = async () => {
  // Analyze recent news and stock performance
  const stocks = await Stock.find({ isActive: true });
  
  const positiveStocks = stocks.filter(stock => stock.changePercent > 0).length;
  const totalStocks = stocks.length;
  
  const bullishPercentage = Math.round((positiveStocks / totalStocks) * 100);
  const bearishPercentage = Math.round(((totalStocks - positiveStocks) / totalStocks) * 100);
  const neutralPercentage = 100 - bullishPercentage - bearishPercentage;

  return {
    bullish: bullishPercentage,
    bearish: bearishPercentage,
    neutral: neutralPercentage,
    overall: bullishPercentage > 60 ? 'bullish' : bearishPercentage > 60 ? 'bearish' : 'neutral'
  };
};

// Get Trending Stocks
const getTrendingStocks = async () => {
  const stocks = await Stock.find({ isActive: true })
    .sort({ volume: -1, changePercent: -1 })
    .limit(10);

  return stocks.map(stock => ({
    symbol: stock.symbol,
    name: stock.name,
    price: stock.currentPrice,
    change: stock.change,
    changePercent: stock.changePercent,
    volume: stock.volume
  }));
};

// Helper Functions
const generateNepseNews = async () => {
  const stocks = await Stock.find({ isActive: true });
  const newsCategories = ['market', 'policy', 'earnings', 'sector', 'corporate', 'regulation', 'analysis'];
  
  const newsItems = [];
  const now = new Date();

  // Generate market news
  newsItems.push({
    id: 1,
    title: 'NEPSE Index Surges to Record High Amid Strong Investor Confidence',
    summary: 'The Nepal Stock Exchange (NEPSE) index gained 45.67 points today, closing at 2,215.34 points, the highest in history.',
    content: `The Nepal Stock Exchange witnessed a historic trading session today as the NEPSE index surged by 45.67 points to close at an all-time high of 2,215.34 points. The bullish trend was driven by strong performances in the banking and insurance sectors.

Trading volume reached NPR 4.5 billion with over 8.2 million shares traded. Commercial banks led the rally with NIBL, SCB, and NABIL showing significant gains.

Market analysts attribute this surge to improved economic indicators and positive investor sentiment following the recent monetary policy announcement.`,
    category: 'market',
    source: 'NEPSE Official',
    author: 'Market Desk',
    publishedAt: new Date(now.getTime() - 30 * 60 * 1000),
    readTime: '2 min read',
    sentiment: 'positive',
    tags: ['NEPSE', 'Stock Market', 'Record High', 'Investor Confidence'],
    impact: 'high',
    relatedStocks: ['NIBL', 'SCB', 'NABIL', 'NICA']
  });

  // Generate policy news
  newsItems.push({
    id: 2,
    title: 'NRB Announces New Monetary Policy for FY 2081/82',
    summary: 'Nepal Rastra Bank introduces measures to control inflation and support economic growth in the new fiscal year.',
    content: `Nepal Rastra Bank (NRB) has unveiled its monetary policy for the fiscal year 2081/82, focusing on controlling inflation while supporting economic growth. Key measures include:

• Bank rate maintained at 7.5%
• Statutory liquidity ratio revised to 10%
• Credit to deposit ratio cap at 85%
• Focus on productive sector lending

The policy aims to maintain inflation around 6.5% while supporting GDP growth of 6%. Banking stocks are expected to react positively to these measures.`,
    category: 'policy',
    source: 'NRB Press Release',
    author: 'Economic Bureau',
    publishedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    readTime: '3 min read',
    sentiment: 'neutral',
    tags: ['Monetary Policy', 'NRB', 'Banking', 'Economy'],
    impact: 'high',
    relatedStocks: ['NIBL', 'SCB', 'MBL', 'SBI']
  });

  // Generate earnings news
  const randomStock = stocks[Math.floor(Math.random() * stocks.length)];
  newsItems.push({
    id: 3,
    title: `${randomStock.name} Reports Strong Quarterly Results`,
    summary: `${randomStock.symbol} announces impressive quarterly results with significant growth in net profit.`,
    content: `${randomStock.name} (${randomStock.symbol}) has reported outstanding financial results for the latest quarter. The company posted strong growth across key metrics, driven by improved operational efficiency and market demand.

Key financial highlights show consistent performance and strategic growth initiatives paying off. Market analysts have maintained positive outlook on the stock.`,
    category: 'earnings',
    source: 'Company Filing',
    author: 'Financial Reporter',
    publishedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
    readTime: '2 min read',
    sentiment: 'positive',
    tags: [randomStock.symbol, 'Earnings', 'Quarterly Results', randomStock.sector],
    impact: 'medium',
    relatedStocks: [randomStock.symbol]
  });

  // Add more news items based on current stock performance
  stocks.forEach((stock, index) => {
    if (index < 5 && Math.random() > 0.5) {
      const sentiment = stock.changePercent > 0 ? 'positive' : stock.changePercent < 0 ? 'negative' : 'neutral';
      
      newsItems.push({
        id: newsItems.length + 1,
        title: `${stock.symbol} ${stock.changePercent > 0 ? 'Gains' : 'Declines'} Amid ${stock.sector} Sector Movement`,
        summary: `${stock.symbol} traded ${stock.changePercent > 0 ? 'higher' : 'lower'} today, closing at NPR ${stock.currentPrice}.`,
        content: `${stock.name} (${stock.symbol}) saw ${Math.abs(stock.changePercent)}% ${stock.changePercent > 0 ? 'gain' : 'decline'} in today's trading session. The stock closed at NPR ${stock.currentPrice} with volume of ${stock.volume.toLocaleString()} shares.

Analysts attribute this movement to sector-wide trends and company-specific developments. Investors are advised to monitor upcoming announcements and market conditions.`,
        category: 'market',
        source: 'Market Update',
        author: 'Trading Desk',
        publishedAt: new Date(now.getTime() - (6 + index) * 60 * 60 * 1000),
        readTime: '1 min read',
        sentiment: sentiment,
        tags: [stock.symbol, stock.sector, 'Stock Update', 'Trading'],
        impact: 'low',
        relatedStocks: [stock.symbol]
      });
    }
  });

  return newsItems.sort((a, b) => b.publishedAt - a.publishedAt);
};

const generateNewsById = async (id) => {
  const allNews = await generateNepseNews();
  return allNews.find(news => news.id === parseInt(id));
};

const trackNewsView = async (userId, newsId) => {
  // In real app, track news views for personalization
  console.log(`User ${userId} viewed news ${newsId}`);
};

module.exports = {
  getNewsFeed,
  getNewsDetails
};