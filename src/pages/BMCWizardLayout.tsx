import React from 'react';
import DashboardSidebar from '@/components/shared/DashboardSidebar';
import BMCQuestionnaire from '@/components/bmc/BMCQuestionnaire';

const BMCWizardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      <div className="flex-1 ml-[72px] overflow-auto">
        <BMCQuestionnaire />
      </div>
    </div>
  );
};

export default BMCWizardLayout;
