import React, { useState, useEffect } from 'react';
import { 
  Card, 
  ListGroup, 
  Badge, 
  Button, 
  Form, 
  InputGroup,
  Dropdown,
  Modal,
  Spinner
} from 'react-bootstrap';
import styles from '../css/NewsFeed.module.css';

const NewsFeed = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [theme, setTheme] = useState('dark');

  // Sidebar state detection
  useEffect(() => {
    const checkSidebarState = () => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        const isCollapsed = sidebar.classList.contains('sidebar-collapsed');
        setSidebarCollapsed(isCollapsed);
      }
    };

    checkSidebarState();
    const interval = setInterval(checkSidebarState, 50);
    return () => clearInterval(interval);
  }, []);

  // Theme detection
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  // Sample NEPSE and financial news data
  const sampleNews = [
    {
      id: 1,
      title: 'NEPSE Index Surges to Record High Amid Strong Investor Confidence',
      summary: 'The Nepal Stock Exchange (NEPSE) index gained 45.67 points today, closing at 2,215.34 points, the highest in history.',
      content: `The Nepal Stock Exchange witnessed a historic trading session today as the NEPSE index surged by 45.67 points to close at an all-time high of 2,215.34 points. The bullish trend was driven by strong performances in the banking and insurance sectors.

Trading volume reached NPR 4.5 billion with over 8.2 million shares traded. Commercial banks led the rally with NIBL, SCB, and NABIL showing significant gains.

Market analysts attribute this surge to improved economic indicators and positive investor sentiment following the recent monetary policy announcement.`,
      category: 'market',
      source: 'NEPSE Official',
      author: 'Market Desk',
      publishedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      readTime: '2 min read',
      sentiment: 'positive',
      tags: ['NEPSE', 'Stock Market', 'Record High', 'Investor Confidence'],
      impact: 'high',
      relatedStocks: ['NIBL', 'SCB', 'NABIL', 'NICA']
    },
    {
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
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      readTime: '3 min read',
      sentiment: 'neutral',
      tags: ['Monetary Policy', 'NRB', 'Banking', 'Economy'],
      impact: 'high',
      relatedStocks: ['NIBL', 'SCB', 'MBL', 'SBI']
    },
    {
      id: 3,
      title: 'Nepal Life Insurance Reports 25% Growth in Net Profit',
      summary: 'NLIC announces impressive Q3 results with 25% increase in net profit and 15% dividend declaration.',
      content: `Nepal Life Insurance Company (NLIC) has reported outstanding financial results for the third quarter of the current fiscal year. The company posted a 25% growth in net profit, reaching NPR 850 million.

Key Highlights:
• Net profit: NPR 850 million (25% growth)
• Premium collection: NPR 4.2 billion
• Claim settlement ratio: 95.2%
• 15% cash dividend proposed

The board has recommended a 15% cash dividend for shareholders. The stock closed at NPR 765, up 2.5% today.`,
      category: 'earnings',
      source: 'Company Filing',
      author: 'Financial Reporter',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      readTime: '2 min read',
      sentiment: 'positive',
      tags: ['NLIC', 'Earnings', 'Dividend', 'Insurance'],
      impact: 'medium',
      relatedStocks: ['NLIC', 'NIL', 'LICN', 'PLI']
    },
    {
      id: 4,
      title: 'Hydropower Sector Faces Challenges Amid Dry Season',
      summary: 'Lower water levels impact hydroelectricity production, affecting power companies stock performance.',
      content: `The hydropower sector is facing operational challenges due to significantly lower water levels during the current dry season. Major hydro companies have reported reduced electricity generation.

Companies like Chilime, Upper Tamakoshi, and Sanjen have seen production drops of 15-20%. This has started to reflect in their stock prices with the hydro sector index declining by 2.3% this week.

Analysts suggest investors monitor reservoir levels and rainfall forecasts for the upcoming monsoon season.`,
      category: 'sector',
      source: 'Energy Times',
      author: 'Sector Analyst',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      readTime: '2 min read',
      sentiment: 'negative',
      tags: ['Hydropower', 'Energy', 'Production', 'Challenges'],
      impact: 'medium',
      relatedStocks: ['CHCL', 'UPPER', 'SJCL', 'HPPL']
    },
    {
      id: 5,
      title: 'SEBON Approves 3 New Mutual Fund Schemes',
      summary: 'Securities Board of Nepal gives green light to three new mutual fund schemes worth NPR 3 billion.',
      content: `The Securities Board of Nepal (SEBON) has approved three new mutual fund schemes with a total corpus of NPR 3 billion. The funds will be managed by leading fund houses including NIBL, Citizens, and NMB.

Approved Schemes:
1. NIBL Growth Fund - NPR 1.2 billion
2. Citizens Balanced Fund - NPR 1 billion
3. NMB Value Fund - NPR 800 million

These schemes are expected to provide new investment opportunities for retail investors and boost market liquidity.`,
      category: 'regulation',
      source: 'SEBON Update',
      author: 'Regulatory Desk',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      readTime: '2 min read',
      sentiment: 'positive',
      tags: ['SEBON', 'Mutual Funds', 'Regulation', 'Investment'],
      impact: 'low',
      relatedStocks: ['NIBL', 'CZBIL', 'NMB', 'NEF']
    },
    {
      id: 6,
      title: 'Tourism Sector Stocks Rally Ahead of Visit Nepal 2025',
      summary: 'Hotel and tourism stocks gain momentum as government prepares for major tourism campaign.',
      content: `Stocks in the tourism and hospitality sector are showing strong performance in anticipation of the Visit Nepal 2025 campaign. Major hotel chains including Soaltee, Yak & Yeti, and Hotel Annapurna have seen increased investor interest.

The government has allocated NPR 500 million for tourism promotion, with focus on international marketing and infrastructure development. Industry experts predict 20% growth in tourist arrivals next year.

Hotel stocks have gained an average of 8% this month, outperforming the broader market.`,
      category: 'sector',
      source: 'Tourism Herald',
      author: 'Industry Analyst',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      readTime: '2 min read',
      sentiment: 'positive',
      tags: ['Tourism', 'Hotels', 'Visit Nepal', 'Hospitality'],
      impact: 'medium',
      relatedStocks: ['SHL', 'CGH', 'OHL', 'UNL']
    },
    {
      id: 7,
      title: 'NTC Expands 4G Services to Rural Areas',
      summary: 'Nepal Telecom announces expansion of 4G services to 50 additional rural municipalities.',
      content: `Nepal Telecom (NTC) has launched 4G services in 50 additional rural municipalities as part of its digital Nepal initiative. The expansion will provide high-speed internet to over 500,000 new users.

The company has invested NPR 2.5 billion in network infrastructure this quarter. This expansion is expected to boost NTC's subscriber base and revenue in the coming quarters.

Analysts maintain 'Buy' rating on NTC with target price of NPR 900.`,
      category: 'corporate',
      source: 'Company Announcement',
      author: 'Tech Correspondent',
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      readTime: '2 min read',
      sentiment: 'positive',
      tags: ['NTC', 'Telecom', '4G', 'Expansion'],
      impact: 'medium',
      relatedStocks: ['NTC', 'NCELL', 'STC', 'USLB']
    },
    {
      id: 8,
      title: 'Market Volatility Expected Amid Global Economic Uncertainty',
      summary: 'Analysts predict increased volatility in NEPSE due to global economic conditions and inflation concerns.',
      content: `Financial analysts are warning investors to brace for increased market volatility in the coming weeks. Global economic uncertainty, rising inflation concerns, and geopolitical tensions are expected to impact investor sentiment.

Key Factors:
• US Federal Reserve interest rate decisions
• Global commodity price fluctuations
• Domestic inflation trends
• Currency exchange rate volatility

Advisors recommend diversified portfolios and careful risk management during this period.`,
      category: 'analysis',
      source: 'Market Insights',
      author: 'Chief Analyst',
      publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
      readTime: '3 min read',
      sentiment: 'neutral',
      tags: ['Volatility', 'Analysis', 'Global Economy', 'Risk'],
      impact: 'high',
      relatedStocks: ['All Sectors']
    }
  ];

  const categories = [
    { value: 'all', label: '📰 All News', count: sampleNews.length },
    { value: 'market', label: '📈 Market News', count: sampleNews.filter(n => n.category === 'market').length },
    { value: 'earnings', label: '💰 Earnings', count: sampleNews.filter(n => n.category === 'earnings').length },
    { value: 'policy', label: '🏛️ Policy', count: sampleNews.filter(n => n.category === 'policy').length },
    { value: 'sector', label: '🏢 Sector News', count: sampleNews.filter(n => n.category === 'sector').length },
    { value: 'corporate', label: '🏭 Corporate', count: sampleNews.filter(n => n.category === 'corporate').length },
    { value: 'regulation', label: '⚖️ Regulation', count: sampleNews.filter(n => n.category === 'regulation').length },
    { value: 'analysis', label: '🔍 Analysis', count: sampleNews.filter(n => n.category === 'analysis').length }
  ];

  useEffect(() => {
    // Simulate loading news data
    const timer = setTimeout(() => {
      setNews(sampleNews);
      setFilteredNews(sampleNews);
      setLoading(false);
    }, 1500);

    // Auto-refresh news
    let refreshInterval;
    if (autoRefresh) {
      refreshInterval = setInterval(() => {
        // In a real app, this would fetch new data
        console.log('Auto-refreshing news...');
      }, 30000); // Every 30 seconds
    }

    return () => {
      clearTimeout(timer);
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [autoRefresh]);

  // Filter news based on category and search term
  useEffect(() => {
    let filtered = news;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(term) ||
        item.summary.toLowerCase().includes(term) ||
        item.tags.some(tag => tag.toLowerCase().includes(term)) ||
        item.relatedStocks.some(stock => stock.toLowerCase().includes(term))
      );
    }

    setFilteredNews(filtered);
  }, [selectedCategory, searchTerm, news]);

  const handleNewsClick = (newsItem) => {
    setSelectedNews(newsItem);
    setShowNewsModal(true);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'success';
      case 'negative': return 'danger';
      case 'neutral': return 'warning';
      default: return 'secondary';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '📈';
      case 'negative': return '📉';
      case 'neutral': return '➡️';
      default: return '📊';
    }
  };

  const getImpactBadge = (impact) => {
    const impactConfig = {
      high: { variant: 'danger', label: 'High Impact' },
      medium: { variant: 'warning', label: 'Medium Impact' },
      low: { variant: 'info', label: 'Low Impact' }
    };
    
    const config = impactConfig[impact] || impactConfig.medium;
    return <Badge bg={config.variant} className={styles.impactBadge}>{config.label}</Badge>;
  };

  const refreshNews = () => {
    setLoading(true);
    setTimeout(() => {
      // In real app, this would fetch new data
      setLoading(false);
    }, 1000);
  };

  const NewsItem = ({ item, compact = false }) => (
    <div 
      className={`${styles.newsItem} ${compact ? styles.compactNews : ''} ${item.sentiment}`}
      onClick={() => handleNewsClick(item)}
    >
      <div className={styles.newsItemHeader}>
        <div className={styles.newsSource}>
          <span className={styles.sourceName}>{item.source}</span>
          <span className={styles.newsTime}>{formatTimeAgo(item.publishedAt)}</span>
        </div>
        <div className={styles.newsSentiment}>
          <Badge bg={getSentimentColor(item.sentiment)} className={styles.sentimentBadge}>
            {getSentimentIcon(item.sentiment)} {item.sentiment}
          </Badge>
          {getImpactBadge(item.impact)}
        </div>
      </div>
      
      <h6 className={styles.newsTitle}>{item.title}</h6>
      
      {!compact && (
        <p className={styles.newsSummary}>{item.summary}</p>
      )}

      <div className={styles.newsItemFooter}>
        <div className={styles.newsMeta}>
          <span className={styles.readTime}>{item.readTime}</span>
          <span className={styles.categoryBadge}>{categories.find(c => c.value === item.category)?.label}</span>
        </div>
        
        <div className={styles.relatedStocks}>
          {item.relatedStocks.slice(0, 3).map(stock => (
            <Badge key={stock} bg="outline-secondary" className={styles.stockBadge}>
              {stock}
            </Badge>
          ))}
          {item.relatedStocks.length > 3 && (
            <Badge bg="outline-secondary" className={styles.stockBadge}>
              +{item.relatedStocks.length - 3}
            </Badge>
          )}
        </div>
      </div>

      {!compact && (
        <div className={styles.newsTags}>
          {item.tags.slice(0, 4).map(tag => (
            <span key={tag} className={styles.newsTag}>#{tag}</span>
          ))}
        </div>
      )}
    </div>
  );

  const TrendingStocks = () => (
    <div className={styles.trendingStocks}>
      <h6>📈 Trending Stocks</h6>
      <div className={styles.stocksList}>
        {[
          { symbol: 'NLIC', change: '+2.5%', price: 'रु 765' },
          { symbol: 'NIBL', change: '+1.8%', price: 'रु 452.75' },
          { symbol: 'NTC', change: '+1.2%', price: 'रु 835.25' },
          { symbol: 'SHL', change: '-0.8%', price: 'रु 312.00' },
          { symbol: 'HIDCL', change: '+0.5%', price: 'रु 285.50' }
        ].map(stock => (
          <div key={stock.symbol} className={styles.trendingStock}>
            <span className={styles.stockSymbol}>{stock.symbol}</span>
            <span className={`${styles.stockChange} ${stock.change.includes('+') ? styles.stockChangePositive : styles.stockChangeNegative}`}>
              {stock.change}
            </span>
            <span className={styles.stockPrice}>{stock.price}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`${styles.newsFeedWrapper} ${sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarOpen} ${theme === 'dark' ? styles.darkTheme : ''}`}>
      <Card className={styles.newsFeedCard}>
        <Card.Header className={styles.newsHeader}>
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <h5 className={styles.cardTitle}>
                <span className={styles.headerIcon}>📰</span>
                NEPSE News Feed
              </h5>
              <Badge bg="primary" className={styles.liveBadge}>
                LIVE
              </Badge>
            </div>
            
            <div className={styles.headerActions}>
              <Form.Check 
                type="switch"
                id="auto-refresh"
                label="Auto Refresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className={styles.autoRefreshSwitch}
              />
              <Button
                variant="outline-primary"
                size="sm"
                onClick={refreshNews}
                disabled={loading}
                className={styles.refreshBtn}
              >
                {loading ? <Spinner animation="border" size="sm" /> : '🔄 Refresh'}
              </Button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className={styles.newsControls}>
            <div className={styles.categoryFilters}>
              {categories.map(category => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className={styles.categoryBtn}
                >
                  {category.label}
                  <Badge bg="light" text="dark" className="ms-1">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>

            <InputGroup className={styles.searchGroup}>
              <InputGroup.Text>🔍</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search news, stocks, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="outline-secondary"
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </Button>
              )}
            </InputGroup>
          </div>
        </Card.Header>

        <Card.Body className={styles.newsBody}>
          {loading ? (
            <div className={styles.newsLoading}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading latest news...</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className={styles.noNews}>
              <div className={styles.noNewsIcon}>📰</div>
              <h6>No news found</h6>
              <p>Try adjusting your search or filter criteria</p>
              <Button
                variant="outline-primary"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchTerm('');
                }}
              >
                Show All News
              </Button>
            </div>
          ) : (
            <div className={styles.newsContent}>
              <div className={styles.mainNews}>
                {/* Breaking News Banner */}
                {filteredNews[0]?.impact === 'high' && (
                  <div className={styles.breakingNewsBanner}>
                    <Badge bg="danger" className={styles.breakingBadge}>BREAKING</Badge>
                    <span className={styles.breakingText}>{filteredNews[0].title}</span>
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => handleNewsClick(filteredNews[0])}
                    >
                      Read More →
                    </Button>
                  </div>
                )}

                {/* Featured News */}
                {filteredNews.slice(0, 1).map(newsItem => (
                  <div key={newsItem.id} className={styles.featuredNews}>
                    <NewsItem item={newsItem} />
                  </div>
                ))}

                {/* News List */}
                <ListGroup variant="flush" className={styles.newsList}>
                  {filteredNews.slice(1).map(newsItem => (
                    <ListGroup.Item key={newsItem.id} className={styles.newsListItem}>
                      <NewsItem item={newsItem} compact={true} />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>

              {/* Sidebar */}
              <div className={styles.newsSidebar}>
                <TrendingStocks />
                
                <div className={styles.marketSentiment}>
                  <h6>🎯 Market Sentiment</h6>
                  <div className={styles.sentimentMeters}>
                    <div className={styles.sentimentMeter}>
                      <span className={styles.meterLabel}>Bullish</span>
                      <div className={styles.meterBar}>
                        <div className={`${styles.meterFill} ${styles.meterFillPositive}`} style={{ width: '65%' }}></div>
                      </div>
                      <span className={styles.meterValue}>65%</span>
                    </div>
                    <div className={styles.sentimentMeter}>
                      <span className={styles.meterLabel}>Neutral</span>
                      <div className={styles.meterBar}>
                        <div className={`${styles.meterFill} ${styles.meterFillNeutral}`} style={{ width: '25%' }}></div>
                      </div>
                      <span className={styles.meterValue}>25%</span>
                    </div>
                    <div className={styles.sentimentMeter}>
                      <span className={styles.meterLabel}>Bearish</span>
                      <div className={styles.meterBar}>
                        <div className={`${styles.meterFill} ${styles.meterFillNegative}`} style={{ width: '10%' }}></div>
                      </div>
                      <span className={styles.meterValue}>10%</span>
                    </div>
                  </div>
                </div>

                <div className={styles.quickStats}>
                  <h6>📊 Quick Stats</h6>
                  <div className={styles.statsGrid}>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Total News</span>
                      <span className={styles.statValue}>{news.length}</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Positive</span>
                      <span className={`${styles.statValue} ${styles.statValuePositive}`}>
                        {news.filter(n => n.sentiment === 'positive').length}
                      </span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>High Impact</span>
                      <span className={`${styles.statValue} ${styles.statValueWarning}`}>
                        {news.filter(n => n.impact === 'high').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card.Body>

        <Card.Footer className={styles.newsFooter}>
          <div className={styles.footerContent}>
            <small className="text-muted">
              Showing {filteredNews.length} of {news.length} news items • Updated {formatTimeAgo(new Date())}
            </small>
            <small className="text-muted">
              Paper Trading • News for Educational Purposes
            </small>
          </div>
        </Card.Footer>
      </Card>

      {/* News Detail Modal */}
      <Modal 
        show={showNewsModal} 
        onHide={() => setShowNewsModal(false)}
        size="lg"
        centered
        className={styles.newsModal}
      >
        {selectedNews && (
          <>
            <Modal.Header closeButton className={styles.newsModalHeader}>
              <div className={styles.modalTitleSection}>
                <div className={styles.newsMeta}>
                  <Badge bg={getSentimentColor(selectedNews.sentiment)}>
                    {getSentimentIcon(selectedNews.sentiment)} {selectedNews.sentiment}
                  </Badge>
                  {getImpactBadge(selectedNews.impact)}
                  <span className={styles.sourceName}>{selectedNews.source}</span>
                  <span className={styles.newsTime}>{formatTimeAgo(selectedNews.publishedAt)}</span>
                </div>
                <Modal.Title>{selectedNews.title}</Modal.Title>
                <div className={styles.authorInfo}>
                  By {selectedNews.author} • {selectedNews.readTime}
                </div>
              </div>
            </Modal.Header>
            
            <Modal.Body className={styles.newsModalBody}>
              <div className={styles.newsContentFull}>
                <p className={styles.newsSummaryFull}>{selectedNews.summary}</p>
                
                <div className={styles.newsContentText}>
                  {selectedNews.content.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                <div className={styles.relatedInfo}>
                  <h6>Related Stocks</h6>
                  <div className={styles.relatedStocksFull}>
                    {selectedNews.relatedStocks.map(stock => (
                      <Badge key={stock} bg="outline-primary" className={styles.stockBadgeLarge}>
                        {stock}
                      </Badge>
                    ))}
                  </div>
                  
                  <h6>Tags</h6>
                  <div className={styles.newsTagsFull}>
                    {selectedNews.tags.map(tag => (
                      <span key={tag} className={styles.newsTagLarge}>#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Modal.Body>
            
            <Modal.Footer className={styles.newsModalFooter}>
              <Button
                variant="outline-primary"
                onClick={() => {
                  // In real app, this would share the news
                  alert('Share functionality would go here');
                }}
              >
                📤 Share
              </Button>
              <Button
                variant="primary"
                onClick={() => setShowNewsModal(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default NewsFeed;