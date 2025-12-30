const Competition = require('../models/Competition');
const CompetitionParticipant = require('../models/CompetitionParticipant');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Create Competition (Admin only)
const createCompetition = async (req, res) => {
    try {
        const competitionData = {
            ...req.body,
            createdBy: req.user._id
        };

        const competition = new Competition(competitionData);
        await competition.save();

        res.status(201).json({
            success: true,
            message: 'Competition created successfully',
            data: competition
        });
    } catch (error) {
        console.error('Create competition error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to create competition' });
    }
};

// Get All Competitions
const getAllCompetitions = async (req, res) => {
    try {
        const { status, type } = req.query;
        const query = {};
        if (status) query.status = status;
        if (type) query.type = type;

        const competitions = await Competition.find(query).sort({ createdAt: -1 });

        // Count participants for each competition
        const competitionsWithCounts = await Promise.all(competitions.map(async (comp) => {
            const participantCount = await CompetitionParticipant.countDocuments({ competitionId: comp._id });
            return {
                ...comp.toObject(),
                participantsCount: participantCount
            };
        }));

        res.json({
            success: true,
            data: competitionsWithCounts
        });
    } catch (error) {
        console.error('Get competitions error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch competitions' });
    }
};

// Get Competition Details
const getCompetitionDetails = async (req, res) => {
    try {
        const competition = await Competition.findById(req.params.id);
        if (!competition) {
            return res.status(404).json({ success: false, message: 'Competition not found' });
        }

        const participantCount = await CompetitionParticipant.countDocuments({ competitionId: competition._id });
        const isJoined = req.user ? await CompetitionParticipant.exists({ competitionId: competition._id, userId: req.user._id }) : false;

        res.json({
            success: true,
            data: {
                ...competition.toObject(),
                participantsCount: participantCount,
                isJoined: !!isJoined
            }
        });
    } catch (error) {
        console.error('Get competition details error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch competition details' });
    }
};

// Join Competition
const joinCompetition = async (req, res) => {
    try {
        const competition = await Competition.findById(req.params.id);
        if (!competition) {
            return res.status(404).json({ success: false, message: 'Competition not found' });
        }

        if (competition.status !== 'upcoming' && competition.status !== 'active') {
            return res.status(400).json({ success: false, message: 'Competition is not accepting participants' });
        }

        const participantCount = await CompetitionParticipant.countDocuments({ competitionId: competition._id });
        if (participantCount >= competition.maxParticipants) {
            return res.status(400).json({ success: false, message: 'Competition is full' });
        }

        // Check if user already joined
        const alreadyJoined = await CompetitionParticipant.findOne({ competitionId: competition._id, userId: req.user._id });
        if (alreadyJoined) {
            return res.status(400).json({ success: false, message: 'You have already joined this competition' });
        }

        // Create participant record
        const participant = new CompetitionParticipant({
            competitionId: competition._id,
            userId: req.user._id,
            currentBalance: competition.startingBalance
        });

        await participant.save();

        res.status(201).json({
            success: true,
            message: 'Joined competition successfully',
            data: participant
        });
    } catch (error) {
        console.error('Join competition error:', error);
        res.status(500).json({ success: false, message: 'Failed to join competition' });
    }
};

// Get Competition Leaderboard
const getCompetitionLeaderboard = async (req, res) => {
    try {
        const { id } = req.params;

        // In a real implementation, we would calculate this dynamically
        // For now, let's fetch participants and sort by profit
        const participants = await CompetitionParticipant.find({ competitionId: id })
            .populate('userId', 'fullName username avatar')
            .sort({ totalProfitLoss: -1 });

        const formattedLeaderboard = participants.map((p, index) => ({
            rank: index + 1,
            userId: p.userId._id,
            name: p.userId.fullName,
            username: p.userId.username,
            avatar: p.userId.avatar,
            profit: p.totalProfitLoss,
            balance: p.currentBalance,
            trades: p.tradesCount
        }));

        res.json({
            success: true,
            data: formattedLeaderboard
        });
    } catch (error) {
        console.error('Get competition leaderboard error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch leaderboard' });
    }
};

module.exports = {
    createCompetition,
    getAllCompetitions,
    getCompetitionDetails,
    joinCompetition,
    getCompetitionLeaderboard
};
