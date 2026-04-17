import { useAppDispatch } from "@/redux/hooks";
import { setToken, setUser } from "@/redux/slices/userSlice";
import { useGoogleAuthCallbackMutation, useCheckGoogleUserMutation, useCheckGoogleUserWithTokenMutation } from "@/redux/services/userServices";
import toast from "react-hot-toast";
import { apiUrl } from "@/lib/env";

export interface GoogleUserInfo {
  email: string;
  name: string;
  picture: string;
  access_token: string;
  sub?: string;
  given_name?: string;
  family_name?: string;
  verified_email?: boolean;
}

export interface GoogleAuthResponse {
  success: boolean;
  isNewUser: boolean;
  user: any;
  token: string;
  message: string;
}

export const useGoogleAuthIntegration = () => {
  const dispatch = useAppDispatch();
  const [googleAuthCallback] = useGoogleAuthCallbackMutation();
  const [checkGoogleUser] = useCheckGoogleUserMutation();
  const [checkGoogleUserWithToken] = useCheckGoogleUserWithTokenMutation();

  // Method 1: Check auth status after OAuth redirect and get token if available
  const checkAuthAfterRedirect = async (): Promise<GoogleAuthResponse | null> => {
    try {
      console.log('Checking auth status after Google OAuth redirect...');
      
      // Check if user is authenticated and get user data
      const authResponse = await googleAuthCallback({}).unwrap();

      console.log('Google auth status response:', authResponse);

      // If authenticated, we should have received the token from the redirect
      // The backend smart callback would have set the session/token
      if (authResponse.authenticated && authResponse.user) {
        // Create a response-like object for consistency
        const response: GoogleAuthResponse = {
          success: true,
          isNewUser: authResponse.isNewUser || false,
          user: authResponse.user,
          token: authResponse.token || '',
          message: 'Successfully authenticated with Google'
        };

        // Update Redux store with user data and token
        if (response.token) {
          dispatch(setToken(response.token));
        }
        
        dispatch(setUser({
          _id: response.user._id,
          email: response.user.email,
          name: response.user.name,
          phone_number: response.user.phone_number || '',
          bio: response.user.bio || '',
          location: response.user.location || '',
          isGoogleUser: true,
          profile: response.user.avatar || response.user.picture,
          projects: response.user.projects || [],
          cryptoWallet: response.user.cryptoWallet || []
        }));

        if (response.isNewUser) {
          toast.success('Account created successfully! Welcome to BOMOKO FUND.');
        } else {
          toast.success('Welcome back! Signed in successfully.');
        }

        return response;
      }

      return null;
    } catch (error: any) {
      console.error('Google authentication check error:', error);
      
      if (error.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error('Google authentication failed. Please try again.');
      }
      
      return null;
    }
  };

  // Method 2: Check authentication status without token
  const checkAuthStatus = async (): Promise<any> => {
    try {
      const response = await checkGoogleUser({}).unwrap();
      console.log('Auth status check:', response);
      return response;
    } catch (error: any) {
      console.error('Auth status check error:', error);
      return { authenticated: false };
    }
  };

  // Method 3: Check authentication with token
  const checkAuthWithToken = async (): Promise<any> => {
    try {
      const response = await checkGoogleUserWithToken({}).unwrap();
      console.log('Auth check with token:', response);
      return response;
    } catch (error: any) {
      console.error('Auth check with token error:', error);
      return { success: false };
    }
  };

  // Method 4: Redirect to Google OAuth with API format
  const redirectToGoogleAuth = () => {
    console.log('Redirecting to Google OAuth with API format...');
    window.location.href = `${apiUrl}/auth/google?format=api`;
  };

  return {
    checkAuthAfterRedirect,
    checkAuthStatus,
    checkAuthWithToken,
    redirectToGoogleAuth
  };
}; 