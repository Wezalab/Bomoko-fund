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
  Settings,
  LayoutGrid,
  FolderOpen,
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

    if (path === '/bmc' && location.pathname.startsWith('/bmc')) {
      return true;
    }

    if (path === '/manage' && location.pathname === '/manage') {
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
      path: '/bmc',
      icon: LayoutGrid,
      label: t('bmc') || 'BMC',
      active: isActiveRoute('/bmc')
    },
    {
      path: '/manage',
      icon: FolderOpen,
      label: t('manage') || 'Manage',
      active: isActiveRoute('/manage')
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
    <div className={`w-16 text-white flex flex-col items-center py-4 ${className}`} style={{ backgroundColor: 'rgb(3, 10, 61)' }}>
      {/* Logo Section */}
      <div className="mb-8">
        <div 
          className="w-10 h-10 bg-white rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => handleNavigation('/dashboard')}
        >
          <CheckCircle className="w-6 h-6" style={{ color: 'rgb(3, 10, 61)' }} />
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
                  ? 'text-white' 
                  : 'text-white/80 hover:text-white'
              }`}
              style={{
                backgroundColor: item.active 
                  ? 'rgba(3, 10, 61, 0.8)' 
                  : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (!item.active) {
                  e.currentTarget.style.backgroundColor = 'rgba(3, 10, 61, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                if (!item.active) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
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
