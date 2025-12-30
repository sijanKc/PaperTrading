const express = require('express');
const router = express.Router();
const competitionController = require('../controllers/competitionController');
const auth = require('../middleware/auth');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public/Auth routes
router.get('/', auth, competitionController.getAllCompetitions);
router.get('/:id', auth, competitionController.getCompetitionDetails);
router.get('/:id/leaderboard', auth, competitionController.getCompetitionLeaderboard);
router.post('/:id/join', auth, competitionController.joinCompetition);

// Admin only routes
router.post('/', [auth, adminMiddleware], competitionController.createCompetition);

module.exports = router;
