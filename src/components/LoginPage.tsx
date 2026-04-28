import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectUser, selectToken, setToken, setUser } from '@/redux/slices/userSlice';
import { useTranslation } from '@/lib/TranslationContext';
import { apiUrl } from '@/lib/env';
import { getLoginJwt } from '@/lib/authResponse';

interface SignedInUser {
  name: string;
  email: string;
  picture: string;
}

/** Decode a Google ID-token (JWT) payload without a library. */
function decodeGoogleJwt(credential: string): Record<string, any> {
  try {
    const payload = credential.split('.')[1];
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    return JSON.parse(atob(padded.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return {};
  }
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const currentUser = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);

  const wasAlreadyLoggedIn = useRef(!!(currentUser?.email || currentUser?.phone_number) && !!token);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [googleBtnWidth, setGoogleBtnWidth] = useState(400);
  const [sidebarView, setSidebarView] = useState<'benefits' | 'funding'>('benefits');
  const [signedInUser, setSignedInUser] = useState<SignedInUser | null>(null);
  const [imgError, setImgError] = useState(false);

  const numberColors = [
    'text-yellow-400',
    'text-green-400',
    'text-blue-400',
    'text-purple-400',
    'text-red-400',
  ];

  React.useEffect(() => {
    if (wasAlreadyLoggedIn.current) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Keep Google button width in sync with its container
  React.useEffect(() => {
    const el = googleBtnRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setGoogleBtnWidth(Math.floor(entry.contentRect.width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setImgError(false);

    // Decode the Google JWT directly — most reliable source for the profile picture
    const googlePayload = decodeGoogleJwt(credentialResponse.credential);

    try {
      const backendResponse = await fetch(`${apiUrl}/auth/exchange-google-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleToken: credentialResponse.credential,
          idToken: credentialResponse.credential,
          credential: credentialResponse.credential,
          token: credentialResponse.credential,
        }),
      });

      if (!backendResponse.ok) {
        const errorText = await backendResponse.text();
        throw new Error(`Authentication failed: ${backendResponse.status} - ${errorText || 'Unknown error'}`);
      }

      const authData = await backendResponse.json();
      console.log('Backend auth response:', authData);

      // Backend may return success with or without an explicit `success: true` field
      const isSuccess = authData.success || authData.user || authData.userId || authData.jwtToken || authData.token;

      if (isSuccess) {
        dispatch(setToken(getLoginJwt(authData) ?? authData.jwtToken ?? authData.token));

        const userId = authData.userId || authData.user?._id || authData.user?.id || authData.user?.sub;

        // Prefer the picture from the decoded JWT — it's always a valid Google URL
        const picture =
          googlePayload.picture ||
          authData.user?.avatar ||
          authData.user?.picture ||
          '';

        dispatch(setUser({
          _id: userId,
          email: authData.user?.email || googlePayload.email || '',
          name: authData.user?.name || googlePayload.name || '',
          phone_number: authData.user?.phone || '',
          bio: authData.user?.bio || '',
          location: authData.user?.location || '',
          isGoogleUser: true,
          profile: picture,
          projects: authData.user?.projects || [],
          cryptoWallet: authData.user?.cryptoWallet || [],
        }));

        setSignedInUser({
          name: authData.user?.name || googlePayload.name || '',
          email: authData.user?.email || googlePayload.email || '',
          picture,
        });

        toast.success(t('Successfully signed in with Google'));
      } else {
        throw new Error(authData.message || 'Authentication failed');
      }
    } catch (error: any) {
      console.error('Google authentication error:', error);
      toast.error(t('Google authentication failed. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error(t('Google sign-in failed. Please try again.'));
  };
  const renderSidebarContent = () => {
    if (sidebarView === 'benefits') {
      return (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">{t('Benefits of using BOMOKO FUND')}</h3>
            <p className="text-sm text-gray-300">{t('for creating your business plan.')}</p>
          </div>
          <div className="space-y-6">
            {[
              { num: '01', title: t('AI-powered business planning'), desc: t('Create a professional quality business plan in no time, just answer our multiple-choice questions and let BOMOKO FUND do the rest.') },
              { num: '02', title: t('Access to funding opportunities'), desc: t('Connect with investors and funding opportunities specifically designed for African entrepreneurs and high-potential projects.') },
              { num: '03', title: t('Community of entrepreneurs'), desc: t('Join a thriving ecosystem of visionary business owners, impact-driven investors, and supporters across Africa.') },
              { num: '04', title: t('Expert guidance and mentorship'), desc: t('Get guidance from experienced entrepreneurs and business experts who understand the African market landscape.') },
              { num: '05', title: t('Comprehensive business tools'), desc: t('Focus on high-potential projects that address critical social and economic needs across African communities.') },
            ].map((item, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className={`text-4xl font-bold ${numberColors[i]} opacity-90`}>{item.num}</div>
                <div>
                  <h4 className="font-semibold mb-1 text-white">{item.title}</h4>
                  <p className="text-sm text-gray-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }

    return (
      <>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-white">{t('How funding works on BOMOKO FUND')}</h3>
          <p className="text-sm text-gray-300">{t('Step-by-step guide to get funded.')}</p>
        </div>
        <div className="space-y-6">
          {[
            { num: '01', title: t('Create Your Business Plan'), desc: t('Build a comprehensive business plan using our AI-powered tools and templates specifically designed for African entrepreneurs.') },
            { num: '02', title: t('Submit for Review'), desc: t('Our expert team reviews your business plan to ensure it meets funding requirements and provides feedback for improvement.') },
            { num: '03', title: t('Get Matched with Investors'), desc: t('Connect with impact-driven investors who are specifically interested in funding high-potential African ventures and projects.') },
            { num: '04', title: t('Receive Funding'), desc: t('Once matched, receive funding through our secure platform and start building your business with ongoing support and mentorship.') },
            { num: '05', title: t('Launch & Scale'), desc: t('Launch your business with confidence and access our network of resources, mentors, and partners to scale your impact across Africa.') },
          ].map((item, i) => (
            <div key={i} className="flex items-start space-x-4">
              <div className={`text-4xl font-bold ${numberColors[i]} opacity-90`}>{item.num}</div>
              <div>
                <h4 className="font-semibold mb-1 text-white">{item.title}</h4>
                <p className="text-sm text-gray-300">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="hidden lg:flex w-1/3 bg-gradient-to-b from-[#02093d] to-[#0a1854] text-white p-8 flex-col relative overflow-hidden">
        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <div className="mb-10">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded text-[#02093d] flex items-center justify-center font-bold text-sm">
                B
              </div>
              <span className="text-2xl font-bold text-white">BOMOKO FUND</span>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2 mb-6">
            <button
              onClick={() => setSidebarView('funding')}
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                sidebarView === 'funding' ? 'bg-white text-[#02093d]' : 'bg-white/10 text-gray-200 hover:bg-white/20'
              }`}
            >
              {t('Funding')}
            </button>
            <button
              onClick={() => setSidebarView('benefits')}
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                sidebarView === 'benefits' ? 'bg-white text-[#02093d]' : 'bg-white/10 text-gray-200 hover:bg-white/20'
              }`}
            >
              {t('Benefits')}
            </button>
          </div>

          <div className="space-y-8 overflow-y-auto flex-1 pr-2">
            {renderSidebarContent()}
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center bg-white p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-[#02093d] rounded text-white flex items-center justify-center font-bold text-sm">
              B
            </div>
            <span className="text-xl font-bold text-[#02093d]">BOMOKO FUND</span>
          </div>

          <AnimatePresence mode="wait">
            {signedInUser ? (
              /* ── Signed-in account card ── */
              <motion.div
                key="signed-in"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
              >
                {/* Success badge */}
                <div className="flex items-center space-x-2 mb-6">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-green-600">
                    {t('Successfully signed in with Google')}
                  </span>
                </div>

                {/* Account card */}
                <div className="bg-gradient-to-r from-[#02093d] to-[#0a1854] rounded-2xl p-6 mb-6 text-white">
                  <div className="flex items-center space-x-4">
                    {/* Profile picture */}
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0 bg-white/20">
                      {signedInUser.picture && !imgError ? (
                        <img
                          src={signedInUser.picture}
                          alt={signedInUser.name}
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover"
                          onError={() => setImgError(true)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white">
                          {signedInUser.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>

                    {/* User info */}
                    <div className="flex-1 min-w-0">
                      <span className="text-xs bg-white/15 px-2 py-0.5 rounded-full inline-block mb-1.5">
                        {t('Google Account')}
                      </span>
                      <p className="text-base font-semibold leading-tight">{signedInUser.name}</p>
                      <p className="text-sm text-white/70 truncate mt-0.5">{signedInUser.email}</p>
                    </div>
                  </div>
                </div>

                {/* Go to dashboard button */}
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full flex items-center justify-center space-x-2 bg-[#0a78c2] hover:bg-[#0860a8] text-white font-semibold py-3.5 px-6 rounded-xl transition-colors"
                >
                  <span>{t('Go to Dashboard')}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Use a different account */}
                <div className="mt-4 text-center">
                  <button
                    onClick={() => { setSignedInUser(null); setImgError(false); }}
                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {t('Use a different account')}
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ── Sign-in form ── */
              <motion.div
                key="sign-in"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Badge */}
                <div className="mb-6">
                  <span className="inline-block px-4 py-1.5 bg-yellow-400 text-[#02093d] rounded-full text-xs font-semibold uppercase tracking-wide">
                    {t('FREE TRIAL')}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-[#02093d] mb-2 leading-tight">
                  {t('Welcome to')}{' '}
                  <span className="text-[#0a78c2]">BOMOKO FUND</span>
                </h1>
                <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                  {t('Sign in to access your dashboard, manage your business plans, and connect with investors.')}
                </p>

                {/* Divider */}
                <div className="relative flex items-center mb-8">
                  <div className="flex-grow border-t border-gray-200" />
                  <span className="mx-4 text-sm text-gray-400">{t('Continue with')}</span>
                  <div className="flex-grow border-t border-gray-200" />
                </div>

                {/* Google Sign-in */}
                <div ref={googleBtnRef} className="flex justify-center">
                  {isLoading ? (
                    <div className="flex items-center space-x-3 px-6 py-3 border border-gray-200 rounded-lg w-full justify-center">
                      <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span className="text-gray-600 text-sm">{t('Signing in...')}</span>
                    </div>
                  ) : (
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      size="large"
                      width={googleBtnWidth}
                      text="signin_with"
                      useOneTap={false}
                    />
                  )}
                </div>

                {/* Footer note */}
                <p className="mt-8 text-center text-xs text-gray-400">
                  {t('By signing in, you agree to our')}{' '}
                  <button
                    onClick={() => navigate('/privacy-policy')}
                    className="text-[#0a78c2] hover:underline"
                  >
                    {t('Privacy Policy')}
                  </button>
                  .
                </p>

                {/* Back to home */}
                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate('/')}
                    className="text-sm text-gray-500 hover:text-[#02093d] transition-colors"
                  >
                    ← {t('Back to home')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
