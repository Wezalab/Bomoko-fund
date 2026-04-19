import React from 'react';
import DashboardSidebar from '@/components/shared/DashboardSidebar';
import BMCDashboardList from '@/components/bmc/BMCDashboardList';

const BMCLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      <div className="flex-1 ml-[72px] overflow-auto">
        <BMCDashboardList />
      </div>
    </div>
  );
};

export default BMCLayout;
