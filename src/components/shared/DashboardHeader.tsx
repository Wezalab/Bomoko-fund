import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectUser, setUser, setToken, initialState } from '@/redux/slices/userSlice';
import { ProjectInitialState, setProject } from '@/redux/slices/projectSlice';
import { useTranslation } from '@/lib/TranslationContext';
import { 
  ChevronLeft,
  ChevronDown,
  User,
  Settings,
  LogOut
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

interface DashboardHeaderProps {
  title: string;
  showBackButton?: boolean;
  backPath?: string;
  showBusinessSettings?: boolean;
  onInitialSetup?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  showBackButton = false, 
  backPath = '/dashboard',
  showBusinessSettings = false,
  onInitialSetup
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser) as ExtendedUser;
  const { t } = useTranslation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/');
    dispatch(setUser(initialState.user));
    dispatch(setToken(initialState.token));
    dispatch(setProject(ProjectInitialState.project));
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
    <div className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <button
              onClick={() => navigate(backPath)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <span className="text-xl font-bold text-dark">{title}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Business Settings Section - only show when requested */}
          {showBusinessSettings && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{t('businessSettings') || 'Business Settings'}</span>
              {onInitialSetup && (
                <button 
                  onClick={onInitialSetup}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                >
                  {t('initialSetup') || 'Initial Setup'}
                  <br />
                  <span className="text-xs opacity-90">{t('businessPlanAug25') || 'Business Plan Aug 25'}</span>
                </button>
              )}
              
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
          )}

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
  );
};

export default DashboardHeader;
