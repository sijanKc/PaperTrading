const express = require('express');
const router = express.Router();
const monitoringController = require('../controllers/monitoringController');
const adminMiddleware = require('../middleware/adminMiddleware');

// All monitoring routes are admin only
router.use(adminMiddleware);

router.get('/metrics', monitoringController.getSystemMetrics);
router.get('/logs', monitoringController.getLogs);
router.delete('/logs', monitoringController.clearLogs);
router.get('/alerts', monitoringController.getAlerts);

module.exports = router;
