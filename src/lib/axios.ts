import axios from 'axios';
import { apiUrl } from './env';

// Create a custom Axios instance with default configurations
const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This is important for cookies/auth to work properly
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can modify the request config here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common API errors here
    return Promise.reject(error);
  }
);

export default apiClient; 