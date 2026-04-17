import React from 'react';
import { FileText, Download, Share2, Edit3 } from 'lucide-react';

interface BusinessPlanPreviewProps {
  planData: any;
  companyName: string;
  onEdit: () => void;
}

const BusinessPlanPreview: React.FC<BusinessPlanPreviewProps> = ({ 
  planData, 
  companyName = "REST-DRC",
  onEdit 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onEdit}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Insert
            </button>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              Business Plan Wizard
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg">
              Preview Mode
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex">
          {/* Sidebar Navigation */}
          <div className="w-64 bg-white rounded-lg shadow-lg mr-6 p-4">
            <h3 className="font-bold text-lg mb-4">Business Plan (Original)</h3>
            <div className="space-y-2">
              <SidebarItem title="Cover Page" active />
              <SidebarItem title="Executive Summary" />
              <SidebarItem title="Business Overview" />
              <SidebarItem title="Products And Services" />
              <SidebarItem title="Opportunity" />
              <SidebarItem title="Market Analysis" />
              <SidebarItem title="Competition" />
              <SidebarItem title="Marketing" />
              <SidebarItem title="Operations" />
              <SidebarItem title="Team" />
              <SidebarItem title="Financial Plan" />
              <SidebarItem title="Profit & Loss" />
              <SidebarItem title="Balance Sheet" />
            </div>
            <button className="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 mr-2" />
              Add new section
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Document Content */}
            <div className="p-8 max-w-4xl mx-auto">
              {/* Cover Page */}
              <div className="text-center mb-16">
                <h1 className="text-6xl font-bold text-black mb-8">{companyName}</h1>
                <div className="inline-block border-2 border-gray-300 px-8 py-4 mb-8">
                  <h2 className="text-2xl text-gray-600">Business Plan</h2>
                </div>
                <p className="text-lg text-gray-600 mb-8">May, 2025</p>
                
                {/* Abstract Design Element */}
                <div className="flex justify-center mb-8">
                  <div className="w-64 h-32 bg-gradient-to-r from-blue-200 to-blue-400 rounded-full opacity-70"></div>
                </div>
              </div>

              {/* Business Plan Sections */}
              <div className="space-y-12">
                <OpportunitySection />
                <MarketAnalysisSection />
                <FinancialPlanSection />
                <ProfitLossSection />
                <ExecutiveSummarySection />
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center p-6 border-t bg-gray-50">
              <button className="flex items-center text-blue-500 hover:text-blue-600">
                ← Previous
              </button>
              <div className="flex space-x-2">
                <div className="w-8 h-1 bg-blue-500 rounded"></div>
                <div className="w-8 h-1 bg-gray-300 rounded"></div>
              </div>
              <button className="flex items-center text-blue-500 hover:text-blue-600">
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarItem: React.FC<{ title: string; active?: boolean }> = ({ title, active = false }) => (
  <div className={`p-2 rounded cursor-pointer ${
    active ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
  }`}>
    {title}
  </div>
);

const OpportunitySection: React.FC = () => (
  <section>
    <h2 className="text-3xl font-bold text-blue-600 mb-6">Opportunity</h2>
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Problems Worth Solving</h3>
        <p className="text-gray-700 leading-relaxed">
          Potential customers of REST Restaurant face significant challenges such as long wait times for seating 
          or food and overpriced menu items. To address these concerns, we will implement a reservation 
          system with estimated wait times and offer an app for customers to check waitlists in real-time, along 
          with introducing a value menu featuring smaller portion options and regular promotions to enhance 
          affordability.
        </p>
      </div>
      <div>
        <p className="text-gray-700 leading-relaxed">
          These challenges create an opportunity for us to provide viable solutions that will not only increase 
          customer satisfaction but also spur business growth. Our extensive customer research has identified 
          these issues as pressing pain points, and we believe they are substantial enough to encourage 
          potential customers to switch to REST and invest in our offerings. By ensuring that our solutions 
          directly address these significant challenges, we position ourselves to attract and retain a loyal 
          customer base.
        </p>
      </div>
    </div>
  </section>
);

