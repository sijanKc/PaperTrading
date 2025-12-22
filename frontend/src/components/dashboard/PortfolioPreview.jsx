import React, { useState, useEffect } from 'react';
import { Card, ProgressBar, Badge, Button, ListGroup, Tooltip, OverlayTrigger, Spinner, Alert } from 'react-bootstrap';
import styles from '../css/PortfolioPreview.module.css';

const PortfolioPreview = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [theme, setTheme] = useState('dark');

  // Fetch portfolio data from backend
  const fetchPortfolioData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view portfolio');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/portfolio/holdings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setPortfolio(result.data);
        setError(null);
        setLastUpdated(new Date());
      } else {
        throw new Error(result.message || 'Failed to fetch portfolio data');
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      setError(error.message);
      
      // Fallback to empty portfolio for new users
      setPortfolio({
        totalValue: 0,
        totalInvestment: 0,
        totalProfitLoss: 0,
        totalProfitLossPercent: 0,
        dailyProfitLoss: 0,
        dailyProfitLossPercent: 0,
        availableCash: 100000,
        portfolioBeta: 1.0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        weeklyPerformance: 0,
        monthlyPerformance: 0,
        holdings: [],
        sectorAllocation: [],
        performanceHistory: [0, 0, 0, 0, 0, 0, 0]
      });
    } finally {
      setLoading(false);
    }
  };

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

  // Fetch data on component mount
  useEffect(() => {
    fetchPortfolioData();

    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchPortfolioData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSectorColor = (sector) => {
    const colors = {
      'Commercial Banks': '#3b82f6',
      'Insurance': '#10b981',
      'HydroPower': '#06b6d4',
      'Finance': '#f59e0b',
      'Development Bank': '#ef4444',
      'Telecommunication': '#8b5cf6'
    };
    return colors[sector] || '#6b7280';
  };

  const getProfitLossColor = (value) => {
    return value >= 0 ? 'success' : 'danger';
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

  const RiskMeter = ({ beta = 1.0 }) => {
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
        <div className={styles.riskBeta}>Beta: {beta.toFixed(1)}</div>
      </div>
    );
  };

  const PerformanceChart = ({ data }) => {
    const maxValue = Math.max(...data, 1);
    const minValue = Math.min(...data, -1);
    const range = maxValue - minValue;

    return (
      <div className={styles.performanceChart}>
        <div className={styles.chartBars}>
          {data.map((value, index) => (
            <div key={index} className={styles.chartBarContainer}>
              <div 
                className={`${styles.chartBar} ${value >= 0 ? styles.positiveBar : styles.negativeBar}`}
                style={{ 
                  height: `${Math.abs(value) * 5}px`,
                  marginTop: value >= 0 ? 'auto' : '0'
                }}
              />
              <div className={styles.chartLabel}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`${styles.portfolioPreviewWrapper} ${sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarOpen}`}>
        <Card className={styles.portfolioPreviewCard}>
          <Card.Body className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading portfolio analysis...</p>
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
            <Button variant="primary" size="sm">
              🚀 Start Trading
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className={`${styles.portfolioPreviewWrapper} ${sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarOpen} ${theme === 'dark' ? styles.darkTheme : ''}`}>
      <Card className={styles.portfolioPreviewCard}>
        <Card.Header className={styles.portfolioHeader}>
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <h5 className={styles.cardTitle}>
                <span className={styles.headerIcon}>📊</span>
                Portfolio Intelligence
              </h5>
              <div className={styles.portfolioMetrics}>
                <Badge bg="success" className={styles.metricBadge}>
                  Sharpe: {portfolio.sharpeRatio?.toFixed(1) || '0.0'}
                </Badge>
                <Badge bg="info" className={styles.metricBadge}>
                  β: {portfolio.portfolioBeta?.toFixed(1) || '1.0'}
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
              className={styles.tabBtn}
            >
              📈 Overview
            </Button>
            <Button
              variant={activeTab === 'holdings' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setActiveTab('holdings')}
              className={styles.tabBtn}
            >
              💼 Holdings
            </Button>
            <Button
              variant={activeTab === 'analysis' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setActiveTab('analysis')}
              className={styles.tabBtn}
            >
              🔍 Analysis
            </Button>
          </div>
        </Card.Header>

        <Card.Body>
          {error && (
            <Alert variant="warning" className="mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <span>{error}</span>
                <Button variant="outline-warning" size="sm" onClick={fetchPortfolioData}>
                  Retry
                </Button>
              </div>
            </Alert>
          )}

          {activeTab === 'overview' && (
            <>
              {/* Portfolio Summary */}
              <div className={styles.advancedSummary}>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryCard}>
                    <div className={styles.cardIcon}>💰</div>
                    <div className={styles.cardContent}>
                      <span className={styles.cardLabel}>Portfolio Value</span>
                      <span className={styles.cardValue}>रु {portfolio.totalValue?.toLocaleString('en-NP') || '0'}</span>
                      <span className={`${styles.cardChange} ${portfolio.weeklyPerformance >= 0 ? styles.positiveChange : styles.negativeChange}`}>
                        {portfolio.weeklyPerformance >= 0 ? '+' : ''}{portfolio.weeklyPerformance?.toFixed(1) || '0'}% this week
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.summaryCard}>
                    <div className={styles.cardIcon}>📈</div>
                    <div className={styles.cardContent}>
                      <span className={styles.cardLabel}>Total Returns</span>
                      <span className={styles.cardValue}>रु {Math.abs(portfolio.totalProfitLoss || 0).toLocaleString('en-NP')}</span>
                      <span className={`${styles.cardChange} ${portfolio.totalProfitLoss >= 0 ? styles.positiveChange : styles.negativeChange}`}>
                        {portfolio.totalProfitLoss >= 0 ? '+' : ''}{portfolio.totalProfitLossPercent?.toFixed(1) || '0'}% all time
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.summaryCard}>
                    <div className={styles.cardIcon}>💵</div>
                    <div className={styles.cardContent}>
                      <span className={styles.cardLabel}>Available Cash</span>
                      <span className={styles.cardValue}>रु {portfolio.availableCash?.toLocaleString('en-NP') || '100,000'}</span>
                      <span className={styles.cardChange}>Ready to invest</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Chart */}
              <div className={styles.performanceSection}>
                <h6 className={styles.sectionTitle}>📊 Weekly Performance</h6>
                <PerformanceChart data={portfolio.performanceHistory || [0, 0, 0, 0, 0, 0, 0]} />
              </div>

              {/* Top Holdings */}
              <div className={styles.holdingsSection}>
                <h6 className={styles.sectionTitle}>
                  🔥 Top Performers
                </h6>
                {(!portfolio.holdings || portfolio.holdings.length === 0) ? (
                  <div className="text-center py-4">
                    <p>No holdings yet. Start trading to build your portfolio!</p>
                    <Button variant="primary" size="sm">
                      Make Your First Trade
                    </Button>
                  </div>
                ) : (
                  <ListGroup variant="flush" className={styles.holdingsList}>
                    {portfolio.holdings
                      .sort((a, b) => (b.profitLossPercent || 0) - (a.profitLossPercent || 0))
                      .slice(0, 3)
                      .map((holding) => (
                      <ListGroup.Item key={holding.symbol} className={styles.holdingItem}>
                        <div className={styles.holdingMain}>
                          <div className={styles.stockInfo}>
                            <div className={styles.stockHeader}>
                              <strong className={styles.stockSymbol}>{holding.symbol}</strong>
                              <Badge 
                                className={styles.sectorBadge}
                                style={{ 
                                  backgroundColor: getSectorColor(holding.sector) + '20', 
                                  color: getSectorColor(holding.sector)
                                }}
                              >
                                {holding.sector}
                              </Badge>
                            </div>
                            <div className={styles.stockDetails}>
                              <span className={styles.stockName}>{holding.name}</span>
                              <span className={styles.stockWeight}>{(holding.weight || 0).toFixed(1)}% of portfolio</span>
                            </div>
                          </div>
                          
                          <div className={styles.holdingValues}>
                            <div className={styles.currentValue}>
                              रु {(holding.marketValue || 0).toLocaleString('en-NP')}
                            </div>
                            <div className={styles.holdingDetails}>
                              <span>{holding.quantity} shares</span>
                              <span>Avg: रु {(holding.avgPrice || 0).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className={styles.performanceSection}>
                          <div className={`${styles.performanceIndicator} ${(holding.profitLoss || 0) >= 0 ? styles.successIndicator : styles.dangerIndicator}`}>
                            <span className={styles.plValue}>
                              {(holding.profitLoss || 0) >= 0 ? '↗ ' : '↘ '}
                              रु {Math.abs(holding.profitLoss || 0).toLocaleString('en-NP')}
                            </span>
                            <span className={styles.plPercent}>
                              ({(holding.profitLoss || 0) >= 0 ? '+' : ''}{(holding.profitLossPercent || 0).toFixed(1)}%)
                            </span>
                          </div>
                          <RiskMeter beta={holding.beta || 1.0} />
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </div>
            </>
          )}

          {activeTab === 'holdings' && (
            <div className={styles.holdingsTab}>
              <h6 className={styles.sectionTitle}>💼 All Holdings</h6>
              {(!portfolio.holdings || portfolio.holdings.length === 0) ? (
                <div className="text-center py-4">
                  <p>No holdings yet. Start trading to build your portfolio!</p>
                  <Button variant="primary" size="sm">
                    Make Your First Trade
                  </Button>
                </div>
              ) : (
                <ListGroup variant="flush" className={styles.holdingsList}>
                  {portfolio.holdings.map((holding) => (
                    <ListGroup.Item key={holding.symbol} className={styles.holdingItem}>
                      <div className={styles.holdingMain}>
                        <div className={styles.stockInfo}>
                          <div className={styles.stockHeader}>
                            <strong className={styles.stockSymbol}>{holding.symbol}</strong>
                            <Badge 
                              className={styles.sectorBadge}
                              style={{ 
                                backgroundColor: getSectorColor(holding.sector) + '20', 
                                color: getSectorColor(holding.sector)
                              }}
                            >
                              {holding.sector}
                            </Badge>
                          </div>
                          <div className={styles.stockDetails}>
                            <span className={styles.stockName}>{holding.name}</span>
                            <span className={styles.stockWeight}>{(holding.weight || 0).toFixed(1)}% of portfolio</span>
                          </div>
                        </div>
                        
                        <div className={styles.holdingValues}>
                          <div className={styles.currentValue}>
                            रु {(holding.marketValue || 0).toLocaleString('en-NP')}
                          </div>
                          <div className={styles.holdingDetails}>
                            <span>{holding.quantity} shares</span>
                            <span>Avg: रु {(holding.avgPrice || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.performanceSection}>
                        <div className={`${styles.performanceIndicator} ${(holding.profitLoss || 0) >= 0 ? styles.successIndicator : styles.dangerIndicator}`}>
                          <span className={styles.plValue}>
                            {(holding.profitLoss || 0) >= 0 ? '↗ ' : '↘ '}
                            रु {Math.abs(holding.profitLoss || 0).toLocaleString('en-NP')}
                          </span>
                          <span className={styles.plPercent}>
                            ({(holding.profitLoss || 0) >= 0 ? '+' : ''}{(holding.profitLossPercent || 0).toFixed(1)}%)
                          </span>
                        </div>
                        <RiskMeter beta={holding.beta || 1.0} />
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className={styles.analysisTab}>
              <h6 className={styles.sectionTitle}>🔍 Portfolio Analysis</h6>
              
              {/* Sector Allocation */}
              <div className={styles.analysisSection}>
                <h6>Sector Allocation</h6>
                {(!portfolio.sectorAllocation || portfolio.sectorAllocation.length === 0) ? (
                  <p className="text-muted">No sector data available</p>
                ) : (
                  <div className={styles.sectorAllocation}>
                    {portfolio.sectorAllocation.map((sector) => (
                      <div key={sector.sector} className={styles.sectorItem}>
                        <div className={styles.sectorHeader}>
                          <span className={styles.sectorName}>{sector.sector}</span>
                          <span className={styles.sectorPercentage}>{sector.percentage}%</span>
                        </div>
                        <ProgressBar 
                          now={sector.percentage} 
                          className={styles.sectorProgress}
                          style={{
                            '--bs-progress-bg': getSectorColor(sector.sector) + '20',
                            '--bs-progress-bar-bg': getSectorColor(sector.sector)
                          }}
                        />
                        <div className={styles.sectorDetails}>
                          <span>रु {(sector.value || 0).toLocaleString('en-NP')}</span>
                          <span className={`${sector.performance >= 0 ? styles.positiveChange : styles.negativeChange}`}>
                            {sector.performance >= 0 ? '+' : ''}{sector.performance?.toFixed(1) || '0'}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Risk Metrics */}
              <div className={styles.analysisSection}>
                <h6>Risk Analysis</h6>
                <div className={styles.riskMetrics}>
                  <div className={styles.riskMetric}>
                    <span className={styles.metricLabel}>Portfolio Beta</span>
                    <span className={styles.metricValue}>{portfolio.portfolioBeta?.toFixed(2) || '1.00'}</span>
                    <span className={styles.metricDescription}>
                      {portfolio.portfolioBeta < 1 ? 'Less volatile than market' : 
                       portfolio.portfolioBeta > 1 ? 'More volatile than market' : 
                       'Market average volatility'}
                    </span>
                  </div>
                  <div className={styles.riskMetric}>
                    <span className={styles.metricLabel}>Sharpe Ratio</span>
                    <span className={styles.metricValue}>{portfolio.sharpeRatio?.toFixed(2) || '0.00'}</span>
                    <span className={styles.metricDescription}>
                      {portfolio.sharpeRatio > 1 ? 'Good risk-adjusted returns' : 
                       portfolio.sharpeRatio > 0 ? 'Positive returns' : 
                       'Needs improvement'}
                    </span>
                  </div>
                  <div className={styles.riskMetric}>
                    <span className={styles.metricLabel}>Max Drawdown</span>
                    <span className={styles.metricValue}>{portfolio.maxDrawdown?.toFixed(1) || '0.0'}%</span>
                    <span className={styles.metricDescription}>
                      {portfolio.maxDrawdown > -10 ? 'Good risk management' : 
                       portfolio.maxDrawdown > -20 ? 'Moderate risk' : 
                       'High volatility'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className={styles.analysisSection}>
                <h6>Performance Metrics</h6>
                <div className={styles.performanceMetrics}>
                  <div className={styles.performanceMetric}>
                    <span className={styles.metricLabel}>Daily P&L</span>
                    <span className={`${styles.metricValue} ${portfolio.dailyProfitLoss >= 0 ? styles.positiveValue : styles.negativeValue}`}>
                      रु {(portfolio.dailyProfitLoss || 0).toLocaleString('en-NP')}
                    </span>
                    <span className={`${styles.metricChange} ${portfolio.dailyProfitLossPercent >= 0 ? styles.positiveChange : styles.negativeChange}`}>
                      {portfolio.dailyProfitLossPercent >= 0 ? '+' : ''}{portfolio.dailyProfitLossPercent?.toFixed(1) || '0'}%
                    </span>
                  </div>
                  <div className={styles.performanceMetric}>
                    <span className={styles.metricLabel}>Weekly Performance</span>
                    <span className={`${styles.metricValue} ${portfolio.weeklyPerformance >= 0 ? styles.positiveValue : styles.negativeValue}`}>
                      {portfolio.weeklyPerformance >= 0 ? '+' : ''}{portfolio.weeklyPerformance?.toFixed(1) || '0'}%
                    </span>
                  </div>
                  <div className={styles.performanceMetric}>
                    <span className={styles.metricLabel}>Monthly Performance</span>
                    <span className={`${styles.metricValue} ${portfolio.monthlyPerformance >= 0 ? styles.positiveValue : styles.negativeValue}`}>
                      {portfolio.monthlyPerformance >= 0 ? '+' : ''}{portfolio.monthlyPerformance?.toFixed(1) || '0'}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default PortfolioPreview;