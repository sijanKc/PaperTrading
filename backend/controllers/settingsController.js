const Settings = require('../models/Settings');

// Get User Settings
const getSettings = async (req, res) => {
    try {
        const userId = req.user._id;
        let settings = await Settings.findOne({ userId });

        // If no settings exist for the user, create default settings
        if (!settings) {
            settings = new Settings({ userId });
            await settings.save();
        }

        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user settings'
        });
    }
};

// Update User Settings
const updateSettings = async (req, res) => {
    try {
        const userId = req.user._id;
        const settingsData = req.body;

        let settings = await Settings.findOneAndUpdate(
            { userId },
            { $set: settingsData },
            { new: true, upsert: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Settings updated successfully',
            data: settings
        });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating settings'
        });
    }
};

// Reset settings to default
const resetSettings = async (req, res) => {
    try {
        const userId = req.user._id;

        // Delete existing and let getSettings recreate defaults
        await Settings.deleteOne({ userId });

        const defaultSettings = new Settings({ userId });
        await defaultSettings.save();

        res.json({
            success: true,
            message: 'Settings reset to default',
            data: defaultSettings
        });
    } catch (error) {
        console.error('Reset settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting settings'
        });
    }
};

module.exports = {
    getSettings,
    updateSettings,
    resetSettings
};
