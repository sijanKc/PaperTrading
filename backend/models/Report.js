const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['user', 'financial', 'competition', 'system', 'security', 'trading']
    },
    period: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['generated', 'pending', 'failed', 'generating'],
        default: 'generated'
    },
    size: {
        type: String,
        default: 'N/A'
    },
    format: {
        type: String,
        required: true,
        enum: ['PDF', 'Excel', 'CSV']
    },
    generatedAt: {
        type: Date,
        default: Date.now
    },
    downloadLink: {
        type: String,
        default: '#'
    },
    scheduled: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);
