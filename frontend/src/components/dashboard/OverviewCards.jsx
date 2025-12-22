import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Badge, Container, Spinner, Alert } from 'react-bootstrap';
import { portfolioService } from '../../services/portfolioService'; // 🆕 IMPORT API SERVICE
import styles from '../css/OverviewCards.module.css';

const OverviewCards = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // 🆕 MEMOIZED FETCH USING PORTFOLIO SERVICE
  const fetchPortfolioData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view your portfolio');
        setLoading(false);
        return;
      }

      // 🆕 USING PORTFOLIO SERVICE INSTEAD OF DIRECT FETCH
      const response = await portfolioService.getOverview();
      
      if (response.data.success) {
        setPortfolioData(response.data.data);
        setError(null);
        setLastUpdated(new Date());
      } else {
        throw new Error(response.data.message || 'Failed to fetch portfolio data');
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      setError(error.message);
      
      // 🆕 IMPROVED FALLBACK DATA
      setPortfolioData({
        virtualBalance: 100000.00,
        totalInvestment: 0.00,
        currentValue: 0.00,
        profitLoss: 0.00,
        profitLossPercent: 0.00,
        dailyPL: 0.00,
        dailyPLPercent: 0.00,
        dailyProfitLoss: 0.00,
        dailyProfitLossPercent: 0.00,
        availableCash: 100000.00,
        holdingsCount: 0
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Sidebar state detection with optimized performance
  useEffect(() => {
    const checkSidebarState = () => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        const isCollapsed = sidebar.classList.contains('sidebar-collapsed');
        setSidebarCollapsed(isCollapsed);
      }
    };

    checkSidebarState();
    
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      const resizeObserver = new ResizeObserver(checkSidebarState);
      resizeObserver.observe(sidebar);
      return () => resizeObserver.disconnect();
    }
  }, []);

  // Theme detection
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  // Fetch data on component mount with cleanup
  useEffect(() => {
    fetchPortfolioData();

    // 🆕 SMART REAL-TIME UPDATES
    const balanceInterval = setInterval(fetchPortfolioData, 15000); // 15 seconds
    
    return () => {
      clearInterval(balanceInterval);
    };
  }, [fetchPortfolioData]);

  // Format currency with proper Nepali formatting
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return 'रु 0.00';
    return `रु ${Math.abs(amount).toLocaleString('en-NP', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Format percentage
  const formatPercentage = (percent) => {
    if (percent === null || percent === undefined) return '0.00%';
    return `${percent >= 0 ? '+' : ''}${percent?.toFixed(2) || '0.00'}%`;
  };

  // Format time ago for last updated
  const formatTimeAgo = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  // 🆕 CALCULATE DYNAMIC METRICS
  const calculateDynamicMetrics = (data) => {
    if (!data) return {};
    
    const metrics = {
      // Use actual data from backend
      virtualBalance: data.virtualBalance || 100000,
      totalInvestment: data.totalInvestment || 0,
      currentValue: data.currentValue || 0,
      profitLoss: data.profitLoss || 0,
      profitLossPercent: data.profitLossPercent || 0,
      dailyPL: data.dailyPL || data.dailyProfitLoss || 0,
      dailyPLPercent: data.dailyPLPercent || data.dailyProfitLossPercent || 0,
      availableCash: data.availableCash || (data.virtualBalance - (data.currentValue || 0)),
      holdingsCount: data.holdingsCount || 0
    };

    // 🆕 AUTO-CALCULATE IF MISSING DATA
    if (!metrics.currentValue && metrics.totalInvestment && metrics.profitLoss) {
      metrics.currentValue = metrics.totalInvestment + metrics.profitLoss;
    }
    
    if (!metrics.availableCash && metrics.virtualBalance && metrics.currentValue) {
      metrics.availableCash = metrics.virtualBalance - metrics.currentValue;
    }

    return metrics;
  };

  if (loading && !portfolioData) {
    return (
      <div className={`${styles.overviewCardsWrapper} ${sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarOpen} ${theme === 'dark' ? styles.darkTheme : ''}`}>
        <Container fluid>
          <div className={styles.loadingContainer}>
            <Spinner animation="border" variant="primary" />
            <p className={styles.loadingText}>Loading your portfolio data...</p>
          </div>
        </Container>
      </div>
    );
  }

  // 🆕 USE CALCULATED METRICS
  const metrics = calculateDynamicMetrics(portfolioData);

  const cards = [
    {
      title: 'Virtual Balance',
      value: formatCurrency(metrics.virtualBalance),
      subtitle: 'Total Account Value',
      icon: '💰',
      color: 'primary',
      trend: 'stable',
      description: 'Your total account value including cash and investments',
      progressValue: Math.min((metrics.virtualBalance / 200000) * 100, 100)
    },
    {
      title: 'Total Investment',
      value: formatCurrency(metrics.totalInvestment),
      subtitle: 'Amount Invested in Stocks',
      icon: '📊',
      color: metrics.totalInvestment > 0 ? 'info' : 'secondary',
      trend: metrics.totalInvestment > 0 ? 'up' : 'neutral',
      description: 'Total amount you have invested in stocks',
      progressValue: metrics.totalInvestment > 0 ? Math.min((metrics.totalInvestment / metrics.virtualBalance) * 100, 100) : 0
    },
    {
      title: 'Current Portfolio',
      value: formatCurrency(metrics.currentValue),
      subtitle: 'Current Market Value',
      icon: '💼',
      color: metrics.currentValue >= metrics.totalInvestment ? 'success' : 'warning',
      trend: metrics.currentValue >= metrics.totalInvestment ? 'up' : 'down',
      description: 'Current value of your stock portfolio',
      progressValue: metrics.totalInvestment > 0 ? Math.min((metrics.currentValue / metrics.totalInvestment) * 100, 100) : 0
    },
    {
      title: 'Total P/L',
      value: formatCurrency(metrics.profitLoss),
      subtitle: `All Time ${metrics.profitLoss >= 0 ? 'Profit' : 'Loss'}`,
      percentage: formatPercentage(metrics.profitLossPercent),
      icon: metrics.profitLoss >= 0 ? '📈' : '📉',
      color: metrics.profitLoss >= 0 ? 'success' : 'danger',
      trend: metrics.profitLoss >= 0 ? 'up' : 'down',
      description: 'Your overall profit/loss since starting',
      progressValue: Math.min(Math.abs(metrics.profitLossPercent || 0) * 2, 100)
    },
    {
      title: 'Today\'s P/L',
      value: formatCurrency(metrics.dailyPL),
      subtitle: 'Daily Performance',
      percentage: formatPercentage(metrics.dailyPLPercent),
      icon: metrics.dailyPL >= 0 ? '🔼' : '🔽',
      color: metrics.dailyPL >= 0 ? 'success' : 'danger',
      trend: metrics.dailyPL >= 0 ? 'up' : 'down',
      description: 'Profit/Loss for the current trading day',
      progressValue: Math.min(Math.abs(metrics.dailyPLPercent || 0) * 10, 100)
    },
    {
      title: 'Available Cash',
      value: formatCurrency(metrics.availableCash),
      subtitle: 'Ready to Invest',
      icon: '💵',
      color: metrics.availableCash > 50000 ? 'success' : metrics.availableCash > 10000 ? 'warning' : 'danger',
      trend: metrics.availableCash > 50000 ? 'up' : metrics.availableCash > 10000 ? 'stable' : 'down',
      description: 'Cash available for new investments',
      progressValue: Math.min((metrics.availableCash / metrics.virtualBalance) * 100, 100)
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getTrendText = (trend) => {
    switch (trend) {
      case 'up': return 'Growing';
      case 'down': return 'Declining';
      case 'stable': return 'Stable';
      default: return 'Neutral';
    }
  };

  const getCardClass = (color, trend) => {
    const baseClass = styles.overviewCard;
    const colorClass = styles[`card${color.charAt(0).toUpperCase() + color.slice(1)}`];
    const trendClass = styles[`trend${trend.charAt(0).toUpperCase() + trend.slice(1)}`];
    return `${baseClass} ${colorClass} ${trendClass}`;
  };

  return (
    <div className={`${styles.overviewCardsWrapper} ${sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarOpen} ${theme === 'dark' ? styles.darkTheme : ''}`}>
      <Container fluid>
        <div className={styles.overviewCardsContainer}>
          {/* Error Alert */}
          {error && (
            <Alert variant="warning" className={styles.errorAlert}>
              <div className={styles.alertContent}>
                <span>{error}</span>
                <button 
                  onClick={fetchPortfolioData}
                  className={styles.refreshButton}
                  disabled={loading}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : '🔄 Refresh'}
                </button>
              </div>
            </Alert>
          )}
          
          {/* Last Updated Indicator */}
          {lastUpdated && !error && (
            <div className={styles.lastUpdated}>
              <small className="text-muted">
                📊 Live Data • Updated: {formatTimeAgo(lastUpdated)}
                {metrics.holdingsCount > 0 && ` • ${metrics.holdingsCount} Holdings`}
              </small>
            </div>
          )}
          
          <Row className="g-3">
            {cards.map((card, index) => (
              <Col key={card.title} xl={4} lg={6} md={6} sm={12}>
                <Card 
                  className={getCardClass(card.color, card.trend)}
                  data-tooltip={card.description}
                >
                  <Card.Body>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardIcon}>
                        <span className={styles.icon} role="img" aria-label={card.title}>
                          {card.icon}
                        </span>
                      </div>
                      <div className={styles.cardTitles}>
                        <Card.Title className={styles.cardTitle}>{card.title}</Card.Title>
                        <Card.Subtitle className={styles.cardSubtitle}>
                          {card.subtitle}
                        </Card.Subtitle>
                      </div>
                      {card.percentage && (
                        <Badge 
                          bg={card.color} 
                          className={styles.percentageBadge}
                        >
                          {card.percentage}
                        </Badge>
                      )}
                    </div>
                    
                    <div className={styles.cardContent}>
                      <div className={styles.cardValue}>{card.value}</div>
                      <div className={styles.cardTrend}>
                        <span className={styles.trendIcon} role="img" aria-label={card.trend}>
                          {getTrendIcon(card.trend)}
                        </span>
                        <span className={styles.trendText}>
                          {getTrendText(card.trend)}
                        </span>
                      </div>
                    </div>

                    <div className={styles.cardFooter}>
                      <div className={styles.progressContainer}>
                        <div 
                          className={`${styles.progressBar} ${card.trend}`}
                          style={{
                            width: `${card.progressValue}%`
                          }}
                          aria-label={`Progress: ${card.progressValue.toFixed(0)}%`}
                        ></div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* 🆕 QUICK ACTIONS */}
          {!loading && (
            <div className={styles.quickActions}>
              <button 
                className={styles.actionBtn}
                onClick={fetchPortfolioData}
                title="Refresh data"
              >
                🔄 Refresh
              </button>
              <button 
                className={styles.actionBtn}
                onClick={() => window.location.href = '/dashboard/trade'}
                title="Start trading"
              >
                💰 Trade Now
              </button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default OverviewCards;