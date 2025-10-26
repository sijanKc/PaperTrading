import React, { useState } from "react";
import { Activity, BarChart3, Users, DollarSign, TrendingUp, Shield, Zap, Target, LineChart, PieChart } from "lucide-react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/features.module.css";

// Local images import - Use dashboard-style illustrations
import portfolioImg from "../assets/features/portfolio.jpg";
import marketImg from "../assets/features/market.jpg";
import analyticsImg from "../assets/features/analytics.jpg";
import insightsImg from "../assets/features/insights.jpg";
import marginImg from "../assets/features/margin.jpg";

const features = [
  {
    icon: <Activity className={styles.featureIcon} size={32} />,
    image: portfolioImg,
    title: "Virtual Portfolio",
    badge: "🎮 Practice Mode",
    description: "Build and manage a risk-free portfolio with NPR 1,00,000 virtual money",
    highlights: ["Real-time P&L tracking", "Portfolio diversification", "Risk-free learning"],
    stats: { users: "10K+", success: "95%", experience: "Beginner Friendly" },
    gradient: "from-blue-500 to-cyan-500",
    color: "#3b82f6",
    details: `A Virtual Portfolio lets you practice stock trading without risking real money. You get NPR 1,00,000 virtual funds to build and manage your portfolio. Test strategies, track performance, and learn market dynamics in a safe environment.`
  },
  {
    icon: <BarChart3 className={styles.featureIcon} size={32} />,
    image: marketImg,
    title: "Live Market Data",
    badge: "📊 Real-time",
    description: "Real-time NEPSE data with live prices, charts, and market movements",
    highlights: ["Live NEPSE index", "Instant price updates", "Market depth analysis"],
    stats: { users: "15K+", success: "99.9%", experience: "All Levels" },
    gradient: "from-green-500 to-emerald-500",
    color: "#10b981",
    details: `Live Market Data provides real-time updates of NEPSE. See latest stock prices, track intraday charts, volume, and trading activity. Never miss an opportunity with instant market updates.`
  },
  {
    icon: <TrendingUp className={styles.featureIcon} size={32} />,
    image: analyticsImg,
    title: "Advanced Analytics",
    badge: "📈 Pro Tools",
    description: "Professional analytical tools, indicators, and data visualizations",
    highlights: ["Technical indicators", "Performance metrics", "Risk analysis"],
    stats: { users: "8K+", success: "92%", experience: "Advanced" },
    gradient: "from-purple-500 to-pink-500",
    color: "#8b5cf6",
    details: `Advanced Analytics gives you powerful tools for smarter trading. Access technical indicators like Moving Averages, RSI, MACD. View detailed charts and analyze market trends with professional-grade tools.`
  },
  {
    icon: <Users className={styles.featureIcon} size={32} />,
    image: insightsImg,
    title: "Market Insights",
    badge: "💡 Smart Data",
    description: "Expert research, market news, and intelligent trend analysis",
    highlights: ["Expert analysis", "News aggregation", "Trend predictions"],
    stats: { users: "12K+", success: "88%", experience: "Intermediate" },
    gradient: "from-orange-500 to-red-500",
    color: "#f59e0b",
    details: `Market Insights keeps you informed with expert knowledge. Read latest financial news, economic updates, and stock research. Combine data with expert opinions for smarter trading decisions.`
  },
  {
    icon: <DollarSign className={styles.featureIcon} size={32} />,
    image: marginImg,
    title: "Margin Trading",
    badge: "⚡ Advanced",
    description: "Leveraged trading to amplify buying power and profit potential",
    highlights: ["Leverage options", "Risk management", "Advanced strategies"],
    stats: { users: "5K+", success: "85%", experience: "Expert" },
    gradient: "from-red-500 to-rose-500",
    color: "#ef4444",
    details: `Margin Trading allows you to borrow money to increase buying power. Trade larger positions with limited capital. Manage risk carefully while exploring advanced trading opportunities.`
  },
  {
    icon: <Shield className={styles.featureIcon} size={32} />,
    image: portfolioImg,
    title: "Risk Management",
    badge: "🛡️ Safety",
    description: "Advanced risk assessment and portfolio protection tools",
    highlights: ["Risk scoring", "Portfolio insurance", "Stop-loss automation"],
    stats: { users: "9K+", success: "96%", experience: "All Levels" },
    gradient: "from-indigo-500 to-blue-500",
    color: "#6366f1",
    details: `Comprehensive risk management tools to protect your investments. Get risk scores, set automated stop-losses, and implement portfolio protection strategies.`
  }
];

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const handleClose = () => setActiveFeature(null);

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
    <section id="features" className={`${styles.featuresSection} position-relative overflow-hidden`}>
      {/* Background Elements */}
      <div className={styles.featuresBg}></div>
      
      <Container>
        {/* Section Header */}
        <motion.div 
          className="text-center mb-5"
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Badge bg="primary" className={`${styles.sectionBadge} mb-3`}>
            <Zap size={16} className="me-2" />
            POWERFUL FEATURES
          </Badge>
          <h2 className="display-5 fw-bold text-white mb-3">
            Everything You Need to 
            <span className={styles.textGradient}> Master Trading</span>
          </h2>
          <p className="lead text-white-50 mb-0">
            Professional tools and insights used by successful NEPSE traders
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col key={index} lg={4} md={6}>
                <motion.div variants={itemVariants}>
                  <Card 
                    className={`${styles.featureCard} h-100 border-0 position-relative overflow-hidden ${
                      hoveredFeature === index ? styles.featureCardHovered : ''
                    }`}
                    onMouseEnter={() => setHoveredFeature(index)}
                    onMouseLeave={() => setHoveredFeature(null)}
                    onClick={() => setActiveFeature(feature)}
                  >
                    {/* Feature Badge */}
                    <div className={styles.featureBadge}>
                      <Badge bg="" className={styles.customBadge}>
                        {feature.badge}
                      </Badge>
                    </div>

                    {/* Gradient Overlay */}
                    <div className={`${styles.featureGradient} bg-gradient-${feature.gradient.split(' ')[1]}`}></div>

                    {/* Card Content */}
                    <Card.Body className="position-relative z-2 p-4">
                      {/* Icon */}
                      <div className={styles.featureIconWrapper}>
                        {feature.icon}
                      </div>

                      {/* Title & Description */}
                      <Card.Title className={`${styles.featureTitle} text-white mb-2`}>
                        {feature.title}
                      </Card.Title>
                      <Card.Text className={`${styles.featureDescription} text-white-50 mb-3`}>
                        {feature.description}
                      </Card.Text>

                      {/* Highlights */}
                      <div className={styles.featureHighlights}>
                        {feature.highlights.map((highlight, idx) => (
                          <div key={idx} className={styles.highlightItem}>
                            <div className={styles.highlightDot}></div>
                            <small className="text-white-50">{highlight}</small>
                          </div>
                        ))}
                      </div>

                      {/* Stats - Fixed Alignment */}
                      <div className={styles.featureStats}>
                        <Row className="g-2 text-center align-items-center">
                          <Col xs={4}>
                            <div className={styles.statItem}>
                              <div className={`${styles.statValue} text-white fw-bold mb-1`}>{feature.stats.users}</div>
                              <small className={`${styles.statLabel} text-white-50`}>Users</small>
                            </div>
                          </Col>
                          <Col xs={4}>
                            <div className={styles.statItem}>
                              <div className={`${styles.statValue} text-success fw-bold mb-1`}>{feature.stats.success}</div>
                              <small className={`${styles.statLabel} text-white-50`}>Success</small>
                            </div>
                          </Col>
                          <Col xs={4}>
                            <div className={styles.statItem}>
                              <div className={`${styles.statValue} text-warning fw-bold mb-1`}>{feature.stats.experience}</div>
                              <small className={`${styles.statLabel} text-white-50`}>Level</small>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      {/* CTA Button */}
                      <div className="text-center mt-3">
                        <Button 
                          variant="outline-light" 
                          size="sm"
                          className={styles.featureCtaBtn}
                        >
                          Explore Feature
                          <TrendingUp size={16} className="ms-2" />
                        </Button>
                      </div>
                    </Card.Body>

                    {/* Hover Effect */}
                    <div className={styles.featureHoverEffect}></div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-5"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className={`${styles.ctaCard} p-4 rounded-4`}>
            <Target size={48} className="text-primary mb-3" />
            <h4 className="text-white mb-2">Ready to Start Your Trading Journey?</h4>
            <p className="text-white-50 mb-3">Join thousands of successful traders using our platform</p>
            <Button size="lg" className={styles.ctaPrimaryBtn}>
              <LineChart size={20} className="me-2" />
              Start Trading Now
            </Button>
          </div>
        </motion.div>
      </Container>

      {/* Feature Modal */}
      <AnimatePresence>
        {activeFeature && (
          <motion.div
            className={styles.featureModalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className={styles.featureModalContent}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.featureModalHeader}>
                <div className={styles.featureModalIcon}>
                  {activeFeature.icon}
                </div>
                <div>
                  <h3 className="text-white mb-1">{activeFeature.title}</h3>
                  <Badge bg="" className={styles.customBadge}>
                    {activeFeature.badge}
                  </Badge>
                </div>
                <Button 
                  variant="link" 
                  className={`${styles.closeBtn} text-white-50`}
                  onClick={handleClose}
                >
                  ✕
                </Button>
              </div>
              
              <div className={styles.featureModalBody}>
                <p className="text-white-50 mb-4">{activeFeature.details}</p>
                
                <div className={styles.featureModalHighlights}>
                  <h6 className="text-white mb-3">Key Features:</h6>
                  {activeFeature.highlights.map((highlight, idx) => (
                    <div key={idx} className={styles.highlightItemModal}>
                      <div className={styles.highlightDotModal}></div>
                      <span className="text-white-50">{highlight}</span>
                    </div>
                  ))}
                </div>

                <div className={`${styles.featureModalStats} mt-4`}>
                  <Row className="g-3">
                    <Col xs={4}>
                      <div className={styles.statCardModal}>
                        <div className={`${styles.statValueModal} text-white fw-bold mb-1`}>{activeFeature.stats.users}</div>
                        <small className={`${styles.statLabelModal} text-white-50`}>Active Users</small>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className={styles.statCardModal}>
                        <div className={`${styles.statValueModal} text-success fw-bold mb-1`}>{activeFeature.stats.success}</div>
                        <small className={`${styles.statLabelModal} text-white-50`}>Success Rate</small>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className={styles.statCardModal}>
                        <div className={`${styles.statValueModal} text-warning fw-bold mb-1`}>{activeFeature.stats.experience}</div>
                        <small className={`${styles.statLabelModal} text-white-50`}>Experience Level</small>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>

              <div className={styles.featureModalFooter}>
                <Button className={`w-100 ${styles.modalCtaBtn}`}>
                  <PieChart size={18} className="me-2" />
                  Try This Feature Now
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Features;