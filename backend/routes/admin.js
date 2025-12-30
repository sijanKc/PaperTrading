const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');

// Validates that user is admin for all routes here
router.use(adminMiddleware);

// Stats
router.get('/stats', adminController.getDashboardStats);

// User Management
router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.post('/users/:id/approve', adminController.approveUser); // New approval route
router.put('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

// Trading Rules Management
router.get('/trading-rules', adminController.getTradingRules);
router.put('/trading-rules', adminController.updateTradingRules);

module.exports = router;