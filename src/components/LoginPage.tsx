import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectUser, selectToken, setToken, setUser } from '@/redux/slices/userSlice';
import { useTranslation } from '@/lib/TranslationContext';
import { apiUrl } from '@/lib/env';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const currentUser = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const isLoggedIn = !!(currentUser?.email || currentUser?.phone_number) && !!token;

  const [isLoading, setIsLoading] = useState(false);
  const [sidebarView, setSidebarView] = useState<'benefits' | 'funding'>('benefits');

  const numberColors = [
    'text-yellow-400',
    'text-green-400',
    'text-blue-400',
    'text-purple-400',
    'text-red-400',
  ];

  React.useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const backendResponse = await fetch(`${apiUrl}/auth/exchange-google-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleToken: credentialResponse.credential }),
      });

      if (!backendResponse.ok) {
        const errorText = await backendResponse.text();
        throw new Error(`Authentication failed: ${backendResponse.status} - ${errorText || 'Unknown error'}`);
      }

      const authData = await backendResponse.json();

      if (authData.success) {
        dispatch(setToken(authData.jwtToken || authData.token));

        const userId = authData.userId || authData.user._id || authData.user.id || authData.user.sub;

        dispatch(setUser({
          _id: userId,
          email: authData.user.email,
          name: authData.user.name,
          phone_number: authData.user.phone || '',
          bio: authData.user.bio || '',
          location: authData.user.location || '',
          isGoogleUser: true,
          profile: authData.user.avatar || authData.user.picture,
          projects: authData.user.projects || [],
          cryptoWallet: authData.user.cryptoWallet || [],
        }));

        toast.success(authData.message || t('Successfully signed in with Google!'));
        navigate('/dashboard');
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

          <motion.div
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
            <div className="flex justify-center">
              {isLoading ? (
                <div className="flex items-center space-x-3 px-6 py-3 border border-gray-200 rounded-lg w-full justify-center">
                  <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-gray-600 text-sm">{t('Signing in...')}</span>
                </div>
              ) : (
                <div className="w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    size="large"
                    width="100%"
                    text="signin_with"
                    useOneTap={false}
                  />
                </div>
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
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
