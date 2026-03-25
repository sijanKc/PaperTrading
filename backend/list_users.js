const mongoose = require('mongoose');
const User = require('./models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const listUsers = async () => {
    try {
        const uri = process.env.MONGODB_URI.replace('/mydb', '/paper_trading');
        await mongoose.connect(uri);
        console.log('Connected to DB');

        const users = await User.find({}, 'username email role isApproved isActive password');
        console.log('--- REGISTERED USERS ---');
        users.forEach(u => {
            console.log(`Username: ${u.username} | Email: ${u.email} | Role: ${u.role} | Approved: ${u.isApproved} | Active: ${u.isActive}`);
        });

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listUsers();
