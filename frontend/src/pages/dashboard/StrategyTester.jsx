import React, { useState, useEffect, useCallback } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import api from '../../services/api';
import styles from './css/StrategyTester.module.css';

const StrategyTester = () => {
  const [activeTab, setActiveTab] = useState('backtest');
  const [stocks, setStocks] = useState([]);
  const [strategy, setStrategy] = useState({
    name: 'Moving Average Crossover',
    symbol: 'NTC',
    timeframe: '1D',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    initialCapital: 100000,
    fastMA: 20,
    slowMA: 50,
    stopLoss: 2,
    takeProfit: 5
  });

  const [testResults, setTestResults] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [savedStrategies, setSavedStrategies] = useState([]);
  const [isLoadingStrategies, setIsLoadingStrategies] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch stocks for the dropdown
  const fetchStocks = useCallback(async () => {
    try {
      const response = await api.get('/stocks');
      if (response.data.success) {
        setStocks(response.data.data);
        if (response.data.data.length > 0 && !strategy.symbol) {
          setStrategy(prev => ({ ...prev, symbol: response.data.data[0].symbol }));
        }
      }
    } catch (err) {
      console.error('Error fetching stocks:', err);
    }
  }, [strategy.symbol]);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  useEffect(() => {
    if (activeTab === 'strategies') {
      fetchSavedStrategies();
    }
  }, [activeTab]);

  const fetchSavedStrategies = async () => {
    setIsLoadingStrategies(true);
    setError(null);
    try {
      const response = await api.get('/strategy/user');
      if (response.data.success) {
        setSavedStrategies(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching strategies:', err);
      setError('Failed to load saved strategies');
    } finally {
      setIsLoadingStrategies(false);
    }
  };

  const handleInputChange = (field, value) => {
    setStrategy(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const runBacktest = async () => {
    setIsTesting(true);
    setError(null);
    setTestResults(null);
    
    try {
      const response = await api.post('/strategy/backtest', strategy);
      if (response.data.success) {
        setTestResults(response.data.data);
      }
    } catch (err) {
      console.error('Backtest error:', err);
      setError(err.response?.data?.message || 'Error running backtest analysis');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveStrategy = async () => {
    if (!testResults) return;
    
    try {
      const response = await api.post('/strategy/save', {
        ...strategy,
        results: testResults
      });
      
      if (response.data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        if (activeTab === 'strategies') {
          fetchSavedStrategies();
        }
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save strategy');
    }
  };

  const getProfitColor = (value) => {
    return value >= 0 ? styles.textSuccess : styles.textDanger;
  };

  const getPerformanceColor = (value) => {
    if (value >= 4) return styles.performanceExcellent;
    if (value >= 2) return styles.performanceGood;
    if (value >= 1) return styles.performanceFair;
    return styles.performancePoor;
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return 'Rs. 0.00';
    return `Rs. ${amount.toLocaleString('en-NP', { minimumFractionDigits: 2 })}`;
  };

  const StrategyForm = () => (
    <div className={styles.strategyForm}>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Strategy Name</label>
          <input
            type="text"
            value={strategy.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter strategy name"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Stock Symbol</label>
          <select 
            value={strategy.symbol}
            onChange={(e) => handleInputChange('symbol', e.target.value)}
          >
            {stocks.length > 0 ? (
              stocks.map(s => (
                <option key={s._id} value={s.symbol}>{s.symbol} - {s.name}</option>
              ))
            ) : (
              <>
                <option value="NTC">NTC</option>
                <option value="NABIL">NABIL</option>
                <option value="SCB">SCB</option>
              </>
            )}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Timeframe</label>
          <select 
            value={strategy.timeframe}
            onChange={(e) => handleInputChange('timeframe', e.target.value)}
          >
            <option value="1D">1 Day</option>
            <option value="1H">1 Hour</option>
            <option value="15M">15 Minutes</option>
            <option value="5M">5 Minutes</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Initial Capital (Rs.)</label>
          <input
            type="number"
            value={strategy.initialCapital}
            onChange={(e) => handleInputChange('initialCapital', parseInt(e.target.value))}
            min="1000"
            step="1000"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Start Date</label>
          <input
            type="date"
            value={strategy.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>End Date</label>
          <input
            type="date"
            value={strategy.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.parametersSection}>
        <h4>Strategy Parameters</h4>
        <div className={styles.parametersGrid}>
          <div className={styles.parameterGroup}>
            <label>Fast MA Period</label>
            <input
              type="number"
              value={strategy.fastMA}
              onChange={(e) => handleInputChange('fastMA', parseInt(e.target.value))}
              min="5"
              max="100"
            />
          </div>

          <div className={styles.parameterGroup}>
            <label>Slow MA Period</label>
            <input
              type="number"
              value={strategy.slowMA}
              onChange={(e) => handleInputChange('slowMA', parseInt(e.target.value))}
              min="10"
              max="200"
            />
          </div>

          <div className={styles.parameterGroup}>
            <label>Stop Loss (%)</label>
            <input
              type="number"
              value={strategy.stopLoss}
              onChange={(e) => handleInputChange('stopLoss', parseFloat(e.target.value))}
              min="0.1"
              max="10"
              step="0.1"
            />
          </div>

          <div className={styles.parameterGroup}>
            <label>Take Profit (%)</label>
            <input
              type="number"
              value={strategy.takeProfit}
              onChange={(e) => handleInputChange('takeProfit', parseFloat(e.target.value))}
              min="0.1"
              max="20"
              step="0.1"
            />
          </div>
        </div>
      </div>

      <button 
        className={styles.testButton}
        onClick={runBacktest}
        disabled={isTesting}
      >
        {isTesting ? (
          <>
            <Spinner animation="border" size="sm" className="me-2" />
            Running Backtest...
          </>
        ) : (
          '🚀 Run Backtest'
        )}
      </button>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </div>
  );

  const ResultsOverview = () => (
    <div className={styles.resultsOverview}>
      <div className={styles.overviewGrid}>
        <div className={styles.overviewCard}>
          <div className={styles.overviewIcon}>📊</div>
          <div className={styles.overviewContent}>
            <h3>{testResults.totalReturn >= 0 ? '+' : ''}{formatCurrency(testResults.totalProfit || testResults.totalReturn)}</h3>
            <p>Total Return</p>
            <span className={getProfitColor(testResults.totalReturn)}>
              {testResults.returnPercent}%
            </span>
          </div>
        </div>

        <div className={styles.overviewCard}>
          <div className={styles.overviewIcon}>🎯</div>
          <div className={styles.overviewContent}>
            <h3>{testResults.winRate}%</h3>
            <p>Win Rate</p>
            <span className={getPerformanceColor(testResults.winRate / 100 * 2)}>
              {testResults.winningTrades}W / {testResults.losingTrades}L
            </span>
          </div>
        </div>

        <div className={styles.overviewCard}>
          <div className={styles.overviewIcon}>📉</div>
          <div className={styles.overviewContent}>
            <h3>{testResults.maxDrawdown}%</h3>
            <p>Max Drawdown</p>
            <span className={testResults.maxDrawdown > -5 ? styles.textSuccess : styles.textDanger}>
              Risk Level: {testResults.maxDrawdown > -5 ? 'Low' : 'High'}
            </span>
          </div>
        </div>

        <div className={styles.overviewCard}>
          <div className={styles.overviewIcon}>⚡</div>
          <div className={styles.overviewContent}>
            <h3>{testResults.sharpeRatio}</h3>
            <p>Sharpe Ratio</p>
            <span className={getPerformanceColor(testResults.sharpeRatio)}>
              {testResults.sharpeRatio > 1 ? 'Good' : 'Poor'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const PerformanceMetrics = () => (
    <div className={styles.performanceMetrics}>
      <h3>Performance Metrics</h3>
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Profit Factor</span>
            <span className={getPerformanceColor(testResults.profitFactor)}>
              {testResults.profitFactor}
            </span>
          </div>
          <div className={styles.metricDescription}>
            Ratio of gross profit to gross loss
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Avg. Win / Loss</span>
            <span className={getProfitColor(testResults.avgWin)}>
              {formatCurrency(testResults.avgWin)} / {formatCurrency(Math.abs(testResults.avgLoss))}
            </span>
          </div>
          <div className={styles.metricDescription}>
            Average winning vs losing trade
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Best Trade</span>
            <span className={styles.textSuccess}>
              +{formatCurrency(testResults.bestTrade)}
            </span>
          </div>
          <div className={styles.metricDescription}>
            Maximum single trade profit
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Worst Trade</span>
            <span className={styles.textDanger}>
              -{formatCurrency(Math.abs(testResults.worstTrade))}
            </span>
          </div>
          <div className={styles.metricDescription}>
            Maximum single trade loss
          </div>
        </div>
      </div>
    </div>
  );

  const MonthlyPerformance = () => (
    <div className={styles.monthlyPerformance}>
      <h3>Monthly Performance</h3>
      <div className={styles.performanceBars}>
        {testResults.performance.map((month, index) => (
          <div key={index} className={styles.performanceBar}>
            <div className={styles.barInfo}>
              <span className={styles.monthName}>{month.month}</span>
              <span className={getProfitColor(month.return)}>
                {month.return >= 0 ? '+' : ''}{month.return}%
              </span>
            </div>
            <div className={styles.barContainer}>
              <div 
                className={`${styles.barFill} ${getProfitColor(month.return)}`}
                style={{ 
                  width: `${Math.min(Math.max(Math.abs(month.return) * 5, 2), 100)}%`,
                  height: '20px'
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      
      <div className={styles.dashboardMain}>
        <Header />
        
        <main className={styles.strategyTesterContainer}>
          {/* Header */}
          <div className={styles.header}>
            <h1>📓 Strategy Tester</h1>
            <p>Test your trading strategies with historical data</p>
          </div>

          {/* Tabs Navigation */}
          <div className={styles.tabsContainer}>
            <div className={styles.tabsNav}>
              <button
                onClick={() => setActiveTab('backtest')}
                className={`${styles.tabButton} ${activeTab === 'backtest' ? styles.tabButtonActive : ''}`}
              >
                📊 Backtest
              </button>
              <button
                onClick={() => setActiveTab('strategies')}
                className={`${styles.tabButton} ${activeTab === 'strategies' ? styles.tabButtonActive : ''}`}
              >
                💡 My Strategies
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`${styles.tabButton} ${activeTab === 'results' ? styles.tabButtonActive : ''}`}
              >
                📈 History
              </button>
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
              {activeTab === 'backtest' && (
                <div className={styles.backtestTab}>
                  <div className={styles.tabColumns}>
                    <div className={styles.strategyColumn}>
                      <h3>Strategy Configuration</h3>
                      <StrategyForm />
                    </div>

                    <div className={styles.resultsColumn}>
                      <h3>Backtest Results</h3>
                      {isTesting ? (
                        <div className={styles.loadingState}>
                          <Spinner animation="border" variant="primary" />
                          <p className="mt-3">Running backtest analysis...</p>
                          <p className={styles.loadingText}>This may take a few seconds</p>
                        </div>
                      ) : testResults ? (
                        <div className={styles.resultsContainer}>
                          <ResultsOverview />
                          <PerformanceMetrics />
                          <MonthlyPerformance />
                          
                          <div className={styles.actionButtons}>
                            <button 
                              className={styles.saveButton}
                              onClick={handleSaveStrategy}
                            >
                              {saveSuccess ? '✅ Saved!' : '💾 Save Strategy'}
                            </button>
                            <button className={styles.exportButton}>
                              📤 Export Results
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.placeholderState}>
                          <div className={styles.placeholderIcon}>📊</div>
                          <h4>No Results Yet</h4>
                          <p>Configure your strategy and run a backtest to see results</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'strategies' && (
                <div className={styles.strategiesTab}>
                  <div className={styles.tabHeader}>
                    <h3>Saved Strategies</h3>
                    <button className="btn btn-sm btn-outline-primary" onClick={fetchSavedStrategies}>🔄 Refresh</button>
                  </div>
                  {isLoadingStrategies ? (
                    <div className={styles.loadingState}>
                       <Spinner animation="border" variant="primary" />
                       <p className="mt-3">Loading strategies...</p>
                    </div>
                  ) : savedStrategies.length > 0 ? (
                    <div className={styles.strategiesList}>
                      {savedStrategies.map(strat => (
                        <div key={strat.id || strat._id} className={styles.strategyItem}>
                          <div className={styles.strategyHeader}>
                            <h4>{strat.name}</h4>
                            <span className={styles.strategyBadge}>{strat.isActive ? 'Active' : 'Inactive'}</span>
                          </div>
                          <p>{strat.symbol} • {strat.timeframe} • Fast MA: {strat.parameters.fastMA}, Slow MA: {strat.parameters.slowMA}</p>
                          <div className={styles.strategyStats}>
                            <span>Win Rate: {strat.results?.winRate}%</span>
                            <span>Total Return: {strat.results?.totalReturn >= 0 ? '+' : ''}{strat.results?.totalReturn}%</span>
                            <span>Last Test: {new Date(strat.results?.lastTest || strat.createdAt || Date.now()).toLocaleDateString()}</span>
                          </div>
                          <div className={styles.strategyActions}>
                            <button className={styles.actionButton} onClick={() => {
                              setStrategy({
                                ...strat,
                                ...strat.parameters
                              });
                              setActiveTab('backtest');
                            }}>Load & Test</button>
                            <button className={styles.actionButton}>Edit</button>
                            <button className={styles.deleteButton}>Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.placeholderState}>
                      <div className={styles.placeholderIcon}>💡</div>
                      <h4>No Saved Strategies</h4>
                      <p>Tested strategies you save will appear here for quick access.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'results' && (
                <div className={styles.resultsTab}>
                  <h3>Historical Results</h3>
                  <div className={styles.resultsHistory}>
                    <p>Your previous backtest results and performance history.</p>
                    <div className={styles.chartPlaceholder}>
                      <div className={styles.placeholderContent}>
                        <div className={styles.placeholderIcon}>📈</div>
                        <p>Performance Over Time</p>
                        <p>Detailed performance charts will be available in future updates</p>
                      </div>
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

export default StrategyTester;