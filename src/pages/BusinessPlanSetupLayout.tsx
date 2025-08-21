import React from 'react';
import Layout from './Layout';
import BusinessPlanLayout from '@/components/businessPlan/BusinessPlanLayout';

const BusinessPlanSetupLayout: React.FC = () => {
  return (
    <Layout>
      <BusinessPlanLayout />
    </Layout>
  );
};

export default BusinessPlanSetupLayout;
