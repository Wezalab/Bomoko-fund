import React from 'react';
import DashboardSidebar from '@/components/shared/DashboardSidebar';
import ManagePage from '@/components/ManagePage';

const ManageLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      <div className="flex-1 ml-[72px] overflow-auto">
        <ManagePage />
      </div>
    </div>
  );
};

export default ManageLayout;
