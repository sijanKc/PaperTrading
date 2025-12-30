const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    level: {
        type: String,
        required: true,
        enum: ['INFO', 'WARNING', 'ERROR', 'DEBUG']
    },
    module: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    user: {
        type: String,
        default: 'system'
    },
    ip: {
        type: String,
        default: '127.0.0.1'
    },
    sessionId: {
        type: String
    },
    metadata: {
        type: Object
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Log', logSchema);
