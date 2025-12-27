import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout/AdminLayout';
import Dashboard from '../../components/admin/Dashboard/Dashboard';
import UserList from '../../components/admin/UserManagement/UserList';
import CompetitionManager from '../../components/admin/SystemConfig/CompetitionManager';
import MarketData from '../../components/admin/SystemConfig/MarketData';
import TradingRules from '../../components/admin/SystemConfig/TradingRules';
import SystemLogs from '../../components/admin/Monitoring/SystemLogs';
import PerformanceMetrics from '../../components/admin/Monitoring/PerformanceMetrics';
import Reports from '../../components/admin/Monitoring/Reports';
import AdminProfile from '../../components/admin/Profile/AdminProfile';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [monitoringView, setMonitoringView] = useState('logs'); // For monitoring sub-tabs
  const [reportsView, setReportsView] = useState('list'); // For reports sub-tabs

  // Fetch dashboard stats
  const [stats, setStats] = useState({
    users: { total: 0, active: 0, premium: 0 },
    trading: { totalTrades: 0 },
    system: { upTime: 0, status: 'operational' }
  });
  const [loadingStats, setLoadingStats] = useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (activeTab === 'dashboard' || activeTab === 'monitoring') {
      fetchStats();
    }
  }, [activeTab]);

  // Render content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard stats={stats} loading={loadingStats} />;
      
      case 'users':
        return <UserList />;
      
      case 'trading':
        return <TradingRules />;
      
      case 'market':
        return <MarketData />;
      
      case 'competitions':
        return <CompetitionManager />;
      
      case 'monitoring':
        // Monitoring dashboard with sub-tabs
        return (
          <div className="monitoring-dashboard">
            <div className="monitoring-header">
              <h1>🔍 System Monitoring</h1>
              <p>Monitor system performance, logs, and metrics in real-time</p>
            </div>
            
            {/* Monitoring Tabs */}
            <div className="monitoring-tabs">
              <button 
                className={`monitoring-tab ${monitoringView === 'overview' ? 'active' : ''}`}
                onClick={() => setMonitoringView('overview')}
              >
                📊 Overview
              </button>
              <button 
                className={`monitoring-tab ${monitoringView === 'logs' ? 'active' : ''}`}
                onClick={() => setMonitoringView('logs')}
              >
                📋 System Logs
              </button>
              <button 
                className={`monitoring-tab ${monitoringView === 'metrics' ? 'active' : ''}`}
                onClick={() => setMonitoringView('metrics')}
              >
                📈 Performance Metrics
              </button>
              <button 
                className={`monitoring-tab ${monitoringView === 'alerts' ? 'active' : ''}`}
                onClick={() => setMonitoringView('alerts')}
              >
                🚨 Alerts
              </button>
            </div>
            
            {/* Monitoring Content */}
            <div className="monitoring-content">
              {monitoringView === 'overview' && (
                <div className="monitoring-overview">
                  <div className="overview-header">
                    <h2>System Health Overview</h2>
                    <div className="overview-stats">
                      <div className="stat-badge green">
                        <span className="stat-icon">✅</span>
                        <span className="stat-text">All Systems Operational</span>
                      </div>
                      <div className="stat-badge">
                        <span className="stat-icon">⏱️</span>
                        <span className="stat-text">Active Users: {stats.users.active}</span>
                      </div>
                      <div className="stat-badge">
                        <span className="stat-icon">📊</span>
                        <span className="stat-text">Total Trades: {stats.trading.totalTrades}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overview-grid">
                    <div className="overview-card">
                      <div className="card-header">
                        <h3>👥 User Base</h3>
                        <span className="card-badge blue">{stats.users.total} total</span>
                      </div>
                      <div className="card-content">
                        <p>{stats.users.premium} premium users</p>
                        <button 
                          className="card-action"
                          onClick={() => setActiveTab('users')}
                        >
                          Manage Users →
                        </button>
                      </div>
                    </div>
                    
                    <div className="overview-card">
                      <div className="card-header">
                        <h3>📈 Performance Metrics</h3>
                        <span className="card-badge green">Normal</span>
                      </div>
                      <div className="card-content">
                        <p>Real-time system performance monitoring</p>
                        <button 
                          className="card-action"
                          onClick={() => setMonitoringView('metrics')}
                        >
                          View Metrics →
                        </button>
                      </div>
                    </div>
                    
                    <div className="overview-card">
                      <div className="card-header">
                        <h3>🚨 Active Alerts</h3>
                        <span className="card-badge red">3 critical</span>
                      </div>
                      <div className="card-content">
                        <p>System alerts and notifications</p>
                        <button 
                          className="card-action"
                          onClick={() => setMonitoringView('alerts')}
                        >
                          View Alerts →
                        </button>
                      </div>
                    </div>
                    
                    <div className="overview-card">
                      <div className="card-header">
                        <h3>📊 Reports</h3>
                        <span className="card-badge blue">12 available</span>
                      </div>
                      <div className="card-content">
                        <p>System performance and audit reports</p>
                        <button 
                          className="card-action"
                          onClick={() => setActiveTab('reports')}
                        >
                          View Reports →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {monitoringView === 'logs' && <SystemLogs />}
              {monitoringView === 'metrics' && <PerformanceMetrics />}
              
              {monitoringView === 'alerts' && (
                <div className="alerts-dashboard">
                  <h2>🚨 System Alerts</h2>
                  <div className="alerts-container">
                    <div className="alert-card critical">
                      <div className="alert-icon">🔥</div>
                      <div className="alert-content">
                        <h4>CPU Usage Critical</h4>
                        <p>CPU usage at 95% for 5 minutes</p>
                        <span className="alert-time">10 minutes ago</span>
                      </div>
                      <button className="alert-action">
                        Resolve
                      </button>
                    </div>
                    
                    <div className="alert-card warning">
                      <div className="alert-icon">⚠️</div>
                      <div className="alert-content">
                        <h4>Memory Usage High</h4>
                        <p>Memory usage at 85% threshold</p>
                        <span className="alert-time">30 minutes ago</span>
                      </div>
                      <button className="alert-action">
                        Acknowledge
                      </button>
                    </div>
                    
                    <div className="alert-card info">
                      <div className="alert-icon">ℹ️</div>
                      <div className="alert-content">
                        <h4>Database Backup Required</h4>
                        <p>Weekly backup overdue by 2 days</p>
                        <span className="alert-time">2 hours ago</span>
                      </div>
                      <button className="alert-action">
                        Schedule
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'reports':
        // Reports dashboard with sub-tabs
        return (
          <div className="reports-dashboard">
            <div className="reports-header">
              <h1>📋 Reports & Analytics</h1>
              <p>Generate and analyze comprehensive system reports</p>
            </div>
            
            {/* Reports Tabs */}
            <div className="reports-tabs">
              <button 
                className={`reports-tab ${reportsView === 'list' ? 'active' : ''}`}
                onClick={() => setReportsView('list')}
              >
                📋 All Reports
              </button>
              <button 
                className={`reports-tab ${reportsView === 'generate' ? 'active' : ''}`}
                onClick={() => setReportsView('generate')}
              >
                🚀 Generate New
              </button>
              <button 
                className={`reports-tab ${reportsView === 'scheduled' ? 'active' : ''}`}
                onClick={() => setReportsView('scheduled')}
              >
                🕐 Scheduled
              </button>
              <button 
                className={`reports-tab ${reportsView === 'analytics' ? 'active' : ''}`}
                onClick={() => setReportsView('analytics')}
              >
                📊 Analytics
              </button>
            </div>
            
            {/* Reports Content */}
            <div className="reports-content">
              {reportsView === 'list' && <Reports />}
              
              {reportsView === 'generate' && (
                <div className="generate-report">
                  <h2>🚀 Generate New Report</h2>
                  <div className="generate-options">
                    <div className="report-type-option">
                      <div className="option-icon">👥</div>
                      <div className="option-content">
                        <h3>User Activity Report</h3>
                        <p>User registrations, logins, and activity patterns</p>
                      </div>
                      <button className="option-action">
                        Generate
                      </button>
                    </div>
                    
                    <div className="report-type-option">
                      <div className="option-icon">💰</div>
                      <div className="option-content">
                        <h3>Financial Report</h3>
                        <p>Transactions, revenue, and financial metrics</p>
                      </div>
                      <button className="option-action">
                        Generate
                      </button>
                    </div>
                    
                    <div className="report-type-option">
                      <div className="option-icon">🏆</div>
                      <div className="option-content">
                        <h3>Competition Report</h3>
                        <p>Competition performance and participation</p>
                      </div>
                      <button className="option-action">
                        Generate
                      </button>
                    </div>
                    
                    <div className="report-type-option">
                      <div className="option-icon">📈</div>
                      <div className="option-content">
                        <h3>System Performance Report</h3>
                        <p>System metrics, uptime, and performance data</p>
                      </div>
                      <button className="option-action">
                        Generate
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {reportsView === 'scheduled' && (
                <div className="scheduled-reports">
                  <h2>🕐 Scheduled Reports</h2>
                  <div className="scheduled-list">
                    <div className="scheduled-item">
                      <div className="scheduled-info">
                        <h4>Daily User Activity Report</h4>
                        <p>Generates daily at 09:00 AM</p>
                        <span className="scheduled-status active">Active</span>
                      </div>
                      <div className="scheduled-actions">
                        <button className="scheduled-action edit">✏️ Edit</button>
                        <button className="scheduled-action pause">⏸️ Pause</button>
                      </div>
                    </div>
                    
                    <div className="scheduled-item">
                      <div className="scheduled-info">
                        <h4>Weekly System Audit</h4>
                        <p>Generates every Monday at 08:00 AM</p>
                        <span className="scheduled-status active">Active</span>
                      </div>
                      <div className="scheduled-actions">
                        <button className="scheduled-action edit">✏️ Edit</button>
                        <button className="scheduled-action pause">⏸️ Pause</button>
                      </div>
                    </div>
                    
                    <div className="scheduled-item">
                      <div className="scheduled-info">
                        <h4>Monthly Financial Summary</h4>
                        <p>Generates on 1st of each month at 10:00 AM</p>
                        <span className="scheduled-status paused">Paused</span>
                      </div>
                      <div className="scheduled-actions">
                        <button className="scheduled-action edit">✏️ Edit</button>
                        <button className="scheduled-action resume">▶️ Resume</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {reportsView === 'analytics' && (
                <div className="reports-analytics">
                  <h2>📊 Reports Analytics</h2>
                  <div className="analytics-grid">
                    <div className="analytics-card">
                      <div className="analytics-icon">📋</div>
                      <div className="analytics-content">
                        <h3>Total Reports Generated</h3>
                        <div className="analytics-value">1,245</div>
                        <p className="analytics-trend">↗️ 12% from last month</p>
                      </div>
                    </div>
                    
                    <div className="analytics-card">
                      <div className="analytics-icon">💾</div>
                      <div className="analytics-content">
                        <h3>Total Data Processed</h3>
                        <div className="analytics-value">45.2 GB</div>
                        <p className="analytics-trend">↗️ 8% from last month</p>
                      </div>
                    </div>
                    
                    <div className="analytics-card">
                      <div className="analytics-icon">📈</div>
                      <div className="analytics-content">
                        <h3>Most Popular Report</h3>
                        <div className="analytics-value">User Activity</div>
                        <p className="analytics-trend">↗️ 320 downloads</p>
                      </div>
                    </div>
                    
                    <div className="analytics-card">
                      <div className="analytics-icon">⏱️</div>
                      <div className="analytics-content">
                        <h3>Avg Generation Time</h3>
                        <div className="analytics-value">3.2s</div>
                        <p className="analytics-trend">↘️ 0.5s faster</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="settings-dashboard">
            <div className="settings-header">
              <h1>⚙️ System Settings</h1>
              <p>Configure system preferences and security settings</p>
            </div>
            
            <div className="settings-grid">
              <div className="settings-card">
                <div className="settings-icon">🔐</div>
                <div className="settings-content">
                  <h3>Security Settings</h3>
                  <p>Configure authentication, permissions, and security policies</p>
                  <button className="settings-action">
                    Configure →
                  </button>
                </div>
              </div>
              
              <div className="settings-card">
                <div className="settings-icon">💾</div>
                <div className="settings-content">
                  <h3>Backup & Restore</h3>
                  <p>System backup schedules and recovery options</p>
                  <button className="settings-action">
                    Manage →
                  </button>
                </div>
              </div>
              
              <div className="settings-card">
                <div className="settings-icon">🔔</div>
                <div className="settings-content">
                  <h3>Notification Settings</h3>
                  <p>Email, push, and system notification preferences</p>
                  <button className="settings-action">
                    Configure →
                  </button>
                </div>
              </div>
              
              <div className="settings-card">
                <div className="settings-icon">🎨</div>
                <div className="settings-content">
                  <h3>Appearance</h3>
                  <p>Theme, layout, and display preferences</p>
                  <button className="settings-action">
                    Customize →
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return <AdminProfile />;
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminDashboard;