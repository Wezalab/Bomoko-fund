import { useAppDispatch } from "@/redux/hooks";
import { setToken, setUser } from "@/redux/slices/userSlice";
import { useGoogleAuthMutation, useCheckGoogleUserMutation } from "@/redux/services/userServices";
import toast from "react-hot-toast";

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
  const [googleAuth] = useGoogleAuthMutation();
  const [checkGoogleUser] = useCheckGoogleUserMutation();

  const authenticateWithGoogle = async (googleUserInfo: GoogleUserInfo): Promise<GoogleAuthResponse | null> => {
    try {
      console.log('Starting Google authentication process...');
      
      // First, check if user exists
      const checkResponse = await checkGoogleUser({
        email: googleUserInfo.email,
        googleId: googleUserInfo.sub
      }).unwrap();

      console.log('User check response:', checkResponse);

      let authResponse: GoogleAuthResponse;

      if (checkResponse.userExists) {
        // User exists, sign them in
        console.log('User exists, signing in...');
        authResponse = await googleAuth({
          email: googleUserInfo.email,
          name: googleUserInfo.name,
          picture: googleUserInfo.picture,
          googleId: googleUserInfo.sub,
          access_token: googleUserInfo.access_token,
          action: 'signin'
        }).unwrap();
        
        toast.success('Welcome back! Signed in successfully.');
      } else {
        // User doesn't exist, create new account
        console.log('User does not exist, creating new account...');
        authResponse = await googleAuth({
          email: googleUserInfo.email,
          name: googleUserInfo.name,
          picture: googleUserInfo.picture,
          googleId: googleUserInfo.sub,
          access_token: googleUserInfo.access_token,
          action: 'signup'
        }).unwrap();
        
        toast.success('Account created successfully! Welcome to BOMOKO FUND.');
      }

      // Update Redux store with user data and token
      if (authResponse.success) {
        dispatch(setToken(authResponse.token));
        dispatch(setUser({
          _id: authResponse.user._id,
          email: authResponse.user.email,
          name: authResponse.user.name,
          phone_number: authResponse.user.phone_number || '',
          bio: authResponse.user.bio || '',
          location: authResponse.user.location || '',
          isGoogleUser: true,
          profile: authResponse.user.avatar || authResponse.user.picture,
          projects: authResponse.user.projects || [],
          cryptoWallet: authResponse.user.cryptoWallet || []
        }));
      }

      return authResponse;
    } catch (error: any) {
      console.error('Google authentication error:', error);
      
      if (error.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error('Google authentication failed. Please try again.');
      }
      
      return null;
    }
  };

  return {
    authenticateWithGoogle
  };
}; 