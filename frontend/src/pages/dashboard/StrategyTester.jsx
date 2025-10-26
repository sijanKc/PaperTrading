import React, { useState } from 'react';
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import styles from './css/StrategyTester.module.css';

const StrategyTester = () => {
  const [activeTab, setActiveTab] = useState('backtest');
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

  // Mock backtest results
  const mockResults = {
    totalTrades: 45,
    winningTrades: 28,
    losingTrades: 17,
    winRate: 62.2,
    totalReturn: 15600,
    returnPercent: 15.6,
    maxDrawdown: -8.2,
    sharpeRatio: 1.8,
    profitFactor: 2.1,
    avgWin: 850,
    avgLoss: -420,
    bestTrade: 2100,
    worstTrade: -680,
    performance: [
      { month: 'Jan', return: 2.1 },
      { month: 'Feb', return: -1.2 },
      { month: 'Mar', return: 4.8 },
      { month: 'Apr', return: 3.2 },
      { month: 'May', return: 5.6 },
      { month: 'Jun', return: 2.4 }
    ]
  };

  const handleInputChange = (field, value) => {
    setStrategy(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const runBacktest = () => {
    setIsTesting(true);
    // Simulate API call delay
    setTimeout(() => {
      setTestResults(mockResults);
      setIsTesting(false);
    }, 2000);
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
            <option value="NTC">NTC</option>
            <option value="NABIL">NABIL</option>
            <option value="SCB">SCB</option>
            <option value="NICA">NICA</option>
            <option value="NIB">NIB</option>
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
          <label>Initial Capital (Nrs)</label>
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
            <div className={styles.spinner}></div>
            Running Backtest...
          </>
        ) : (
          '🚀 Run Backtest'
        )}
      </button>
    </div>
  );

  const ResultsOverview = () => (
    <div className={styles.resultsOverview}>
      <div className={styles.overviewGrid}>
        <div className={styles.overviewCard}>
          <div className={styles.overviewIcon}>📊</div>
          <div className={styles.overviewContent}>
            <h3>{testResults.totalReturn >= 0 ? '+' : ''}Nrs. {testResults.totalReturn.toLocaleString()}</h3>
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
              Nrs. {testResults.avgWin} / Nrs. {Math.abs(testResults.avgLoss)}
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
              +Nrs. {testResults.bestTrade}
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
              Nrs. {testResults.worstTrade}
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
                  width: `${Math.min(Math.abs(month.return) * 10, 100)}%`,
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
            <h1>🔬 Strategy Tester</h1>
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
                📈 Results
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
                          <div className={styles.loadingSpinner}></div>
                          <p>Running backtest analysis...</p>
                          <p className={styles.loadingText}>This may take a few seconds</p>
                        </div>
                      ) : testResults ? (
                        <div className={styles.resultsContainer}>
                          <ResultsOverview />
                          <PerformanceMetrics />
                          <MonthlyPerformance />
                          
                          <div className={styles.actionButtons}>
                            <button className={styles.saveButton}>
                              💾 Save Strategy
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
                  <h3>Saved Strategies</h3>
                  <div className={styles.strategiesList}>
                    <div className={styles.strategyItem}>
                      <div className={styles.strategyHeader}>
                        <h4>Moving Average Crossover</h4>
                        <span className={styles.strategyBadge}>Active</span>
                      </div>
                      <p>NTC • 1D • Fast MA: 20, Slow MA: 50</p>
                      <div className={styles.strategyStats}>
                        <span>Win Rate: 62%</span>
                        <span>Total Return: 15.6%</span>
                        <span>Last Test: 2 days ago</span>
                      </div>
                      <div className={styles.strategyActions}>
                        <button className={styles.actionButton}>Test Again</button>
                        <button className={styles.actionButton}>Edit</button>
                        <button className={styles.deleteButton}>Delete</button>
                      </div>
                    </div>

                    <div className={styles.strategyItem}>
                      <div className={styles.strategyHeader}>
                        <h4>RSI Strategy</h4>
                        <span className={styles.strategyBadge}>Inactive</span>
                      </div>
                      <p>NABIL • 1H • RSI: 30/70</p>
                      <div className={styles.strategyStats}>
                        <span>Win Rate: 58%</span>
                        <span>Total Return: 12.3%</span>
                        <span>Last Test: 1 week ago</span>
                      </div>
                      <div className={styles.strategyActions}>
                        <button className={styles.actionButton}>Test Again</button>
                        <button className={styles.actionButton}>Edit</button>
                        <button className={styles.deleteButton}>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'results' && (
                <div className={styles.resultsTab}>
                  <h3>Historical Results</h3>
                  <div className={styles.resultsHistory}>
                    <p>Your previous backtest results will appear here.</p>
                    <div className={styles.chartPlaceholder}>
                      <div className={styles.placeholderContent}>
                        <div className={styles.placeholderIcon}>📈</div>
                        <p>Performance Over Time</p>
                        <p>Chart showing strategy performance across different tests</p>
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