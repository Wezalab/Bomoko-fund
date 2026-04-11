import React from 'react';
import Layout from './Layout';
import BMCQuestionnaire from '@/components/bmc/BMCQuestionnaire';

const BMCWizardLayout: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <BMCQuestionnaire />
      </div>
    </Layout>
  );
};

export default BMCWizardLayout;
