const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const adminMiddleware = require('../middleware/adminMiddleware');

// All report routes are protected and admin only
router.use(adminMiddleware);

router.get('/', reportController.getReports);
router.post('/generate', reportController.generateReport);
router.delete('/:id', reportController.deleteReport);

module.exports = router;
