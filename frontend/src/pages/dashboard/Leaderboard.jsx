import React, { useState, useEffect } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import styles from './css/Leaderboard.module.css';

const Leaderboard = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('weekly');
  const [activeCategory, setActiveCategory] = useState('all');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [communityStats, setCommunityStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to view leaderboard');
      }

      const response = await fetch(`http://localhost:5000/api/leaderboard?timeframe=${activeTimeframe}&category=${activeCategory}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }

      const result = await response.json();
      if (result.success) {
        setLeaderboardData(result.data[activeTimeframe] || []);
        setCommunityStats(result.data.communityStats);
      } else {
        throw new Error(result.message || 'Failed to load data');
      }
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, [activeTimeframe, activeCategory]);

  const getRankBadge = (rank) => {
    if (rank === 1) return styles.rankGold;
    if (rank === 2) return styles.rankSilver;
    if (rank === 3) return styles.rankBronze;
    return styles.rankNormal;
  };

  const getChangeColor = (change) => {
    if (!change) return styles.changeNeutral;
    if (change.startsWith('+')) return styles.changePositive;
    if (change.startsWith('-')) return styles.changeNegative;
    return styles.changeNeutral;
  };

  const getProfitColor = (profit) => {
    return profit >= 0 ? styles.textSuccess : styles.textDanger;
  };

  const TopPerformers = () => (
    <div className={styles.topPerformers}>
      <h3>🏆 Top 3 Performers</h3>
      <div className={styles.topThree}>
        {leaderboardData.slice(0, 3).map((trader) => (
          <div key={trader.userId} className={`${styles.topCard} ${getRankBadge(trader.rank)}`}>
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
                {trader.profit >= 0 ? '+' : ''}Nrs. {trader.profit.toLocaleString()}
              </div>
              <div className={styles.winRate}>
                {trader.winRate}% Win Rate
              </div>
            </div>
          </div>
        ))}
        {leaderboardData.length === 0 && (
          <div className="text-center w-100 p-4">
            <p className="text-muted">No traders found for this period</p>
          </div>
        )}
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
        {leaderboardData.map((trader) => (
          <div 
            key={trader.userId} 
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
                {trader.profit >= 0 ? '+' : ''}Nrs. {trader.profit.toLocaleString()}
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
    const userData = leaderboardData.find(trader => trader.isCurrentUser);
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
                {userData.profit >= 0 ? '+' : ''}Nrs. {userData.profit.toLocaleString()}
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
            {loading ? (
              <div className="text-center w-100 py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading leaderboard...</p>
              </div>
            ) : error ? (
              <div className="w-100">
                <Alert variant="danger">{error}</Alert>
                <button className="btn btn-primary" onClick={fetchLeaderboardData}>Retry</button>
              </div>
            ) : (
              <>
                <div className={styles.leftColumn}>
                  <TopPerformers />
                  <UserStats />
                </div>

                <div className={styles.rightColumn}>
                  <div className={styles.leaderboardSection}>
                    <div className={styles.sectionHeader}>
                      <h3>📊 Full Leaderboard</h3>
                      <div className={styles.statsSummary}>
                        <span>Showing {leaderboardData.length} traders</span>
                      </div>
                    </div>
                    <LeaderboardTable />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Additional Stats */}
          {communityStats && (
            <div className={styles.additionalStats}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>⚡</div>
                <div className={styles.statContent}>
                  <h3>{communityStats.activeTraders}</h3>
                  <p>Active Traders</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📈</div>
                <div className={styles.statContent}>
                  <h3>{communityStats.averageWinRate}%</h3>
                  <p>Average Win Rate</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>💰</div>
                <div className={styles.statContent}>
                  <h3>Nrs. {(communityStats.totalCommunityProfit / 1000000).toFixed(1)}M</h3>
                  <p>Total Community Profit</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🎯</div>
                <div className={styles.statContent}>
                  <h3>{communityStats.totalTrades}</h3>
                  <p>Total Trades</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Leaderboard;