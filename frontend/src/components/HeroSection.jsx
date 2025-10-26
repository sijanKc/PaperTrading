import React, { useState, useEffect } from 'react';
import { Play, ChevronRight, TrendingUp, BarChart3, PieChart, Users, Zap, Shield } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Link } from "react-router-dom";
import "../styles/herosection.css";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Advanced portfolio state
  const [portfolio, setPortfolio] = useState({
    balance: 125000,
    change: 12.5,
    todayProfit: 2500,
    totalStocks: 8,
    stocks: [
      { name: 'NABIL', change: 5.2, price: 1250, volume: '2.5K' },
      { name: 'SCB', change: -2.1, price: 480, volume: '1.8K' },
      { name: 'NTC', change: 3.7, price: 850, volume: '3.2K' },
      { name: 'NICA', change: 8.9, price: 1050, volume: '1.2K' },
    ],
    chartData: [120, 125, 122, 128, 130, 127, 132, 135, 130, 128]
  });

  // Market data state
  const [marketData, setMarketData] = useState({
    nepseIndex: 2150.75,
    nepseChange: 15.25,
    turnover: 4.2,
    totalTrades: 12500
  });

  // Animate hero section
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Simulate live market updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update portfolio
      setPortfolio(prev => {
        const updatedStocks = prev.stocks.map(stock => ({
          ...stock,
          change: parseFloat((stock.change + (Math.random() * 2 - 1)).toFixed(1)),
          price: Math.max(100, parseInt(stock.price + (Math.random() * 20 - 10)))
        }));

        const totalChange = updatedStocks.reduce((acc, s) => acc + s.change, 0);
        const avgChange = totalChange / updatedStocks.length;
        const newBalance = Math.max(0, parseInt(prev.balance * (1 + avgChange/100)));

        const newChartData = [...prev.chartData];
        newChartData.push(newBalance / 1000);
        if (newChartData.length > 10) newChartData.shift();

        return { 
          ...prev, 
          balance: newBalance, 
          change: parseFloat(avgChange.toFixed(1)),
          todayProfit: parseInt((newBalance - 100000) * 0.1),
          stocks: updatedStocks, 
          chartData: newChartData 
        };
      });

      // Update market data
      setMarketData(prev => ({
        nepseIndex: parseFloat((prev.nepseIndex + (Math.random() * 10 - 5)).toFixed(2)),
        nepseChange: parseFloat((prev.nepseChange + (Math.random() * 2 - 1)).toFixed(2)),
        turnover: parseFloat((prev.turnover + (Math.random() * 0.5 - 0.25)).toFixed(1)),
        totalTrades: prev.totalTrades + Math.floor(Math.random() * 100)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Advanced chart config
  const chartConfig = {
    labels: portfolio.chartData.map((_, i) => `T-${portfolio.chartData.length - i}`),
    datasets: [
      {
        label: 'Portfolio Value',
        data: portfolio.chartData,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#94a3b8',
        bodyColor: '#f1f5f9',
        borderColor: '#334155',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  return (
    <section className="hero-section position-relative overflow-hidden">
      <div className="hero-bg"></div>
      <div className="container py-5">
        <div className="row align-items-center min-vh-100">
          {/* Left Text Section */}
          <div className="col-lg-6">
            <div className={`hero-content ${isVisible ? 'animate-slide-in' : ''}`}>
              {/* Live Market Badge */}
              <div className="live-market-badge mb-4">
                <span className="live-dot"></span>
                LIVE NEPSE: {marketData.nepseIndex} 
                <span className={marketData.nepseChange >= 0 ? 'text-success' : 'text-danger'}>
                  {marketData.nepseChange >= 0 ? ' ↗ ' : ' ↘ '}
                  {Math.abs(marketData.nepseChange)}
                </span>
              </div>

              <h1 className="display-4 fw-bold text-white mb-4">
                Master NEPSE Trading with
                <span className="text-gradient d-block">Zero Risk</span>
              </h1>
              <p className="lead text-white-50 mb-4">
                Learn to navigate NEPSE with virtual Rs. 1,00,000 and build your investing skills 
                in a risk-free environment with real-time market data.
              </p>
              
              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link to="/started">
                  <button className="btn btn-primary btn-lg px-4 py-3 rounded-pill shadow-lg hover-lift">
                    <Play className="me-2" size={20} />
                    Start Trading Now
                  </button>
                </Link>
                <a href="#features">
                  <button className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill hover-glow">
                    Explore Features
                    <ChevronRight className="ms-2" size={20} />
                  </button>
                </a>
              </div>

              {/* Advanced Stats */}
              <div className="advanced-stats">
                <div className="row g-4">
                  <div className="col-4 text-center">
                    <div className="stat-card">
                      <Users className="text-primary mb-2" size={24} />
                      <h3 className="h4 fw-bold text-white mb-1">10K+</h3>
                      <small className="text-white-50">Active Traders</small>
                    </div>
                  </div>
                  <div className="col-4 text-center">
                    <div className="stat-card">
                      <Zap className="text-warning mb-2" size={24} />
                      <h3 className="h4 fw-bold text-white mb-1">Real-time</h3>
                      <small className="text-white-50">Live Data</small>
                    </div>
                  </div>
                  <div className="col-4 text-center">
                    <div className="stat-card">
                      <Shield className="text-success mb-2" size={24} />
                      <h3 className="h4 fw-bold text-white mb-1">100%</h3>
                      <small className="text-white-50">Risk Free</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Section */}
          <div className="col-lg-6">
            <div className="hero-visual">  {/* animate-float class remove gareko */}
              <div className="trading-mockup position-relative">
                
                {/* Main Portfolio Card */}
                <div className="mockup-screen bg-dark rounded-4 p-4 shadow-xl border border-slate-600">
                  {/* Portfolio Header */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="text-white mb-0 d-flex align-items-center">
                      <TrendingUp className="me-2" size={16} />
                      Portfolio Balance
                    </h6>
                    <div className="d-flex align-items-center">
                      <span className={`badge ${portfolio.change >= 0 ? 'bg-success' : 'bg-danger'} me-2`}>
                        {portfolio.change >= 0 ? '+' : ''}{portfolio.change}%
                      </span>
                      <div className="live-indicator"></div>
                    </div>
                  </div>

                  {/* Balance and Today's Profit */}
                  <div className="mb-3">
                    <h2 className={`fw-bold ${portfolio.change >= 0 ? 'text-success' : 'text-danger'} mb-1`}>
                      NPR {portfolio.balance.toLocaleString()}
                    </h2>
                    <div className="text-white-50 small">
                      Today's P&L: 
                      <span className={portfolio.todayProfit >= 0 ? 'text-success ms-1' : 'text-danger ms-1'}>
                        {portfolio.todayProfit >= 0 ? '+' : ''}NPR {Math.abs(portfolio.todayProfit).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Advanced Mini Chart */}
                  <div className="mini-chart bg-gradient rounded-3 mb-4 p-3">
                    <div style={{ height: '80px' }}>
                      <Line data={chartConfig} options={chartOptions} />
                    </div>
                  </div>

                  {/* Stock Grid */}
                  <div className="stock-grid">
                    <h6 className="text-white-50 mb-2">Top Holdings</h6>
                    <div className="row g-2">
                      {portfolio.stocks.map((stock, i) => (
                        <div className="col-6" key={i}>
                          <div className={`stock-card p-2 rounded ${stock.change >= 0 ? 'up-trend' : 'down-trend'}`}>
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <div className="stock-symbol text-white fw-bold">{stock.name}</div>
                                <div className="stock-price text-white-50 small">NPR {stock.price}</div>
                              </div>
                              <div className="text-end">
                                <div className={`stock-change fw-bold ${stock.change >= 0 ? 'text-success' : 'text-danger'}`}>
                                  {stock.change >= 0 ? '+' : ''}{stock.change}%
                                </div>
                                <div className="stock-volume text-white-50 small">{stock.volume}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="quick-actions mt-3 pt-3 border-top border-slate-600">
                    <div className="row g-2">
                      <div className="col-4">
                        <button className="btn btn-outline-primary btn-sm w-100 py-2">Buy</button>
                      </div>
                      <div className="col-4">
                        <button className="btn btn-outline-danger btn-sm w-100 py-2">Sell</button>
                      </div>
                      <div className="col-4">
                        <button className="btn btn-outline-info btn-sm w-100 py-2">Chart</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Market Data Panel */}
                <div className="market-panel bg-slate-800 rounded-3 p-3 mt-3">
                  <div className="row g-3 text-center">
                    <div className="col-3">
                      <div className="market-data">
                        <div className="market-value text-white fw-bold">{marketData.nepseIndex}</div>
                        <div className="market-label text-white-50 small">NEPSE</div>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="market-data">
                        <div className={`market-value fw-bold ${marketData.nepseChange >= 0 ? 'text-success' : 'text-danger'}`}>
                          {marketData.nepseChange >= 0 ? '+' : ''}{marketData.nepseChange}
                        </div>
                        <div className="market-label text-white-50 small">Change</div>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="market-data">
                        <div className="market-value text-white fw-bold">{marketData.turnover}Cr</div>
                        <div className="market-label text-white-50 small">Turnover</div>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="market-data">
                        <div className="market-value text-white fw-bold">{(marketData.totalTrades/1000).toFixed(1)}K</div>
                        <div className="market-label text-white-50 small">Trades</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="floating-elements">
                  <div className="floating-icon floating-icon-1">
                    <TrendingUp className="text-success" size={20} />
                  </div>
                  <div className="floating-icon floating-icon-2">
                    <BarChart3 className="text-primary" size={20} />
                  </div>
                  <div className="floating-icon floating-icon-3">
                    <PieChart className="text-warning" size={20} />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;