const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }

    // NEW: Block access if account not activated
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please activate your account via the email link before accessing this resource'
      });
    }

    // NEW: Block access if not approved by admin
    if (!user.approved) {
      return res.status(403).json({
        success: false,
        message: 'Account pending admin approval. Please contact support.'
      });
    }

    // Keep existing isActive check for admin bans
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

module.exports = auth;