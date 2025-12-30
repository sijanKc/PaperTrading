import React, { useState, useEffect } from 'react';
import styles from '../../admincss/Reports.module.css';

const Reports = () => {
  // Report types
  const reportTypes = [
    { 
      id: 'user', 
      label: '📊 User Reports', 
      description: 'User activity, registration, and engagement analytics',
      color: '#3b82f6',
      icon: '👥'
    },
    { 
      id: 'financial', 
      label: '💰 Financial Reports', 
      description: 'Transactions, revenue, expenses, and profit analysis',
      color: '#10b981',
      icon: '💸'
    },
    { 
      id: 'competition', 
      label: '🏆 Competition Reports', 
      description: 'Performance, participation, and leaderboard analysis',
      color: '#f59e0b',
      icon: '🎯'
    },
    { 
      id: 'system', 
      label: '⚙️ System Reports', 
      description: 'Performance, errors, and usage statistics',
      color: '#8b5cf6',
      icon: '📈'
    },
    { 
      id: 'security', 
      label: '🔒 Security Reports', 
      description: 'Audit logs, access patterns, and threat analysis',
      color: '#ef4444',
      icon: '🛡️'
    },
    { 
      id: 'trading', 
      label: '📊 Trading Reports', 
      description: 'Trade volumes, patterns, and market analysis',
      color: '#06b6d4',
      icon: '💹'
    }
  ];

  // Initial reports data
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reports from API
  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/reports', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setReports(data.reports);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // State management
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [dateRange, setDateRange] = useState({ 
    start: '2024-01-01', 
    end: '2024-02-15' 
  });
  const [reportFormat, setReportFormat] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  
  // New report form
  const [newReport, setNewReport] = useState({
    name: '',
    type: 'user',
    format: 'PDF',
    schedule: 'once',
    scheduleDate: '',
    scheduleTime: '09:00',
    emailRecipients: '',
    includeCharts: true,
    includeDetails: true
  });

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesType = selectedReportType === 'all' || report.type === selectedReportType;
    const matchesFormat = reportFormat === 'all' || report.format === reportFormat;
    const matchesSearch = searchTerm === '' || 
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.period && report.period.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesType && matchesFormat && matchesSearch;
  });

  // Statistics
  const reportStats = {
    total: reports.length,
    generated: reports.filter(r => r.status === 'generated').length,
    pending: reports.filter(r => r.status === 'pending').length,
    failed: reports.filter(r => r.status === 'failed').length,
    generating: reports.filter(r => r.status === 'generating').length,
    scheduled: reports.filter(r => r.scheduled).length
  };

  // Handle report generation
  const handleGenerateReport = async () => {
    if (!newReport.name.trim()) {
      alert('Please enter a report name');
      return;
    }

    setIsGenerating(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newReport)
      });

      const data = await response.json();

      if (data.success) {
        setReports(prev => [data.report, ...prev]);
        
        // Reset form
        setNewReport({
          name: '',
          type: 'user',
          format: 'PDF',
          schedule: 'once',
          scheduleDate: '',
          scheduleTime: '09:00',
          emailRecipients: '',
          includeCharts: true,
          includeDetails: true
        });
        
        setSchedulerOpen(false);
        alert('Report generated successfully!');
      } else {
        alert(data.message || 'Failed to generate report');
      }
    } catch (err) {
      console.error('Error generating report:', err);
      alert('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle download report
  const handleDownloadReport = (report) => {
    // In real app, this would trigger download
    alert(`Downloading ${report.name} (${report.format})`);
  };

  // Handle delete report
  const handleDeleteReport = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/reports/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success) {
          setReports(prev => prev.filter(report => report._id !== id));
          if (selectedReport?._id === id) {
            setSelectedReport(null);
          }
          alert('Report deleted successfully');
        } else {
          alert(data.message || 'Failed to delete report');
        }
      } catch (err) {
        console.error('Error deleting report:', err);
        alert('Failed to delete report');
      }
    }
  };

  // Handle retry failed report
  const handleRetryReport = (report) => {
    setReports(prev => prev.map(r => 
      r._id === report._id ? { ...r, status: 'generating' } : r
    ));
    
    setTimeout(() => {
      setReports(prev => prev.map(r => 
        r._id === report._id ? { ...r, status: 'generated' } : r
      ));
    }, 3000);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      generated: { label: '✅ Generated', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
      pending: { label: '⏳ Pending', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
      failed: { label: '❌ Failed', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
      generating: { label: '🔄 Generating', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' }
    };
    
    const config = statusConfig[status] || statusConfig.generated;
    return (
      <span 
        className={styles.statusBadge}
        style={{ 
          backgroundColor: config.bg, 
          color: config.color,
          borderColor: config.color
        }}
      >
        {config.label}
      </span>
    );
  };

  // Get type badge
  const getTypeBadge = (type) => {
    const typeInfo = reportTypes.find(t => t.id === type);
    return (
      <span 
        className={styles.typeBadge}
        style={{ 
          backgroundColor: `${typeInfo?.color}20`,
          color: typeInfo?.color,
          borderColor: typeInfo?.color
        }}
      >
        {typeInfo?.icon} {typeInfo?.label.replace('📊 ', '')}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get format badge
  const getFormatBadge = (format) => {
    const formatConfig = {
      PDF: { color: '#ef4444', icon: '📄' },
      Excel: { color: '#10b981', icon: '📊' },
      CSV: { color: '#3b82f6', icon: '📋' }
    };
    
    const config = formatConfig[format] || formatConfig.PDF;
    return (
      <span 
        className={styles.formatBadge}
        style={{ 
          backgroundColor: `${config.color}20`,
          color: config.color,
          borderColor: config.color
        }}
      >
        {config.icon} {format}
      </span>
    );
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}>📋</span>
            Reports & Analytics
          </h1>
          <p className={styles.subtitle}>
            Generate and manage system reports with detailed analytics
          </p>
        </div>
        
        <div className={styles.headerActions}>
          <button 
            className={styles.quickReportBtn}
            onClick={() => setSchedulerOpen(true)}
          >
            🚀 Quick Report
          </button>
          <button 
            className={styles.scheduleBtn}
            onClick={() => setSchedulerOpen(true)}
          >
            🕐 Schedule Report
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.total}`}>
              📋
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{reportStats.total}</div>
              <div className={styles.statLabel}>Total Reports</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.generated}`}>
              ✅
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{reportStats.generated}</div>
              <div className={styles.statLabel}>Generated</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.pending}`}>
              ⏳
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{reportStats.pending}</div>
              <div className={styles.statLabel}>Pending</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.failed}`}>
              ❌
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{reportStats.failed}</div>
              <div className={styles.statLabel}>Failed</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.generating}`}>
              🔄
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{reportStats.generating}</div>
              <div className={styles.statLabel}>Generating</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.scheduled}`}>
              🕐
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{reportStats.scheduled}</div>
              <div className={styles.statLabel}>Scheduled</div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className={styles.reportTypesSection}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>📊</span>
          Report Types
        </h3>
        
        <div className={styles.reportTypesGrid}>
          {reportTypes.map(type => (
            <div 
              key={type.id}
              className={styles.reportTypeCard}
              onClick={() => setSelectedReportType(type.id)}
              style={{
                borderColor: selectedReportType === type.id ? type.color : '#e2e8f0',
                background: selectedReportType === type.id ? `${type.color}10` : 'white'
              }}
            >
              <div 
                className={styles.reportTypeIcon}
                style={{ 
                  backgroundColor: `${type.color}20`,
                  color: type.color
                }}
              >
                {type.icon}
              </div>
              
              <div className={styles.reportTypeContent}>
                <h4>{type.label}</h4>
                <p>{type.description}</p>
              </div>
              
              <div className={styles.reportTypeStats}>
                <span className={styles.reportCount}>
                  {reports.filter(r => r.type === type.id).length} reports
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controlsSection}>
        <div className={styles.controlsGrid}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search reports..."
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
          
          <div className={styles.filterControls}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Report Type:</label>
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Types</option>
                {reportTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Format:</label>
              <select
                value={reportFormat}
                onChange={(e) => setReportFormat(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Formats</option>
                <option value="PDF">PDF</option>
                <option value="Excel">Excel</option>
                <option value="CSV">CSV</option>
              </select>
            </div>
            
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Date Range:</label>
              <div className={styles.dateRange}>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className={styles.dateInput}
                />
                <span className={styles.dateSeparator}>to</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className={styles.dateInput}
                />
              </div>
            </div>
            
            <button 
              className={styles.clearFiltersBtn}
              onClick={() => {
                setSelectedReportType('all');
                setReportFormat('all');
                setSearchTerm('');
                setDateRange({ start: '2024-01-01', end: '2024-02-15' });
                fetchReports();
              }}
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Reports List */}
        <div className={styles.reportsList}>
          <div className={styles.listHeader}>
            <h3 className={styles.listTitle}>
              📋 Reports List
              <span className={styles.listCount}>
                ({filteredReports.length} reports)
              </span>
            </h3>
            
            <div className={styles.listActions}>
              <button 
                className={styles.exportAllBtn}
                onClick={() => {
                  const selected = filteredReports.filter(r => r.status === 'generated');
                  alert(`Exporting ${selected.length} reports`);
                }}
              >
                📥 Export All
              </button>
              <button 
                className={styles.refreshBtn}
                onClick={() => {
                  // Refresh logic here
                }}
              >
                🔄 Refresh
              </button>
            </div>
          </div>
          
          <div className={styles.reportsTable}>
            <div className={styles.tableHeader}>
              <div className={styles.tableCell}>Report Name</div>
              <div className={styles.tableCell}>Type</div>
              <div className={styles.tableCell}>Period</div>
              <div className={styles.tableCell}>Status</div>
              <div className={styles.tableCell}>Format</div>
              <div className={styles.tableCell}>Generated</div>
              <div className={styles.tableCell}>Actions</div>
            </div>
            
            <div className={styles.tableBody}>
              {loading ? (
                <div className={styles.loadingReports}>
                  <div className={styles.loader}></div>
                  <p>Loading reports...</p>
                </div>
              ) : error ? (
                <div className={styles.errorReports}>
                  <p>{error}</p>
                  <button onClick={fetchReports}>Retry</button>
                </div>
              ) : filteredReports.length > 0 ? (
                filteredReports.map(report => (
                  <div 
                    key={report._id} 
                    className={`${styles.tableRow} ${selectedReport?._id === report._id ? styles.selected : ''}`}
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className={styles.tableCell}>
                      <div className={styles.reportName}>
                        <div className={styles.nameText}>{report.name}</div>
                        {report.scheduled && (
                          <span className={styles.scheduledBadge}>🕐 Scheduled</span>
                        )}
                      </div>
                    </div>
                    
                    <div className={styles.tableCell}>
                      {getTypeBadge(report.type)}
                    </div>
                    
                    <div className={styles.tableCell}>
                      <span className={styles.periodText}>{report.period}</span>
                    </div>
                    
                    <div className={styles.tableCell}>
                      {getStatusBadge(report.status)}
                    </div>
                    
                    <div className={styles.tableCell}>
                      {getFormatBadge(report.format)}
                    </div>
                    
                    <div className={styles.tableCell}>
                      <span className={styles.generatedDate}>
                        {formatDate(report.generatedAt)}
                      </span>
                    </div>
                    
                    <div className={styles.tableCell}>
                      <div className={styles.actionButtons}>
                        {report.status === 'generated' && (
                          <button 
                            className={styles.downloadBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadReport(report);
                            }}
                            title="Download report"
                          >
                            📥
                          </button>
                        )}
                        
                        {report.status === 'failed' && (
                          <button 
                            className={styles.retryBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRetryReport(report);
                            }}
                            title="Retry generation"
                          >
                            🔄
                          </button>
                        )}
                        
                        <button 
                          className={styles.previewBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReport(report);
                          }}
                          title="Preview report"
                        >
                          👁️
                        </button>
                        
                        <button 
                          className={styles.deleteBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteReport(report._id);
                          }}
                          title="Delete report"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noReports}>
                  <div className={styles.noReportsIcon}>📭</div>
                  <h3>No reports found</h3>
                  <p>Try adjusting your filters or generate a new report</p>
                </div>
              )}
            </div>
          </div>
          
          <div className={styles.tableFooter}>
            <div className={styles.pagination}>
              <button className={styles.pageBtn} disabled>← Previous</button>
              <span className={styles.pageInfo}>Page 1 of 3</span>
              <button className={styles.pageBtn}>Next →</button>
            </div>
            
            <div className={styles.tableStats}>
              Showing {filteredReports.length} of {reports.length} reports
            </div>
          </div>
        </div>

        {/* Report Details Sidebar */}
        {selectedReport && (
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h3>📄 Report Details</h3>
              <button 
                className={styles.closeSidebar}
                onClick={() => setSelectedReport(null)}
              >
                ✕
              </button>
            </div>
            
            <div className={styles.sidebarContent}>
              <div className={styles.reportPreview}>
                <div className={styles.previewHeader}>
                  <h4>{selectedReport.name}</h4>
                  <div className={styles.previewMeta}>
                    {getTypeBadge(selectedReport.type)}
                    {getStatusBadge(selectedReport.status)}
                  </div>
                </div>
                
                <div className={styles.reportDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Report ID:</span>
                    <span className={styles.detailValue}>#{selectedReport._id.substring(0, 8)}...</span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Period:</span>
                    <span className={styles.detailValue}>{selectedReport.period}</span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Format:</span>
                    <span className={styles.detailValue}>
                      {getFormatBadge(selectedReport.format)}
                    </span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Size:</span>
                    <span className={styles.detailValue}>{selectedReport.size}</span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Generated:</span>
                    <span className={styles.detailValue}>
                      {formatDate(selectedReport.generatedAt)}
                    </span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Scheduled:</span>
                    <span className={styles.detailValue}>
                      {selectedReport.scheduled ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                
                <div className={styles.reportActions}>
                  {selectedReport.status === 'generated' && (
                    <button 
                      className={styles.downloadFullBtn}
                      onClick={() => handleDownloadReport(selectedReport)}
                    >
                      📥 Download Full Report
                    </button>
                  )}
                  
                  {selectedReport.status === 'failed' && (
                    <button 
                      className={styles.retryFullBtn}
                      onClick={() => handleRetryReport(selectedReport)}
                    >
                      🔄 Retry Generation
                    </button>
                  )}
                  
                  <button className={styles.scheduleNewBtn}>
                    🕐 Schedule Similar
                  </button>
                  
                  <button className={styles.shareBtn}>
                    📤 Share Report
                  </button>
                </div>
                
                <div className={styles.reportInsights}>
                  <h4>📊 Quick Insights</h4>
                  <div className={styles.insightsGrid}>
                    <div className={styles.insightCard}>
                      <div className={styles.insightIcon}>📈</div>
                      <div className={styles.insightContent}>
                        <div className={styles.insightValue}>15.2K</div>
                        <div className={styles.insightLabel}>Data Points</div>
                      </div>
                    </div>
                    
                    <div className={styles.insightCard}>
                      <div className={styles.insightIcon}>⏱️</div>
                      <div className={styles.insightContent}>
                        <div className={styles.insightValue}>3.2s</div>
                        <div className={styles.insightLabel}>Generation Time</div>
                      </div>
                    </div>
                    
                    <div className={styles.insightCard}>
                      <div className={styles.insightIcon}>🔍</div>
                      <div className={styles.insightContent}>
                        <div className={styles.insightValue}>8</div>
                        <div className={styles.insightLabel}>Charts</div>
                      </div>
                    </div>
                    
                    <div className={styles.insightCard}>
                      <div className={styles.insightIcon}>📄</div>
                      <div className={styles.insightContent}>
                        <div className={styles.insightValue}>42</div>
                        <div className={styles.insightLabel}>Pages</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Report Scheduler Modal */}
      {schedulerOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>🚀 Generate New Report</h3>
              <button 
                className={styles.closeModal}
                onClick={() => setSchedulerOpen(false)}
              >
                ✕
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Report Name *
                    <input
                      type="text"
                      value={newReport.name}
                      onChange={(e) => setNewReport(prev => ({ ...prev, name: e.target.value }))}
                      className={styles.formInput}
                      placeholder="e.g., Monthly User Activity Report"
                      required
                    />
                  </label>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Report Type
                    <select
                      value={newReport.type}
                      onChange={(e) => setNewReport(prev => ({ ...prev, type: e.target.value }))}
                      className={styles.formSelect}
                    >
                      {reportTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Output Format
                    <select
                      value={newReport.format}
                      onChange={(e) => setNewReport(prev => ({ ...prev, format: e.target.value }))}
                      className={styles.formSelect}
                    >
                      <option value="PDF">📄 PDF Document</option>
                      <option value="Excel">📊 Excel Spreadsheet</option>
                      <option value="CSV">📋 CSV Data File</option>
                    </select>
                  </label>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Schedule Type
                    <select
                      value={newReport.schedule}
                      onChange={(e) => setNewReport(prev => ({ ...prev, schedule: e.target.value }))}
                      className={styles.formSelect}
                    >
                      <option value="once">⚡ Generate Once</option>
                      <option value="daily">📅 Daily</option>
                      <option value="weekly">📆 Weekly</option>
                      <option value="monthly">🗓️ Monthly</option>
                    </select>
                  </label>
                </div>
                
                {newReport.schedule !== 'once' && (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Start Date
                        <input
                          type="date"
                          value={newReport.scheduleDate}
                          onChange={(e) => setNewReport(prev => ({ ...prev, scheduleDate: e.target.value }))}
                          className={styles.formInput}
                        />
                      </label>
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Time
                        <input
                          type="time"
                          value={newReport.scheduleTime}
                          onChange={(e) => setNewReport(prev => ({ ...prev, scheduleTime: e.target.value }))}
                          className={styles.formInput}
                        />
                      </label>
                    </div>
                  </>
                )}
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Email Recipients
                    <input
                      type="text"
                      value={newReport.emailRecipients}
                      onChange={(e) => setNewReport(prev => ({ ...prev, emailRecipients: e.target.value }))}
                      className={styles.formInput}
                      placeholder="comma-separated emails"
                    />
                  </label>
                </div>
              </div>
              
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={newReport.includeCharts}
                    onChange={(e) => setNewReport(prev => ({ ...prev, includeCharts: e.target.checked }))}
                    className={styles.checkbox}
                  />
                  📈 Include Charts & Graphs
                </label>
                
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={newReport.includeDetails}
                    onChange={(e) => setNewReport(prev => ({ ...prev, includeDetails: e.target.checked }))}
                    className={styles.checkbox}
                  />
                  📄 Include Detailed Data
                </label>
              </div>
            </div>
            
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelBtn}
                onClick={() => setSchedulerOpen(false)}
              >
                Cancel
              </button>
              
              <button 
                className={styles.generateBtn}
                onClick={handleGenerateReport}
                disabled={isGenerating}
              >
                {isGenerating ? '🔄 Generating...' : '🚀 Generate Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h4>⚡ Quick Actions:</h4>
        <div className={styles.actionButtons}>
          <button className={styles.quickAction}>
            📊 Generate User Report
          </button>
          <button className={styles.quickAction}>
            💰 Generate Financial Report
          </button>
          <button className={styles.quickAction}>
            🏆 Generate Competition Report
          </button>
          <button className={styles.quickAction}>
            📤 Export All Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;