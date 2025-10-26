import React, { useState } from 'react';
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import styles from './css/Analytics.module.css';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('1m');

  // Mock analytics data
  const analyticsData = {
    overview: {
      portfolioValue: 124500,
      totalReturn: 15600,
      returnPercent: 14.3,
      dailyChange: 1200,
      dailyChangePercent: 0.98,
      sharpeRatio: 1.85,
      volatility: 12.8,
      maxDrawdown: -8.2,
      beta: 1.2
    },
    performance: {
      monthlyReturns: [
        { month: 'Jan', return: 2.5, benchmark: 1.8 },
        { month: 'Feb', return: -1.2, benchmark: -0.5 },
        { month: 'Mar', return: 4.8, benchmark: 3.2 },
        { month: 'Apr', return: 3.1, benchmark: 2.4 },
        { month: 'May', return: 5.2, benchmark: 4.1 },
        { month: 'Jun', return: 2.7, benchmark: 2.1 }
      ],
      cumulativeReturn: 14.3,
      benchmarkReturn: 11.2,
      alpha: 3.1
    },
    risk: {
      metrics: {
        sharpe: 1.85,
        sortino: 2.34,
        treynor: 12.8,
        information: 1.2
      },
      drawdowns: [
        { period: 'Mar 2024', drawdown: -8.2, duration: '15 days' },
        { period: 'Jan 2024', drawdown: -5.6, duration: '8 days' },
        { period: 'Nov 2023', drawdown: -6.8, duration: '12 days' }
      ]
    },
    allocation: {
      sectors: [
        { name: 'Commercial Banks', value: 35, color: '#3b82f6' },
        { name: 'Insurance', value: 25, color: '#10b981' },
        { name: 'Hydroelectricity', value: 20, color: '#f59e0b' },
        { name: 'Telecommunication', value: 15, color: '#ef4444' },
        { name: 'Hotels', value: 5, color: '#8b5cf6' }
      ],
      stocks: [
        { symbol: 'NTC', allocation: 28, performance: 6.25 },
        { symbol: 'NABIL', allocation: 22, performance: 4.17 },
        { symbol: 'SCB', allocation: 18, performance: 6.67 },
        { symbol: 'NICA', allocation: 20, performance: 16.67 },
        { symbol: 'Others', allocation: 12, performance: 3.2 }
      ]
    }
  };

  const getReturnColor = (value) => {
    return value >= 0 ? styles.positive : styles.negative;
  };

  const getReturnIcon = (value) => {
    return value >= 0 ? '📈' : '📉';
  };

  const formatCurrency = (amount) => {
    return `Nrs. ${amount.toLocaleString('en-NP')}`;
  };

  const OverviewCards = () => (
    <div className={styles.overviewGrid}>
      <div className={styles.overviewCard}>
        <div className={styles.cardHeader}>
          <h3>Portfolio Value</h3>
          <span className={styles.cardIcon}>💰</span>
        </div>
        <div className={styles.cardValue}>{formatCurrency(analyticsData.overview.portfolioValue)}</div>
        <div className={styles.cardChange}>
          <span className={getReturnColor(analyticsData.overview.dailyChange)}>
            {getReturnIcon(analyticsData.overview.dailyChange)}
            +{analyticsData.overview.dailyChange.toLocaleString()} ({analyticsData.overview.dailyChangePercent}%)
          </span>
          <span className={styles.changeLabel}>Today</span>
        </div>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardHeader}>
          <h3>Total Return</h3>
          <span className={styles.cardIcon}>🎯</span>
        </div>
        <div className={`${styles.cardValue} ${getReturnColor(analyticsData.overview.totalReturn)}`}>
          {formatCurrency(analyticsData.overview.totalReturn)}
        </div>
        <div className={styles.cardChange}>
          <span className={getReturnColor(analyticsData.overview.returnPercent)}>
            {analyticsData.overview.returnPercent}% Overall
          </span>
          <span className={styles.changeLabel}>Since inception</span>
        </div>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardHeader}>
          <h3>Risk Metrics</h3>
          <span className={styles.cardIcon}>🛡️</span>
        </div>
        <div className={styles.metricsGrid}>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Sharpe Ratio</span>
            <span className={styles.metricValue}>{analyticsData.overview.sharpeRatio}</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Volatility</span>
            <span className={styles.metricValue}>{analyticsData.overview.volatility}%</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Max Drawdown</span>
            <span className={styles.negative}>{analyticsData.overview.maxDrawdown}%</span>
          </div>
        </div>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardHeader}>
          <h3>Portfolio Beta</h3>
          <span className={styles.cardIcon}>📊</span>
        </div>
        <div className={styles.betaIndicator}>
          <div className={styles.betaValue}>{analyticsData.overview.beta}</div>
          <div className={styles.betaLabel}>
            {analyticsData.overview.beta > 1 ? 'Aggressive' : 'Defensive'} Portfolio
          </div>
        </div>
        <div className={styles.betaDescription}>
          {analyticsData.overview.beta > 1 
            ? 'More volatile than market' 
            : 'Less volatile than market'
          }
        </div>
      </div>
    </div>
  );

  const PerformanceChart = () => (
    <div className={styles.performanceSection}>
      <div className={styles.sectionHeader}>
        <h3>📈 Performance vs Benchmark</h3>
        <div className={styles.performanceStats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Your Return</span>
            <span className={styles.positive}>{analyticsData.performance.cumulativeReturn}%</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Benchmark</span>
            <span className={styles.positive}>{analyticsData.performance.benchmarkReturn}%</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Alpha</span>
            <span className={styles.positive}>+{analyticsData.performance.alpha}%</span>
          </div>
        </div>
      </div>

      <div className={styles.performanceBars}>
        {analyticsData.performance.monthlyReturns.map((month, index) => (
          <div key={index} className={styles.monthBar}>
            <div className={styles.barGroup}>
              <div className={styles.barContainer}>
                <div 
                  className={`${styles.returnBar} ${getReturnColor(month.return)}`}
                  style={{ height: `${Math.min(Math.abs(month.return) * 8, 100)}%` }}
                >
                  <span className={styles.barValue}>{month.return}%</span>
                </div>
              </div>
              <div className={styles.barContainer}>
                <div 
                  className={`${styles.benchmarkBar} ${getReturnColor(month.benchmark)}`}
                  style={{ height: `${Math.min(Math.abs(month.benchmark) * 8, 100)}%` }}
                >
                  <span className={styles.barValue}>{month.benchmark}%</span>
                </div>
              </div>
            </div>
            <div className={styles.monthLabel}>{month.month}</div>
          </div>
        ))}
      </div>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.portfolioColor}`}></div>
          <span>Your Portfolio</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.benchmarkColor}`}></div>
          <span>Market Benchmark</span>
        </div>
      </div>
    </div>
  );

  const RiskMetrics = () => (
    <div className={styles.riskSection}>
      <div className={styles.sectionHeader}>
        <h3>🛡️ Risk Analysis</h3>
      </div>

      <div className={styles.riskGrid}>
        <div className={styles.riskCard}>
          <h4>Risk-Adjusted Returns</h4>
          <div className={styles.riskMetrics}>
            {Object.entries(analyticsData.risk.metrics).map(([key, value]) => (
              <div key={key} className={styles.riskMetric}>
                <span className={styles.riskLabel}>
                  {key.charAt(0).toUpperCase() + key.slice(1)} Ratio
                </span>
                <span className={styles.riskValue}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.riskCard}>
          <h4>Historical Drawdowns</h4>
          <div className={styles.drawdowns}>
            {analyticsData.risk.drawdowns.map((drawdown, index) => (
              <div key={index} className={styles.drawdownItem}>
                <div className={styles.drawdownInfo}>
                  <span className={styles.drawdownPeriod}>{drawdown.period}</span>
                  <span className={styles.negative}>{drawdown.drawdown}%</span>
                </div>
                <div className={styles.drawdownDuration}>
                  Duration: {drawdown.duration}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const AllocationAnalysis = () => (
    <div className={styles.allocationSection}>
      <div className={styles.sectionHeader}>
        <h3>🏢 Portfolio Allocation</h3>
      </div>

      <div className={styles.allocationGrid}>
        <div className={styles.allocationCard}>
          <h4>Sector Allocation</h4>
          <div className={styles.sectorAllocation}>
            {analyticsData.allocation.sectors.map((sector, index) => (
              <div key={index} className={styles.sectorItem}>
                <div className={styles.sectorHeader}>
                  <span className={styles.sectorName}>{sector.name}</span>
                  <span className={styles.sectorPercent}>{sector.value}%</span>
                </div>
                <div className={styles.allocationBar}>
                  <div 
                    className={styles.allocationFill}
                    style={{ 
                      width: `${sector.value}%`,
                      backgroundColor: sector.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.allocationCard}>
          <h4>Stock Performance</h4>
          <div className={styles.stockPerformance}>
            {analyticsData.allocation.stocks.map((stock, index) => (
              <div key={index} className={styles.stockItem}>
                <div className={styles.stockInfo}>
                  <span className={styles.stockSymbol}>{stock.symbol}</span>
                  <span className={styles.stockAllocation}>{stock.allocation}%</span>
                </div>
                <div className={`${styles.stockReturn} ${getReturnColor(stock.performance)}`}>
                  {getReturnIcon(stock.performance)} {stock.performance}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const Insights = () => (
    <div className={styles.insightsSection}>
      <div className={styles.sectionHeader}>
        <h3>💡 AI Insights</h3>
      </div>

      <div className={styles.insightsGrid}>
        <div className={styles.insightCard}>
          <div className={styles.insightIcon}>🎯</div>
          <h4>Strength</h4>
          <p>Your portfolio shows excellent diversification across sectors with strong performance in banking stocks.</p>
        </div>

        <div className={styles.insightCard}>
          <div className={styles.insightIcon}>⚠️</div>
          <h4>Opportunity</h4>
          <p>Consider adding more exposure to emerging sectors like technology and renewable energy.</p>
        </div>

        <div className={styles.insightCard}>
          <div className={styles.insightIcon}>📈</div>
          <h4>Performance</h4>
          <p>You're outperforming the market by 3.1% with better risk-adjusted returns.</p>
        </div>

        <div className={styles.insightCard}>
          <div className={styles.insightIcon}>🛡️</div>
          <h4>Risk Management</h4>
          <p>Your maximum drawdown is within acceptable limits. Maintain current stop-loss strategies.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      
      <div className={styles.dashboardMain}>
        <Header />
        
        <main className={styles.analyticsContainer}>
          {/* Header */}
          <div className={styles.header}>
            <h1>📊 Portfolio Analytics</h1>
            <p>Deep insights into your investment performance and risk metrics</p>
          </div>

          {/* Time Range Selector */}
          <div className={styles.controls}>
            <div className={styles.timeRangeSelector}>
              <span className={styles.selectorLabel}>Time Range:</span>
              <div className={styles.timeRangeButtons}>
                {['1w', '1m', '3m', '6m', '1y', 'All'].map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`${styles.rangeButton} ${timeRange === range ? styles.rangeActive : ''}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.exportSection}>
              <button className={styles.exportButton}>
                📥 Export Report
              </button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className={styles.tabsContainer}>
            <div className={styles.tabsNav}>
              <button
                onClick={() => setActiveTab('overview')}
                className={`${styles.tabButton} ${activeTab === 'overview' ? styles.tabActive : ''}`}
              >
                📊 Overview
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`${styles.tabButton} ${activeTab === 'performance' ? styles.tabActive : ''}`}
              >
                📈 Performance
              </button>
              <button
                onClick={() => setActiveTab('risk')}
                className={`${styles.tabButton} ${activeTab === 'risk' ? styles.tabActive : ''}`}
              >
                🛡️ Risk Analysis
              </button>
              <button
                onClick={() => setActiveTab('allocation')}
                className={`${styles.tabButton} ${activeTab === 'allocation' ? styles.tabActive : ''}`}
              >
                🎯 Allocation
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`${styles.tabButton} ${activeTab === 'insights' ? styles.tabActive : ''}`}
              >
                💡 Insights
              </button>
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
              {activeTab === 'overview' && (
                <div className={styles.overviewTab}>
                  <OverviewCards />
                  <PerformanceChart />
                </div>
              )}

              {activeTab === 'performance' && (
                <div className={styles.performanceTab}>
                  <PerformanceChart />
                  <div className={styles.comparisonSection}>
                    <h3>📊 Detailed Performance Metrics</h3>
                    <div className={styles.metricsGrid}>
                      <div className={styles.metricCard}>
                        <h4>Annualized Return</h4>
                        <div className={styles.metricValue}>16.8%</div>
                        <div className={styles.metricDescription}>Compounded annual growth</div>
                      </div>
                      <div className={styles.metricCard}>
                        <h4>Volatility</h4>
                        <div className={styles.metricValue}>12.8%</div>
                        <div className={styles.metricDescription}>Annual standard deviation</div>
                      </div>
                      <div className={styles.metricCard}>
                        <h4>Best Month</h4>
                        <div className={`${styles.metricValue} ${styles.positive}`}>+5.2%</div>
                        <div className={styles.metricDescription}>May 2024</div>
                      </div>
                      <div className={styles.metricCard}>
                        <h4>Worst Month</h4>
                        <div className={`${styles.metricValue} ${styles.negative}`}>-1.2%</div>
                        <div className={styles.metricDescription}>February 2024</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'risk' && (
                <div className={styles.riskTab}>
                  <RiskMetrics />
                </div>
              )}

              {activeTab === 'allocation' && (
                <div className={styles.allocationTab}>
                  <AllocationAnalysis />
                </div>
              )}

              {activeTab === 'insights' && (
                <div className={styles.insightsTab}>
                  <Insights />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;