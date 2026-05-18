// src/services/api.ts
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  // Use environment variables for production, default to local backend
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add an interceptor to automatically attach the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    // We must ensure config.headers exists before assigning to it
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;