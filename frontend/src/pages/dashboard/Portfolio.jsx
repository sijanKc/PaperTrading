// pages/dashboard/Portfolio.jsx
import React, { useState } from 'react';
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import styles from './css/Portfolio.module.css';

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState('holdings');

  // Mock portfolio data
  const portfolioData = {
    summary: {
      totalValue: 124500,
      totalInvested: 115000,
      totalProfit: 9500,
      dailyChange: 1200,
      dailyChangePercent: 0.98
    },
    holdings: [
      {
        id: 1,
        symbol: "NTC",
        name: "Nepal Telecom",
        shares: 50,
        avgPrice: 800,
        currentPrice: 850,
        marketValue: 42500,
        invested: 40000,
        profit: 2500,
        profitPercent: 6.25
      },
      {
        id: 2,
        symbol: "NABIL",
        name: "Nabil Bank",
        shares: 25,
        avgPrice: 1200,
        currentPrice: 1250,
        marketValue: 31250,
        invested: 30000,
        profit: 1250,
        profitPercent: 4.17
      },
      {
        id: 3,
        symbol: "SCB",
        name: "Standard Chartered",
        shares: 40,
        avgPrice: 450,
        currentPrice: 480,
        marketValue: 19200,
        invested: 18000,
        profit: 1200,
        profitPercent: 6.67
      },
      {
        id: 4,
        symbol: "NICA",
        name: "NICA Bank",
        shares: 30,
        avgPrice: 900,
        currentPrice: 1050,
        marketValue: 31500,
        invested: 27000,
        profit: 4500,
        profitPercent: 16.67
      }
    ],
    performance: {
      today: 1200,
      week: 4500,
      month: 7800,
      overall: 9500
    }
  };

  const getProfitColor = (value) => {
    return value >= 0 ? styles.textGreen : styles.textRed;
  };

  const getProfitIcon = (value) => {
    return value >= 0 ? '📈' : '📉';
  };

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
          </div>

          {/* Portfolio Summary Cards */}
          <div className={styles.summaryGrid}>
            {/* Total Portfolio Value */}
            <div className={styles.summaryCard}>
              <div className={styles.cardContent}>
                <div className={styles.cardText}>
                  <p className={styles.textGray}>Total Value</p>
                  <h3>Nrs. {portfolioData.summary.totalValue.toLocaleString()}</h3>
                  <div className={`${getProfitColor(portfolioData.summary.dailyChange)}`}>
                    {getProfitIcon(portfolioData.summary.dailyChange)} 
                    +Nrs. {portfolioData.summary.dailyChange.toLocaleString()} 
                    ({portfolioData.summary.dailyChangePercent}%) today
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
                  <h3>Nrs. {portfolioData.summary.totalInvested.toLocaleString()}</h3>
                  <div className={styles.textGray}>Initial investment amount</div>
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
                    Nrs. {portfolioData.summary.totalProfit.toLocaleString()}
                  </h3>
                  <div className={getProfitColor(portfolioData.summary.totalProfit)}>
                    {getProfitIcon(portfolioData.summary.totalProfit)} 
                    Overall returns
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
                    {((portfolioData.summary.totalProfit / portfolioData.summary.totalInvested) * 100).toFixed(2)}%
                  </h3>
                  <div className={styles.textGray}>Portfolio performance</div>
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
                        {portfolioData.holdings.map((stock) => (
                          <tr key={stock.id} className={styles.tableRow}>
                            <td className={styles.tableCell}>
                              <div className={styles.stockInfo}>
                                <div className={styles.stockIcon}>📊</div>
                                <div className={styles.stockDetails}>
                                  <h4>{stock.symbol}</h4>
                                  <p>{stock.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className={styles.tableCell}>{stock.shares}</td>
                            <td className={styles.tableCell}>Nrs. {stock.avgPrice}</td>
                            <td className={styles.tableCell}>Nrs. {stock.currentPrice}</td>
                            <td className={styles.tableCell}>
                              <div className={styles.fontSemibold}>
                                Nrs. {stock.marketValue.toLocaleString()}
                              </div>
                            </td>
                            <td className={styles.tableCell}>
                              <div className={`${getProfitColor(stock.profit)} ${styles.fontSemibold}`}>
                                {getProfitIcon(stock.profit)} 
                                Nrs. {stock.profit.toLocaleString()} 
                                <span className={styles.textGray}>
                                  ({stock.profitPercent}%)
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Row */}
                  <div className={styles.portfolioSummary}>
                    <div className={styles.summaryRow}>
                      <span className={styles.fontSemibold}>Total Portfolio</span>
                      <div className={styles.summaryValues}>
                        <div className={styles.fontSemibold}>
                          Nrs. {portfolioData.summary.totalValue.toLocaleString()}
                        </div>
                        <div className={getProfitColor(portfolioData.summary.totalProfit)}>
                          {getProfitIcon(portfolioData.summary.totalProfit)}
                          Nrs. {portfolioData.summary.totalProfit.toLocaleString()} total profit
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
                      <div className={styles.performanceValue}>
                        +Nrs. {portfolioData.performance.today.toLocaleString()}
                      </div>
                      <div className={styles.performanceLabel}>Today</div>
                    </div>
                    <div className={styles.performanceCard}>
                      <div className={styles.performanceValue}>
                        +Nrs. {portfolioData.performance.week.toLocaleString()}
                      </div>
                      <div className={styles.performanceLabel}>This Week</div>
                    </div>
                    <div className={styles.performanceCard}>
                      <div className={styles.performanceValue}>
                        +Nrs. {portfolioData.performance.month.toLocaleString()}
                      </div>
                      <div className={styles.performanceLabel}>This Month</div>
                    </div>
                    <div className={styles.performanceCard}>
                      <div className={styles.performanceValue}>
                        +Nrs. {portfolioData.performance.overall.toLocaleString()}
                      </div>
                      <div className={styles.performanceLabel}>Overall</div>
                    </div>
                  </div>
                  
                  {/* Performance Chart Placeholder */}
                  <div className={styles.chartPlaceholder}>
                    <div className={styles.placeholderContent}>
                      <div className={styles.placeholderIcon}>📈</div>
                      <p>Performance Chart</p>
                      <p className={styles.textGray}>(Would show portfolio value over time)</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'allocation' && (
                <div>
                  <h3 className={styles.sectionTitle}>Asset Allocation</h3>
                  
                  {/* Allocation Chart Placeholder */}
                  <div className={styles.chartPlaceholder}>
                    <div className={styles.placeholderContent}>
                      <div className={styles.placeholderIcon}>🥧</div>
                      <p>Portfolio Pie Chart</p>
                      <p className={styles.textGray}>(Would show stock allocation percentages)</p>
                    </div>
                  </div>

                  {/* Allocation List */}
                  <div className={styles.allocationList}>
                    {portfolioData.holdings.map((stock) => {
                      const allocationPercent = (stock.marketValue / portfolioData.summary.totalValue) * 100;
                      return (
                        <div key={stock.id} className={styles.allocationItem}>
                          <div className={styles.allocationColor}></div>
                          <span className={styles.allocationName}>{stock.symbol}</span>
                          <div className={styles.allocationInfo}>
                            <div className={styles.allocationPercentage}>{allocationPercent.toFixed(1)}%</div>
                            <div className={styles.allocationValue}>
                              Nrs. {stock.marketValue.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className={styles.quickActions}>
            <h3>Quick Actions</h3>
            <div className={styles.actionButtons}>
              <button className={`${styles.actionButton} ${styles.actionButtonPrimary}`}>
                ➕ Add Funds
              </button>
              <button className={`${styles.actionButton} ${styles.actionButtonSuccess}`}>
                📊 View Analytics
              </button>
              <button className={`${styles.actionButton} ${styles.actionButtonSecondary}`}>
                📤 Export Report
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Portfolio;