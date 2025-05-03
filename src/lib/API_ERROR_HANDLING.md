# API Error Handling System

This document explains how to use the API error handling system with snackbar notifications in the Bomoko Fund application.

## Overview

The system automatically shows:
- Error messages in red snackbars
- Success messages in green snackbars

All API responses are handled by axios interceptors that extract messages from the response and display them appropriately.

## Backend Response Format

The API returns responses in the following format:

```javascript
// Error responses (4xx, 5xx status codes)
{
  message: "Error message describing what went wrong",
  // Sometimes includes additional error details
}

// Success responses (2xx status codes)
{
  message: "Success message",
  // Sometimes includes additional data like updatedUser, token, etc.
}
```

## How to Use

### Making API Requests with Axios

Use the `apiRequest` utility function to make API requests:

```typescript
import { apiRequest } from '../lib/utils';

// Example function in a component
const fetchUserData = async () => {
  try {
    // The snackbar will automatically show success messages
    const data = await apiRequest<UserData>('get', '/api/user/profile');
    return data;
  } catch (error) {
    // The snackbar will automatically show error messages
    // You can handle any additional error logic here if needed
    return null;
  }
};
```

### RTK Query Error Handling

For RTK Query mutations and queries, use the `handleRTKQueryError` utility:

```typescript
import { useLoginPhoneMutation } from '@/redux/services/userServices';
import { handleRTKQueryError } from '@/redux/errorHandler';

function LoginComponent() {
  const [
    loginWithPhone,
    {
      data,
      error,
      isSuccess,
      isLoading,
      isError
    }
  ] = useLoginPhoneMutation();

  useEffect(() => {
    if (isSuccess && data) {
      // Handle success
    }
    if (isError) {
      // Handle the error with our utility
      handleRTKQueryError(error);
    }
  }, [isSuccess, isError]);

  // Rest of the component
}
```

### Manual Error Handling

For cases where the automatic error handling doesn't trigger (e.g., in custom API calls not using the apiRequest utility), use the handleApiError utility:

```typescript
import axios from 'axios';
import { handleApiError } from '../lib/utils';

// Example of manual error handling
const customApiCall = async () => {
  try {
    const response = await axios.post('https://api.bomoko.fund/api/auth/login-phone', data);
    return response.data;
  } catch (error) {
    // Manually handle the error to show the snackbar
    handleApiError(error);
    return null;
  }
};
```

### Manual Snackbar Display

If you need to manually show snackbars (for non-API related messages):

```typescript
import { showSnackbar } from '../lib/snackbar';

// Show success message
showSnackbar('Operation completed successfully', 'success');

// Show error message
showSnackbar('Something went wrong', 'error');
```

## Implementation Details

The system consists of:

1. **Axios Interceptors** - Automatically capture API responses and errors
2. **Snackbar Utilities** - Format and display toast messages
3. **Custom Toaster Component** - Styled toast notifications using react-hot-toast
4. **Error Extraction Logic** - Enhanced logic to handle various error formats
5. **RTK Query Integration** - Handler for RTK Query errors

Files:
- `src/lib/axios.ts` - Contains the axios interceptors
- `src/lib/snackbar.ts` - Contains utility functions for showing snackbar notifications
- `src/components/ui/Toaster.tsx` - Custom styled Toaster component
- `src/lib/utils.ts` - Contains the apiRequest and handleApiError utility functions
- `src/redux/errorHandler.ts` - Contains utilities for handling RTK Query errors

## Debugging

If snackbars are not showing for API errors, check the browser console for logged errors. The system logs detailed error information to help with debugging. 