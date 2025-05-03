import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { showSnackbar } from '../lib/snackbar';

/**
 * Extract error message from RTK Query error objects
 */
export const extractRTKQueryErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined
): string => {
  if (!error) return 'An unknown error occurred';

  // Handle FetchBaseQueryError
  if ('status' in error) {
    // Log for debugging
    console.log("RTK Query error details:", error);
    
    // Check if it has a data property with a message
    if (
      error.data && 
      typeof error.data === 'object' && 
      'message' in error.data && 
      typeof error.data.message === 'string'
    ) {
      return error.data.message;
    }

    // Handle based on status code
    if (error.status === 401) {
      return 'Invalid credentials or unauthorized access';
    } else if (error.status === 404) {
      return 'Resource not found';
    } else if (error.status === 429) {
      return 'Too many requests. Please try again later.';
    } else if (error.status === 500) {
      return 'Server error occurred';
    }

    // Return the status text if available
    if (typeof error.status === 'string') {
      return `Error: ${error.status}`;
    }

    // Default error for HTTP errors
    return `Error: ${error.status}`;
  }

  // Handle SerializedError
  if ('message' in error && error.message) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

/**
 * Handle RTK Query errors and show appropriate snackbar
 */
export const handleRTKQueryError = (
  error: FetchBaseQueryError | SerializedError | undefined
): void => {
  if (!error) return;

  const errorMessage = extractRTKQueryErrorMessage(error);
  console.error('RTK Query Error:', error);
  
  // Force immediate display of snackbar
  showSnackbar(errorMessage, 'error');
}; 