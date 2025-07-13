import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectUser, setUser, setToken, initialState } from '@/redux/slices/userSlice';
import { ProjectInitialState, setProject } from '@/redux/slices/projectSlice';
import { 
  Home, 
  Edit, 
  Eye, 
  DollarSign, 
  Users, 
  Settings, 
  User,
  ArrowUpRight,
  Crown,
  Trash2,
  Plus,
  Building,
  FileText,
  MapPin,
  Calendar,
  HelpCircle,
  Mail,
  UserCheck,
  Youtube,
  Facebook,
  Linkedin,
  Instagram,
  Lock,
  ChevronDown,
  Bell,
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

interface BusinessData {
  id: string;
  name: string;
  description: string;
  location: string;
  createdAt: string;
  businessTypes: string[];
}

interface PlanData {
  id: string;
  name: string;
  businessId: string;
  createdAt: string;
  type: string;
  status: 'setup' | 'not_setup' | 'completed';
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser) as unknown as ExtendedUser;

  // Mock data - in real app, this would come from Redux store or API
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessData | null>({
    id: '1',
    name: 'TechTribe',
    description: 'Technology solutions for African entrepreneurs',
    location: 'Uganda',
    createdAt: '2025-07-12',
    businessTypes: ['Technology', 'Software Development', 'E-commerce']
  });

  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>({
    id: '1',
    name: 'Business Plan Plan 1',
    businessId: '1',
    createdAt: '2025-07-12',
    type: 'Not Setup',
    status: 'not_setup'
  });

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#0D4A4A] text-white flex flex-col">
        {/* Logo Section */}
        <div className="p-4 border-b border-[#1A5A5A]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded text-[#0D4A4A] flex items-center justify-center font-bold">
              B
            </div>
            <span className="text-xl font-bold text-white">BOMOKO FUND</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <button
            onClick={() => handleNavigation('/dashboard')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-left bg-[#1A5A5A] border-r-2 border-yellow-400 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </button>
          
          <button
            onClick={() => handleNavigation('/business-plan-editor')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-[#1A5A5A] transition-colors"
          >
            <Edit className="w-5 h-5" />
            <span className="font-medium">Edit Plan</span>
          </button>
          
          <button
            onClick={() => handleNavigation('/business-plan')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-[#1A5A5A] transition-colors"
          >
            <Eye className="w-5 h-5" />
            <span className="font-medium">View Plan</span>
          </button>
          
          <button
            onClick={() => handleNavigation('/financials')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-[#1A5A5A] transition-colors"
          >
            <DollarSign className="w-5 h-5" />
            <span className="font-medium">Financials</span>
          </button>
          
          <button
            onClick={() => handleNavigation('/users')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-[#1A5A5A] transition-colors"
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Users</span>
          </button>
        </nav>

        {/* Upgrade Section */}
        <div className="p-4 border-t border-[#1A5A5A]">
          <div className="bg-[#1A5A5A] rounded-lg p-4 text-center">
            <Lock className="mx-auto mb-2 h-8 w-8 text-yellow-400" />
            <p className="text-sm text-gray-300 mb-3">
              Upgrade to unlock more features and sections.
            </p>
            <button className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-semibold py-2 px-4 rounded">
              Upgrade
            </button>
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
                  HOME
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome {user?.name || user?.email?.split('@')[0] || 'User'}
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
                          <span className='text-sm'>Profile</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='p-3 cursor-pointer'>
                        <div onClick={() => handleNavigation('/projects')} className='flex items-center space-x-2'>
                          <Building className="w-4 h-4" />
                          <span className='text-sm'>Projects</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='p-3 cursor-pointer'>
                        <div onClick={() => handleNavigation('/settings')} className='flex items-center space-x-2'>
                          <Settings className="w-4 h-4" />
                          <span className='text-sm'>Settings</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className='p-3 cursor-pointer'>
                        <div onClick={handleLogout} className='flex items-center space-x-2'>
                          <LogOut className="w-4 h-4 text-red-600" />
                          <span className='text-sm text-red-600'>Logout</span>
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
            {/* Selected Business */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Selected Business</h2>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">TechTribe</h3>
              <div className="text-sm text-gray-600 mb-4">
                <span>Created: {formatDate(selectedBusiness?.createdAt || '2025-07-12')}</span>
                <span className="ml-4">Location: {selectedBusiness?.location || 'Uganda'}</span>
              </div>
              <p className="text-gray-600 mb-6">
                Click below to change business or create a new business. Remember one business can have multiple plans.
              </p>
              <div className="flex space-x-3">
                <button className="bg-black text-white hover:bg-gray-800 px-6 py-2 rounded font-medium">
                  TechTribe
                </button>
                <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded">
                  + New Business
                </button>
              </div>
            </div>

            {/* Selected Plan */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Selected Plan</h2>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Business Plan Plan 1</h3>
              <div className="text-sm text-gray-600 mb-4">
                <span>Created: {formatDate(selectedPlan?.createdAt || '2025-07-12')}</span>
                <span className="ml-4">Type: Not Setup</span>
              </div>
              <p className="text-gray-600 mb-6">
                Click below to change plan or create a new plan. Remember one business can have multiple business plans if necessary.
              </p>
              <div className="flex space-x-3">
                <button className="bg-[#0D4A4A] text-white hover:bg-[#1A5A5A] px-6 py-2 rounded font-medium">
                  Business Plan Plan 1
                </button>
                <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded">
                  + New Plan
                </button>
              </div>
            </div>
          </div>

          {/* Action Cards - First Row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Business Settings */}
            <div 
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleNavigation('/business-settings')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Business Settings</h3>
                <ArrowUpRight className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-gray-600 text-sm">
                Modify the fundamental details about TechTribe, such as name, location and language.
              </p>
            </div>

            {/* User Access */}
            <div 
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleNavigation('/user-access')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">User Access</h3>
                <ArrowUpRight className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Manage access for users associated with TechTribe.
              </p>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                  0 Collaborators
                </span>
              </div>
            </div>

            {/* Plan Editor */}
            <div
              className="bg-[#0D4A4A] text-white rounded-lg p-6 hover:bg-[#1A5A5A] transition-colors cursor-pointer"
              onClick={() => handleNavigation('/business-plan-editor')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Plan Editor</h3>
                <ArrowUpRight className="h-5 w-5 text-white" />
              </div>
              <p className="text-gray-200 text-sm">
                Continue working on the currently selected plan using the plan editor interface.
              </p>
            </div>

            {/* Plan Viewer */}
            <div
              className="bg-[#0D4A4A] text-white rounded-lg p-6 hover:bg-[#1A5A5A] transition-colors cursor-pointer"
              onClick={() => handleNavigation('/business-plan')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Plan Viewer</h3>
                <ArrowUpRight className="h-5 w-5 text-white" />
              </div>
              <p className="text-gray-200 text-sm">
                View or download the currently selected plan. Note that you cannot edit the plan in the plan viewer.
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
                <h3 className="text-lg font-bold text-gray-900">Account Settings</h3>
                <ArrowUpRight className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-gray-600 text-sm">
                Manage your user profile, account and billing details.
              </p>
            </div>

            {/* Frequent Questions */}
            <div 
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer border-[#0D4A4A]"
              onClick={() => handleNavigation('/faq')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Frequent Questions</h3>
                <ArrowUpRight className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-gray-600 text-sm">
                Find answers to common questions and watch tutorial videos.
              </p>
            </div>

            {/* Request Support */}
            <div 
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleNavigation('/support')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Request Support</h3>
                <ArrowUpRight className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-gray-600 text-sm">
                Get in touch with our support team for technical or account related assistance.
              </p>
            </div>

            {/* Partner Program */}
            <div 
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer opacity-60"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Partner Program</h3>
                <ArrowUpRight className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-gray-600 text-sm">
                Earn rewards by referring new customers to our services.
              </p>
            </div>
          </div>

          {/* Quote Section */}
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              "A goal without a plan is just a wish"
            </h2>
            <p className="text-yellow-600 font-medium">
              Antoine de Saint-Exupéry
            </p>
          </div>

          {/* Footer */}
          <div className="border-t pt-8 pb-4">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 font-medium">Find us on Social Media</span>
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
                  <div className="w-8 h-8 bg-[#0D4A4A] rounded text-white flex items-center justify-center font-bold">
                    B
                  </div>
                  <span className="text-xl font-bold text-[#0D4A4A]">BOMOKO FUND</span>
                </div>
                <div className="text-right">
                  <p className="text-gray-900 font-bold">Be Unstoppable.</p>
                  <p className="text-gray-600 text-sm">AI-Driven Planning.</p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-6 text-gray-600 text-sm">
              <p>You are on our <strong>Free Trial</strong> with limited functionality.</p>
              <p>Crafting strategies to make entrepreneurs <strong>unstoppable</strong>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 