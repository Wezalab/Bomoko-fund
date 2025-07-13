import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/lib/TranslationContext';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/userSlice';
import { ChevronRight, Lock, Users } from 'lucide-react';
import { Button } from './ui/button';
import logoLight from '../assets/logoLight.webp';

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [selectedBusiness, setSelectedBusiness] = useState('TechTribe');
  const [selectedPlan, setSelectedPlan] = useState('Business Plan Plan 1');

  const sidebarItems = [
    { name: 'Home', icon: '🏠', path: '/dashboard', active: true },
    { name: 'Edit Plan', icon: '📝', path: '/business-plan/editor', active: false },
    { name: 'View Plan', icon: '👁️', path: '/business-plan', active: false },
    { name: 'Financials', icon: '💰', path: '/financials', active: false },
    { name: 'Users', icon: '👥', path: '/users', active: false },
  ];

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit',
      year: '2-digit'
    }).replace(/\//g, '.');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#0D4A4A] text-white flex flex-col">
        {/* Logo Section */}
        <div className="p-4 border-b border-[#1A5A5A]">
          <div className="flex items-center space-x-2">
            <img src={logoLight} alt="VenturePlanner" className="h-8 w-auto" />
            <span className="font-bold text-lg text-yellow-400">VenturePlanner</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-[#1A5A5A] transition-colors ${
                item.active ? 'bg-[#1A5A5A] border-r-2 border-yellow-400' : ''
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Upgrade Section */}
        <div className="p-4 border-t border-[#1A5A5A]">
          <div className="bg-[#1A5A5A] rounded-lg p-4 text-center">
            <Lock className="mx-auto mb-2 h-8 w-8 text-yellow-400" />
            <p className="text-sm text-gray-300 mb-3">
              Upgrade to unlock more features and sections.
            </p>
            <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-semibold">
              Upgrade
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
              HOME
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome {user?.name || 'User'}
          </h1>
        </div>

        {/* Main Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Top Section - Business and Plan Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Selected Business */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Selected Business</h2>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedBusiness}</h3>
              <div className="text-sm text-gray-600 mb-4">
                <span>Created: {formatDate()}</span>
                <span className="ml-4">Location: Afghanistan</span>
              </div>
              <p className="text-gray-600 mb-6">
                Click below to change business or create a new business. Remember one business can have multiple plans.
              </p>
              <div className="flex space-x-3">
                <Button className="bg-black text-white hover:bg-gray-800 px-6">
                  {selectedBusiness}
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4">
                  + New Business
                </Button>
              </div>
            </div>

            {/* Selected Plan */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Selected Plan</h2>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedPlan}</h3>
              <div className="text-sm text-gray-600 mb-4">
                <span>Created: {formatDate()}</span>
                <span className="ml-4">Type: Not Setup</span>
              </div>
              <p className="text-gray-600 mb-6">
                Click below to change plan or create a new plan. Remember one business can have multiple business plans if necessary.
              </p>
              <div className="flex space-x-3">
                <Button className="bg-[#0D4A4A] text-white hover:bg-[#1A5A5A] px-6">
                  {selectedPlan}
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4">
                  + New Plan
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Business Settings */}
            <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Business Settings</h3>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-gray-600 text-sm">
                Modify the fundamental details about {selectedBusiness}, such as name, location and language.
              </p>
            </div>

            {/* User Access */}
            <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">User Access</h3>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Manage access for users associated with {selectedBusiness}.
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
              onClick={() => navigate('/business-plan/editor')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Plan Editor</h3>
                <ChevronRight className="h-5 w-5 text-white" />
              </div>
              <p className="text-gray-200 text-sm">
                Continue working on the currently selected plan using the plan editor interface.
              </p>
            </div>

            {/* Plan Viewer */}
            <div 
              className="bg-[#0D4A4A] text-white rounded-lg p-6 hover:bg-[#1A5A5A] transition-colors cursor-pointer"
              onClick={() => navigate('/business-plan')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Plan Viewer</h3>
                <ChevronRight className="h-5 w-5 text-white" />
              </div>
              <p className="text-gray-200 text-sm">
                View or download the currently selected plan. Note that you cannot edit the plan in the plan viewer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 