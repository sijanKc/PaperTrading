const express = require('express');
const router = express.Router();
const {
    signup,
    login,
    sendRegistrationOTP,
    verifyOTPAndRegister,
    createTempUserForOTP,
    forgotPassword,
    resetPassword,
    resendOTP
} = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register new user (original - backward compatibility)
// @access  Public
router.post('/register', signup);

// @route   POST /api/auth/login
// @desc    Login user  
// @access  Public
router.post('/login', login);

// @route   POST /api/auth/send-registration-otp
// @desc    Send OTP for email verification during registration
// @access  Public
router.post('/send-registration-otp', sendRegistrationOTP);

// @route   POST /api/auth/create-temp-user
// @desc    Create temporary user entry for OTP
// @access  Public
router.post('/create-temp-user', createTempUserForOTP);

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and complete registration
// @access  Public
router.post('/verify-otp', verifyOTPAndRegister);

// @route   POST /api/auth/forgot-password
// @desc    Send OTP for password reset
// @access  Public
router.post('/forgot-password', forgotPassword);

// @route   POST /api/auth/reset-password
// @desc    Verify OTP and reset password
// @access  Public
router.post('/reset-password', resetPassword);

// @route   POST /api/auth/resend-otp
// @desc    Resend OTP (registration or password reset)
// @access  Public
router.post('/resend-otp', resendOTP);

module.exports = router;