const mongoose = require('mongoose');
const User = require('./models/User');
const Portfolio = require('./models/Portfolio');
const Stock = require('./models/Stock');
const Transaction = require('./models/Transaction');
require('dotenv').config();

const repairPortfolio = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find all users who have transactions
        const users = await User.find({});
        console.log(`Found ${users.length} users to check.`);

        for (const user of users) {
            console.log(`\nProcessing user: ${user.username} (${user._id})`);
            await repairUserPortfolio(user._id);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
};

const repairUserPortfolio = async (userId) => {
    // 1. Get all COMPLETED transactions sorted by date
    const transactions = await Transaction.find({
        userId,
        status: 'COMPLETED'
    }).sort({ createdAt: 1 });

    if (transactions.length === 0) {
        console.log('  No transactions found.');
        return;
    }

    console.log(`  Found ${transactions.length} transactions. Reconstructing portfolio...`);

    // 2. Reconstruct portfolio in memory
    const portfolioMap = {}; // stockId -> { quantity, totalInvestment, averageBuyPrice, symbol, sector }

    for (const tx of transactions) {
        const stockId = tx.stockId.toString();

        if (!portfolioMap[stockId]) {
            // Need to fetch stock details for sector if not already known
            // Ideally we should have sector in transaction but we might not.
            // Let's fetch stock if needed.
            const stock = await Stock.findById(stockId);
            if (!stock) {
                console.log(`  WARNING: Stock ${stockId} not found for tx ${tx._id}. Skipping.`);
                continue;
            }

            portfolioMap[stockId] = {
                stockId: stockId,
                symbol: stock.symbol,
                sector: stock.sector, // Crucial missing field
                quantity: 0,
                totalInvestment: 0,
                averageBuyPrice: 0
            };
        }

        const entry = portfolioMap[stockId];

        if (tx.type === 'BUY') {
            const newQuantity = entry.quantity + tx.quantity;
            const newTotalInvestment = entry.totalInvestment + tx.totalAmount;
            entry.averageBuyPrice = newTotalInvestment / newQuantity;
            entry.quantity = newQuantity;
            entry.totalInvestment = newTotalInvestment;
        } else if (tx.type === 'SELL') {
            const newQuantity = entry.quantity - tx.quantity;
            if (newQuantity <= 0) {
                delete portfolioMap[stockId];
            } else {
                // When selling, average buy price doesn't change, but total investment reduces proportionally
                entry.totalInvestment = entry.averageBuyPrice * newQuantity;
                entry.quantity = newQuantity;
            }
        }
    }

    // 3. Update Database
    console.log('  Syncing with database...');

    // Clear existing portfolio for user to avoid duplicates/conflicts
    await Portfolio.deleteMany({ userId });

    const portfolioItems = Object.values(portfolioMap);
    if (portfolioItems.length === 0) {
        console.log('  Portfolio is empty after reconstruction.');
        return;
    }

    for (const item of portfolioItems) {
        const portfolioEntry = new Portfolio({
            userId,
            stockId: item.stockId,
            symbol: item.symbol,
            quantity: item.quantity,
            averageBuyPrice: item.averageBuyPrice,
            totalInvestment: item.totalInvestment,
            sector: item.sector
        });
        await portfolioEntry.save();
        console.log(`  Saved ${item.symbol}: ${item.quantity} shares`);
    }

    console.log('  Portfolio repair complete for user.');
};

repairPortfolio();
