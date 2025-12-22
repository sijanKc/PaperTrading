import React, { useState } from "react";
import { Form, Button, Card, Container, Navbar, Row, Col, Modal } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  User, 
  ArrowRight, 
  Shield,
  TrendingUp,
  BarChart3,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData({
      ...forgotPasswordData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("✅ Login successful:", data);
        
        // Save token to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Redirect to dashboard
        window.location.href = "/dashboard";
        
      } else {
        alert(`❌ Login failed: ${data.message || "Invalid credentials"}`);
        console.error("Login error:", data);
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("⚠️ Server not responding. Please check your backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log("Forgot password for:", forgotPasswordData.email);
    alert(`Password reset link sent to ${forgotPasswordData.email}`);
    setShowForgotPassword(false);
    setForgotPasswordData({ email: "" });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const features = [
    { icon: <TrendingUp size={20} />, text: "Real-time NEPSE Data" },
    { icon: <BarChart3 size={20} />, text: "Advanced Analytics" },
    { icon: <Users size={20} />, text: "50K+ Traders" },
    { icon: <Shield size={20} />, text: "100% Risk-Free" }
  ];

  return (
    <div className="login-page">
      {/* Background Elements */}
      <div className="login-bg"></div>
      
      <Navbar bg="transparent" variant="dark" className="login-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand-logo">
            <motion.div 
              className="logo-wrapper"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="logo-icon">
                <Zap size={28} />
              </div>
              <div>
                <div className="brand-title">SANCHAYA</div>
                <div className="brand-subtitle">Paper Trading</div>
              </div>
            </motion.div>
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="login-container">
        <Row className="align-items-center min-vh-100">
          {/* Left Side - Features */}
          <Col lg={6} className="d-none d-lg-block">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="features-section"
            >
              <h2 className="display-5 fw-bold text-white mb-4">
                Master Trading with
                <span className="text-gradient"> Zero Risk</span>
              </h2>
              <p className="lead text-white-50 mb-5">
                Join 50,000+ traders practicing with virtual NPR 1,00,000. 
                Access real NEPSE data, advanced analytics, and build your skills risk-free.
              </p>

              <div className="features-list">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="feature-item d-flex align-items-center mb-3"
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="feature-icon-wrapper me-3">
                      {feature.icon}
                    </div>
                    <span className="text-white">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="stats-card mt-5">
                <Row className="text-center">
                  <Col xs={4}>
                    <div className="stat-item">
                      <div className="stat-value text-primary fw-bold">50K+</div>
                      <small className="stat-label text-white-50">Traders</small>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="stat-item">
                      <div className="stat-value text-success fw-bold">94%</div>
                      <small className="stat-label text-white-50">Success</small>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="stat-item">
                      <div className="stat-value text-warning fw-bold">4.9/5</div>
                      <small className="stat-label text-white-50">Rating</small>
                    </div>
                  </Col>
                </Row>
              </div>
            </motion.div>
          </Col>

          {/* Right Side - Login Form */}
          <Col lg={6}>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="form-section"
            >
              <Card className="login-card border-0">
                <Card.Body className="p-5">
                  {/* Header */}
                  <div className="text-center mb-5">
                    <motion.div
                      className="login-icon-wrapper mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Lock size={32} className="login-icon" />
                    </motion.div>
                    <h2 className="fw-bold mb-2 title-gradient">
                      Welcome Back
                    </h2>
                    <p className="text-white-50">Sign in to your trading dashboard</p>
                  </div>

                  {/* Login Form */}
                  <Form onSubmit={handleLogin} className="form-container">
                    <Row>
                      <Col md={12} className="mb-4">
                        <Form.Label className="form-label fw-semibold">
                          <User size={16} className="me-2" />
                          Username or Email
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="Enter your username or email"
                          className="form-input"
                          required
                        />
                      </Col>
                      
                      <Col md={12} className="mb-4">
                        <Form.Label className="form-label fw-semibold">
                          <Lock size={16} className="me-2" />
                          Password
                        </Form.Label>
                        <div className="password-input-wrapper">
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="form-input password-input"
                            required
                          />
                          <Button
                            variant="link"
                            className="password-toggle"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </Button>
                        </div>
                      </Col>
                      
                      <Col md={12} className="mb-4">
                        <Form.Check
                          type="checkbox"
                          name="rememberMe"
                          label="Remember me for 30 days"
                          checked={formData.rememberMe}
                          onChange={handleChange}
                          className="form-check"
                        />
                      </Col>
                    </Row>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        type="submit" 
                        className="login-btn w-100 py-3"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Signing In...
                          </>
                        ) : (
                          <>
                            <Zap size={18} className="me-2" />
                            Sign In to Dashboard
                            <ArrowRight size={18} className="ms-2" />
                          </>
                        )}
                      </Button>
                    </motion.div>

                    <div className="text-center mt-4">
                      <Link 
                        to="/forgot-password" 
                        className="forgot-password-link text-decoration-none"
                      >
                        Forgot your password?
                      </Link>
                    </div>

                    <div className="text-center mt-4 pt-3 border-top border-slate-600">
                      <p className="text-white-50 mb-0">
                        Don't have an account?{" "}
                        <Link to="/signup" className="signup-link">
                          Create account
                          <ArrowRight size={14} className="ms-1" />
                        </Link>
                      </p>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>

      {/* Forgot Password Modal - Kept for backward compatibility if needed, but link above goes to new page */}
      <AnimatePresence>
        {showForgotPassword && (
          <Modal 
            show={showForgotPassword} 
            onHide={() => setShowForgotPassword(false)}
            centered
            className="auth-modal"
            backdrop="static"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Modal.Content className="modal-content-custom">
                <Modal.Header className="modal-header-custom">
                  <Modal.Title className="title-gradient">
                    <Shield size={24} className="me-2" />
                    Reset Password
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body-custom">
                  <p className="text-white-50 mb-4">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                  <Form onSubmit={handleForgotPassword}>
                    <Row>
                      <Col md={12} className="mb-4">
                        <Form.Label className="form-label fw-semibold">
                          <Mail size={16} className="me-2" />
                          Email Address
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={forgotPasswordData.email}
                          onChange={handleForgotPasswordChange}
                          placeholder="Enter your registered email"
                          className="form-input"
                          required
                        />
                      </Col>
                    </Row>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button type="submit" className="login-btn w-100 py-3">
                        <Zap size={18} className="me-2" />
                        Send Reset Link
                      </Button>
                    </motion.div>
                  </Form>
                </Modal.Body>
                <Modal.Footer className="modal-footer-custom">
                  <Button 
                    variant="outline-light" 
                    className="btn-outline-custom"
                    onClick={() => setShowForgotPassword(false)}
                  >
                    Cancel
                  </Button>
                </Modal.Footer>
              </Modal.Content>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;