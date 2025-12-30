// pages/dashboard/Portfolio.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import { portfolioService } from '../../services/portfolioService';
import { Spinner, Alert } from "react-bootstrap";
import styles from './css/Portfolio.module.css';

const Portfolio = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('holdings');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portfolioData, setPortfolioData] = useState({
    summary: {
      totalValue: 0,
      totalInvested: 0,
      totalProfit: 0,
      dailyChange: 0,
      dailyChangePercent: 0
    },
    holdings: [],
    performance: {
      today: 0,
      week: 0,
      month: 0,
      overall: 0
    },
    allocation: []
  });

  const fetchPortfolioData = useCallback(async () => {
    try {
      setLoading(true);
      const [holdingsRes, overviewRes] = await Promise.all([
        portfolioService.getHoldings(),
        portfolioService.getOverview()
      ]);

      if (holdingsRes.data.success && overviewRes.data.success) {
        const holdingsData = holdingsRes.data.data;
        const overviewData = overviewRes.data.data;

        setPortfolioData({
          summary: {
            totalValue: overviewData.currentValue || 0,
            totalInvested: overviewData.totalInvestment || 0,
            totalProfit: overviewData.profitLoss || 0,
            dailyChange: overviewData.dailyPL || 0,
            dailyChangePercent: overviewData.dailyPLPercent || 0
          },
          holdings: holdingsData.holdings || [],
          performance: {
            today: holdingsData.dailyProfitLoss || 0,
            week: holdingsData.weeklyPerformance || 0,
            month: holdingsData.monthlyPerformance || 0,
            overall: overviewData.profitLoss || 0
          },
          allocation: holdingsData.sectorAllocation || []
        });
        setError(null);
      } else {
        throw new Error('Failed to fetch portfolio data');
      }
    } catch (err) {
      console.error('Portfolio fetch error:', err);
      setError('Failed to load portfolio statistics. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  const getProfitColor = (value) => {
    return value >= 0 ? styles.textGreen : styles.textRed;
  };

  const getProfitIcon = (value) => {
    return value >= 0 ? '📈' : '📉';
  };

  const formatCurrency = (value) => {
    return (value || 0).toLocaleString('en-NP', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  if (loading && portfolioData.holdings.length === 0) {
    return (
      <div className={styles.dashboardContainer}>
        <Sidebar />
        <div className={styles.dashboardMain}>
          <Header />
          <div className="d-flex justify-content-center align-items-center flex-1" style={{ minHeight: '60vh' }}>
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Calculating your portfolio metrics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      
      <div className={styles.dashboardMain}>
        <Header />
        
        <main className={styles.portfolioContainer}>
          {/* Portfolio Header */}
          <div className={styles.header}>
            <h1>💼 My Portfolio</h1>
            <p>Track your investments and performance</p>
            {error && <Alert variant="danger" className="mx-auto" style={{ maxWidth: '600px' }}>{error}</Alert>}
          </div>

          {/* Portfolio Summary Cards */}
          <div className={styles.summaryGrid}>
            {/* Total Portfolio Value */}
            <div className={styles.summaryCard}>
              <div className={styles.cardContent}>
                <div className={styles.cardText}>
                  <p className={styles.textGray}>Total Value</p>
                  <h3>Rs. {formatCurrency(portfolioData.summary.totalValue)}</h3>
                  <div className={`${getProfitColor(portfolioData.summary.dailyChange)}`}>
                    {getProfitIcon(portfolioData.summary.dailyChange)} 
                    {portfolioData.summary.dailyChange >= 0 ? '+' : ''}
                    Rs. {formatCurrency(portfolioData.summary.dailyChange)} 
                    ({portfolioData.summary.dailyChangePercent.toFixed(2)}%) today
                  </div>
                </div>
                <div className={styles.cardIcon}>💰</div>
              </div>
            </div>

            {/* Total Invested */}
            <div className={`${styles.summaryCard} ${styles.summaryCardPurple}`}>
              <div className={styles.cardContent}>
                <div className={styles.cardText}>
                  <p className={styles.textGray}>Total Invested</p>
                  <h3>Rs. {formatCurrency(portfolioData.summary.totalInvested)}</h3>
                  <div className={styles.textGray}>Market exposure</div>
                </div>
                <div className={styles.cardIcon}>💵</div>
              </div>
            </div>

            {/* Total Profit */}
            <div className={`${styles.summaryCard} ${styles.summaryCardGreen}`}>
              <div className={styles.cardContent}>
                <div className={styles.cardText}>
                  <p className={styles.textGray}>Total Profit</p>
                  <h3 className={getProfitColor(portfolioData.summary.totalProfit)}>
                    Rs. {formatCurrency(portfolioData.summary.totalProfit)}
                  </h3>
                  <div className={getProfitColor(portfolioData.summary.totalProfit)}>
                    {getProfitIcon(portfolioData.summary.totalProfit)} 
                    Realized & Unrealized
                  </div>
                </div>
                <div className={styles.cardIcon}>🎯</div>
              </div>
            </div>

            {/* Return Percentage */}
            <div className={`${styles.summaryCard} ${styles.summaryCardOrange}`}>
              <div className={styles.cardContent}>
                <div className={styles.cardText}>
                  <p className={styles.textGray}>Return %</p>
                  <h3 className={getProfitColor(portfolioData.summary.totalProfit)}>
                    {portfolioData.summary.totalInvested > 0 
                      ? ((portfolioData.summary.totalProfit / portfolioData.summary.totalInvested) * 100).toFixed(2) 
                      : '0.00'}%
                  </h3>
                  <div className={styles.textGray}>Portfolio ROI</div>
                </div>
                <div className={styles.cardIcon}>📊</div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className={styles.tabsContainer}>
            <div className={styles.tabsNav}>
              <button
                onClick={() => setActiveTab('holdings')}
                className={`${styles.tabButton} ${activeTab === 'holdings' ? styles.tabButtonActive : ''}`}
              >
                📦 Current Holdings
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`${styles.tabButton} ${activeTab === 'performance' ? styles.tabButtonActive : ''}`}
              >
                📈 Performance
              </button>
              <button
                onClick={() => setActiveTab('allocation')}
                className={`${styles.tabButton} ${activeTab === 'allocation' ? styles.tabButtonActive : ''}`}
              >
                🎯 Asset Allocation
              </button>
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
              {activeTab === 'holdings' && (
                <div>
                  <h3 className={styles.sectionTitle}>Your Stock Holdings</h3>
                  
                  {/* Holdings Table */}
                  <div className={styles.tableContainer}>
                    <table className={styles.holdingsTable}>
                      <thead className={styles.tableHeader}>
                        <tr>
                          <th>Stock</th>
                          <th>Shares</th>
                          <th>Avg Price</th>
                          <th>Current</th>
                          <th>Market Value</th>
                          <th>Profit/Loss</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portfolioData.holdings.length > 0 ? (
                          portfolioData.holdings.map((stock, index) => (
                            <tr key={stock.symbol || index} className={styles.tableRow}>
                              <td className={styles.tableCell}>
                                <div className={styles.stockInfo}>
                                  <div className={styles.stockIcon}>📊</div>
                                  <div className={styles.stockDetails}>
                                    <h4>{stock.symbol}</h4>
                                    <p>{stock.name}</p>
                                  </div>
                                </div>
                              </td>
                              <td className={styles.tableCell}>{stock.quantity}</td>
                              <td className={styles.tableCell}>Rs. {formatCurrency(stock.avgPrice)}</td>
                              <td className={styles.tableCell}>Rs. {formatCurrency(stock.currentPrice)}</td>
                              <td className={styles.tableCell}>
                                <div className={styles.fontSemibold}>
                                  Rs. {formatCurrency(stock.marketValue)}
                                </div>
                              </td>
                              <td className={styles.tableCell}>
                                <div className={`${getProfitColor(stock.profitLoss)} ${styles.fontSemibold}`}>
                                  {getProfitIcon(stock.profitLoss)} 
                                  Rs. {formatCurrency(stock.profitLoss)} 
                                  <span className={styles.textGray}>
                                    ({stock.profitLossPercent.toFixed(2)}%)
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center py-5">
                              <p className="text-muted mb-0">No holdings found. Start trading to see your stocks here!</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Row */}
                  <div className={styles.portfolioSummary}>
                    <div className={styles.summaryRow}>
                      <span className={styles.fontSemibold}>Total Portfolio</span>
                      <div className={styles.summaryValues}>
                        <div className={styles.fontSemibold}>
                          Rs. {formatCurrency(portfolioData.summary.totalValue)}
                        </div>
                        <div className={getProfitColor(portfolioData.summary.totalProfit)}>
                          {getProfitIcon(portfolioData.summary.totalProfit)}
                          Rs. {formatCurrency(portfolioData.summary.totalProfit)} total profit
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'performance' && (
                <div>
                  <h3 className={styles.sectionTitle}>Portfolio Performance</h3>
                  <div className={styles.performanceGrid}>
                    <div className={styles.performanceCard}>
                      <div className={`${styles.performanceValue} ${getProfitColor(portfolioData.summary.dailyChange)}`}>
                        {portfolioData.summary.dailyChange >= 0 ? '+' : ''}
                        Rs. {formatCurrency(portfolioData.summary.dailyChange)}
                      </div>
                      <div className={styles.performanceLabel}>Today</div>
                    </div>
                    <div className={styles.performanceCard}>
                      <div className={`${styles.performanceValue} ${getProfitColor(portfolioData.performance.week)}`}>
                        {portfolioData.performance.week >= 0 ? '+' : ''}
                        Rs. {formatCurrency(portfolioData.performance.week)}
                      </div>
                      <div className={styles.performanceLabel}>This Week</div>
                    </div>
                    <div className={styles.performanceCard}>
                      <div className={`${styles.performanceValue} ${getProfitColor(portfolioData.performance.month)}`}>
                        {portfolioData.performance.month >= 0 ? '+' : ''}
                        Rs. {formatCurrency(portfolioData.performance.month)}
                      </div>
                      <div className={styles.performanceLabel}>This Month</div>
                    </div>
                    <div className={styles.performanceCard}>
                      <div className={`${styles.performanceValue} ${getProfitColor(portfolioData.summary.totalProfit)}`}>
                        {portfolioData.summary.totalProfit >= 0 ? '+' : ''}
                        Rs. {formatCurrency(portfolioData.summary.totalProfit)}
                      </div>
                      <div className={styles.performanceLabel}>Overall</div>
                    </div>
                  </div>
                  
                  {/* Performance Chart Placeholder */}
                  <div className={styles.chartPlaceholder}>
                    <div className={styles.placeholderContent}>
                      <div className={styles.placeholderIcon}>📈</div>
                      <p>Performance History</p>
                      <p className={styles.textGray}>Tracking profit trends over time</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'allocation' && (
                <div>
                  <h3 className={styles.sectionTitle}>Sector Allocation</h3>
                  
                  {/* Allocation Chart Placeholder */}
                  <div className={styles.chartPlaceholder}>
                    <div className={styles.placeholderContent}>
                      <div className={styles.placeholderIcon}>🥧</div>
                      <p>Portfolio Distribution</p>
                      <p className={styles.textGray}>Visualization of your asset diversification</p>
                    </div>
                  </div>

                  {/* Allocation List */}
                  <div className={styles.allocationList}>
                    {portfolioData.allocation.length > 0 ? (
                      portfolioData.allocation.map((sector, index) => (
                        <div key={sector.sector} className={styles.allocationItem}>
                          <div className={styles.allocationColor}></div>
                          <span className={styles.allocationName}>{sector.sector}</span>
                          <div className={styles.allocationInfo}>
                            <div className={styles.allocationPercentage}>{sector.percentage.toFixed(1)}%</div>
                            <div className={styles.allocationValue}>
                              Rs. {formatCurrency(sector.value)}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted py-4">No allocation data available.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className={styles.quickActions}>
            <h3>Quick Actions</h3>
            <div className={styles.actionButtons}>
              <button 
                className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
                onClick={() => navigate('/trade')}
              >
                ➕ Start Trading
              </button>
              <button 
                className={`${styles.actionButton} ${styles.actionButtonSuccess}`}
                onClick={() => setActiveTab('performance')}
              >
                📊 View Analytics
              </button>
              <button 
                className={`${styles.actionButton} ${styles.actionButtonSecondary}`}
                onClick={fetchPortfolioData}
                disabled={loading}
              >
                {loading ? '...' : '🔄 Refresh Data'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Portfolio;
