import React from 'react';
import DashboardSidebar from '@/components/shared/DashboardSidebar';
import BMCCanvasGrid from '@/components/bmc/BMCCanvasGrid';

const BMCCanvasLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      <div className="flex-1 ml-[72px] overflow-auto">
        <BMCCanvasGrid />
      </div>
    </div>
  );
};

export default BMCCanvasLayout;
