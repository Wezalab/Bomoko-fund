import React from 'react';
import DashboardSidebar from '@/components/shared/DashboardSidebar';
import BMCIntroduction from '@/components/bmc/BMCIntroduction';

const BMCNewLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      <div className="flex-1 ml-[72px] overflow-auto">
        <BMCIntroduction />
      </div>
    </div>
  );
};

export default BMCNewLayout;
