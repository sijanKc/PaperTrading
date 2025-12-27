const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nepse_trading')
    .then(async () => {
        console.log('Connected to DB');
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

        // Fix 1: Set isVerified = true for ALL users
        const result = await User.updateMany(
            {},
            { $set: { isVerified: true } }
        );
        console.log(`Updated ${result.modifiedCount} users to verified.`);

        // Check 'sijan' specifically
        const sijan = await User.findOne({
            $or: [{ username: 'sijan' }, { 'contact.email': 'sijan' }] // Loose check
        });

        if (sijan) {
            console.log('Sijan status:', JSON.stringify(sijan, null, 2));
        } else {
            console.log('User Sijan not found via simple query');
            // List all to check names
            const all = await User.find({}, 'username contact.email');
            console.log('All Users:', all.map(u => u.username));
        }

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
