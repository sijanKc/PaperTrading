import React, { useState, useEffect } from 'react';
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import api from '../../services/api';
import { marketService } from '../../services/marketService';
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

  // State for data from backend
  const [marketData, setMarketData] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [recentTrades, setRecentTrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userBalance, setUserBalance] = useState(0);

  // Fetch market data from backend
  useEffect(() => {
    const fetchMarketData = async () => {
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
        setError('Failed to load market data');
      }
    };

    fetchMarketData();
    // Refresh market data every 30 seconds
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch portfolio from backend
  const fetchPortfolio = async () => {
    try {
      const response = await api.get('/trade/portfolio');
      if (response.data.success) {
        setPortfolio(response.data.data.holdings || []);
        setUserBalance(response.data.data.virtualBalance || 0);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  // Fetch transaction history
  const fetchTransactions = async () => {
    try {
      const response = await api.get('/trade/transactions');
      if (response.data.success) {
        setRecentTrades(response.data.data.slice(0, 5) || []); // Get last 5 trades
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // Fetch portfolio and transactions on mount
  useEffect(() => {
    fetchPortfolio();
    fetchTransactions();
  }, []);

  const handleInputChange = (field, value) => {
    setTradeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const executeTrade = async () => {
    if (!tradeData.symbol || !tradeData.quantity) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = activeTab === 'buy' ? '/trade/buy' : '/trade/sell';
      const selectedStock = marketData.find(s => s.symbol === tradeData.symbol);
      
      const tradePayload = {
        symbol: tradeData.symbol,
        quantity: parseInt(tradeData.quantity),
        price: tradeData.orderType === 'market' 
          ? selectedStock?.price 
          : parseFloat(tradeData.price),
        orderType: tradeData.orderType
      };

      const response = await api.post(endpoint, tradePayload);
      
      if (response.data.success) {
        alert(`✅ Trade executed successfully!\n${activeTab.toUpperCase()} ${tradeData.quantity} shares of ${tradeData.symbol} at NPR ${tradePayload.price}`);
        
        // Reset form
        setTradeData({
          symbol: '',
          quantity: '',
          price: '',
          orderType: 'market',
          duration: 'day'
        });

        // Refresh portfolio and transactions
        await fetchPortfolio();
        await fetchTransactions();
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

  const MarketOverview = () => (
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
                NPR {stock.price.toLocaleString()}
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
        {/* Balance Display */}
        <div className={styles.balanceDisplay}>
          <span>Available Balance:</span>
          <span className={styles.balanceAmount}>NPR {userBalance.toLocaleString()}</span>
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
                portfolio.map(holding => {
                  const currentStock = marketData.find(s => s.symbol === holding.symbol);
                  return (
                    <option key={holding.symbol} value={holding.symbol}>
                      {holding.symbol} - {holding.name || currentStock?.name || ''} (You own: {holding.quantity} shares)
                    </option>
                  );
                })
              )
            ) : (
              // BUY: Show all market stocks
              marketData.map(stock => (
                <option key={stock.symbol} value={stock.symbol}>
                  {stock.symbol} - {stock.name} (NPR {stock.price})
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
              {tradeData.orderType === 'limit' ? 'Limit Price' : 'Stop Price'} (NPR)
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
              <span>NPR {marketData.find(s => s.symbol === tradeData.symbol)?.price || 'N/A'}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Total Amount:</span>
              <span className={styles.totalAmount}>
                NPR {calculateTotalValue(
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

  const PortfolioOverview = () => (
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
            const currentPrice = currentStock?.price || holding.averagePrice;
            const profitLoss = (currentPrice - holding.averagePrice) * holding.quantity;
            const profitLossPercent = ((currentPrice - holding.averagePrice) / holding.averagePrice) * 100;
            
            return (
              <div key={holding.symbol} className={styles.holdingCard}>
                <div className={styles.holdingHeader}>
                  <div className={styles.stockInfo}>
                    <div className={styles.stockSymbol}>{holding.symbol}</div>
                    <div className={styles.shares}>{holding.quantity} shares</div>
                  </div>
                  <div className={`${styles.plIndicator} ${profitLoss >= 0 ? styles.positive : styles.negative}`}>
                    {profitLoss >= 0 ? '📈' : '📉'} 
                    NPR {Math.abs(profitLoss).toLocaleString()}
                  </div>
                </div>
                <div className={styles.holdingDetails}>
                  <div className={styles.detailRow}>
                    <span>Avg Price:</span>
                    <span>NPR {holding.averagePrice}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Current:</span>
                    <span>NPR {currentPrice}</span>
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

  const RecentActivity = () => (
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
                  {trade.quantity} shares at NPR {trade.price}
                </div>
                <div className={styles.activityTime}>
                  {new Date(trade.createdAt).toLocaleString()}
                </div>
              </div>
              <div className={styles.activityStatus}>
                <span className={styles.completedStatus}>{trade.status || 'Completed'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
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