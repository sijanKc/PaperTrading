const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@sanchaya.com';
        const adminUsername = 'admin';
        const adminPassword = '12345'; // The requested password

        const existingAdmin = await User.findOne({
            $or: [{ username: adminUsername }, { 'contact.email': adminEmail }]
        });

        if (existingAdmin) {
            console.log('Admin user already exists');

            // Update role if not admin
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('Updated existing user to admin role');
            }

            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        const newAdmin = new User({
            fullName: 'System Administrator',
            dob: new Date('1990-01-01'),
            gender: 'Other',
            nationality: 'Nepal',
            citizenNo: 'ADMIN_001',
            contact: {
                countryCode: '+977',
                mobile: '9800000000',
                email: adminEmail,
                address: 'Kathmandu, Nepal'
            },
            bankDetails: {
                bankName: 'N/A',
                branch: 'N/A',
                accountNumber: 'ADMIN_ACC',
                accountType: 'Savings'
            },
            username: adminUsername,
            password: hashedPassword,
            role: 'admin',
            isVerified: true,
            approved: true, // Auto-approve admin
            agreements: {
                confirmInfo: true,
                confirmPaperTrading: true
            }
        });

        await newAdmin.save();
        console.log('Admin user created successfully');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
