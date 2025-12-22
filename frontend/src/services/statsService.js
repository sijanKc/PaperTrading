// src/services/statsService.js
import api from './api';

export const statsService = {
  // Get paper trading statistics
  getPaperStats: () => api.get('/stats/paper'),
  
  // Get stats overview for dashboard
  getStatsOverview: () => api.get('/stats/overview'),
  
  // Get performance analytics
  getPerformanceStats: () => api.get('/analytics/performance'),
  
  // Get risk metrics
  getRiskMetrics: () => api.get('/analytics/risk')
};