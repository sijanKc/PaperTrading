import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import api from '../../services/api';
import styles from './css/Transactions.module.css';

const Transactions = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/trade/transactions');
      if (response.data.success) {
        setTransactions(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const stats = {
    totalTransactions: transactions.length,
    totalBuy: transactions.filter(t => t.type === 'buy').length,
    totalSell: transactions.filter(t => t.type === 'sell').length,
    totalAmount: transactions.reduce((sum, t) => sum + (t.totalAmount || 0), 0),
    totalFees: transactions.reduce((sum, t) => sum + (t.fees || 0), 0),
    pendingOrders: transactions.filter(t => t.status === 'pending').length
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return styles.statusCompleted;
      case 'executed': return styles.statusCompleted;
      case 'pending': return styles.statusPending;
      case 'failed': return styles.statusFailed;
      default: return styles.statusCompleted;
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return '✅';
      case 'executed': return '✅';
      case 'pending': return '⏳';
      case 'failed': return '❌';
      default: return '✅';
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'buy': return styles.typeBuy;
      case 'sell': return styles.typeSell;
      case 'dividend': return styles.typeDividend;
      default: return styles.typeBuy;
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'buy': return '📈';
      case 'sell': return '📉';
      case 'dividend': return '💰';
      default: return '📊';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    // Tab filter
    if (activeTab !== 'all' && transaction.type !== activeTab) return false;
    
    // Search filter
    if (searchTerm && !transaction.symbol.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !transaction.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    // Date filter
    if (dateFilter !== 'all') {
      const date = new Date(transaction.createdAt);
      const now = new Date();
      if (dateFilter === 'today' && date.toDateString() !== now.toDateString()) return false;
      if (dateFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (date < weekAgo) return false;
      }
      if (dateFilter === 'month') {
        if (date.getMonth() !== now.getMonth() || date.getFullYear() !== now.getFullYear()) return false;
      }
    }
    
    return true;
  });

  const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString('en-NP', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-NP', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const TransactionStats = () => (
    <div className={styles.statsOverview}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <h3>{stats.totalTransactions}</h3>
            <p>Total Transactions</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📈</div>
          <div className={styles.statContent}>
            <h3>{stats.totalBuy}</h3>
            <p>Buy Orders</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📉</div>
          <div className={styles.statContent}>
            <h3>{stats.totalSell}</h3>
            <p>Sell Orders</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>💸</div>
          <div className={styles.statContent}>
            <h3>{formatCurrency(stats.totalAmount)}</h3>
            <p>Total Volume</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statContent}>
            <h3>{formatCurrency(stats.totalFees)}</h3>
            <p>Total Fees</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏳</div>
          <div className={styles.statContent}>
            <h3>{stats.pendingOrders}</h3>
            <p>Pending Orders</p>
          </div>
        </div>
      </div>
    </div>
  );

  const TransactionsTable = () => (
    <div className={styles.transactionsTable}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>Type</th>
              <th>Stock</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Amount</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Order Type</th>
              <th>Fees</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction._id} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  <div className={`${styles.typeBadge} ${getTypeColor(transaction.type)}`}>
                    <span className={styles.typeIcon}>{getTypeIcon(transaction.type)}</span>
                    <span className={styles.typeText}>
                      {transaction.type.toUpperCase()}
                    </span>
                  </div>
                </td>
                
                <td className={styles.tableCell}>
                  <div className={styles.stockInfo}>
                    <div className={styles.stockSymbol}>{transaction.symbol}</div>
                    <div className={styles.stockName}>{transaction.name}</div>
                  </div>
                </td>
                
                <td className={styles.tableCell}>
                  <div className={styles.quantity}>{transaction.quantity}</div>
                </td>
                
                <td className={styles.tableCell}>
                  <div className={styles.price}>{formatCurrency(transaction.price)}</div>
                </td>
                
                <td className={styles.tableCell}>
                  <div className={styles.amount}>{formatCurrency(transaction.totalAmount)}</div>
                </td>
                
                <td className={styles.tableCell}>
                  <div className={styles.datetime}>
                    <div className={styles.date}>{formatDate(transaction.createdAt)}</div>
                    <div className={styles.time}>{formatTime(transaction.createdAt)}</div>
                  </div>
                </td>
                
                <td className={styles.tableCell}>
                  <div className={`${styles.statusBadge} ${getStatusColor(transaction.status)}`}>
                    <span className={styles.statusIcon}>{getStatusIcon(transaction.status)}</span>
                    <span className={styles.statusText}>
                      {transaction.status.toUpperCase()}
                    </span>
                  </div>
                </td>
                
                <td className={styles.tableCell}>
                  <div className={styles.orderType}>{transaction.orderType || 'Market'}</div>
                </td>
                
                <td className={styles.tableCell}>
                  <div className={styles.fees}>
                    {transaction.fees > 0 ? formatCurrency(transaction.fees) : 'Free'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <h4>No Transactions Found</h4>
          <p>No transactions match your current filters</p>
          <button 
            className={styles.clearFiltersButton}
            onClick={() => {
              setActiveTab('all');
              setSearchTerm('');
              setDateFilter('all');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {loading && (
        <div className={styles.loadingState} style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading transactions...</p>
        </div>
      )}
    </div>
  );

  const ExportSection = () => (
    <div className={styles.exportSection}>
      <h3>Export Transactions</h3>
      <div className={styles.exportOptions}>
        <button className={styles.exportButton}>
          📥 Export as CSV
        </button>
        <button className={styles.exportButton}>
          📊 Export as PDF
        </button>
        <button className={styles.exportButton}>
          🖨️ Print Statement
        </button>
      </div>
      <div className={styles.exportInfo}>
        <p>Export your transaction history for tax purposes or personal records</p>
      </div>
    </div>
  );

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      
      <div className={styles.dashboardMain}>
        <Header />
        
        <main className={styles.transactionsContainer}>
          {/* Header */}
          <div className={styles.header}>
            <h1>💳 Transactions History</h1>
            <p>Track all your stock trading activities and orders</p>
          </div>

          {error && (
            <div className={styles.errorBanner} style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Stats Overview */}
          <TransactionStats />

          {/* Filters and Controls */}
          <div className={styles.controls}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="🔍 Search by symbol or company name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <div className={styles.tabFilters}>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`${styles.tabButton} ${activeTab === 'all' ? styles.tabActive : ''}`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab('buy')}
                  className={`${styles.tabButton} ${activeTab === 'buy' ? styles.tabActive : ''}`}
                >
                  📈 Buy
                </button>
                <button
                  onClick={() => setActiveTab('sell')}
                  className={`${styles.tabButton} ${activeTab === 'sell' ? styles.tabActive : ''}`}
                >
                  📉 Sell
                </button>
                <button
                  onClick={() => setActiveTab('dividend')}
                  className={`${styles.tabButton} ${activeTab === 'dividend' ? styles.tabActive : ''}`}
                >
                  💰 Dividend
                </button>
              </div>

              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className={styles.dateFilter}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>

          {/* Main Content */}
          <div className={styles.mainContent}>
            <div className={styles.transactionsSection}>
              <div className={styles.sectionHeader}>
                <h3>Transaction History</h3>
                <div className={styles.transactionCount}>
                  Showing {filteredTransactions.length} of {transactions.length} transactions
                </div>
              </div>
              <TransactionsTable />
            </div>

            <div className={styles.sidebar}>
              <ExportSection />
              
              <div className={styles.recentActivity}>
                <h3>Recent Activity</h3>
                <div className={styles.activityList}>
                  {transactions.slice(0, 5).map(transaction => (
                    <div key={transaction._id} className={styles.activityItem}>
                      <div className={styles.activityIcon}>
                        {getTypeIcon(transaction.type)}
                      </div>
                      <div className={styles.activityDetails}>
                        <div className={styles.activityTitle}>
                          {transaction.type.toUpperCase()} {transaction.symbol}
                        </div>
                        <div className={styles.activitySubtitle}>
                          {transaction.quantity} shares • {formatCurrency(transaction.totalAmount)}
                        </div>
                        <div className={styles.activityTime}>
                          {formatDate(transaction.createdAt)} • {formatTime(transaction.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Transactions;
