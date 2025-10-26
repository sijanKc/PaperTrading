import React, { useState } from 'react';
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import styles from './css/Leaderboard.module.css';

const Leaderboard = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('weekly');
  const [activeCategory, setActiveCategory] = useState('all');

  // Mock leaderboard data
  const leaderboardData = {
    weekly: [
      {
        rank: 1,
        name: "Anil Sharma",
        username: "@anil_trader",
        profit: 45200,
        profitPercent: 18.5,
        trades: 23,
        winRate: 78.3,
        avatar: "👑",
        strategy: "Swing Trading",
        change: "+2"
      },
      {
        rank: 2,
        name: "Sita Koirala",
        username: "@sita_invests",
        profit: 38750,
        profitPercent: 15.8,
        trades: 18,
        winRate: 72.2,
        avatar: "🚀",
        strategy: "Momentum",
        change: "+3"
      },
      {
        rank: 3,
        name: "Rajendra Thapa",
        username: "@raj_stocks",
        profit: 32500,
        profitPercent: 13.2,
        trades: 15,
        winRate: 80.0,
        avatar: "⭐",
        strategy: "Value Investing",
        change: "-1"
      },
      {
        rank: 4,
        name: "Priya Gurung",
        username: "@priya_trades",
        profit: 29800,
        profitPercent: 12.1,
        trades: 20,
        winRate: 65.0,
        avatar: "💫",
        strategy: "Day Trading",
        change: "+5"
      },
      {
        rank: 5,
        name: "Bikash Rai",
        username: "@bikash_investor",
        profit: 25600,
        profitPercent: 10.4,
        trades: 12,
        winRate: 75.0,
        avatar: "🔥",
        strategy: "Swing Trading",
        change: "-2"
      },
      {
        rank: 6,
        name: "You",
        username: "@your_profile",
        profit: 18900,
        profitPercent: 7.8,
        trades: 14,
        winRate: 64.3,
        avatar: "😊",
        strategy: "Mixed",
        change: "+1",
        isCurrentUser: true
      }
    ],
    monthly: [
      {
        rank: 1,
        name: "Sita Koirala",
        username: "@sita_invests",
        profit: 125800,
        profitPercent: 42.3,
        trades: 65,
        winRate: 75.4,
        avatar: "👑",
        strategy: "Momentum",
        change: "+1"
      },
      {
        rank: 2,
        name: "Anil Sharma",
        username: "@anil_trader",
        profit: 118900,
        profitPercent: 39.8,
        trades: 72,
        winRate: 76.2,
        avatar: "🚀",
        strategy: "Swing Trading",
        change: "-1"
      },
      {
        rank: 3,
        name: "Priya Gurung",
        username: "@priya_trades",
        profit: 98700,
        profitPercent: 32.1,
        trades: 58,
        winRate: 68.9,
        avatar: "⭐",
        strategy: "Day Trading",
        change: "+2"
      }
    ],
    allTime: [
      {
        rank: 1,
        name: "Anil Sharma",
        username: "@anil_trader",
        profit: 452300,
        profitPercent: 156.8,
        trades: 245,
        winRate: 74.3,
        avatar: "👑",
        strategy: "Swing Trading",
        change: "0"
      },
      {
        rank: 2,
        name: "Rajendra Thapa",
        username: "@raj_stocks",
        profit: 398700,
        profitPercent: 142.1,
        trades: 198,
        winRate: 78.8,
        avatar: "🚀",
        strategy: "Value Investing",
        change: "0"
      },
      {
        rank: 3,
        name: "Sita Koirala",
        username: "@sita_invests",
        profit: 365400,
        profitPercent: 128.6,
        trades: 176,
        winRate: 72.1,
        avatar: "⭐",
        strategy: "Momentum",
        change: "0"
      }
    ]
  };

  const categories = [
    { id: 'all', name: 'All Traders', icon: '👥' },
    { id: 'swing', name: 'Swing Trading', icon: '📊' },
    { id: 'day', name: 'Day Trading', icon: '⚡' },
    { id: 'momentum', name: 'Momentum', icon: '🎯' },
    { id: 'value', name: 'Value Investing', icon: '💰' }
  ];

  const timeframes = [
    { id: 'weekly', name: 'This Week', icon: '📅' },
    { id: 'monthly', name: 'This Month', icon: '📈' },
    { id: 'allTime', name: 'All Time', icon: '🏆' }
  ];

  const getRankBadge = (rank) => {
    if (rank === 1) return styles.rankGold;
    if (rank === 2) return styles.rankSilver;
    if (rank === 3) return styles.rankBronze;
    return styles.rankNormal;
  };

  const getChangeColor = (change) => {
    if (change.startsWith('+')) return styles.changePositive;
    if (change.startsWith('-')) return styles.changeNegative;
    return styles.changeNeutral;
  };

  const getProfitColor = (profit) => {
    return profit >= 0 ? styles.textSuccess : styles.textDanger;
  };

  const filteredData = leaderboardData[activeTimeframe].filter(trader => {
    if (activeCategory === 'all') return true;
    return trader.strategy.toLowerCase().includes(activeCategory);
  });

  const currentUserRank = filteredData.find(trader => trader.isCurrentUser)?.rank;

  const TopPerformers = () => (
    <div className={styles.topPerformers}>
      <h3>🏆 Top 3 Performers</h3>
      <div className={styles.topThree}>
        {filteredData.slice(0, 3).map((trader) => (
          <div key={trader.rank} className={`${styles.topCard} ${getRankBadge(trader.rank)}`}>
            <div className={styles.rankBadge}>
              {trader.rank === 1 && '🥇'}
              {trader.rank === 2 && '🥈'}
              {trader.rank === 3 && '🥉'}
            </div>
            <div className={styles.traderAvatar}>
              {trader.avatar}
            </div>
            <div className={styles.traderInfo}>
              <h4>{trader.name}</h4>
              <p>{trader.username}</p>
              <span className={styles.strategyTag}>{trader.strategy}</span>
            </div>
            <div className={styles.performance}>
              <div className={`${styles.profit} ${getProfitColor(trader.profit)}`}>
                +Nrs. {trader.profit.toLocaleString()}
              </div>
              <div className={styles.winRate}>
                {trader.winRate}% Win Rate
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const LeaderboardTable = () => (
    <div className={styles.leaderboardTable}>
      <div className={styles.tableHeader}>
        <span>Rank</span>
        <span>Trader</span>
        <span>Strategy</span>
        <span>Profit</span>
        <span>Win Rate</span>
        <span>Trades</span>
        <span>Change</span>
      </div>
      
      <div className={styles.tableBody}>
        {filteredData.map((trader) => (
          <div 
            key={trader.rank} 
            className={`${styles.tableRow} ${trader.isCurrentUser ? styles.currentUser : ''}`}
          >
            <div className={styles.rankCell}>
              <span className={`${styles.rankNumber} ${getRankBadge(trader.rank)}`}>
                {trader.rank}
              </span>
            </div>
            
            <div className={styles.traderCell}>
              <div className={styles.traderMain}>
                <span className={styles.avatar}>{trader.avatar}</span>
                <div className={styles.traderDetails}>
                  <div className={styles.name}>
                    {trader.name}
                    {trader.isCurrentUser && <span className={styles.youBadge}>You</span>}
                  </div>
                  <div className={styles.username}>{trader.username}</div>
                </div>
              </div>
            </div>
            
            <div className={styles.strategyCell}>
              <span className={styles.strategy}>{trader.strategy}</span>
            </div>
            
            <div className={styles.profitCell}>
              <div className={`${styles.profitAmount} ${getProfitColor(trader.profit)}`}>
                +Nrs. {trader.profit.toLocaleString()}
              </div>
              <div className={styles.profitPercent}>
                ({trader.profitPercent}%)
              </div>
            </div>
            
            <div className={styles.winRateCell}>
              <div className={styles.winRateBar}>
                <div 
                  className={styles.winRateFill}
                  style={{ width: `${trader.winRate}%` }}
                ></div>
              </div>
              <span className={styles.winRateText}>{trader.winRate}%</span>
            </div>
            
            <div className={styles.tradesCell}>
              {trader.trades}
            </div>
            
            <div className={styles.changeCell}>
              <span className={`${styles.change} ${getChangeColor(trader.change)}`}>
                {trader.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const UserStats = () => {
    const userData = filteredData.find(trader => trader.isCurrentUser);
    if (!userData) return null;

    return (
      <div className={styles.userStats}>
        <h3>Your Performance</h3>
        <div className={styles.userCard}>
          <div className={styles.userHeader}>
            <div className={styles.userIdentity}>
              <span className={styles.userAvatar}>{userData.avatar}</span>
              <div>
                <h4>{userData.name}</h4>
                <p>{userData.username}</p>
              </div>
            </div>
            <div className={styles.userRank}>
              <span className={styles.rankLabel}>Rank</span>
              <span className={`${styles.rankValue} ${getRankBadge(userData.rank)}`}>
                #{userData.rank}
              </span>
            </div>
          </div>
          
          <div className={styles.userMetrics}>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Total Profit</span>
              <span className={`${styles.metricValue} ${getProfitColor(userData.profit)}`}>
                +Nrs. {userData.profit.toLocaleString()}
              </span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Win Rate</span>
              <span className={styles.metricValue}>{userData.winRate}%</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Total Trades</span>
              <span className={styles.metricValue}>{userData.trades}</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Rank Change</span>
              <span className={`${styles.metricValue} ${getChangeColor(userData.change)}`}>
                {userData.change}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      
      <div className={styles.dashboardMain}>
        <Header />
        
        <main className={styles.leaderboardContainer}>
          {/* Header */}
          <div className={styles.header}>
            <h1>🏆 Trading Leaderboard</h1>
            <p>Compete with other traders and track your ranking</p>
          </div>

          {/* Timeframe Selector */}
          <div className={styles.controls}>
            <div className={styles.timeframeSelector}>
              <span className={styles.selectorLabel}>Timeframe:</span>
              <div className={styles.timeframeButtons}>
                {timeframes.map(timeframe => (
                  <button
                    key={timeframe.id}
                    onClick={() => setActiveTimeframe(timeframe.id)}
                    className={`${styles.timeframeButton} ${activeTimeframe === timeframe.id ? styles.timeframeActive : ''}`}
                  >
                    <span className={styles.timeframeIcon}>{timeframe.icon}</span>
                    {timeframe.name}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.categorySelector}>
              <span className={styles.selectorLabel}>Category:</span>
              <div className={styles.categoryButtons}>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`${styles.categoryButton} ${activeCategory === category.id ? styles.categoryActive : ''}`}
                  >
                    <span className={styles.categoryIcon}>{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={styles.mainContent}>
            <div className={styles.leftColumn}>
              <TopPerformers />
              <UserStats />
            </div>

            <div className={styles.rightColumn}>
              <div className={styles.leaderboardSection}>
                <div className={styles.sectionHeader}>
                  <h3>📊 Full Leaderboard</h3>
                  <div className={styles.statsSummary}>
                    <span>Showing {filteredData.length} traders</span>
                    {currentUserRank && (
                      <span className={styles.yourRank}>
                        Your Rank: <strong>#{currentUserRank}</strong>
                      </span>
                    )}
                  </div>
                </div>
                <LeaderboardTable />
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className={styles.additionalStats}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>⚡</div>
              <div className={styles.statContent}>
                <h3>23</h3>
                <p>Active Traders This Week</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📈</div>
              <div className={styles.statContent}>
                <h3>72.4%</h3>
                <p>Average Win Rate</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>💰</div>
              <div className={styles.statContent}>
                <h3>Nrs. 2.4M</h3>
                <p>Total Community Profit</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🎯</div>
              <div className={styles.statContent}>
                <h3>156</h3>
                <p>Trades This Week</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Leaderboard;