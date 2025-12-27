const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nepse_trading')
    .then(() => console.log('Connected'))
    .catch(err => console.log(err));

const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', UserSchema);

async function checkUsers() {
    const users = await User.find({}, 'username contact.email isVerified approved');
    console.log('--- USER STATUS ---');
    console.table(users.map(u => ({
        username: u.username,
        email: u.contact?.email,
        isVerified: u.isVerified,
        approved: u.approved
    })));
    process.exit();
}

checkUsers();
