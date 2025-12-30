const mongoose = require('mongoose');
const User = require('./models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const users = await User.find({}, 'username contact.email citizenNo');
        console.log('--- REGISTERED USERS ---');
        users.forEach(u => {
            console.log(`Username: ${u.username} | Email: ${u.contact?.email} | CitizenNo: ${u.citizenNo}`);
        });

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listUsers();
