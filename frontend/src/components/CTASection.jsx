import React, { useState } from "react";
import { 
  Award, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  Zap, 
  Star, 
  Shield,
  ArrowRight,
  PlayCircle,
  LineChart,
  BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import "../styles/cta-section.css";

const CTASection = () => {
  const [isHovered, setIsHovered] = useState(false);

  const benefits = [
    {
      text: "Practice with NPR 1,00,000 virtual balance",
      icon: <TrendingUp size={20} />
    },
    {
      text: "Access real-time NEPSE market data",
      icon: <BarChart3 size={20} />
    },
    {
      text: "Track and analyze your portfolio growth",
      icon: <LineChart size={20} />
    },
    {
      text: "Learn risk-free before investing real money",
      icon: <Shield size={20} />
    }
  ];

  const stats = [
    { value: "50K+", label: "Active Traders", color: "text-primary" },
    { value: "94%", label: "Success Rate", color: "text-success" },
    { value: "4.9/5", label: "User Rating", color: "text-warning" },
    { value: "NPR 2.5Cr+", label: "Virtual Trades", color: "text-info" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="cta" className="cta-section position-relative overflow-hidden">
      {/* Background Elements */}
      <div className="cta-bg"></div>
      
      {/* Animated Background Elements */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <Container>
        <Row className="align-items-center g-5">
          {/* Left Content */}
          <Col lg={6}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {/* Header Badge */}
              <motion.div variants={itemVariants}>
                <Badge bg="primary" className="section-badge mb-3">
                  <Zap size={16} className="me-2" />
                  START TRADING NOW
                </Badge>
              </motion.div>

              {/* Main Heading */}
              <motion.div variants={itemVariants}>
                <h2 className="display-5 fw-bold text-white mb-3">
                  Ready to Master 
                  <span className="text-gradient"> NEPSE Trading?</span>
                </h2>
              </motion.div>

              {/* Description */}
              <motion.div variants={itemVariants}>
                <p className="lead text-white-50 mb-4">
                  Join <strong className="text-warning">50,000+ traders</strong> who are already 
                  practicing with <strong>real NEPSE market data</strong> and building 
                  confidence in their trading journey.
                </p>
              </motion.div>

              {/* Benefits List */}
              <motion.div variants={itemVariants}>
                <div className="benefits-list mb-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      className="benefit-item d-flex align-items-center mb-3"
                      whileHover={{ x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="benefit-icon-wrapper me-3">
                        <CheckCircle className="benefit-check" size={20} />
                        <div className="benefit-icon">
                          {benefit.icon}
                        </div>
                      </div>
                      <span className="text-white-50">{benefit.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div variants={itemVariants}>
                <Card className="stats-card border-0 mb-4">
                  <Card.Body className="p-3">
                    <Row className="g-2 text-center">
                      {stats.map((stat, index) => (
                        <Col key={index} xs={6} sm={3}>
                          <div className="stat-item">
                            <div className={`stat-value fw-bold ${stat.color}`}>
                              {stat.value}
                            </div>
                            <small className="stat-label text-white-50">
                              {stat.label}
                            </small>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                variants={itemVariants}
                className="cta-buttons"
              >
                <div className="d-flex flex-wrap gap-3">
                  <Button 
                    size="lg" 
                    className="cta-primary-btn"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <Award size={20} className="me-2" />
                    Start Free Trading
                    <motion.div
                      animate={{ x: isHovered ? 5 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight size={18} className="ms-2" />
                    </motion.div>
                  </Button>
                  
                  <Button 
                    variant="outline-light" 
                    size="lg"
                    className="cta-secondary-btn"
                  >
                    <PlayCircle size={20} className="me-2" />
                    Watch Demo
                  </Button>
                </div>

                {/* Trust Badge */}
                <div className="trust-badge mt-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="rating-stars">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          size={14}
                          fill="#ffc107"
                          color="#ffc107"
                        />
                      ))}
                    </div>
                    <small className="text-white-50">
                      Rated 4.9/5 by 2,500+ traders
                    </small>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </Col>

          {/* Right Content - Animation */}
          <Col lg={6}>
            <motion.div
              initial={{ x: 100, opacity: 0, scale: 0.9 }}
              whileInView={{ x: 0, opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Card className="animation-card border-0 position-relative overflow-hidden">
                {/* Gradient Overlay */}
                <div className="animation-gradient"></div>
                
                <Card.Body className="position-relative z-2 p-4">
                  {/* Animated Chart Preview */}
                  <div className="chart-preview mb-4">
                    <div className="chart-header d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h6 className="text-white mb-1">NEPSE Index</h6>
                        <small className="text-success">+2.45% Today</small>
                      </div>
                      <Badge bg="success" className="live-badge">
                        <div className="pulse-dot"></div>
                        LIVE
                      </Badge>
                    </div>
                    
                    {/* Mock Chart */}
                    <div className="mock-chart">
                      <div className="chart-line"></div>
                      <div className="chart-points">
                        {[1, 2, 3, 4, 5, 6].map((point) => (
                          <div key={point} className="chart-point"></div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Trading Stats */}
                  <div className="trading-stats">
                    <Row className="g-3">
                      <Col xs={6}>
                        <div className="trading-stat text-center">
                          <div className="stat-value text-white fw-bold">NPR 1,00,000</div>
                          <small className="stat-label text-white-50">Virtual Balance</small>
                        </div>
                      </Col>
                      <Col xs={6}>
                        <div className="trading-stat text-center">
                          <div className="stat-value text-success fw-bold">+15.3%</div>
                          <small className="stat-label text-white-50">Avg. Returns</small>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* User Avatars */}
                  <div className="user-avatars mt-4">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="avatar-group me-3">
                          {[1, 2, 3, 4].map((avatar) => (
                            <div 
                              key={avatar} 
                              className="avatar-sm"
                              style={{ 
                                marginLeft: avatar > 1 ? '-8px' : '0',
                                zIndex: 5 - avatar
                              }}
                            >
                              <Users size={12} />
                            </div>
                          ))}
                        </div>
                        <small className="text-white-50">
                          Join 50K+ traders
                        </small>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="floating-arrow"
                      >
                        <ArrowRight size={20} className="text-primary" />
                      </motion.div>
                    </div>
                  </div>
                </Card.Body>

                {/* Floating Elements */}
                <div className="floating-elements">
                  <div className="floating-element element-1">
                    <TrendingUp size={24} />
                  </div>
                  <div className="floating-element element-2">
                    <BarChart3 size={20} />
                  </div>
                  <div className="floating-element element-3">
                    <LineChart size={22} />
                  </div>
                </div>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CTASection;