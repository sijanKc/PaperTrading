const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Personal Information
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  nationality: {
    type: String,
    required: true,
    trim: true
  },
  citizenNo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  // Contact Information
  contact: {
    countryCode: {
      type: String,
      required: true,
      default: '+977'
    },
    mobile: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    }
  },

  // Bank Details
  bankDetails: {
    bankName: {
      type: String,
      required: true,
      trim: true
    },
    branch: {
      type: String,
      required: true,
      trim: true
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true
    },
    accountType: {
      type: String,
      required: true,
      enum: ['Savings', 'Current']
    }
  },

  // Account Credentials
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },

  // Agreements
  agreements: {
    confirmInfo: {
      type: Boolean,
      required: true,
      default: false
    },
    confirmPaperTrading: {
      type: Boolean,
      required: true,
      default: false
    }
  },

  // Trading Information
  virtualBalance: {
    type: Number,
    default: 100000
  },
  tradingLimit: {
    type: Number,
    default: 500000
  },
  initialBalance: {
    type: Number,
    default: 100000 // Set when user first registers
  },
  dailyStartBalance: {
    type: Number,
    default: 100000 // Reset daily to track daily loss
  },
  dailyStartDate: {
    type: Date,
    default: Date.now // Last time dailyStartBalance was reset
  },
  portfolioValue: {
    type: Number,
    default: 0
  },
  totalProfitLoss: {
    type: Number,
    default: 0
  },

  // Account Verification (Activation Link)
  isVerified: {
    type: Boolean,
    default: false  // User cannot login until activated
  },
  activationToken: {
    type: String
  },
  activationTokenExpires: {
    type: Date
  },

  // Admin Approval
  approved: {
    type: Boolean,
    default: false  // User cannot access dashboard until approved by admin
  },

  // Timestamps & Role
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true  // For admin ban/suspend
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  lastActive: {
    type: Date,
    default: Date.now
  },

  // Admin Management Fields
  suspensionReason: String,
  banReason: String,
  adminNotes: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;