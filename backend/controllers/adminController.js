const User = require('../models/User');
const Transaction = require('../models/Transaction');
const TradingRule = require('../models/TradingRule');
const Stock = require('../models/Stock');

// Get Dashboard Statistics
const getDashboardStats = async (req, res) => {
    try {
        // User Stats
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true, role: 'user', approved: true });
        const pendingApprovals = await User.countDocuments({ approved: false, isVerified: true });
        const premiumUsers = await User.countDocuments({ role: 'premium' });
        const suspendedUsers = await User.countDocuments({ isActive: false, approved: true });
        const adminUsers = await User.countDocuments({ role: 'admin' });

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

        // Calculate Online Users (active in last 15 minutes)
        const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
        const onlineUsers = await User.countDocuments({
            lastActive: { $gte: fifteenMinsAgo },
            role: 'user'
        });

        // Calculate Today's Volume
        const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
        const sevenDaysAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

        const todayVolumeResult = await Transaction.aggregate([
            { $match: { createdAt: { $gte: todayStart }, status: 'COMPLETED' } },
            { $group: { _id: null, totalVolume: { $sum: '$totalAmount' } } }
        ]);
        const todayVolume = todayVolumeResult.length > 0 ? todayVolumeResult[0].totalVolume : 0;

        // User Growth Data (Last 7 Days)
        const userGrowth = await User.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo }, role: 'user' } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Trading Volume Data (Last 7 Days)
        const tradeVolumeHistory = await Transaction.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo }, status: 'COMPLETED' } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    volume: { $sum: "$totalAmount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Top Stocks by Volume
        const topStocks = await Stock.find({ isActive: true })
            .sort({ volume: -1 })
            .limit(5)
            .select('symbol currentPrice changePercent volume');

        // Sector Performance
        const sectorPerformance = await Stock.getSectorPerformance();

        // Fetch Recent Activities
        const recentJoins = await User.find({ role: 'user' })
            .select('fullName createdAt username')
            .sort({ createdAt: -1 })
            .limit(5);

        const recentTrades = await Transaction.find({ status: 'COMPLETED' })
            .populate('userId', 'fullName username')
            .sort({ createdAt: -1 })
            .limit(5);

        const activities = [
            ...recentJoins.map(u => ({
                id: `join-${u._id}`,
                user: u.fullName || u.username,
                action: 'joined platform',
                time: u.createdAt,
                type: 'join'
            })),
            ...recentTrades.map(t => ({
                id: `trade-${t._id}`,
                user: t.userId?.fullName || t.userId?.username || 'Unknown',
                action: `placed a ${t.type.toLowerCase()} order`,
                stock: t.symbol,
                time: t.createdAt,
                type: 'trade'
            }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

        res.json({
            success: true,
            stats: {
                users: {
                    total: totalUsers,
                    active: activeUsers,
                    pending: pendingApprovals,
                    premium: premiumUsers,
                    suspended: suspendedUsers,
                    admins: adminUsers,
                    online: onlineUsers,
                    newToday: await User.countDocuments({
                        createdAt: { $gte: todayStart }
                    })
                },
                trading: {
                    totalTrades,
                    todayVolume,
                    activeTradesDay: await Transaction.countDocuments({ createdAt: { $gte: todayStart } })
                },
                charts: {
                    userGrowth,
                    tradeVolumeHistory,
                    topStocks,
                    sectorPerformance
                },
                activities,
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

        // Fetch trade counts for these users
        const userIds = users.map(u => u._id);
        const tradeCounts = await Transaction.aggregate([
            { $match: { userId: { $in: userIds }, status: 'COMPLETED' } },
            { $group: { _id: '$userId', count: { $sum: 1 } } }
        ]);

        const tradeCountMap = tradeCounts.reduce((acc, curr) => {
            acc[curr._id.toString()] = curr.count;
            return acc;
        }, {});

        // Transform data for frontend
        const formattedUsers = users.map(user => ({
            id: user._id,
            name: user.fullName,
            username: user.username,
            email: user.contact.email,
            phone: user.contact.mobile,
            status: !user.approved ? 'pending' : (user.isActive ? 'active' : 'suspended'),
            approved: user.approved,
            role: user.role,
            portfolioValue: user.portfolioValue || 0,
            portfolioChange: user.initialBalance > 0 ? parseFloat(((user.virtualBalance - user.initialBalance) / user.initialBalance * 100).toFixed(2)) : 0,
            totalTrades: tradeCountMap[user._id.toString()] || 0,
            joinDate: user.createdAt,
            lastLogin: user.lastActive || user.createdAt,
            virtualMoney: user.virtualBalance,
            tradingLimit: user.tradingLimit || 500000,
            notes: user.adminNotes || '',
            suspensionReason: user.suspensionReason || '',
            banReason: user.banReason || '',
            // Add placeholders for frontend-only components to avoid NaN
            successRate: 0,
            rank: 0,
            totalUsers: total,
            lastTradeDate: user.createdAt,
            portfolioChange: 0
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

// Create User (Admin only)
const createUser = async (req, res) => {
    try {
        const { name, email, phone, role, virtualMoney, tradingLimit, approved } = req.body;

        // Basic check
        if (!name || !email) {
            return res.status(400).json({ success: false, message: 'Name and email are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 'contact.email': email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        // Create user with mock password (since admin is creating)
        // In a real app, you'd send a reset link or a temporary password
        const user = new User({
            fullName: name,
            contact: {
                email,
                mobile: phone || '',
                countryCode: '+977',
                address: 'N/A'
            },
            username: email.split('@')[0] + Math.floor(Math.random() * 1000),
            password: 'TemporaryPassword123!', // Admin created
            role: role || 'user',
            virtualBalance: virtualMoney || 100000,
            initialBalance: virtualMoney || 100000,
            tradingLimit: tradingLimit || 500000,
            approved: approved || false,
            isVerified: true, // Admin created users are pre-verified
            dob: new Date('2000-01-01'), // Mock DOB
            gender: 'Male', // Mock Gender
            nationality: 'Nepali', // Mock Nationality
            citizenNo: 'Admin-' + Date.now(), // Mock Citizen No
            agreements: { confirmInfo: true, confirmPaperTrading: true }
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                id: user._id,
                name: user.fullName,
                email: user.contact.email
            }
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to create user' });
    }
};

// Update User (Admin only)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Map frontend fields to backend schema
        if (updates.name) user.fullName = updates.name;
        if (updates.email) user.contact.email = updates.email;
        if (updates.phone) user.contact.mobile = updates.phone;
        if (updates.role) user.role = updates.role;
        if (updates.virtualMoney !== undefined) user.virtualBalance = updates.virtualMoney;
        if (updates.approved !== undefined) user.approved = updates.approved;
        if (updates.notes !== undefined) user.adminNotes = updates.notes;

        // Handle status mapped to isActive
        if (updates.status) {
            user.isActive = updates.status === 'active';
            if (updates.status === 'suspended') user.suspensionReason = updates.suspensionReason;
            if (updates.status === 'banned') user.banReason = updates.banReason;
        }

        await user.save();

        res.json({
            success: true,
            message: 'User updated successfully',
            user: {
                id: user._id,
                name: user.fullName,
                email: user.contact.email,
                status: user.isActive ? 'active' : 'inactive'
            }
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ success: false, message: 'Failed to update user' });
    }
};

// Update User Status (Suspend/Ban/Activate) - Existing, enhanced
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reason, notes } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (status === 'active') {
            user.isActive = true;
        } else {
            user.isActive = false;
            if (status === 'suspended') user.suspensionReason = reason;
            if (status === 'banned') user.banReason = reason;
        }

        if (notes) user.adminNotes = notes;

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
            // Ensure nested objects are marked as modified
            if (updatedRules.sectorLimits) {
                rules.markModified('sectorLimits');
            }
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
    createUser,
    updateUser,
    approveUser,
    updateUserStatus,
    deleteUser,
    getTradingRules,
    updateTradingRules
};