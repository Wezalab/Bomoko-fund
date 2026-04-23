import React from 'react';
import DashboardSidebar from '@/components/shared/DashboardSidebar';
import BMCStrategySuggestions from '@/components/bmc/BMCStrategySuggestions';

const BMCStrategyLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      <div className="flex-1 ml-[72px] overflow-auto">
        <BMCStrategySuggestions />
      </div>
    </div>
  );
};

export default BMCStrategyLayout;
