import React from 'react';
import Layout from './Layout';
import BMCCanvasGrid from '@/components/bmc/BMCCanvasGrid';

const BMCCanvasLayout: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <BMCCanvasGrid />
      </div>
    </Layout>
  );
};

export default BMCCanvasLayout;
