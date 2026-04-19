import React from 'react';
import DashboardSidebar from '@/components/shared/DashboardSidebar';
import FinancialsPage from '@/components/FinancialsPage';

const FinancialsLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      <div className="flex-1 ml-[72px] overflow-auto">
        <FinancialsPage />
      </div>
    </div>
  );
};

export default FinancialsLayout;
