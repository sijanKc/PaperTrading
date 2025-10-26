import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Zap, 
  TrendingUp, 
  BarChart3, 
  Shield, 
  Users, 
  Award,
  ArrowRight,
  Play,
  Star,
  CheckCircle
} from "lucide-react";

export default function Started() {
  const [hoveredButton, setHoveredButton] = useState(null);
  const navigate = useNavigate();

  const handleLogin = () => navigate("/login");
  const handleSignup = () => navigate("/signup");

  const features = [
    { icon: <TrendingUp size={20} />, text: "Real-time NEPSE Data" },
    { icon: <BarChart3 size={20} />, text: "Advanced Analytics" },
    { icon: <Shield size={20} />, text: "100% Risk-Free" },
    { icon: <Users size={20} />, text: "50K+ Active Traders" }
  ];

  const benefits = [
    "Practice with NPR 1,00,000 virtual balance",
    "Access real market data and insights",
    "Learn trading strategies risk-free",
    "Track your performance with analytics",
    "Join community of successful traders"
  ];

  return (
    <>
      <style>{`
        .started-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .started-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.1) 0%, transparent 80%);
          z-index: 0;
        }

        .floating-shapes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.05));
          animation: float 8s ease-in-out infinite;
          filter: blur(40px);
        }

        .shape-1 {
          width: 300px;
          height: 300px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 400px;
          height: 400px;
          top: 60%;
          right: 10%;
          animation-delay: 2s;
        }

        .shape-3 {
          width: 250px;
          height: 250px;
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          33% { 
            transform: translateY(-30px) rotate(120deg) scale(1.1);
          }
          66% { 
            transform: translateY(20px) rotate(240deg) scale(0.9);
          }
        }

        .content-wrapper {
          position: relative;
          z-index: 2;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }

        .main-card {
          background: rgba(30, 41, 59, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid #334155;
          border-radius: 24px;
          padding: 3rem;
          max-width: 900px;
          width: 100%;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          position: relative;
          overflow: hidden;
        }

        .card-header-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #10b981, #8b5cf6, #f59e0b);
          background-size: 300% 100%;
          animation: gradientShift 3s ease infinite;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .logo-section {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo-wrapper {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .logo-icon {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #60a5fa;
        }

        .brand-text {
          text-align: left;
        }

        .brand-title {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #60a5fa, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }

        .brand-subtitle {
          font-size: 1rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .title {
          font-size: 3rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1rem;
          text-align: center;
          line-height: 1.1;
        }

        .title-gradient {
          background: linear-gradient(135deg, #60a5fa, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          font-size: 1.3rem;
          color: #cbd5e1;
          text-align: center;
          margin-bottom: 3rem;
          line-height: 1.5;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
        }

        .feature-icon {
          color: #60a5fa;
        }

        .feature-text {
          color: white;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .button-container {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .btn-auth {
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          border: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          min-width: 160px;
          justify-content: center;
        }

        .btn-login {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .btn-login:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(59, 130, 246, 0.5);
        }

        .btn-signup {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
        }

        .btn-signup:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(255, 255, 255, 0.1);
        }

        .benefits-section {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 2rem;
        }

        .benefits-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: white;
          margin-bottom: 1.5rem;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .benefits-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #cbd5e1;
          font-size: 1rem;
        }

        .benefit-check {
          color: #10b981;
          flex-shrink: 0;
        }

        .stats-section {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-item {
          text-align: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #94a3b8;
        }

        .footer-note {
          text-align: center;
          color: #94a3b8;
          font-size: 0.95rem;
          margin-top: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        @media (max-width: 768px) {
          .main-card {
            padding: 2rem 1.5rem;
            margin: 1rem;
          }

          .title {
            font-size: 2.2rem;
          }

          .subtitle {
            font-size: 1.1rem;
          }

          .button-container {
            flex-direction: column;
            align-items: center;
          }

          .btn-auth {
            width: 100%;
            max-width: 280px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .stats-section {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .title {
            font-size: 1.8rem;
          }

          .logo-wrapper {
            flex-direction: column;
            gap: 0.5rem;
          }

          .brand-text {
            text-align: center;
          }
        }
      `}</style>

      <div className="started-page">
        {/* Background Elements */}
        <div className="started-bg"></div>
        
        {/* Floating Shapes */}
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>

        <div className="content-wrapper">
          <motion.div 
            className="main-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Gradient Header */}
            <div className="card-header-gradient"></div>

            {/* Logo Section */}
            <div className="logo-section">
              <div className="logo-wrapper">
                <div className="logo-icon">
                  <Zap size={32} />
                </div>
                <div className="brand-text">
                  <div className="brand-title">Sanchaya</div>
                  <div className="brand-subtitle">Paper Trading Platform</div>
                </div>
              </div>
            </div>

            {/* Main Title */}
            <h1 className="title">
              Master NEPSE Trading with
              <span className="title-gradient d-block">Zero Risk</span>
            </h1>
            
            <p className="subtitle">
              Practice with virtual NPR 1,00,000, access real market data, 
              and build your trading skills in a risk-free environment
            </p>

            {/* Features Grid */}
            <div className="features-grid">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="feature-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <span className="feature-text">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="stats-section">
              <div className="stat-item">
                <div className="stat-value text-primary">50K+</div>
                <div className="stat-label">Active Traders</div>
              </div>
              <div className="stat-item">
                <div className="stat-value text-success">94%</div>
                <div className="stat-label">Success Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-value text-warning">4.9/5</div>
                <div className="stat-label">User Rating</div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="benefits-section">
              <h3 className="benefits-title">
                <Award size={20} />
                Why Join Sanchaya?
              </h3>
              <div className="benefits-list">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="benefit-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <CheckCircle size={18} className="benefit-check" />
                    {benefit}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="button-container">
              <motion.button
                className="btn-auth btn-login"
                onClick={handleLogin}
                onMouseEnter={() => setHoveredButton("login")}
                onMouseLeave={() => setHoveredButton(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play size={18} />
                Login to Dashboard
              </motion.button>
              
              <motion.button
                className="btn-auth btn-signup"
                onClick={handleSignup}
                onMouseEnter={() => setHoveredButton("signup")}
                onMouseLeave={() => setHoveredButton(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowRight size={18} />
                Create Account
              </motion.button>
            </div>

            {/* Footer Note */}
            <motion.p 
              className="footer-note"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <Star size={16} />
              Start today and prepare for the real market tomorrow
            </motion.p>
          </motion.div>
        </div>
      </div>
    </>
  );
}