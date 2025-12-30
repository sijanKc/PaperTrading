const os = require('os');
const Log = require('../models/Log');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Get real-time system metrics
exports.getSystemMetrics = async (req, res) => {
    try {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const memUsage = (usedMem / totalMem) * 100;

        const cpus = os.cpus();
        const loadAvg = os.loadavg(); // Returns 1, 5, and 15 minute load averages

        // Calculate CPU usage (simplified)
        const cpuUsage = (loadAvg[0] / cpus.length) * 100;

        const activeUsers = await User.countDocuments({
            lastActive: { $gte: new Date(Date.now() - 15 * 60 * 1000) }
        });

        const apiRequests = 0; // In a real app, you'd track this in middleware/Redis

        res.status(200).json({
            success: true,
            metrics: {
                cpuUsage: Math.min(100, cpuUsage),
                memoryUsage: memUsage,
                diskUsage: 45, // Hard to get cross-platform without extra deps, mock for now
                networkIn: 1.2,
                networkOut: 0.8,
                activeUsers,
                apiRequests,
                databaseConnections: 1, // Simplified
                responseTime: 45,
                uptime: formatUptime(process.uptime()),
                osUptime: formatUptime(os.uptime())
            },
            historicalData: {
                // Mock historical data for charts
                cpu: [40, 45, 42, 48, 50, 45, 43, 47, 52, 49, 46, cpuUsage],
                memory: [60, 62, 61, 63, 65, 64, 62, 63, 66, 65, 64, memUsage],
                network: [120, 115, 130, 125, 140, 135, 150, 145, 155, 160, 165, 170],
                responseTime: [120, 125, 130, 128, 135, 140, 145, 150, 155, 160, 165, 170]
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching system metrics',
            error: error.message
        });
    }
};

// Get system logs
exports.getLogs = async (req, res) => {
    try {
        const { level, search, limit = 50, skip = 0 } = req.query;
        const query = {};

        if (level && level !== 'ALL') {
            query.level = level;
        }

        if (search) {
            query.$or = [
                { message: { $regex: search, $options: 'i' } },
                { module: { $regex: search, $options: 'i' } },
                { user: { $regex: search, $options: 'i' } }
            ];
        }

        const logs = await Log.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const total = await Log.countDocuments(query);

        res.status(200).json({
            success: true,
            count: logs.length,
            total,
            logs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching logs',
            error: error.message
        });
    }
};

// Clear all logs
exports.clearLogs = async (req, res) => {
    try {
        await Log.deleteMany({});
        res.status(200).json({
            success: true,
            message: 'All logs cleared successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error clearing logs',
            error: error.message
        });
    }
};

// Get alerts (Simplified)
exports.getAlerts = async (req, res) => {
    try {
        const alerts = [];

        // Logic for generating alerts
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const memUsage = ((totalMem - freeMem) / totalMem) * 100;

        if (memUsage > 90) {
            alerts.push({
                type: 'critical',
                message: 'High Memory Usage',
                metric: 'memory',
                value: memUsage.toFixed(1) + '%'
            });
        }

        const cpus = os.cpus();
        const loadAvg = os.loadavg();
        const cpuUsage = (loadAvg[0] / cpus.length) * 100;

        if (cpuUsage > 80) {
            alerts.push({
                type: 'warning',
                message: 'High CPU Load',
                metric: 'cpu',
                value: cpuUsage.toFixed(1) + '%'
            });
        }

        res.status(200).json({
            success: true,
            count: alerts.length,
            alerts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching alerts',
            error: error.message
        });
    }
};

// Helper: Format uptime
function formatUptime(seconds) {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor(seconds % (3600 * 24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);

    const dDisplay = d > 0 ? d + (d == 1 ? "d " : "d ") : "";
    const hDisplay = h > 0 ? h + (h == 1 ? "h " : "h ") : "";
    const mDisplay = m > 0 ? m + (m == 1 ? "m " : "m ") : "";
    const sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}
