import { Button } from './ui/button';
import { showSnackbar } from '@/lib/snackbar';
import { useRegisterOtpMutation } from '@/redux/services/userServices';
import { useEffect } from 'react';
import { handleRTKQueryError } from '@/redux/errorHandler';

/**
 * A hidden test component to verify the snackbar system works properly
 * This component can be temporarily added to any page to test error handling
 */
const TestSnackbar = () => {
  const [
    registerOtp,
    {
      data: registerOtpData,
      error: registerOtpError,
      isSuccess: registerOtpIsSuccess,
      isLoading: registerOtpIsLoading,
      isError: registerOtpIsError
    }
  ] = useRegisterOtpMutation();

  // Test RTK error handling with a phone that already exists
  const testRTKError = () => {
    registerOtp({ phone: '+243891979018' });
  };

  // Test direct success snackbar
  const testSuccessSnackbar = () => {
    showSnackbar('Success message test', 'success');
  };

  // Test direct error snackbar
  const testErrorSnackbar = () => {
    showSnackbar('Error message test', 'error');
  };

  // Handle RTK Query errors
  useEffect(() => {
    if (registerOtpIsError) {
      console.log('Register OTP error in test component:', registerOtpError);
      handleRTKQueryError(registerOtpError);
    }
  }, [registerOtpIsError]);

  return (
    <div className="fixed bottom-20 right-5 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-50">
      <h3 className="text-lg font-bold mb-3">Snackbar Test</h3>
      <div className="flex flex-col space-y-2">
        <Button 
          onClick={testRTKError} 
          variant="destructive"
          disabled={registerOtpIsLoading}
        >
          Test 429 Error
        </Button>
        <Button onClick={testSuccessSnackbar} variant="default">
          Test Success
        </Button>
        <Button onClick={testErrorSnackbar} variant="destructive">
          Test Error
        </Button>
      </div>
    </div>
  );
};

export default TestSnackbar; 