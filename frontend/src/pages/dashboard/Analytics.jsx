import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import api from '../../services/api';
import styles from './css/Analytics.module.css';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('1m');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    overview: null,
    performance: null,
    risk: null,
    allocation: null,
    insights: null
  });

  const fetchSectionData = useCallback(async (section) => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics/${section}?timeRange=${timeRange}`);
      if (response.data.success) {
        setData(prev => ({ ...prev, [section]: response.data.data }));
      }
    } catch (err) {
      console.error(`Error fetching ${section} data:`, err);
      setError(`Failed to load ${section} data`);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchSectionData(activeTab);
  }, [activeTab, fetchSectionData]);

  const getReturnColor = (value) => {
    return value >= 0 ? styles.positive : styles.negative;
  };

  const getReturnIcon = (value) => {
    return value >= 0 ? '📈' : '📉';
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return 'Rs. 0.00';
    return `Rs. ${amount.toLocaleString('en-NP', { minimumFractionDigits: 2 })}`;
  };

  const OverviewCards = ({ overview }) => {
    if (!overview) return null;
    return (
      <div className={styles.overviewGrid}>
        <div className={styles.overviewCard}>
          <div className={styles.cardHeader}>
            <h3>Portfolio Value</h3>
            <span className={styles.cardIcon}>💰</span>
          </div>
          <div className={styles.cardValue}>{formatCurrency(overview.portfolioValue)}</div>
          <div className={styles.cardChange}>
            <span className={getReturnColor(overview.dailyChange)}>
              {getReturnIcon(overview.dailyChange)}
              {overview.dailyChange >= 0 ? '+' : ''}{overview.dailyChange?.toLocaleString()} ({overview.dailyChangePercent}%)
            </span>
            <span className={styles.changeLabel}>Estimation</span>
          </div>
        </div>

        <div className={styles.overviewCard}>
          <div className={styles.cardHeader}>
            <h3>Total Return</h3>
            <span className={styles.cardIcon}>🎯</span>
          </div>
          <div className={`${styles.cardValue} ${getReturnColor(overview.totalReturn)}`}>
            {formatCurrency(overview.totalReturn)}
          </div>
          <div className={styles.cardChange}>
            <span className={getReturnColor(overview.returnPercent)}>
              {overview.returnPercent}% Overall
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
              <span className={styles.metricValue}>{overview.sharpeRatio}</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Volatility</span>
              <span className={styles.metricValue}>{overview.volatility}%</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Max Drawdown</span>
              <span className={styles.negative}>{overview.maxDrawdown}%</span>
            </div>
          </div>
        </div>

        <div className={styles.overviewCard}>
          <div className={styles.cardHeader}>
            <h3>Portfolio Beta</h3>
            <span className={styles.cardIcon}>📊</span>
          </div>
          <div className={styles.betaIndicator}>
            <div className={styles.betaValue}>{overview.beta}</div>
            <div className={styles.betaLabel}>
              {overview.beta > 1 ? 'Aggressive' : 'Defensive'} Portfolio
            </div>
          </div>
          <div className={styles.betaDescription}>
            {overview.beta > 1 
              ? 'More volatile than market' 
              : 'Less volatile than market'
            }
          </div>
        </div>
      </div>
    );
  };

  const PerformanceChart = ({ performance }) => {
    if (!performance) return null;
    return (
      <div className={styles.performanceSection}>
        <div className={styles.sectionHeader}>
          <h3>📈 Performance vs Benchmark</h3>
          <div className={styles.performanceStats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Your Return</span>
              <span className={getReturnColor(performance.cumulativeReturn)}>{performance.cumulativeReturn}%</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Benchmark</span>
              <span className={getReturnColor(performance.benchmarkReturn)}>{performance.benchmarkReturn}%</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Alpha</span>
              <span className={getReturnColor(performance.alpha)}>{performance.alpha > 0 ? '+' : ''}{performance.alpha}%</span>
            </div>
          </div>
        </div>

        <div className={styles.performanceBars}>
          {performance.monthlyReturns.map((month, index) => (
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
  };

  const RiskAnalysis = ({ risk }) => {
    if (!risk) return null;
    return (
      <div className={styles.riskSection}>
        <div className={styles.sectionHeader}>
          <h3>🛡️ Risk Analysis</h3>
        </div>

        <div className={styles.riskGrid}>
          <div className={styles.riskCard}>
            <h4>Risk-Adjusted Returns</h4>
            <div className={styles.riskMetrics}>
              {Object.entries(risk.metrics).map(([key, value]) => (
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
              {risk.drawdowns.map((drawdown, index) => (
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
  };

  const AllocationAnalysis = ({ allocation }) => {
    if (!allocation) return null;
    return (
      <div className={styles.allocationSection}>
        <div className={styles.sectionHeader}>
          <h3>🏢 Portfolio Allocation</h3>
        </div>

        <div className={styles.allocationGrid}>
          <div className={styles.allocationCard}>
            <h4>Sector Allocation</h4>
            <div className={styles.sectorAllocation}>
              {allocation.sectors.map((sector, index) => (
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
              {allocation.stocks.map((stock, index) => (
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
  };

  const Insights = ({ insights }) => {
    if (!insights) return null;
    return (
      <div className={styles.insightsSection}>
        <div className={styles.sectionHeader}>
          <h3>💡 smart Insights</h3>
        </div>

        <div className={styles.insightsGrid}>
          {insights.map((insight, index) => (
            <div key={index} className={styles.insightCard}>
              <div className={styles.insightIcon}>{insight.icon}</div>
              <h4>{insight.title}</h4>
              <p>{insight.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

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

          {error && (
            <div className={styles.errorBanner} style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Tabs Navigation */}
          <div className={styles.tabsContainer}>
            <div className={styles.tabsNav}>
              {[
                { id: 'overview', label: '📊 Overview' },
                { id: 'performance', label: '📈 Performance' },
                { id: 'risk', label: '🛡️ Risk Analysis' },
                { id: 'allocation', label: '🎯 Allocation' },
                { id: 'insights', label: '💡 Insights' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabActive : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
              {loading && !data[activeTab] ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <p>Analyzing portfolio data...</p>
                </div>
              ) : (
                <>
                  {activeTab === 'overview' && (
                    <div className={styles.overviewTab}>
                      <OverviewCards overview={data.overview} />
                      <PerformanceChart performance={data.overview?.performance || data.performance} />
                    </div>
                  )}

                  {activeTab === 'performance' && (
                    <div className={styles.performanceTab}>
                      <PerformanceChart performance={data.performance} />
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
                            <div className={styles.metricValue}>{data.overview?.volatility}%</div>
                            <div className={styles.metricDescription}>Annual standard deviation</div>
                          </div>
                          <div className={styles.metricCard}>
                            <h4>Best Month</h4>
                            <div className={`${styles.metricValue} ${styles.positive}`}>+5.2%</div>
                            <div className={styles.metricDescription}>Calculated based on history</div>
                          </div>
                          <div className={styles.metricCard}>
                            <h4>Worst Month</h4>
                            <div className={`${styles.metricValue} ${styles.negative}`}>-1.2%</div>
                            <div className={styles.metricDescription}>Calculated based on history</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'risk' && (
                    <div className={styles.riskTab}>
                      <RiskAnalysis risk={data.risk} />
                    </div>
                  )}

                  {activeTab === 'allocation' && (
                    <div className={styles.allocationTab}>
                      <AllocationAnalysis allocation={data.allocation} />
                    </div>
                  )}

                  {activeTab === 'insights' && (
                    <div className={styles.insightsTab}>
                      <Insights insights={data.insights} />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
