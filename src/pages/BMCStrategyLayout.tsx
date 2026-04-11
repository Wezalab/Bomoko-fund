import React from 'react';
import Layout from './Layout';
import BMCStrategySuggestions from '@/components/bmc/BMCStrategySuggestions';

const BMCStrategyLayout: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <BMCStrategySuggestions />
      </div>
    </Layout>
  );
};

export default BMCStrategyLayout;
