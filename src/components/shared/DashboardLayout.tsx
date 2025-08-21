import React from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
  backPath?: string;
  showBusinessSettings?: boolean;
  onInitialSetup?: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title, 
  showBackButton = false,
  backPath = '/dashboard',
  showBusinessSettings = false,
  onInitialSetup
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <DashboardHeader 
          title={title}
          showBackButton={showBackButton}
          backPath={backPath}
          showBusinessSettings={showBusinessSettings}
          onInitialSetup={onInitialSetup}
        />
        
        {/* Page Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
