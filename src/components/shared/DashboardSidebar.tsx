import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '@/lib/TranslationContext';
import { 
  Home,
  FileText,
  HelpCircle,
  Users,
  Lock,
  CheckCircle,
  Edit,
  Eye,
  DollarSign,
  Settings
} from 'lucide-react';

interface DashboardSidebarProps {
  className?: string;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Function to check if a menu item is active
  const isActiveRoute = (path: string) => {
    if (location.pathname === path) return true;
    
    // Handle special cases for nested routes
    if (path === '/business-plan/wizard' && (location.pathname.startsWith('/business-plan/') || location.pathname === '/business-plan/wizard')) {
      return true;
    }
    
    if (path === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    
    return false;
  };

  const navigationItems = [
    {
      path: '/dashboard',
      icon: Home,
      label: t('home') || 'Home',
      active: isActiveRoute('/dashboard')
    },
    {
      path: '/business-plan/wizard',
      icon: FileText,
      label: t('plan') || 'Plan',
      active: isActiveRoute('/business-plan/wizard')
    },
    {
      path: '/business-plan-editor',
      icon: Edit,
      label: t('editPlan') || 'Edit Plan',
      active: isActiveRoute('/business-plan-editor')
    },
    {
      path: '/business-plan',
      icon: Eye,
      label: t('viewPlan') || 'View Plan',
      active: isActiveRoute('/business-plan')
    },
    {
      path: '/financials',
      icon: DollarSign,
      label: t('financials') || 'Financials',
      active: isActiveRoute('/financials')
    },
    {
      path: '/users',
      icon: Users,
      label: t('users') || 'Users',
      active: isActiveRoute('/users')
    },
    {
      path: '/settings',
      icon: Settings,
      label: t('settings') || 'Settings',
      active: isActiveRoute('/settings')
    }
  ];

  return (
    <div className={`w-16 bg-teal-700 text-white flex flex-col items-center py-4 ${className}`}>
      {/* Logo Section */}
      <div className="mb-8">
        <div 
          className="w-10 h-10 bg-white rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => handleNavigation('/dashboard')}
        >
          <CheckCircle className="w-6 h-6 text-teal-700" />
        </div>
      </div>

      {/* Navigation Icons */}
      <nav className="flex flex-col space-y-4 flex-1">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative group ${
                item.active 
                  ? 'bg-teal-600 text-white' 
                  : 'hover:bg-teal-600 text-white/80 hover:text-white'
              }`}
              title={item.label}
            >
              <IconComponent className="w-5 h-5" />
              
              {/* Tooltip */}
              <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom Upgrade Icon */}
      <div className="mt-auto">
        <div 
          className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-yellow-500 transition-colors group"
          onClick={() => handleNavigation('/upgrade')}
          title={t('upgrade') || 'Upgrade'}
        >
          <Lock className="w-5 h-5 text-gray-800" />
          
          {/* Tooltip */}
          <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            {t('upgrade') || 'Upgrade'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
