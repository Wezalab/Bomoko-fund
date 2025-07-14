import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectUser, setUser, setToken, initialState } from '@/redux/slices/userSlice';
import { ProjectInitialState, setProject } from '@/redux/slices/projectSlice';
import { 
  Home, 
  Edit, 
  Eye, 
  DollarSign, 
  Users, 
  Settings, 
  User,
  ArrowUpRight,
  Crown,
  Trash2,
  Plus,
  Building,
  FileText,
  MapPin,
  Calendar,
  HelpCircle,
  Mail,
  UserCheck,
  Youtube,
  Facebook,
  Linkedin,
  Instagram,
  Lock,
  ChevronDown,
  Bell,
  LogOut,
  ChevronLeft,
  X
} from 'lucide-react';
import profileImage from '../assets/profileImage.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/lib/TranslationContext';

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

interface Question {
  id: string;
  number: string;
  text: string;
  subText?: string;
  type: 'radio' | 'dropdown' | 'text' | 'slider' | 'checkbox';
  options?: string[];
  required?: boolean;
  completed?: boolean;
}

interface FormData {
  [key: string]: string | number;
}

const BusinessPlanWizard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser) as ExtendedUser;
  const { t } = useTranslation();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [showMobileSteps, setShowMobileSteps] = useState(false);

  const questions: Question[] = [
    {
      id: 'established_yn',
      number: 'Q1',
      text: 'Have steps been taken to establish the business?',
      subText: 'If any operational steps have been taken, such as engaging employees, establishing a bank account, or completing registrations with relevant authorities, please select \'Yes\'.',
      type: 'radio',
      options: ['Yes', 'No'],
      required: true
    },
    {
      id: 'established_anticipated',
      number: 'Q2',
      text: 'When are you planning to establish the business?',
      subText: 'This could be the date that you plan to start hiring staff or the date that you plan to form or incorporate the business. You can skip the question if you are unsure of this.',
      type: 'dropdown',
      options: ['2024', '2025', '2026', '2027', '2028'],
      required: false
    },
    {
      id: 'plan_type',
      number: 'Q3',
      text: 'What type of plan would you like to create?',
      subText: 'Our Full Business Plan is comprehensive, covering all aspects of your business, making it ideal for those seeking to understand and document every aspect of their new venture. The Basic Business Plan is designed for those needing a quick, simple plan.',
      type: 'radio',
      options: ['Full Business Plan', 'Basic Business Plan'],
      required: true
    },
    {
      id: 'structure',
      number: 'Q4',
      text: 'How will the business be structured legally?',
      subText: 'If the business is yet to be established, please select the structure that is most likely to apply.',
      type: 'radio',
      options: ['Sole Proprietorship', 'Partnership', 'Limited Liability Partnership', 'Trust', 'Corporation / Company', 'Nonprofit'],
      required: true
    },
    {
      id: 'staff',
      number: 'Q5',
      text: 'Apart from you, will there be any other individuals employed or contracted to work in the business?',
      subText: 'If you plan to hire staff to work within the business (employed, self-employed, volunteer or otherwise), answer yes to this question.',
      type: 'radio',
      options: ['Yes', 'No'],
      required: true
    },
    {
      id: 'staff_future',
      number: 'Q6',
      text: 'Will this change in the short to medium term?',
      subText: 'Answer \'Yes\' to this question if you plan to hire any staff within the business in the foreseeable future (employed, self-employed, volunteer or otherwise).',
      type: 'radio',
      options: ['Yes', 'No'],
      required: false
    },
    {
      id: 'location',
      number: 'Q7',
      text: 'In what town / city will the business be located?',
      subText: 'If the business will operate from multiple locations enter the location of the head office or primary operational site.',
      type: 'text',
      required: false
    },
    {
      id: 'area_served',
      number: 'Q8',
      text: 'What will be the primary operational area for the business?',
      subText: 'Identifying the main operational area for the business is crucial for tailoring marketing strategies effectively, allocating resources efficiently and setting realistic goals for market penetration and growth.',
      type: 'radio',
      options: ['Local Area', 'National', 'International', 'Other'],
      required: false
    },
    {
      id: 'products_yn',
      number: 'Q9',
      text: 'Will the business distribute, sell or resell any products?',
      subText: 'For the purpose of this business plan we differentiate between products and services. As a rule if you sell something and it isn\'t a service, it will fall within the \'products\' definition.',
      type: 'radio',
      options: ['Yes', 'No'],
      required: false
    },
    {
      id: 'services_yn',
      number: 'Q10',
      text: 'Will the business provide any services?',
      subText: 'Generally a service could be classified as an act, performance or use that a consumer is willing to pay for. Examples include work done by tradesmen, lawyers, mechanics, insurance companies, and so on.',
      type: 'radio',
      options: ['Yes', 'No'],
      required: false
    },
    {
      id: 'proprietary_IP',
      number: 'Q11',
      text: 'Will the company own any inventions, digital assets, discoveries, trade secrets or similar?',
      subText: 'This question is asking if the company has any intellectual property or unique assets. This could include inventions or discoveries, digital assets such as software or databases, trade secrets which are confidential pieces of information that give the company a competitive edge, or anything similar.',
      type: 'radio',
      options: ['Yes', 'No'],
      required: false
    },
    {
      id: 'financial_model_required_yn',
      number: 'Q12',
      text: 'Do you want to include financial projections in your business plan?',
      subText: 'Most business plans contain a forecast of the company\'s future financial performance, including revenue, expenses, and profitability. These projections help investors, lenders, and stakeholders assess the viability and potential profitability of the business.',
      type: 'radio',
      options: ['No', 'Yes'],
      required: false
    },
    {
      id: 'finance_required',
      number: 'Q13',
      text: 'Do you plan to raise finance to support the growth of your business?',
      subText: 'Answering yes to this question will create a chapter that will allow you to add details of any capital raising requirements / plans. This could include Bank loans; Peer-to-peer funding; Venture capital or Crowdfunding for example.',
      type: 'radio',
      options: ['Yes', 'No'],
      required: false
    },
    {
      id: 'exit_planned',
      number: 'Q14',
      text: 'Do you have plans to exit the business and if so would you like to include details of your exit strategy in your business plan?',
      subText: 'An exit strategy is a plan for wrapping up your involvement in a business. For most people, that means readying the business for a change of owner.',
      type: 'radio',
      options: ['Yes', 'No'],
      required: false
    },
    {
      id: 'tone',
      number: 'Q15',
      text: 'What writing style or tone would you prefer for the business plan?',
      subText: 'The style and tone of your plan can impact how your business is viewed and can influence the decision-making of potential investors or partners. Generally, business plans should maintain a professional and formal tone.',
      type: 'slider',
      required: false
    }
  ];

  const completedQuestions = questions.filter(q => formData[q.id] !== undefined && formData[q.id] !== '').length;
  const completionPercentage = Math.round((completedQuestions / questions.length) * 100);

  const handleInputChange = (questionId: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    // Handle form submission
    console.log('Form Data:', formData);
    navigate('/dashboard');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/');
    dispatch(setUser(initialState.user));
    dispatch(setToken(initialState.token));
    dispatch(setProject(ProjectInitialState.project));
  };

  // Function to handle Google profile image URLs
  const getOptimizedImageUrl = (url: string) => {
    if (!url) return profileImage;
    
    // If it's a Google profile image, ensure it's high quality and accessible
    if (url.includes('googleusercontent.com')) {
      // Remove size restrictions and ensure we get a good quality image
      return url.replace(/=s\d+-c/, '=s200-c').replace(/\/photo\.jpg$/, '');
    }
    
    return url;
  };

  // Use user's profile picture from Redux if available, otherwise use default profile image
  let userAvatar = profileImage;
  
  if (user?.profile) {
    userAvatar = getOptimizedImageUrl(user.profile);
  } else if (user?.avatar) {
    userAvatar = getOptimizedImageUrl(user.avatar);
  }

  // Function to handle image load errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log("[DEBUG] Avatar image failed to load, using fallback");
    console.log("[DEBUG] Failed image src:", e.currentTarget.src);
    e.currentTarget.src = profileImage;
  };

  const renderQuestionInput = (question: Question) => {
    switch (question.type) {
      case 'radio':
        return (
          <div className="radio-options w-100">
            {question.options?.map((option, index) => (
              <label key={index} className={`radio ${formData[question.id] === option ? 'active' : ''}`}>
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={formData[question.id] === option}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  className="hidden"
                />
                <div>{option}</div>
              </label>
            ))}
          </div>
        );
      
      case 'dropdown':
        return (
          <select
            className="form-control"
            value={formData[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
          >
            <option value="">Please Select</option>
            {question.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'text':
        return (
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Birmingham"
            value={formData[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
          />
        );
      
      case 'slider':
        return (
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              className="slider"
              value={formData[question.id] || 2}
              onChange={(e) => handleInputChange(question.id, parseInt(e.target.value))}
            />
            <div className="slider-labels">
              <small>Casual</small>
              <small>Formal</small>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const currentQuestion = questions[currentStep];

  return (
    <div className="business-plan-wizard min-h-screen bg-gradient-to-br from-lightGreen/20 to-lightBlue/20 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-gradient-to-b from-[#02093d] to-[#0a1854] text-white flex flex-col">
        {/* Logo Section */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded text-[#02093d] flex items-center justify-center font-bold">
              B
            </div>
            <span className="text-xl font-bold text-white">BOMOKO FUND</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <button
            onClick={() => handleNavigation('/dashboard')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/10 text-gray-200 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">{t('Home')}</span>
          </button>
          
          <button
            onClick={() => handleNavigation('/business-plan-editor')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/10 text-gray-200 transition-colors"
          >
            <Edit className="w-5 h-5" />
            <span className="font-medium">{t('Edit Plan')}</span>
          </button>
          
          <button
            onClick={() => handleNavigation('/business-plan')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/10 text-gray-200 transition-colors"
          >
            <Eye className="w-5 h-5" />
            <span className="font-medium">{t('View Plan')}</span>
          </button>
          
          <button
            onClick={() => handleNavigation('/business-plan/wizard')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-left bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">{t('Add Plan')}</span>
          </button>
          
          <button
            onClick={() => handleNavigation('/financials')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/10 text-gray-200 transition-colors"
          >
            <DollarSign className="w-5 h-5" />
            <span className="font-medium">{t('Financials')}</span>
          </button>
          
          <button
            onClick={() => handleNavigation('/users')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/10 text-gray-200 transition-colors"
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">{t('Users')}</span>
          </button>
        </nav>

        {/* Upgrade Section */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <Lock className="mx-auto mb-2 h-8 w-8 text-yellow-400" />
            <p className="text-sm text-gray-300 mb-3">
              {t('Upgrade to unlock more features and sections.')}
            </p>
            <button className="w-full bg-yellow text-dark px-4 py-2 rounded-lg font-medium hover:bg-yellow/90 transition-colors">
              <Crown className="w-4 h-4 inline mr-2" />
              {t('Upgrade Now')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-dark">{t('Welcome')} {user?.name || 'User'}</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{t('Home')}</span>
                <span>/</span>
                <span>{t('Add Plan')}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800" />
              
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
                    <span className="font-medium text-dark">{user.name}</span>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                      <DropdownMenuItem className='p-3 cursor-pointer'>
                        <div onClick={() => handleNavigation('/profile')} className='flex items-center space-x-2'>
                          <User className="w-4 h-4" />
                          <span className='text-sm'>{t('Profile')}</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='p-3 cursor-pointer'>
                        <div onClick={() => handleNavigation('/projects')} className='flex items-center space-x-2'>
                          <Building className="w-4 h-4" />
                          <span className='text-sm'>{t('Projects')}</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='p-3 cursor-pointer'>
                        <div onClick={() => handleNavigation('/settings')} className='flex items-center space-x-2'>
                          <Settings className="w-4 h-4" />
                          <span className='text-sm'>{t('Settings')}</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className='p-3 cursor-pointer'>
                        <div onClick={handleLogout} className='flex items-center space-x-2'>
                          <LogOut className="w-4 h-4 text-red-600" />
                          <span className='text-sm text-red-600'>{t('Logout')}</span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        {/* Main Wizard Content */}
        <div className="flex-1 p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Form Content */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold text-dark mb-2">{t('initialPlanSetup')}</h1>
                <p className="text-gray-600 mb-8">{t('answerQuestionsToSetup')}</p>
                
                <div className="question-wrapper">
                  <div className="question mb-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-lightBlue text-white rounded-full flex items-center justify-center mr-3 font-semibold">
                        ✓
                      </div>
                      <h2 className="text-xl font-semibold text-dark">
                        {currentQuestion.text}
                      </h2>
                    </div>
                    
                    {currentQuestion.subText && (
                      <p className="text-gray-600 mb-6" dangerouslySetInnerHTML={{ __html: currentQuestion.subText }} />
                    )}
                    
                    <div className="mb-8">
                      {renderQuestionInput(currentQuestion)}
                    </div>
                  </div>
                </div>
                
                {/* Navigation */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    {t('back')}
                  </button>
                  
                  {currentStep === questions.length - 1 ? (
                    <button
                      onClick={handleFinish}
                      className="px-6 py-2 bg-lightBlue text-white rounded-lg hover:bg-lightBlue/90"
                    >
                      {t('finish')}
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="px-6 py-2 bg-lightBlue text-white rounded-lg hover:bg-lightBlue/90"
                    >
                      {t('next')}
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Sidebar - Question Progress */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                {/* Mobile toggle */}
                <div className="lg:hidden mb-4">
                  <button
                    onClick={() => setShowMobileSteps(!showMobileSteps)}
                    className="w-full p-3 bg-lightBlue text-white rounded-lg"
                  >
                    {completionPercentage}% Complete
                  </button>
                </div>
                
                {/* Progress Grid */}
                <div className={`${showMobileSteps ? 'block' : 'hidden'} lg:block`}>
                  <div className="grid grid-cols-5 gap-2 mb-6">
                    {questions.slice(0, 15).map((question, index) => (
                      <button
                        key={question.id}
                        onClick={() => setCurrentStep(index)}
                        className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-sm font-semibold transition-all ${
                          index === currentStep
                            ? 'bg-lightBlue text-white border-lightBlue'
                            : formData[question.id] !== undefined && formData[question.id] !== ''
                            ? 'bg-lightBlue/20 text-lightBlue border-lightBlue'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {question.number.replace('Q', '')}
                      </button>
                    ))}
                  </div>
                  
                  {/* Question List */}
                  <div className="max-h-96 overflow-y-auto space-y-2 mb-6">
                    {questions.map((question, index) => (
                      <div
                        key={question.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          index === currentStep
                            ? 'bg-lightBlue/10 border-lightBlue'
                            : formData[question.id] !== undefined && formData[question.id] !== ''
                            ? 'bg-lightBlue/5 border-lightBlue/20'
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setCurrentStep(index)}
                      >
                        <div className="flex items-start">
                          <div className="w-6 h-6 bg-lightBlue text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-1">
                            {question.number.replace('Q', '')}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-dark">{question.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Stats */}
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-dark">{questions.length}</div>
                      <div className="text-sm text-gray-600">{t('questions')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-lightBlue">{completionPercentage}%</div>
                      <div className="text-sm text-gray-600">{t('complete')}</div>
                    </div>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPlanWizard; 