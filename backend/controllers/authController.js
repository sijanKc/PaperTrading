const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateOTP, hashOTP, sendOTPEmail } = require('../utils/emailService');

// Send Registration OTP
const sendRegistrationOTP = async (req, res) => {
  try {
    const { email, fullName } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ 'contact.email': email });
    if (existingUser && existingUser.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered and verified'
      });
    }

    // Rate limiting: Check last OTP request
    if (existingUser && existingUser.lastOTPRequest) {
      const timeSinceLastRequest = Date.now() - existingUser.lastOTPRequest.getTime();
      const oneMinute = 60 * 1000;

      if (timeSinceLastRequest < oneMinute) {
        return res.status(429).json({
          success: false,
          message: 'Please wait before requesting another OTP',
          retryAfter: Math.ceil((oneMinute - timeSinceLastRequest) / 1000)
        });
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, 'registration');

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    // Store OTP in temporary user or update existing
    if (existingUser) {
      existingUser.emailVerificationOTP = hashedOTP;
      existingUser.emailVerificationOTPExpires = otpExpires;
      existingUser.lastOTPRequest = new Date();
      existingUser.otpAttempts = 0;
      await existingUser.save();
    }

    console.log('✅ Registration OTP sent to:', email);

    res.json({
      success: true,
      message: 'OTP sent to your email',
      email: email
    });

  } catch (error) {
    console.error('❌ Send registration OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending OTP'
    });
  }
};

// Verify OTP and Complete Registration
const verifyOTPAndRegister = async (req, res) => {
  try {
    const {
      otp,
      fullName,
      dob,
      gender,
      nationality,
      citizenNo,
      countryCode,
      mobile,
      email,
      address,
      bankName,
      branch,
      accountNumber,
      accountType,
      username,
      password,
      confirmPassword,
      confirmInfo,
      confirmPaperTrading
    } = req.body;

    // Validate OTP
    if (!otp || !email) {
      return res.status(400).json({
        success: false,
        message: 'OTP and email are required'
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Find user with pending verification
    const user = await User.findOne({ 'contact.email': email });

    if (!user || !user.emailVerificationOTP) {
      return res.status(400).json({
        success: false,
        message: 'No OTP request found. Please request a new OTP.'
      });
    }

    // Check OTP expiration
    if (user.emailVerificationOTPExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Check OTP attempts
    if (user.otpAttempts >= 3) {
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    const hashedInputOTP = hashOTP(otp);
    if (hashedInputOTP !== user.emailVerificationOTP) {
      user.otpAttempts += 1;
      await user.save();

      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
        attemptsRemaining: 3 - user.otpAttempts
      });
    }

    // Check if username or citizenNo already exists
    const existingUser = await User.findOne({
      $or: [
        { username: username },
        { citizenNo: citizenNo }
      ]
    });

    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      let field = '';
      if (existingUser.username === username) field = 'Username';
      else if (existingUser.citizenNo === citizenNo) field = 'Citizenship Number';

      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user with complete information
    user.fullName = fullName;
    user.dob = new Date(dob);
    user.gender = gender;
    user.nationality = nationality;
    user.citizenNo = citizenNo;
    user.contact.countryCode = countryCode || '+977';
    user.contact.mobile = mobile;
    user.contact.address = address;
    user.bankDetails = {
      bankName,
      branch,
      accountNumber,
      accountType
    };
    user.username = username;
    user.password = hashedPassword;
    user.agreements = {
      confirmInfo: confirmInfo || false,
      confirmPaperTrading: confirmPaperTrading || false
    };
    user.emailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationOTPExpires = undefined;
    user.otpAttempts = 0;

    await user.save();
    console.log('✅ User registered successfully:', user._id);

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token: token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.contact.email,
        virtualBalance: user.virtualBalance
      }
    });

  } catch (error) {
    console.error('❌ Verify OTP and register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration: ' + error.message
    });
  }
};

// Create temporary user entry for OTP
const createTempUserForOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user already exists
    let user = await User.findOne({ 'contact.email': email });

    if (!user) {
      // Create temporary user entry
      user = new User({
        fullName: 'Pending',
        dob: new Date(),
        gender: 'Other',
        nationality: 'Pending',
        citizenNo: `TEMP_${Date.now()}`,
        contact: {
          countryCode: '+977',
          mobile: '0000000000',
          email: email,
          address: 'Pending'
        },
        bankDetails: {
          bankName: 'Pending',
          branch: 'Pending',
          accountNumber: '0000000000',
          accountType: 'Savings'
        },
        username: `temp_${Date.now()}`,
        password: await bcrypt.hash('temporary', 10),
        emailVerified: false
      });
      await user.save();
    }

    res.json({
      success: true,
      message: 'Temporary user created',
      userId: user._id
    });

  } catch (error) {
    console.error('❌ Create temp user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Forgot Password - Send OTP
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user
    const user = await User.findOne({ 'contact.email': email });

    if (!user) {
      // Don't reveal if email exists or not (security)
      return res.json({
        success: true,
        message: 'If this email is registered, you will receive a password reset OTP'
      });
    }

    // Rate limiting
    if (user.lastOTPRequest) {
      const timeSinceLastRequest = Date.now() - user.lastOTPRequest.getTime();
      const oneMinute = 60 * 1000;

      if (timeSinceLastRequest < oneMinute) {
        return res.status(429).json({
          success: false,
          message: 'Please wait before requesting another OTP',
          retryAfter: Math.ceil((oneMinute - timeSinceLastRequest) / 1000)
        });
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, 'password-reset');

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    // Store OTP
    user.passwordResetOTP = hashedOTP;
    user.passwordResetOTPExpires = otpExpires;
    user.lastOTPRequest = new Date();
    user.otpAttempts = 0;
    await user.save();

    console.log('✅ Password reset OTP sent to:', email);

    res.json({
      success: true,
      message: 'OTP sent to your email'
    });

  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending OTP'
    });
  }
};

