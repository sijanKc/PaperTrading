import React, { useState, useEffect } from 'react';
import styles from '../../admincss/PerformanceMetrics.module.css';

const PerformanceMetrics = () => {
  // Initial metrics data
  const [metrics, setMetrics] = useState({
    cpuUsage: 45,
    memoryUsage: 68,
    diskUsage: 52,
    networkIn: 120,
    networkOut: 85,
    activeUsers: 235,
    apiRequests: 1250,
    databaseConnections: 85,
    responseTime: 120,
    uptime: '15d 4h 32m'
  });

  const [timeRange, setTimeRange] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [alertThresholds, setAlertThresholds] = useState({
    cpu: 85,
    memory: 90,
    disk: 80,
    responseTime: 500
  });

  const [historicalData, setHistoricalData] = useState({
    cpu: [45, 52, 48, 60, 55, 65, 58, 62, 67, 70, 68, 72],
    memory: [68, 70, 65, 72, 75, 78, 80, 82, 85, 83, 81, 79],
    network: [120, 115, 130, 125, 140, 135, 150, 145, 155, 160, 165, 170],
    responseTime: [120, 125, 130, 128, 135, 140, 145, 150, 155, 160, 165, 170]
  });

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpuUsage: Math.min(100, Math.max(20, prev.cpuUsage + (Math.random() * 10 - 5))),
        memoryUsage: Math.min(100, Math.max(30, prev.memoryUsage + (Math.random() * 8 - 4))),
        activeUsers: Math.max(100, prev.activeUsers + Math.floor(Math.random() * 20 - 10)),
        apiRequests: prev.apiRequests + Math.floor(Math.random() * 100),
        responseTime: Math.max(80, prev.responseTime + (Math.random() * 20 - 10))
      }));

      // Update historical data
      setHistoricalData(prev => ({
        cpu: [...prev.cpu.slice(1), Math.min(100, Math.max(20, metrics.cpuUsage + (Math.random() * 10 - 5)))],
        memory: [...prev.memory.slice(1), Math.min(100, Math.max(30, metrics.memoryUsage + (Math.random() * 8 - 4)))],
        network: [...prev.network.slice(1), metrics.networkIn + Math.floor(Math.random() * 30)],
        responseTime: [...prev.responseTime.slice(1), Math.max(80, metrics.responseTime + (Math.random() * 20 - 10))]
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Check for alerts
  const alerts = [
    metrics.cpuUsage > alertThresholds.cpu && {
      type: 'warning',
      message: `CPU usage high: ${metrics.cpuUsage.toFixed(1)}%`,
      metric: 'cpu'
    },
    metrics.memoryUsage > alertThresholds.memory && {
      type: 'critical',
      message: `Memory usage critical: ${metrics.memoryUsage.toFixed(1)}%`,
      metric: 'memory'
    },
    metrics.diskUsage > alertThresholds.disk && {
      type: 'warning',
      message: `Disk space low: ${metrics.diskUsage.toFixed(1)}% used`,
      metric: 'disk'
    },
    metrics.responseTime > alertThresholds.responseTime && {
      type: 'warning',
      message: `Response time slow: ${metrics.responseTime}ms`,
      metric: 'responseTime'
    }
  ].filter(Boolean);

  // Get metric status
  const getMetricStatus = (value, type) => {
    const threshold = alertThresholds[type];
    if (value > threshold) return styles.critical;
    if (value > threshold * 0.8) return styles.warning;
    return styles.normal;
  };

  // Format numbers
  const formatNumber = (num) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  // Get metric icon
  const getMetricIcon = (type) => {
    const icons = {
      cpu: '⚡',
      memory: '💾',
      disk: '💿',
      network: '🌐',
      users: '👥',
      api: '🔌',
      database: '🗄️',
      response: '⏱️',
      uptime: '⏰'
    };
    return icons[type] || '📊';
  };

  // Handle threshold change
  const handleThresholdChange = (metric, value) => {
    setAlertThresholds(prev => ({
      ...prev,
      [metric]: parseInt(value)
    }));
  };

  // Generate historical chart data
  const generateChartData = (data) => {
    return {
      labels: Array.from({ length: data.length }, (_, i) => `${i * 2}h`),
      values: data
    };
  };

  // Render mini chart
  const renderMiniChart = (data) => {
    const max = Math.max(...data);
    return (
      <div className={styles.miniChart}>
        {data.map((value, index) => (
          <div 
            key={index}
            className={styles.chartBar}
            style={{
              height: `${(value / max) * 100}%`,
              width: `${100 / data.length}%`
            }}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}>📈</span>
            Performance Metrics
          </h1>
          <p className={styles.subtitle}>Real-time system performance monitoring</p>
        </div>
        
        <div className={styles.headerControls}>
          <div className={styles.timeRange}>
            <button 
              className={`${styles.timeBtn} ${timeRange === '1h' ? styles.active : ''}`}
              onClick={() => setTimeRange('1h')}
            >
              1h
            </button>
            <button 
              className={`${styles.timeBtn} ${timeRange === '24h' ? styles.active : ''}`}
              onClick={() => setTimeRange('24h')}
            >
              24h
            </button>
            <button 
              className={`${styles.timeBtn} ${timeRange === '7d' ? styles.active : ''}`}
              onClick={() => setTimeRange('7d')}
            >
              7d
            </button>
            <button 
              className={`${styles.timeBtn} ${timeRange === '30d' ? styles.active : ''}`}
              onClick={() => setTimeRange('30d')}
            >
              30d
            </button>
          </div>
          
          <div className={styles.refreshToggle}>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className={styles.toggleInput}
              />
              <span className={styles.toggleSlider}></span>
              <span className={styles.toggleText}>
                {autoRefresh ? '🔄 Auto-refresh' : '⏸️ Paused'}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className={styles.alertsSection}>
          <div className={styles.alertsHeader}>
            <h3>🚨 System Alerts</h3>
            <span className={styles.alertCount}>{alerts.length}</span>
          </div>
          <div className={styles.alertsGrid}>
            {alerts.map((alert, index) => (
              <div key={index} className={`${styles.alertCard} ${styles[alert.type]}`}>
                <div className={styles.alertIcon}>
                  {alert.type === 'critical' ? '🔥' : '⚠️'}
                </div>
                <div className={styles.alertContent}>
                  <h4>{alert.message}</h4>
                  <p>Action recommended</p>
                </div>
                <button className={styles.alertAction}>
                  Fix
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Metrics Grid */}
      <div className={styles.metricsGrid}>
        {/* CPU Usage */}
        <div className={`${styles.metricCard} ${getMetricStatus(metrics.cpuUsage, 'cpu')}`}>
          <div className={styles.cardHeader}>
            <div className={styles.metricIcon}>
              {getMetricIcon('cpu')}
            </div>
            <div className={styles.metricInfo}>
              <h3>CPU Usage</h3>
              <div className={styles.metricValue}>
                {metrics.cpuUsage.toFixed(1)}%
              </div>
            </div>
            <div className={styles.metricTrend}>
              {renderMiniChart(historicalData.cpu)}
            </div>
          </div>
          
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${metrics.cpuUsage}%` }}
              ></div>
            </div>
            <div className={styles.progressLabels}>
              <span>0%</span>
              <span>Threshold: {alertThresholds.cpu}%</span>
              <span>100%</span>
            </div>
          </div>
          
          <div className={styles.cardFooter}>
            <div className={styles.metricDetails}>
              <span>📊 Avg: 58%</span>
              <span>📈 Peak: 78%</span>
            </div>
          </div>
        </div>

        {/* Memory Usage */}
        <div className={`${styles.metricCard} ${getMetricStatus(metrics.memoryUsage, 'memory')}`}>
          <div className={styles.cardHeader}>
            <div className={styles.metricIcon}>
              {getMetricIcon('memory')}
            </div>
            <div className={styles.metricInfo}>
              <h3>Memory Usage</h3>
              <div className={styles.metricValue}>
                {metrics.memoryUsage.toFixed(1)}%
              </div>
            </div>
            <div className={styles.metricTrend}>
              {renderMiniChart(historicalData.memory)}
            </div>
          </div>
          
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${metrics.memoryUsage}%` }}
              ></div>
            </div>
            <div className={styles.progressLabels}>
              <span>0%</span>
              <span>Threshold: {alertThresholds.memory}%</span>
              <span>100%</span>
            </div>
          </div>
          
          <div className={styles.cardFooter}>
            <div className={styles.metricDetails}>
              <span>💾 Used: 8.2GB</span>
              <span>💿 Total: 12GB</span>
            </div>
          </div>
        </div>

        {/* Disk Usage */}
        <div className={`${styles.metricCard} ${getMetricStatus(metrics.diskUsage, 'disk')}`}>
          <div className={styles.cardHeader}>
            <div className={styles.metricIcon}>
              {getMetricIcon('disk')}
            </div>
            <div className={styles.metricInfo}>
              <h3>Disk Usage</h3>
              <div className={styles.metricValue}>
                {metrics.diskUsage.toFixed(1)}%
              </div>
            </div>
            <div className={styles.metricTrend}>
              {renderMiniChart([52, 53, 51, 54, 55, 53, 56, 57, 58, 59, 60, 61])}
            </div>
          </div>
          
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${metrics.diskUsage}%` }}
              ></div>
            </div>
            <div className={styles.progressLabels}>
              <span>0%</span>
              <span>Threshold: {alertThresholds.disk}%</span>
              <span>100%</span>
            </div>
          </div>
          
          <div className={styles.cardFooter}>
            <div className={styles.metricDetails}>
              <span>📦 Used: 520GB</span>
              <span>💿 Total: 1TB</span>
            </div>
          </div>
        </div>

        {/* Network */}
        <div className={`${styles.metricCard} ${styles.normal}`}>
          <div className={styles.cardHeader}>
            <div className={styles.metricIcon}>
              {getMetricIcon('network')}
            </div>
            <div className={styles.metricInfo}>
              <h3>Network</h3>
              <div className={styles.metricValue}>
                {formatNumber(metrics.networkIn)} MB/s
              </div>
            </div>
            <div className={styles.metricTrend}>
              {renderMiniChart(historicalData.network)}
            </div>
          </div>
          
          <div className={styles.networkStats}>
            <div className={styles.networkItem}>
              <span className={styles.networkLabel}>⬇️ In:</span>
              <span className={styles.networkValue}>{metrics.networkIn} MB/s</span>
            </div>
            <div className={styles.networkItem}>
              <span className={styles.networkLabel}>⬆️ Out:</span>
              <span className={styles.networkValue}>{metrics.networkOut} MB/s</span>
            </div>
            <div className={styles.networkItem}>
              <span className={styles.networkLabel}>🌐 Total:</span>
              <span className={styles.networkValue}>{metrics.networkIn + metrics.networkOut} MB/s</span>
            </div>
          </div>
          
          <div className={styles.cardFooter}>
            <div className={styles.metricDetails}>
              <span>📊 In: {formatNumber(metrics.networkIn * 3600)} MB/day</span>
              <span>📈 Out: {formatNumber(metrics.networkOut * 3600)} MB/day</span>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className={`${styles.metricCard} ${styles.normal}`}>
          <div className={styles.cardHeader}>
            <div className={styles.metricIcon}>
              {getMetricIcon('users')}
            </div>
            <div className={styles.metricInfo}>
              <h3>Active Users</h3>
              <div className={styles.metricValue}>
                {formatNumber(metrics.activeUsers)}
              </div>
            </div>
            <div className={styles.userAvatars}>
              <span className={styles.avatar}>👤</span>
              <span className={styles.avatar}>👩</span>
              <span className={styles.avatar}>👨</span>
              <span className={styles.avatar}>+{Math.max(0, metrics.activeUsers - 3)}</span>
            </div>
          </div>
          
          <div className={styles.userStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Online:</span>
              <span className={styles.statValue}>{metrics.activeUsers}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Today:</span>
              <span className={styles.statValue}>1,250</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Week:</span>
              <span className={styles.statValue}>8,750</span>
            </div>
          </div>
          
          <div className={styles.cardFooter}>
            <div className={styles.metricDetails}>
              <span>📊 Concurrent: {metrics.activeUsers}</span>
              <span>📈 Peak: 320</span>
            </div>
          </div>
        </div>

        {/* API Requests */}
        <div className={`${styles.metricCard} ${styles.normal}`}>
          <div className={styles.cardHeader}>
            <div className={styles.metricIcon}>
              {getMetricIcon('api')}
            </div>
            <div className={styles.metricInfo}>
              <h3>API Requests</h3>
              <div className={styles.metricValue}>
                {formatNumber(metrics.apiRequests)}
              </div>
            </div>
            <div className={styles.requestRate}>
              <span className={styles.rateLabel}>/min</span>
            </div>
          </div>
          
          <div className={styles.apiStats}>
            <div className={styles.apiItem}>
              <span className={styles.apiLabel}>✅ Success:</span>
              <span className={styles.apiValue}>98.5%</span>
            </div>
            <div className={styles.apiItem}>
              <span className={styles.apiLabel}>❌ Errors:</span>
              <span className={`${styles.apiValue} ${styles.error}`}>1.5%</span>
            </div>
            <div className={styles.apiItem}>
              <span className={styles.apiLabel}>⚡ Avg Time:</span>
              <span className={styles.apiValue}>{metrics.responseTime}ms</span>
            </div>
          </div>
          
          <div className={styles.cardFooter}>
            <div className={styles.metricDetails}>
              <span>📊 Today: {formatNumber(metrics.apiRequests * 60)}</span>
              <span>📈 Total: 2.5M</span>
            </div>
          </div>
        </div>

        {/* Response Time */}
        <div className={`${styles.metricCard} ${getMetricStatus(metrics.responseTime, 'responseTime')}`}>
          <div className={styles.cardHeader}>
            <div className={styles.metricIcon}>
              {getMetricIcon('response')}
            </div>
            <div className={styles.metricInfo}>
              <h3>Response Time</h3>
              <div className={styles.metricValue}>
                {metrics.responseTime}ms
              </div>
            </div>
            <div className={styles.metricTrend}>
              {renderMiniChart(historicalData.responseTime)}
            </div>
          </div>
          
          <div className={styles.responseStats}>
            <div className={styles.responseItem}>
              <span className={styles.responseLabel}>Fast (&lt;100ms):</span>
              <span className={styles.responseValue}>65%</span>
            </div>
            <div className={styles.responseItem}>
              <span className={styles.responseLabel}>Avg (100-500ms):</span>
              <span className={styles.responseValue}>30%</span>
            </div>
            <div className={styles.responseItem}>
              <span className={styles.responseLabel}>Slow (&gt;500ms):</span>
              <span className={`${styles.responseValue} ${styles.warning}`}>5%</span>
            </div>
          </div>
          
          <div className={styles.cardFooter}>
            <div className={styles.metricDetails}>
              <span>⚡ Target: &lt;100ms</span>
              <span>⚠️ Threshold: {alertThresholds.responseTime}ms</span>
            </div>
          </div>
        </div>

        {/* Uptime */}
        <div className={`${styles.metricCard} ${styles.normal}`}>
          <div className={styles.cardHeader}>
            <div className={styles.metricIcon}>
              {getMetricIcon('uptime')}
            </div>
            <div className={styles.metricInfo}>
              <h3>System Uptime</h3>
              <div className={styles.metricValue}>
                {metrics.uptime}
              </div>
            </div>
            <div className={styles.uptimeBadge}>
              <span className={styles.badgeText}>99.9%</span>
            </div>
          </div>
          
          <div className={styles.uptimeStats}>
            <div className={styles.uptimeItem}>
              <span className={styles.uptimeLabel}>🟢 Current:</span>
              <span className={styles.uptimeValue}>{metrics.uptime}</span>
            </div>
            <div className={styles.uptimeItem}>
              <span className={styles.uptimeLabel}>📊 30-day Avg:</span>
              <span className={styles.uptimeValue}>99.95%</span>
            </div>
            <div className={styles.uptimeItem}>
              <span className={styles.uptimeLabel}>🚨 Last Downtime:</span>
              <span className={styles.uptimeValue}>15 days ago</span>
            </div>
          </div>
          
          <div className={styles.cardFooter}>
            <div className={styles.metricDetails}>
              <span>✅ Status: Operational</span>
              <span>🔧 Maintenance: None scheduled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Threshold Settings */}
      <div className={styles.thresholdSection}>
        <div className={styles.sectionHeader}>
          <h3>⚙️ Alert Thresholds</h3>
          <p>Configure system alert levels</p>
        </div>
        
        <div className={styles.thresholdGrid}>
          {[
            { id: 'cpu', label: 'CPU Usage', value: alertThresholds.cpu, unit: '%', icon: '⚡' },
            { id: 'memory', label: 'Memory Usage', value: alertThresholds.memory, unit: '%', icon: '💾' },
            { id: 'disk', label: 'Disk Usage', value: alertThresholds.disk, unit: '%', icon: '💿' },
            { id: 'responseTime', label: 'Response Time', value: alertThresholds.responseTime, unit: 'ms', icon: '⏱️' }
          ].map(threshold => (
            <div key={threshold.id} className={styles.thresholdCard}>
              <div className={styles.thresholdHeader}>
                <div className={styles.thresholdIcon}>
                  {threshold.icon}
                </div>
                <div className={styles.thresholdInfo}>
                  <h4>{threshold.label}</h4>
                  <div className={styles.thresholdValue}>
                    Current: <span>{threshold.value}{threshold.unit}</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.thresholdControl}>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={threshold.value}
                  onChange={(e) => handleThresholdChange(threshold.id, e.target.value)}
                  className={styles.thresholdSlider}
                />
                <div className={styles.thresholdLabels}>
                  <span>50{threshold.unit}</span>
                  <span>75{threshold.unit}</span>
                  <span>100{threshold.unit}</span>
                </div>
              </div>
              
              <div className={styles.thresholdStatus}>
                <span className={styles.statusLabel}>Status:</span>
                <span className={`${styles.statusValue} ${
                  metrics[threshold.id] > threshold.value ? styles.criticalStatus :
                  metrics[threshold.id] > threshold.value * 0.8 ? styles.warningStatus :
                  styles.normalStatus
                }`}>
                  {metrics[threshold.id] > threshold.value ? '🔴 Critical' :
                   metrics[threshold.id] > threshold.value * 0.8 ? '🟡 Warning' :
                   '🟢 Normal'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Health Summary */}
      <div className={styles.healthSummary}>
        <div className={styles.healthHeader}>
          <h3>🏥 System Health Summary</h3>
          <div className={styles.healthScore}>
            <div className={styles.scoreCircle}>
              <span className={styles.scoreValue}>92</span>
              <span className={styles.scoreLabel}>/100</span>
            </div>
            <div className={styles.scoreText}>
              <h4>Excellent</h4>
              <p>All systems operational</p>
            </div>
          </div>
        </div>
        
        <div className={styles.healthGrid}>
          <div className={styles.healthItem}>
            <span className={styles.healthIcon}>✅</span>
            <div className={styles.healthContent}>
              <h4>All Services Running</h4>
              <p>12/12 services active</p>
            </div>
          </div>
          
          <div className={styles.healthItem}>
            <span className={styles.healthIcon}>⚡</span>
            <div className={styles.healthContent}>
              <h4>Performance Stable</h4>
              <p>Within optimal ranges</p>
            </div>
          </div>
          
          <div className={styles.healthItem}>
            <span className={styles.healthIcon}>🛡️</span>
            <div className={styles.healthContent}>
              <h4>Security Good</h4>
              <p>No security threats</p>
            </div>
          </div>
          
          <div className={styles.healthItem}>
            <span className={styles.healthIcon}>🔧</span>
            <div className={styles.healthContent}>
              <h4>Maintenance Updated</h4>
              <p>Last patch: 2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;