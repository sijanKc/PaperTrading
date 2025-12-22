import axios from 'axios';

// Use environment variable for API URL (defaults to localhost for development)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Your delivery car 🚗
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds max wait
});

// Always bring money (token) automatically 💰
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle shop closed (errors) 🚫
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - go to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;