import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import styles from '../../admincss/Charts.module.css';

const Charts = () => {
  const [timeRange, setTimeRange] = useState('7d');
  
  // User Growth Data (Weekly)
  const userGrowthData = [
    { date: 'Day 1', users: 150 },
    { date: 'Day 2', users: 230 },
    { date: 'Day 3', users: 350 },
    { date: 'Day 4', users: 450 },
    { date: 'Day 5', users: 520 },
    { date: 'Day 6', users: 610 },
    { date: 'Day 7', users: 745 }
  ];

  // Trading Volume by Hour (NEPSE Trading Hours: 11 AM - 3 PM)
  const tradingVolumeData = [
    { hour: '11 AM', volume: 4500000, trades: 120 },
    { hour: '12 PM', volume: 6200000, trades: 185 },
    { hour: '1 PM', volume: 7800000, trades: 210 },
    { hour: '2 PM', volume: 6800000, trades: 175 },
    { hour: '3 PM', volume: 4200000, trades: 110 }
  ];

  // Sector-wise Distribution (NEPSE Sectors)
  const sectorData = [
    { name: 'Commercial Banks', value: 35, color: '#3b82f6' },
    { name: 'Development Banks', value: 20, color: '#8b5cf6' },
    { name: 'Finance Companies', value: 15, color: '#10b981' },
    { name: 'Insurance', value: 12, color: '#f59e0b' },
    { name: 'Hydro Power', value: 10, color: '#06b6d4' },
    { name: 'Others', value: 8, color: '#ef4444' }
  ];

  // User Performance Distribution
  const performanceData = [
    { range: '>50% Profit', users: 15 },
    { range: '20-50% Profit', users: 45 },
    { range: '0-20% Profit', users: 120 },
    { range: '0-20% Loss', users: 85 },
    { range: '>20% Loss', users: 25 }
  ];

  // Top 5 NEPSE Stocks
  const topStocksData = [
    { symbol: 'NIC', price: 850, change: 2.5, volume: 45678 },
    { symbol: 'NBL', price: 450, change: 1.8, volume: 34567 },
    { symbol: 'HIDCL', price: 320, change: -0.5, volume: 23456 },
    { symbol: 'SCB', price: 680, change: 3.2, volume: 56789 },
    { symbol: 'NTC', price: 1120, change: 1.2, volume: 12345 }
  ];

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
              <BarChart data={tradingVolumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="hour" 
                  stroke="#64748b"
                  tick={{ fill: '#64748b' }}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fill: '#64748b' }}
                  tickFormatter={(value) => `₹${(value/1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Volume']}
                />
                <Legend />
                <Bar
                  dataKey="volume"
                  name="Trading Volume"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="trades"
                  name="Number of Trades"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.chartStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Peak Hour</span>
              <span className={styles.statValue}>1 PM</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Volume</span>
              <span className={styles.statValue}>₹29.5M</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Trades</span>
              <span className={styles.statValue}>800</span>
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
                  <span className={styles.stockPrice}>₹{stock.price}</span>
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
              <span className={styles.statLabel}>Top Gainer</span>
              <span className={styles.statValuePositive}>SCB +3.2%</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Most Volume</span>
              <span className={styles.statValue}>SCB</span>
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
              <h4>Strong User Growth</h4>
              <p>396% increase in new users this week, indicating growing interest in paper trading.</p>
            </div>
          </div>
          <div className={styles.insightCard}>
            <div className={styles.insightIcon}>⏰</div>
            <div className={styles.insightContent}>
              <h4>Peak Trading at 1 PM</h4>
              <p>Maximum trading volume observed during lunch hours (1-2 PM).</p>
            </div>
          </div>
          <div className={styles.insightCard}>
            <div className={styles.insightIcon}>🏦</div>
            <div className={styles.insightContent}>
              <h4>Banking Sector Dominates</h4>
              <p>Commercial banks account for 35% of all trading activity.</p>
            </div>
          </div>
          <div className={styles.insightCard}>
            <div className={styles.insightIcon}>😊</div>
            <div className={styles.insightContent}>
              <h4>Bullish Sentiment</h4>
              <p>65% average bullish sentiment with peaks on Fridays.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;