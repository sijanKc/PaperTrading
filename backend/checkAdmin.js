const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const admin = await User.findOne({ role: 'admin' });

        if (admin) {
            console.log('Found Admin User:');
            console.log('ID:', admin._id);
            console.log('Username:', admin.username);
            console.log('Role:', admin.role);
            console.log('Email:', admin.contact.email);
        } else {
            console.log('No admin user found.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkAdmin();
