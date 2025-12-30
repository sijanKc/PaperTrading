const mongoose = require('mongoose');
const Stock = require('./models/Stock');
require('dotenv').config();

const forcePriceUpdate = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const stocks = await Stock.find({ isActive: true });
        console.log(`📊 Forcing price updates for ${stocks.length} stocks...`);

        for (const stock of stocks) {
            // Generate a noticeable random change (-3% to +3%)
            const changePercent = (Math.random() - 0.5) * 6; // -3% to +3%
            const newPrice = stock.currentPrice * (1 + changePercent / 100);

            // Round to 2 decimals
            const roundedPrice = Math.round(newPrice * 100) / 100;

            // IMPORTANT: Modify and save to trigger pre-save hook
            stock.previousClose = stock.currentPrice;
            stock.currentPrice = roundedPrice;
            await stock.save(); // This triggers calculation of change & changePercent

            console.log(`📈 ${stock.symbol}: ₹${stock.previousClose.toFixed(2)} → ₹${stock.currentPrice.toFixed(2)} (${stock.change > 0 ? '+' : ''}${stock.change.toFixed(2)} = ${stock.changePercent > 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)`);
        }

        console.log('\n✅ All prices updated! Refresh your frontend to see changes.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

forcePriceUpdate();
