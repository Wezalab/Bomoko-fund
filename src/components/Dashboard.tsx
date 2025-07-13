import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/userSlice';
import { 
  Home, 
  Edit, 
  Eye, 
  DollarSign, 
  Users, 
  Settings, 
  User,
  ArrowUpRight,
  Crown
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lightGreen/20 to-lightBlue/20 flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-gradient-to-b from-[#02093d] to-[#0a1854] text-white flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded text-[#02093d] flex items-center justify-center font-bold text-lg">
              B
            </div>
            <span className="text-2xl font-bold text-white">BOMOKO FUND</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-6">
          <nav className="space-y-2">
            <button
              onClick={() => handleNavigation('/dashboard')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
            
            <button
              onClick={() => handleNavigation('/business-plan-editor')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 text-gray-200 transition-colors"
            >
              <Edit className="w-5 h-5" />
              <span>Edit Plan</span>
            </button>
            
            <button
              onClick={() => handleNavigation('/business-plan')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 text-gray-200 transition-colors"
            >
              <Eye className="w-5 h-5" />
              <span>View Plan</span>
            </button>
            
            <button
              onClick={() => handleNavigation('/financials')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 text-gray-200 transition-colors"
            >
              <DollarSign className="w-5 h-5" />
              <span>Financials</span>
            </button>
            
            <button
              onClick={() => handleNavigation('/users')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 text-gray-200 transition-colors"
            >
              <Users className="w-5 h-5" />
              <span>Users</span>
            </button>
          </nav>
        </div>

        {/* Upgrade Section */}
        <div className="p-6 border-t border-white/10">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h3 className="font-semibold text-white mb-1">Upgrade to Pro</h3>
            <p className="text-sm text-gray-300 mb-3">Get advanced features and priority support</p>
            <button className="w-full bg-lightBlue hover:bg-lightBlue/90 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-dark">Welcome {user?.name || 'User'}</h1>
              <p className="text-gray-600">HOME</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleNavigation('/profile')}
                className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
              >
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Selected Business Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-dark mb-4">Selected Business</h2>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-lightBlue rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div>
                  <h3 className="font-semibold text-dark">TechTribe</h3>
                  <p className="text-gray-600 text-sm">Created on Dec 28, 2024</p>
                  <p className="text-gray-600 text-sm">📍 Afghanistan</p>
                </div>
              </div>
            </div>

            {/* Selected Plan Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-lg font-semibold text-dark mb-4">Selected Plan</h2>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-dark">Business Plan Plan 1</h3>
                  <p className="text-gray-600 text-sm">Created on Dec 28, 2024</p>
                  <p className="text-gray-600 text-sm">Type: Not Setup</p>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                onClick={() => handleNavigation('/business-settings')}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-lightBlue/10 rounded-lg flex items-center justify-center">
                    <Settings className="w-6 h-6 text-lightBlue" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-lightBlue transition-colors" />
                </div>
                <h3 className="font-semibold text-dark mb-2">Business Settings</h3>
                <p className="text-gray-600 text-sm">Configure your business information and preferences</p>
              </div>

              <div
                onClick={() => handleNavigation('/user-access')}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-lightBlue/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-lightBlue" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-lightBlue transition-colors" />
                </div>
                <h3 className="font-semibold text-dark mb-2">User Access</h3>
                <p className="text-gray-600 text-sm">Manage user permissions and access levels</p>
              </div>

              <div
                onClick={() => handleNavigation('/business-plan-editor')}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-lightBlue/10 rounded-lg flex items-center justify-center">
                    <Edit className="w-6 h-6 text-lightBlue" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-lightBlue transition-colors" />
                </div>
                <h3 className="font-semibold text-dark mb-2">Plan Editor</h3>
                <p className="text-gray-600 text-sm">Create and edit your business plan</p>
              </div>

              <div
                onClick={() => handleNavigation('/business-plan')}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-lightBlue/10 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-lightBlue" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-lightBlue transition-colors" />
                </div>
                <h3 className="font-semibold text-dark mb-2">Plan Viewer</h3>
                <p className="text-gray-600 text-sm">View and share your completed business plan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 