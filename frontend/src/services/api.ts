// src/services/api.ts
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  
  baseURL: 'https://smart-leads-pipeline-management-dashboard.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
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