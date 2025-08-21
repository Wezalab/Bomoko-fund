import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectUser, setUser, setToken, initialState } from '@/redux/slices/userSlice';
import { ProjectInitialState, setProject } from '@/redux/slices/projectSlice';
import { useTranslation } from '@/lib/TranslationContext';
import { useGetUserVenturesQuery } from '@/redux/services/ventureServices';
import { 
  Home, 
  Edit, 
  Eye, 
  DollarSign, 
  Users, 
  Settings, 
  User,
  ArrowUpRight,
  Trash2,
  Plus,
  Building,
  FileText,
  Youtube,
  Facebook,
  Linkedin,
  Instagram,
  Lock,
  ChevronDown,
  LogOut
} from 'lucide-react';
import profileImage from '../assets/profileImage.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from './ui/button';

interface ExtendedUser {
  _id: string;
  name?: string;
  gender?: "M" | "F" | "OTHER";
  avatar?: string;
  bio?: string;
  location?: string;
  email: string;
  phone_number?: string;
  phone?: string;
  type?: "INDIVIDUAL" | "ENTREPRISE" | "DONATOR" | "ENTREPRENEUR";
  isGoogleUser?: boolean;
  isStillRegistering?: boolean;
  isDeactivated?: boolean;
  deactivateReason?: string;
  googleId?: string | null;
  updatedAt?: string;
  profile?: string;
  projects?: any[];
  cryptoWallet?: any[];
}

// Using Venture interface from API instead of local BusinessData
// interface BusinessData extends Venture {}

