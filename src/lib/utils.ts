import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import apiClient from './axios';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { showSnackbar, extractErrorMessage } from './snackbar';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to make API requests with error handling
export const apiRequest = async <T>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string, 
  data?: any, 
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    let response;
    
    switch (method) {
      case 'get':
        response = await apiClient.get<T>(url, config);
        break;
      case 'post':
        response = await apiClient.post<T>(url, data, config);
        break;
      case 'put':
        response = await apiClient.put<T>(url, data, config);
        break;
      case 'delete':
        response = await apiClient.delete<T>(url, config);
        break;
      default:
        throw new Error('Invalid request method');
    }
    
    return response.data;
  } catch (error) {
    // Error handling is now done by the axios interceptors
    throw error;
  }
};

// Utility function to manually handle API errors
export const handleApiError = (error: unknown): void => {
  if (error instanceof AxiosError) {
    const errorMessage = extractErrorMessage(error);
    showSnackbar(errorMessage, 'error');
    console.error('API Error (manual handling):', error.response?.status, errorMessage);
  } else if (error instanceof Error) {
    showSnackbar(error.message, 'error');
    console.error('Non-API Error:', error);
  } else {
    showSnackbar('An unexpected error occurred', 'error');
    console.error('Unknown Error:', error);
  }
};
