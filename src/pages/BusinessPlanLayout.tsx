import React from 'react';
import Layout from './Layout';
import BusinessPlanWizard from '../components/BusinessPlanWizard';

const BusinessPlanLayout: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <BusinessPlanWizard />
      </div>
    </Layout>
  );
};

export default BusinessPlanLayout; 