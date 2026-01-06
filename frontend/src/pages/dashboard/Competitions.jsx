import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import { Spinner, Alert, Modal, Table } from 'react-bootstrap';
import styles from './css/Competitions.module.css';

const Competitions = () => {
  const navigate = useNavigate();
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [selectedComp, setSelectedComp] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [lbLoading, setLbLoading] = useState(false);

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/competitions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setCompetitions(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const handleJoin = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/competitions/${id}/join`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        alert('🎉 Successfully joined competition! You can now start trading using the "Trade Now" button or via the Trade page context selector.');
        // Refresh to show joined status
        fetchCompetitions();
      } else {
        alert(data.message || 'Failed to join competition');
      }
    } catch (err) {
      alert('Failed to join competition. Please check your connection.');
    }
  };

  const fetchLeaderboard = async (comp) => {
    try {
      setLbLoading(true);
      setSelectedComp(comp);
      setShowLeaderboard(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/competitions/${comp._id}/leaderboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setLeaderboard(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard');
    } finally {
      setLbLoading(false);
    }
  };

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(amt);
  };

  const StatusBadge = ({ status }) => (
    <span className={`${styles.statusBadge} ${styles[status]}`}>
      {status === 'active' ? '● LIVE ARENA' : status === 'upcoming' ? '⏱ UPCOMING' : '✓ COMPLETED'}
    </span>
  );

  return (
    <div className="dashboard-container min-h-screen flex" style={{ background: '#0f1114' }}>
      <Sidebar />
      <div className="dashboard-main flex-1 flex flex-col ml-64" style={{ marginLeft: '280px' }}>
        <Header />
        <main className={styles.container}>
          <header className={styles.header}>
            <h1>Trading Competitions</h1>
            <p>Participate in themed events and win exclusive prizes</p>
          </header>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <>
              <div className={styles.statsSection}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>🏆</div>
                  <div>
                    <span className={styles.statLabel}>Available</span>
                    <span className={styles.statValue}>{competitions.length}</span>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>👥</div>
                  <div>
                    <span className={styles.statLabel}>Total Participants</span>
                    <span className={styles.statValue}>
                      {competitions.reduce((acc, c) => acc + (c.participantsCount || 0), 0)}
                    </span>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>💰</div>
                  <div>
                    <span className={styles.statLabel}>Total Prize Pool</span>
                    <span className={styles.statValue}>
                      {formatCurrency(competitions.reduce((acc, c) => acc + c.prizePool, 0))}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.guideBox}>
                <h4>🎮 How to Play</h4>
                <div className={styles.guideSteps}>
                  <div className={styles.guideStep}>
                    <span className={styles.stepNum}>1</span>
                    <p><strong>Join:</strong> Choose an active competition and click "Join".</p>
                  </div>
                  <div className={styles.guideStep}>
                    <span className={styles.stepNum}>2</span>
                    <p><strong>Arena:</strong> Click "Trade Now" to enter the Competition Arena.</p>
                  </div>
                  <div className={styles.guideStep}>
                    <span className={styles.stepNum}>3</span>
                    <p><strong>Profit:</strong> Trade stocks using your competition-specific balance.</p>
                  </div>
                </div>
              </div>

              <div className={styles.grid}>
                {competitions.map((comp) => (
                  <div key={comp._id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.title}>{comp.name}</h3>
                      <StatusBadge status={comp.status} />
                    </div>
                    
                    <div className={styles.cardBody}>
                      <div className={styles.details}>
                        <div className={styles.detailItem}>
                          <span className={styles.label}>Start Date</span>
                          <span className={styles.value}>{new Date(comp.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.label}>Starting Balance</span>
                          <span className={styles.value}>{formatCurrency(comp.startingBalance)}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.label}>Prize Pool</span>
                          <span className={styles.value} style={{ color: '#ffc107' }}>
                            {formatCurrency(comp.prizePool)}
                          </span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.label}>Entry Fee</span>
                          <span className={styles.value}>
                            {comp.entryFee === 0 ? 'FREE' : formatCurrency(comp.entryFee)}
                          </span>
                        </div>
                      </div>

                      <div className={styles.progressContainer}>
                        <div className={styles.progressLabel}>
                          <span>Participants</span>
                          <span>{comp.participantsCount || 0}/{comp.maxParticipants}</span>
                        </div>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill} 
                            style={{ width: `${((comp.participantsCount || 0) / comp.maxParticipants) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.cardFooter}>
                      {comp.isJoined ? (
                        <>
                          {comp.status === 'active' ? (
                            <button 
                              className={styles.playBtn} 
                              onClick={() => navigate(`/competition/${comp._id}/play`)}
                            >
                              🎮 PLAY IN ARENA
                            </button>
                          ) : comp.status === 'upcoming' ? (
                            <div className={styles.upcomingBox}>
                              <div className={styles.upcomingNote}>READY TO PLAY! 🚀</div>
                              <small>Arena opens on {new Date(comp.startDate).toLocaleDateString()}</small>
                            </div>
                          ) : null}
                          
                          <button className={styles.viewBtn} style={{ marginTop: '0.5rem' }} onClick={() => fetchLeaderboard(comp)}>
                            📊 View Leaderboard
                          </button>
                        </>
                      ) : (
                        <button 
                          className={styles.joinBtn} 
                          onClick={() => handleJoin(comp._id)}
                          disabled={comp.status === 'completed' || (comp.participantsCount >= comp.maxParticipants)}
                        >
                          {comp.status === 'completed' ? 'Tournament Ended' : 'Join Competition'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {showLeaderboard && (
        <div className={styles.modalOverlay} onClick={() => setShowLeaderboard(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setShowLeaderboard(false)}>✕</button>
            <h2>🏆 {selectedComp?.name}</h2>
            <p style={{ color: '#888' }}>Top performers for this competition</p>

            {lbLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <table className={styles.leaderboardTable}>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Trader</th>
                    <th>P/L</th>
                    <th>Trades</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((trader, idx) => (
                    <tr key={trader.userId}>
                      <td>
                        <div className={`${styles.rankBadge} ${styles['rank' + (idx + 1)]}`}>
                          {idx + 1}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="me-2">{trader.avatar || '👤'}</span>
                          <div>
                            <div>{trader.name}</div>
                            <small className="text-muted">@{trader.username}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={trader.profit >= 0 ? styles.positive : styles.negative}>
                          {trader.profit >= 0 ? '+' : ''}{formatCurrency(trader.profit)}
                        </div>
                      </td>
                      <td>{trader.trades}</td>
                    </tr>
                  ))}
                  {leaderboard.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-muted">
                        No participants yet. Be the first to join!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Competitions;
