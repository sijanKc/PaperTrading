import api from './api';

export const portfolioService = {
  // Get money overview for cards
  getOverview: () => api.get('/portfolio/overview'),
  
  // Get all stocks you own
  getHoldings: () => api.get('/portfolio/holdings'),
  
  // Get simple summary
  getSummary: () => api.get('/portfolio/summary'),
};