// Reset Password with OTP
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP, and new password are required'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Find user
    const user = await User.findOne({ 'contact.email': email });

    if (!user || !user.passwordResetOTP) {
      return res.status(400).json({
        success: false,
        message: 'No password reset request found'
      });
    }

    // Check OTP expiration
    if (user.passwordResetOTPExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Check OTP attempts
    if (user.otpAttempts >= 3) {
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    const hashedInputOTP = hashOTP(otp);
    if (hashedInputOTP !== user.passwordResetOTP) {
      user.otpAttempts += 1;
      await user.save();

      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
        attemptsRemaining: 3 - user.otpAttempts
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear OTP
    user.password = hashedPassword;
    user.passwordResetOTP = undefined;
    user.passwordResetOTPExpires = undefined;
    user.otpAttempts = 0;
    await user.save();

    console.log('✅ Password reset successful for:', email);

    res.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });

  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resetting password'
    });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email, type } = req.body; // type: 'registration' or 'password-reset'

    if (!email || !type) {
      return res.status(400).json({
        success: false,
        message: 'Email and type are required'
      });
    }

    const user = await User.findOne({ 'contact.email': email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Rate limiting
    if (user.lastOTPRequest) {
      const timeSinceLastRequest = Date.now() - user.lastOTPRequest.getTime();
      const oneMinute = 60 * 1000;

      if (timeSinceLastRequest < oneMinute) {
        return res.status(429).json({
          success: false,
          message: 'Please wait before requesting another OTP',
          retryAfter: Math.ceil((oneMinute - timeSinceLastRequest) / 1000)
        });
      }
    }

    // Generate new OTP
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, type);

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email'
      });
    }

    // Update OTP based on type
    if (type === 'registration') {
      user.emailVerificationOTP = hashedOTP;
      user.emailVerificationOTPExpires = otpExpires;
    } else {
      user.passwordResetOTP = hashedOTP;
      user.passwordResetOTPExpires = otpExpires;
    }

    user.lastOTPRequest = new Date();
    user.otpAttempts = 0;
    await user.save();

    console.log('✅ OTP resent to:', email);

    res.json({
      success: true,
      message: 'New OTP sent to your email'
    });

  } catch (error) {
    console.error('❌ Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resending OTP'
    });
  }
};

// Original signup controller (kept for backward compatibility)
const signup = async (req, res) => {
  try {
    const {
      fullName,
      dob,
      gender,
      nationality,
      citizenNo,
      countryCode,
      mobile,
      email,
      address,
      bankName,
      branch,
      accountNumber,
      accountType,
      username,
      password,
      confirmPassword,
      confirmInfo,
      confirmPaperTrading
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { 'contact.email': email },
        { username: username },
        { citizenNo: citizenNo }
      ]
    });

    if (existingUser) {
      let field = '';
      if (existingUser.contact.email === email) field = 'Email';
      else if (existingUser.username === username) field = 'Username';
      else if (existingUser.citizenNo === citizenNo) field = 'Citizenship Number';

      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      dob: new Date(dob),
      gender,
      nationality,
      citizenNo,
      contact: {
        countryCode: countryCode || '+977',
        mobile,
        email,
        address
      },
      bankDetails: {
        bankName,
        branch,
        accountNumber,
        accountType
      },
      username,
      password: hashedPassword,
      agreements: {
        confirmInfo: confirmInfo || false,
        confirmPaperTrading: confirmPaperTrading || false
      }
    });

    await newUser.save();
    console.log('✅ User registered successfully:', newUser._id);

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: token,
      user: {
        id: newUser._id,
        username: newUser.username,
        fullName: newUser.fullName,
        email: newUser.contact.email,
        virtualBalance: newUser.virtualBalance
      }
    });

  } catch (error) {
    console.error('❌ Signup error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during registration: ' + error.message
    });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [
        { username: username },
        { 'contact.email': username }
      ]
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Check if user is active
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended or banned. Please contact support.'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token: token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.contact.email,
        virtualBalance: user.virtualBalance,
        portfolioValue: user.portfolioValue,
        totalProfitLoss: user.totalProfitLoss,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

module.exports = {
  signup,
  login,
  sendRegistrationOTP,
  verifyOTPAndRegister,
  createTempUserForOTP,
  forgotPassword,
  resetPassword,
  resendOTP
};