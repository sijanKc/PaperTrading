const Report = require('../models/Report');

// Get all reports
exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find().sort({ generatedAt: -1 });
        res.status(200).json({
            success: true,
            count: reports.length,
            reports
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error fetching reports',
            error: error.message
        });
    }
};

// Generate a new report (Simulated)
exports.generateReport = async (req, res) => {
    try {
        const { name, type, format, schedule } = req.body;

        if (!name || !type || !format) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Determine period based on current date
        const period = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        // Simulate size
        const size = `${(Math.random() * 5).toFixed(1)} MB`;

        const newReport = await Report.create({
            name,
            type,
            period,
            status: 'generated', // For now, we simulate immediate generation
            size,
            format,
            generatedAt: new Date(),
            scheduled: schedule !== 'once',
            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            report: newReport
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error generating report',
            error: error.message
        });
    }
};

// Delete a report
exports.deleteReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        await report.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Report deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error deleting report',
            error: error.message
        });
    }
};
