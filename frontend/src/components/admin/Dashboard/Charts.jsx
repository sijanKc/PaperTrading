import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import styles from '../../admincss/Charts.module.css';

const Charts = ({ stats }) => {
  const [timeRange, setTimeRange] = useState('7d');
  
  // Format dates for display
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // User Growth Data from backend
  const userGrowthData = stats?.charts?.userGrowth?.map(item => ({
    date: formatDate(item._id),
    users: item.count
  })) || [
    { date: 'No Data', users: 0 }
  ];

  // Trading Volume history from backend
  const tradingVolumeHistory = stats?.charts?.tradeVolumeHistory?.map(item => ({
    date: formatDate(item._id),
    volume: item.volume,
    trades: item.count
  })) || [
    { date: 'No Data', volume: 0, trades: 0 }
  ];

  // Sector-wise Distribution (NEPSE Sectors) - Keep as top sectors or dynamic if possible
  // For now we'll keep it as high level but we could aggregate by stock sector
  // Sector-wise Distribution (NEPSE Sectors)
  const sectorColors = ['#3b82f6', '#06b6d4', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#ec4899'];
  const sectorData = stats?.charts?.sectorPerformance?.slice(0, 6).map((s, i) => ({
    name: s.sector,
    value: s.stockCount, // Using count for distribution
    color: sectorColors[i % sectorColors.length]
  })) || [
    { name: 'No Data', value: 100, color: '#94a3b8' }
  ];

  // User Performance Distribution (Keeping mock as it requires complex aggregation not yet implemented)
  const performanceData = [
    { range: '>50% Profit', users: 15 },
    { range: '20-50% Profit', users: 45 },
    { range: '0-20% Profit', users: 120 },
    { range: '0-20% Loss', users: 85 },
    { range: '>20% Loss', users: 25 }
  ];

  // Top 5 NEPSE Stocks
  const topStocksData = stats?.charts?.topStocks?.map(s => ({
    symbol: s.symbol,
    price: s.currentPrice,
    change: parseFloat(s.changePercent.toFixed(2)),
    volume: s.volume
  })) || [];

  // Daily Market Sentiment
  const sentimentData = [
    { day: 'Mon', bullish: 65, bearish: 25, neutral: 10 },
    { day: 'Tue', bullish: 70, bearish: 20, neutral: 10 },
    { day: 'Wed', bullish: 55, bearish: 30, neutral: 15 },
    { day: 'Thu', bullish: 60, bearish: 25, neutral: 15 },
    { day: 'Fri', bullish: 75, bearish: 15, neutral: 10 },
    { day: 'Sat', bullish: 45, bearish: 35, neutral: 20 }
  ];

  // Custom Tooltip for Charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className={styles.tooltipItem}>
              <span className={styles.tooltipDot} style={{ backgroundColor: entry.color }}></span>
              {entry.name}: <strong>{entry.value.toLocaleString()}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartsContainer}>
      {/* Header with Time Range Selector */}
      <div className={styles.chartsHeader}>
        <h2 className={styles.chartsTitle}>
          <span className={styles.chartIcon}>📊</span>
          NEPSE Analytics Dashboard
        </h2>
        <div className={styles.timeRangeSelector}>
          {['1d', '7d', '1m', '3m', '1y'].map(range => (
            <button
              key={range}
              className={`${styles.timeRangeBtn} ${timeRange === range ? styles.active : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Grid */}
      <div className={styles.chartsGrid}>
        
        {/* Chart 1: User Growth */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>
              <span className={styles.chartIconSmall}>📈</span>
              User Growth Trend
            </h3>
            <span className={styles.chartSubtitle}>Last 7 Days</span>
          </div>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b"
                  tick={{ fill: '#64748b' }}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fill: '#64748b' }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  name="Total Users"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  fill="url(#colorUsers)"
                  stroke="transparent"
                  fillOpacity={0.3}
                />
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.chartStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Growth</span>
              <span className={styles.statValue}>+595</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Growth Rate</span>
              <span className={styles.statValuePositive}>+396%</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Avg Daily</span>
              <span className={styles.statValue}>+85 users</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Trading Volume by Hour */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>
              <span className={styles.chartIconSmall}>⏰</span>
              Trading Volume by Hour
            </h3>
            <span className={styles.chartSubtitle}>NEPSE Hours (11AM-3PM)</span>
          </div>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tradingVolumeHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b"
                  tick={{ fill: '#64748b' }}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fill: '#64748b' }}
                  tickFormatter={(value) => `Rs. ${(value/100000).toFixed(1)}L`}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  formatter={(value) => [`Rs. ${value.toLocaleString()}`, 'Volume']}
                />
                <Legend />
                <Bar
                  dataKey="volume"
                  name="Trading Volume"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.chartStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Avg Daily Vol</span>
              <span className={styles.statValue}>Rs. {(tradingVolumeHistory.reduce((acc, curr) => acc + curr.volume, 0) / (tradingVolumeHistory.length || 1) / 100000).toFixed(1)}L</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Period Vol</span>
              <span className={styles.statValue}>Rs. {(tradingVolumeHistory.reduce((acc, curr) => acc + curr.volume, 0) / 100000).toFixed(1)}L</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Trades</span>
              <span className={styles.statValue}>{tradingVolumeHistory.reduce((acc, curr) => acc + curr.trades, 0)}</span>
            </div>
          </div>
        </div>

        {/* Chart 3: Sector Distribution */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>
              <span className={styles.chartIconSmall}>🥧</span>
              Sector-wise Distribution
            </h3>
            <span className={styles.chartSubtitle}>NEPSE Market Sectors</span>
          </div>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Share']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.sectorList}>
            {sectorData.map((sector, index) => (
              <div key={index} className={styles.sectorItem}>
                <div className={styles.sectorColor} style={{ backgroundColor: sector.color }}></div>
                <span className={styles.sectorName}>{sector.name}</span>
                <span className={styles.sectorValue}>{sector.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: User Performance */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>
              <span className={styles.chartIconSmall}>📊</span>
              User Performance Distribution
            </h3>
            <span className={styles.chartSubtitle}>Profit/Loss Categories</span>
          </div>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="range" 
                  stroke="#64748b"
                  tick={{ fill: '#64748b' }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fill: '#64748b' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="users"
                  name="Number of Users"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.chartStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Profitable Users</span>
              <span className={styles.statValuePositive}>180 (63%)</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Loss Users</span>
              <span className={styles.statValueNegative}>110 (37%)</span>
            </div>
          </div>
        </div>

        {/* Chart 5: Market Sentiment */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>
              <span className={styles.chartIconSmall}>😊</span>
              Market Sentiment
            </h3>
            <span className={styles.chartSubtitle}>Weekly Analysis</span>
          </div>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="day" 
                  stroke="#64748b"
                  tick={{ fill: '#64748b' }}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fill: '#64748b' }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  formatter={(value) => [`${value}%`]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="bullish"
                  stackId="1"
                  name="Bullish"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="neutral"
                  stackId="1"
                  name="Neutral"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="bearish"
                  stackId="1"
                  name="Bearish"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.chartStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Avg Bullish</span>
              <span className={styles.statValuePositive}>65%</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Avg Bearish</span>
              <span className={styles.statValueNegative}>25%</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Week High</span>
              <span className={styles.statValuePositive}>Friday</span>
            </div>
          </div>
        </div>

        {/* Chart 6: Top NEPSE Stocks */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>
              <span className={styles.chartIconSmall}>🏆</span>
              Top NEPSE Stocks
            </h3>
            <span className={styles.chartSubtitle}>Most Traded Today</span>
          </div>
          <div className={styles.stocksTable}>
            <div className={styles.tableHeader}>
              <div className={styles.tableCell}>Symbol</div>
              <div className={styles.tableCell}>Price</div>
              <div className={styles.tableCell}>Change</div>
              <div className={styles.tableCell}>Volume</div>
            </div>
            {topStocksData.map((stock, index) => (
              <div key={index} className={styles.tableRow}>
                <div className={styles.tableCell}>
                  <span className={styles.stockSymbol}>{stock.symbol}</span>
                </div>
                <div className={styles.tableCell}>
                  <span className={styles.stockPrice}>Rs. {stock.price.toLocaleString()}</span>
                </div>
                <div className={styles.tableCell}>
                  <span className={`${styles.stockChange} ${stock.change > 0 ? styles.positive : styles.negative}`}>
                    {stock.change > 0 ? '+' : ''}{stock.change}%
                  </span>
                </div>
                <div className={styles.tableCell}>
                  <span className={styles.stockVolume}>
                    {stock.volume.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.chartStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Stocks</span>
              <span className={styles.statValue}>{stats?.charts?.topStocks?.length || 0} Traded</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Top Volume</span>
              <span className={styles.statValue}>{topStocksData[0]?.symbol || 'N/A'}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Summary Section */}
      <div className={styles.summarySection}>
        <h3 className={styles.summaryTitle}>
          <span className={styles.summaryIcon}>📈</span>
          Weekly Insights
        </h3>
        <div className={styles.insightsGrid}>
          <div className={styles.insightCard}>
            <div className={styles.insightIcon}>📊</div>
            <div className={styles.insightContent}>
              <h4>Positive User Growth</h4>
              <p>{stats?.users?.newToday || 0} new users joined today, contributing to a total of {stats?.users?.total || 0} registered traders.</p>
            </div>
          </div>
          <div className={styles.insightCard}>
            <div className={styles.insightIcon}>⏰</div>
            <div className={styles.insightContent}>
              <h4>Trading Pattern</h4>
              <p>Platform volume is currently {stats?.trading?.todayVolume > 0 ? 'active' : 'idle'} with {stats?.trading?.totalTrades || 0} total trades executed.</p>
            </div>
          </div>
          <div className={styles.insightCard}>
            <div className={styles.insightIcon}>🏦</div>
            <div className={styles.insightContent}>
              <h4>{sectorData[0]?.name || 'Market'} Leading</h4>
              <p>{sectorData[0]?.name || 'Various'} sector accounts for most of the trading activity on the platform.</p>
            </div>
          </div>
          <div className={styles.insightCard}>
            <div className={styles.insightIcon}>😊</div>
            <div className={styles.insightContent}>
              <h4>Market Health</h4>
              <p>System is currently {stats?.system?.status || 'operational'} with {stats?.users?.online || 0} users live right now.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;