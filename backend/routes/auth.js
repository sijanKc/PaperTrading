const express = require('express');
const router = express.Router();
const { register, login, activateAccount } = require('../controllers/authController');

// Register → sends activation email
router.post('/register', register);

// Activate account via link
router.get('/activate/:token', activateAccount);

// Login
router.post('/login', login);

const authMiddleware = require('../middleware/auth');

// ... existing routes ...

// Direct Forgot Password Flow
const { checkEmail, resetPasswordDirect, getProfile, updateProfile } = require('../controllers/authController');
router.post('/check-email', checkEmail);
router.post('/reset-password-direct', resetPasswordDirect);

// Profile Routes
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;