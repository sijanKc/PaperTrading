const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const auth = require('../middleware/auth');

// All settings routes are private
router.use(auth);

// Get user settings
router.get('/', settingsController.getSettings);

// Update user settings
router.put('/', settingsController.updateSettings);

// Reset settings to default
router.post('/reset', settingsController.resetSettings);

module.exports = router;
