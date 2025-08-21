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
  Building,
  FileText,
  Lock,
  ChevronDown,
  LogOut,
  ChevronLeft,
  X,
  Sparkles,
  Loader2
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
import { generateProductGroupSuggestions, generateServiceGroupSuggestions } from '@/lib/groqService';

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
  type: 'radio' | 'dropdown' | 'text' | 'slider' | 'checkbox' | 'month-year' | 'date-or-unknown' | 'product-grouping' | 'service-grouping';
  options?: string[];
  required?: boolean;
  completed?: boolean;
}

interface FormData {
  [key: string]: string | number;
}

interface BusinessPlanWizardProps {
  onComplete?: () => void;
}

const BusinessPlanWizard: React.FC<BusinessPlanWizardProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser) as ExtendedUser;
  const { t } = useTranslation();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [showMobileSteps, setShowMobileSteps] = useState(false);
  
  // Product grouping states
  const [isLoadingProductSuggestions, setIsLoadingProductSuggestions] = useState(false);
  const [productSuggestions, setProductSuggestions] = useState<{
    suggestion1: string[];
    suggestion2: string[];
  } | null>(null);
  const [showAddProductField, setShowAddProductField] = useState(false);
  const [newProductGroup, setNewProductGroup] = useState('');
  const [selectedProductGroups, setSelectedProductGroups] = useState<string[]>([]);

  // Service grouping states
  const [isLoadingServiceSuggestions, setIsLoadingServiceSuggestions] = useState(false);
  const [serviceSuggestions, setServiceSuggestions] = useState<{
    suggestion1: string[];
    suggestion2: string[];
  } | null>(null);
  const [showAddServiceField, setShowAddServiceField] = useState(false);
  const [newServiceGroup, setNewServiceGroup] = useState('');
  const [selectedServiceGroups, setSelectedServiceGroups] = useState<string[]>([]);

  const questions: Question[] = [
    {
      id: 'established_business',
      number: 'Q1',
      text: t('q1_text'),
      subText: t('q1_subText'),
      type: 'radio',
      options: [t('yes'), t('no')],
      required: true
    },
    {
      id: 'business_established_date',
      number: 'Q2',
      text: t('q2_text'),
      subText: t('q2_subText'),
      type: 'month-year',
      required: false
    },
    {
      id: 'business_planned_date',
      number: 'Q3',
      text: t('q3_text'),
      subText: t('q3_subText'),
      type: 'date-or-unknown',
      required: false
    },
    {
      id: 'plan_type',
      number: 'Q4',
      text: t('q4_text'),
      subText: t('q4_subText'),
      type: 'radio',
      options: [t('fullBusinessPlan'), t('basicBusinessPlan')],
      required: true
    },
    {
      id: 'structure',
      number: 'Q5',
      text: t('q5_text'),
      subText: t('q5_subText'),
      type: 'radio',
      options: [t('soleProprietorship'), t('partnership'), t('llp'), t('trust'), t('corporation'), t('nonprofit')],
      required: true
    },
    {
      id: 'staff',
      number: 'Q6',
      text: t('q6_text'),
      subText: t('q6_subText'),
      type: 'radio',
      options: [t('yes'), t('no')],
      required: true
    },
    {
      id: 'staff_future',
      number: 'Q7',
      text: t('q7_text'),
      subText: t('q7_subText'),
      type: 'radio',
      options: [t('yes'), t('no')],
      required: false
    },
    {
      id: 'location',
      number: 'Q8',
      text: t('q8_text'),
      subText: t('q8_subText'),
      type: 'text',
      required: false
    },
    {
      id: 'area_served',
      number: 'Q9',
      text: t('q9_text'),
      subText: t('q9_subText'),
      type: 'radio',
      options: [t('localArea'), t('national'), t('international'), t('other')],
      required: false
    },
    {
      id: 'products_yn',
      number: 'Q10',
      text: t('q10_text'),
      subText: t('q10_subText'),
      type: 'radio',
      options: [t('yes'), t('no')],
      required: false
    },
    {
      id: 'product_grouping',
      number: 'Q11',
      text: t('q17_text'),
      subText: t('q17_subText'),
      type: 'product-grouping',
      required: false
    },
    {
      id: 'services_yn',
      number: 'Q12',
      text: t('q11_text'),
      subText: t('q11_subText'),
      type: 'radio',
      options: [t('yes'), t('no')],
      required: false
    },
    {
      id: 'service_grouping',
      number: 'Q13',
      text: t('q18_text'),
      subText: t('q18_subText'),
      type: 'service-grouping',
      required: false
    },
    {
      id: 'proprietary_IP',
      number: 'Q14',
      text: t('q12_text'),
      subText: t('q12_subText'),
      type: 'radio',
      options: [t('yes'), t('no')],
      required: false
    },
    {
      id: 'financial_model_required_yn',
      number: 'Q15',
      text: t('q13_text'),
      subText: t('q13_subText'),
      type: 'radio',
      options: [t('no'), t('yes')],
      required: false
    },
    {
      id: 'finance_required',
      number: 'Q16',
      text: t('q14_text'),
      subText: t('q14_subText'),
      type: 'radio',
      options: [t('yes'), t('no')],
      required: false
    },
    {
      id: 'exit_planned',
      number: 'Q17',
      text: t('q15_text'),
      subText: t('q15_subText'),
      type: 'radio',
      options: [t('yes'), t('no')],
      required: false
    },
    {
      id: 'tone',
      number: 'Q18',
      text: t('q16_text'),
      subText: t('q16_subText'),
      type: 'slider',
      required: false
    }
  ];

  // Helper function to check if a question should be shown based on previous answers
  const shouldShowQuestion = (questionIndex: number): boolean => {
    const question = questions[questionIndex];
    
    // Q2: Only show if Q1 answer is "Yes" (established business)
    if (question.id === 'business_established_date') {
      return formData['established_business'] === t('yes');
    }
    
    // Q3: Only show if Q1 answer is "No" (not established business)
    if (question.id === 'business_planned_date') {
      return formData['established_business'] === t('no');
    }
    
    // Q7: Only show if Q6 answer is "No"  
    if (question.id === 'staff_future') {
      return formData['staff'] === t('no');
    }
    
    // Q11: Only show if Q10 answer is "Yes" (sells products)
    if (question.id === 'product_grouping') {
      return formData['products_yn'] === t('yes');
    }
    
    // Q13: Only show if Q12 answer is "Yes" (provides services)
    if (question.id === 'service_grouping') {
      return formData['services_yn'] === t('yes');
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

  const generateProductSuggestions = async () => {
    // Get business description from previous wizard or use a generic one
    const businessDescription = formData['business_description'] || 
      localStorage.getItem('businessDescription') || 
      'General business offering products and services';
    
    const businessTypes = formData['business_types'] || 
      JSON.parse(localStorage.getItem('businessTypes') || '[]');
      
    setIsLoadingProductSuggestions(true);
    try {
      const suggestions = await generateProductGroupSuggestions(
      businessDescription.toString(), 
      Array.isArray(businessTypes) ? businessTypes : []
    );
      setProductSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating product suggestions:', error);
    } finally {
      setIsLoadingProductSuggestions(false);
    }
  };

  const generateServiceSuggestions = async () => {
    // Get business description from previous wizard or use a generic one
    const businessDescription = formData['business_description'] || 
      localStorage.getItem('businessDescription') || 
      'General business offering services';
    
    const businessTypes = formData['business_types'] || 
      JSON.parse(localStorage.getItem('businessTypes') || '[]');
      
    setIsLoadingServiceSuggestions(true);
    try {
      const suggestions = await generateServiceGroupSuggestions(
      businessDescription.toString(), 
      Array.isArray(businessTypes) ? businessTypes : []
    );
      setServiceSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating service suggestions:', error);
    } finally {
      setIsLoadingServiceSuggestions(false);
    }
  };

  const selectProductGroup = (group: string) => {
    if (!selectedProductGroups.includes(group)) {
      setSelectedProductGroups([...selectedProductGroups, group]);
    }
  };

  const selectAllFromSuggestion = (suggestionGroups: string[]) => {
    const newGroups = suggestionGroups.filter(group => !selectedProductGroups.includes(group));
    setSelectedProductGroups([...selectedProductGroups, ...newGroups]);
  };

  const addCustomProductGroup = () => {
    if (newProductGroup.trim() && !selectedProductGroups.includes(newProductGroup.trim())) {
      setSelectedProductGroups([...selectedProductGroups, newProductGroup.trim()]);
      setNewProductGroup('');
      setShowAddProductField(false);
    }
  };

  const removeProductGroup = (group: string) => {
    setSelectedProductGroups(selectedProductGroups.filter(g => g !== group));
  };

  const selectServiceGroup = (group: string) => {
    if (!selectedServiceGroups.includes(group)) {
      setSelectedServiceGroups([...selectedServiceGroups, group]);
    }
  };

  const selectAllFromServiceSuggestion = (suggestionGroups: string[]) => {
    const newGroups = suggestionGroups.filter(group => !selectedServiceGroups.includes(group));
    setSelectedServiceGroups([...selectedServiceGroups, ...newGroups]);
  };

  const addCustomServiceGroup = () => {
    if (newServiceGroup.trim() && !selectedServiceGroups.includes(newServiceGroup.trim())) {
      setSelectedServiceGroups([...selectedServiceGroups, newServiceGroup.trim()]);
      setNewServiceGroup('');
      setShowAddServiceField(false);
    }
  };

  const removeServiceGroup = (group: string) => {
    setSelectedServiceGroups(selectedServiceGroups.filter(g => g !== group));
  };

  const handleFinish = () => {
    // Handle form submission
    console.log('Form Data:', formData);
    console.log('Selected Product Groups:', selectedProductGroups);
    console.log('Selected Service Groups:', selectedServiceGroups);
    if (onComplete) {
      onComplete();
    } else {
      navigate('/dashboard');
    }
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
    const months = [
      t('january'), t('february'), t('march'), t('april'), 
      t('may'), t('june'), t('july'), t('august'),
      t('september'), t('october'), t('november'), t('december')
    ];
    
    const years = Array.from({length: 25}, (_, i) => 2000 + i);
    
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
      
      case 'month-year':
        return (
          <div className="flex gap-4">
            <select
              className="form-control flex-1"
              value={formData[question.id + '_month'] || ''}
              onChange={(e) => handleInputChange(question.id + '_month', e.target.value)}
            >
              <option value="">{t('selectMonth')}</option>
              {months.map((month, index) => (
                <option key={index} value={month}>{month}</option>
              ))}
            </select>
            <select
              className="form-control flex-1"
              value={formData[question.id + '_year'] || ''}
              onChange={(e) => handleInputChange(question.id + '_year', e.target.value)}
            >
              <option value="">{t('selectYear')}</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        );
      
      case 'date-or-unknown':
        return (
          <div className="space-y-4">
            <div className="radio-options">
              <label className={`radio ${formData[question.id] === t('unknown') ? 'active' : ''}`}>
                <input
                  type="radio"
                  name={question.id}
                  value={t('unknown')}
                  checked={formData[question.id] === t('unknown')}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  className="hidden"
                />
                <div>{t('unknown')}</div>
              </label>
            </div>
            <div className="text-sm text-gray-600 mb-2">{t('orSelectMonthYear')}</div>
            <div className="flex gap-4">
              <select
                className="form-control flex-1"
                value={formData[question.id + '_month'] || ''}
                onChange={(e) => handleInputChange(question.id + '_month', e.target.value)}
                disabled={formData[question.id] === t('unknown')}
              >
                <option value="">{t('selectMonth')}</option>
                {months.map((month, index) => (
                  <option key={index} value={month}>{month}</option>
                ))}
              </select>
              <select
                className="form-control flex-1"
                value={formData[question.id + '_year'] || ''}
                onChange={(e) => handleInputChange(question.id + '_year', e.target.value)}
                disabled={formData[question.id] === t('unknown')}
              >
                <option value="">{t('selectYear')}</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
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
        
      case 'product-grouping':
        const renderProductTags = (categories: string[], suggestionName: string) => (
          <div className="space-y-3">
            <div className="font-semibold text-gray-800">{suggestionName}</div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border hover:bg-gray-200 transition-colors cursor-pointer"
                  onClick={() => selectProductGroup(category)}
                >
                  {category}
                </button>
              ))}
              <button 
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm border hover:bg-gray-200 transition-colors flex items-center gap-1"
                onClick={() => selectAllFromSuggestion(categories)}
              >
                + {t('all')}
              </button>
            </div>
          </div>
        );
        
        return (
          <div className="space-y-6">
            {/* Generate Suggestions Button */}
            {!productSuggestions && !isLoadingProductSuggestions && (
              <div className="text-center">
                <button 
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                  onClick={generateProductSuggestions}
                >
                  <Sparkles className="w-4 h-4" />
                  {t('generateAISuggestions')}
                </button>
              </div>
            )}
            
            {/* Loading State */}
            {isLoadingProductSuggestions && (
              <div className="text-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
                <p className="text-gray-600 mt-2">{t('generatingSuggestions')}</p>
              </div>
            )}
            
            {/* AI Suggestions */}
            {productSuggestions && (
              <>
                {/* Suggestion 1 */}
                <div className="p-4 border rounded-lg">
                  {renderProductTags(productSuggestions.suggestion1, t('suggestion1'))}
                </div>
                
                {/* Suggestion 2 */}
                <div className="p-4 border rounded-lg">
                  {renderProductTags(productSuggestions.suggestion2, t('suggestion2'))}
                </div>
                
                {/* Suggest More Button */}
                <div className="text-center">
                  <button 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                    onClick={generateProductSuggestions}
                  >
                    {t('suggestMore')}
                  </button>
                </div>
              </>
            )}
            
            {/* Manual Entry Section */}
            <div className="p-4 border-2 border-blue-500 rounded-lg">
              {!showAddProductField ? (
                <button 
                  className="w-full text-left"
                  onClick={() => setShowAddProductField(true)}
                >
                  <div className="font-semibold text-blue-600 mb-2">{t('addProductGroup')}</div>
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="font-semibold text-blue-600">{t('addProductGroup')}</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={t('enterProductGroupName')}
                      value={newProductGroup}
                      onChange={(e) => setNewProductGroup(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomProductGroup()}
                      autoFocus
                    />
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={addCustomProductGroup}
                    >
                      {t('add')}
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                      onClick={() => {
                        setShowAddProductField(false);
                        setNewProductGroup('');
                      }}
                    >
                      {t('cancel')}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Selected Product Groups Display */}
            {selectedProductGroups.length > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <div className="text-sm text-gray-700 mb-3 font-semibold">
                  {t('selected')} {t('productGroups')}:
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProductGroups.map((group, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm flex items-center gap-2"
                    >
                      {group}
                      <button
                        onClick={() => removeProductGroup(group)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'service-grouping':
        const renderServiceTags = (categories: string[], suggestionName: string) => (
          <div className="space-y-3">
            <div className="font-semibold text-gray-800">{suggestionName}</div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border hover:bg-gray-200 transition-colors cursor-pointer"
                  onClick={() => selectServiceGroup(category)}
                >
                  {category}
                </button>
              ))}
              <button 
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm border hover:bg-gray-200 transition-colors flex items-center gap-1"
                onClick={() => selectAllFromServiceSuggestion(categories)}
              >
                + {t('all')}
              </button>
            </div>
          </div>
        );
        
        return (
          <div className="space-y-6">
            {/* Generate Suggestions Button */}
            {!serviceSuggestions && !isLoadingServiceSuggestions && (
              <div className="text-center">
                <button 
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                  onClick={generateServiceSuggestions}
                >
                  <Sparkles className="w-4 h-4" />
                  {t('generateAISuggestions')}
                </button>
              </div>
            )}
            
            {/* Loading State */}
            {isLoadingServiceSuggestions && (
              <div className="text-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
                <p className="text-gray-600 mt-2">{t('generatingSuggestions')}</p>
              </div>
            )}
            
            {/* AI Suggestions */}
            {serviceSuggestions && (
              <>
                {/* Suggestion 1 */}
                <div className="p-4 border rounded-lg">
                  {renderServiceTags(serviceSuggestions.suggestion1, t('suggestion1'))}
                </div>
                
                {/* Suggestion 2 */}
                <div className="p-4 border rounded-lg">
                  {renderServiceTags(serviceSuggestions.suggestion2, t('suggestion2'))}
                </div>
                
                {/* Suggest More Button */}
                <div className="text-center">
                  <button 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                    onClick={generateServiceSuggestions}
                  >
                    {t('suggestMore')}
                  </button>
                </div>
              </>
            )}
            
            {/* Manual Entry Section */}
            <div className="p-4 border-2 border-blue-500 rounded-lg">
              {!showAddServiceField ? (
                <button 
                  className="w-full text-left"
                  onClick={() => setShowAddServiceField(true)}
                >
                  <div className="font-semibold text-blue-600 mb-2">{t('addServiceGroup')}</div>
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="font-semibold text-blue-600">{t('addServiceGroup')}</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={t('enterServiceGroupName')}
                      value={newServiceGroup}
                      onChange={(e) => setNewServiceGroup(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomServiceGroup()}
                      autoFocus
                    />
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={addCustomServiceGroup}
                    >
                      {t('add')}
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                      onClick={() => {
                        setShowAddServiceField(false);
                        setNewServiceGroup('');
                      }}
                    >
                      {t('cancel')}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Selected Service Groups Display */}
            {selectedServiceGroups.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-700 mb-3 font-semibold">
                  {t('selected')} {t('serviceGroups')}:
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedServiceGroups.map((group, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm flex items-center gap-2"
                    >
                      {group}
                      <button
                        onClick={() => removeServiceGroup(group)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
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
    <div className="business-plan-wizard min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-16 text-white flex flex-col items-center py-4" style={{ backgroundColor: 'rgb(3, 10, 61)' }}>
        {/* Logo Section */}
        <div className="mb-8">
          <div 
            className="w-10 h-10 bg-white rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleNavigation('/dashboard')}
          >
            <Building className="w-6 h-6" style={{ color: 'rgb(3, 10, 61)' }} />
          </div>
        </div>

        {/* Navigation Icons */}
        <nav className="flex flex-col space-y-4 flex-1">
          <button
            onClick={() => handleNavigation('/dashboard')}
            className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative group text-white/80 hover:text-white"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(3, 10, 61, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={t('Home')}
          >
            <Home className="w-5 h-5" />
            <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {t('Home')}
            </div>
          </button>
          
          <button
            onClick={() => handleNavigation('/business-plan/wizard')}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-white relative group"
            style={{ backgroundColor: 'rgba(3, 10, 61, 0.8)' }}
            title={t('Add Plan')}
          >
            <FileText className="w-5 h-5" />
            <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {t('Add Plan')}
            </div>
          </button>
          
          <button
            onClick={() => handleNavigation('/business-plan-editor')}
            className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative group text-white/80 hover:text-white"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(3, 10, 61, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={t('Edit Plan')}
          >
            <Edit className="w-5 h-5" />
            <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {t('Edit Plan')}
            </div>
          </button>
          
          <button
            className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative group text-white/80 hover:text-white"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(3, 10, 61, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={t('View Plan')}
          >
            <Eye className="w-5 h-5" />
            <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {t('View Plan')}
            </div>
          </button>
          
          <button
            onClick={() => handleNavigation('/financials')}
            className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative group text-white/80 hover:text-white"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(3, 10, 61, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={t('Financials')}
          >
            <DollarSign className="w-5 h-5" />
            <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {t('Financials')}
            </div>
          </button>
          
          <button
            onClick={() => handleNavigation('/users')}
            className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative group text-white/80 hover:text-white"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(3, 10, 61, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={t('Users')}
          >
            <Users className="w-5 h-5" />
            <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {t('Users')}
            </div>
          </button>
        </nav>

        {/* Bottom Upgrade Icon */}
        <div className="mt-auto">
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-yellow-500 transition-colors group">
            <Lock className="w-5 h-5 text-gray-800" />
            <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {t('Upgrade Now')}
            </div>
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
                    {questions.slice(0, 15).filter((_, index) => shouldShowQuestion(index)).map((question) => {
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
                    {questions.filter((_, index) => shouldShowQuestion(index)).map((question) => {
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