import React, { useState, useEffect } from 'react';
import StatsCards from './StatsCards';
import Charts from './Charts';
import styles from '../../admincss/Dashboard.module.css';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeView, setActiveView] = useState('overview'); // overview, detailed, quickview
  const [refreshInterval, setRefreshInterval] = useState(300000); // 5 minutes

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Auto-refresh interval
    const refreshTimer = setInterval(() => {
      setLastUpdated(new Date());
      console.log('Data auto-refreshed at:', new Date().toLocaleTimeString());
    }, refreshInterval);

    return () => {
      clearTimeout(timer);
      clearInterval(refreshTimer);
    };
  }, [refreshInterval]);

  // Quick actions data
  const quickActions = [
    { id: 1, icon: '🚀', label: 'Launch Competition', color: 'purple', action: () => alert('Launch competition clicked') },
    { id: 2, icon: '👥', label: 'Add Users', color: 'blue', action: () => alert('Add users clicked') },
    { id: 3, icon: '📰', label: 'Post News', color: 'green', action: () => alert('Post news clicked') },
    { id: 4, icon: '⚙️', label: 'Settings', color: 'gray', action: () => alert('Settings clicked') },
  ];

  // Recent activities
  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'placed a trade', stock: 'NIC', time: '2 min ago', type: 'trade' },
    { id: 2, user: 'Jane Smith', action: 'joined platform', time: '15 min ago', type: 'join' },
    { id: 3, user: 'Admin', action: 'updated trading rules', time: '1 hour ago', type: 'system' },
    { id: 4, user: 'TraderPro', action: 'achieved top rank', time: '2 hours ago', type: 'achievement' },
    { id: 5, user: 'System', action: 'auto-backup completed', time: '3 hours ago', type: 'system' },
  ];

  // System alerts
  const systemAlerts = [
    { id: 1, type: 'info', message: 'NEPSE market opens in 30 minutes', time: '10:30 AM' },
    { id: 2, type: 'warning', message: 'High server load detected', time: '9:45 AM' },
    { id: 3, type: 'success', message: 'All systems operational', time: '9:00 AM' },
  ];

  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Handle manual refresh
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 800);
  };

  // Change refresh interval
  const handleIntervalChange = (interval) => {
    setRefreshInterval(interval);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Loading Dashboard Data...</p>
        <p className={styles.loadingSubtext}>Fetching NEPSE statistics</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      
      {/* Dashboard Header */}
      <div className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.dashboardTitle}>
            <span className={styles.titleIcon}>📊</span>
            NEPSE Paper Trading Dashboard
          </h1>
          <p className={styles.dashboardSubtitle}>
            Real-time analytics and insights for your paper trading platform
          </p>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.refreshControls}>
            <button 
              className={styles.refreshBtn}
              onClick={handleRefresh}
              title="Refresh data"
            >
              <span className={styles.refreshIcon}>🔄</span>
              Refresh
            </button>
            
            <div className={styles.intervalSelector}>
              <span className={styles.intervalLabel}>Auto-refresh:</span>
              <select 
                className={styles.intervalSelect}
                value={refreshInterval}
                onChange={(e) => handleIntervalChange(parseInt(e.target.value))}
              >
                <option value={60000}>1 minute</option>
                <option value={300000}>5 minutes</option>
                <option value={900000}>15 minutes</option>
                <option value={1800000}>30 minutes</option>
                <option value={0}>Off</option>
              </select>
            </div>
          </div>
          
          <div className={styles.lastUpdated}>
            <span className={styles.updatedLabel}>Last updated:</span>
            <span className={styles.updatedTime}>{formatTime(lastUpdated)}</span>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className={styles.viewToggle}>
        <button 
          className={`${styles.viewBtn} ${activeView === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveView('overview')}
        >
          <span className={styles.viewIcon}>📊</span>
          Overview
        </button>
        <button 
          className={`${styles.viewBtn} ${activeView === 'detailed' ? styles.active : ''}`}
          onClick={() => setActiveView('detailed')}
        >
          <span className={styles.viewIcon}>📈</span>
          Detailed Analytics
        </button>
        <button 
          className={`${styles.viewBtn} ${activeView === 'quickview' ? styles.active : ''}`}
          onClick={() => setActiveView('quickview')}
        >
          <span className={styles.viewIcon}>⚡</span>
          Quick View
        </button>
      </div>

      {/* Main Content */}
      <div className={styles.dashboardContent}>
        
        {/* Left Column - Stats and Quick Actions */}
        <div className={styles.leftColumn}>
          
          {/* Quick Actions */}
          <div className={styles.quickActionsSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>🚀</span>
                Quick Actions
              </h3>
              <span className={styles.sectionSubtitle}>Frequently used actions</span>
            </div>
            
            <div className={styles.actionsGrid}>
              {quickActions.map(action => (
                <button
                  key={action.id}
                  className={`${styles.actionBtn} ${styles[action.color]}`}
                  onClick={action.action}
                >
                  <span className={styles.actionIcon}>{action.icon}</span>
                  <span className={styles.actionLabel}>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* System Alerts */}
          <div className={styles.alertsSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>🔔</span>
                System Alerts
              </h3>
              <span className={styles.alertCount}>{systemAlerts.length} active</span>
            </div>
            
            <div className={styles.alertsList}>
              {systemAlerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={`${styles.alertItem} ${styles[alert.type]}`}
                >
                  <div className={styles.alertIcon}>
                    {alert.type === 'info' && 'ℹ️'}
                    {alert.type === 'warning' && '⚠️'}
                    {alert.type === 'success' && '✅'}
                  </div>
                  <div className={styles.alertContent}>
                    <p className={styles.alertMessage}>{alert.message}</p>
                    <span className={styles.alertTime}>{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <button className={styles.viewAllAlerts}>
              View All Alerts →
            </button>
          </div>

          {/* Recent Activities */}
          <div className={styles.activitiesSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>📝</span>
                Recent Activities
              </h3>
              <span className={styles.activitiesCount}>Last 24 hours</span>
            </div>
            
            <div className={styles.activitiesList}>
              {recentActivities.map(activity => (
                <div key={activity.id} className={styles.activityItem}>
                  <div className={`${styles.activityIcon} ${styles[activity.type]}`}>
                    {activity.type === 'trade' && '💰'}
                    {activity.type === 'join' && '👋'}
                    {activity.type === 'system' && '⚙️'}
                    {activity.type === 'achievement' && '🏆'}
                  </div>
                  <div className={styles.activityContent}>
                    <p className={styles.activityText}>
                      <span className={styles.activityUser}>{activity.user}</span> 
                      {activity.action}
                      {activity.stock && (
                        <span className={styles.activityStock}> {activity.stock}</span>
                      )}
                    </p>
                    <span className={styles.activityTime}>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <button className={styles.viewAllActivities}>
              View Full Activity Log →
            </button>
          </div>

        </div>

        {/* Right Column - Main Analytics */}
        <div className={styles.rightColumn}>
          
          {/* Stats Cards Section */}
          <div className={styles.statsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitleLarge}>
                <span className={styles.sectionIcon}>📊</span>
                Platform Statistics
              </h2>
              <div className={styles.statsTimeRange}>
                <span className={styles.timeRangeLabel}>Time Range:</span>
                <select className={styles.timeRangeSelect}>
                  <option>Today</option>
                  <option>Last 7 Days</option>
                  <option>This Month</option>
                  <option>Last 3 Months</option>
                </select>
              </div>
            </div>
            
            <StatsCards />
          </div>

          {/* Charts Section */}
          <div className={styles.chartsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitleLarge}>
                <span className={styles.sectionIcon}>📈</span>
                Analytics & Insights
              </h2>
              <div className={styles.chartFilters}>
                <button className={styles.filterBtn}>All Charts</button>
                <button className={styles.filterBtn}>Trading</button>
                <button className={styles.filterBtn}>Users</button>
                <button className={styles.filterBtn}>Performance</button>
              </div>
            </div>
            
            <Charts />
          </div>

        </div>

      </div>

      {/* Dashboard Footer */}
      <div className={styles.dashboardFooter}>
        <div className={styles.footerLeft}>
          <div className={styles.footerStat}>
            <span className={styles.footerLabel}>Data Points:</span>
            <span className={styles.footerValue}>1,245,678</span>
          </div>
          <div className={styles.footerStat}>
            <span className={styles.footerLabel}>API Calls Today:</span>
            <span className={styles.footerValue}>45,678</span>
          </div>
          <div className={styles.footerStat}>
            <span className={styles.footerLabel}>System Status:</span>
            <span className={styles.footerStatus}>
              <span className={styles.statusDot}></span>
              All Systems Operational
            </span>
          </div>
        </div>
        
        <div className={styles.footerRight}>
          <div className={styles.dataSources}>
            <span className={styles.sourcesLabel}>Data Sources:</span>
            <span className={styles.source}>NEPSE API</span>
            <span className={styles.source}>User Database</span>
            <span className={styles.source}>Trading Engine</span>
          </div>
          <div className={styles.cacheInfo}>
            <span className={styles.cacheLabel}>Cache:</span>
            <span className={styles.cacheStatus}>Updated 2 min ago</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;