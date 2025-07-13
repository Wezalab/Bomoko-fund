import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleAuthIntegration } from '@/lib/googleAuth';
import LoadingComponent from '@/components/LoadingComponent';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { checkAuthAfterRedirect } = useGoogleAuthIntegration();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Handling Google OAuth callback...');
        
        // Check if authentication was successful
        const result = await checkAuthAfterRedirect();
        
        if (result && result.success) {
          console.log('Google OAuth successful, redirecting...');
          // Redirect to dashboard or home page after successful authentication
          navigate('/dashboard');
        } else {
          console.log('Google OAuth failed, redirecting to login...');
          // Redirect to login with error
          navigate('/login?error=oauth_failed');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        navigate('/login?error=oauth_failed');
      } finally {
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [checkAuthAfterRedirect, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="mb-4">
            <LoadingComponent />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Completing Google Sign In...
          </h2>
          <p className="text-gray-600">
            Please wait while we complete your authentication.
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleCallback; 