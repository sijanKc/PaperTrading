const mongoose = require('mongoose');
const User = require('./models/User');
const Portfolio = require('./models/Portfolio');
const Stock = require('./models/Stock');
const Transaction = require('./models/Transaction');
require('dotenv').config();

const checkPortfolio = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ username: 'sijan' });
        if (!user) {
            console.log('User "sijan" not found');
            // Try to find any user
            const anyUser = await User.findOne();
            if (anyUser) {
                console.log('Found another user:', anyUser.username, anyUser._id);
                checkUserPortfolio(anyUser._id);
            } else {
                console.log('No users found');
            }
        } else {
            console.log('Found user "sijan":', user._id);
            await checkUserPortfolio(user._id);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
};

const checkUserPortfolio = async (userId) => {
    const portfolio = await Portfolio.find({ userId }).populate('stockId');
    console.log(`Found ${portfolio.length} portfolio items`);

    portfolio.forEach((item, index) => {
        console.log(`Item ${index + 1}:`);
        console.log('  Symbol:', item.symbol);
        console.log('  Quantity:', item.quantity);
        console.log('  StockId:', item.stockId ? item.stockId._id : 'NULL');
        if (item.stockId) {
            console.log('  Stock Price:', item.stockId.currentPrice);
        } else {
            console.log('  StockId is NULL - Population failed');
        }
    });

    const transactions = await Transaction.find({ userId });
    console.log(`Found ${transactions.length} transactions`);
    transactions.forEach((tx, index) => {
        console.log(`Tx ${index + 1}: ${tx.type} ${tx.symbol} ${tx.totalAmount} ${tx.status} ${tx.createdAt}`);
    });
};

checkPortfolio();
