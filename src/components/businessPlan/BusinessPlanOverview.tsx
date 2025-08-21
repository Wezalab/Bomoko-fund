import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectUser, setUser, setToken, initialState } from '@/redux/slices/userSlice';
import { ProjectInitialState, setProject } from '@/redux/slices/projectSlice';
import { useTranslation } from '@/lib/TranslationContext';
import { 
  ChevronLeft,
  ChevronDown,
  CheckCircle,
  Circle,
  Lock,
  Home,
  Users,
  Settings,
  User,
  Building,
  LogOut,
  Crown,
  Bell,
  FileText,
  DollarSign,
  BarChart3,
  Target,
  Lightbulb,
  TrendingUp,
  HelpCircle,
  Archive,
  Clipboard,
  Youtube,
  Facebook,
  Linkedin,
  Instagram
} from 'lucide-react';
import profileImage from '../../assets/profileImage.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ExtendedUser {
  _id: string;
  name?: string;
  gender?: "M" | "F" | "OTHER";
  avatar?: string;
  bio?: string;
  location?: string;
  email: string;
  phone_number?: string;
  phone?: string;
  type?: "INDIVIDUAL" | "ENTREPRISE" | "DONATOR" | "ENTREPRENEUR";
  isGoogleUser?: boolean;
  isStillRegistering?: boolean;
  isDeactivated?: boolean;
  deactivateReason?: string;
  googleId?: string | null;
  updatedAt?: string;
  profile?: string;
  projects?: any[];
  cryptoWallet?: any[];
}

interface BusinessPlanItem {
  id: string;
  title: string;
  completed: boolean;
}

interface BusinessPlanSection {
  id: string;
  title: string;
  description: string;
  items: BusinessPlanItem[];
  completed: boolean;
  locked: boolean;
  color: 'teal' | 'blue' | 'yellow' | 'red' | 'green';
  bgColor: string;
  borderColor: string;
}

