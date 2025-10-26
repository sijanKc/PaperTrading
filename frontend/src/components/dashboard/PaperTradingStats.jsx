import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Badge, 
  ProgressBar, 
  Button,
  Tooltip,
  OverlayTrigger
} from 'react-bootstrap';
import styles from '../css/PaperTradingStats.module.css';

const PaperTradingStats = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('today'); // 'today', 'week', 'month', 'all'

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

  // Sample paper trading statistics data
  const sampleStats = {
    virtualBalance: 1250000.75,
    initialBalance: 1000000.00,
    totalProfitLoss: 250000.75,
    totalProfitLossPercent: 25.0,
    dailyProfitLoss: 2450.50,
    dailyProfitLossPercent: 0.20,
    weeklyProfitLoss: 15200.25,
    weeklyProfitLossPercent: 1.23,
    monthlyProfitLoss: 48750.60,
    monthlyProfitLossPercent: 3.95,
    totalTrades: 147,
    winningTrades: 89,
    losingTrades: 58,
    winRate: 60.5,
    avgWin: 2850.75,
    avgLoss: -1850.25,
    profitFactor: 2.34,
    sharpeRatio: 1.85,
    maxDrawdown: -8.75,
    bestTrade: 12500.00,
    worstTrade: -6850.50,
    avgHoldingPeriod: '3.2 days',
    mostTradedStock: 'NLIC',
    sectorAllocation: {
      'Commercial Banks': 35,
      'Insurance': 25,
      'Hydroelectricity': 20,
      'Telecommunication': 15,
      'Hotels': 5
    },
    performanceHistory: [
      { period: 'Jan', return: 2.5 },
      { period: 'Feb', return: -1.2 },
      { period: 'Mar', return: 4.8 },
      { period: 'Apr', return: 3.1 },
      { period: 'May', return: 5.2 },
      { period: 'Jun', return: 2.7 }
    ],
    riskMetrics: {
      volatility: 12.8,
      beta: 1.2,
      alpha: 2.5,
      sortinoRatio: 2.1
    }
  };

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setStats(sampleStats);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getTimeframeStats = () => {
    if (!stats) return null;

    switch (timeframe) {
      case 'today':
        return {
          profitLoss: stats.dailyProfitLoss,
          profitLossPercent: stats.dailyProfitLossPercent,
          label: 'Today'
        };
      case 'week':
        return {
          profitLoss: stats.weeklyProfitLoss,
          profitLossPercent: stats.weeklyProfitLossPercent,
          label: 'This Week'
        };
      case 'month':
        return {
          profitLoss: stats.monthlyProfitLoss,
          profitLossPercent: stats.monthlyProfitLossPercent,
          label: 'This Month'
        };
      case 'all':
        return {
          profitLoss: stats.totalProfitLoss,
          profitLossPercent: stats.totalProfitLossPercent,
          label: 'All Time'
        };
      default:
        return {
          profitLoss: stats.dailyProfitLoss,
          profitLossPercent: stats.dailyProfitLossPercent,
          label: 'Today'
        };
    }
  };

  const getPerformanceColor = (value) => {
    return value >= 0 ? 'success' : 'danger';
  };

  const getPerformanceIcon = (value) => {
    return value >= 0 ? '📈' : '📉';
  };

  const getRiskLevel = (metric, value) => {
    if (metric === 'volatility') {
      if (value < 10) return { level: 'Low', color: 'success' };
      if (value < 20) return { level: 'Medium', color: 'warning' };
      return { level: 'High', color: 'danger' };
    }
    
    if (metric === 'maxDrawdown') {
      if (value > -5) return { level: 'Low', color: 'success' };
      if (value > -10) return { level: 'Medium', color: 'warning' };
      return { level: 'High', color: 'danger' };
    }

    return { level: 'Medium', color: 'warning' };
  };

  const formatCurrency = (amount) => {
    return `रु ${Math.abs(amount).toLocaleString('en-NP', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const PerformanceMetric = ({ title, value, percent, subtitle, tooltip }) => (
    <OverlayTrigger placement="top" overlay={<Tooltip>{tooltip}</Tooltip>}>
      <div className={styles.performanceMetric}>
        <div className={styles.metricHeader}>
          <span className={styles.metricTitle}>{title}</span>
          <Badge bg={getPerformanceColor(value)} className={styles.metricBadge}>
            {getPerformanceIcon(value)} {percent}%
          </Badge>
        </div>
        <div className={`${styles.metricValue} ${styles[getPerformanceColor(value)]}`}>
          {value >= 0 ? '+' : ''}{formatCurrency(value)}
        </div>
        {subtitle && <div className={styles.metricSubtitle}>{subtitle}</div>}
      </div>
    </OverlayTrigger>
  );

  const TradingMetric = ({ icon, title, value, subtitle, color = 'primary' }) => (
    <div className={styles.tradingMetric}>
      <div className={styles.metricIcon}>{icon}</div>
      <div className={styles.metricContent}>
        <div className={styles.metricTitle}>{title}</div>
        <div className={`${styles.metricValue} ${styles[color]}`}>{value}</div>
        {subtitle && <div className={styles.metricSubtitle}>{subtitle}</div>}
      </div>
    </div>
  );

  const RiskMetric = ({ title, value, metric, tooltip }) => {
    const risk = getRiskLevel(metric, value);
    
    return (
      <OverlayTrigger placement="top" overlay={<Tooltip>{tooltip}</Tooltip>}>
        <div className={styles.riskMetric}>
          <div className={styles.riskHeader}>
            <span className={styles.riskTitle}>{title}</span>
            <Badge bg={risk.color} className={styles.riskBadge}>
              {risk.level}
            </Badge>
          </div>
          <div className={styles.riskValue}>{value}{metric === 'volatility' || metric === 'maxDrawdown' ? '%' : ''}</div>
          <ProgressBar 
            now={Math.min(Math.abs(value) * (metric === 'volatility' ? 5 : 10), 100)}
            variant={risk.color}
            className={styles.riskProgress}
          />
        </div>
      </OverlayTrigger>
    );
  };

  const TimeframeSelector = () => (
    <div className={styles.timeframeSelector}>
      <div className={styles.selectorLabel}>Performance Period:</div>
      <div className={styles.timeframeButtons}>
        {['today', 'week', 'month', 'all'].map(tf => (
          <Button
            key={tf}
            variant={timeframe === tf ? 'primary' : 'outline-primary'}
            size="sm"
            onClick={() => setTimeframe(tf)}
            className={styles.timeframeBtn}
          >
            {tf.charAt(0).toUpperCase() + tf.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`${styles.paperStatsWrapper} ${sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarOpen}`}>
        <Card className={styles.paperStatsCard}>
          <Card.Body className={styles.textCenter}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading trading statistics...</p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`${styles.paperStatsWrapper} ${sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarOpen}`}>
        <Card className={styles.paperStatsCard}>
          <Card.Body className={styles.textCenter}>
            <div className={styles.noStats}>📊</div>
            <h6>No Trading Data</h6>
            <p>Start trading to see your statistics</p>
            <Button variant="primary" size="sm">
              Start Trading
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  const timeframeStats = getTimeframeStats();

  return (
    <div className={`${styles.paperStatsWrapper} ${sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarOpen}`}>
      <Card className={styles.paperStatsCard}>
        <Card.Header className={styles.statsHeader}>
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <h5 className={styles.cardTitle}>
                <span className={styles.headerIcon}>🧪</span>
                Paper Trading Statistics
              </h5>
              <Badge bg="warning" text="dark" className={styles.demoBadge}>
                Virtual Money
              </Badge>
            </div>
            <TimeframeSelector />
          </div>
        </Card.Header>

        <Card.Body className={styles.statsBody}>
          {/* Performance Overview */}
          <div className={styles.performanceOverview}>
            <div className={styles.overviewHeader}>
              <h6 className={styles.sectionTitle}>📊 Performance Overview</h6>
              <span className={styles.timeframeLabel}>{timeframeStats.label}</span>
            </div>
            
            <Row className={styles.g3}>
              <Col lg={4} md={6}>
                <PerformanceMetric
                  title="Virtual Balance"
                  value={stats.virtualBalance - stats.initialBalance}
                  percent={timeframeStats.profitLossPercent}
                  subtitle={`Current: ${formatCurrency(stats.virtualBalance)}`}
                  tooltip="Your current virtual account balance including all profits/losses"
                />
              </Col>
              
              <Col lg={4} md={6}>
                <PerformanceMetric
                  title="Profit/Loss"
                  value={timeframeStats.profitLoss}
                  percent={timeframeStats.profitLossPercent}
                  subtitle={`${timeframeStats.label} performance`}
                  tooltip={`Your ${timeframeStats.label.toLowerCase()} trading performance`}
                />
              </Col>
              
              <Col lg={4} md={6}>
                <div className={styles.balanceMetric}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricTitle}>Account Growth</span>
                    <Badge bg="info" className={styles.metricBadge}>
                      +{stats.totalProfitLossPercent}%
                    </Badge>
                  </div>
                  <div className={styles.progressSection}>
                    <ProgressBar className={styles.growthProgress}>
                      <ProgressBar 
                        now={(stats.initialBalance / stats.virtualBalance) * 100} 
                        variant="secondary"
                        label={`Initial: ${formatCurrency(stats.initialBalance)}`}
                      />
                      <ProgressBar 
                        now={(stats.totalProfitLoss / stats.virtualBalance) * 100} 
                        variant="success"
                        label={`Profit: ${formatCurrency(stats.totalProfitLoss)}`}
                      />
                    </ProgressBar>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* Trading Statistics */}
          <div className={styles.tradingStatistics}>
            <h6 className={styles.sectionTitle}>🎯 Trading Statistics</h6>
            <Row className={styles.g3}>
              <Col xl={3} lg={6} md={6} sm={12}>
                <TradingMetric
                  icon="📈"
                  title="Total Trades"
                  value={stats.totalTrades}
                  subtitle={`${stats.winningTrades} wins / ${stats.losingTrades} losses`}
                  color="primary"
                />
              </Col>
              
              <Col xl={3} lg={6} md={6} sm={12}>
                <TradingMetric
                  icon="🎯"
                  title="Win Rate"
                  value={`${stats.winRate}%`}
                  subtitle={`Profit Factor: ${stats.profitFactor}`}
                  color="success"
                />
              </Col>
              
              <Col xl={3} lg={6} md={6} sm={12}>
                <TradingMetric
                  icon="💰"
                  title="Avg. Win/Loss"
                  value={formatCurrency(stats.avgWin)}
                  subtitle={`Loss: ${formatCurrency(stats.avgLoss)}`}
                  color="warning"
                />
              </Col>
              
              <Col xl={3} lg={6} md={6} sm={12}>
                <TradingMetric
                  icon="⏱️"
                  title="Avg. Holding"
                  value={stats.avgHoldingPeriod}
                  subtitle="Most traded: NLIC"
                  color="info"
                />
              </Col>
            </Row>

            {/* Best/Worst Trades */}
            <Row className={`${styles.g3} ${styles.mt2}`}>
              <Col md={6}>
                <div className={`${styles.tradeExtreme} ${styles.bestTrade}`}>
                  <div className={styles.extremeHeader}>
                    <span className={styles.extremeTitle}>🏆 Best Trade</span>
                    <Badge bg="success" className={styles.extremeBadge}>
                      +{formatCurrency(stats.bestTrade)}
                    </Badge>
                  </div>
                  <div className={styles.extremeSubtitle}>Maximum single trade profit</div>
                </div>
              </Col>
              
              <Col md={6}>
                <div className={`${styles.tradeExtreme} ${styles.worstTrade}`}>
                  <div className={styles.extremeHeader}>
                    <span className={styles.extremeTitle}>💥 Worst Trade</span>
                    <Badge bg="danger" className={styles.extremeBadge}>
                      {formatCurrency(stats.worstTrade)}
                    </Badge>
                  </div>
                  <div className={styles.extremeSubtitle}>Maximum single trade loss</div>
                </div>
              </Col>
            </Row>
          </div>

          {/* Risk Metrics */}
          <div className={styles.riskMetrics}>
            <h6 className={styles.sectionTitle}>🛡️ Risk Metrics</h6>
            <Row className={styles.g3}>
              <Col xl={3} lg={6} md={6} sm={12}>
                <RiskMetric
                  title="Volatility"
                  value={stats.riskMetrics.volatility}
                  metric="volatility"
                  tooltip="Portfolio volatility - standard deviation of returns"
                />
              </Col>
              
              <Col xl={3} lg={6} md={6} sm={12}>
                <RiskMetric
                  title="Max Drawdown"
                  value={stats.maxDrawdown}
                  metric="maxDrawdown"
                  tooltip="Maximum peak-to-trough decline during specific period"
                />
              </Col>
              
              <Col xl={3} lg={6} md={6} sm={12}>
                <RiskMetric
                  title="Sharpe Ratio"
                  value={stats.sharpeRatio}
                  metric="sharpe"
                  tooltip="Risk-adjusted return metric"
                />
              </Col>
              
              <Col xl={3} lg={6} md={6} sm={12}>
                <RiskMetric
                  title="Beta"
                  value={stats.riskMetrics.beta}
                  metric="beta"
                  tooltip="Portfolio volatility relative to the market"
                />
              </Col>
            </Row>
          </div>

          {/* Performance History */}
          <div className={styles.performanceHistory}>
            <h6 className={styles.sectionTitle}>📅 6-Month Performance</h6>
            <div className={styles.historyChart}>
              {stats.performanceHistory.map((month, index) => (
                <div key={index} className={styles.historyBar}>
                  <div className={styles.barContainer}>
                    <div 
                      className={`${styles.barFill} ${month.return >= 0 ? styles.positive : styles.negative}`}
                      style={{ height: `${Math.min(Math.abs(month.return) * 10, 100)}%` }}
                    ></div>
                  </div>
                  <div className={styles.barLabel}>
                    <span className={styles.barPeriod}>{month.period}</span>
                    <span className={`${styles.barReturn} ${month.return >= 0 ? styles.positive : styles.negative}`}>
                      {month.return >= 0 ? '+' : ''}{month.return}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sector Allocation */}
          <div className={styles.sectorAllocation}>
            <h6 className={styles.sectionTitle}>🏢 Sector Allocation</h6>
            <div className={styles.allocationBars}>
              {Object.entries(stats.sectorAllocation).map(([sector, percentage]) => (
                <div key={sector} className={styles.allocationItem}>
                  <div className={styles.allocationHeader}>
                    <span className={styles.sectorName}>{sector}</span>
                    <span className={styles.sectorPercent}>{percentage}%</span>
                  </div>
                  <ProgressBar 
                    now={percentage}
                    className={styles.allocationProgress}
                  >
                    <ProgressBar 
                      now={percentage}
                      variant={getSectorColor(sector)}
                    />
                  </ProgressBar>
                </div>
              ))}
            </div>
          </div>
        </Card.Body>

        <Card.Footer className={styles.statsFooter}>
          <div className={styles.footerContent}>
            <div className={styles.footerStats}>
              <span className={styles.stat}>
                <strong>Alpha:</strong> {stats.riskMetrics.alpha}%
              </span>
              <span className={styles.stat}>
                <strong>Sortino Ratio:</strong> {stats.riskMetrics.sortinoRatio}
              </span>
              <span className={styles.stat}>
                <strong>Total Return:</strong> +{stats.totalProfitLossPercent}%
              </span>
            </div>
            <small className={styles.textMuted}>
              Paper Trading Simulation • Educational Purpose Only
            </small>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};

// Helper function for sector colors
const getSectorColor = (sector) => {
  const colors = {
    'Commercial Banks': 'primary',
    'Insurance': 'success',
    'Hydroelectricity': 'info',
    'Telecommunication': 'warning',
    'Hotels': 'danger'
  };
  return colors[sector] || 'secondary';
};

export default PaperTradingStats;