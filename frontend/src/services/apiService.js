// src/services/apiService.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for adding auth tokens if needed
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

// Add response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global error responses (e.g., 401, 403, 500)
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          console.log('Unauthorized access');
          break;
        case 403:
          // Handle forbidden
          console.log('Forbidden access');
          break;
        case 500:
          // Handle server error
          console.log('Server error');
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default api;