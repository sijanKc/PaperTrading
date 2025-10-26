import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Form, 
  InputGroup, 
  Dropdown, 
  Modal, 
  Alert,
  Badge,
  ProgressBar,
  ListGroup
} from 'react-bootstrap';
import styles from '../css/TradeShortcut.module.css';

const TradeShortcut = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeType, setTradeType] = useState('buy'); // 'buy' or 'sell'
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [orderType, setOrderType] = useState('market'); // 'market' or 'limit'
  const [limitPrice, setLimitPrice] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [availableCash, setAvailableCash] = useState(250000);
  const [recentTrades, setRecentTrades] = useState([]);
  const [quickStocks, setQuickStocks] = useState([]);
  const [theme, setTheme] = useState('dark');

  // Sidebar state detection
  useEffect(() => {
    const checkSidebarState = () => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        const isCollapsed = sidebar.classList.contains('sidebar-collapsed');
        setSidebarCollapsed(isCollapsed);
      }
    };

    checkSidebarState();
    const interval = setInterval(checkSidebarState, 50);
    return () => clearInterval(interval);
  }, []);

  // Theme detection
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  // Sample NEPSE stocks for quick trading
  const nepseStocks = [
    {
      symbol: 'NLIC',
      name: 'Nepal Life Insurance',
      currentPrice: 765.00,
      change: 12.50,
      changePercent: 1.66,
      sector: 'Insurance',
      volume: 15420,
      dayHigh: 772.00,
      dayLow: 758.00
    },
    {
      symbol: 'NIBL',
      name: 'Nepal Investment Bank',
      currentPrice: 452.75,
      change: -5.25,
      changePercent: -1.15,
      sector: 'Commercial Banks',
      volume: 8925,
      dayHigh: 460.00,
      dayLow: 448.00
    },
    {
      symbol: 'NTC',
      name: 'Nepal Telecom',
      currentPrice: 835.25,
      change: 15.50,
      changePercent: 1.89,
      sector: 'Telecommunication',
      volume: 23456,
      dayHigh: 842.00,
      dayLow: 825.00
    },
    {
      symbol: 'SHL',
      name: 'Soaltee Hotel',
      currentPrice: 312.00,
      change: -8.00,
      changePercent: -2.50,
      sector: 'Hotels',
      volume: 4567,
      dayHigh: 318.00,
      dayLow: 308.00
    },
    {
      symbol: 'HIDCL',
      name: 'Hydropower Investment',
      currentPrice: 285.50,
      change: -3.25,
      changePercent: -1.13,
      sector: 'Hydroelectricity',
      volume: 12345,
      dayHigh: 290.00,
      dayLow: 282.00
    }
  ];

  // Sample recent trades
  const sampleRecentTrades = [
    { id: 1, symbol: 'NLIC', type: 'buy', quantity: 10, price: 760.00, time: '2 mins ago', status: 'executed' },
    { id: 2, symbol: 'NTC', type: 'sell', quantity: 5, price: 830.00, time: '15 mins ago', status: 'executed' },
    { id: 3, symbol: 'NIBL', type: 'buy', quantity: 20, price: 450.00, time: '1 hour ago', status: 'executed' }
  ];

  useEffect(() => {
    // Set initial data
    setQuickStocks(nepseStocks.slice(0, 4));
    setRecentTrades(sampleRecentTrades);
    
    // Set default selected stock
    if (!selectedStock) {
      setSelectedStock(nepseStocks[0]);
    }
  }, []);

  // Calculate total amount when quantity or price changes
  useEffect(() => {
    if (selectedStock && quantity) {
      const price = orderType === 'market' ? selectedStock.currentPrice : parseFloat(limitPrice) || selectedStock.currentPrice;
      const total = parseFloat(quantity) * price;
      setTotalAmount(total);
    } else {
      setTotalAmount(0);
    }
  }, [quantity, selectedStock, orderType, limitPrice]);

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
    if (orderType === 'market') {
      setLimitPrice('');
    } else {
      setLimitPrice(stock.currentPrice.toFixed(2));
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) > 0)) {
      setQuantity(value);
    }
  };

  const handleQuickQuantity = (qty) => {
    setQuantity(qty.toString());
  };

  const calculateMaxShares = () => {
    if (!selectedStock) return 0;
    const price = orderType === 'market' ? selectedStock.currentPrice : parseFloat(limitPrice) || selectedStock.currentPrice;
    return Math.floor(availableCash / price);
  };

  const handleTrade = () => {
    if (!selectedStock || !quantity || parseInt(quantity) <= 0) {
      alert('Please select a stock and enter valid quantity');
      return;
    }

    if (tradeType === 'buy' && totalAmount > availableCash) {
      alert('Insufficient funds for this trade');
      return;
    }

    // Simulate trade execution
    const newTrade = {
      id: Date.now(),
      symbol: selectedStock.symbol,
      type: tradeType,
      quantity: parseInt(quantity),
      price: orderType === 'market' ? selectedStock.currentPrice : parseFloat(limitPrice),
      time: 'Just now',
      status: 'executed'
    };

    setRecentTrades(prev => [newTrade, ...prev.slice(0, 4)]);
    
    // Update available cash
    if (tradeType === 'buy') {
      setAvailableCash(prev => prev - totalAmount);
    } else {
      setAvailableCash(prev => prev + totalAmount);
    }

    // Show success message
    alert(`Trade ${tradeType === 'buy' ? 'purchase' : 'sale'} executed successfully!`);
    
    // Reset form
    setQuantity('');
    setShowTradeModal(false);
  };

  const getSectorColor = (sector) => {
    const colors = {
      'Commercial Banks': '#3b82f6',
      'Insurance': '#10b981',
      'Hydroelectricity': '#06b6d4',
      'Telecommunication': '#f59e0b',
      'Hotels': '#ef4444'
    };
    return colors[sector] || '#6b7280';
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'success' : 'danger';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? '↗' : '↘';
  };

  const QuickActionButton = ({ stock, action }) => (
    <Button
      variant={action === 'buy' ? 'success' : 'danger'}
      size="sm"
      className={styles.quickActionBtn}
      onClick={() => {
        setTradeType(action);
        setSelectedStock(stock);
        setShowTradeModal(true);
      }}
    >
      {action === 'buy' ? '📈 Buy' : '📉 Sell'}
    </Button>
  );

  return (
    <div className={`${styles.tradeShortcutWrapper} ${sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarOpen} ${theme === 'dark' ? styles.darkTheme : ''}`}>
      <Card className={styles.tradeShortcutCard}>
        <Card.Header className={styles.tradeHeader}>
          <div className={styles.headerContent}>
            <h5 className={styles.cardTitle}>⚡ Quick Trade</h5>
            <Badge bg="primary" className={styles.liveBadge}>
              LIVE
            </Badge>
          </div>
          <div className={styles.cashBalance}>
            <small>Available: <strong>रु {availableCash.toLocaleString('en-NP')}</strong></small>
          </div>
        </Card.Header>

        <Card.Body>
          {/* Quick Actions */}
          <div className={styles.quickActionsSection}>
            <h6 className={styles.sectionTitle}>Fast Trade</h6>
            <div className={styles.actionButtons}>
              <Button
                variant="success"
                className={`${styles.actionBtn} ${styles.buyBtn}`}
                onClick={() => {
                  setTradeType('buy');
                  setShowTradeModal(true);
                }}
              >
                <span className={styles.btnIcon}>📈</span>
                <span className={styles.btnText}>Quick Buy</span>
              </Button>
              <Button
                variant="danger"
                className={`${styles.actionBtn} ${styles.sellBtn}`}
                onClick={() => {
                  setTradeType('sell');
                  setShowTradeModal(true);
                }}
              >
                <span className={styles.btnIcon}>📉</span>
                <span className={styles.btnText}>Quick Sell</span>
              </Button>
            </div>
          </div>

          {/* Popular Stocks */}
          <div className={styles.popularStocksSection}>
            <h6 className={styles.sectionTitle}>Popular Stocks</h6>
            <div className={styles.stocksGrid}>
              {quickStocks.map((stock) => (
                <div key={stock.symbol} className={styles.stockCard}>
                  <div className={styles.stockHeader}>
                    <div className={styles.stockInfo}>
                      <strong className={styles.stockSymbol}>{stock.symbol}</strong>
                      <Badge 
                        className={styles.sectorBadge}
                        style={{ 
                          backgroundColor: getSectorColor(stock.sector) + '20',
                          color: getSectorColor(stock.sector)
                        }}
                      >
                        {stock.sector}
                      </Badge>
                    </div>
                    <div className={`${styles.priceChange} ${stock.change >= 0 ? styles.priceChangeSuccess : styles.priceChangeDanger}`}>
                      <span className={styles.changeIcon}>{getChangeIcon(stock.change)}</span>
                      <span className={styles.changePercent}>
                        {stock.change >= 0 ? '+' : ''}{stock.changePercent}%
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.stockPrice}>
                    रु {stock.currentPrice.toFixed(2)}
                  </div>
                  
                  <div className={styles.stockActions}>
                    <QuickActionButton stock={stock} action="buy" />
                    <QuickActionButton stock={stock} action="sell" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Trades */}
          <div className={styles.recentTradesSection}>
            <h6 className={styles.sectionTitle}>Recent Trades</h6>
            <ListGroup variant="flush" className={styles.tradesList}>
              {recentTrades.map((trade) => (
                <ListGroup.Item key={trade.id} className={styles.tradeItem}>
                  <div className={styles.tradeInfo}>
                    <div className={styles.tradeSymbol}>
                      <span className={`${styles.tradeType} ${trade.type === 'buy' ? styles.tradeTypeBuy : styles.tradeTypeSell}`}>
                        {trade.type === 'buy' ? '📈' : '📉'}
                      </span>
                      <strong>{trade.symbol}</strong>
                    </div>
                    <div className={styles.tradeDetails}>
                      <span className={styles.quantity}>{trade.quantity} shares</span>
                      <span className={styles.price}>रु {trade.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className={styles.tradeMeta}>
                    <Badge bg="success" className={styles.statusBadge}>
                      {trade.status}
                    </Badge>
                    <small className={styles.tradeTime}>{trade.time}</small>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>

          {/* Market Overview */}
          <div className={styles.marketOverview}>
            <h6 className={styles.sectionTitle}>Market Pulse</h6>
            <div className={styles.marketStats}>
              <div className={styles.marketStat}>
                <span className={styles.statLabel}>NEPSE Index</span>
                <span className={styles.statValue}>2,150.45</span>
                <span className={`${styles.statChange} ${styles.statChangePositive}`}>+12.34 (0.58%)</span>
              </div>
              <div className={styles.marketStat}>
                <span className={styles.statLabel}>Sensitive Index</span>
                <span className={styles.statValue}>408.12</span>
                <span className={`${styles.statChange} ${styles.statChangePositive}`}>+2.15 (0.53%)</span>
              </div>
            </div>
          </div>
        </Card.Body>

        <Card.Footer className={styles.tradeFooter}>
          <small className="text-muted">
            Paper Trading • Prices update every 5 seconds
          </small>
        </Card.Footer>
      </Card>

      {/* Trade Modal */}
      <Modal 
        show={showTradeModal} 
        onHide={() => setShowTradeModal(false)}
        centered
        className={styles.tradeModal}
      >
        <Modal.Header closeButton className={styles.tradeModalHeader}>
          <Modal.Title>
            <span className={`${styles.tradeTypeIcon} ${tradeType === 'buy' ? styles.tradeTypeIconBuy : styles.tradeTypeIconSell}`}>
              {tradeType === 'buy' ? '📈' : '📉'}
            </span>
            {tradeType === 'buy' ? 'Buy Stock' : 'Sell Stock'}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className={styles.tradeModalBody}>
          {selectedStock && (
            <div className={styles.selectedStockInfo}>
              <div className={styles.stockDisplay}>
                <div className={styles.stockMain}>
                  <strong className={styles.stockSymbol}>{selectedStock.symbol}</strong>
                  <span className={styles.stockName}>{selectedStock.name}</span>
                </div>
                <div className={styles.stockPrice}>
                  <div className={styles.currentPrice}>रु {selectedStock.currentPrice.toFixed(2)}</div>
                  <div className={`${styles.priceChange} ${selectedStock.change >= 0 ? styles.priceChangeSuccess : styles.priceChangeDanger}`}>
                    {getChangeIcon(selectedStock.change)} {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change} 
                    ({selectedStock.change >= 0 ? '+' : ''}{selectedStock.changePercent}%)
                  </div>
                </div>
              </div>
            </div>
          )}

          <Form className={styles.tradeForm}>
            {/* Order Type Selection */}
            <Form.Group className="mb-3">
              <Form.Label>Order Type</Form.Label>
              <div className={styles.orderTypeButtons}>
                <Button
                  variant={orderType === 'market' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setOrderType('market')}
                  className={styles.orderTypeBtn}
                >
                  Market Order
                </Button>
                <Button
                  variant={orderType === 'limit' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setOrderType('limit')}
                  className={styles.orderTypeBtn}
                >
                  Limit Order
                </Button>
              </div>
            </Form.Group>

            {/* Limit Price Input */}
            {orderType === 'limit' && (
              <Form.Group className="mb-3">
                <Form.Label>Limit Price (रु)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  placeholder="Enter limit price"
                />
              </Form.Group>
            )}

            {/* Quantity Input */}
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                placeholder="Enter quantity"
                min="1"
              />
              
              {/* Quick Quantity Buttons */}
              <div className={styles.quickQuantityButtons}>
                {[10, 50, 100].map((qty) => (
                  <Button
                    key={qty}
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleQuickQuantity(qty)}
                    className={styles.quantityBtn}
                  >
                    {qty}
                  </Button>
                ))}
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={() => handleQuickQuantity(calculateMaxShares())}
                  className={styles.quantityBtn}
                >
                  Max
                </Button>
              </div>
            </Form.Group>

            {/* Trade Summary */}
            {quantity && selectedStock && (
              <div className={styles.tradeSummary}>
                <div className={styles.summaryRow}>
                  <span>Price:</span>
                  <span>रु {orderType === 'market' ? selectedStock.currentPrice.toFixed(2) : limitPrice}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Quantity:</span>
                  <span>{quantity} shares</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.summaryRowTotal}`}>
                  <span>Total Amount:</span>
                  <span>रु {totalAmount.toLocaleString('en-NP', { minimumFractionDigits: 2 })}</span>
                </div>
                
                {tradeType === 'buy' && (
                  <div className={styles.fundsCheck}>
                    {totalAmount <= availableCash ? (
                      <Alert variant="success" className="mb-0">
                        ✅ Sufficient funds available
                      </Alert>
                    ) : (
                      <Alert variant="danger" className="mb-0">
                        ❌ Insufficient funds. Need रु {(totalAmount - availableCash).toLocaleString('en-NP')} more
                      </Alert>
                    )}
                  </div>
                )}
              </div>
            )}
          </Form>
        </Modal.Body>
        
        <Modal.Footer className={styles.tradeModalFooter}>
          <Button 
            variant="secondary" 
            onClick={() => setShowTradeModal(false)}
          >
            Cancel
          </Button>
          <Button 
            variant={tradeType === 'buy' ? 'success' : 'danger'}
            onClick={handleTrade}
            disabled={!quantity || parseInt(quantity) <= 0 || (tradeType === 'buy' && totalAmount > availableCash)}
            className={styles.executeBtn}
          >
            {tradeType === 'buy' ? '📈 Execute Buy' : '📉 Execute Sell'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TradeShortcut;