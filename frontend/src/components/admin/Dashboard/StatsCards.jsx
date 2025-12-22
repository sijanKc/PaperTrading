import React from 'react';
import styles from '../../admincss/StatsCards.module.css';

const StatsCards = () => {
  // NEPSE specific data
  const statsData = [
    {
      id: 1,
      title: 'NEPSE Index',
      value: '2,145.67',
      change: '+45.32',
      changePercent: '+2.16%',
      icon: '📈',
      color: 'green',
      description: 'Current NEPSE Index'
    },
    {
      id: 2,
      title: 'Total Users',
      value: '1,234',
      change: '+45',
      changePercent: '+3.78%',
      icon: '👥',
      color: 'blue',
      description: 'Active Paper Traders'
    },
    {
      id: 3,
      title: 'Today\'s Volume',
      value: '₹4.2 Cr',
      change: '+0.5 Cr',
      changePercent: '+13.5%',
      icon: '💰',
      color: 'purple',
      description: 'Total Trading Volume'
    },
    {
      id: 4,
      title: 'Active Trades',
      value: '567',
      change: '-23',
      changePercent: '-3.9%',
      icon: '⚡',
      color: 'orange',
      description: 'Trades in Last 24h'
    },
    {
      id: 5,
      title: 'Top Sector',
      value: 'Banking',
      change: '+12.5%',
      changePercent: '+12.5%',
      icon: '🏦',
      color: 'teal',
      description: 'Commercial Banks'
    },
    {
      id: 6,
      title: 'Avg. Portfolio',
      value: '₹2.5L',
      change: '+₹25,000',
      changePercent: '+11.1%',
      icon: '📊',
      color: 'indigo',
      description: 'Per User Average'
    }
  ];

  // Top traded stocks
  const topStocks = [
    { symbol: 'NIC', price: '850', change: '+2.5%' },
    { symbol: 'NBL', price: '450', change: '+1.8%' },
    { symbol: 'HIDCL', price: '320', change: '-0.5%' },
    { symbol: 'SCB', price: '680', change: '+3.2%' }
  ];

  return (
    <div className={styles.statsContainer}>
      {/* Main Stats Cards */}
      <div className={styles.statsGrid}>
        {statsData.map(stat => (
          <div 
            key={stat.id} 
            className={`${styles.statCard} ${styles[stat.color]}`}
          >
            <div className={styles.cardHeader}>
              <div className={styles.iconContainer}>
                <span className={styles.icon}>{stat.icon}</span>
              </div>
              <div className={styles.cardTitle}>
                <h3>{stat.title}</h3>
                <p className={styles.description}>{stat.description}</p>
              </div>
            </div>
            
            <div className={styles.cardContent}>
              <div className={styles.valueContainer}>
                <span className={styles.value}>{stat.value}</span>
                <div className={`${styles.change} ${stat.change.startsWith('+') ? styles.positive : styles.negative}`}>
                  <span className={styles.changeValue}>{stat.change}</span>
                  <span className={styles.changePercent}>({stat.changePercent})</span>
                </div>
              </div>
            </div>
            
            <div className={styles.cardFooter}>
              <span className={styles.timestamp}>Updated 5 min ago</span>
            </div>
          </div>
        ))}
      </div>

      {/* Top Traded Stocks */}
      <div className={styles.topStocksSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.stockIcon}>📈</span>
            Top Traded Stocks
          </h3>
          <span className={styles.updateTime}>Live</span>
        </div>
        
        <div className={styles.stocksGrid}>
          {topStocks.map((stock, index) => (
            <div key={index} className={styles.stockCard}>
              <div className={styles.stockSymbol}>
                <span className={styles.symbol}>{stock.symbol}</span>
                <span className={styles.exchange}>NEPSE</span>
              </div>
              <div className={styles.stockPrice}>
                <span className={styles.price}>₹{stock.price}</span>
                <span className={`${styles.priceChange} ${stock.change.startsWith('+') ? styles.up : styles.down}`}>
                  {stock.change}
                </span>
              </div>
              <div className={styles.tradeInfo}>
                <span className={styles.volume}>Vol: 45,678</span>
                <button className={styles.viewBtn}>View</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <div className={styles.actionCard}>
          <div className={styles.actionIcon}>🔔</div>
          <div className={styles.actionContent}>
            <h4>Market Open</h4>
            <p>NEPSE: 11:00 AM - 3:00 PM</p>
          </div>
          <div className={styles.actionStatus}>
            <span className={styles.statusOpen}>OPEN</span>
          </div>
        </div>
        
        <div className={styles.actionCard}>
          <div className={styles.actionIcon}>📰</div>
          <div className={styles.actionContent}>
            <h4>News Updates</h4>
            <p>3 new market news today</p>
          </div>
          <button className={styles.actionBtn}>View</button>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;