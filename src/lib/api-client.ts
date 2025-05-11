// API client for SME.AI application

import axios, { AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Get token from localStorage or secure storage
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    
    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Implement token refresh logic here if needed
      
      // For now, redirect to login
      if (typeof window !== 'undefined') {
        // Clear user session
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API request methods
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    apiClient.get<T>(url, config).then(response => response.data),
  
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.post<T>(url, data, config).then(response => response.data),
  
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.put<T>(url, data, config).then(response => response.data),
  
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    apiClient.delete<T>(url, config).then(response => response.data),
};

export default api;