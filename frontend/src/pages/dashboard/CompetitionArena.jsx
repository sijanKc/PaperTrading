import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { marketService } from '../../services/marketService';
import { Spinner, Alert } from 'react-bootstrap';
import styles from './css/CompetitionArena.module.css';
import tradeStyles from './css/Trade.module.css';

const CompetitionArena = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [competition, setCompetition] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [userBalance, setUserBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tradeLoading, setTradeLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('buy');
  const [rank, setRank] = useState('---');

  const [tradeData, setTradeData] = useState({
    symbol: '',
    quantity: '',
    price: '',
    orderType: 'market'
  });

  const fetchData = useCallback(async () => {
    try {
      const [compRes, portfolioRes, marketRes, transRes, lbRes] = await Promise.all([
        api.get(`/competitions/${id}`),
        api.get(`/trade/portfolio?competitionId=${id}`),
        marketService.getAllStocks(),
        api.get(`/trade/transactions?competitionId=${id}&limit=10`),
        api.get(`/competitions/${id}/leaderboard`)
      ]);

      if (compRes.data.success) setCompetition(compRes.data.data);
      if (portfolioRes.data.success) {
        setPortfolio(portfolioRes.data.data.holdings || []);
        setUserBalance(portfolioRes.data.data.virtualBalance || 0);
      }
      if (marketRes.success) {
        setMarketData(marketRes.data.map(s => ({
          ...s,
          price: s.currentPrice,
          change: s.currentPrice - (s.previousClose || s.currentPrice),
          changePercent: s.previousClose ? ((s.currentPrice - s.previousClose) / s.previousClose * 100).toFixed(2) : 0
        })));
      }
      if (transRes.data.success) setTransactions(transRes.data.data.transactions || []);
      
      if (lbRes.data.success) {
        const userInLb = lbRes.data.data.find(p => p.userId === JSON.parse(localStorage.getItem('user'))?.id);
        if (userInLb) setRank(userInLb.rank);
      }

    } catch (err) {
      console.error('Arena fetch error:', err);
      setError('Failed to load arena data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleInputChange = (field, value) => {
    setTradeData(prev => ({ ...prev, [field]: value }));
  };

  const executeTrade = async (e) => {
    e.preventDefault();
    if (!tradeData.symbol || !tradeData.quantity) return;

    setTradeLoading(true);
    try {
      const endpoint = activeTab === 'buy' ? '/trade/buy' : '/trade/sell';
      const response = await api.post(endpoint, {
        ...tradeData,
        quantity: parseInt(tradeData.quantity),
        competitionId: id
      });

      if (response.data.success) {
        alert(`Trade executed successfully!`);
        setTradeData({ symbol: '', quantity: '', price: '', orderType: 'market' });
        fetchData();
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Trade failed');
    } finally {
      setTradeLoading(false);
    }
  };

  if (loading) return <div className="text-center p-5"><Spinner animation="border" variant="warning" /></div>;
  if (error) return <Alert variant="danger" className="m-5">{error}</Alert>;
  if (!competition) return <Alert variant="warning" className="m-5">Competition not found</Alert>;

  const filteredStocks = competition.rules?.allowedSectors?.includes('All') 
    ? marketData 
    : marketData.filter(s => competition.rules?.allowedSectors?.includes(s.sector));

  const selectedStock = marketData.find(s => s.symbol === tradeData.symbol);

  return (
    <div className={styles.arenaPortal}>
      <nav className={styles.arenaNavbar}>
        <div className={styles.brand}>
          <span className={styles.arenaBadge}>PORTAL</span>
          <div className={styles.liveDot}></div>
          <span className={styles.arenaName}>{competition.name}</span>
        </div>
        
        <div className={styles.arenaStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>INITIAL CASH</span>
            <span className={styles.statValue}>रु {competition.startingBalance.toLocaleString()}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>LIVE BALANCE</span>
            <span className={`${styles.statValue} ${styles.balanceValue}`}>रु {userBalance.toLocaleString()}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>CURRENT RANK</span>
            <span className={styles.statValue}>#{rank}</span>
          </div>
        </div>

        <button className={styles.exitButton} onClick={() => navigate('/competitions')}>
          🚪 EXIT ARENA
        </button>
      </nav>

      <main className={styles.mainContent}>
        <div className={styles.tradePortal}>
          <div className={styles.infoGrid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>📜 Competition Rules</h3>
              <ul className={styles.rulesList}>
                <li>🏢 <strong>Allowed Sectors:</strong> {competition.rules?.allowedSectors?.join(', ')}</li>
                <li>🔄 <strong>Daily Trade Limit:</strong> {competition.rules?.maxDailyTrades}</li>
                <li>📅 <strong>Ends:</strong> {new Date(competition.endDate).toLocaleString()}</li>
              </ul>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>💼 Arena Portfolio</h3>
              {portfolio.length === 0 ? <p className="text-muted small">No holdings yet</p> : (
                <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                  {portfolio.map(h => (
                    <div key={h.symbol} className="d-flex justify-content-between small border-bottom py-1">
                      <span>{h.symbol}</span>
                      <span>{h.quantity} @ रु {h.averageBuyPrice}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.card}>
            <div className={tradeStyles.formTabs}>
              <button 
                className={`${tradeStyles.tabButton} ${activeTab === 'buy' ? tradeStyles.tabActive : ''} ${tradeStyles.buyTab}`}
                onClick={() => setActiveTab('buy')}
              >BUY</button>
              <button 
                className={`${tradeStyles.tabButton} ${activeTab === 'sell' ? tradeStyles.tabActive : ''} ${tradeStyles.sellTab}`}
                onClick={() => setActiveTab('sell')}
              >SELL</button>
            </div>

            <form onSubmit={executeTrade} className="mt-4">
              <div className="mb-3">
                <label className="form-label small text-muted">Stock Symbol</label>
                <select 
                  className="form-control"
                  value={tradeData.symbol}
                  onChange={(e) => handleInputChange('symbol', e.target.value)}
                  required
                >
                  <option value="">Select Stock</option>
                  {(activeTab === 'buy' ? filteredStocks : portfolio).map(s => (
                    <option key={s.symbol} value={s.symbol}>{s.symbol} - {s.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small text-muted">Quantity</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={tradeData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  min="1"
                  required
                />
              </div>

              {selectedStock && (
                <div className="p-3 bg-dark rounded mb-3 small">
                  <div className="d-flex justify-content-between">
                    <span>Market Price:</span>
                    <strong>रु {selectedStock.price}</strong>
                  </div>
                  <div className="d-flex justify-content-between mt-1">
                    <span>Total Cost:</span>
                    <strong>रु {(selectedStock.price * (tradeData.quantity || 0)).toLocaleString()}</strong>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className={`${tradeStyles.executeButton} ${activeTab === 'buy' ? tradeStyles.buyButton : tradeStyles.sellButton} w-100`}
                disabled={tradeLoading}
              >
                {tradeLoading ? 'PROCESSING...' : `EXECUTE ${activeTab.toUpperCase()}`}
              </button>
            </form>
          </div>
        </div>

        <aside className={styles.marketSection}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>📈 Top Gainers</h3>
            <div className="small">
              {marketData.sort((a,b) => b.changePercent - a.changePercent).slice(0, 5).map(s => (
                <div key={s.symbol} className="d-flex justify-content-between py-2 border-bottom">
                  <div>
                    <strong>{s.symbol}</strong><br/>
                    <small className="text-muted">{s.name}</small>
                  </div>
                  <div className="text-end">
                    <div>रु {s.price}</div>
                    <div className="text-success small">+{s.changePercent}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>📝 Arena Activity</h3>
            <div className="small text-muted">
              {transactions.length === 0 ? <p>No recent activity</p> : transactions.map(t => (
                <div key={t._id} className="mb-2 pb-2 border-bottom">
                  <span className={t.type === 'BUY' ? 'text-success' : 'text-danger'}>{t.type}</span> {t.quantity} {t.symbol} @ रु {t.price}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default CompetitionArena;
