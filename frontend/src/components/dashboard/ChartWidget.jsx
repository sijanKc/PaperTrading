import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  Dropdown, 
  Button, 
  ButtonGroup,
  Badge,
  Spinner,
  Alert,
  ProgressBar
} from 'react-bootstrap';
import { marketService } from '../../services/marketService';
import styles from '../css/ChartWidget.module.css';

const ChartWidget = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chartType, setChartType] = useState('line');
  const [timeframe, setTimeframe] = useState('1D');
  const [selectedStock, setSelectedStock] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stocksLoading, setStocksLoading] = useState(true);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const canvasRef = useRef(null);

  // Fetch stocks from backend
  const fetchStocks = async () => {
    try {
      setStocksLoading(true);
      const response = await marketService.getAllStocks();
      
      if (response.success && Array.isArray(response.data)) {
        const dynamicStocks = response.data.map(stock => ({
          symbol: stock.symbol,
          name: stock.name,
          color: generateColorForStock(stock.symbol),
          currentPrice: stock.currentPrice,
          sector: stock.sector,
          volatility: stock.volatility
        }));
        
        setStocks(dynamicStocks);
        
        // Auto-select first stock
        if (dynamicStocks.length > 0 && !selectedStock) {
          setSelectedStock(dynamicStocks[0].symbol);
        }
      } else {
        throw new Error('Invalid stocks data from backend');
      }
    } catch (error) {
      console.error('Error fetching stocks:', error);
      setError('Failed to load stocks. Using fallback data.');
      setStocks(getFallbackStocks());
    } finally {
      setStocksLoading(false);
    }
  };

  // Fetch chart data from backend
  const fetchChartData = async () => {
    if (!selectedStock) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await marketService.getChartData(selectedStock, timeframe);
      
      if (response.success && Array.isArray(response.data)) {
        setChartData(response.data);
        setLastUpdated(new Date());
      } else {
        throw new Error('Invalid chart data received');
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setError('Failed to load chart data. Using simulated data.');
      // Generate fallback data based on current stock
      const currentStock = stocks.find(s => s.symbol === selectedStock);
      if (currentStock) {
        const fallbackData = generateFallbackChartData(timeframe, currentStock);
        setChartData(fallbackData);
      }
    } finally {
      setLoading(false);
    }
  };

  // Generate dynamic color for stocks
  const generateColorForStock = (symbol) => {
    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
      '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#a855f7'
    ];
    
    const hash = symbol.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Fallback stocks if backend fails
  const getFallbackStocks = () => {
    return [
      { symbol: 'NEPSE', name: 'NEPSE Index', color: '#3b82f6', currentPrice: 2100, sector: 'Index' },
      { symbol: 'NABIL', name: 'Nabil Bank', color: '#10b981', currentPrice: 845, sector: 'Commercial Banks' },
      { symbol: 'SCB', name: 'Standard Chartered', color: '#f59e0b', currentPrice: 382, sector: 'Commercial Banks' }
    ];
  };

  // Fallback chart data generator
  const generateFallbackChartData = (timeframe, stock) => {
    const data = [];
    const now = new Date();
    
    let points = 78;
    let timeMultiplier = 1;
    const basePrice = stock.currentPrice || 1000;
    const volatility = stock.volatility || 0.02;

    switch (timeframe) {
      case '1D': points = 78; timeMultiplier = 1; break;
      case '1W': points = 35; timeMultiplier = 7; break;
      case '1M': points = 30; timeMultiplier = 30; break;
      case '3M': points = 90; timeMultiplier = 90; break;
      case '1Y': points = 52; timeMultiplier = 365; break;
    }

    let currentPrice = basePrice;

    for (let i = points - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * (timeMultiplier * 60 * 60 * 1000) / points);
      
      const open = currentPrice;
      const change = (Math.random() - 0.5) * 2 * volatility * currentPrice;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * volatility * currentPrice;
      const low = Math.min(open, close) - Math.random() * volatility * currentPrice;

      currentPrice = close;

      const volume = Math.floor(Math.random() * 1000000) + 100000;

      data.push({
        time: time.getTime(),
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: volume
      });
    }

    return data;
  };

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

  // Fetch stocks on component mount
  useEffect(() => {
    fetchStocks();
  }, []);

  // Fetch chart data when timeframe or stock changes
  useEffect(() => {
    if (selectedStock && stocks.length > 0) {
      fetchChartData();
    }
  }, [timeframe, selectedStock, stocks]);

  // Auto-refresh chart data
  useEffect(() => {
    const interval = setInterval(fetchChartData, 120000); // Refresh every 2 minutes
    return () => clearInterval(interval);
  }, [selectedStock, timeframe]);

  // Draw chart functions (keep your existing drawing code)
  const drawLineChart = (ctx, data, width, height, type = 'line') => {
    if (data.length === 0) return;

    const padding = { top: 20, right: 40, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Find min and max values
    const values = data.map(d => type === 'area' ? [d.low, d.high] : [d.close]);
    const min = Math.min(...values.flat());
    const max = Math.max(...values.flat());
    const range = max - min;

    // Draw chart area background
    ctx.fillStyle = theme === 'dark' ? '#1e293b' : '#f8fafc';
    ctx.fillRect(padding.left, padding.top, chartWidth, chartHeight);

    // Draw grid lines
    ctx.strokeStyle = theme === 'dark' ? '#334155' : '#e2e8f0';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();
    }

    // Draw the line or area
    ctx.beginPath();
    const isArea = type === 'area';
    const getY = (value) => padding.top + chartHeight - ((value - min) / range) * chartHeight;

    if (isArea) {
      ctx.moveTo(padding.left, padding.top + chartHeight);
    }

    data.forEach((point, index) => {
      const x = padding.left + (index / (data.length - 1)) * chartWidth;
      const y = getY(isArea ? point.close : point.close);

      if (index === 0) {
        if (!isArea) ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    if (isArea) {
      ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
      ctx.closePath();
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.fill();
      ctx.strokeStyle = '#3b82f6';
    } else {
      ctx.strokeStyle = '#3b82f6';
    }

    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw current price indicator
    const lastPoint = data[data.length - 1];
    const lastX = padding.left + chartWidth;
    const lastY = getY(lastPoint.close);
    
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(lastX, lastY, 4, 0, 2 * Math.PI);
    ctx.fill();

    // Draw price labels
    ctx.fillStyle = theme === 'dark' ? '#cbd5e1' : '#64748b';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`रु ${lastPoint.close.toFixed(2)}`, padding.left - 10, getY(lastPoint.close));

    // Draw timeframe labels
    ctx.textAlign = 'center';
    ctx.fillStyle = theme === 'dark' ? '#94a3b8' : '#94a3b8';
    ctx.font = '11px Arial';
    
    const timeLabels = getTimeLabels(timeframe, data);
    timeLabels.forEach(label => {
      const x = padding.left + (label.index / (data.length - 1)) * chartWidth;
      ctx.fillText(label.text, x, height - 20);
    });

    // Draw Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = min + (i / 5) * range;
      const y = padding.top + (i / 5) * chartHeight;
      ctx.fillText(`रु ${value.toFixed(0)}`, padding.left - 10, y + 4);
    }
  };

  const drawCandlestickChart = (ctx, data, width, height) => {
    if (data.length === 0) return;

    const padding = { top: 20, right: 40, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Find min and max values
    const lows = data.map(d => d.low);
    const highs = data.map(d => d.high);
    const min = Math.min(...lows);
    const max = Math.max(...highs);
    const range = max - min;

    // Draw chart area background
    ctx.fillStyle = theme === 'dark' ? '#1e293b' : '#f8fafc';
    ctx.fillRect(padding.left, padding.top, chartWidth, chartHeight);

    // Draw grid lines
    ctx.strokeStyle = theme === 'dark' ? '#334155' : '#e2e8f0';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();
    }

    // Draw candlesticks
    const candleWidth = (chartWidth / data.length) * 0.7;
    
    data.forEach((point, index) => {
      const x = padding.left + (index / data.length) * chartWidth + (chartWidth / data.length) * 0.15;
      const isBullish = point.close >= point.open;
      
      const openY = padding.top + chartHeight - ((point.open - min) / range) * chartHeight;
      const closeY = padding.top + chartHeight - ((point.close - min) / range) * chartHeight;
      const highY = padding.top + chartHeight - ((point.high - min) / range) * chartHeight;
      const lowY = padding.top + chartHeight - ((point.low - min) / range) * chartHeight;

      // Draw wick
      ctx.strokeStyle = isBullish ? '#10b981' : '#ef4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, highY);
      ctx.lineTo(x + candleWidth / 2, lowY);
      ctx.stroke();

      // Draw candle body
      ctx.fillStyle = isBullish ? '#10b981' : '#ef4444';
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.abs(closeY - openY);
      ctx.fillRect(x, bodyTop, candleWidth, Math.max(bodyHeight, 1));
    });

    // Draw current price
    const lastPoint = data[data.length - 1];
    ctx.fillStyle = theme === 'dark' ? '#cbd5e1' : '#64748b';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    const lastY = padding.top + chartHeight - ((lastPoint.close - min) / range) * chartHeight;
    ctx.fillText(`रु ${lastPoint.close.toFixed(2)}`, padding.left - 10, lastY);

    // Draw timeframe labels
    ctx.textAlign = 'center';
    ctx.fillStyle = theme === 'dark' ? '#94a3b8' : '#94a3b8';
    ctx.font = '11px Arial';
    
    const timeLabels = getTimeLabels(timeframe, data);
    timeLabels.forEach(label => {
      const x = padding.left + (label.index / (data.length - 1)) * chartWidth;
      ctx.fillText(label.text, x, height - 20);
    });

    // Draw Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = min + (i / 5) * range;
      const y = padding.top + (i / 5) * chartHeight;
      ctx.fillText(`रु ${value.toFixed(0)}`, padding.left - 10, y + 4);
    }
  };

  const drawVolumeBars = (ctx, data, width, height) => {
    if (data.length === 0) return;

    const volumeHeight = 40;
    const padding = { left: 60, right: 40 };
    const chartWidth = width - padding.left - padding.right;
    
    const volumes = data.map(d => d.volume);
    const maxVolume = Math.max(...volumes);

    data.forEach((point, index) => {
      const x = padding.left + (index / data.length) * chartWidth + (chartWidth / data.length) * 0.15;
      const barWidth = (chartWidth / data.length) * 0.7;
      const barHeight = (point.volume / maxVolume) * volumeHeight;
      
      ctx.fillStyle = point.close >= point.open ? 
        'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)';
      ctx.fillRect(x, height - volumeHeight, barWidth, barHeight);
    });
  };

  // Draw chart when data changes
  useEffect(() => {
    if (!chartData.length || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (chartType === 'candle') {
      drawCandlestickChart(ctx, chartData, width, height);
    } else {
      drawLineChart(ctx, chartData, width, height, chartType);
    }

    // Draw volume bars
    drawVolumeBars(ctx, chartData, width, height);

  }, [chartData, chartType, theme]);

  const getTimeLabels = (timeframe, data) => {
    const labels = [];
    const step = Math.floor(data.length / 4);
    
    for (let i = 0; i < data.length; i += step) {
      const date = new Date(data[i].time);
      let text = '';
      
      switch (timeframe) {
        case '1D':
          text = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          break;
        case '1W':
          text = date.toLocaleDateString('en-US', { weekday: 'short' });
          break;
        case '1M':
        case '3M':
          text = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          break;
        case '1Y':
          text = date.toLocaleDateString('en-US', { month: 'short' });
          break;
      }
      
      labels.push({ index: i, text });
    }
    
    return labels;
  };

  const handleCanvasMouseMove = (event) => {
    if (!chartData.length) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const padding = { left: 60, right: 40, top: 20, bottom: 60 };
    const chartWidth = canvas.width - padding.left - padding.right;
    
    const index = Math.floor(((x - padding.left) / chartWidth) * chartData.length);
    
    if (index >= 0 && index < chartData.length) {
      const point = chartData[index];
      const date = new Date(point.time);
      setHoverInfo({
        x: x,
        y: y,
        data: point,
        date: date.toLocaleString(),
        index: index
      });
    } else {
      setHoverInfo(null);
    }
  };

  const handleCanvasMouseLeave = () => {
    setHoverInfo(null);
  };

  const getPerformanceStats = () => {
    if (chartData.length < 2) return null;

    const first = chartData[0].close;
    const last = chartData[chartData.length - 1].close;
    const change = last - first;
    const changePercent = (change / first) * 100;

    const highs = chartData.map(d => d.high);
    const currentHigh = Math.max(...highs);
    const fromHigh = ((last - currentHigh) / currentHigh) * 100;

    // Calculate RSI-like indicator
    let gains = 0;
    let losses = 0;
    for (let i = 1; i < chartData.length; i++) {
      const change = chartData[i].close - chartData[i-1].close;
      if (change > 0) gains += change;
      else losses -= change;
    }
    const rsi = gains + losses > 0 ? (gains / (gains + losses)) * 100 : 50;

    // Calculate MACD-like indicator
    const shortEMA = chartData.slice(-12).reduce((sum, point) => sum + point.close, 0) / 12;
    const longEMA = chartData.slice(-26).reduce((sum, point) => sum + point.close, 0) / 26;
    const macd = shortEMA - longEMA;

    // Calculate volatility (standard deviation of returns)
    const returns = [];
    for (let i = 1; i < chartData.length; i++) {
      const returnVal = (chartData[i].close - chartData[i-1].close) / chartData[i-1].close;
      returns.push(returnVal);
    }
    const volatility = returns.length > 0 ? 
      Math.sqrt(returns.reduce((sum, ret) => sum + Math.pow(ret, 2), 0) / returns.length) * 100 : 0;

    return {
      current: last,
      change,
      changePercent,
      fromHigh,
      isPositive: change >= 0,
      rsi: isNaN(rsi) ? 50 : rsi,
      macd: isNaN(macd) ? 0 : macd,
      volatility: isNaN(volatility) ? 0 : volatility,
      volume: chartData[chartData.length - 1]?.volume || 0
    };
  };

  const performance = getPerformanceStats();
  const currentStock = stocks.find(s => s.symbol === selectedStock);

  const formatTimeAgo = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <div className={`${styles.chartWidgetWrapper} ${sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarOpen} ${theme === 'dark' ? styles.darkTheme : ''}`}>
      <Card className={styles.chartWidgetCard}>
        <Card.Header className={styles.chartHeader}>
          <div className={styles.headerContent}>
            <div className={styles.chartTitleSection}>
              <h5 className={styles.cardTitle}>
                <span className={styles.chartIcon}>📊</span>
                Live Chart - {currentStock?.name || 'Loading...'}
              </h5>
              {performance && (
                <div className={`${styles.performanceBadge} ${performance.isPositive ? styles.performanceBadgePositive : styles.performanceBadgeNegative}`}>
                  <span className={styles.changeIcon}>
                    {performance.isPositive ? '↗' : '↘'}
                  </span>
                  <span className={styles.changeValue}>
                    {performance.isPositive ? '+' : ''}{performance.changePercent.toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
            
            <div className={styles.chartControls}>
              {/* Dynamic Stock Selector */}
              <Dropdown>
                <Dropdown.Toggle variant="outline-primary" size="sm" className={styles.controlBtn} disabled={stocksLoading}>
                  {stocksLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <>
                      <span className={styles.stockColor} style={{ backgroundColor: currentStock?.color }}></span>
                      {selectedStock || 'Select Stock'}
                    </>
                  )}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {stocksLoading ? (
                    <Dropdown.Item disabled>
                      <Spinner animation="border" size="sm" /> Loading stocks...
                    </Dropdown.Item>
                  ) : (
                    stocks.map(stock => (
                      <Dropdown.Item 
                        key={stock.symbol}
                        onClick={() => setSelectedStock(stock.symbol)}
                        className={styles.stockOption}
                      >
                        <span className={styles.stockColor} style={{ backgroundColor: stock.color }}></span>
                        {stock.symbol} - {stock.name}
                        <Badge bg="secondary" className="ms-2">
                          रु {stock.currentPrice?.toFixed(2) || '0.00'}
                        </Badge>
                      </Dropdown.Item>
                    ))
                  )}
                </Dropdown.Menu>
              </Dropdown>

              {/* Chart Type Selector */}
              <ButtonGroup size="sm">
                <Button
                  variant={chartType === 'line' ? 'primary' : 'outline-primary'}
                  onClick={() => setChartType('line')}
                  className={styles.controlBtn}
                >
                  📈 Line
                </Button>
                <Button
                  variant={chartType === 'candle' ? 'primary' : 'outline-primary'}
                  onClick={() => setChartType('candle')}
                  className={styles.controlBtn}
                >
                  🕯️ Candle
                </Button>
                <Button
                  variant={chartType === 'area' ? 'primary' : 'outline-primary'}
                  onClick={() => setChartType('area')}
                  className={styles.controlBtn}
                >
                  🔵 Area
                </Button>
              </ButtonGroup>

              {/* Timeframe Selector */}
              <ButtonGroup size="sm">
                {['1D', '1W', '1M', '3M', '1Y'].map(tf => (
                  <Button
                    key={tf}
                    variant={timeframe === tf ? 'primary' : 'outline-primary'}
                    onClick={() => setTimeframe(tf)}
                    className={styles.controlBtn}
                  >
                    {tf}
                  </Button>
                ))}
              </ButtonGroup>

              {/* Refresh Button */}
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={fetchChartData}
                disabled={loading}
                className={styles.controlBtn}
                title="Refresh chart data"
              >
                {loading ? <Spinner animation="border" size="sm" /> : '🔄'}
              </Button>
            </div>
          </div>

          {/* Performance Stats */}
          {performance && (
            <div className={styles.performanceStats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Current</span>
                <span className={styles.statValue}>रु {performance.current.toFixed(2)}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Change</span>
                <span className={`${styles.statValue} ${performance.isPositive ? styles.statValuePositive : styles.statValueNegative}`}>
                  {performance.isPositive ? '+' : ''}रु {Math.abs(performance.change).toFixed(2)}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>From High</span>
                <span className={`${styles.statValue} ${performance.fromHigh >= 0 ? styles.statValuePositive : styles.statValueNegative}`}>
                  {performance.fromHigh >= 0 ? '+' : ''}{performance.fromHigh.toFixed(2)}%
                </span>
              </div>
              {currentStock?.sector && (
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Sector</span>
                  <span className={styles.statValue}>{currentStock.sector}</span>
                </div>
              )}
            </div>
          )}
        </Card.Header>

        <Card.Body className={styles.chartBody}>
          {/* Error Alert */}
          {error && (
            <Alert variant="warning" className={styles.errorAlert}>
              <div className={styles.alertContent}>
                <span>{error}</span>
                <button 
                  onClick={fetchChartData}
                  className={styles.refreshButton}
                  disabled={loading}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : '🔄 Refresh'}
                </button>
              </div>
            </Alert>
          )}

          {loading ? (
            <div className={styles.chartLoading}>
              <Spinner animation="border" variant="primary" />
              <p>Loading chart data...</p>
            </div>
          ) : (
            <div className={styles.chartContainer}>
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className={styles.chartCanvas}
                onMouseMove={handleCanvasMouseMove}
                onMouseLeave={handleCanvasMouseLeave}
              />
              
              {/* Hover Tooltip */}
              {hoverInfo && (
                <div 
                  className={styles.chartTooltip}
                  style={{
                    left: `${hoverInfo.x + 10}px`,
                    top: `${hoverInfo.y - 10}px`
                  }}
                >
                  <div className={styles.tooltipDate}>{hoverInfo.date}</div>
                  <div className={styles.tooltipData}>
                    <div>O: रु {hoverInfo.data.open.toFixed(2)}</div>
                    <div>H: रु {hoverInfo.data.high.toFixed(2)}</div>
                    <div>L: रु {hoverInfo.data.low.toFixed(2)}</div>
                    <div>C: रु {hoverInfo.data.close.toFixed(2)}</div>
                    <div>V: {(hoverInfo.data.volume / 1000).toFixed(0)}K</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dynamic Technical Indicators */}
          <div className={styles.technicalIndicators}>
            <h6 className={styles.indicatorsTitle}>Technical Indicators</h6>
            <div className={styles.indicatorsGrid}>
              <div className={styles.indicatorItem}>
                <span className={styles.indicatorLabel}>RSI (14)</span>
                <span className={styles.indicatorValue}>{performance?.rsi?.toFixed(1) || '50.0'}</span>
                <ProgressBar 
                  now={performance?.rsi || 50} 
                  className={styles.indicatorProgress}
                  variant={performance?.rsi > 70 ? "danger" : performance?.rsi < 30 ? "success" : "warning"}
                />
              </div>
              <div className={styles.indicatorItem}>
                <span className={styles.indicatorLabel}>MACD</span>
                <span className={`${styles.indicatorValue} ${performance?.macd >= 0 ? styles.indicatorValuePositive : styles.indicatorValueNegative}`}>
                  {performance?.macd >= 0 ? '+' : ''}{performance?.macd?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className={styles.indicatorItem}>
                <span className={styles.indicatorLabel}>Volume</span>
                <span className={styles.indicatorValue}>{((performance?.volume || 0) / 1000000).toFixed(2)}M</span>
              </div>
              <div className={styles.indicatorItem}>
                <span className={styles.indicatorLabel}>Volatility</span>
                <span className={styles.indicatorValue}>{performance?.volatility?.toFixed(1) || '0.0'}%</span>
              </div>
            </div>
          </div>
        </Card.Body>

        <Card.Footer className={styles.chartFooter}>
          <div className={styles.footerContent}>
            <small className="text-muted">
              {currentStock?.name} • {currentStock?.sector} • {timeframe} View • {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
            </small>
            <small className="text-muted">
              {lastUpdated ? `Last update: ${formatTimeAgo(lastUpdated)}` : 'Loading...'}
              {stocks.length > 0 && ` • ${stocks.length} Stocks Available`}
            </small>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default ChartWidget;