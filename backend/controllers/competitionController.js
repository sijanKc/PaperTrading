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

        // Count participants and check if current user is joined
        const competitionsWithDetails = await Promise.all(competitions.map(async (comp) => {
            const participantCount = await CompetitionParticipant.countDocuments({ competitionId: comp._id });
            const isJoined = req.user ? await CompetitionParticipant.exists({
                competitionId: comp._id,
                userId: req.user._id
            }) : false;

            const now = new Date();
            let effectiveStatus = comp.status;

            // Robust Status Resolve
            if (comp.status === 'completed' || now > new Date(comp.endDate)) {
                effectiveStatus = 'completed';
            } else if (comp.status === 'active' || now >= new Date(comp.startDate)) {
                effectiveStatus = 'active';
            } else {
                effectiveStatus = 'upcoming';
            }

            return {
                ...comp.toObject(),
                status: effectiveStatus, // Override with dynamic status
                participantsCount: participantCount,
                isJoined: !!isJoined
            };
        }));

        res.json({
            success: true,
            data: competitionsWithDetails
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

        const now = new Date();
        let effectiveStatus = competition.status;

        // Robust Status Resolve
        if (competition.status === 'completed' || now > new Date(competition.endDate)) {
            effectiveStatus = 'completed';
        } else if (competition.status === 'active' || now >= new Date(competition.startDate)) {
            effectiveStatus = 'active';
        } else {
            effectiveStatus = 'upcoming';
        }

        res.json({
            success: true,
            data: {
                ...competition.toObject(),
                status: effectiveStatus,
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

// Update Competition (Admin only)
const updateCompetition = async (req, res) => {
    try {
        const { id } = req.params;
        const competition = await Competition.findByIdAndUpdate(id, req.body, { new: true });
        if (!competition) {
            return res.status(404).json({ success: false, message: 'Competition not found' });
        }
        res.json({ success: true, message: 'Competition updated successfully', data: competition });
    } catch (error) {
        console.error('Update competition error:', error);
        res.status(500).json({ success: false, message: 'Failed to update competition' });
    }
};

// Update Competition Status (Admin only)
const updateCompetitionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const competition = await Competition.findByIdAndUpdate(id, { status }, { new: true });
        if (!competition) {
            return res.status(404).json({ success: false, message: 'Competition not found' });
        }
        res.json({ success: true, message: 'Competition status updated successfully', data: competition });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ success: false, message: 'Failed to update status' });
    }
};

// Delete Competition (Admin only)
const deleteCompetition = async (req, res) => {
    try {
        const { id } = req.params;
        const competition = await Competition.findByIdAndDelete(id);
        if (!competition) {
            return res.status(404).json({ success: false, message: 'Competition not found' });
        }
        // Also delete participants
        await CompetitionParticipant.deleteMany({ competitionId: id });
        res.json({ success: true, message: 'Competition deleted successfully' });
    } catch (error) {
        console.error('Delete competition error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete competition' });
    }
};

module.exports = {
    createCompetition,
    getAllCompetitions,
    getCompetitionDetails,
    joinCompetition,
    getCompetitionLeaderboard,
    updateCompetition,
    updateCompetitionStatus,
    deleteCompetition
};
