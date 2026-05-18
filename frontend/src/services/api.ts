// src/services/api.ts
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
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