import React, { useState } from "react";
import { Form, Button, Card, Container, Navbar, Row, Col } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Lock, 
  Mail, 
  ArrowRight, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/login.css"; // Reuse login styles for consistency

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: Reset Password, 3: Success
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Step 1: Verify Email
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    if (!email) {
        alert("Please enter your email address");
        return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok && data.exists) {
        setStep(2); // Move to password reset step
      } else {
        alert(data.message || "Email not found in our records.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (password.length < 8) {
        alert("Password must be at least 8 characters");
        return;
    }
    
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password-direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setStep(3); // Move to success step
      } else {
        alert(data.message || "Failed to reset password");
      }
    } catch (error) {
        console.error("Error:", error);
        alert("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={8} lg={5}>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="login-card border-0">
                <Card.Body className="p-5">
                  <div className="text-center mb-5">
                    <motion.div
                      className="login-icon-wrapper mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Shield size={32} className="login-icon" />
                    </motion.div>
                    <h2 className="fw-bold mb-2 title-gradient">
                      {step === 1 ? "Forgot Password?" : step === 2 ? "Reset Password" : "Password Reset!"}
                    </h2>
                    <p className="text-white-50">
                      {step === 1 
                        ? "Enter your email to verify your account" 
                        : step === 2 
                        ? "Create a new strong password for your account"
                        : "Your password has been securely updated"
                      }
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <Form onSubmit={handleVerifyEmail} className="form-container">
                          <Form.Group className="mb-4">
                            <Form.Label className="form-label fw-semibold">
                              <Mail size={16} className="me-2" />
                              Email Address
                            </Form.Label>
                            <Form.Control
                              type="email"
                              placeholder="Enter your registered email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="form-input"
                              required
                            />
                          </Form.Group>
                          <Button 
                            type="submit" 
                            className="login-btn w-100 py-3"
                            disabled={isLoading}
                          >
                            {isLoading ? "Verifying..." : "Verify Email"} <ArrowRight size={18} className="ms-2" />
                          </Button>
                        </Form>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <Form onSubmit={handleResetPassword} className="form-container">
                          <Form.Group className="mb-4">
                            <Form.Label className="form-label fw-semibold">
                              <Lock size={16} className="me-2" />
                              New Password
                            </Form.Label>
                            <div className="password-input-wrapper">
                                <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Min 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input password-input"
                                required
                                />
                                <Button
                                    variant="link"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </Button>
                            </div>
                          </Form.Group>
                          <Form.Group className="mb-4">
                            <Form.Label className="form-label fw-semibold">
                              <CheckCircle size={16} className="me-2" />
                              Confirm Password
                            </Form.Label>
                            <Form.Control
                              type="password"
                              placeholder="Re-enter new password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="form-input"
                              required
                            />
                          </Form.Group>
                          <Button 
                            type="submit" 
                            className="login-btn w-100 py-3"
                            disabled={isLoading}
                          >
                            {isLoading ? "Resetting..." : "Reset Password"} <ArrowRight size={18} className="ms-2" />
                          </Button>
                        </Form>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                      >
                        <div className="mb-4 text-success">
                          <CheckCircle size={64} />
                        </div>
                        <h4 className="text-white mb-4">You're all set!</h4>
                        <Link to="/login">
                          <Button className="login-btn w-100 py-3">
                            Back to Login
                          </Button>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="text-center mt-4 pt-3 border-top border-slate-600">
                    <Link to="/login" className="text-white-50 text-decoration-none hover-white">
                      Back to Login
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPassword;
