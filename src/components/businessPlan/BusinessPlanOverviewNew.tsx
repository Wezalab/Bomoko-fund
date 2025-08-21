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
      title: t('businessDescription') || 'Business Description',
      description: t('businessDescriptionDesc') || 'Define your business concept, products, and services',
      completed: false,
      locked: !initialSetupCompleted,
      color: 'sage',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-100',
      items: [
        { id: 'overview', title: t('overview') || 'Overview', completed: false, time: '5 Min', step: 1 },
        { id: 'problem-solution', title: t('problemSolution') || 'Problem & Solution', completed: false, time: '5 Min', step: 2 },
        { id: 'mission-vision-values', title: t('missionVisionValues') || 'Mission, Vision & Values', completed: false, time: '5 Min', step: 3 },
        { id: 'intellectual-property', title: t('intellectualProperty') || 'Intellectual Property', completed: false, time: '5 Min', step: 4 },
        { id: 'achievements', title: t('achievements') || 'Achievements', completed: false, time: '5 Min', step: 5 },
        { id: 'structure-ownership', title: t('structureOwnership') || 'Structure & Ownership', completed: false, time: '3 Min', step: 6 }
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
              {/* Business Settings Section */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{t('businessSettings') || 'Business Settings'}</span>
                <button 
                  onClick={handleInitialSetup}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                >
                  {t('initialSetup') || 'Initial Setup'}
                  <br />
                  <span className="text-xs opacity-90">{t('businessPlanAug25') || 'Business Plan Aug 25'}</span>
                </button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-2 cursor-pointer">
                    <span className="text-sm font-medium">{t('bomokoFund') || 'Bomoko Fund'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>{t('settings') || 'Settings'}</DropdownMenuItem>
                    <DropdownMenuItem>{t('switchBusiness') || 'Switch Business'}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <span className="text-sm text-gray-600">{t('startHere') || 'Start Here'}</span>
              </div>

              {/* User Dropdown */}
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-2 cursor-pointer">
                    <img 
                      src={userAvatar} 
                      alt="User Avatar" 
                      className="w-8 h-8 rounded-full object-cover"
                      onError={handleImageError}
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                    />
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => handleNavigation('/profile')}>
                        <User className="w-4 h-4 mr-2" />
                        <span>{t('profile') || 'Profile'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleNavigation('/settings')}>
                        <Settings className="w-4 h-4 mr-2" />
                        <span>{t('settings') || 'Settings'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2 text-red-600" />
                        <span className="text-red-600">{t('logout') || 'Logout'}</span>
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
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className={`relative flex items-center p-5 rounded-2xl transition-all duration-300 ${
                        section.locked 
                          ? 'bg-gray-100 opacity-50 cursor-not-allowed' 
                          : 'hover:shadow-lg cursor-pointer transform hover:scale-[1.02]'
                      } border border-gray-200 shadow-sm`}
                      style={{
                        background: section.locked 
                          ? '#f3f4f6' 
                          : 'linear-gradient(90deg, #b8e6d6 0%, #c1e6d3 25%, #cae6d0 50%, #d3e6cd 75%, #dce6ca 100%)'
                      }}
                      onClick={() => !section.locked && handleSectionClick(section)}
                    >
                      {/* Step Number Circle - Exact match to image */}
                      <div className="flex-shrink-0 mr-5">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                          section.locked 
                            ? 'bg-gray-300 text-gray-500' 
                            : item.completed 
                              ? 'bg-green-500 text-white' 
                              : 'bg-white text-gray-700 shadow-md border-2 border-gray-100'
                        }`}>
                          {section.locked ? (
                            <Lock className="w-6 h-6" />
                          ) : item.completed ? (
                            <CheckCircle className="w-7 h-7" />
                          ) : (
                            item.step || 1
                          )}
                        </div>
                      </div>

                      {/* Item Content */}
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold ${
                          section.locked ? 'text-gray-400' : 'text-white'
                        }`}>
                          {item.title}
                        </h3>
                      </div>

                      {/* Time Indicator - Exact match to image */}
                      {item.time && (
                        <div className="flex-shrink-0 ml-4 flex items-center">
                          <span className={`text-lg font-semibold mr-3 ${
                            section.locked ? 'text-gray-400' : 'text-white'
                          }`}>
                            {item.time}
                          </span>
                          <ChevronLeft className={`w-6 h-6 rotate-180 ${
                            section.locked ? 'text-gray-300' : 'text-white'
                          }`} />
                        </div>
                      )}
                    </div>
                  ))}
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
