import React from 'react';
import styles from '../../admincss/StatsCards.module.css';

const StatsCards = ({ stats }) => {
  // Safe access to stats
  const userStats = stats?.users || { total: 0, active: 0, online: 0, pending: 0, newToday: 0 };
  const tradeStats = stats?.trading || { totalTrades: 0, todayVolume: 0, activeTradesDay: 0 };

  // Format volume (e.g., 1.2M, 500K)
  const formatVolume = (vol) => {
    if (vol >= 10000000) return `Rs. ${(vol / 10000000).toFixed(2)} Cr`;
    if (vol >= 100000) return `Rs. ${(vol / 100000).toFixed(2)} L`;
    return `Rs. ${vol.toLocaleString()}`;
  };

  // NEPSE specific data
  const statsData = [
    {
      id: 1,
      title: 'Total Users',
      value: userStats.total.toLocaleString(),
      change: `+${userStats.newToday}`,
      changePercent: `${((userStats.newToday / (userStats.total || 1)) * 100).toFixed(1)}%`,
      icon: '👥',
      color: 'blue',
      description: 'Total Registered Traders'
    },
    {
      id: 2,
      title: 'Online Users',
      value: userStats.online.toLocaleString(),
      change: `+${userStats.online}`,
      changePercent: 'Live',
      icon: '🟢',
      color: 'green',
      description: 'Active in last 15 mins'
    },
    {
      id: 3,
      title: 'Pending Approvals',
      value: userStats.pending.toLocaleString(),
      change: userStats.pending > 0 ? 'Action' : 'Clean',
      changePercent: 'Users',
      icon: '⏳',
      color: 'orange',
      description: 'Waiting for admin'
    },
    {
      id: 4,
      title: 'Today\'s Volume',
      value: formatVolume(tradeStats.todayVolume),
      change: tradeStats.todayVolume > 0 ? 'Dynamic' : 'None',
      changePercent: 'Market',
      icon: '💰',
      color: 'purple',
      description: 'Total Value Traded'
    },
    {
      id: 5,
      title: 'Total Trades',
      value: tradeStats.totalTrades.toLocaleString(),
      change: `+${tradeStats.activeTradesDay}`,
      changePercent: 'Today',
      icon: '⚡',
      color: 'indigo',
      description: 'Lifetime executions'
    },
    {
      id: 6,
      title: 'System Uptime',
      value: '99.9%',
      change: 'Normal',
      changePercent: 'Status',
      icon: '🛡️',
      color: 'teal',
      description: 'Service availability'
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
              <span className={styles.timestamp}>Real-time data</span>
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