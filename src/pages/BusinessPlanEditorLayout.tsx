import React from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessPlanEditor from '../components/businessPlan/BusinessPlanEditor';

const BusinessPlanEditorLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/business-plan');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BusinessPlanEditor onBack={handleBack} />
    </div>
  );
};

export default BusinessPlanEditorLayout; 