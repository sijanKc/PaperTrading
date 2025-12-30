const mongoose = require('mongoose');
const Stock = require('./models/Stock');
require('dotenv').config();

const resetPrices = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const stocks = await Stock.find({ isActive: true });
        console.log(`📊 Resetting ${stocks.length} stocks to baseline prices...`);

        for (const stock of stocks) {
            const oldPrice = stock.currentPrice;

            // Reset to base price
            stock.previousClose = stock.basePrice;
            stock.currentPrice = stock.basePrice;
            stock.dayHigh = stock.basePrice;
            stock.dayLow = stock.basePrice;
            stock.change = 0;
            stock.changePercent = 0;

            // Limit price history to prevent bloating after many crashes
            if (stock.priceHistory.length > 10) {
                stock.priceHistory = stock.priceHistory.slice(-10);
            }

            await stock.save();
            console.log(`🔄 ${stock.symbol}: ₹${oldPrice.toFixed(2)} → ₹${stock.currentPrice.toFixed(2)} (RELOADED FROM BASE)`);
        }

        console.log('\n✅ All stock prices have been restored successfully! 🚀');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error resetting prices:', error);
        process.exit(1);
    }
};

resetPrices();
