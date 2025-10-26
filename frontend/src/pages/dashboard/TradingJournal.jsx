import React, { useState } from 'react';
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import styles from './css/TradingJournal.module.css';

const TradingJournal = () => {
  const [activeTab, setActiveTab] = useState('trades');
  const [showAddTrade, setShowAddTrade] = useState(false);

  // Mock trade data
  const [trades, setTrades] = useState([
    {
      id: 1,
      symbol: "NTC",
      type: "Buy",
      quantity: 50,
      entryPrice: 800,
      exitPrice: 850,
      entryDate: "2024-01-15",
      exitDate: "2024-01-20",
      profitLoss: 2500,
      profitLossPercent: 6.25,
      notes: "Strong earnings report",
      status: "Closed",
      strategy: "Swing Trading"
    },
    {
      id: 2,
      symbol: "NABIL",
      type: "Sell",
      quantity: 25,
      entryPrice: 1250,
      exitPrice: 1200,
      entryDate: "2024-01-18",
      exitDate: "2024-01-22",
      profitLoss: -1250,
      profitLossPercent: -4.0,
      notes: "Market correction",
      status: "Closed",
      strategy: "Momentum"
    },
    {
      id: 3,
      symbol: "SCB",
      type: "Buy",
      quantity: 100,
      entryPrice: 480,
      exitPrice: null,
      entryDate: "2024-01-25",
      exitDate: null,
      profitLoss: 600,
      profitLossPercent: 1.25,
      notes: "Holding for dividend",
      status: "Open",
      strategy: "Dividend Investing"
    }
  ]);

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

  const stats = {
    totalTrades: trades.length,
    winningTrades: trades.filter(t => t.profitLoss > 0).length,
    losingTrades: trades.filter(t => t.profitLoss < 0).length,
    openTrades: trades.filter(t => t.status === "Open").length,
    totalProfit: trades.reduce((sum, trade) => sum + (trade.profitLoss || 0), 0),
    winRate: ((trades.filter(t => t.profitLoss > 0).length / trades.filter(t => t.status === "Closed").length) * 100) || 0
  };

  const handleInputChange = (field, value) => {
    setNewTrade(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTrade = () => {
    const trade = {
      ...newTrade,
      id: trades.length + 1,
      profitLoss: newTrade.exitPrice ? 
        (newTrade.type === "Buy" ? 1 : -1) * (newTrade.exitPrice - newTrade.entryPrice) * newTrade.quantity : 0,
      profitLossPercent: newTrade.exitPrice ? 
        ((newTrade.exitPrice - newTrade.entryPrice) / newTrade.entryPrice * 100) : 0,
      status: newTrade.exitPrice ? "Closed" : "Open"
    };
    
    setTrades(prev => [trade, ...prev]);
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
  };

  const deleteTrade = (id) => {
    setTrades(prev => prev.filter(trade => trade.id !== id));
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
          <label>Entry Price (Nrs)</label>
          <input
            type="number"
            value={newTrade.entryPrice}
            onChange={(e) => handleInputChange('entryPrice', parseFloat(e.target.value))}
            min="0"
            step="0.01"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Exit Price (Nrs)</label>
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
              {stats.totalProfit >= 0 ? '+' : ''}Nrs. {stats.totalProfit.toLocaleString()}
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
              <tr key={trade.id} className={styles.tableRow}>
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
                <td className={styles.tableCell}>Nrs. {trade.entryPrice}</td>
                <td className={styles.tableCell}>
                  {trade.exitPrice ? `Nrs. ${trade.exitPrice}` : '-'}
                </td>
                <td className={styles.tableCell}>
                  <div className={`${styles.plCell} ${getProfitColor(trade.profitLoss)}`}>
                    {trade.profitLoss >= 0 ? '+' : ''}Nrs. {trade.profitLoss.toLocaleString()}
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
                      onClick={() => deleteTrade(trade.id)}
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

  const Analytics = () => (
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
                  style={{ width: `${(stats.winningTrades / stats.totalTrades) * 100}%` }}
                ></div>
              </div>
              <div className={styles.barValue}>{stats.winningTrades}</div>
            </div>
            <div className={styles.chartBar}>
              <div className={styles.barLabel}>Losers</div>
              <div className={styles.barContainer}>
                <div 
                  className={`${styles.barFill} ${styles.barLoss}`}
                  style={{ width: `${(stats.losingTrades / stats.totalTrades) * 100}%` }}
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
                    Nrs. {strategyProfit.toLocaleString()}
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
                  <Analytics />
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TradingJournal;