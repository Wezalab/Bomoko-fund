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
  purpose: string;
  country: string;
}

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
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser) as unknown as ExtendedUser;

  // Mock business data from ventures - in real app, this would come from Redux store or API
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessData | null>({
    id: '1',
    name: 'TechTribe',
    description: 'Technology solutions for African entrepreneurs',
    location: 'Uganda',
    createdAt: '2025-07-12',
    businessTypes: ['Technology', 'Software Development', 'E-commerce'],
    purpose: 'create_business',
    country: 'UG'
  });

  // Mock plan data from ventures - in real app, this would come from Redux store or API
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>({
    id: '1',
    name: 'Business Plan Plan 1',
    businessId: '1',
    createdAt: '2025-07-12',
    type: 'Not Setup',
    status: 'not_setup',
    description: 'Initial business plan for TechTribe venture'
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

  const handleDeleteBusiness = () => {
    if (window.confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      setSelectedBusiness(null);
      setSelectedPlan(null); // Also remove associated plan
    }
  };

  const handleDeletePlan = () => {
    if (window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      setSelectedPlan(null);
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
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Business Selected</h3>
      <p className="text-gray-600 mb-6">Create your first business to get started with your entrepreneurial journey.</p>
      <button
        onClick={() => handleNavigation('/venture-wizard')}
        className="bg-lightBlue hover:bg-lightBlue/90 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
      >
        <Plus className="w-5 h-5" />
        <span>Create New Business</span>
      </button>
    </div>
  );

  const EmptyPlanState = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Plan Selected</h3>
      <p className="text-gray-600 mb-6">Create a business plan to organize your ideas and attract investors.</p>
      <button
        onClick={() => handleNavigation('/business-plan-editor')}
        className="bg-lightBlue hover:bg-lightBlue/90 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
      >
        <Plus className="w-5 h-5" />
        <span>Create New Plan</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-lightGreen/20 to-lightBlue/20 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-gradient-to-b from-[#02093d] to-[#0a1854] text-white flex flex-col">
        {/* Logo Section */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded text-[#02093d] flex items-center justify-center font-bold">
              B
            </div>
            <span className="text-xl font-bold text-white">BOMOKO FUND</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <button
            onClick={() => handleNavigation('/dashboard')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-left bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </button>
          
          <button
            onClick={() => handleNavigation('/business-plan-editor')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/10 text-gray-200 transition-colors"
          >
            <Edit className="w-5 h-5" />
            <span className="font-medium">Edit Plan</span>
          </button>
          
          <button
            onClick={() => handleNavigation('/business-plan')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/10 text-gray-200 transition-colors"
          >
            <Eye className="w-5 h-5" />
            <span className="font-medium">View Plan</span>
          </button>
          
          <button
            onClick={() => handleNavigation('/financials')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/10 text-gray-200 transition-colors"
          >
            <DollarSign className="w-5 h-5" />
            <span className="font-medium">Financials</span>
          </button>
          
          <button
            onClick={() => handleNavigation('/users')}
            className="w-full flex items-center space-x-3 px-4 py-3 px-4 py-3 text-left hover:bg-white/10 text-gray-200 transition-colors"
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Users</span>
          </button>
        </nav>

        {/* Upgrade Section */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <Lock className="mx-auto mb-2 h-8 w-8 text-yellow-400" />
            <p className="text-sm text-gray-300 mb-3">
              Upgrade to unlock more features and sections.
            </p>
            <button className="w-full bg-yellow-400 text-dark hover:bg-yellow-500 font-semibold py-2 px-4 rounded transition-colors">
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
              <h1 className="text-3xl font-bold text-dark">
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-dark">Selected Business</h2>
                {selectedBusiness && (
                  <button
                    onClick={handleDeleteBusiness}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    title="Delete Business"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              {selectedBusiness ? (
                <div>
                  <h3 className="text-2xl font-bold text-dark mb-2">{selectedBusiness.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{selectedBusiness.description}</p>
                  <div className="text-sm text-gray-600 mb-4">
                    <span>Created: {formatDate(selectedBusiness.createdAt)}</span>
                    <span className="ml-4">Location: {selectedBusiness.location}</span>
                  </div>
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {selectedBusiness.businessTypes.map((type, index) => (
                        <span key={index} className="bg-lightBlue/10 text-lightBlue px-2 py-1 rounded-full text-xs font-medium">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Click below to change business or create a new business. Remember one business can have multiple plans.
                  </p>
                  <div className="flex space-x-3">
                    <button className="bg-dark text-white hover:bg-dark/90 px-6 py-2 rounded font-medium transition-colors">
                      {selectedBusiness.name}
                    </button>
                    <button 
                      onClick={() => handleNavigation('/venture-wizard')}
                      className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded transition-colors"
                    >
                      + New Business
                    </button>
                  </div>
                </div>
              ) : (
                <EmptyBusinessState />
              )}
            </div>

            {/* Selected Plan */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-dark">Selected Plan</h2>
                {selectedPlan && (
                  <button
                    onClick={handleDeletePlan}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    title="Delete Plan"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              {selectedPlan ? (
                <div>
                  <h3 className="text-2xl font-bold text-dark mb-2">{selectedPlan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{selectedPlan.description}</p>
                  <div className="text-sm text-gray-600 mb-4">
                    <span>Created: {formatDate(selectedPlan.createdAt)}</span>
                    <span className="ml-4">Type: {selectedPlan.type}</span>
                  </div>
                  <div className="mb-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedPlan.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : selectedPlan.status === 'setup'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedPlan.status === 'completed' ? 'Completed' : 
                       selectedPlan.status === 'setup' ? 'In Progress' : 'Not Started'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Click below to change plan or create a new plan. Remember one business can have multiple business plans if necessary.
                  </p>
                  <div className="flex space-x-3">
                    <button className="bg-lightBlue text-white hover:bg-lightBlue/90 px-6 py-2 rounded font-medium transition-colors">
                      {selectedPlan.name}
                    </button>
                    <button 
                      onClick={() => handleNavigation('/business-plan-editor')}
                      className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded transition-colors"
                    >
                      + New Plan
                    </button>
                  </div>
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
                    <h3 className="text-lg font-bold text-dark">Business Settings</h3>
                    <ArrowUpRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-sm">
                    Modify the fundamental details about {selectedBusiness.name}, such as name, location and language.
                  </p>
                </div>

                {/* User Access */}
                <div 
                  className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleNavigation('/user-access')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-dark">User Access</h3>
                    <ArrowUpRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Manage access for users associated with {selectedBusiness.name}.
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
                  className="bg-lightBlue text-white rounded-lg p-6 hover:bg-lightBlue/90 transition-colors cursor-pointer"
                  onClick={() => handleNavigation('/business-plan-editor')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Plan Editor</h3>
                    <ArrowUpRight className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-gray-100 text-sm">
                    Continue working on the currently selected plan using the plan editor interface.
                  </p>
                </div>

                {/* Plan Viewer */}
                <div
                  className="bg-lightBlue text-white rounded-lg p-6 hover:bg-lightBlue/90 transition-colors cursor-pointer"
                  onClick={() => handleNavigation('/business-plan')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Plan Viewer</h3>
                    <ArrowUpRight className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-gray-100 text-sm">
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
                    <h3 className="text-lg font-bold text-dark">Account Settings</h3>
                    <ArrowUpRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-sm">
                    Manage your user profile, account and billing details.
                  </p>
                </div>

                {/* Frequent Questions */}
                <div 
                  className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer border-lightBlue"
                  onClick={() => handleNavigation('/faq')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-dark">Frequent Questions</h3>
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
                    <h3 className="text-lg font-bold text-dark">Request Support</h3>
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
                    <h3 className="text-lg font-bold text-dark">Partner Program</h3>
                    <ArrowUpRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-sm">
                    Earn rewards by referring new customers to our services.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Quote Section */}
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-dark mb-4">
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
                  <div className="w-8 h-8 bg-dark rounded text-white flex items-center justify-center font-bold">
                    B
                  </div>
                  <span className="text-xl font-bold text-dark">BOMOKO FUND</span>
                </div>
                <div className="text-right">
                  <p className="text-dark font-bold">Be Unstoppable.</p>
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