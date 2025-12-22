const initialStocks = [
  // Commercial Banks (Medium volatility, market correlated)
  { 
    symbol: "NABIL", 
    name: "Nabil Bank Limited", 
    sector: "Commercial Banks", 
    basePrice: 850, 
    annualVolatility: 0.22,        // 🔄 CHANGED from volatility
    annualDrift: 0.10,             // 🔄 NEW FIELD
    beta: 1.1                      // 🔄 NEW FIELD
  },
  { 
    symbol: "SCB", 
    name: "Standard Chartered Bank Nepal", 
    sector: "Commercial Banks", 
    basePrice: 380, 
    annualVolatility: 0.18,        // 🔄 CHANGED
    annualDrift: 0.08,             // 🔄 NEW
    beta: 0.9                      // 🔄 NEW
  },
  { 
    symbol: "EBL", 
    name: "Everest Bank Limited", 
    sector: "Commercial Banks", 
    basePrice: 520, 
    annualVolatility: 0.20,        // 🔄 CHANGED
    annualDrift: 0.09,             // 🔄 NEW
    beta: 1.0                      // 🔄 NEW
  },
  { 
    symbol: "HBL", 
    name: "Himalayan Bank Limited", 
    sector: "Commercial Banks", 
    basePrice: 280, 
    annualVolatility: 0.25,        // 🔄 CHANGED
    annualDrift: 0.07,             // 🔄 NEW
    beta: 1.2                      // 🔄 NEW
  },
  
  // Insurance Companies (Medium volatility)
  { 
    symbol: "NLIC", 
    name: "National Life Insurance", 
    sector: "Insurance", 
    basePrice: 850, 
    annualVolatility: 0.24,        // 🔄 CHANGED
    annualDrift: 0.11,             // 🔄 NEW
    beta: 0.8                      // 🔄 NEW
  },
  { 
    symbol: "LICN", 
    name: "Life Insurance Co. Nepal", 
    sector: "Insurance", 
    basePrice: 1250, 
    annualVolatility: 0.21,        // 🔄 CHANGED
    annualDrift: 0.12,             // 🔄 NEW
    beta: 0.7                      // 🔄 NEW
  },
  
  // HydroPower (Low volatility, stable)
  { 
    symbol: "CHCL", 
    name: "Chilime Hydropower", 
    sector: "HydroPower", 
    basePrice: 380, 
    annualVolatility: 0.15,        // 🔄 CHANGED
    annualDrift: 0.06,             // 🔄 NEW
    beta: 0.5                      // 🔄 NEW
  },
  { 
    symbol: "UPPER", 
    name: "Upper Tamakoshi Hydropower", 
    sector: "HydroPower", 
    basePrice: 200, 
    annualVolatility: 0.16,        // 🔄 CHANGED
    annualDrift: 0.05,             // 🔄 NEW
    beta: 0.6                      // 🔄 NEW
  },
  
  // Development Banks & Finance (Higher volatility)
  { 
    symbol: "NTC", 
    name: "Nepal Telecom", 
    sector: "Development Bank", 
    basePrice: 680, 
    annualVolatility: 0.12,        // 🔄 CHANGED
    annualDrift: 0.04,             // 🔄 NEW
    beta: 0.4                      // 🔄 NEW
  },
  { 
    symbol: "NFS", 
    name: "Nepal Finance Ltd", 
    sector: "Finance", 
    basePrice: 180, 
    annualVolatility: 0.35,        // 🔄 CHANGED
    annualDrift: -0.02,            // 🔄 NEW (negative - declining)
    beta: 1.3                      // 🔄 NEW
  }
];

module.exports = initialStocks;