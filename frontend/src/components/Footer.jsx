import React, { useState } from "react";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Github, 
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Zap,
  TrendingUp,
  Shield,
  Users,
  Send,
  Heart
} from "lucide-react";
import { motion } from "framer-motion";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import "../styles/footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      // Reset after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/#features" },
    { name: "How It Works", path: "/#how-it-works" },
    { name: "Testimonials", path: "/#testimonials" },
    { name: "Pricing", path: "/pricing" }
  ];

  const platformLinks = [
    { name: "Virtual Trading", path: "/virtual-trading" },
    { name: "Market Data", path: "/market-data" },
    { name: "Analytics", path: "/analytics" },
    { name: "Risk Management", path: "/risk-management" },
    { name: "Learning Center", path: "/learn" }
  ];

  const supportLinks = [
    { name: "Help Center", path: "/help" },
    { name: "Contact Us", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Blog", path: "/blog" }
  ];

  const socialLinks = [
    { icon: <Facebook size={18} />, url: "#", name: "Facebook" },
    { icon: <Twitter size={18} />, url: "#", name: "Twitter" },
    { icon: <Linkedin size={18} />, url: "#", name: "LinkedIn" },
    { icon: <Instagram size={18} />, url: "#", name: "Instagram" },
    { icon: <Github size={18} />, url: "#", name: "GitHub" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
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
    <footer className="footer-section position-relative overflow-hidden">
      {/* Background Elements */}
      <div className="footer-bg"></div>
      
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Row className="g-5">
            {/* Brand & Description */}
            <Col lg={4}>
              <motion.div variants={itemVariants} className="brand-section">
                <div className="d-flex align-items-center mb-3">
                  <div className="footer-logo-wrapper me-3">
                    <Zap size={28} className="text-warning" />
                  </div>
                  <h4 className="text-white fw-bold mb-0">SANCHAYA</h4>
                </div>
                <p className="text-white-50 mb-4">
                  Master NEPSE trading with zero risk. Practice with virtual money, 
                  access real-time market data, and build your investment skills in 
                  a safe, simulated environment.
                </p>
                
                {/* Contact Info */}
                <div className="contact-info">
                  <div className="contact-item d-flex align-items-center mb-2">
                    <Mail size={16} className="text-primary me-3" />
                    <span className="text-white-50">sanchayacool@.com</span>
                  </div>
                  <div className="contact-item d-flex align-items-center mb-2">
                    <Phone size={16} className="text-success me-3" />
                    <span className="text-white-50">+977 9841000000</span>
                  </div>
                  <div className="contact-item d-flex align-items-start">
                    <MapPin size={16} className="text-warning me-3 mt-1" />
                    <span className="text-white-50">Kathmandu, Nepal</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="social-links mt-4">
                  <div className="d-flex gap-2">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.url}
                        className="social-link"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Col>

            {/* Quick Links */}
            <Col lg={2} md={4}>
              <motion.div variants={itemVariants}>
                <h6 className="footer-heading text-white mb-4">Quick Links</h6>
                <ul className="footer-links list-unstyled">
                  {quickLinks.map((link, index) => (
                    <li key={index} className="mb-2">
                      <HashLink 
                        to={link.path} 
                        className="footer-link text-white-50"
                      >
                        <ArrowRight size={14} className="me-2" />
                        {link.name}
                      </HashLink>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Col>

            {/* Platform */}
            <Col lg={2} md={4}>
              <motion.div variants={itemVariants}>
                <h6 className="footer-heading text-white mb-4">Platform</h6>
                <ul className="footer-links list-unstyled">
                  {platformLinks.map((link, index) => (
                    <li key={index} className="mb-2">
                      <Link 
                        to={link.path} 
                        className="footer-link text-white-50"
                      >
                        <TrendingUp size={14} className="me-2" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Col>

            {/* Support */}
            <Col lg={2} md={4}>
              <motion.div variants={itemVariants}>
                <h6 className="footer-heading text-white mb-4">Support</h6>
                <ul className="footer-links list-unstyled">
                  {supportLinks.map((link, index) => (
                    <li key={index} className="mb-2">
                      <Link 
                        to={link.path} 
                        className="footer-link text-white-50"
                      >
                        <Shield size={14} className="me-2" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Col>

            {/* Newsletter */}
            <Col lg={2}>
              <motion.div variants={itemVariants}>
                <h6 className="footer-heading text-white mb-4">Stay Updated</h6>
                <div className="newsletter-section">
                  <p className="text-white-50 small mb-3">
                    Get trading insights, market updates, and platform news.
                  </p>
                  
                  <Form onSubmit={handleSubscribe}>
                    <div className="newsletter-form">
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="newsletter-input mb-2"
                        required
                      />
                      <Button 
                        type="submit" 
                        className="newsletter-btn w-100"
                        disabled={isSubscribed}
                      >
                        {isSubscribed ? (
                          <>
                            <Send size={16} className="me-2" />
                            Subscribed!
                          </>
                        ) : (
                          <>
                            <Send size={16} className="me-2" />
                            Subscribe
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>

                  {/* Trust Badge */}
                  <div className="trust-badge mt-3 p-3 rounded">
                    <div className="d-flex align-items-center mb-2">
                      <Users size={16} className="text-success me-2" />
                      <small className="text-white-50">50,000+ Traders</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <Shield size={16} className="text-primary me-2" />
                      <small className="text-white-50">100% Secure</small>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>

          {/* Bottom Section */}
          <motion.div 
            variants={itemVariants}
            className="footer-bottom mt-5 pt-4 border-top border-slate-600"
          >
            <Row className="align-items-center">
              <Col md={6}>
                <div className="text-center text-md-start">
                  <p className="text-white-50 mb-0">
                    &copy; {new Date().getFullYear()} Sanchaya. Made with{" "}
                    <Heart size={14} className="text-danger mx-1" />
                    in Nepal
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className="text-center text-md-end">
                  <small className="text-white-50">
                    Empowering {">"}50K traders to master NEPSE trading
                  </small>
                </div>
              </Col>
            </Row>
          </motion.div>
        </motion.div>
      </Container>
    </footer>
  );
};

export default Footer;