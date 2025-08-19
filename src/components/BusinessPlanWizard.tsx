import React, { useState, useEffect } from 'react';
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
      text: t('q1_text'),
      subText: t('q1_subText'),
      type: 'radio',
      options: [t('yes'), t('no')],
      required: true
    },
    {
      id: 'established_anticipated',
      number: 'Q2',
      text: t('q2_text'),
      subText: t('q2_subText'),
      type: 'dropdown',
      options: ['2024', '2025', '2026', '2027', '2028'],
      required: false
    },
    {
      id: 'plan_type',
      number: 'Q3',
      text: t('q3_text'),
      subText: t('q3_subText'),
      type: 'radio',
      options: [t('fullBusinessPlan'), t('basicBusinessPlan')],
      required: true
    },
    {
      id: 'structure',
      number: 'Q4',
      text: t('q4_text'),
      subText: t('q4_subText'),
      type: 'radio',
      options: [t('soleProprietorship'), t('partnership'), t('llp'), t('trust'), t('corporation'), t('nonprofit')],
      required: true
    },
    {
      id: 'staff',
      number: 'Q5',
      text: t('q5_text'),
      subText: t('q5_subText'),
      type: 'radio',
      options: [t('yes'), t('no')],
      required: true
    },
    {
      id: 'staff_future',
      number: 'Q6',
      text: t('q6_text'),
      subText: t('q6_subText'),
      type: 'radio',
      options: [t('yes'), t('no')],
      required: false
    },
    {
      id: 'location',
      number: 'Q7',
      text: t('q7_text'),
      subText: t('q7_subText'),
      type: 'text',
      required: false
    },
    {
      id: 'area_served',
      number: 'Q8',
      text: t('q8_text'),
      subText: t('q8_subText'),
      type: 'radio',
      options: [t('localArea'), t('national'), t('international'), t('other')],
      required: false
    },
    {
      id: 'products_yn',
      number: 'Q9',
      text: t('q9_text'),
      subText: t('q9_subText'),
      type: 'radio',
      options: [t('yes'), t('no')],
      required: false
    },
    {
      id: 'services_yn',
      number: 'Q10',
      text: t('q10_text'),
      subText: t('q10_subText'),
      type: 'radio',
      options: [t('yes'), t('no')],
      required: false
    },
    {
      id: 'proprietary_IP',
      number: 'Q11',
      text: t('q11_text'),
      subText: t('q11_subText'),
      type: 'radio',
      options: [t('yes'), t('no')],
      required: false
    },
    {
      id: 'financial_model_required_yn',
      number: 'Q12',
      text: t('q12_text'),
      subText: t('q12_subText'),
      type: 'radio',
      options: [t('no'), t('yes')],
      required: false
    },
    {
      id: 'finance_required',
      number: 'Q13',
      text: t('q13_text'),
      subText: t('q13_subText'),
      type: 'radio',
      options: [t('yes'), t('no')],
      required: false
    },
    {
      id: 'exit_planned',
      number: 'Q14',
      text: t('q14_text'),
      subText: t('q14_subText'),
      type: 'radio',
      options: [t('yes'), t('no')],
      required: false
    },
    {
      id: 'tone',
      number: 'Q15',
      text: t('q15_text'),
      subText: t('q15_subText'),
      type: 'slider',
      required: false
    }
  ];

  // Helper function to check if a question should be shown based on previous answers
  const shouldShowQuestion = (questionIndex: number): boolean => {
    const question = questions[questionIndex];
    
    // Q2: Only show if Q1 answer is "No"
    if (question.id === 'established_anticipated') {
      return formData['established_yn'] === t('no');
    }
    
    // Q6: Only show if Q5 answer is "No"  
    if (question.id === 'staff_future') {
      return formData['staff'] === t('no');
    }
    
    return true; // Show all other questions
  };

  // Get the next valid question index
  const getNextValidStep = (currentIndex: number): number => {
    for (let i = currentIndex + 1; i < questions.length; i++) {
      if (shouldShowQuestion(i)) {
        return i;
      }
    }
    return questions.length - 1; // If no valid next question, go to last
  };

  // Get the previous valid question index
  const getPreviousValidStep = (currentIndex: number): number => {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (shouldShowQuestion(i)) {
        return i;
      }
    }
    return 0; // If no valid previous question, go to first
  };

  // Calculate completion percentage based on visible questions only
  const visibleQuestions = questions.filter((_, index) => shouldShowQuestion(index));
  const completedVisibleQuestions = visibleQuestions.filter(q => formData[q.id] !== undefined && formData[q.id] !== '').length;
  const completionPercentage = Math.round((completedVisibleQuestions / visibleQuestions.length) * 100);

  const handleInputChange = (questionId: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    const nextStep = getNextValidStep(currentStep);
    if (nextStep > currentStep) {
      setCurrentStep(nextStep);
    }
  };

  const handlePrev = () => {
    const prevStep = getPreviousValidStep(currentStep);
    if (prevStep < currentStep) {
      setCurrentStep(prevStep);
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

  // Auto-navigate to valid question if current question becomes hidden
  useEffect(() => {
    if (!shouldShowQuestion(currentStep)) {
      // Find the nearest valid question
      const nextValid = getNextValidStep(currentStep - 1);
      const prevValid = getPreviousValidStep(currentStep + 1);
      
      // Choose the closer one, or go to next if equal distance
      if (nextValid < questions.length && (prevValid === 0 || (currentStep - prevValid) > (nextValid - currentStep))) {
        setCurrentStep(nextValid);
      } else if (prevValid >= 0) {
        setCurrentStep(prevValid);
      } else {
        // Fallback to first question
        setCurrentStep(0);
      }
    }
  }, [formData, currentStep]);

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
            // onClick={() => handleNavigation('/business-plan')}
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
                    {questions.slice(0, 15).filter((_, index) => shouldShowQuestion(index)).map((question, visibleIndex) => {
                      const originalIndex = questions.findIndex(q => q.id === question.id);
                      return (
                        <button
                          key={question.id}
                          onClick={() => setCurrentStep(originalIndex)}
                          className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-sm font-semibold transition-all ${
                            originalIndex === currentStep
                              ? 'bg-lightBlue text-white border-lightBlue'
                              : formData[question.id] !== undefined && formData[question.id] !== ''
                              ? 'bg-lightBlue/20 text-lightBlue border-lightBlue'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {question.number.replace('Q', '')}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Question List */}
                  <div className="max-h-96 overflow-y-auto space-y-2 mb-6">
                    {questions.filter((_, index) => shouldShowQuestion(index)).map((question, visibleIndex) => {
                      const originalIndex = questions.findIndex(q => q.id === question.id);
                      return (
                        <div
                          key={question.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            originalIndex === currentStep
                              ? 'bg-lightBlue/10 border-lightBlue'
                              : formData[question.id] !== undefined && formData[question.id] !== ''
                              ? 'bg-lightBlue/5 border-lightBlue/20'
                              : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setCurrentStep(originalIndex)}
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
                      );
                    })}
                  </div>
                  
                  {/* Stats */}
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-dark">{visibleQuestions.length}</div>
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