interface PlanData {
  id: string;
  name: string;
  businessId: string;
  createdAt: string;
  type: string;
  status: 'setup' | 'not_setup' | 'completed';
  description: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser) as unknown as ExtendedUser;
  const { t } = useTranslation();

  // Function to check if a menu item is active
  const isActiveRoute = (path: string) => {
    // Handle exact matches first
    if (location.pathname === path) return true;
    
    // Handle special cases for nested routes
    if (path === '/business-plan' && location.pathname.startsWith('/business-plan/')) {
      // Don't highlight "View Plan" when on wizard or other nested routes
      return false;
    }
    
    if (path === '/business-plan/wizard' && location.pathname === '/business-plan/wizard') {
      return true;
    }
    
    return false;
  };

  // Fetch user ventures from API
  const { 
    data: venturesResponse, 
    isLoading: isLoadingVentures, 
    error: venturesError 
  } = useGetUserVenturesQuery({ 
    userId: user?._id || '', 
    page: 1, 
    limit: 50 
  }, {
    skip: !user?._id // Skip the query if user ID is not available
  });

  // Safely extract ventures array from response
  const ventures = Array.isArray(venturesResponse) ? venturesResponse : 
                   (venturesResponse && typeof venturesResponse === 'object' && 'data' in venturesResponse && Array.isArray((venturesResponse as any).data)) ? (venturesResponse as any).data : 
                   [];

  // Debug logging to understand API response structure
  useEffect(() => {
    console.log("[DEBUG] User ID:", user?._id);
    console.log("[DEBUG] Ventures API Response:", venturesResponse);
    console.log("[DEBUG] Extracted ventures array:", ventures);
    console.log("[DEBUG] Is loading:", isLoadingVentures);
    console.log("[DEBUG] Error:", venturesError);
  }, [user?._id, venturesResponse, ventures, isLoadingVentures, venturesError]);

  // Use real ventures data from API
  const displayVentures = ventures;

  // Mock plans array - in real app, this would come from Redux store or API
  const [plans, setPlans] = useState<PlanData[]>([
    
  ]);

  // Selected items
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('1');

  // Set initial selected business when ventures load
  useEffect(() => {
    if (Array.isArray(displayVentures) && displayVentures.length > 0 && !selectedBusinessId) {
      setSelectedBusinessId(displayVentures[0]._id);
    }
  }, [displayVentures, selectedBusinessId]);

  // Get selected business and plan
  const selectedBusiness = (Array.isArray(displayVentures) && displayVentures.find) ? 
                          displayVentures.find(v => v._id === selectedBusinessId) || null : 
                          null;
  // const selectedPlan = plans.find(p => p.id === selectedPlanId) || null;

  // Function to handle Google profile image URLs
  const getOptimizedImageUrl = (url: string) => {
    if (!url) return profileImage;
    
    // If it's a Google profile image, ensure it's high quality and accessible
    if (url.includes('googleusercontent.com')) {
      // Remove size restrictions and ensure we get a good quality image
      return url.replace(/=s\d+-c/, '=s200-c').replace(/\/photo\.jpg$/, '');
    }
    
    return url;
  };

  // Use user's profile picture from Redux if available, otherwise use default profile image
  // Priority: user.profile (Google profile picture) > user.avatar (uploaded avatar) > default profileImage
  let userAvatar = profileImage;
  
  if (user?.profile) {
    userAvatar = getOptimizedImageUrl(user.profile);
  } else if (user?.avatar) {
    userAvatar = getOptimizedImageUrl(user.avatar);
  }

  // Function to handle image load errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log("[DEBUG] Avatar image failed to load, using fallback");
    console.log("[DEBUG] Failed image src:", e.currentTarget.src);
    e.currentTarget.src = profileImage;
  };

  const handleLogout = () => {
    navigate('/');
    dispatch(setUser(initialState.user));
    dispatch(setToken(initialState.token));
    dispatch(setProject(ProjectInitialState.project));
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleDeleteBusiness = (businessId: string) => {
    if (window.confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      // TODO: Implement actual delete API call
      console.log('Delete venture:', businessId);
      // For now, just deselect if it was selected
      if (selectedBusinessId === businessId && Array.isArray(displayVentures)) {
        const remainingVentures = displayVentures.filter(v => v._id !== businessId);
        setSelectedBusinessId(remainingVentures.length > 0 ? remainingVentures[0]._id : '');
      }
    }
  };

  const handleDeletePlan = (planId: string) => {
    if (window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      setPlans(plans.filter(p => p.id !== planId));
      // If deleted plan was selected, select first remaining plan or none
      if (selectedPlanId === planId) {
        const remainingPlans = plans.filter(p => p.id !== planId);
        setSelectedPlanId(remainingPlans.length > 0 ? remainingPlans[0].id : '');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const EmptyBusinessState = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Building className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('noBusinessCreated')}</h3>
      <p className="text-gray-600 mb-6">{t('createBusinessMessage')}</p>
      <button
        onClick={() => handleNavigation('/venture-wizard')}
        className="bg-lightBlue hover:bg-lightBlue/90 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
      >
        <Plus className="w-5 h-5" />
        <span>{t('createNewBusiness')}</span>
      </button>
    </div>
  );

  const EmptyPlanState = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('noPlansCreated')}</h3>
      <p className="text-gray-600 mb-6">{t('createPlanMessage')}</p>
      <button
        // onClick={() => handleNavigation('/business-plan-editor')}
        onClick={() => handleNavigation('/business-plan/wizard')}
        className="bg-lightBlue hover:bg-lightBlue/90 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
      >
        <Plus className="w-5 h-5" />
        <span>{t('createNewPlan')}</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-16 bg-teal-700 text-white flex flex-col items-center py-4">
        {/* Logo Section */}
        <div className="mb-8">
          <div 
            className="w-10 h-10 bg-white rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleNavigation('/dashboard')}
          >
            <Building className="w-6 h-6 text-teal-700" />
          </div>
        </div>

        {/* Navigation Icons */}
        <nav className="flex flex-col space-y-4 flex-1">
          <button
            onClick={() => handleNavigation('/dashboard')}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative group ${
              isActiveRoute('/dashboard') 
                ? 'bg-teal-600 text-white' 
                : 'hover:bg-teal-600 text-white/80 hover:text-white'
            }`}
            title={t('home')}
          >
            <Home className="w-5 h-5" />
            <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {t('home')}
            </div>
          </button>
          
          <button
            onClick={() => handleNavigation('/business-plan/wizard')}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative group ${
              isActiveRoute('/business-plan/wizard') 
                ? 'bg-teal-600 text-white' 
                : 'hover:bg-teal-600 text-white/80 hover:text-white'
            }`}
            title={t('addPlan')}
          >
            <FileText className="w-5 h-5" />
            <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {t('addPlan')}
            </div>
          </button>
          
          <button
            onClick={() => handleNavigation('/business-plan-editor')}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative group ${
              isActiveRoute('/business-plan-editor') 
                ? 'bg-teal-600 text-white' 
                : 'hover:bg-teal-600 text-white/80 hover:text-white'
            }`}
            title={t('editPlan')}
          >
            <Edit className="w-5 h-5" />
            <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {t('editPlan')}
            </div>
          </button>
          
          <button
            // onClick={() => handleNavigation('/business-plan')}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative group ${
              isActiveRoute('/business-plan') 
                ? 'bg-teal-600 text-white' 
                : 'hover:bg-teal-600 text-white/80 hover:text-white'
            }`}
            title={t('viewPlan')}
          >
            <Eye className="w-5 h-5" />
            <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {t('viewPlan')}
            </div>
          </button>
          
          <button
            onClick={() => handleNavigation('/financials')}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative group ${
              isActiveRoute('/financials') 
                ? 'bg-teal-600 text-white' 
                : 'hover:bg-teal-600 text-white/80 hover:text-white'
            }`}
            title={t('financials')}
          >
            <DollarSign className="w-5 h-5" />
            <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {t('financials')}
            </div>
          </button>
          
          <button
            onClick={() => handleNavigation('/users')}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative group ${
              isActiveRoute('/users') 
                ? 'bg-teal-600 text-white' 
                : 'hover:bg-teal-600 text-white/80 hover:text-white'
            }`}
            title={t('users')}
          >
            <Users className="w-5 h-5" />
            <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {t('users')}
            </div>
          </button>
          
          <button
            onClick={() => handleNavigation('/settings')}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative group ${
              isActiveRoute('/settings') 
                ? 'bg-teal-600 text-white' 
                : 'hover:bg-teal-600 text-white/80 hover:text-white'
            }`}
            title={t('settings')}
          >
            <Settings className="w-5 h-5" />
            <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {t('settings')}
            </div>
          </button>
        </nav>

        {/* Bottom Upgrade Icon */}
        <div className="mt-auto">
          <div 
            className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-yellow-500 transition-colors group"
            onClick={() => handleNavigation('/upgrade')}
            title={t('upgrade')}
          >
            <Lock className="w-5 h-5 text-gray-800" />
            <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {t('upgrade')}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                  {t('home')}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-dark">
                {t('Welcome')} {user?.name || user?.email?.split('@')[0] || 'User'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* User Profile Dropdown */}
              {user?.email && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className='flex items-center bg-[#ECEFF3] py-[8px] rounded-full h-[50px] hover:bg-lightBlue space-x-2'
                    >
                      <img 
                        src={userAvatar}
                        className='w-[39px] h-[39px] rounded-full object-cover'
                        alt='profile-image'
                        onError={handleImageError}
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {user?.name || user?.email?.split('@')[0]}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='p-3 w-64'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <img 
                        src={userAvatar}
                        className='w-[40px] h-[40px] rounded-full object-cover'
                        alt='profile-image'
                        onError={handleImageError}
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                      />
                      <div className='flex flex-col'>
                        <span className='text-gray-900 font-semibold text-sm'>
                          {user?.name || user?.email?.split('@')[0]}
                        </span>
                        <span className='text-gray-500 text-sm'>{user?.email}</span>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem className='p-3 cursor-pointer'>
                        <div onClick={() => handleNavigation('/profile')} className='flex items-center space-x-2'>
                          <User className="w-4 h-4" />
                          <span className='text-sm'>{t('profile')}</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='p-3 cursor-pointer'>
                        <div onClick={() => handleNavigation('/projects')} className='flex items-center space-x-2'>
                          <Building className="w-4 h-4" />
                          <span className='text-sm'>{t('projects')}</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='p-3 cursor-pointer'>
                        <div onClick={() => handleNavigation('/settings')} className='flex items-center space-x-2'>
                          <Settings className="w-4 h-4" />
                          <span className='text-sm'>{t('settings')}</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className='p-3 cursor-pointer'>
                        <div onClick={handleLogout} className='flex items-center space-x-2'>
                          <LogOut className="w-4 h-4 text-red-600" />
                          <span className='text-sm text-red-600'>{t('logout')}</span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Top Section - Business and Plan Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ventures Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-dark">{t('myVentures')} ({Array.isArray(displayVentures) ? displayVentures.length : 0})</h2>
                <button
                  onClick={() => handleNavigation('/venture-wizard')}
                  className="bg-lightBlue hover:bg-lightBlue/90 text-white p-2 rounded-lg transition-colors"
                  title={t('createNewBusiness')}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              {!user?._id ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('userNotFound') || 'User not found'}</h3>
                  <p className="text-gray-600 mb-6">{t('pleaseSignIn') || 'Please sign in to view your ventures'}</p>
                </div>
              ) : isLoadingVentures ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lightBlue mx-auto mb-4"></div>
                  <p className="text-gray-600">{t('loading') || 'Loading ventures...'}</p>
                </div>
              ) : venturesError ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('errorLoadingVentures') || 'Error loading ventures'}</h3>
                  <p className="text-gray-600 mb-6">{t('tryAgainLater') || 'Please try again later'}</p>
                </div>
              ) : Array.isArray(displayVentures) && displayVentures.length > 0 ? (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {displayVentures.map((venture) => (
                    <div 
                      key={venture._id} 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedBusinessId === venture._id 
                          ? 'border-lightBlue bg-lightBlue/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedBusinessId(venture._id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-dark mb-1">{venture.businessName}</h3>
                          <p className="text-gray-600 text-sm mb-2">{venture.businessDescription}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                            <span>{t('createdAt')} {formatDate(venture.createdAt)}</span>
                            <span>{venture.country}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {venture.businessTypes.slice(0, 2).map((type: string, index: number) => (
                              <span key={index} className="bg-lightBlue/10 text-lightBlue px-2 py-1 rounded-full text-xs">
                                {type}
                              </span>
                            ))}
                            {venture.businessTypes.length > 2 && (
                              <span className="text-xs text-gray-500">+{venture.businessTypes.length - 2} {t('more')}</span>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            venture.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : venture.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-800'
                              : venture.status === 'published'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {venture.status === 'completed' ? t('completed') : 
                             venture.status === 'in-progress' ? t('inProgress') : 
                             venture.status === 'published' ? t('published') || 'Published' :
                             t('draft') || 'Draft'}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBusiness(venture._id);
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                          title={t('deleteBusiness')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyBusinessState />
              )}
            </div>

            {/* Plans Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-dark">{t('myBusinessPlans')} ({plans.length})</h2>
                <button
                  onClick={() => handleNavigation('/business-plan/wizard')}
                  className="bg-lightBlue hover:bg-lightBlue/90 text-white p-2 rounded-lg transition-colors"
                  title={t('createNewPlan')}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              {plans.length > 0 ? (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {plans.map((plan) => (
                    <div 
                      key={plan.id} 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedPlanId === plan.id 
                          ? 'border-lightBlue bg-lightBlue/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPlanId(plan.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-dark mb-1">{plan.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{plan.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                            <span>{t('createdAt')} {formatDate(plan.createdAt)}</span>
                            <span>{t('type')} {plan.type}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            plan.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : plan.status === 'setup'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {plan.status === 'completed' ? t('completed') : 
                             plan.status === 'setup' ? t('inProgress') : t('notStarted')}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePlan(plan.id);
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                          title={t('deletePlan')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyPlanState />
              )}
            </div>
          </div>

          {/* Action Cards - Only show if business exists */}
          {selectedBusiness && (
            <>
              {/* Action Cards - First Row */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Business Settings */}
                <div 
                  className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleNavigation('/business-settings')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-dark">{t('businessSettings')}</h3>
                    <ArrowUpRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-sm">
                    {t('modifyBusinessDetails')}
                  </p>
                </div>

                {/* User Access */}
                <div 
                  className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleNavigation('/user-access')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-dark">{t('userAccess')}</h3>
                    <ArrowUpRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {t('manageUserAccess')}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      {t('noCollaborators')}
                    </span>
                  </div>
                </div>

                {/* Plan Editor */}
                <div
                  className="bg-lightBlue text-white rounded-lg p-6 hover:bg-lightBlue/90 transition-colors cursor-pointer"
                  onClick={() => handleNavigation('/business-plan-editor')}
                  // onClick={() => handleNavigation('/business-plan/wizard')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">{t('planEditor')}</h3>
                    <ArrowUpRight className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-gray-100 text-sm">
                    {t('continueWorkingOnPlan')}
                  </p>
                </div>

                {/* Plan Viewer */}
                <div
                  className="bg-lightBlue text-white rounded-lg p-6 hover:bg-lightBlue/90 transition-colors cursor-pointer"
                  onClick={() => handleNavigation('/business-plan')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">{t('planViewer')}</h3>
                    <ArrowUpRight className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-gray-100 text-sm">
                    {t('viewOrDownloadPlan')}
                  </p>
                </div>
              </div>

              {/* Action Cards - Second Row */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Account Settings */}
                <div 
                  className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleNavigation('/account-settings')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-dark">{t('accountSettings')}</h3>
                    <ArrowUpRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-sm">
                    {t('manageUserProfileAccountBilling')}
                  </p>
                </div>

                {/* Frequent Questions */}
                <div 
                  className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer border-lightBlue"
                  onClick={() => handleNavigation('/faq')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-dark">{t('frequentQuestions')}</h3>
                    <ArrowUpRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-sm">
                    {t('findAnswersTutorialVideos')}
                  </p>
                </div>

                {/* Request Support */}
                <div 
                  className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleNavigation('/support')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-dark">{t('requestSupport')}</h3>
                    <ArrowUpRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-sm">
                    {t('getInTouchSupportTeam')}
                  </p>
                </div>

                {/* Partner Program */}
                <div 
                  className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer opacity-60"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-dark">{t('partnerProgram')}</h3>
                    <ArrowUpRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-sm">
                    {t('earnRewardsReferNewCustomers')}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Quote Section */}
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-dark mb-4">
              {t('quoteMessage')}
            </h2>
            <p className="text-yellow-600 font-medium">
              {t('quoteAuthor')}
            </p>
          </div>

          {/* Footer */}
          <div className="border-t pt-8 pb-4">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 font-medium">{t('findUsOnSocialMedia')}</span>
                <div className="flex space-x-3">
                  <button className="text-gray-600 hover:text-red-600">
                    <Youtube className="w-5 h-5" />
                  </button>
                  <button className="text-gray-600 hover:text-blue-600">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button className="text-gray-600 hover:text-blue-700">
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button className="text-gray-600 hover:text-pink-600">
                    <Instagram className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-dark rounded text-white flex items-center justify-center font-bold">
                    B
                  </div>
                  <span className="text-xl font-bold text-dark">BOMOKO FUND</span>
                </div>
                <div className="text-right">
                  <p className="text-dark font-bold">{t('beUnstoppable')}</p>
                  <p className="text-gray-600 text-sm">{t('aiDrivenPlanning')}</p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-6 text-gray-600 text-sm">
              <p>{t('freeTrialMessage')}</p>
              <p>{t('craftingStrategies')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 