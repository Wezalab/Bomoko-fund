import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectUser, setUser, setToken, initialState } from '@/redux/slices/userSlice';
import { ProjectInitialState, setProject } from '@/redux/slices/projectSlice';
import { useTranslation } from '@/lib/TranslationContext';
import { 
  ChevronLeft,
  ChevronDown,
  CheckCircle,
  Circle,
  Lock,
  Home,
  Users,
  Settings,
  User,
  Building,
  LogOut,
  FileText,
  DollarSign,
  Youtube,
  Facebook,
  Linkedin,
  Instagram,
  Edit,
  Eye
} from 'lucide-react';
import profileImage from '../../assets/profileImage.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

interface BusinessPlanItem {
  id: string;
  title: string;
  completed: boolean;
  time?: string;
  step?: number;
}

interface BusinessPlanSection {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  locked: boolean;
  color: string;
  bgColor: string;
  borderColor: string;
  items: BusinessPlanItem[];
}

const BusinessPlanOverviewNew: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser) as ExtendedUser;
  const { t } = useTranslation();

  // Mock state for business plan progress - in real app this would come from API/Redux
  const [initialSetupCompleted] = useState(false);
  const [sections] = useState<BusinessPlanSection[]>([
    {
      id: 'business-description',
      title: 'Business Description',
      description: 'Define your business concept, products, and services',
      completed: false,
      locked: !initialSetupCompleted,
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-100',
      items: [
        { id: 'overview', title: 'Overview', completed: false, time: '5 Min', step: 1 },
        { id: 'problem-solution', title: 'Problem & Solution', completed: false, time: '5 Min', step: 2 },
        { id: 'mission-vision-values', title: 'Mission, Vision & Values', completed: false, time: '5 Min', step: 3 },
        { id: 'intellectual-property', title: 'Intellectual Property', completed: false, time: '5 Min', step: 4 },
        { id: 'achievements', title: 'Achievements', completed: false, time: '5 Min', step: 5 },
        { id: 'structure-ownership', title: 'Structure & Ownership', completed: false, time: '3 Min', step: 6 }
      ]
    },
    {
      id: 'situation-analysis',
      title: 'Situation Analysis',
      description: 'Analyze market conditions and competitive landscape',
      completed: false,
      locked: !initialSetupCompleted,
      color: 'teal',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-100',
      items: [
        { id: 'market-products', title: 'Market & Products', completed: false, time: '5 Min', step: 7 },
        { id: 'market-segments', title: 'Market Segments', completed: false, time: '5 Min', step: 8 },
        { id: 'buyer-personas', title: 'Buyer Personas', completed: false, time: '5 Min', step: 9 },
        { id: 'competitors', title: 'Competitors', completed: false, time: '5 Min', step: 10 },
        { id: 'swot', title: 'SWOT', completed: false, time: '5 Min', step: 11 }
      ]
    },
    {
      id: 'objectives',
      title: 'Objectives',
      description: 'Set clear business goals and targets',
      completed: false,
      locked: !initialSetupCompleted,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      items: [
        { id: 'corporate-objectives', title: 'Corporate Objectives', completed: false, time: '5 Min', step: 12 }
      ]
    },
    {
      id: 'business-strategy',
      title: 'Business Strategy',
      description: 'Define strategic approach and execution plan',
      completed: false,
      locked: !initialSetupCompleted,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-100',
      items: [
        { id: 'strategy-1', title: 'Strategy Item 1', completed: false, time: '5 Min', step: 13 },
        { id: 'strategy-2', title: 'Strategy Item 2', completed: false, time: '5 Min', step: 14 },
        { id: 'strategy-3', title: 'Strategy Item 3', completed: false, time: '5 Min', step: 15 },
        { id: 'strategy-4', title: 'Strategy Item 4', completed: false, time: '5 Min', step: 16 },
        { id: 'strategy-5', title: 'Strategy Item 5', completed: false, time: '5 Min', step: 17 },
        { id: 'strategy-6', title: 'Strategy Item 6', completed: false, time: '5 Min', step: 18 }
      ]
    },
    {
      id: 'funding',
      title: 'Funding',
      description: 'Financial requirements and funding strategy',
      completed: false,
      locked: !initialSetupCompleted,
      color: 'pink',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-100',
      items: [
        { id: 'funding-1', title: 'Funding Item 1', completed: false, time: '5 Min', step: 19 },
        { id: 'funding-2', title: 'Funding Item 2', completed: false, time: '5 Min', step: 20 }
      ]
    },
    {
      id: 'financial-projections',
      title: 'Financial Projections',
      description: 'Revenue, costs, and financial forecasts',
      completed: false,
      locked: !initialSetupCompleted,
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-100',
      items: [
        { id: 'financial-1', title: 'Financial Item 1', completed: false, time: '5 Min', step: 21 },
        { id: 'financial-2', title: 'Financial Item 2', completed: false, time: '5 Min', step: 22 },
        { id: 'financial-3', title: 'Financial Item 3', completed: false, time: '5 Min', step: 23 },
        { id: 'financial-4', title: 'Financial Item 4', completed: false, time: '5 Min', step: 24 },
        { id: 'financial-5', title: 'Financial Item 5', completed: false, time: '5 Min', step: 25 },
        { id: 'financial-6', title: 'Financial Item 6', completed: false, time: '5 Min', step: 26 },
        { id: 'financial-7', title: 'Financial Item 7', completed: false, time: '5 Min', step: 27 }
      ]
    },
    {
      id: 'executive-summary',
      title: 'Executive Summary',
      description: 'High-level overview and key highlights',
      completed: false,
      locked: !initialSetupCompleted,
      color: 'gray',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-100',
      items: [
        { id: 'executive-summary-1', title: 'Executive Summary', completed: false, time: '5 Min', step: 28 }
      ]
    }
  ]);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/');
    dispatch(setUser(initialState.user));
    dispatch(setToken(initialState.token));
    dispatch(setProject(ProjectInitialState.project));
  };

  const handleSectionClick = (section: BusinessPlanSection) => {
    if (!section.locked) {
      // Navigate to section
      console.log('Navigate to:', section.id);
    }
  };

  const handleInitialSetup = () => {
    navigate('/business-plan/initial-setup');
  };

  // Function to handle Google profile image URLs
  const getOptimizedImageUrl = (url: string) => {
    if (!url) return profileImage;
    
    if (url.includes('googleusercontent.com')) {
      return url.replace(/=s\d+-c/, '=s200-c').replace(/\/photo\.jpg$/, '');
    }
    
    return url;
  };

  // Use user's profile picture from Redux if available
  let userAvatar = profileImage;
  
  if (user?.profile) {
    userAvatar = getOptimizedImageUrl(user.profile);
  } else if (user?.avatar) {
    userAvatar = getOptimizedImageUrl(user.avatar);
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = profileImage;
  };

  // Function to get unique gradient for each item
  const getItemGradient = (sectionIndex: number, itemIndex: number) => {
    const gradients = [
      // Green variations
      'linear-gradient(90deg, #b8e6d6 0%, #c1e6d3 25%, #cae6d0 50%, #d3e6cd 75%, #dce6ca 100%)',
      'linear-gradient(90deg, #a7f3d0 0%, #bbf7d0 25%, #c6f6d5 50%, #d1fae5 75%, #dcfce7 100%)',
      'linear-gradient(90deg, #86efac 0%, #a3e635 25%, #bef264 50%, #d9f99d 75%, #ecfccb 100%)',
      
      // Teal variations  
      'linear-gradient(90deg, #99f6e4 0%, #a7f3d0 25%, #bbf7d0 50%, #c6f6d5 75%, #d1fae5 100%)',
      'linear-gradient(90deg, #7dd3fc 0%, #93c5fd 25%, #bfdbfe 50%, #dbeafe 75%, #eff6ff 100%)',
      
      // Blue variations
      'linear-gradient(90deg, #bfdbfe 0%, #c8e1fd 25%, #d1e7fc 50%, #daedfc 75%, #e3f3fb 100%)',
      'linear-gradient(90deg, #93c5fd 0%, #a5b4fc 25%, #c7d2fe 50%, #e0e7ff 75%, #f0f4ff 100%)',
      
      // Purple variations
      'linear-gradient(90deg, #d8b4fe 0%, #e9d5ff 25%, #f3e8ff 50%, #faf5ff 75%, #fefcff 100%)',
      'linear-gradient(90deg, #c084fc 0%, #d946ef 25%, #e879f9 50%, #f0abfc 75%, #f5d0fe 100%)',
      
      // Pink variations
      'linear-gradient(90deg, #fce7f3 0%, #fce8f4 25%, #fde9f5 50%, #fdeaf6 75%, #feebf7 100%)',
      'linear-gradient(90deg, #f9a8d4 0%, #fbb6ce 25%, #fcc2d7 50%, #fccee0 75%, #fdd9e9 100%)',
      
      // Yellow variations
      'linear-gradient(90deg, #fef3c7 0%, #fdf4c9 25%, #fcf5cb 50%, #fbf6cd 75%, #faf7cf 100%)',
      'linear-gradient(90deg, #fed7aa 0%, #fdba74 25%, #fb923c 50%, #f97316 75%, #ea580c 100%)',
      
      // Red variations
      'linear-gradient(90deg, #fee2e2 0%, #fee3e3 25%, #fee4e4 50%, #fee5e5 75%, #fee6e6 100%)',
      'linear-gradient(90deg, #fca5a5 0%, #f87171 25%, #ef4444 50%, #dc2626 75%, #b91c1c 100%)',
      
      // Additional unique gradients
      'linear-gradient(90deg, #fde68a 0%, #fbbf24 25%, #f59e0b 50%, #d97706 75%, #b45309 100%)',
      'linear-gradient(90deg, #a78bfa 0%, #8b5cf6 25%, #7c3aed 50%, #6d28d9 75%, #5b21b6 100%)',
      'linear-gradient(90deg, #34d399 0%, #10b981 25%, #059669 50%, #047857 75%, #065f46 100%)',
      'linear-gradient(90deg, #60a5fa 0%, #3b82f6 25%, #2563eb 50%, #1d4ed8 75%, #1e40af 100%)',
      'linear-gradient(90deg, #f472b6 0%, #ec4899 25%, #db2777 50%, #be185d 75%, #9d174d 100%)',
      'linear-gradient(90deg, #fb7185 0%, #f43f5e 25%, #e11d48 50%, #be123c 75%, #9f1239 100%)',
      'linear-gradient(90deg, #facc15 0%, #eab308 25%, #ca8a04 50%, #a16207 75%, #854d0e 100%)',
      'linear-gradient(90deg, #a3a3a3 0%, #737373 25%, #525252 50%, #404040 75%, #262626 100%)',
      'linear-gradient(90deg, #67e8f9 0%, #22d3ee 25%, #06b6d4 50%, #0891b2 75%, #0e7490 100%)',
      'linear-gradient(90deg, #fbbf24 0%, #f59e0b 25%, #d97706 50%, #b45309 75%, #92400e 100%)',
      'linear-gradient(90deg, #a855f7 0%, #9333ea 25%, #7c3aed 50%, #6d28d9 75%, #5b21b6 100%)',
      'linear-gradient(90deg, #f97316 0%, #ea580c 25%, #dc2626 50%, #b91c1c 75%, #991b1b 100%)',
      'linear-gradient(90deg, #84cc16 0%, #65a30d 25%, #4d7c0f 50%, #365314 75%, #1a2e05 100%)'
    ];
    
    // Calculate unique index based on section and item position
    const uniqueIndex = (sectionIndex * 10 + itemIndex) % gradients.length;
    return gradients[uniqueIndex];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar - Matching Design */}
      <div className="w-16 text-white flex flex-col items-center py-4" style={{ backgroundColor: 'rgb(3, 10, 61)' }}>
        {/* Logo Section */}
        <div className="mb-8">
          <div 
            className="w-10 h-10 bg-white rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleNavigation('/dashboard')}
          >
            <Building className="w-6 h-6" style={{ color: 'rgb(3, 10, 61)' }} />
          </div>
        </div>

        {/* Navigation Icons */}
        <nav className="flex flex-col space-y-4 flex-1">
          <button
            onClick={() => handleNavigation('/dashboard')}
            className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative group text-white/80 hover:text-white"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(3, 10, 61, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={t('home') || 'Home'}
          >
            <Home className="w-5 h-5" />
            <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {t('home') || 'Home'}
            </div>
          </button>
          
          <button
            onClick={() => handleNavigation('/business-plan/wizard')}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-white relative group"
            style={{ backgroundColor: 'rgba(3, 10, 61, 0.8)' }}
            title={t('plan') || 'Plan'}
          >
            <FileText className="w-5 h-5" />
            <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {t('plan') || 'Plan'}
            </div>
          </button>
          
          <button
            onClick={() => handleNavigation('/business-plan-editor')}
            className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative group text-white/80 hover:text-white"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(3, 10, 61, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={t('editPlan') || 'Edit Plan'}
          >
            <Edit className="w-5 h-5" />
            <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {t('editPlan') || 'Edit Plan'}
            </div>
          </button>
          
          <button
            className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative group text-white/80 hover:text-white"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(3, 10, 61, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={t('viewPlan') || 'View Plan'}
          >
            <Eye className="w-5 h-5" />
            <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {t('viewPlan') || 'View Plan'}
            </div>
          </button>
          
          <button
            onClick={() => handleNavigation('/financials')}
            className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative group text-white/80 hover:text-white"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(3, 10, 61, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={t('financials') || 'Financials'}
          >
            <DollarSign className="w-5 h-5" />
            <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {t('financials') || 'Financials'}
            </div>
          </button>
          
          <button
            onClick={() => handleNavigation('/users')}
            className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative group text-white/80 hover:text-white"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(3, 10, 61, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={t('users') || 'Users'}
          >
            <Users className="w-5 h-5" />
            <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {t('users') || 'Users'}
            </div>
          </button>
          
          <button
            onClick={() => handleNavigation('/settings')}
            className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative group text-white/80 hover:text-white"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(3, 10, 61, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={t('settings') || 'Settings'}
          >
            <Settings className="w-5 h-5" />
            <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {t('settings') || 'Settings'}
            </div>
          </button>
        </nav>

        {/* Bottom Upgrade Icon */}
        <div className="mt-auto">
          <div 
            className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-yellow-500 transition-colors group"
            onClick={() => handleNavigation('/upgrade')}
            title={t('upgrade') || 'Upgrade'}
          >
            <Lock className="w-5 h-5 text-gray-800" />
            <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {t('upgrade') || 'Upgrade'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xl font-bold text-dark">{t('businessPlanOverview') || 'Business Plan Overview'}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* User Profile Dropdown - Same as Dashboard */}
              {user?.email && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className='flex items-center bg-[#ECEFF3] py-[8px] rounded-full h-[50px] hover:bg-gray-200 space-x-2 px-3 transition-colors'>
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
                    </button>
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
                          <span className='text-sm'>{t('profile') || 'Profile'}</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='p-3 cursor-pointer'>
                        <div onClick={() => handleNavigation('/projects')} className='flex items-center space-x-2'>
                          <Building className="w-4 h-4" />
                          <span className='text-sm'>{t('projects') || 'Projects'}</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='p-3 cursor-pointer'>
                        <div onClick={() => handleNavigation('/settings')} className='flex items-center space-x-2'>
                          <Settings className="w-4 h-4" />
                          <span className='text-sm'>{t('settings') || 'Settings'}</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className='p-3 cursor-pointer'>
                        <div onClick={handleLogout} className='flex items-center space-x-2'>
                          <LogOut className="w-4 h-4 text-red-600" />
                          <span className='text-sm text-red-600'>{t('logout') || 'Logout'}</span>
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
        <div className="p-8 max-w-4xl mx-auto">
          {/* Initial Setup Section - At the top */}
          <div className="mb-8">
            <div className="space-y-4">
              {/* Section Title */}
              <div className="flex items-center space-x-4 mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Configuration initiale</h2>
              </div>

              {/* Initial Setup Item */}
              <div className="space-y-2">
                <div
                  className="relative flex items-center p-3 rounded-2xl transition-all duration-300 hover:shadow-lg cursor-pointer transform hover:scale-[1.02] border border-gray-200 shadow-sm"
                  style={{
                    background: 'linear-gradient(90deg, #e0f2fe 0%, #e1f3fe 25%, #e2f4fe 50%, #e3f5fe 75%, #e4f6fe 100%)'
                  }}
                  onClick={handleInitialSetup}
                >
                  {/* Step Number Circle */}
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold bg-white text-gray-700 shadow-md border-2 border-gray-100">
                      ⚙️
                    </div>
                  </div>

                  {/* Item Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-700">
                      Configuration initiale
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Plan d'affaires Aug 25
                    </p>
                  </div>

                  {/* Time Indicator */}
                  <div className="flex-shrink-0 ml-4 flex items-center">
                    <span className="text-base font-semibold mr-3 text-gray-700">
                      10 Min
                    </span>
                    <ChevronLeft className="w-5 h-5 rotate-180 text-gray-700" />
                  </div>
                </div>
              </div>

              {/* Section Number Badge */}
              <div className="flex justify-end mt-4">
                <div className="text-6xl font-bold text-gray-300 opacity-60">
                  0
                </div>
              </div>
            </div>
          </div>

          {/* Business Plan Sections - Image-inspired Design */}
          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.id} className="space-y-4">
                {/* Section Title */}
                <div className="flex items-center space-x-4 mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">{section.title}</h2>
                  {section.locked && <Lock className="w-6 h-6 text-gray-400" />}
                </div>

                {/* Section Items with Exact Image Design */}
                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={item.id}
                      className={`relative flex items-center p-3 rounded-2xl transition-all duration-300 ${
                        section.locked 
                          ? 'bg-gray-100 opacity-50 cursor-not-allowed' 
                          : 'hover:shadow-lg cursor-pointer transform hover:scale-[1.02]'
                      } border border-gray-200 shadow-sm`}
                      style={{
                        background: section.locked 
                          ? '#f3f4f6' 
                          : getItemGradient(sections.indexOf(section), itemIndex)
                      }}
                      onClick={() => !section.locked && handleSectionClick(section)}
                    >
                      {/* Step Number Circle - Smaller size */}
                      <div className="flex-shrink-0 mr-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                          section.locked 
                            ? 'bg-gray-300 text-gray-500' 
                            : item.completed 
                              ? 'bg-green-500 text-white' 
                              : 'bg-white text-gray-700 shadow-md border-2 border-gray-100'
                        }`}>
                          {section.locked ? (
                            <Lock className="w-5 h-5" />
                          ) : item.completed ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            item.step || 1
                          )}
                        </div>
                      </div>

                      {/* Item Content */}
                      <div className="flex-1">
                        <h3 className={`text-lg font-bold ${
                          section.locked ? 'text-gray-400' : 'text-white'
                        }`}>
                          {item.title}
                        </h3>
                      </div>

                      {/* Time Indicator - Smaller size */}
                      {item.time && (
                        <div className="flex-shrink-0 ml-4 flex items-center">
                          <span className={`text-base font-semibold mr-3 ${
                            section.locked ? 'text-gray-400' : 'text-white'
                          }`}>
                            {item.time}
                          </span>
                          <ChevronLeft className={`w-5 h-5 rotate-180 ${
                            section.locked ? 'text-gray-300' : 'text-white'
                          }`} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Section Number Badge - Like in the image */}
                <div className="flex justify-end mt-4">
                  <div className="text-6xl font-bold text-gray-300 opacity-60">
                    {sections.indexOf(section) + 1}
                  </div>
                </div>

                {/* Special overlay for locked sections */}
                {section.locked && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                          <span className="text-yellow-600 text-lg">⚠️</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-yellow-800 mb-2">
                          {t('important') || 'Important'}
                        </h4>
                        <p className="text-yellow-700 mb-4">
                          {t('initialSetupRequired') || 'Initial setup must be completed before accessing this section.'}
                        </p>
                        <button 
                          onClick={handleInitialSetup}
                          className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                        >
                          {t('startInitialSetup') || 'Start Initial Setup'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPlanOverviewNew;
