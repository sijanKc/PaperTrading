const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendActivationEmail } = require('../utils/sendEmail');

// New Register with Activation Link
const register = async (req, res) => {
  try {
    const {
      fullName, dob, gender, nationality, citizenNo,
      countryCode, mobile, email, address,
      bankName, branch, accountNumber, accountType,
      username, password, confirmPassword,
      confirmInfo, confirmPaperTrading
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    // Check duplicates
    const existingUser = await User.findOne({
      $or: [
        { 'contact.email': email },
        { username },
        { citizenNo }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email, username, or citizenship number already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (inactive and unapproved)
    const user = new User({
      fullName,
      dob: new Date(dob),
      gender,
      nationality,
      citizenNo,
      contact: { countryCode: countryCode || '+977', mobile, email, address },
      bankDetails: { bankName, branch, accountNumber, accountType },
      username,
      password: hashedPassword,
      agreements: { confirmInfo, confirmPaperTrading },
      agreements: { confirmInfo, confirmPaperTrading },
      isVerified: true, // Auto-verify email to skip to admin approval
      approved: false  // Default to false, requires admin approval
    });

    // Generate activation token (optional/unused if isVerified is true)
    // const token = crypto.randomBytes(32).toString('hex');
    // user.activationToken = token;
    // user.activationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save();

    // Send activation email (Disabled for direct Admin Approval flow)
    // const activationUrl = `${process.env.FRONTEND_URL}/activate/${token}`;
    // const emailResult = await sendActivationEmail(email, activationUrl);

    if (!emailResult.success) {
      // Optional: delete user if email fails?
      // await User.findByIdAndDelete(user._id);
      // return res.status(500).json({ message: 'Failed to send activation email' });
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! Your account is pending admin approval.'
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Activate Account
const activateAccount = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      activationToken: token,
      activationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired activation link' });
    }

    user.isVerified = true;
    user.activationToken = undefined;
    user.activationTokenExpires = undefined;
    // approved remains false until admin approves
    await user.save();

    // Redirect to frontend login with success, but note pending approval
    res.redirect(`${process.env.FRONTEND_URL}/login?activated=true&pending=approval`);

  } catch (error) {
    res.status(500).json({ success: false, message: 'Activation failed' });
  }
};

// Updated Login (block unverified or unapproved)
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { 'contact.email': username }]
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Please activate your account via the email link first' });
    }

    if (!user.approved) {
      return res.status(403).json({ success: false, message: 'Account pending admin approval. Please contact support.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account suspended' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.contact.email,
        virtualBalance: user.virtualBalance,
        role: user.role,
        approved: user.approved  // Include for frontend checks
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login error' });
  }
};

// Keep your other functions (forgotPassword, etc.) if needed
// Remove old OTP functions or keep for backup

// Check if email exists
const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ 'contact.email': email });

    if (user) {
      return res.json({ success: true, exists: true });
    } else {
      return res.json({ success: false, exists: false, message: 'Email not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Reset Password Direct
const resetPasswordDirect = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ 'contact.email': email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get User Profile
const getProfile = async (req, res) => {
  try {
    // User is already fetched in auth middleware
    const user = req.user;
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update User Profile
const updateProfile = async (req, res) => {
  try {
    const {
      fullName, dob, gender, nationality, citizenNo,
      contact, bankDetails
    } = req.body;

    // Use _id from middleware user object
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update allowed fields
    if (fullName) user.fullName = fullName;
    if (dob) user.dob = dob;
    if (gender) user.gender = gender;
    if (nationality) user.nationality = nationality;
    if (citizenNo) user.citizenNo = citizenNo;

    // Update nested objects safely
    if (contact) {
      user.contact = { ...user.contact, ...contact };
    }
    if (bankDetails) {
      user.bankDetails = { ...user.bankDetails, ...bankDetails };
    }

    await user.save();

    res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  activateAccount,
  checkEmail,
  resetPasswordDirect,
  getProfile,
  updateProfile
};