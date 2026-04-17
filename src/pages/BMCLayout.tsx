import React from 'react';
import Layout from './Layout';
import BMCDashboardList from '@/components/bmc/BMCDashboardList';

const BMCLayout: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <BMCDashboardList />
      </div>
    </Layout>
  );
};

export default BMCLayout;