const BusinessPlanOverview: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser) as ExtendedUser;
  const { t } = useTranslation();

  // Mock state for business plan progress - in real app this would come from API/Redux
  const [initialSetupCompleted, setInitialSetupCompleted] = useState(false);
  const [sections, setSections] = useState<BusinessPlanSection[]>([
    {
      id: 'business-description',
      title: t('businessDescription') || 'Business Description',
      description: t('businessDescriptionDesc') || 'Define your business concept, products, and services',
      completed: false,
      locked: !initialSetupCompleted,
      color: 'teal',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      items: [
        { id: 'overview', title: t('overview') || 'Overview', completed: false },
        { id: 'business-objectives', title: t('businessObjectives') || 'Business Objectives', completed: false },
        { id: 'mission-vision-values', title: t('missionVisionValues') || 'Mission, Vision & Values', completed: false },
        { id: 'keys-to-success', title: t('keysToSuccess') || 'Keys to Success', completed: false },
        { id: 'intellectual-property', title: t('intellectualProperty') || 'Intellectual Property', completed: false },
        { id: 'products-services', title: t('productsServices') || 'Products & Services', completed: false }
      ]
    },
    {
      id: 'situation-analysis',
      title: t('situationAnalysis') || 'Situation Analysis',
      description: t('situationAnalysisDesc') || 'Analyze market conditions and competitive landscape',
      completed: false,
      locked: !initialSetupCompleted,
      color: 'teal',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      items: [
        { id: 'products-services-analysis', title: t('productsServicesAnalysis') || 'Products & Services', completed: false },
        { id: 'market-segments', title: t('marketSegments') || 'Market Segments', completed: false },
        { id: 'industry-analysis', title: t('industryAnalysis') || 'Industry Analysis', completed: false },
        { id: 'swot-analysis', title: t('swotAnalysis') || 'SWOT Analysis', completed: false },
        { id: 'competitive-analysis', title: t('competitiveAnalysis') || 'Competitive Analysis', completed: false }
      ]
    },
    {
      id: 'objectives',
      title: t('objectives') || 'Objectives',
      description: t('objectivesDesc') || 'Set clear business goals and milestones',
      completed: false,
      locked: !initialSetupCompleted,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      items: [
        { id: 'corporate-objectives', title: t('corporateObjectives') || 'Corporate Objectives', completed: false }
      ]
    },
    {
      id: 'business-strategy',
      title: t('businessStrategy') || 'Business Strategy',
      description: t('businessStrategyDesc') || 'Outline your strategic approach and tactics',
      completed: false,
      locked: !initialSetupCompleted,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      items: [
        { id: 'strategic-directions', title: t('strategicDirections') || 'Strategic Directions', completed: false },
        { id: 'marketing-strategy', title: t('marketingStrategy') || 'Marketing Strategy', completed: false },
        { id: 'operations-strategy', title: t('operationsStrategy') || 'Operations Strategy', completed: false },
        { id: 'human-resources-strategy', title: t('humanResourcesStrategy') || 'Human Resources Strategy', completed: false },
        { id: 'financial-strategy', title: t('financialStrategy') || 'Financial Strategy', completed: false },
        { id: 'technology-strategy', title: t('technologyStrategy') || 'Technology Strategy', completed: false }
      ]
    },
    {
      id: 'funding',
      title: t('funding') || 'Funding',
      description: t('fundingDesc') || 'Detail funding requirements and sources',
      completed: false,
      locked: !initialSetupCompleted,
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      items: [
        { id: 'funding-overview', title: t('fundingOverview') || 'Funding Overview', completed: false },
        { id: 'funding-request', title: t('fundingRequest') || 'Funding Request', completed: false }
      ]
    },
    {
      id: 'financial-projections',
      title: t('financialProjections') || 'Financial Projections',
      description: t('financialProjectionsDesc') || 'Create financial forecasts and projections',
      completed: false,
      locked: !initialSetupCompleted,
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      items: [
        { id: 'profit-loss-projection', title: t('profitLossProjection') || 'Profit & Loss Projection', completed: false },
        { id: 'cash-flow-projection', title: t('cashFlowProjection') || 'Cash Flow Projection', completed: false },
        { id: 'balance-sheet-projection', title: t('balanceSheetProjection') || 'Balance Sheet Projection', completed: false },
        { id: 'break-even-analysis', title: t('breakEvenAnalysis') || 'Break-even Analysis', completed: false },
        { id: 'ratio-analysis', title: t('ratioAnalysis') || 'Ratio Analysis', completed: false },
        { id: 'sales-forecast', title: t('salesForecast') || 'Sales Forecast', completed: false },
        { id: 'personnel-plan', title: t('personnelPlan') || 'Personnel Plan', completed: false }
      ]
    },
    {
      id: 'executive-summary',
      title: t('executiveSummary') || 'Executive Summary',
      description: t('executiveSummaryDesc') || 'Summarize your complete business plan',
      completed: false,
      locked: !initialSetupCompleted,
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      items: [
        { id: 'executive-summary-content', title: t('executiveSummaryContent') || 'Executive Summary', completed: false }
      ]
    }
  ]);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/');
    dispatch(setUser(initialState.user));
    dispatch(setToken(initialState.token));
    dispatch(setProject(ProjectInitialState.project));
  };

  const handleSectionClick = (section: BusinessPlanSection) => {
    if (section.locked) {
      // Show message that initial setup is required
      return;
    }
    // Navigate to section editor
    navigate(`/business-plan/section/${section.id}`);
  };

  const handleInitialSetup = () => {
    navigate('/business-plan/initial-setup');
  };

  // Function to handle Google profile image URLs
  const getOptimizedImageUrl = (url: string) => {
    if (!url) return profileImage;
    
    if (url.includes('googleusercontent.com')) {
      return url.replace(/=s\d+-c/, '=s200-c').replace(/\/photo\.jpg$/, '');
    }
    
    return url;
  };

  // Use user's profile picture from Redux if available
  let userAvatar = profileImage;
  
  if (user?.profile) {
    userAvatar = getOptimizedImageUrl(user.profile);
  } else if (user?.avatar) {
    userAvatar = getOptimizedImageUrl(user.avatar);
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = profileImage;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar - Matching Design */}
      <div className="w-16 bg-teal-700 text-white flex flex-col items-center py-4">
        {/* Logo Section */}
        <div className="mb-8">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-teal-700" />
          </div>
        </div>

        {/* Navigation Icons */}
        <nav className="flex flex-col space-y-4">
          <button
            onClick={() => handleNavigation('/dashboard')}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-teal-600 transition-colors"
          >
            <Home className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => handleNavigation('/business-plan/wizard')}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-teal-600 text-white"
          >
            <FileText className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => handleNavigation('/support')}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-teal-600 transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => handleNavigation('/users')}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-teal-600 transition-colors"
          >
            <Users className="w-5 h-5" />
          </button>
        </nav>

        {/* Bottom Icon */}
        <div className="mt-auto">
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-gray-800" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-xl font-bold text-dark">{t('businessPlanOverview') || 'Business Plan Overview'}</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Business Settings Section */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{t('businessSettings') || 'Business Settings'}</span>
                <button 
                  onClick={handleInitialSetup}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                >
                  {t('initialSetup') || 'Initial Setup'}
                  <br />
                  <span className="text-xs opacity-90">{t('businessPlanAug25') || 'Business Plan Aug 25'}</span>
                </button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-2 cursor-pointer">
                    <span className="text-sm font-medium">{t('bomokoFund') || 'Bomoko Fund'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>{t('settings') || 'Settings'}</DropdownMenuItem>
                    <DropdownMenuItem>{t('switchBusiness') || 'Switch Business'}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <span className="text-sm text-gray-600">{t('startHere') || 'Start Here'}</span>
              </div>

              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-2 cursor-pointer">
                    <img 
                      src={userAvatar} 
                      alt="User Avatar" 
                      className="w-8 h-8 rounded-full object-cover"
                      onError={handleImageError}
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                    />
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => handleNavigation('/profile')}>
                        <User className="w-4 h-4 mr-2" />
                        <span>{t('profile') || 'Profile'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleNavigation('/settings')}>
                        <Settings className="w-4 h-4 mr-2" />
                        <span>{t('settings') || 'Settings'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2 text-red-600" />
                        <span className="text-red-600">{t('logout') || 'Logout'}</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-8">
          {/* Progress Indicators */}
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">{t('businessReadiness') || 'Business readiness'}</div>
              <div className="text-lg font-semibold text-gray-900">{t('high') || 'High'}</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full w-4/5"></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">{t('complexityLevel') || 'Complexity level'}</div>
              <div className="text-lg font-semibold text-gray-900">{t('low') || 'Low'}</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-600 h-2 rounded-full w-1/3"></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">{t('estTime') || 'Est. Time (Hours)'}</div>
              <div className="text-lg font-semibold text-gray-900">5</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-yellow-600 h-2 rounded-full w-2/5"></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">{t('businessPlan') || 'Business plan'}</div>
              <div className="text-lg font-semibold text-gray-900">{t('basic') || 'Basic'}</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-purple-600 h-2 rounded-full w-3/5"></div>
              </div>
            </div>
          </div>

          {/* Business Plan Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={section.id} className="relative">
                {/* Section Header */}
                <div className="flex items-start mb-4">
                  <div className="w-40 text-left pr-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">{section.title}</h3>
                  </div>
                  
                  {/* Section Items */}
                  <div className="flex-1 space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <div
                        key={item.id}
                        className={`flex items-center p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          section.locked 
                            ? 'opacity-50 cursor-not-allowed bg-gray-100 border-gray-200' 
                            : `${section.bgColor} ${section.borderColor} hover:shadow-md`
                        }`}
                        onClick={() => !section.locked && handleSectionClick(section)}
                      >
                        {/* Item Number */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-4 ${
                          section.locked 
                            ? 'bg-gray-400' 
                            : item.completed 
                            ? 'bg-green-500' 
                            : section.color === 'teal' 
                            ? 'bg-teal-500' 
                            : section.color === 'blue' 
                            ? 'bg-blue-500' 
                            : section.color === 'yellow' 
                            ? 'bg-yellow-500' 
                            : section.color === 'red' 
                            ? 'bg-red-500' 
                            : 'bg-green-500'
                        }`}>
                          {itemIndex + 1 + (sections.slice(0, index).reduce((acc, s) => acc + s.items.length, 0))}
                        </div>
                        
                        {/* Item Title */}
                        <div className="flex-1">
                          <span className="text-gray-800 font-medium">{item.title}</span>
                        </div>
                        
                        {/* Status Indicator */}
                        <div className="flex items-center">
                          {section.locked ? (
                            <Lock className="w-5 h-5 text-gray-400" />
                          ) : item.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Section Progress Indicator */}
                  <div className="ml-8 text-center">
                    <div className={`text-3xl font-bold ${
                      section.color === 'teal' ? 'text-teal-600' :
                      section.color === 'blue' ? 'text-blue-600' :
                      section.color === 'yellow' ? 'text-yellow-600' :
                      section.color === 'red' ? 'text-red-600' :
                      'text-green-600'
                    }`}>
                      {section.items.length}
                    </div>
                  </div>
                </div>

                {/* Special notice for Business Strategy */}
                {section.id === 'business-strategy' && !initialSetupCompleted && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <div className="bg-yellow-100 border-2 border-yellow-300 rounded-lg p-6 max-w-md text-center shadow-lg">
                      <div className="text-yellow-800 font-bold text-lg mb-2">{t('important') || 'Important'}</div>
                      <p className="text-sm text-yellow-700 mb-4">
                        {t('initialSetupRequired') || 'To get started, please complete the Initial Setup Questionnaire. This will tailor the chapters and sections to your specific business model and plan requirements.'}
                      </p>
                      <p className="text-xs text-yellow-600 mb-4">
                        {t('updateAnytime') || 'You can update this information at any time.'}
                      </p>
                      <button
                        onClick={handleInitialSetup}
                        className="bg-yellow-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
                      >
                        {t('startInitialSetup') || 'Start Initial Setup'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Upgrade Banner */}
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 rounded-lg p-6 text-white mt-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">🚀</div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{t('upgradeToday') || 'Upgrade Today'}</h3>
                  <h4 className="text-lg font-semibold">{t('unlockAllFeatures') || 'Unlock All Features'}</h4>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-8 text-sm">
                <div className="space-y-1">
                  <div className="font-semibold">{t('multipleBusinesses') || 'Multiple Businesses'}</div>
                  <div className="font-semibold">{t('teamCollaboration') || 'Team Collaboration'}</div>
                  <div className="font-semibold">{t('financialScenarios') || 'Financial Scenarios'}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold">{t('multiplePlans') || 'Multiple Plans'}</div>
                  <div className="font-semibold">{t('downloadPlans') || 'Download Plans'}</div>
                  <div className="font-semibold">{t('moreAiQueries') || 'More AI Queries'}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold">{t('projectManagement') || 'Project Management'}</div>
                  <div className="font-semibold">{t('aiAssistant') || 'AI Assistant'}</div>
                  <div className="font-semibold">{t('planThemes') || 'Plan Themes'}</div>
                </div>
              </div>
              <ChevronLeft className="w-6 h-6 rotate-180" />
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-12 space-y-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex space-x-3">
                <button className="text-gray-600 hover:text-red-600 transition-colors">
                  <Youtube className="w-5 h-5" />
                </button>
                <button className="text-gray-600 hover:text-blue-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="text-gray-600 hover:text-blue-700 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </button>
                <button className="text-gray-600 hover:text-pink-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-teal-600 rounded text-white flex items-center justify-center font-bold">
                  B
                </div>
                <span className="text-xl font-bold text-gray-900">{t('bomokoFund') || 'BOMOKO FUND'}</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{t('beUnstoppable') || 'Be Unstoppable.'}</p>
                <p className="text-gray-600 text-sm">{t('aiDrivenPlanning') || 'AI-Driven Planning'}</p>
              </div>
            </div>
            
            <div className="space-y-1 text-sm text-gray-600">
              <p>{t('freeTrialMessage') || 'You are on our Free Trial with limited functionality.'}</p>
              <p>{t('craftingStrategies') || 'Crafting strategies to make entrepreneurs unstoppable.'}</p>
            </div>
            
            <div className="text-sm text-gray-500">
              {t('findUsOnSocialMedia') || 'Find us on Social Media'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPlanOverview;
