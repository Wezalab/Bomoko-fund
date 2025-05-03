import axios from 'axios';
import { apiUrl } from './env';
import { showSnackbar, extractErrorMessage } from './snackbar';

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
    // If the response has a message, show a success snackbar
    if (response.data && response.data.message) {
      showSnackbar(response.data.message, 'success');
    }
    return response;
  },
  (error) => {
    // Extract and display error message
    const errorMessage = extractErrorMessage(error);
    
    // Log the error for debugging
    console.error('API Error:', error.response?.status, errorMessage, error.response?.data);
    
    // Ensure the snackbar is shown for all error types
    showSnackbar(errorMessage, 'error');
    
    return Promise.reject(error);
  }
);

export default apiClient; 