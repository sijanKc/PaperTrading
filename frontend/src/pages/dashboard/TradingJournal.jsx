import React, { useState, useEffect, useCallback } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import api from '../../services/api';
import styles from './css/TradingJournal.module.css';

const TradingJournal = () => {
  const [activeTab, setActiveTab] = useState('trades');
  const [showAddTrade, setShowAddTrade] = useState(false);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    openTrades: 0,
    totalProfit: 0,
    winRate: 0
  });

  const [newTrade, setNewTrade] = useState({
    symbol: "",
    type: "Buy",
    quantity: 0,
    entryPrice: 0,
    exitPrice: 0,
    entryDate: new Date().toISOString().split('T')[0],
    exitDate: "",
    notes: "",
    strategy: "Swing Trading"
  });

  const fetchJournalData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/journal/entries');
      if (response.data.success) {
        setTrades(response.data.data.entries);
        setStats(response.data.data.stats);
      }
    } catch (err) {
      console.error('Journal fetch error:', err);
      setError(err.response?.data?.message || 'Failed to fetch journal entries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJournalData();
  }, [fetchJournalData]);

  const handleInputChange = (field, value) => {
    setNewTrade(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTrade = async () => {
    try {
      const response = await api.post('/journal/entries', newTrade);
      if (response.data.success) {
        fetchJournalData(); // Refresh data
        setShowAddTrade(false);
        setNewTrade({
          symbol: "",
          type: "Buy",
          quantity: 0,
          entryPrice: 0,
          exitPrice: 0,
          entryDate: new Date().toISOString().split('T')[0],
          exitDate: "",
          notes: "",
          strategy: "Swing Trading"
        });
      }
    } catch (err) {
      console.error('Add trade error:', err);
      alert('Failed to add trade: ' + (err.response?.data?.message || err.message));
    }
  };

  const deleteTrade = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trade?')) return;

    try {
      const response = await api.delete(`/journal/entries/${id}`);
      if (response.data.success) {
        // Optimistic update or refresh
        fetchJournalData();
      }
    } catch (err) {
      console.error('Delete trade error:', err);
      alert('Failed to delete trade');
    }
  };

  const getProfitColor = (value) => {
    return value >= 0 ? styles.textSuccess : styles.textDanger;
  };

  const getStatusBadge = (status) => {
    return status === "Open" ? styles.statusOpen : styles.statusClosed;
  };

  const getTypeBadge = (type) => {
    return type === "Buy" ? styles.typeBuy : styles.typeSell;
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return 'Rs. 0.00';
    return `Rs. ${amount.toLocaleString('en-NP', { minimumFractionDigits: 2 })}`;
  };

  const TradeForm = () => (
    <div className={styles.tradeForm}>
      <h3>Add New Trade</h3>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Stock Symbol</label>
          <select 
            value={newTrade.symbol}
            onChange={(e) => handleInputChange('symbol', e.target.value)}
          >
            <option value="">Select Symbol</option>
            <option value="NTC">NTC</option>
            <option value="NABIL">NABIL</option>
            <option value="SCB">SCB</option>
            <option value="NICA">NICA</option>
            <option value="NIB">NIB</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Trade Type</label>
          <select 
            value={newTrade.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
          >
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Quantity</label>
          <input
            type="number"
            value={newTrade.quantity}
            onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
            min="1"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Entry Price (Rs.)</label>
          <input
            type="number"
            value={newTrade.entryPrice}
            onChange={(e) => handleInputChange('entryPrice', parseFloat(e.target.value))}
            min="0"
            step="0.01"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Exit Price (Rs.)</label>
          <input
            type="number"
            value={newTrade.exitPrice}
            onChange={(e) => handleInputChange('exitPrice', parseFloat(e.target.value))}
            min="0"
            step="0.01"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Entry Date</label>
          <input
            type="date"
            value={newTrade.entryDate}
            onChange={(e) => handleInputChange('entryDate', e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Exit Date</label>
          <input
            type="date"
            value={newTrade.exitDate}
            onChange={(e) => handleInputChange('exitDate', e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Trading Strategy</label>
          <select 
            value={newTrade.strategy}
            onChange={(e) => handleInputChange('strategy', e.target.value)}
          >
            <option value="Swing Trading">Swing Trading</option>
            <option value="Day Trading">Day Trading</option>
            <option value="Momentum">Momentum</option>
            <option value="Value Investing">Value Investing</option>
            <option value="Dividend Investing">Dividend Investing</option>
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>Notes & Analysis</label>
        <textarea
          value={newTrade.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          rows="3"
          placeholder="Enter your trade analysis, reasons for entry/exit, emotions, lessons learned..."
        />
      </div>

      <div className={styles.formActions}>
        <button className={styles.cancelButton} onClick={() => setShowAddTrade(false)}>
          Cancel
        </button>
        <button className={styles.saveButton} onClick={addTrade}>
          Save Trade
        </button>
      </div>
    </div>
  );

  const StatsOverview = () => (
    <div className={styles.statsOverview}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <h3>{stats.totalTrades}</h3>
            <p>Total Trades</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎯</div>
          <div className={styles.statContent}>
            <h3>{stats.winRate.toFixed(1)}%</h3>
            <p>Win Rate</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statContent}>
            <h3 className={getProfitColor(stats.totalProfit)}>
              {stats.totalProfit >= 0 ? '+' : ''}{formatCurrency(stats.totalProfit)}
            </h3>
            <p>Total P&L</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏳</div>
          <div className={styles.statContent}>
            <h3>{stats.openTrades}</h3>
            <p>Open Trades</p>
          </div>
        </div>
      </div>
    </div>
  );

  const TradesList = () => (
    <div className={styles.tradesList}>
      <div className={styles.tableContainer}>
        <table className={styles.tradesTable}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>Symbol</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Entry Price</th>
              <th>Exit Price</th>
              <th>P&L</th>
              <th>Status</th>
              <th>Strategy</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id || trade._id} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  <div className={styles.symbolCell}>
                    <span className={styles.symbol}>{trade.symbol}</span>
                    {trade.notes && <span className={styles.hasNotes} title={trade.notes}>📝</span>}
                  </div>
                </td>
                <td className={styles.tableCell}>
                  <span className={`${styles.typeBadge} ${getTypeBadge(trade.type)}`}>
                    {trade.type}
                  </span>
                </td>
                <td className={styles.tableCell}>{trade.quantity}</td>
                <td className={styles.tableCell}>{formatCurrency(trade.entryPrice)}</td>
                <td className={styles.tableCell}>
                  {trade.exitPrice ? formatCurrency(trade.exitPrice) : '-'}
                </td>
                <td className={styles.tableCell}>
                  <div className={`${styles.plCell} ${getProfitColor(trade.profitLoss)}`}>
                    {trade.profitLoss >= 0 ? '+' : ''}{formatCurrency(trade.profitLoss)}
                    {trade.profitLossPercent && (
                      <span className={styles.plPercent}>
                        ({trade.profitLossPercent >= 0 ? '+' : ''}{trade.profitLossPercent.toFixed(2)}%)
                      </span>
                    )}
                  </div>
                </td>
                <td className={styles.tableCell}>
                  <span className={`${styles.statusBadge} ${getStatusBadge(trade.status)}`}>
                    {trade.status}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.strategyTag}>{trade.strategy}</span>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.editButton}
                      title="Edit Trade"
                    >
                      ✏️
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => deleteTrade(trade.id || trade._id)}
                      title="Delete Trade"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {trades.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <h4>No Trades Yet</h4>
          <p>Start logging your trades to track your performance</p>
          <button 
            className={styles.addFirstTradeButton}
            onClick={() => setShowAddTrade(true)}
          >
            ➕ Log Your First Trade
          </button>
        </div>
      )}
    </div>
  );

  const AnalyticsSection = () => (
    <div className={styles.analytics}>
      <h3>Performance Analytics</h3>
      
      <div className={styles.analyticsGrid}>
        <div className={styles.analyticsCard}>
          <h4>Win/Loss Distribution</h4>
          <div className={styles.winLossChart}>
            <div className={styles.chartBar}>
              <div className={styles.barLabel}>Winners</div>
              <div className={styles.barContainer}>
                <div 
                  className={`${styles.barFill} ${styles.barWin}`}
                  style={{ width: `${stats.totalTrades > 0 ? (stats.winningTrades / stats.totalTrades) * 100 : 0}%` }}
                ></div>
              </div>
              <div className={styles.barValue}>{stats.winningTrades}</div>
            </div>
            <div className={styles.chartBar}>
              <div className={styles.barLabel}>Losers</div>
              <div className={styles.barContainer}>
                <div 
                  className={`${styles.barFill} ${styles.barLoss}`}
                  style={{ width: `${stats.totalTrades > 0 ? (stats.losingTrades / stats.totalTrades) * 100 : 0}%` }}
                ></div>
              </div>
              <div className={styles.barValue}>{stats.losingTrades}</div>
            </div>
          </div>
        </div>

        <div className={styles.analyticsCard}>
          <h4>Strategy Performance</h4>
          <div className={styles.strategyStats}>
            {['Swing Trading', 'Day Trading', 'Momentum', 'Value Investing', 'Dividend Investing'].map(strategy => {
              const strategyTrades = trades.filter(t => t.strategy === strategy);
              const strategyProfit = strategyTrades.reduce((sum, t) => sum + t.profitLoss, 0);
              return strategyTrades.length > 0 ? (
                <div key={strategy} className={styles.strategyItem}>
                  <span className={styles.strategyName}>{strategy}</span>
                  <span className={getProfitColor(strategyProfit)}>
                    {formatCurrency(strategyProfit)}
                  </span>
                  <span className={styles.tradeCount}>({strategyTrades.length} trades)</span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>

      <div className={styles.performanceChart}>
        <h4>Monthly Performance</h4>
        <div className={styles.chartPlaceholder}>
          <div className={styles.placeholderContent}>
            <div className={styles.placeholderIcon}>📈</div>
            <p>Performance Over Time</p>
            <p>Chart showing monthly profit/loss trends</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      
      <div className={styles.dashboardMain}>
        <Header />
        
        <main className={styles.journalContainer}>
          {/* Header */}
          <div className={styles.header}>
            <h1>📓 Trading Journal</h1>
            <p>Track, analyze, and improve your trading performance</p>
          </div>

          {/* Stats Overview */}
          <StatsOverview />

          {/* Tabs Navigation */}
          <div className={styles.tabsContainer}>
            <div className={styles.tabsNav}>
              <button
                onClick={() => setActiveTab('trades')}
                className={`${styles.tabButton} ${activeTab === 'trades' ? styles.tabButtonActive : ''}`}
              >
                📋 Trade Log
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`${styles.tabButton} ${activeTab === 'analytics' ? styles.tabButtonActive : ''}`}
              >
                📊 Analytics
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`${styles.tabButton} ${activeTab === 'insights' ? styles.tabButtonActive : ''}`}
              >
                💡 Insights
              </button>
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
              {loading ? (
                <div className="text-center w-100 py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3">Loading journal...</p>
                </div>
              ) : error ? (
                <div className="w-100">
                  <Alert variant="danger">{error}</Alert>
                  <button className="btn btn-primary" onClick={fetchJournalData}>Retry</button>
                </div>
              ) : (
                <>
                  {activeTab === 'trades' && (
                    <div className={styles.tradesTab}>
                      <div className={styles.tabHeader}>
                        <h3>Trade History</h3>
                        <button 
                          className={styles.addTradeButton}
                          onClick={() => setShowAddTrade(true)}
                        >
                          ➕ Add Trade
                        </button>
                      </div>

                      {showAddTrade ? (
                        <TradeForm />
                      ) : (
                        <TradesList />
                      )}
                    </div>
                  )}

                  {activeTab === 'analytics' && (
                    <div className={styles.analyticsTab}>
                      <AnalyticsSection />
                    </div>
                  )}

                  {activeTab === 'insights' && (
                    <div className={styles.insightsTab}>
                      <h3>Trading Insights</h3>
                      <div className={styles.insightsGrid}>
                        <div className={styles.insightCard}>
                          <div className={styles.insightIcon}>🎯</div>
                          <h4>Best Performing Strategy</h4>
                          <p>Swing Trading with 68% win rate</p>
                        </div>
                        <div className={styles.insightCard}>
                          <div className={styles.insightIcon}>⚠️</div>
                          <h4>Area for Improvement</h4>
                          <p>Reduce emotional trading during market volatility</p>
                        </div>
                        <div className={styles.insightCard}>
                          <div className={styles.insightIcon}>📈</div>
                          <h4>Consistency Score</h4>
                          <p>You maintain profits in 3 out of 4 weeks</p>
                        </div>
                        <div className={styles.insightCard}>
                          <div className={styles.insightIcon}>🕒</div>
                          <h4>Optimal Holding Period</h4>
                          <p>5-10 day holds yield highest returns</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TradingJournal;
