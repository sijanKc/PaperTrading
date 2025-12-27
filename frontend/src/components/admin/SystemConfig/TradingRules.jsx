import React, { useState, useEffect } from 'react';
import styles from '../../admincss/TradingRules.module.css';

const TradingRules = () => {
  // Trading Rules State
  const [rules, setRules] = useState({
    // Basic Limits
    dailyTradeLimit: 50000,
    perTradeLimit: 10000,
    minTradeAmount: 500,
    
    // Risk Management
    maxDailyLossPercent: 20,
    maxPortfolioLossPercent: 30,
    stopLossEnabled: true,
    stopLossPercent: 10,
    
    // Trading Hours (NEPSE)
    marketOpenTime: "9:15",
    marketCloseTime: "15:30",
    preMarketOpen: "9:00",
    postMarketClose: "16:00",
    
    // Stock Limits
    maxStocksPerTrade: 5,
    maxHoldingsPerStock: 1000,
    minHoldingPeriod: 1, // days
    
    // Commission & Fees
    commissionRate: 0.001, // 0.1%
    dpCharge: 25,
    sebonFee: 0.00015, // 0.015%
    
    // Sector Limits
    sectorLimits: {
      banking: 40, // percentage
      finance: 30,
      insurance: 25,
      hydropower: 20,
      others: 15
    },
    
    // Order Types
    allowedOrderTypes: ['market', 'limit'],
    shortSellingAllowed: false,
    marginTradingAllowed: false,
    
    // Advanced Rules
    volatilityCircuitBreaker: true,
    maxPriceChangePercent: 10,
    coolOffPeriod: 15, // minutes
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load rules on mount
  useEffect(() => {
    fetchTradingRules();
  }, []);

  const fetchTradingRules = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/trading-rules', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success && data.rules) {
        setRules(data.rules);
      } else {
        console.error('Failed to fetch trading rules:', data.message);
      }
    } catch (error) {
      console.error('Error fetching trading rules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRuleChange = (field, value) => {
    setRules(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleSectorLimitChange = (sector, value) => {
    setRules(prev => ({
      ...prev,
      sectorLimits: {
        ...prev.sectorLimits,
        [sector]: parseInt(value)
      }
    }));
    setHasChanges(true);
  };

  const handleSaveRules = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/trading-rules', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(rules)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setHasChanges(false);
        alert('Trading rules updated successfully! ✅');
      } else {
        alert('Failed to update trading rules: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving rules:', error);
      alert('Error saving trading rules. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all trading rules to default values?')) {
      setRules({
        dailyTradeLimit: 50000,
        perTradeLimit: 10000,
        minTradeAmount: 500,
        maxDailyLossPercent: 20,
        maxPortfolioLossPercent: 30,
        stopLossEnabled: true,
        stopLossPercent: 10,
        marketOpenTime: "9:15",
        marketCloseTime: "15:30",
        preMarketOpen: "9:00",
        postMarketClose: "16:00",
        maxStocksPerTrade: 5,
        maxHoldingsPerStock: 1000,
        minHoldingPeriod: 1,
        commissionRate: 0.001,
        dpCharge: 25,
        sebonFee: 0.00015,
        sectorLimits: {
          banking: 40,
          finance: 30,
          insurance: 25,
          hydropower: 20,
          others: 15
        },
        allowedOrderTypes: ['market', 'limit'],
        shortSellingAllowed: false,
        marginTradingAllowed: false,
        volatilityCircuitBreaker: true,
        maxPriceChangePercent: 10,
        coolOffPeriod: 15,
      });
      setHasChanges(true);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading trading rules...</p>
      </div>
    );
  }

  return (
    <div className={styles.tradingRulesContainer}>
      
      {/* Header */}
      <div className={styles.headerSection}>
        <h1 className={styles.pageTitle}>
          <span className={styles.titleIcon}>📜</span>
          Trading Rules Configuration
        </h1>
        <p className={styles.pageSubtitle}>
          Configure paper trading limits, risk parameters, and market rules
        </p>
        
        <div className={styles.headerActions}>
          <button 
            className={styles.resetButton}
            onClick={handleResetToDefaults}
          >
            🔄 Reset to Defaults
          </button>
          
          <button 
            className={`${styles.saveButton} ${hasChanges ? styles.hasChanges : ''}`}
            onClick={handleSaveRules}
            disabled={!hasChanges || isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Saving...
              </>
            ) : (
              '💾 Save Changes'
            )}
          </button>
        </div>
      </div>

      {/* Rules Sections */}
      <div className={styles.rulesGrid}>

        {/* Section 1: Trading Limits */}
        <div className={styles.rulesSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>💰</span>
              Trading Limits
            </h2>
            <span className={styles.sectionSubtitle}>Daily and per-trade restrictions</span>
          </div>
          
          <div className={styles.rulesForm}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Daily Trading Limit
                <span className={styles.helperText}>Maximum total trading amount per day</span>
              </label>
              <div className={styles.inputGroup}>
                <span className={styles.currencySymbol}>₹</span>
                <input
                  type="number"
                  value={rules.dailyTradeLimit}
                  onChange={(e) => handleRuleChange('dailyTradeLimit', parseInt(e.target.value))}
                  className={styles.formInput}
                  min="1000"
                  step="1000"
                />
                <div className={styles.inputActions}>
                  <button 
                    className={styles.quickSetBtn}
                    onClick={() => handleRuleChange('dailyTradeLimit', 25000)}
                  >
                    25K
                  </button>
                  <button 
                    className={styles.quickSetBtn}
                    onClick={() => handleRuleChange('dailyTradeLimit', 50000)}
                  >
                    50K
                  </button>
                  <button 
                    className={styles.quickSetBtn}
                    onClick={() => handleRuleChange('dailyTradeLimit', 100000)}
                  >
                    1L
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Per Trade Limit
                <span className={styles.helperText}>Maximum amount for a single trade</span>
              </label>
              <div className={styles.inputGroup}>
                <span className={styles.currencySymbol}>₹</span>
                <input
                  type="number"
                  value={rules.perTradeLimit}
                  onChange={(e) => handleRuleChange('perTradeLimit', parseInt(e.target.value))}
                  className={styles.formInput}
                  min="100"
                  step="500"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Minimum Trade Amount
                <span className={styles.helperText}>Smallest allowed trade value</span>
              </label>
              <div className={styles.inputGroup}>
                <span className={styles.currencySymbol}>₹</span>
                <input
                  type="number"
                  value={rules.minTradeAmount}
                  onChange={(e) => handleRuleChange('minTradeAmount', parseInt(e.target.value))}
                  className={styles.formInput}
                  min="100"
                  step="100"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Maximum Stocks per Trade
                <span className={styles.helperText}>Number of different stocks in one trade</span>
              </label>
              <div className={styles.stepper}>
                <button 
                  className={styles.stepperBtn}
                  onClick={() => handleRuleChange('maxStocksPerTrade', Math.max(1, rules.maxStocksPerTrade - 1))}
                >
                  -
                </button>
                <span className={styles.stepperValue}>{rules.maxStocksPerTrade}</span>
                <button 
                  className={styles.stepperBtn}
                  onClick={() => handleRuleChange('maxStocksPerTrade', rules.maxStocksPerTrade + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Risk Management */}
        <div className={styles.rulesSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>⚠️</span>
              Risk Management
            </h2>
            <span className={styles.sectionSubtitle}>Loss limits and safety measures</span>
          </div>
          
          <div className={styles.rulesForm}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Maximum Daily Loss (%)
                <span className={styles.helperText}>Stop trading if loss exceeds this percentage</span>
              </label>
              <div className={styles.sliderContainer}>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={rules.maxDailyLossPercent}
                  onChange={(e) => handleRuleChange('maxDailyLossPercent', parseInt(e.target.value))}
                  className={styles.slider}
                />
                <div className={styles.sliderLabels}>
                  <span>5%</span>
                  <span className={styles.sliderValue}>{rules.maxDailyLossPercent}%</span>
                  <span>50%</span>
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Maximum Portfolio Loss (%)
                <span className={styles.helperText}>Maximum loss from starting portfolio</span>
              </label>
              <div className={styles.sliderContainer}>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={rules.maxPortfolioLossPercent}
                  onChange={(e) => handleRuleChange('maxPortfolioLossPercent', parseInt(e.target.value))}
                  className={styles.slider}
                />
                <div className={styles.sliderLabels}>
                  <span>10%</span>
                  <span className={styles.sliderValue}>{rules.maxPortfolioLossPercent}%</span>
                  <span>50%</span>
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={rules.stopLossEnabled}
                  onChange={(e) => handleRuleChange('stopLossEnabled', e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>Enable Automatic Stop Loss</span>
              </label>
              
              {rules.stopLossEnabled && (
                <div className={styles.nestedGroup}>
                  <label className={styles.formLabel}>
                    Stop Loss Percentage
                    <span className={styles.helperText}>Auto-sell if stock drops by this percentage</span>
                  </label>
                  <div className={styles.sliderContainer}>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="1"
                      value={rules.stopLossPercent}
                      onChange={(e) => handleRuleChange('stopLossPercent', parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <div className={styles.sliderLabels}>
                      <span>1%</span>
                      <span className={styles.sliderValue}>{rules.stopLossPercent}%</span>
                      <span>20%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Minimum Holding Period (Days)
                <span className={styles.helperText}>Must hold stocks for minimum days</span>
              </label>
              <div className={styles.stepper}>
                <button 
                  className={styles.stepperBtn}
                  onClick={() => handleRuleChange('minHoldingPeriod', Math.max(0, rules.minHoldingPeriod - 1))}
                >
                  -
                </button>
                <span className={styles.stepperValue}>{rules.minHoldingPeriod} day{rules.minHoldingPeriod !== 1 ? 's' : ''}</span>
                <button 
                  className={styles.stepperBtn}
                  onClick={() => handleRuleChange('minHoldingPeriod', rules.minHoldingPeriod + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Market Hours */}
        <div className={styles.rulesSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>⏰</span>
              Market Hours
            </h2>
            <span className={styles.sectionSubtitle}>NEPSE trading schedule</span>
          </div>
          
          <div className={styles.rulesForm}>
            <div className={styles.timeGrid}>
              <div className={styles.timeGroup}>
                <label className={styles.timeLabel}>Market Open</label>
                <input
                  type="time"
                  value={rules.marketOpenTime}
                  onChange={(e) => handleRuleChange('marketOpenTime', e.target.value)}
                  className={styles.timeInput}
                />
              </div>
              
              <div className={styles.timeGroup}>
                <label className={styles.timeLabel}>Market Close</label>
                <input
                  type="time"
                  value={rules.marketCloseTime}
                  onChange={(e) => handleRuleChange('marketCloseTime', e.target.value)}
                  className={styles.timeInput}
                />
              </div>
              
              <div className={styles.timeGroup}>
                <label className={styles.timeLabel}>Pre-market Open</label>
                <input
                  type="time"
                  value={rules.preMarketOpen}
                  onChange={(e) => handleRuleChange('preMarketOpen', e.target.value)}
                  className={styles.timeInput}
                />
              </div>
              
              <div className={styles.timeGroup}>
                <label className={styles.timeLabel}>Post-market Close</label>
                <input
                  type="time"
                  value={rules.postMarketClose}
                  onChange={(e) => handleRuleChange('postMarketClose', e.target.value)}
                  className={styles.timeInput}
                />
              </div>
            </div>
            
            <div className={styles.tradingHoursDisplay}>
              <div className={styles.hoursCard}>
                <div className={styles.hoursLabel}>Trading Session</div>
                <div className={styles.hoursValue}>
                  {rules.marketOpenTime} - {rules.marketCloseTime}
                </div>
              </div>
              
              <div className={styles.hoursCard}>
                <div className={styles.hoursLabel}>Extended Hours</div>
                <div className={styles.hoursValue}>
                  {rules.preMarketOpen} - {rules.postMarketClose}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Sector Limits */}
        <div className={styles.rulesSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🏦</span>
              Sector Exposure Limits
            </h2>
            <span className={styles.sectionSubtitle}>Maximum allocation per sector</span>
          </div>
          
          <div className={styles.sectorLimitsGrid}>
            {Object.entries(rules.sectorLimits).map(([sector, limit]) => (
              <div key={sector} className={styles.sectorLimitItem}>
                <div className={styles.sectorInfo}>
                  <span className={styles.sectorIcon}>
                    {sector === 'banking' && '🏦'}
                    {sector === 'finance' && '💼'}
                    {sector === 'insurance' && '🛡️'}
                    {sector === 'hydropower' && '⚡'}
                    {sector === 'others' && '📊'}
                  </span>
                  <div>
                    <div className={styles.sectorName}>
                      {sector.charAt(0).toUpperCase() + sector.slice(1)} Sector
                    </div>
                    <div className={styles.currentLimit}>Current: {limit}%</div>
                  </div>
                </div>
                
                <div className={styles.sectorControl}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={limit}
                    onChange={(e) => handleSectorLimitChange(sector, e.target.value)}
                    className={styles.sectorSlider}
                  />
                  <div className={styles.sectorValue}>{limit}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Fees & Commission */}
        <div className={styles.rulesSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>💸</span>
              Fees & Commission
            </h2>
            <span className={styles.sectionSubtitle}>Trading charges and fees</span>
          </div>
          
          <div className={styles.feesGrid}>
            <div className={styles.feeItem}>
              <div className={styles.feeLabel}>Broker Commission</div>
              <div className={styles.feeInputGroup}>
                <input
                  type="number"
                  value={rules.commissionRate * 100}
                  onChange={(e) => handleRuleChange('commissionRate', parseFloat(e.target.value) / 100)}
                  className={styles.feeInput}
                  step="0.01"
                  min="0"
                  max="1"
                />
                <span className={styles.feeSuffix}>%</span>
              </div>
              <div className={styles.feeExample}>
                Example: ₹10,000 trade = ₹{(10000 * rules.commissionRate).toFixed(2)}
              </div>
            </div>
            
            <div className={styles.feeItem}>
              <div className={styles.feeLabel}>DP Charge (per script)</div>
              <div className={styles.feeInputGroup}>
                <span className={styles.feePrefix}>₹</span>
                <input
                  type="number"
                  value={rules.dpCharge}
                  onChange={(e) => handleRuleChange('dpCharge', parseInt(e.target.value))}
                  className={styles.feeInput}
                  min="0"
                  step="5"
                />
              </div>
            </div>
            
            <div className={styles.feeItem}>
              <div className={styles.feeLabel}>SEBON Fee</div>
              <div className={styles.feeInputGroup}>
                <input
                  type="number"
                  value={rules.sebonFee * 100}
                  onChange={(e) => handleRuleChange('sebonFee', parseFloat(e.target.value) / 100)}
                  className={styles.feeInput}
                  step="0.001"
                  min="0"
                  max="0.1"
                />
                <span className={styles.feeSuffix}>%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Advanced Settings */}
        <div className={styles.rulesSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>⚙️</span>
              Advanced Settings
            </h2>
            <span className={styles.sectionSubtitle}>Advanced trading configurations</span>
          </div>
          
          <div className={styles.advancedGrid}>
            <div className={styles.advancedItem}>
              <label className={styles.switchLabel}>
                <span className={styles.switchText}>Short Selling</span>
                <span className={styles.switchDescription}>Allow selling stocks not owned</span>
              </label>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={rules.shortSellingAllowed}
                  onChange={(e) => handleRuleChange('shortSellingAllowed', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            
            <div className={styles.advancedItem}>
              <label className={styles.switchLabel}>
                <span className={styles.switchText}>Margin Trading</span>
                <span className={styles.switchDescription}>Allow trading with borrowed funds</span>
              </label>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={rules.marginTradingAllowed}
                  onChange={(e) => handleRuleChange('marginTradingAllowed', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            
            <div className={styles.advancedItem}>
              <label className={styles.switchLabel}>
                <span className={styles.switchText}>Circuit Breaker</span>
                <span className={styles.switchDescription}>Pause trading during high volatility</span>
              </label>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={rules.volatilityCircuitBreaker}
                  onChange={(e) => handleRuleChange('volatilityCircuitBreaker', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            
            {rules.volatilityCircuitBreaker && (
              <>
                <div className={styles.advancedItem}>
                  <label className={styles.formLabel}>
                    Max Price Change (%)
                    <span className={styles.helperText}>Trigger circuit breaker if price changes exceed</span>
                  </label>
                  <div className={styles.inputGroup}>
                    <input
                      type="number"
                      value={rules.maxPriceChangePercent}
                      onChange={(e) => handleRuleChange('maxPriceChangePercent', parseInt(e.target.value))}
                      className={styles.formInput}
                      min="1"
                      max="20"
                    />
                    <span className={styles.inputSuffix}>%</span>
                  </div>
                </div>
                
                <div className={styles.advancedItem}>
                  <label className={styles.formLabel}>
                    Cool-off Period
                    <span className={styles.helperText}>Trading pause duration</span>
                  </label>
                  <div className={styles.inputGroup}>
                    <input
                      type="number"
                      value={rules.coolOffPeriod}
                      onChange={(e) => handleRuleChange('coolOffPeriod', parseInt(e.target.value))}
                      className={styles.formInput}
                      min="1"
                      max="60"
                    />
                    <span className={styles.inputSuffix}>minutes</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Summary Section */}
      <div className={styles.summarySection}>
        <h3 className={styles.summaryTitle}>
          <span className={styles.summaryIcon}>📋</span>
          Rules Summary
        </h3>
        
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>💰</div>
            <div className={styles.summaryContent}>
              <div className={styles.summaryLabel}>Daily Limit</div>
              <div className={styles.summaryValue}>{formatCurrency(rules.dailyTradeLimit)}</div>
            </div>
          </div>
          
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>⚠️</div>
            <div className={styles.summaryContent}>
              <div className={styles.summaryLabel}>Max Daily Loss</div>
              <div className={styles.summaryValue}>{rules.maxDailyLossPercent}%</div>
            </div>
          </div>
          
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>⏰</div>
            <div className={styles.summaryContent}>
              <div className={styles.summaryLabel}>Trading Hours</div>
              <div className={styles.summaryValue}>{rules.marketOpenTime} - {rules.marketCloseTime}</div>
            </div>
          </div>
          
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>🏦</div>
            <div className={styles.summaryContent}>
              <div className={styles.summaryLabel}>Banking Limit</div>
              <div className={styles.summaryValue}>{rules.sectorLimits.banking}%</div>
            </div>
          </div>
          
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>💸</div>
            <div className={styles.summaryContent}>
              <div className={styles.summaryLabel}>Commission</div>
              <div className={styles.summaryValue}>{(rules.commissionRate * 100).toFixed(2)}%</div>
            </div>
          </div>
          
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>⚡</div>
            <div className={styles.summaryContent}>
              <div className={styles.summaryLabel}>Circuit Breaker</div>
              <div className={styles.summaryValue}>
                {rules.volatilityCircuitBreaker ? 'Enabled' : 'Disabled'}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TradingRules;