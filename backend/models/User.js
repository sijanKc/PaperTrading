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
    default: 100000  // 1 lakh NPR starting balance
  },
  portfolioValue: {
    type: Number,
    default: 0
  },
  totalProfitLoss: {
    type: Number,
    default: 0
  },

  // Email Verification & OTP
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationOTP: {
    type: String
  },
  emailVerificationOTPExpires: {
    type: Date
  },
  passwordResetOTP: {
    type: String
  },
  passwordResetOTPExpires: {
    type: Date
  },
  otpAttempts: {
    type: Number,
    default: 0
  },
  lastOTPRequest: {
    type: Date
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});

// Create model from schema
const User = mongoose.model('User', userSchema);

module.exports = User;
