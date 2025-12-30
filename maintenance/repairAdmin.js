const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const repairAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminUsername = 'admin';

        const adminUser = await User.findOne({ username: adminUsername });

        if (!adminUser) {
            console.log('Admin user not found!');
            process.exit(1);
        }

        console.log('Found admin user. Current status:', {
            isVerified: adminUser.isVerified,
            approved: adminUser.approved,
            role: adminUser.role
        });

        // Update fields
        adminUser.isVerified = true;
        adminUser.approved = true;
        adminUser.isActive = true;

        await adminUser.save();

        console.log('Admin user repaired successfully! You can now login.');
        console.log('New status:', {
            isVerified: adminUser.isVerified, // Should be true
            approved: adminUser.approved,     // Should be true
        });

        process.exit(0);

    } catch (error) {
        console.error('Error repairing admin:', error);
        process.exit(1);
    }
};

repairAdmin();
