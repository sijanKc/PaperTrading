const mongoose = require('mongoose');
const Stock = require('./models/Stock');
require('dotenv').config();

const fixStockParameters = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const stocks = await Stock.find({});
        console.log(`📊 Found ${stocks.length} stocks to update`);

        // Define realistic parameters for each stock
        const stockParams = {
            'NABIL': { volatility: 0.25, drift: 0.08, beta: 1.2 },
            'SCB': { volatility: 0.22, drift: 0.12, beta: 1.1 },
            'UPPER': { volatility: 0.35, drift: 0.15, beta: 0.9 },
            'NLIC': { volatility: 0.30, drift: 0.10, beta: 1.0 },
            'EBL': { volatility: 0.28, drift: 0.09, beta: 1.15 },
            'HBL': { volatility: 0.26, drift: 0.11, beta: 1.12 },
            'NTC': { volatility: 0.20, drift: 0.06, beta: 0.8 },
            'NFS': { volatility: 0.32, drift: 0.14, beta: 1.3 },
            'HRL': { volatility: 0.40, drift: 0.18, beta: 0.85 },
            'LICN': { volatility: 0.28, drift: 0.10, beta: 1.05 },
            'CHCL': { volatility: 0.38, drift: 0.16, beta: 0.9 }
        };

        let updated = 0;

        for (const stock of stocks) {
            const params = stockParams[stock.symbol] || {
                volatility: 0.25,
                drift: 0.10,
                beta: 1.0
            };

            await Stock.findByIdAndUpdate(stock._id, {
                annualVolatility: params.volatility,
                annualDrift: params.drift,
                beta: params.beta,
                basePrice: stock.basePrice || stock.currentPrice, // Set basePrice if missing
                volume: stock.volume || 1000 // Set minimum volume if missing
            });

            console.log(`✅ Updated ${stock.symbol}: volatility=${params.volatility}, drift=${params.drift}, beta=${params.beta}`);
            updated++;
        }

        console.log(`\n🎉 Successfully updated ${updated} stocks!`);
        console.log('📈 Prices will now change dynamically on next update!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

fixStockParameters();
