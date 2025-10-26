import React, { useState } from "react";
import { 
  Star, 
  Quote, 
  TrendingUp, 
  Users, 
  Award,
  ChevronLeft, 
  ChevronRight,
  Play,
  Pause
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import "../styles/testimonials.css";

const Testimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: "Rajesh Sharma",
      role: "Investment Banker",
      company: "NIBL Capital",
      avatar: "RS",
      content: "As an investment banker, I value reliable insights and real-time market data. This platform makes analyzing NEPSE trends simple and effective, saving me time and helping me make better decisions.",
      rating: 5,
      stats: { returns: "+45%", trades: "120+", experience: "3 years" },
      gradient: "from-blue-500 to-cyan-500",
      color: "#3b82f6",
      badge: "💼 Professional",
      featured: true
    },
    {
      id: 2,
      name: "Sabina Rai",
      role: "CA Student",
      company: "ICAI Nepal",
      avatar: "SR",
      content: "This platform connects theory with real market practice. It has improved my ability to analyze data and strengthened my financial knowledge in a practical way.",
      rating: 5,
      stats: { returns: "+32%", trades: "85+", experience: "1 year" },
      gradient: "from-green-500 to-emerald-500",
      color: "#10b981",
      badge: "🎓 Student",
      featured: false
    },
    {
      id: 3,
      name: "Anil Gurung",
      role: "Experienced Trader",
      company: "Full-time Trader",
      avatar: "AG",
      content: "I use this platform to test strategies before real trading. Its analytics and margin trading tools are very useful, helping me refine my approach and avoid costly mistakes.",
      rating: 5,
      stats: { returns: "+67%", trades: "200+", experience: "5 years" },
      gradient: "from-purple-500 to-pink-500",
      color: "#8b5cf6",
      badge: "📈 Expert",
      featured: true
    },
    {
      id: 4,
      name: "Priya Thapa",
      role: "Finance Student",
      company: "TU Finance",
      avatar: "PT",
      content: "As a finance student, I wanted to learn trading without risks. The virtual money feature let me practice confidently and understand strategies in a safe, realistic way.",
      rating: 5,
      stats: { returns: "+28%", trades: "65+", experience: "8 months" },
      gradient: "from-orange-500 to-red-500",
      color: "#f59e0b",
      badge: "🌟 Beginner",
      featured: false
    },
    {
      id: 5,
      name: "Suresh K.C.",
      role: "Business Owner",
      company: "KC Enterprises",
      avatar: "SK",
      content: "The risk management tools helped me protect my investments while learning. Now I confidently manage my portfolio with real insights gained from virtual trading.",
      rating: 5,
      stats: { returns: "+51%", trades: "150+", experience: "2 years" },
      gradient: "from-indigo-500 to-blue-500",
      color: "#6366f1",
      badge: "💎 Investor",
      featured: true
    },
    {
      id: 6,
      name: "Mina Maharjan",
      role: "Software Engineer",
      company: "Tech Solutions",
      avatar: "MM",
      content: "Being from tech background, I appreciated the clean interface and advanced analytics. It made complex trading concepts accessible and actionable.",
      rating: 5,
      stats: { returns: "+39%", trades: "95+", experience: "1.5 years" },
      gradient: "from-rose-500 to-pink-500",
      color: "#f43f5e",
      badge: "👩‍💻 Tech Pro",
      featured: false
    }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-play functionality
  React.useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, testimonials.length]);

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
    <section id="testimonials" className="testimonials-section position-relative overflow-hidden">
      {/* Background Elements */}
      <div className="testimonials-bg"></div>
      
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
            <Users size={16} className="me-2" />
            SUCCESS STORIES
          </Badge>
          <h2 className="display-5 fw-bold text-white mb-3">
            Trusted by 
            <span className="text-gradient"> 50,000+ Traders</span>
          </h2>
          <p className="lead text-white-50 mb-0">
            Real results from real people. Join our community of successful traders.
          </p>
        </motion.div>

        {/* Featured Testimonial Carousel */}
        <motion.div 
          className="featured-testimonial mb-5"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card className="featured-card border-0 position-relative overflow-hidden">
            {/* Gradient Overlay */}
            <div className={`featured-gradient bg-gradient-${testimonials[activeTestimonial].gradient.split(' ')[1]}`}></div>
            
            <Card.Body className="position-relative z-2 p-5">
              <Row className="align-items-center">
                <Col lg={8}>
                  {/* Quote Icon */}
                  <div className="quote-icon mb-4">
                    <Quote size={48} className="text-white opacity-25" />
                  </div>

                  {/* Content */}
                  <blockquote className="featured-content text-white mb-4">
                    "{testimonials[activeTestimonial].content}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="author-info">
                    <div className="d-flex align-items-center mb-3">
                      <div 
                        className={`avatar rounded-circle me-3 ${testimonials[activeTestimonial].gradient.split(' ')[1]}`}
                        style={{
                          width: "60px",
                          height: "60px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "white"
                        }}
                      >
                        {testimonials[activeTestimonial].avatar}
                      </div>
                      <div>
                        <h5 className="text-white mb-1">{testimonials[activeTestimonial].name}</h5>
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-white-50">{testimonials[activeTestimonial].role}</span>
                          <span className="text-white-50">•</span>
                          <span className="text-white-50">{testimonials[activeTestimonial].company}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="author-stats">
                      <Row className="g-3">
                        <Col xs={4}>
                          <div className="stat-item text-center">
                            <div className="stat-value text-success fw-bold">{testimonials[activeTestimonial].stats.returns}</div>
                            <small className="stat-label text-white-50">Returns</small>
                          </div>
                        </Col>
                        <Col xs={4}>
                          <div className="stat-item text-center">
                            <div className="stat-value text-white fw-bold">{testimonials[activeTestimonial].stats.trades}</div>
                            <small className="stat-label text-white-50">Trades</small>
                          </div>
                        </Col>
                        <Col xs={4}>
                          <div className="stat-item text-center">
                            <div className="stat-value text-warning fw-bold">{testimonials[activeTestimonial].stats.experience}</div>
                            <small className="stat-label text-white-50">Experience</small>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>

                <Col lg={4}>
                  {/* Rating & Badge */}
                  <div className="rating-section text-center">
                    <div className="rating-stars mb-3">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          size={24}
                          fill={index < testimonials[activeTestimonial].rating ? "#ffc107" : "none"}
                          color={index < testimonials[activeTestimonial].rating ? "#ffc107" : "#94a3b8"}
                        />
                      ))}
                    </div>
                    
                    <Badge bg="" className="featured-badge mb-4">
                      {testimonials[activeTestimonial].badge}
                    </Badge>

                    {testimonials[activeTestimonial].featured && (
                      <div className="featured-indicator">
                        <Award size={20} className="me-2" />
                        <span className="text-white">Featured Trader</span>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Body>

            {/* Navigation Controls */}
            <div className="carousel-controls">
              <button className="control-btn" onClick={prevTestimonial}>
                <ChevronLeft size={24} />
              </button>
              
              <button 
                className="control-btn play-pause"
                onClick={() => setAutoPlay(!autoPlay)}
              >
                {autoPlay ? <Pause size={20} /> : <Play size={20} />}
              </button>
              
              <button className="control-btn" onClick={nextTestimonial}>
                <ChevronRight size={24} />
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Row className="g-4">
            {testimonials.map((testimonial, index) => (
              <Col key={testimonial.id} lg={4} md={6}>
                <motion.div variants={itemVariants}>
                  <Card 
                    className={`testimonial-card h-100 border-0 position-relative overflow-hidden ${
                      activeTestimonial === index ? 'active' : ''
                    }`}
                    onClick={() => setActiveTestimonial(index)}
                  >
                    {/* Gradient Overlay */}
                    <div className={`testimonial-gradient bg-gradient-${testimonial.gradient.split(' ')[1]}`}></div>

                    <Card.Body className="position-relative z-2 p-4">
                      {/* Header */}
                      <div className="testimonial-header mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <div 
                            className="avatar rounded-circle"
                            style={{
                              width: "50px",
                              height: "50px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "16px",
                              fontWeight: "bold",
                              color: "white",
                              background: testimonial.color
                            }}
                          >
                            {testimonial.avatar}
                          </div>
                          <Badge bg="" className="custom-badge">
                            {testimonial.badge}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <blockquote className="testimonial-content text-white-50 mb-3">
                        "{testimonial.content}"
                      </blockquote>

                      {/* Rating */}
                      <div className="rating-stars mb-3">
                        {[...Array(5)].map((_, starIndex) => (
                          <Star
                            key={starIndex}
                            size={16}
                            fill={starIndex < testimonial.rating ? "#ffc107" : "none"}
                            color={starIndex < testimonial.rating ? "#ffc107" : "#94a3b8"}
                          />
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="testimonial-footer">
                        <h6 className="text-white mb-1">{testimonial.name}</h6>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-white-50">{testimonial.role}</small>
                          <div className="performance-indicator">
                            <TrendingUp size={14} className="text-success me-1" />
                            <small className="text-success">{testimonial.stats.returns}</small>
                          </div>
                        </div>
                      </div>
                    </Card.Body>

                    {/* Hover Effect */}
                    <div className="testimonial-hover-effect"></div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div 
          className="text-center mt-5"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="stats-card p-4 rounded-4">
            <Row className="g-4">
              <Col md={3}>
                <div className="stat-item-large text-center">
                  <div className="stat-value-large text-white fw-bold">50K+</div>
                  <small className="stat-label-large text-white-50">Active Traders</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="stat-item-large text-center">
                  <div className="stat-value-large text-success fw-bold">94%</div>
                  <small className="stat-label-large text-white-50">Success Rate</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="stat-item-large text-center">
                  <div className="stat-value-large text-warning fw-bold">4.9/5</div>
                  <small className="stat-label-large text-white-50">User Rating</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="stat-item-large text-center">
                  <div className="stat-value-large text-info fw-bold">NPR 2.5Cr+</div>
                  <small className="stat-label-large text-white-50">Virtual Trades</small>
                </div>
              </Col>
            </Row>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default Testimonials;