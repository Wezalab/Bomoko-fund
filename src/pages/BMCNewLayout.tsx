import React from 'react';
import Layout from './Layout';
import BMCIntroduction from '@/components/bmc/BMCIntroduction';

const BMCNewLayout: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <BMCIntroduction />
      </div>
    </Layout>
  );
};

export default BMCNewLayout;
