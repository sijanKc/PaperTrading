import React, { useState, useEffect } from 'react';
import StatsCards from './StatsCards';
import Charts from './Charts';
import styles from '../../admincss/Dashboard.module.css';

const Dashboard = ({ stats, loading, setActiveTab }) => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeView, setActiveView] = useState('overview'); // overview, detailed, quickview
  const [refreshInterval, setRefreshInterval] = useState(300000); // 5 minutes

  useEffect(() => {
    setLastUpdated(new Date());
  }, [stats]);

  // Recent activities from backend or fallback
  const recentActivities = stats?.activities?.map(act => {
    const timeDiff = Math.floor((new Date() - new Date(act.time)) / (1000 * 60)); // minutes
    let timeStr = 'Just now';
    if (timeDiff >= 60 * 24) timeStr = `${Math.floor(timeDiff / (60 * 24))}d ago`;
    else if (timeDiff >= 60) timeStr = `${Math.floor(timeDiff / 60)}h ago`;
    else if (timeDiff > 0) timeStr = `${timeDiff}m ago`;

    return { ...act, time: timeStr };
  }) || [];

  // System alerts from backend monitoring
  const [systemAlerts, setSystemAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/monitoring/alerts', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setSystemAlerts(data.alerts.map((a, idx) => ({
            id: idx + 1,
            type: a.type === 'critical' ? 'warning' : 'info', // Map to CSS classes
            message: a.message,
            time: a.value
          })));
        }
      } catch (err) {
        console.error('Error fetching dashboard alerts:', err);
      }
    };
    fetchAlerts();
  }, []);

  // Quick actions data
  const quickActions = [
    { id: 1, icon: '🚀', label: 'Launch Competition', color: 'purple', action: () => setActiveTab('competitions') },
    { id: 2, icon: '👥', label: 'Add Users', color: 'blue', action: () => setActiveTab('users') },
    { id: 3, icon: '📰', label: 'Market Control', color: 'green', action: () => setActiveTab('market') },
    { id: 4, icon: '⚙️', label: 'Settings', color: 'gray', action: () => setActiveTab('settings') },
  ];

  if (loading) {
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
              onClick={() => window.location.reload()}
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
                onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
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
            <span className={styles.updatedTime}>{lastUpdated.toLocaleTimeString()}</span>
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
            
            <StatsCards stats={stats} />
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
            
            <Charts stats={stats} />
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