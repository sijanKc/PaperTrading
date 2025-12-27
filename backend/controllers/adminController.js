const User = require('../models/User');
const Transaction = require('../models/Transaction');
const TradingRule = require('../models/TradingRule');

// Get Dashboard Statistics
const getDashboardStats = async (req, res) => {
    try {
        // User Stats
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true, role: 'user', approved: true });
        const pendingApprovals = await User.countDocuments({ approved: false, isVerified: true });
        const premiumUsers = await User.countDocuments({ role: 'premium' });

        // Trading Stats
        const totalTrades = await Transaction.countDocuments();

        // Calculate total volume (mock calculation if Trade model doesn't store volume directly, or aggregate)
        // For now simple count

        // System Health (Mock for now)
        const systemHealth = {
            uptime: process.uptime(),
            status: 'operational',
            lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000)
        };

        res.json({
            success: true,
            stats: {
                users: {
                    total: totalUsers,
                    active: activeUsers,
                    pending: pendingApprovals,
                    premium: premiumUsers,
                    newToday: await User.countDocuments({
                        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
                    })
                },
                trading: {
                    totalTrades,
                    // Add more complex aggregations if needed
                },
                system: systemHealth
            }
        });
    } catch (error) {
        console.error('Get admin stats error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch admin stats' });
    }
};

// Get All Users with Filtering and Pagination
const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, status, role, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        const query = {};

        // Search
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { 'contact.email': { $regex: search, $options: 'i' } },
                { username: { $regex: search, $options: 'i' } }
            ];
        }

        // Filters
        if (status && status !== 'all') {
            if (status === 'pending') {
                query.approved = false;
            } else {
                query.isActive = status === 'active';
            }
        }
        if (role && role !== 'all') query.role = role;

        // Execute Query
        const users = await User.find(query)
            .select('-password') // Exclude password
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await User.countDocuments(query);

        // Transform data for frontend
        const formattedUsers = users.map(user => ({
            id: user._id,
            name: user.fullName,
            email: user.contact.email, // Access nested email
            phone: user.contact.mobile, // Access nested mobile
            status: !user.approved ? 'pending' : (user.isActive ? 'active' : 'suspended'), // Include pending for approval
            approved: user.approved,
            role: user.role,
            portfolioValue: user.portfolioValue,
            totalTrades: 0, // Need to aggregate trades count for accuracy, mock 0 for list speed or do secondary query
            joinDate: user.createdAt,
            lastLogin: user.createdAt // Mock last login as join date if not tracked
        }));

        res.json({
            success: true,
            data: {
                users: formattedUsers,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
};

// Approve User (New function for admin approval)
const approveUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { approve } = req.body; // true to approve, false to reject/unapprove

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ success: false, message: 'Cannot approve admin accounts' });
        }

        user.approved = approve !== false; // Default to true if not specified

        await user.save();

        res.json({
            success: true,
            message: `User ${user.approved ? 'approved' : 'unapproved'} successfully`,
            user: {
                id: user._id,
                username: user.username,
                approved: user.approved
            }
        });
    } catch (error) {
        console.error('Approve user error:', error);
        res.status(500).json({ success: false, message: 'Failed to approve user' });
    }
};

// Update User Status (Suspend/Ban/Activate) - Existing, unchanged but now separate from approval
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'active', 'suspended', 'banned'

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Map frontend status to backend isActive
        // If we want detailed status, we should ideally add a 'status' string field to User schema.
        // For now simplest implementation:
        if (status === 'active') {
            user.isActive = true;
        } else {
            user.isActive = false;
        }

        // Basic implementation only toggles active state. 
        // If user wants full 'banned' vs 'suspended', we should migration User schema.
        // Let's implement schema change if we can, or just comments.
        // For this step, we'll just toggle query.

        await user.save();

        res.json({
            success: true,
            message: `User status updated to ${status}`
        });
    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({ success: false, message: 'Failed to update user status' });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Also delete associated trades/portfolio?
        // For now just user.

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete user' });
    }
};

// Get Trading Rules
const getTradingRules = async (req, res) => {
    try {
        // Find the trading rules document (there should only be one)
        let rules = await TradingRule.findOne();

        // If no rules exist, create default ones
        if (!rules) {
            rules = new TradingRule({});
            await rules.save();
        }

        res.json({
            success: true,
            rules
        });
    } catch (error) {
        console.error('Get trading rules error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch trading rules'
        });
    }
};

// Update Trading Rules
const updateTradingRules = async (req, res) => {
    try {
        const updatedRules = req.body;
        const adminId = req.user._id;

        // Find existing rules or create new
        let rules = await TradingRule.findOne();

        if (!rules) {
            rules = new TradingRule(updatedRules);
        } else {
            // Update all fields
            Object.keys(updatedRules).forEach(key => {
                rules[key] = updatedRules[key];
            });
        }

        rules.lastUpdatedBy = adminId;
        await rules.save();

        res.json({
            success: true,
            message: 'Trading rules updated successfully',
            rules
        });
    } catch (error) {
        console.error('Update trading rules error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update trading rules'
        });
    }
};

module.exports = {
    getDashboardStats,
    getUsers,
    approveUser,
    updateUserStatus,
    deleteUser,
    getTradingRules,
    updateTradingRules
};