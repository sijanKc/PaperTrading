import React from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import { motion } from "framer-motion";
import { 
  UserPlus, 
  Wallet, 
  TrendingUp, 
  BarChart3, 
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  Zap
} from "lucide-react";
import "../styles/howItWorks.css";

const steps = [
  {
    number: "01",
    icon: <UserPlus size={32} />,
    title: "Sign Up",
    description: "Quick & simple registration",
    details: "Create your account in just a few clicks. All you need is your email address, and you'll instantly unlock access to the trading dashboard.",
    badge: "🚀 Instant Setup",
    duration: "2 mins",
    features: ["Email verification", "Profile setup", "Dashboard access"],
    gradient: "from-blue-500 to-cyan-500",
    color: "#3b82f6"
  },
  {
    number: "02",
    icon: <Wallet size={32} />,
    title: "Get Virtual Money",
    description: "Start with NPR 1,00,000",
    details: "We'll credit your demo wallet with NPR 1,00,000 virtual balance. Use this risk-free money to practice real market trades and build confidence.",
    badge: "💸 Risk-Free",
    duration: "Instant",
    features: ["NPR 1,00,000 virtual cash", "Real-time balance", "Portfolio tracking"],
    gradient: "from-green-500 to-emerald-500",
    color: "#10b981"
  },
  {
    number: "03",
    icon: <TrendingUp size={32} />,
    title: "Practice Trading",
    description: "Simulate real NEPSE trades",
    details: "Buy and sell shares of companies listed in NEPSE just like in real trading. Experience market ups & downs, manage your portfolio, and try new strategies.",
    badge: "📈 Live Simulation",
    duration: "Real-time",
    features: ["Live NEPSE data", "Real trading interface", "Strategy testing"],
    gradient: "from-purple-500 to-pink-500",
    color: "#8b5cf6"
  },
  {
    number: "04",
    icon: <BarChart3 size={32} />,
    title: "Track Performance",
    description: "Improve with insights",
    details: "View detailed reports of your trades, profit/loss charts, and performance analytics. Learn from mistakes, refine your strategy, and grow like a pro trader.",
    badge: "📊 Analytics",
    duration: "24/7 Monitoring",
    features: ["Performance metrics", "P&L analysis", "Progress tracking"],
    gradient: "from-orange-500 to-red-500",
    color: "#f59e0b"
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="how-it-works-section position-relative overflow-hidden">
      {/* Background Elements */}
      <div className="how-it-works-bg"></div>
      
      <Container>
        {/* Section Header */}
        <motion.div 
          className="text-center mb-5"
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Badge bg="primary" className="section-badge mb-3">
            <Zap size={16} className="me-2" />
            GET STARTED
          </Badge>
          <h2 className="display-5 fw-bold text-white mb-3">
            Start Trading in 
            <span className="text-gradient"> 4 Simple Steps</span>
          </h2>
          <p className="lead text-white-50 mb-0">
            Go from beginner to pro trader with our guided learning path
          </p>
        </motion.div>

        {/* Steps Grid */}
        <Row className="g-4">
          {steps.map((step, index) => (
            <Col lg={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="step-card h-100 border-0 position-relative overflow-hidden">
                  {/* Step Badge */}
                  <div className="step-badge">
                    <Badge bg="" className="custom-badge">
                      {step.badge}
                    </Badge>
                  </div>

                  {/* Gradient Overlay */}
                  <div className={`step-gradient bg-gradient-${step.gradient.split(' ')[1]}`}></div>

                  {/* Progress Line */}
                  {index < steps.length - 1 && (
                    <div className="progress-line d-none d-lg-block">
                      <div className="progress-connector"></div>
                      <ArrowRight size={20} className="progress-arrow" />
                    </div>
                  )}

                  {/* Card Content */}
                  <Card.Body className="position-relative z-2 p-4">
                    <Row className="g-3 align-items-center">
                      {/* Left Column - Number & Icon */}
                      <Col xs="auto">
                        <div className="step-indicator">
                          <div className="step-number-wrapper">
                            <div className="step-number">{step.number}</div>
                            <div className="step-icon">
                              {step.icon}
                            </div>
                          </div>
                          <div className="step-duration">
                            <PlayCircle size={14} className="me-1" />
                            {step.duration}
                          </div>
                        </div>
                      </Col>

                      {/* Right Column - Content */}
                      <Col>
                        <div className="step-content">
                          <Card.Title className="step-title text-white mb-2">
                            {step.title}
                          </Card.Title>
                          <Card.Text className="step-description text-white-50 mb-3">
                            {step.description}
                          </Card.Text>
                          
                          <div className="step-features mb-3">
                            {step.features.map((feature, idx) => (
                              <div key={idx} className="feature-item">
                                <CheckCircle2 size={16} className="feature-check" />
                                <small className="text-white-50">{feature}</small>
                              </div>
                            ))}
                          </div>

                          <Card.Text className="step-details text-white-50 small mb-0">
                            {step.details}
                          </Card.Text>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>

                  {/* Hover Effect */}
                  <div className="step-hover-effect"></div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-5"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="cta-card p-4 rounded-4">
            <div className="cta-content">
              <h4 className="text-white mb-2">Ready to Begin Your Trading Journey?</h4>
              <p className="text-white-50 mb-3">Join 50,000+ traders who started with our virtual platform</p>
              <div className="cta-stats">
                <Row className="g-4">
                  <Col xs={4}>
                    <div className="stat-item text-center">
                      <div className="stat-value text-white fw-bold">50K+</div>
                      <small className="stat-label text-white-50">Traders</small>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="stat-item text-center">
                      <div className="stat-value text-success fw-bold">95%</div>
                      <small className="stat-label text-white-50">Success Rate</small>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="stat-item text-center">
                      <div className="stat-value text-warning fw-bold">2 mins</div>
                      <small className="stat-label text-white-50">Setup Time</small>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="cta-buttons mt-4">
                <button className="btn btn-primary btn-lg me-3">
                  <UserPlus size={18} className="me-2" />
                  Start Free Trial
                </button>
                <button className="btn btn-outline-light btn-lg">
                  <PlayCircle size={18} className="me-2" />
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default HowItWorks;