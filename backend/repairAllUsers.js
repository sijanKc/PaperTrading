const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const repairAllUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find all users who are not verified
        const unverifiedUsers = await User.find({ isVerified: false });
        console.log(`Found ${unverifiedUsers.length} unverified users.`);

        if (unverifiedUsers.length > 0) {
            const result = await User.updateMany(
                { isVerified: false },
                { $set: { isVerified: true } }
            );
            console.log(`Updated ${result.modifiedCount} users to isVerified: true.`);
        }

        // Also ensure all non-admin users have approved: false if they are not explicitly approved
        // This ensures they show up as "Pending" if they were just stuck.
        // However, we don't want to unapprove already working users if any exist.
        // Let's just count total users to visually verify.
        const totalUsers = await User.countDocuments();
        console.log(`Total users in database: ${totalUsers}`);

        const allUsers = await User.find({}, 'username email role isVerified approved');
        console.table(allUsers.map(u => ({
            username: u.username,
            role: u.role,
            verified: u.isVerified,
            approved: u.approved
        })));

        process.exit(0);

    } catch (error) {
        console.error('Error repairing users:', error);
        process.exit(1);
    }
};

repairAllUsers();
