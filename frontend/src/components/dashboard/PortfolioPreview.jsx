import React, { useState, useEffect } from 'react';
import { Card, ProgressBar, Badge, Button, ListGroup, Tooltip, OverlayTrigger } from 'react-bootstrap';
import styles from '../css/PortfolioPreview.module.css';

const PortfolioPreview = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sparklineData, setSparklineData] = useState({});
  const [lastUpdated, setLastUpdated] = useState(new Date());
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

  // Generate sparkline data for stocks
  const generateSparklineData = (symbol, currentPrice) => {
    const data = [];
    let price = currentPrice * 0.95; // Start 5% lower
    for (let i = 0; i < 10; i++) {
      price += (Math.random() - 0.5) * currentPrice * 0.02;
      data.push(price);
    }
    return data;
  };

  // Sample portfolio data for NEPSE paper trading
  const samplePortfolio = {
    totalValue: 874500.00,
    totalInvestment: 750000.00,
    totalProfitLoss: 124500.00,
    totalProfitLossPercent: 16.6,
    dailyProfitLoss: 2450.50,
    dailyProfitLossPercent: 0.28,
    availableCash: 250000.00,
    portfolioBeta: 1.2,
    sharpeRatio: 2.1,
    maxDrawdown: -8.5,
    weeklyPerformance: 3.2,
    monthlyPerformance: 12.8,
    holdings: [
      {
        symbol: 'NLIC',
        name: 'Nepal Life Insurance',
        quantity: 100,
        avgPrice: 650.00,
        currentPrice: 765.00,
        marketValue: 76500.00,
        profitLoss: 11500.00,
        profitLossPercent: 17.69,
        sector: 'Insurance',
        weight: 8.7,
        beta: 0.8,
        dividendYield: 2.5
      },
      {
        symbol: 'NIBL',
        name: 'Nepal Investment Bank',
        quantity: 200,
        avgPrice: 420.00,
        currentPrice: 452.75,
        marketValue: 90550.00,
        profitLoss: 6550.00,
        profitLossPercent: 7.80,
        sector: 'Commercial Banks',
        weight: 10.4,
        beta: 1.1,
        dividendYield: 3.2
      },
      {
        symbol: 'NTC',
        name: 'Nepal Telecom',
        quantity: 50,
        avgPrice: 780.00,
        currentPrice: 835.25,
        marketValue: 41762.50,
        profitLoss: 2762.50,
        profitLossPercent: 7.08,
        sector: 'Telecommunication',
        weight: 4.8,
        beta: 0.9,
        dividendYield: 4.1
      },
      {
        symbol: 'SHL',
        name: 'Soaltee Hotel',
        quantity: 150,
        avgPrice: 300.00,
        currentPrice: 312.00,
        marketValue: 46800.00,
        profitLoss: 1800.00,
        profitLossPercent: 4.00,
        sector: 'Hotels',
        weight: 5.4,
        beta: 1.4,
        dividendYield: 1.8
      },
      {
        symbol: 'HIDCL',
        name: 'Hydropower Investment',
        quantity: 300,
        avgPrice: 270.00,
        currentPrice: 285.50,
        marketValue: 85650.00,
        profitLoss: 4650.00,
        profitLossPercent: 5.74,
        sector: 'Hydroelectricity',
        weight: 9.8,
        beta: 1.0,
        dividendYield: 2.9
      }
    ],
    sectorAllocation: [
      { sector: 'Commercial Banks', percentage: 35, value: 306075.00, performance: 2.1 },
      { sector: 'Insurance', percentage: 25, value: 218625.00, performance: 3.8 },
      { sector: 'Hydroelectricity', percentage: 20, value: 174900.00, performance: 1.2 },
      { sector: 'Telecommunication', percentage: 15, value: 131175.00, performance: 2.9 },
      { sector: 'Hotels', percentage: 5, value: 43725.00, performance: -1.5 }
    ],
    performanceHistory: [2.1, 1.8, -0.5, 3.2, 2.8, 1.5, 0.9] // Last 7 days
  };

  useEffect(() => {
    // Simulate loading portfolio data
    const timer = setTimeout(() => {
      setPortfolio(samplePortfolio);
      
      // Generate sparkline data for each holding
      const sparklines = {};
      samplePortfolio.holdings.forEach(holding => {
        sparklines[holding.symbol] = generateSparklineData(holding.symbol, holding.currentPrice);
      });
      setSparklineData(sparklines);
      
      setLoading(false);
    }, 1000);

    // Simulate real-time updates
    const updateInterval = setInterval(() => {
      setLastUpdated(new Date());
      if (portfolio) {
        setPortfolio(prev => ({
          ...prev,
          totalValue: prev.totalValue + (Math.random() - 0.5) * 1000,
          dailyProfitLoss: prev.dailyProfitLoss + (Math.random() - 0.5) * 100
        }));
      }
    }, 30000); // Update every 30 seconds

    return () => {
      clearTimeout(timer);
      clearInterval(updateInterval);
    };
  }, []);

  const getSectorColor = (sector) => {
    const colors = {
      'Commercial Banks': '#3b82f6',
      'Insurance': '#10b981',
      'Hydroelectricity': '#06b6d4',
      'Telecommunication': '#f59e0b',
      'Hotels': '#ef4444',
      'Development Banks': '#8b5cf6',
      'Finance': '#ec4899'
    };
    return colors[sector] || '#6b7280';
  };

  const getProfitLossColor = (value) => {
    return value >= 0 ? 'success' : 'danger';
  };

  const getPerformanceColor = (value) => {
    if (value > 3) return 'excellent';
    if (value > 1) return 'good';
    if (value > -1) return 'neutral';
    return 'poor';
  };

  const renderSparkline = (data, symbol) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    return (
      <div className={styles.sparkline}>
        {data.map((value, index) => {
          const height = range === 0 ? 50 : ((value - min) / range) * 30;
          const isUp = index === 0 ? true : value > data[index - 1];
          return (
            <div
              key={index}
              className={`${styles.sparklineBar} ${isUp ? styles.upBar : styles.downBar}`}
              style={{ height: `${height}px` }}
            />
          );
        })}
      </div>
    );
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 min ago';
    if (minutes < 60) return `${minutes} mins ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  const RiskMeter = ({ beta }) => {
    const riskLevel = beta < 0.8 ? 'Low' : beta < 1.2 ? 'Medium' : 'High';
    const riskColor = beta < 0.8 ? '#10b981' : beta < 1.2 ? '#f59e0b' : '#ef4444';
    
    return (
      <div className={styles.riskMeter}>
        <div className={styles.riskLabel}>Risk: {riskLevel}</div>
        <div className={styles.riskBar}>
          <div 
            className={styles.riskFill}
            style={{ 
              width: `${Math.min(beta * 25, 100)}%`,
              backgroundColor: riskColor
            }}
          />
        </div>
        <div className={styles.riskBeta}>Beta: {beta}</div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`${styles.portfolioPreviewWrapper} ${sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarOpen}`}>
        <Card className={styles.portfolioPreviewCard}>
          <Card.Body className="text-center">
            <div className={styles.loadingSpinner}>
              <div className={styles.spinner}></div>
            </div>
            <p>Analyzing your portfolio...</p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className={`${styles.portfolioPreviewWrapper} ${sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarOpen}`}>
        <Card className={styles.portfolioPreviewCard}>
          <Card.Body className="text-center">
            <div className={styles.noPortfolio}>📊</div>
            <h6>Ready to Build Your Fortune?</h6>
            <p>Start your NEPSE trading journey today</p>
            <Button variant="primary" size="sm" className={styles.gradientBtn}>
              🚀 Start Trading
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className={`${styles.portfolioPreviewWrapper} ${sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarOpen} ${theme === 'dark' ? styles.darkTheme : ''}`}>
      <Card className={`${styles.portfolioPreviewCard} ${styles.advancedCard}`}>
        <Card.Header className={styles.portfolioHeader}>
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <h5 className={styles.cardTitle}>
                <span className={styles.headerIcon}>📊</span>
                Portfolio Intelligence
              </h5>
              <div className={styles.portfolioMetrics}>
                <Badge bg="success" className={styles.metricBadge}>
                  Sharpe: {portfolio.sharpeRatio}
                </Badge>
                <Badge bg="info" className={styles.metricBadge}>
                  β: {portfolio.portfolioBeta}
                </Badge>
              </div>
            </div>
            <div className={styles.headerActions}>
              <Badge bg="primary" className={styles.liveBadge}>
                🔴 LIVE
              </Badge>
              <small className={styles.updateTime}>
                {formatTimeAgo(lastUpdated)}
              </small>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className={styles.portfolioTabs}>
            <Button
              variant={activeTab === 'overview' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setActiveTab('overview')}
              className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.activeTab : ''}`}
            >
              📈 Overview
            </Button>
            <Button
              variant={activeTab === 'holdings' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setActiveTab('holdings')}
              className={`${styles.tabBtn} ${activeTab === 'holdings' ? styles.activeTab : ''}`}
            >
              💼 Holdings
            </Button>
            <Button
              variant={activeTab === 'analysis' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setActiveTab('analysis')}
              className={`${styles.tabBtn} ${activeTab === 'analysis' ? styles.activeTab : ''}`}
            >
              🔍 Analysis
            </Button>
          </div>
        </Card.Header>

        <Card.Body>
          {activeTab === 'overview' && (
            <>
              {/* Portfolio Summary with Advanced Metrics */}
              <div className={styles.advancedSummary}>
                <div className={styles.summaryGrid}>
                  <div className={`${styles.summaryCard} ${styles.primaryCard}`}>
                    <div className={styles.cardIcon}>💰</div>
                    <div className={styles.cardContent}>
                      <span className={styles.cardLabel}>Portfolio Value</span>
                      <span className={styles.cardValue}>रु {portfolio.totalValue.toLocaleString('en-NP')}</span>
                      <span className={`${styles.cardChange} ${styles.positiveChange}`}>+{portfolio.weeklyPerformance}% this week</span>
                    </div>
                  </div>
                  
                  <div className={`${styles.summaryCard} ${styles.successCard}`}>
                    <div className={styles.cardIcon}>📈</div>
                    <div className={styles.cardContent}>
                      <span className={styles.cardLabel}>Total Returns</span>
                      <span className={styles.cardValue}>रु {Math.abs(portfolio.totalProfitLoss).toLocaleString('en-NP')}</span>
                      <span className={`${styles.cardChange} ${styles.positiveChange}`}>+{portfolio.totalProfitLossPercent}% all time</span>
                    </div>
                  </div>
                  
                  <div className={`${styles.summaryCard} ${styles.infoCard}`}>
                    <div className={styles.cardIcon}>💵</div>
                    <div className={styles.cardContent}>
                      <span className={styles.cardLabel}>Available Cash</span>
                      <span className={styles.cardValue}>रु {portfolio.availableCash.toLocaleString('en-NP')}</span>
                      <span className={styles.cardChange}>Ready to invest</span>
                    </div>
                  </div>
                </div>

                {/* Performance Chart Mini View */}
                <div className={styles.performanceMini}>
                  <h6 className={styles.sectionTitle}>7-Day Performance</h6>
                  <div className={styles.sparklineChart}>
                    {portfolio.performanceHistory.map((value, index) => (
                      <div
                        key={index}
                        className={`${styles.performanceBar} ${value >= 0 ? styles.positiveBar : styles.negativeBar}`}
                        style={{ height: `${Math.abs(value) * 10}px` }}
                        title={`${value}%`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Holdings with Sparklines */}
              <div className={styles.holdingsSection}>
                <h6 className={styles.sectionTitle}>
                  🔥 Top Performers
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Your highest performing stocks</Tooltip>}
                  >
                    <span className={styles.infoIcon}>ℹ️</span>
                  </OverlayTrigger>
                </h6>
                <ListGroup variant="flush" className={`${styles.holdingsList} ${styles.advancedList}`}>
                  {portfolio.holdings
                    .sort((a, b) => b.profitLossPercent - a.profitLossPercent)
                    .slice(0, 3)
                    .map((holding, index) => (
                    <ListGroup.Item key={holding.symbol} className={`${styles.holdingItem} ${styles.advancedHolding}`}>
                      <div className={styles.holdingMain}>
                        <div className={styles.stockInfo}>
                          <div className={styles.stockHeader}>
                            <strong className={styles.stockSymbol}>{holding.symbol}</strong>
                            <Badge 
                              className={`${styles.sectorBadge} ${styles.advancedBadge}`}
                              style={{ 
                                backgroundColor: getSectorColor(holding.sector) + '20', 
                                color: getSectorColor(holding.sector),
                                border: `1px solid ${getSectorColor(holding.sector)}30`
                              }}
                            >
                              {holding.sector}
                            </Badge>
                          </div>
                          <div className={styles.stockDetails}>
                            <span className={styles.stockName}>{holding.name}</span>
                            <span className={styles.stockWeight}>{holding.weight}% of portfolio</span>
                          </div>
                        </div>
                        
                        <div className={styles.priceTrend}>
                          {sparklineData[holding.symbol] && 
                            renderSparkline(sparklineData[holding.symbol], holding.symbol)
                          }
                        </div>
                        
                        <div className={styles.holdingValues}>
                          <div className={styles.currentValue}>
                            रु {holding.marketValue.toLocaleString('en-NP')}
                          </div>
                          <div className={styles.holdingDetails}>
                            <span>{holding.quantity} shares</span>
                            <span>Avg: रु {holding.avgPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.performanceSection}>
                        <div className={`${styles.performanceIndicator} ${getProfitLossColor(holding.profitLoss) === 'success' ? styles.successIndicator : styles.dangerIndicator}`}>
                          <span className={styles.plValue}>
                            {holding.profitLoss >= 0 ? '↗ ' : '↘ '}
                            रु {Math.abs(holding.profitLoss).toLocaleString('en-NP')}
                          </span>
                          <span className={styles.plPercent}>
                            ({holding.profitLoss >= 0 ? '+' : ''}{holding.profitLossPercent}%)
                          </span>
                        </div>
                        <RiskMeter beta={holding.beta} />
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </>
          )}

          {activeTab === 'holdings' && (
            <div className={styles.fullHoldings}>
              <h6 className={styles.sectionTitle}>All Holdings</h6>
              {/* Full holdings list would go here */}
              <div className={styles.comingSoon}>
                <span className={styles.comingSoonIcon}>🔧</span>
                <p>Detailed holdings view coming soon</p>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className={styles.portfolioAnalysis}>
              <h6 className={styles.sectionTitle}>Portfolio Analysis</h6>
              <div className={styles.analysisGrid}>
                <div className={styles.analysisCard}>
                  <h6>📊 Sector Allocation</h6>
                  <div className={`${styles.allocationBars} ${styles.advancedAllocation}`}>
                    {portfolio.sectorAllocation.map((sector, index) => (
                      <div key={sector.sector} className={`${styles.allocationItem} ${styles.advancedAllocationItem}`}>
                        <div className={styles.allocationHeader}>
                          <span className={styles.sectorName}>{sector.sector}</span>
                          <div className={styles.sectorPerformance}>
                            <span className={styles.sectorPercent}>{sector.percentage}%</span>
                            <span className={`${styles.performanceBadge} ${styles[getPerformanceColor(sector.performance) + 'Performance']}`}>
                              {sector.performance >= 0 ? '+' : ''}{sector.performance}%
                            </span>
                          </div>
                        </div>
                        <ProgressBar 
                          now={sector.percentage}
                          className={styles.allocationProgress}
                        >
                          <ProgressBar 
                            now={sector.percentage}
                            style={{
                              backgroundColor: getSectorColor(sector.sector)
                            }}
                          />
                        </ProgressBar>
                        <div className={styles.allocationValue}>
                          रु {sector.value.toLocaleString('en-NP')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={styles.analysisCard}>
                  <h6>⚡ Quick Stats</h6>
                  <div className={styles.quickStats}>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Best Performer</span>
                      <span className={styles.statValue}>NLIC (+17.7%)</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Largest Holding</span>
                      <span className={styles.statValue}>NIBL (10.4%)</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Portfolio Diversity</span>
                      <span className={`${styles.statValue} ${styles.excellentValue}`}>Excellent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className={`${styles.actionsSection} ${styles.advancedActions}`}>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>View detailed portfolio analysis</Tooltip>}
            >
              <Button variant="outline-primary" size="sm" className={`${styles.actionBtn} ${styles.advancedAction}`}>
                📈 Full Analysis
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Execute quick trades</Tooltip>}
            >
              <Button variant="outline-success" size="sm" className={`${styles.actionBtn} ${styles.advancedAction}`}>
                ⚡ Quick Trade
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Rebalance your portfolio</Tooltip>}
            >
              <Button variant="outline-warning" size="sm" className={`${styles.actionBtn} ${styles.advancedAction}`}>
                🔄 Rebalance
              </Button>
            </OverlayTrigger>
          </div>
        </Card.Body>

        <Card.Footer className={`${styles.portfolioFooter} ${styles.advancedFooter}`}>
          <div className={styles.footerContent}>
            <div className={styles.footerStats}>
              <span className={styles.stat}>
                {portfolio.holdings.length} holdings
              </span>
              <span className={styles.stat}>
                Max Drawdown: {portfolio.maxDrawdown}%
              </span>
              <span className={styles.stat}>
                Monthly: +{portfolio.monthlyPerformance}%
              </span>
            </div>
            <small className="text-muted">
              Paper Trading • Virtual Money
            </small>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default PortfolioPreview;