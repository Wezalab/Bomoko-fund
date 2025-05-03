import toast from 'react-hot-toast';

// Snackbar display function that uses toast
export const showSnackbar = (message: string, type: 'success' | 'error') => {
  // Cancel any existing toasts first
  toast.dismiss();
  
  // Create toast with proper configuration
  if (type === 'success') {
    toast.success(message, {
      duration: 5000,
      position: 'bottom-center',
      // Make toast more visible
      style: {
        background: '#10b981',
        color: '#fff',
        fontWeight: 'bold',
        minWidth: '250px',
        textAlign: 'center',
      }
    });
  } else {
    toast.error(message, {
      duration: 5000,
      position: 'bottom-center',
      // Make toast more visible
      style: {
        background: '#ef4444',
        color: '#fff',
        fontWeight: 'bold',
        minWidth: '250px',
        textAlign: 'center',
      }
    });
  }
  
  // Also log to console for debugging
  if (type === 'error') {
    console.error('Error Snackbar:', message);
  } else {
    console.log('Success Snackbar:', message);
  }
};

// Function to extract error messages from API responses
export const extractErrorMessage = (error: any): string => {
  // Default error message
  let errorMessage = 'An unexpected error occurred';
  
  // Check if it's an axios error with a response
  if (error.response) {
    const { status, data } = error.response;
    
    // If the response contains a message, use it
    if (data && typeof data.message === 'string') {
      errorMessage = data.message;
    } 
    // Handle specific status codes if needed
    else if (status === 401) {
      errorMessage = 'Invalid credentials or unauthorized access';
    } else if (status === 403) {
      errorMessage = 'Access forbidden';
    } else if (status === 404) {
      errorMessage = 'Resource not found';
    } else if (status === 429) {
      errorMessage = 'Too many requests. Please try again later.';
    } else if (status === 500) {
      errorMessage = 'Server error occurred';
    }
  } 
  // Handle network errors
  else if (error.request) {
    errorMessage = 'Network error - please check your connection';
  }
  // Handle other types of errors
  else if (error.message) {
    errorMessage = error.message;
  }
  
  return errorMessage;
}; 