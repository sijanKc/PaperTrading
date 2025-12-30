const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    // General Settings
    theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'light'
    },
    language: {
        type: String,
        enum: ['english', 'nepali', 'hindi'],
        default: 'english'
    },
    currency: {
        type: String,
        enum: ['npr', 'usd', 'inr'],
        default: 'npr'
    },
    timezone: {
        type: String,
        default: 'Asia/Kathmandu'
    },
    notifications: {
        type: Boolean,
        default: true
    },
    autoRefresh: {
        type: Boolean,
        default: true
    },

    // Trading Settings
    defaultOrderType: {
        type: String,
        enum: ['market', 'limit', 'stop'],
        default: 'market'
    },
    defaultQuantity: {
        type: Number,
        default: 10
    },
    confirmOrders: {
        type: Boolean,
        default: true
    },
    stopLossDefault: {
        type: Number,
        default: 2
    },
    takeProfitDefault: {
        type: Number,
        default: 5
    },

    // Notification Settings
    emailNotifications: {
        type: Boolean,
        default: true
    },
    pushNotifications: {
        type: Boolean,
        default: false
    },
    priceAlerts: {
        type: Boolean,
        default: true
    },
    tradeExecutions: {
        type: Boolean,
        default: true
    },
    portfolioUpdates: {
        type: Boolean,
        default: true
    },
    newsUpdates: {
        type: Boolean,
        default: false
    },

    // Privacy Settings
    profileVisibility: {
        type: String,
        enum: ['public', 'private', 'friends'],
        default: 'public'
    },
    showPortfolioValue: {
        type: Boolean,
        default: true
    },
    showTradingActivity: {
        type: Boolean,
        default: false
    },
    dataSharing: {
        type: Boolean,
        default: true
    },

    // Security
    twoFactorAuth: {
        type: Boolean,
        default: false
    },
    sessionTimeout: {
        type: Number,
        default: 30 // minutes
    }
}, {
    timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
