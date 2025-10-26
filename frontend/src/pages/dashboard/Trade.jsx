import React, { useState } from 'react';
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import styles from './css/Trade.module.css';

const Trade = () => {
  const [activeTab, setActiveTab] = useState('buy');
  const [orderType, setOrderType] = useState('market');
  
  // Trade form state
  const [tradeData, setTradeData] = useState({
    symbol: '',
    quantity: '',
    price: '',
    orderType: 'market',
    duration: 'day'
  });

  // Mock market data
  const marketData = [
    { symbol: 'NTC', name: 'Nepal Telecom', price: 850, change: 2.5, changePercent: 0.30 },
    { symbol: 'NABIL', name: 'Nabil Bank', price: 1250, change: -15, changePercent: -1.18 },
    { symbol: 'SCB', name: 'Standard Chartered', price: 480, change: 8, changePercent: 1.69 },
    { symbol: 'NICA', name: 'NICA Bank', price: 1050, change: 25, changePercent: 2.44 },
    { symbol: 'NIB', name: 'Nepal Investment Bank', price: 680, change: -5, changePercent: -0.73 }
  ];

  const [portfolio, setPortfolio] = useState([
    { symbol: 'NTC', quantity: 50, avgPrice: 800, currentPrice: 850 },
    { symbol: 'SCB', quantity: 100, avgPrice: 480, currentPrice: 480 },
    { symbol: 'NICA', quantity: 30, avgPrice: 900, currentPrice: 1050 }
  ]);

  const handleInputChange = (field, value) => {
    setTradeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const executeTrade = () => {
    if (!tradeData.symbol || !tradeData.quantity) {
      alert('Please fill in all required fields');
      return;
    }

    const trade = {
      id: Date.now(),
      type: activeTab,
      symbol: tradeData.symbol,
      quantity: parseInt(tradeData.quantity),
      price: tradeData.price || marketData.find(stock => stock.symbol === tradeData.symbol)?.price,
      orderType: tradeData.orderType,
      timestamp: new Date().toLocaleString(),
      status: 'executed'
    };

    alert(`Trade executed successfully!\n${trade.type.toUpperCase()} ${trade.quantity} shares of ${trade.symbol} at Nrs. ${trade.price}`);
    
    // Reset form
    setTradeData({
      symbol: '',
      quantity: '',
      price: '',
      orderType: 'market',
      duration: 'day'
    });
  };

  const getChangeColor = (change) => {
    return change >= 0 ? styles.positive : styles.negative;
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? '📈' : '📉';
  };

  const calculateTotalValue = (quantity, price) => {
    return quantity * price;
  };

  const MarketOverview = () => (
    <div className={styles.marketOverview}>
      <h3>📊 Live Market</h3>
      <div className={styles.marketGrid}>
        {marketData.map((stock, index) => (
          <div key={stock.symbol} className={styles.stockCard}>
            <div className={styles.stockHeader}>
              <div className={styles.stockInfo}>
                <div className={styles.stockSymbol}>{stock.symbol}</div>
                <div className={styles.stockName}>{stock.name}</div>
              </div>
              <div className={`${styles.priceChange} ${getChangeColor(stock.change)}`}>
                {getChangeIcon(stock.change)} {stock.change >= 0 ? '+' : ''}{stock.change}
              </div>
            </div>
            <div className={styles.stockPrice}>
              Nrs. {stock.price.toLocaleString()}
            </div>
            <div className={`${styles.changePercent} ${getChangeColor(stock.change)}`}>
              ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TradeForm = () => (
    <div className={styles.tradeForm}>
      <div className={styles.formTabs}>
        <button
          onClick={() => setActiveTab('buy')}
          className={`${styles.tabButton} ${activeTab === 'buy' ? styles.tabActive : ''} ${styles.buyTab}`}
        >
          📈 Buy
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          className={`${styles.tabButton} ${activeTab === 'sell' ? styles.tabActive : ''} ${styles.sellTab}`}
        >
          📉 Sell
        </button>
      </div>

      <div className={styles.formContent}>
        <div className={styles.formGroup}>
          <label>Stock Symbol</label>
          <select 
            value={tradeData.symbol}
            onChange={(e) => handleInputChange('symbol', e.target.value)}
            className={styles.formInput}
          >
            <option value="">Select a stock</option>
            {marketData.map(stock => (
              <option key={stock.symbol} value={stock.symbol}>
                {stock.symbol} - {stock.name} (Nrs. {stock.price})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Quantity (Shares)</label>
          <input
            type="number"
            value={tradeData.quantity}
            onChange={(e) => handleInputChange('quantity', e.target.value)}
            placeholder="Enter quantity"
            className={styles.formInput}
            min="1"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Order Type</label>
          <select 
            value={tradeData.orderType}
            onChange={(e) => handleInputChange('orderType', e.target.value)}
            className={styles.formInput}
          >
            <option value="market">Market Order</option>
            <option value="limit">Limit Order</option>
            <option value="stop">Stop Loss</option>
          </select>
        </div>

        {tradeData.orderType !== 'market' && (
          <div className={styles.formGroup}>
            <label>
              {tradeData.orderType === 'limit' ? 'Limit Price' : 'Stop Price'} (Nrs)
            </label>
            <input
              type="number"
              value={tradeData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="Enter price"
              className={styles.formInput}
              min="0"
              step="0.01"
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label>Order Duration</label>
          <select 
            value={tradeData.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            className={styles.formInput}
          >
            <option value="day">Day Order</option>
            <option value="gtc">Good Till Cancel</option>
            <option value="ioc">Immediate or Cancel</option>
          </select>
        </div>

        {tradeData.symbol && tradeData.quantity && (
          <div className={styles.orderSummary}>
            <h4>Order Summary</h4>
            <div className={styles.summaryRow}>
              <span>Action:</span>
              <span className={activeTab === 'buy' ? styles.buyText : styles.sellText}>
                {activeTab.toUpperCase()}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span>Stock:</span>
              <span>{tradeData.symbol}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Quantity:</span>
              <span>{tradeData.quantity} shares</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Estimated Price:</span>
              <span>Nrs. {marketData.find(s => s.symbol === tradeData.symbol)?.price || 'N/A'}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Total Amount:</span>
              <span className={styles.totalAmount}>
                Nrs. {calculateTotalValue(
                  parseInt(tradeData.quantity) || 0, 
                  marketData.find(s => s.symbol === tradeData.symbol)?.price || 0
                ).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        <button 
          className={`${styles.executeButton} ${activeTab === 'buy' ? styles.buyButton : styles.sellButton}`}
          onClick={executeTrade}
        >
          {activeTab === 'buy' ? '🚀 Buy Shares' : '📉 Sell Shares'}
        </button>
      </div>
    </div>
  );

  const PortfolioOverview = () => (
    <div className={styles.portfolioOverview}>
      <h3>💼 Your Portfolio</h3>
      <div className={styles.portfolioGrid}>
        {portfolio.map((holding, index) => {
          const profitLoss = (holding.currentPrice - holding.avgPrice) * holding.quantity;
          const profitLossPercent = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
          
          return (
            <div key={holding.symbol} className={styles.holdingCard}>
              <div className={styles.holdingHeader}>
                <div className={styles.stockInfo}>
                  <div className={styles.stockSymbol}>{holding.symbol}</div>
                  <div className={styles.shares}>{holding.quantity} shares</div>
                </div>
                <div className={`${styles.plIndicator} ${profitLoss >= 0 ? styles.positive : styles.negative}`}>
                  {profitLoss >= 0 ? '📈' : '📉'} 
                  Nrs. {Math.abs(profitLoss).toLocaleString()}
                </div>
              </div>
              <div className={styles.holdingDetails}>
                <div className={styles.detailRow}>
                  <span>Avg Price:</span>
                  <span>Nrs. {holding.avgPrice}</span>
                </div>
                <div className={styles.detailRow}>
                  <span>Current:</span>
                  <span>Nrs. {holding.currentPrice}</span>
                </div>
                <div className={styles.detailRow}>
                  <span>P&L %:</span>
                  <span className={profitLoss >= 0 ? styles.positive : styles.negative}>
                    {profitLossPercent >= 0 ? '+' : ''}{profitLossPercent.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className={styles.holdingActions}>
                <button className={styles.quickBuy}>Quick Buy</button>
                <button className={styles.quickSell}>Quick Sell</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const RecentActivity = () => (
    <div className={styles.recentActivity}>
      <h3>🕒 Recent Trades</h3>
      <div className={styles.activityList}>
        <div className={styles.activityItem}>
          <div className={styles.activityType}>
            <span className={styles.buyBadge}>BUY</span>
          </div>
          <div className={styles.activityDetails}>
            <div className={styles.activityStock}>NTC</div>
            <div className={styles.activityInfo}>50 shares at Nrs. 800</div>
            <div className={styles.activityTime}>Today, 10:30 AM</div>
          </div>
          <div className={styles.activityStatus}>
            <span className={styles.completedStatus}>Completed</span>
          </div>
        </div>
        
        <div className={styles.activityItem}>
          <div className={styles.activityType}>
            <span className={styles.sellBadge}>SELL</span>
          </div>
          <div className={styles.activityDetails}>
            <div className={styles.activityStock}>NABIL</div>
            <div className={styles.activityInfo}>25 shares at Nrs. 1250</div>
            <div className={styles.activityTime}>Yesterday, 2:15 PM</div>
          </div>
          <div className={styles.activityStatus}>
            <span className={styles.completedStatus}>Completed</span>
          </div>
        </div>
        
        <div className={styles.activityItem}>
          <div className={styles.activityType}>
            <span className={styles.buyBadge}>BUY</span>
          </div>
          <div className={styles.activityDetails}>
            <div className={styles.activityStock}>SCB</div>
            <div className={styles.activityInfo}>100 shares at Nrs. 480</div>
            <div className={styles.activityTime}>Jan 20, 11:45 AM</div>
          </div>
          <div className={styles.activityStatus}>
            <span className={styles.completedStatus}>Completed</span>
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
        
        <main className={styles.tradeContainer}>
          {/* Header */}
          <div className={styles.header}>
            <h1>💹 Trade Stocks</h1>
            <p>Execute buy and sell orders in real-time</p>
          </div>

          {/* Main Content Grid */}
          <div className={styles.mainGrid}>
            {/* Left Column - Trade Form & Portfolio */}
            <div className={styles.leftColumn}>
              <TradeForm />
              <PortfolioOverview />
            </div>

            {/* Right Column - Market & Activity */}
            <div className={styles.rightColumn}>
              <MarketOverview />
              <RecentActivity />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Trade;