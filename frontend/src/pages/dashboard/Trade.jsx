// pages/dashboard/Trade.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import api from '../../services/api';
import { marketService } from '../../services/marketService';
import styles from './css/Trade.module.css';

// --- Sub-components moved outside to prevent focus loss during re-renders ---

const MarketOverview = ({ marketData, getChangeColor, getChangeIcon }) => (
  <div className={styles.marketOverview}>
    <h3>📊 Live Market</h3>
    {marketData.length === 0 ? (
      <div className={styles.loading}>Loading market data...</div>
    ) : (
      <div className={styles.marketGrid}>
        {marketData.slice(0, 5).map((stock) => (
          <div key={stock.symbol} className={styles.stockCard}>
            <div className={styles.stockHeader}>
              <div className={styles.stockInfo}>
                <div className={styles.stockSymbol}>{stock.symbol}</div>
                <div className={styles.stockName}>{stock.name}</div>
              </div>
              <div className={`${styles.priceChange} ${getChangeColor(stock.change)}`}>
                {getChangeIcon(stock.change)} {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
              </div>
            </div>
            <div className={styles.stockPrice}>
              Rs. {stock.price.toLocaleString()}
            </div>
            <div className={`${styles.changePercent} ${getChangeColor(stock.change)}`}>
              ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%)
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const TradeForm = ({ 
  activeTab, 
  setActiveTab, 
  userBalance, 
  tradeData, 
  handleInputChange, 
  marketData, 
  portfolio, 
  calculateTotalValue, 
  executeTrade, 
  loading, 
  error 
}) => {
  const selectedStock = marketData.find(s => s.symbol === tradeData.symbol);
  
  return (
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
        {/* Balance Display */}
        <div className={styles.balanceDisplay}>
          <span>Available Balance:</span>
          <span className={styles.balanceAmount}>Rs. {userBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        <div className={styles.formGroup}>
          <label>Stock Symbol</label>
          <select 
            value={tradeData.symbol}
            onChange={(e) => handleInputChange('symbol', e.target.value)}
            className={styles.formInput}
          >
            <option value="">Select a stock</option>
            {activeTab === 'sell' ? (
              // SELL: Show only owned stocks
              portfolio.length === 0 ? (
                <option value="" disabled>No stocks to sell</option>
              ) : (
                portfolio.map(holding => (
                  <option key={holding.symbol} value={holding.symbol}>
                    {holding.symbol} - {holding.name} (You own: {holding.quantity} shares)
                  </option>
                ))
              )
            ) : (
              // BUY: Show all market stocks
              marketData.map(stock => (
                <option key={stock.symbol} value={stock.symbol}>
                  {stock.symbol} - {stock.name} (Rs. {stock.price})
                </option>
              ))
            )}
          </select>
        </div>

        {/* Show owned quantity when selling */}
        {activeTab === 'sell' && tradeData.symbol && (
          <div className={styles.ownedQuantityInfo}>
            <span className={styles.infoIcon}>ℹ️</span>
            <span>You own <strong>{portfolio.find(h => h.symbol === tradeData.symbol)?.quantity || 0}</strong> shares of {tradeData.symbol}</span>
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="trade-quantity">Quantity (Shares)</label>
          <input
            id="trade-quantity"
            name="quantity"
            type="number"
            value={tradeData.quantity}
            onChange={(e) => handleInputChange('quantity', e.target.value)}
            placeholder="Enter quantity"
            className={styles.formInput}
            min="1"
          />
          {activeTab === 'buy' && selectedStock && (
            <div className={styles.maxQuantityInfo} style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: '#6b7280' }}>
              Max possible: {Math.floor(userBalance / selectedStock.price)} shares
            </div>
          )}
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
              {tradeData.orderType === 'limit' ? 'Limit Price' : 'Stop Price'} (Rs.)
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
              <span>Rs. {selectedStock?.price || 'N/A'}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Total Amount:</span>
              <span className={styles.totalAmount}>
                Rs. {calculateTotalValue(
                  parseInt(tradeData.quantity) || 0, 
                  selectedStock?.price || 0
                ).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        <button 
          className={`${styles.executeButton} ${activeTab === 'buy' ? styles.buyButton : styles.sellButton}`}
          onClick={executeTrade}
          disabled={loading}
        >
          {loading ? '⏳ Processing...' : (activeTab === 'buy' ? '🚀 Buy Shares' : '📉 Sell Shares')}
        </button>

        {error && (
          <div className={styles.errorMessage}>
            ❌ {error}
          </div>
        )}
      </div>
    </div>
  );
};

const PortfolioOverview = ({ portfolio, marketData }) => (
  <div className={styles.portfolioOverview}>
    <h3>💼 Your Portfolio</h3>
    {portfolio.length === 0 ? (
      <div className={styles.emptyPortfolio}>
        <p>No holdings yet. Start trading to build your portfolio!</p>
      </div>
    ) : (
      <div className={styles.portfolioGrid}>
        {portfolio.map((holding) => {
          const currentStock = marketData.find(s => s.symbol === holding.symbol);
          const currentPrice = currentStock?.price || holding.currentPrice || holding.averageBuyPrice;
          const profitLoss = (currentPrice - holding.averageBuyPrice) * holding.quantity;
          const profitLossPercent = ((currentPrice - holding.averageBuyPrice) / holding.averageBuyPrice) * 100;
          
          return (
            <div key={holding.symbol} className={styles.holdingCard}>
              <div className={styles.holdingHeader}>
                <div className={styles.stockInfo}>
                  <div className={styles.stockSymbol}>{holding.symbol}</div>
                  <div className={styles.shares}>{holding.quantity} shares</div>
                </div>
                <div className={`${styles.plIndicator} ${profitLoss >= 0 ? styles.positive : styles.negative}`}>
                  {profitLoss >= 0 ? '📈' : '📉'} 
                  Rs. {Math.abs(profitLoss).toLocaleString()}
                </div>
              </div>
              <div className={styles.holdingDetails}>
                <div className={styles.detailRow}>
                  <span>Avg Price:</span>
                  <span>Rs. {holding.averageBuyPrice}</span>
                </div>
                <div className={styles.detailRow}>
                  <span>Current:</span>
                  <span>Rs. {currentPrice}</span>
                </div>
                <div className={styles.detailRow}>
                  <span>P&L %:</span>
                  <span className={profitLoss >= 0 ? styles.positive : styles.negative}>
                    {profitLossPercent >= 0 ? '+' : ''}{profitLossPercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

const RecentActivity = ({ recentTrades }) => (
  <div className={styles.recentActivity}>
    <h3>🕒 Recent Trades</h3>
    {recentTrades.length === 0 ? (
      <div className={styles.emptyActivity}>
        <p>No recent trades</p>
      </div>
    ) : (
      <div className={styles.activityList}>
        {recentTrades.map((trade) => (
          <div key={trade._id} className={styles.activityItem}>
            <div className={styles.activityType}>
              <span className={trade.type === 'BUY' ? styles.buyBadge : styles.sellBadge}>
                {trade.type}
              </span>
            </div>
            <div className={styles.activityDetails}>
              <div className={styles.activityStock}>{trade.symbol}</div>
              <div className={styles.activityInfo}>
                {trade.quantity} shares at Rs. {trade.price}
              </div>
              <div className={styles.activityTime}>
                {new Date(trade.createdAt || trade.timestamp).toLocaleString()}
              </div>
            </div>
            <div className={styles.activityStatus}>
              <span className={styles.completedStatus}>Completed</span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// --- Main Trade Component ---

const Trade = () => {
  const [activeTab, setActiveTab] = useState('buy');
  
  // Trade form state
  const [tradeData, setTradeData] = useState({
    symbol: '',
    quantity: '',
    price: '',
    orderType: 'market',
    duration: 'day'
  });

  // State for data from backend
  const [marketData, setMarketData] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [recentTrades, setRecentTrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userBalance, setUserBalance] = useState(0);

  // Fetch market data from backend
  const fetchMarketData = useCallback(async () => {
    try {
      const response = await marketService.getAllStocks();
      if (response.success && Array.isArray(response.data)) {
        const formattedData = response.data.map(stock => ({
          symbol: stock.symbol,
          name: stock.name,
          price: stock.currentPrice,
          change: stock.currentPrice - (stock.previousClose || stock.currentPrice),
          changePercent: stock.previousClose 
            ? ((stock.currentPrice - stock.previousClose) / stock.previousClose * 100).toFixed(2)
            : 0
        }));
        setMarketData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      // setError('Failed to load market data');
    }
  }, []);

  // Fetch portfolio from backend
  const fetchPortfolio = useCallback(async () => {
    try {
      const response = await api.get('/trade/portfolio');
      if (response.data.success) {
        setPortfolio(response.data.data.holdings || []);
        setUserBalance(response.data.data.virtualBalance || 0);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  }, []);

  // Fetch transaction history
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await api.get('/trade/transactions');
      if (response.data.success) {
        setRecentTrades(response.data.data.slice(0, 5) || []); // Get last 5 trades
        if (response.data.virtualBalance !== undefined) {
          setUserBalance(response.data.virtualBalance);
        }
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, []);

  // Initial fetches
  useEffect(() => {
    fetchMarketData();
    fetchPortfolio();
    fetchTransactions();

    // Refresh market data every 2 minutes - only if enabled
    const isAutoRefreshEnabled = localStorage.getItem('autoRefresh') !== 'false';
    
    let interval;
    if (isAutoRefreshEnabled) {
      interval = setInterval(fetchMarketData, 120000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchMarketData, fetchPortfolio, fetchTransactions]);

  const handleInputChange = (field, value) => {
    // If quantity, only allow positive integers
    if (field === 'quantity') {
      if (value === '') {
        setTradeData(prev => ({ ...prev, [field]: '' }));
        return;
      }
      const num = parseInt(value);
      if (isNaN(num)) return;
      setTradeData(prev => ({ ...prev, [field]: num.toString() }));
    } else {
      setTradeData(prev => ({ ...prev, [field]: value }));
    }
  };

  const executeTrade = async () => {
    if (!tradeData.symbol || !tradeData.quantity) {
      alert('Please fill in all required fields');
      return;
    }

    const payloadQuantity = parseInt(tradeData.quantity);
    if (isNaN(payloadQuantity) || payloadQuantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = activeTab === 'buy' ? '/trade/buy' : '/trade/sell';
      const selectedStock = marketData.find(s => s.symbol === tradeData.symbol);
      
      const tradePayload = {
        symbol: tradeData.symbol,
        quantity: payloadQuantity,
        price: tradeData.orderType === 'market' 
          ? selectedStock?.price 
          : parseFloat(tradeData.price),
        orderType: tradeData.orderType
      };

      console.log(`Executing ${activeTab.toUpperCase()} trade:`, tradePayload);

      const response = await api.post(endpoint, tradePayload);
      
      if (response.data.success) {
        alert(`✅ ${response.data.message || 'Trade executed successfully!'}`);
        
        // Reset form
        setTradeData({
          symbol: '',
          quantity: '',
          price: '',
          orderType: 'market',
          duration: 'day'
        });

        // Refresh data
        await Promise.all([
          fetchPortfolio(),
          fetchTransactions()
        ]);
      }
    } catch (error) {
      console.error('Trade execution error:', error);
      const errorMessage = error.response?.data?.message || 'Trade execution failed';
      alert(`❌ Error: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      
      <div className={styles.dashboardMain}>
        <Header />
        
        <main className={styles.tradeContainer}>
          <div className={styles.header}>
            <h1>💹 Trade Stocks</h1>
            <p>Execute buy and sell orders in real-time (Market updates every 2 mins)</p>
          </div>

          <div className={styles.mainGrid}>
            <div className={styles.leftColumn}>
              <TradeForm 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                userBalance={userBalance}
                tradeData={tradeData}
                handleInputChange={handleInputChange}
                marketData={marketData}
                portfolio={portfolio}
                calculateTotalValue={calculateTotalValue}
                executeTrade={executeTrade}
                loading={loading}
                error={error}
              />
              <PortfolioOverview 
                portfolio={portfolio}
                marketData={marketData}
              />
            </div>

            <div className={styles.rightColumn}>
              <MarketOverview 
                marketData={marketData}
                getChangeColor={getChangeColor}
                getChangeIcon={getChangeIcon}
              />
              <RecentActivity 
                recentTrades={recentTrades}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Trade;
