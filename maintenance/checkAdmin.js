const mongoose = require('mongoose');
const User = require('./models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const checkAdmin = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env file');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Successfully');

        const admin = await User.findOne({ role: 'admin' });

        if (admin) {
            console.log('\n👑 Found Admin User:');
            console.log('--------------------');
            console.log('ID:       ', admin._id);
            console.log('Username: ', admin.username);
            console.log('Role:     ', admin.role);
            console.log('Email:    ', admin.contact.email);
            console.log('Approved: ', admin.approved ? '✅ Yes' : '❌ No');
            console.log('Verified: ', admin.isVerified ? '✅ Yes' : '❌ No');
            console.log('--------------------');
        } else {
            console.log('⚠️ No admin user found in the database.');
            console.log('💡 Tip: Run `node backend/seedAdmin.js` to create one.');
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error during diagnostic check:');
        console.error('Message:', error.message);

        if (error.message.includes('whitelsit') || error.message.includes('whitelist')) {
            console.log('\n💡 Tip: Your IP might not be whitelisted in MongoDB Atlas.');
        } else if (error.message.includes('buffering timed out')) {
            console.log('\n💡 Tip: Connection timed out. Check your internet connection or DB status.');
        }

        process.exit(1);
    }
};

checkAdmin();
