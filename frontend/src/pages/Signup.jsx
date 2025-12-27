import React, { useState, useEffect } from "react";
import { Form, Button, Card, Container, Navbar, Row, Col } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  User, 
  Building, 
  Lock, 
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Shield,
  Mail,
  Phone,
  MapPin,
  CreditCard
} from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/Signup.css";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    nationality: "",
    citizenNo: "",
    countryCode: "+977",
    mobile: "",
    email: "",
    address: "",
    bankName: "",
    branch: "",
    accountNumber: "",
    accountType: "",
    username: "",
    password: "",
    confirmPassword: "",
    confirmInfo: false,
    confirmPaperTrading: false,
  });
  const [todayStr, setTodayStr] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const today = new Date();
    const todayAdStr = today.toISOString().split('T')[0];
    setTodayStr(todayAdStr);
  }, []);

  // Selected 15 countries with proper validation
  const countries = [
    { code: "+977", name: "Nepal", flag: "🇳🇵", pattern: /^[9][6-8]\d{8}$/, example: "98XXXXXXXX", length: 10 },
    { code: "+91", name: "India", flag: "🇮🇳", pattern: /^[6-9]\d{9}$/, example: "98XXXXXXXX", length: 10 },
    { code: "+1", name: "USA/Canada", flag: "🇺🇸", pattern: /^\d{10}$/, example: "5551234567", length: 10 },
    { code: "+44", name: "UK", flag: "🇬🇧", pattern: /^\d{10,11}$/, example: "7912345678", length: "10-11" },
    { code: "+86", name: "China", flag: "🇨🇳", pattern: /^\d{11}$/, example: "13123456789", length: 11 },
    { code: "+81", name: "Japan", flag: "🇯🇵", pattern: /^\d{10,11}$/, example: "9012345678", length: "10-11" },
    { code: "+82", name: "South Korea", flag: "🇰🇷", pattern: /^\d{9,10}$/, example: "1023456789", length: "9-10" },
    { code: "+65", name: "Singapore", flag: "🇸🇬", pattern: /^\d{8}$/, example: "91234567", length: 8 },
    { code: "+60", name: "Malaysia", flag: "🇲🇾", pattern: /^\d{9,10}$/, example: "123456789", length: "9-10" },
    { code: "+971", name: "UAE", flag: "🇦🇪", pattern: /^\d{9}$/, example: "501234567", length: 9 },
    { code: "+966", name: "Saudi Arabia", flag: "🇸🇦", pattern: /^\d{9}$/, example: "512345678", length: 9 },
    { code: "+61", name: "Australia", flag: "🇦🇺", pattern: /^\d{9}$/, example: "412345678", length: 9 },
    { code: "+64", name: "New Zealand", flag: "🇳🇿", pattern: /^\d{9,10}$/, example: "211234567", length: "9-10" },
    { code: "+49", name: "Germany", flag: "🇩🇪", pattern: /^\d{10,11}$/, example: "1512345678", length: "10-11" },
    { code: "+33", name: "France", flag: "🇫🇷", pattern: /^\d{9}$/, example: "612345678", length: 9 }
  ];

  const banks = [
    { name: "Select Bank", branches: [] },
    { name: "Nabil Bank Limited", branches: ["Kathmandu Main", "New Road", "Thamel", "Lazimpat", "Durbarmarg"] },
    { name: "Nepal Investment Bank Limited (NIBL)", branches: ["Head Office", "New Road", "Kamaladi", "Putalisadak", "Chabahil"] },
    { name: "Standard Chartered Bank Nepal", branches: ["Hattisar", "New Road", "Kamaladi", "Durbar Marg"] },
    { name: "Himalayan Bank Limited", branches: ["Thamel", "New Road", "Kamaladi", "Maharajgunj", "Pulchowk"] },
    { name: "Nepal SBI Bank Limited", branches: ["Hattisar", "Kamaladi", "New Road", "Lainchaur", "Tangal"] },
    { name: "Everest Bank Limited", branches: ["Lazimpat", "New Road", "Putalisadak", "Dillibazar"] },
    { name: "Kumari Bank Limited", branches: ["Durbarmarg", "New Road", "Putalisadak", "Baneshwor"] },
    { name: "Global IME Bank Limited", branches: ["Kamaladi", "New Road", "Putalisadak", "Balaju"] },
    { name: "NMB Bank Limited", branches: ["Babarmahal", "New Road", "Durbarmarg", "Maharajgunj"] },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const getCurrentCountry = () => {
    return countries.find(country => country.code === formData.countryCode);
  };

  const validateMobile = () => {
    const { mobile } = formData;
    const currentCountry = getCurrentCountry();
    
    if (!mobile) {
      alert("Mobile number is required.");
      return false;
    }

    if (!currentCountry) {
      alert("Please select a valid country code.");
      return false;
    }

    if (!currentCountry.pattern.test(mobile)) {
      alert(`Invalid ${currentCountry.name} number! Format: ${currentCountry.example} (${currentCountry.length} digits)`);
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (step === 1 && !validatePersonalInfo()) return;
    if (step === 2 && !validateBankInfo()) return;
    if (step === 3 && !validateAccountInfo()) return;
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const validatePersonalInfo = () => {
    if (!formData.fullName.trim()) {
      alert("Full Name is required.");
      return false;
    }
    if (!formData.dob) {
      alert("Date of Birth is required.");
      return false;
    }
    const today = new Date();
    const birthDate = new Date(formData.dob);
    if (birthDate >= today) {
      alert("Date of Birth must be before today.");
      return false;
    }
    if (!formData.gender) {
      alert("Gender is required.");
      return false;
    }
    if (!formData.nationality.trim()) {
      alert("Nationality is required.");
      return false;
    }
    if (!/^[0-9]{6,12}$/.test(formData.citizenNo)) {
      alert("Please enter a valid Citizenship Number (6–12 digits).");
      return false;
    }
    if (!formData.countryCode) {
      alert("Country code is required.");
      return false;
    }
    if (!validateMobile()) return false;
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Please enter a valid email address.");
      return false;
    }
    if (!formData.address.trim()) {
      alert("Address is required.");
      return false;
    }
    return true;
  };

  const validateBankInfo = () => {
    if (!formData.bankName || formData.bankName === "Select Bank") {
      alert("Please select a valid bank.");
      return false;
    }
    if (!formData.branch) {
      alert("Please select a branch.");
      return false;
    }
    if (!/^\d{8,20}$/.test(formData.accountNumber)) {
      alert("Account Number must be 8-20 digits.");
      return false;
    }
    if (!formData.accountType) {
      alert("Please select an account type.");
      return false;
    }
    return true;
  };

  const validateAccountInfo = () => {
    if (!formData.username.trim()) {
      alert("Username is required.");
      return false;
    }

    // Password regex: at least one lowercase, one uppercase, one number, one special char, 8+ chars
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordPattern.test(formData.password)) {
      alert(
        "Password must be at least 8 characters long and include:\n- One uppercase letter\n- One lowercase letter\n- One number\n- One special character"
      );
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // checkbox validation
    if (!formData.confirmInfo || !formData.confirmPaperTrading) {
      alert("Please confirm both checkboxes before submitting.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("🎉 Registration successful! Your account is pending admin approval. You will be able to login once an admin approves your request.");
        console.log("✅ Server Response:", data);
        // Redirect to login after a delay so they can read the alert
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      } else {
        alert(`❌ Registration failed: ${data.message || "Something went wrong"}`);
        console.error("Error:", data);
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("⚠️ Server not responding. Please check your backend.");
    }
  };

  const steps = [
    { number: 1, label: "Personal Info", icon: <User size={18} /> },
    { number: 2, label: "Bank Details", icon: <Building size={18} /> },
    { number: 3, label: "Account Setup", icon: <Lock size={18} /> },
    { number: 4, label: "Review", icon: <CheckCircle size={18} /> },
  ];

  const selectedBank = banks.find((b) => b.name === formData.bankName);
  const currentCountry = getCurrentCountry();

  const progress = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="signup-page">
      {/* Background Elements */}
      <div className="signup-bg"></div>
      
      <Navbar bg="transparent" variant="dark" className="signup-navbar">
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
                <div className="brand-title">Sanchaya</div>
                <div className="brand-subtitle">Paper Trading</div>
              </div>
            </motion.div>
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="signup-container">
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="signup-card border-0">
                {/* Card Header Gradient */}
                <div className="card-header-gradient"></div>
                
                <Card.Body className="p-5">
                  {/* Header */}
                  <div className="text-center mb-5">
                    <motion.div
                      className="signup-icon-wrapper mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Zap size={32} className="signup-icon" />
                    </motion.div>
                    <h2 className="fw-bold mb-2 title-gradient">
                      Start Your Trading Journey
                    </h2>
                    <p className="text-white-50">Create your Sanchaya Paper Trading Account</p>
                  </div>

                  {/* Step Indicator - Horizontal */}
                  <div className="step-indicator-horizontal mb-5">
                    <div className="progress-line-horizontal" style={{ width: `${progress}%` }}></div>
                    {steps.map((s) => (
                      <div
                        key={s.number}
                        className={`step-horizontal ${step === s.number ? "active" : step > s.number ? "completed" : ""}`}
                      >
                        <div className="step-circle-horizontal">
                          {step > s.number ? (
                            <CheckCircle size={16} />
                          ) : (
                            <span className="step-number-horizontal">{s.number}</span>
                          )}
                        </div>
                        <div className="step-content-horizontal">
                          <div className="step-icon-horizontal">{s.icon}</div>
                          <div className="step-label-horizontal">{s.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Form */}
                  <Form onSubmit={handleSubmit} className="form-container">
                    <AnimatePresence mode="wait">
                      {/* Step 1: Personal Info */}
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          className="form-step"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h4 className="form-step-title mb-4">
                            <User className="me-2" size={20} />
                            Personal Information
                          </h4>
                          <Row>
                            <Col md={6} className="mb-4">
                              <Form.Label className="form-label fw-semibold">
                                Full Name
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="form-input"
                                required
                              />
                            </Col>
                            <Col md={6} className="mb-4">
                              <Form.Label className="form-label fw-semibold">
                                Gender
                              </Form.Label>
                              <Form.Select name="gender" value={formData.gender} onChange={handleChange} className="form-input custom-select" required>
                                <option value="">Select Gender</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                              </Form.Select>
                            </Col>
                            <Col md={6} className="mb-4">
                              <Form.Label className="form-label fw-semibold">
                                Date of Birth
                              </Form.Label>
                              <Form.Control
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                max={todayStr}
                                className="form-input"
                                required
                              />
                            </Col>
                            <Col md={6} className="mb-4">
                              <Form.Label className="form-label fw-semibold">
                                Nationality
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                placeholder="Enter your nationality"
                                className="form-input"
                                required
                              />
                            </Col>
                            <Col md={6} className="mb-4">
                              <Form.Label className="form-label fw-semibold">
                                Citizenship Number
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="citizenNo"
                                value={formData.citizenNo}
                                onChange={handleChange}
                                placeholder="6-12 digits"
                                className="form-input"
                                required
                              />
                            </Col>
                            <Col md={12} className="mb-4">
                              <Form.Label className="form-label fw-semibold">
                                <Phone className="me-2" size={16} />
                                Mobile Number {currentCountry && `- ${currentCountry.name}`}
                              </Form.Label>
                              <div className="phone-input-wrapper">
                                <Form.Select
                                  name="countryCode"
                                  value={formData.countryCode}
                                  onChange={handleChange}
                                  className="form-input custom-select country-select"
                                  required
                                >
                                  {countries.map((c) => (
                                    <option key={c.code} value={c.code}>
                                      {c.flag} {c.code}
                                    </option>
                                  ))}
                                </Form.Select>
                                <Form.Control
                                  type="tel"
                                  name="mobile"
                                  value={formData.mobile}
                                  onChange={handleChange}
                                  placeholder={currentCountry ? `e.g., ${currentCountry.example}` : "Enter mobile number"}
                                  className="form-input phone-input"
                                  required
                                />
                              </div>
                              {currentCountry && (
                                <Form.Text className="validation-hint">
                                  {currentCountry.flag} Format: {currentCountry.example} ({currentCountry.length} digits)
                                </Form.Text>
                              )}
                            </Col>
                            <Col md={6} className="mb-4">
                              <Form.Label className="form-label fw-semibold">
                                <Mail className="me-2" size={16} />
                                Email Address
                              </Form.Label>
                              <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                className="form-input"
                                required
                              />
                            </Col>
                            <Col md={6} className="mb-4">
                              <Form.Label className="form-label fw-semibold">
                                <MapPin className="me-2" size={16} />
                                Address
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Your complete address"
                                rows={2}
                                className="form-input"
                                required
                              />
                            </Col>
                          </Row>
                          <div className="d-flex justify-content-end mt-4">
                            <Button className="signup-btn-primary btn-lg px-5" onClick={nextStep}>
                              Continue <ArrowRight size={18} className="ms-2" />
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2: Bank Info */}
                      {step === 2 && (
                        <motion.div
                          key="step2"
                          className="form-step"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h4 className="form-step-title mb-4">
                            <Building className="me-2" size={20} />
                            Bank Details
                          </h4>
                          <Row>
                            <Col md={6} className="mb-4">
                              <Form.Label className="form-label fw-semibold">
                                Bank Name
                              </Form.Label>
                              <Form.Select name="bankName" value={formData.bankName} onChange={handleChange} className="form-input custom-select" required>
                                <option value="">Select Bank</option>
                                {banks.slice(1).map((bank, idx) => (
                                  <option key={idx} value={bank.name}>
                                    {bank.name}
                                  </option>
                                ))}
                              </Form.Select>
                            </Col>
                            <Col md={6} className="mb-4">
                              <Form.Label className="form-label fw-semibold">
                                Branch
                              </Form.Label>
                              <Form.Select name="branch" value={formData.branch} onChange={handleChange} className="form-input custom-select" required>
                                <option value="">Select Branch</option>
                                {selectedBank?.branches.map((b, idx) => (
                                  <option key={idx}>{b}</option>
                                ))}
                              </Form.Select>
                            </Col>
                            <Col md={6} className="mb-4">
                              <Form.Label className="form-label fw-semibold">
                                <CreditCard className="me-2" size={16} />
                                Account Number
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleChange}
                                placeholder="8-20 digits"
                                className="form-input"
                                required
                              />
                            </Col>
                            <Col md={6} className="mb-4">
                              <Form.Label className="form-label fw-semibold">
                                Account Type
                              </Form.Label>
                              <Form.Select name="accountType" value={formData.accountType} onChange={handleChange} className="form-input custom-select" required>
                                <option value="">Select Type</option>
                                <option>Savings</option>
                                <option>Current</option>
                              </Form.Select>
                            </Col>
                          </Row>
                          <div className="d-flex justify-content-between mt-4">
                            <Button variant="outline-light" className="signup-btn-outline btn-lg px-4" onClick={prevStep}>
                              <ArrowLeft size={18} className="me-2" />
                              Back
                            </Button>
                            <Button className="signup-btn-primary btn-lg px-5" onClick={nextStep}>
                              Continue <ArrowRight size={18} className="ms-2" />
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Account Info */}
                      {step === 3 && (
                        <motion.div
                          key="step3"
                          className="form-step"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h4 className="form-step-title mb-4">
                            <Lock className="me-2" size={20} />
                            Account Setup
                          </h4>
                          <Row>
                            <Col md={6} className="mb-4">
                              <Form.Label className="form-label fw-semibold">
                                Username
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
                                className="form-input"
                                required
                              />
                            </Col>
                            <Col md={6} className="mb-4">
                              <Form.Label className="form-label fw-semibold">
                                Password
                              </Form.Label>
                              <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Minimum 8 characters"
                                className="form-input"
                                required
                              />
                            </Col>
                            <Col md={12} className="mb-4">
                              <Form.Label className="form-label fw-semibold">
                                Confirm Password
                              </Form.Label>
                              <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter your password"
                                className="form-input"
                                required
                              />
                            </Col>
                          </Row>
                          <div className="d-flex justify-content-between mt-4">
                            <Button variant="outline-light" className="signup-btn-outline btn-lg px-4" onClick={prevStep}>
                              <ArrowLeft size={18} className="me-2" />
                              Back
                            </Button>
                            <Button className="signup-btn-primary btn-lg px-5" onClick={nextStep}>
                              Review <ArrowRight size={18} className="ms-2" />
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 4: Review */}
                      {step === 4 && (
                        <motion.div
                          key="step4"
                          className="form-step"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h4 className="form-step-title mb-4">
                            <CheckCircle className="me-2" size={20} />
                            Review & Confirm
                          </h4>

                          <div className="review-grid">
                            {/* Personal Information */}
                            <div className="review-card">
                              <div className="review-card-header">
                                <User size={18} className="me-2" />
                                <h6>Personal Information</h6>
                              </div>
                              <div className="review-card-body">
                                <div className="review-item">
                                  <span className="review-label">Full Name:</span>
                                  <span className="review-value">{formData.fullName}</span>
                                </div>
                                <div className="review-item">
                                  <span className="review-label">Gender:</span>
                                  <span className="review-value">{formData.gender}</span>
                                </div>
                                <div className="review-item">
                                  <span className="review-label">Date of Birth:</span>
                                  <span className="review-value">{formData.dob}</span>
                                </div>
                                <div className="review-item">
                                  <span className="review-label">Nationality:</span>
                                  <span className="review-value">{formData.nationality}</span>
                                </div>
                                <div className="review-item">
                                  <span className="review-label">Citizenship No:</span>
                                  <span className="review-value">{formData.citizenNo}</span>
                                </div>
                                <div className="review-item">
                                  <span className="review-label">Mobile:</span>
                                  <span className="review-value">{formData.countryCode} {formData.mobile}</span>
                                </div>
                                <div className="review-item">
                                  <span className="review-label">Email:</span>
                                  <span className="review-value">{formData.email}</span>
                                </div>
                                <div className="review-item">
                                  <span className="review-label">Address:</span>
                                  <span className="review-value address-value">{formData.address}</span>
                                </div>
                              </div>
                            </div>

                            {/* Bank Details */}
                            <div className="review-card">
                              <div className="review-card-header">
                                <Building size={18} className="me-2" />
                                <h6>Bank Details</h6>
                              </div>
                              <div className="review-card-body">
                                <div className="review-item">
                                  <span className="review-label">Bank Name:</span>
                                  <span className="review-value">{formData.bankName}</span>
                                </div>
                                <div className="review-item">
                                  <span className="review-label">Branch:</span>
                                  <span className="review-value">{formData.branch}</span>
                                </div>
                                <div className="review-item">
                                  <span className="review-label">Account Number:</span>
                                  <span className="review-value">{formData.accountNumber}</span>
                                </div>
                                <div className="review-item">
                                  <span className="review-label">Account Type:</span>
                                  <span className="review-value">{formData.accountType}</span>
                                </div>
                              </div>
                            </div>

                            {/* Account Credentials */}
                            <div className="review-card">
                              <div className="review-card-header">
                                <Lock size={18} className="me-2" />
                                <h6>Account Credentials</h6>
                              </div>
                              <div className="review-card-body">
                                <div className="review-item">
                                  <span className="review-label">Username:</span>
                                  <span className="review-value">{formData.username}</span>
                                </div>
                                <div className="review-item">
                                  <span className="review-label">Password:</span>
                                  <span className="review-value password-mask">••••••••••</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="confirmation-section">
                            <Form.Check
                              className="mb-3 confirmation-check"
                              type="checkbox"
                              name="confirmInfo"
                              label="I confirm that all information provided is accurate and complete"
                              checked={formData.confirmInfo}
                              onChange={handleChange}
                            />
                            <Form.Check
                              className="mb-4 confirmation-check"
                              type="checkbox"
                              name="confirmPaperTrading"
                              label="I understand this is a paper trading simulation account with virtual funds"
                              checked={formData.confirmPaperTrading}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="d-flex justify-content-between">
                            <Button variant="outline-light" className="signup-btn-outline btn-lg px-4" onClick={prevStep}>
                              <ArrowLeft size={18} className="me-2" />
                              Edit Information
                            </Button>
                            <Button type="submit" className="signup-btn-success btn-lg px-5">
                              <Zap size={18} className="me-2" />
                              Complete Registration
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Form>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Signup;