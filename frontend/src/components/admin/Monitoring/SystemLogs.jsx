import React, { useState, useEffect } from 'react';
import styles from '../../admincss/SystemLogs.module.css';

const SystemLogs = () => {
  // Initial log data
  const [logs, setLogs] = useState([
    { 
      id: 1, 
      timestamp: '2024-02-15 10:30:25', 
      level: 'INFO', 
      module: 'Authentication', 
      message: 'User login successful: admin', 
      user: 'admin',
      ip: '192.168.1.1',
      sessionId: 'sess_001'
    },
    { 
      id: 2, 
      timestamp: '2024-02-15 10:25:18', 
      level: 'WARNING', 
      module: 'Database', 
      message: 'Connection pool at 80% capacity', 
      user: 'system',
      ip: '127.0.0.1',
      sessionId: 'sess_system'
    },
    { 
      id: 3, 
      timestamp: '2024-02-15 10:20:12', 
      level: 'ERROR', 
      module: 'API', 
      message: 'Failed to fetch market data from NEPSE', 
      user: 'system',
      ip: '127.0.0.1',
      sessionId: 'sess_system'
    },
    { 
      id: 4, 
      timestamp: '2024-02-15 10:15:45', 
      level: 'INFO', 
      module: 'Competition', 
      message: 'Competition "NEPSE Masters" started', 
      user: 'admin',
      ip: '192.168.1.10',
      sessionId: 'sess_002'
    },
    { 
      id: 5, 
      timestamp: '2024-02-15 10:10:33', 
      level: 'INFO', 
      module: 'Trading', 
      message: 'Trade executed: NABIL 100 shares @ ₹800', 
      user: 'user123',
      ip: '192.168.1.25',
      sessionId: 'sess_003'
    },
    { 
      id: 6, 
      timestamp: '2024-02-15 10:05:21', 
      level: 'DEBUG', 
      module: 'Cache', 
      message: 'Cache cleared for user preferences', 
      user: 'system',
      ip: '127.0.0.1',
      sessionId: 'sess_system'
    },
    { 
      id: 7, 
      timestamp: '2024-02-15 10:00:15', 
      level: 'ERROR', 
      module: 'Payment', 
      message: 'Payment verification failed', 
      user: 'user456',
      ip: '192.168.1.30',
      sessionId: 'sess_004'
    },
    { 
      id: 8, 
      timestamp: '2024-02-15 09:55:42', 
      level: 'INFO', 
      module: 'Email', 
      message: 'Competition reminder email sent', 
      user: 'system',
      ip: '127.0.0.1',
      sessionId: 'sess_system'
    },
    { 
      id: 9, 
      timestamp: '2024-02-15 09:50:33', 
      level: 'WARNING', 
      module: 'Security', 
      message: 'Multiple failed login attempts', 
      user: 'unknown',
      ip: '203.0.113.5',
      sessionId: 'sess_blocked'
    },
    { 
      id: 10, 
      timestamp: '2024-02-15 09:45:28', 
      level: 'INFO', 
      module: 'Backup', 
      message: 'Daily database backup completed', 
      user: 'system',
      ip: '127.0.0.1',
      sessionId: 'sess_system'
    },
  ]);

  const [filterLevel, setFilterLevel] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [timeRange, setTimeRange] = useState('24h');

  // Calculate statistics
  const logStats = {
    total: logs.length,
    info: logs.filter(log => log.level === 'INFO').length,
    warning: logs.filter(log => log.level === 'WARNING').length,
    error: logs.filter(log => log.level === 'ERROR').length,
    debug: logs.filter(log => log.level === 'DEBUG').length
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel;
    const matchesSearch = searchTerm === '' || 
      log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  // Auto-refresh simulation
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      const newLog = {
        id: logs.length + 1,
        timestamp: new Date().toLocaleString(),
        level: ['INFO', 'WARNING', 'DEBUG'][Math.floor(Math.random() * 3)],
        module: ['API', 'Database', 'Cache', 'Authentication'][Math.floor(Math.random() * 4)],
        message: `System activity at ${new Date().toLocaleTimeString()}`,
        user: 'system',
        ip: '127.0.0.1',
        sessionId: 'sess_system'
      };
      
      setLogs(prev => [newLog, ...prev.slice(0, 49)]);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, logs.length]);

  // Handlers
  const handleDeleteLog = (id) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      setLogs(prev => prev.filter(log => log.id !== id));
      if (selectedLog?.id === id) setSelectedLog(null);
    }
  };

  const handleClearLogs = () => {
    if (window.confirm('Clear all logs? This action cannot be undone.')) {
      setLogs([]);
      setSelectedLog(null);
    }
  };

  const handleExportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `system_logs_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Helper functions
  const getLevelBadge = (level) => {
    const levelConfig = {
      INFO: { color: styles.info, icon: 'ℹ️' },
      WARNING: { color: styles.warning, icon: '⚠️' },
      ERROR: { color: styles.error, icon: '❌' },
      DEBUG: { color: styles.debug, icon: '🐛' }
    };
    
    const config = levelConfig[level] || levelConfig.INFO;
    return (
      <span className={`${styles.levelBadge} ${config.color}`}>
        {config.icon} {level}
      </span>
    );
  };

  const getModuleBadge = (module) => {
    return (
      <span className={styles.moduleBadge}>
        {module}
      </span>
    );
  };

  const getLogColor = (level) => {
    switch(level) {
      case 'ERROR': return styles.errorRow;
      case 'WARNING': return styles.warningRow;
      default: return '';
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}>📋</span>
            System Logs
          </h1>
          <p className={styles.subtitle}>Monitor system activities and errors in real-time</p>
        </div>
        
        <div className={styles.headerActions}>
          <button 
            className={styles.exportBtn}
            onClick={handleExportLogs}
          >
            📥 Export JSON
          </button>
          <button 
            className={styles.clearBtn}
            onClick={handleClearLogs}
          >
            🗑️ Clear All
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.total}`}>
            📊
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{logStats.total}</div>
            <div className={styles.statLabel}>Total Logs</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.infoStat}`}>
            ℹ️
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{logStats.info}</div>
            <div className={styles.statLabel}>Info</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.warningStat}`}>
            ⚠️
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{logStats.warning}</div>
            <div className={styles.statLabel}>Warnings</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.errorStat}`}>
            ❌
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{logStats.error}</div>
            <div className={styles.statLabel}>Errors</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.debugStat}`}>
            🐛
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{logStats.debug}</div>
            <div className={styles.statLabel}>Debug</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button 
                className={styles.clearSearch}
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>
        
        <div className={styles.filterControls}>
          <div className={styles.levelFilters}>
            <button 
              className={`${styles.filterBtn} ${filterLevel === 'ALL' ? styles.active : ''}`}
              onClick={() => setFilterLevel('ALL')}
            >
              All
            </button>
            {['INFO', 'WARNING', 'ERROR', 'DEBUG'].map(level => (
              <button 
                key={level}
                className={`${styles.filterBtn} ${filterLevel === level ? styles.active : ''} ${styles[level.toLowerCase()]}`}
                onClick={() => setFilterLevel(level)}
              >
                {level}
              </button>
            ))}
          </div>
          
          <div className={styles.viewControls}>
            <button 
              className={`${styles.viewBtn} ${viewMode === 'table' ? styles.active : ''}`}
              onClick={() => setViewMode('table')}
            >
              📋 Table
            </button>
            <button 
              className={`${styles.viewBtn} ${viewMode === 'card' ? styles.active : ''}`}
              onClick={() => setViewMode('card')}
            >
              🗂️ Card
            </button>
            
            <div className={styles.autoRefreshToggle}>
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className={styles.toggleInput}
                />
                <span className={styles.toggleSlider}></span>
                <span className={styles.toggleText}>
                  {autoRefresh ? '🔄 ON' : '⏸️ OFF'}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Logs Display */}
        <div className={styles.logsContainer}>
          {filteredLogs.length > 0 ? (
            viewMode === 'table' ? (
              // Table View
              <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableCell}>Time</div>
                  <div className={styles.tableCell}>Level</div>
                  <div className={styles.tableCell}>Module</div>
                  <div className={styles.tableCell}>Message</div>
                  <div className={styles.tableCell}>User</div>
                  <div className={styles.tableCell}>Actions</div>
                </div>
                
                <div className={styles.tableBody}>
                  {filteredLogs.map(log => (
                    <div 
                      key={log.id} 
                      className={`${styles.tableRow} ${getLogColor(log.level)} ${selectedLog?.id === log.id ? styles.selected : ''}`}
                      onClick={() => setSelectedLog(log)}
                    >
                      <div className={styles.tableCell}>
                        <div className={styles.timeCell}>{log.timestamp}</div>
                      </div>
                      
                      <div className={styles.tableCell}>
                        {getLevelBadge(log.level)}
                      </div>
                      
                      <div className={styles.tableCell}>
                        {getModuleBadge(log.module)}
                      </div>
                      
                      <div className={styles.tableCell}>
                        <div className={styles.messageCell}>
                          {log.message}
                        </div>
                      </div>
                      
                      <div className={styles.tableCell}>
                        <div className={styles.userCell}>
                          <div className={styles.userName}>{log.user}</div>
                          <div className={styles.userIp}>{log.ip}</div>
                        </div>
                      </div>
                      
                      <div className={styles.tableCell}>
                        <div className={styles.actionButtons}>
                          <button 
                            className={styles.viewBtnSmall}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLog(log);
                            }}
                            title="View details"
                          >
                            👁️
                          </button>
                          <button 
                            className={styles.deleteBtnSmall}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLog(log.id);
                            }}
                            title="Delete log"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Card View
              <div className={styles.cardsContainer}>
                {filteredLogs.map(log => (
                  <div 
                    key={log.id} 
                    className={`${styles.logCard} ${getLogColor(log.level)} ${selectedLog?.id === log.id ? styles.selectedCard : ''}`}
                    onClick={() => setSelectedLog(log)}
                  >
                    <div className={styles.cardHeader}>
                      <div className={styles.cardMeta}>
                        {getLevelBadge(log.level)}
                        <span className={styles.cardTime}>{log.timestamp}</span>
                      </div>
                      <div className={styles.cardModule}>
                        {getModuleBadge(log.module)}
                      </div>
                    </div>
                    
                    <div className={styles.cardBody}>
                      <p className={styles.cardMessage}>{log.message}</p>
                      <div className={styles.cardUser}>
                        <span className={styles.userLabel}>👤</span>
                        <span>{log.user}</span>
                        <span className={styles.userIp}>@{log.ip}</span>
                      </div>
                    </div>
                    
                    <div className={styles.cardFooter}>
                      <button 
                        className={styles.cardActionBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLog(log);
                        }}
                      >
                        Details
                      </button>
                      <button 
                        className={styles.cardDeleteBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLog(log.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className={styles.noLogs}>
              <div className={styles.noLogsIcon}>📭</div>
              <h3>No logs found</h3>
              <p>Try changing your filters or search terms</p>
            </div>
          )}
          
          <div className={styles.logsFooter}>
            <span className={styles.logsCount}>
              Showing {filteredLogs.length} of {logs.length} logs
            </span>
            <div className={styles.quickFilters}>
              <button 
                className={styles.quickFilter}
                onClick={() => setFilterLevel('ERROR')}
              >
                🚨 Show Errors
              </button>
              <button 
                className={styles.quickFilter}
                onClick={() => setSearchTerm('admin')}
              >
                👨‍💼 Admin Logs
              </button>
              <button 
                className={styles.quickFilter}
                onClick={() => {
                  setFilterLevel('ALL');
                  setSearchTerm('');
                }}
              >
                🔄 Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {selectedLog && (
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h3>📄 Log Details</h3>
              <button 
                className={styles.closeSidebar}
                onClick={() => setSelectedLog(null)}
              >
                ✕
              </button>
            </div>
            
            <div className={styles.sidebarContent}>
              <div className={styles.detailSection}>
                <h4>Basic Information</h4>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>ID:</span>
                  <span className={styles.detailValue}>#{selectedLog.id}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Timestamp:</span>
                  <span className={styles.detailValue}>{selectedLog.timestamp}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Level:</span>
                  <span className={styles.detailValue}>
                    {getLevelBadge(selectedLog.level)}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Module:</span>
                  <span className={styles.detailValue}>
                    {getModuleBadge(selectedLog.module)}
                  </span>
                </div>
              </div>
              
              <div className={styles.detailSection}>
                <h4>Message</h4>
                <div className={styles.messageFull}>
                  {selectedLog.message}
                </div>
              </div>
              
              <div className={styles.detailSection}>
                <h4>User Information</h4>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>User:</span>
                  <span className={styles.detailValue}>{selectedLog.user}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>IP Address:</span>
                  <span className={styles.detailValue}>
                    <code>{selectedLog.ip}</code>
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Session ID:</span>
                  <span className={styles.detailValue}>
                    <code>{selectedLog.sessionId}</code>
                  </span>
                </div>
              </div>
              
              <div className={styles.detailSection}>
                <h4>Actions</h4>
                <div className={styles.sidebarActions}>
                  <button className={styles.copyBtn}>
                    📋 Copy Log
                  </button>
                  <button className={styles.markBtn}>
                    🚨 Mark Important
                  </button>
                  <button 
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteLog(selectedLog.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemLogs;