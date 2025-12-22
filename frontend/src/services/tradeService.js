import api from './api';

export const tradeService = {
  // Buy stocks
  buyStock: (orderData) => api.post('/trade/buy', orderData),
  
  // Sell stocks  
  sellStock: (orderData) => api.post('/trade/sell', orderData),
  
  // Get your portfolio
  getPortfolio: () => api.get('/trade/portfolio'),
  
  // Get transaction history
  getTransactions: (limit = 50) => api.get(`/trade/transactions?limit=${limit}`),
};