const MarketAnalysisSection: React.FC = () => (
  <section>
    <h2 className="text-3xl font-bold text-blue-600 mb-6">Market Analysis</h2>
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Target Market</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          REST targets the restaurant market in rural areas, aiming to serve communities that may have limited 
          dining options. Last year, the combined market size for rural restaurants in the United States was 
          estimated to be approximately $25 billion. Over the next five years, this market size is projected to 
          grow to around $30 billion, reflecting increasing interest in dining experiences outside urban centers. 
          The expected annual growth rate for the rural restaurant market is anticipated to be around 4% 
          annually, indicating steady development and potential for expansion in these underserved areas.
        </p>
      </div>
      
      <div>
        <h4 className="font-semibold mb-3">Market Size</h4>
        <p className="text-sm text-gray-600 mb-4">USD million</p>
        
        {/* Market Size Chart Placeholder */}
        <div className="flex items-end space-x-2 h-32 mb-6">
          {[25000, 26000, 27040, 28141, 29268, 30463, 31727].map((value, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="bg-blue-500 w-12 rounded-t"
                style={{ height: `${(value / 32000) * 100}px` }}
              ></div>
              <div className="text-xs mt-2 text-gray-600">
                {2022 + index}
              </div>
              <div className="text-xs text-gray-600">
                ${value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Market Trends</h4>
        <p className="text-gray-700 leading-relaxed">
          The following trends drive the growth in the Restaurant market. REST is well positioned to capitalize on...
        </p>
      </div>
    </div>
  </section>
);

const FinancialPlanSection: React.FC = () => (
  <section>
    <h2 className="text-3xl font-bold text-blue-600 mb-6">Financial Plan</h2>
    
    {/* Revenue and Profits Chart */}
    <div className="bg-white border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold">Revenue And Profits</h4>
        <div className="text-sm text-gray-500">May 25 - Apr 26 $ Thousands</div>
      </div>
      {/* Chart placeholder */}
      <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
        <p className="text-gray-500">Revenue and Profit Chart</p>
      </div>
    </div>

    {/* Margins Chart */}
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold">Margins</h4>
        <div className="text-sm text-gray-500">May 25 - Apr 26 %</div>
      </div>
      {/* Chart placeholder */}
      <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
        <p className="text-gray-500">Margins Chart</p>
      </div>
    </div>
  </section>
);

const ProfitLossSection: React.FC = () => (
  <section>
    <h2 className="text-3xl font-bold text-blue-600 mb-6">Profit & Loss</h2>
    
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-3 text-left">Profit & Loss statement</th>
            <th className="border border-gray-300 p-3 text-center">2025F</th>
            <th className="border border-gray-300 p-3 text-center">2026F</th>
            <th className="border border-gray-300 p-3 text-center">2027F</th>
          </tr>
        </thead>
        <tbody>
          {[
            { label: 'Revenue', values: ['$ 0', '$ 0', '$ 0'] },
            { label: 'Revenue Growth', values: ['0 %', '0 %', '0 %'] },
            { label: 'Cost of Goods Sold', values: ['$ 0', '$ 0', '$ 0'] },
            { label: 'Direct costs', values: ['$ 0', '$ 0', '$ 0'] },
            { label: 'Gross Profit', values: ['$ 0', '$ 0', '$ 0'] },
            { label: 'Gross Profit Margin', values: ['0 %', '0 %', '0 %'] },
            { label: 'Operating Expenses', values: ['$ 0', '$ 0', '$ 0'] },
            { label: 'Personnel Expenses', values: ['$ 0', '$ 0', '$ 0'] },
            { label: 'EBITDA', values: ['$ 0', '$ 0', '$ 0'] },
          ].map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border border-gray-300 p-3 font-medium">{row.label}</td>
              {row.values.map((value, i) => (
                <td key={i} className="border border-gray-300 p-3 text-center">{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

const ExecutiveSummarySection: React.FC = () => (
  <section>
    <h2 className="text-3xl font-bold text-blue-600 mb-6">Executive Summary</h2>
    
    <div className="space-y-6">
      <div>
        <p className="text-gray-700 leading-relaxed">
          At REST, we are proud to be a restaurant serving the rural community, where we focus on delivering an 
          exceptional dining experience that emphasizes our value proposition. We prioritize locally sourced 
          ingredients to ensure freshness and quality, creating dishes that celebrate the region's produce and 
          flavors. Our inviting ambiance is characterized by unique décor and thematic elements that enhance 
          the dining experience, making it a memorable outing for our guests. Moreover, we are committed to 
          sustainable practices that resonate with environmentally conscious diners, positioning REST as a 
          responsible choice in the culinary landscape.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3 text-blue-600">Opportunity</h3>
        <p className="text-gray-700 leading-relaxed">
          Our target customers currently face challenges such as long wait times for seating or food, alongside 
          overpriced menu items that do not meet their expectations for value. To address these issues, REST 
          will implement a reservation system with estimated wait times and an app allowing customers to check 
          waitlists in real-time, coupled with a value menu featuring smaller portion options and regular 
          promotional offerings to enhance affordability.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-blue-600">Target Market</h3>
        <p className="text-gray-700 leading-relaxed">
          REST targets the restaurant market in rural areas, aiming to serve communities that may have limited 
          dining options. Last year, the combined market size for rural restaurants in the United States was 
          estimated to be approximately $25 billion. Over the next five years, this market size is projected to 
          grow to around $30 billion, reflecting increasing interest in dining experiences outside urban centers. 
          The expected annual growth rate for the rural restaurant market is anticipated to be around 4% 
          annually, indicating steady development and potential for expansion in these underserved areas. This 
          market growth is driven by trends such as the growth of delivery and takeout services, the rise of food 
          trucks and pop-up restaurants, a focus on health-conscious menu options, and collaborations with 
          local farms and artisans.
        </p>
      </div>
    </div>
  </section>
);

export default BusinessPlanPreview; 