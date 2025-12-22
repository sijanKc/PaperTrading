// pages/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { Zap, CheckCircle, TrendingUp, Wallet, BarChart3 } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import OverviewCards from "../../components/dashboard/OverviewCards";
import Stock from "../../components/dashboard/Stock";
import ChartWidget from "../../components/dashboard/ChartWidget";
import NewsFeed from "../../components/dashboard/NewsFeed";
import FooterDashboard from "../../components/dashboard/FooterDashboard";
import PaperTradingStats from "../../components/dashboard/PaperTradingStats";

const Dashboard = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check if user just logged in
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (token && user) {
      setUserData(user);
      
      // Show welcome modal only on FIRST TIME login
      const hasSeenWelcome = localStorage.getItem(`hasSeenWelcome_${user.id}`);
      if (!hasSeenWelcome) {
        setShowWelcome(true);
        localStorage.setItem(`hasSeenWelcome_${user.id}`, "true");
      }
    }
  }, []);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
  };

  return (
    <div className="dashboard-container bg-gray-50 min-h-screen flex">
      {/* Welcome Modal - Shows only first time */}
      <Modal 
        show={showWelcome} 
        onHide={handleCloseWelcome}
        centered
        size="lg"
        backdrop="static"
        className="welcome-modal"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Modal.Body className="text-center p-5 welcome-modal-body">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="welcome-icon mb-4">
                <Zap size={48} className="text-warning" />
              </div>
            </motion.div>
            
            <h2 className="fw-bold mb-3 text-success">
              🎉 Welcome to Sanchaya Paper Trading!
            </h2>
            
            <div className="welcome-content mb-4">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <CheckCircle size={24} className="text-success me-2" />
                <h4 className="mb-0 fw-bold">Congratulations!</h4>
              </div>
              
              <p className="lead mb-4">
                You've received <span className="fw-bold text-primary">NPR 1,00,000</span> 
                <br />virtual cash for your paper trading journey!
              </p>

              <div className="virtual-cash-card mb-4">
                <div className="cash-amount display-4 fw-bold text-primary">
                  ₹1,00,000
                </div>
                <small className="text-muted">Virtual Trading Balance</small>
              </div>
            </div>

            <div className="features-grid mb-4">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="feature-item">
                    <TrendingUp size={20} className="text-info mb-2" />
                    <div>Real NEPSE Data</div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="feature-item">
                    <Wallet size={20} className="text-success mb-2" />
                    <div>Risk-Free Trading</div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="feature-item">
                    <BarChart3 size={20} className="text-warning mb-2" />
                    <div>Live Analytics</div>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              variant="primary" 
              size="lg" 
              className="px-5 py-3 fw-bold"
              onClick={handleCloseWelcome}
            >
              <Zap size={20} className="me-2" />
              Start Trading Now!
            </Button>
          </Modal.Body>
        </motion.div>
      </Modal>

      <Sidebar />
      
      <div className="dashboard-main flex-1 flex flex-col ml-64">
        <Header />
        
        <main className="dashboard-content flex-1 p-6 space-y-6">
          {/* Section 1: Overview Cards & Paper Trading */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <OverviewCards />
            </div>
            <div className="lg:col-span-1">
              <PaperTradingStats />
            </div>
          </section>

          {/* Section 2: Live Chart Widget */}
          <section>
            <ChartWidget />
          </section>

          {/* Section 3: Stock List */}
          <section>
            <Stock />
          </section>

          {/* Section 4: News Feed */}
          <section>
            <NewsFeed />
          </section>
        </main>

        <FooterDashboard />
      </div>

      <style jsx>{`
        .welcome-modal :global(.modal-content) {
          border-radius: 20px;
          border: none;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          color: white;
        }

        .welcome-icon {
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          padding: 20px;
          display: inline-block;
        }

        .virtual-cash-card {
          background: rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 15px;
          border: 2px dashed rgba(255,255,255,0.3);
        }

        .feature-item {
          text-align: center;
          padding: 15px;
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }

        .cash-amount {
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;