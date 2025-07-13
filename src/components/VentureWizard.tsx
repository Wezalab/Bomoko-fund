import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Loader2, Search, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import countryData from '../constants/countries.json';
import { generateBusinessTypeSuggestions, generateBusinessNameSuggestions } from '../lib/groqService';
import { useTranslation } from '../lib/TranslationContext';
import logoLight from '../assets/logoLight.webp';
import logoDark from '../assets/logoDark.webp';

interface Country {
  code: string;
  name: string;
  color: string;
}

interface VentureData {
  purpose: string;
  country: string;
  businessDescription: string;
  businessTypes: string[];
  businessName: string;
  userName: string;
  userRole: string;
  authMethod: 'google' | 'username' | '';
  language: string;
  currency: string;
  username?: string;
  password?: string;
}

const VentureWizard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [businessDescriptionSubStep, setBusinessDescriptionSubStep] = useState(0); // 0: description, 1: type selection
  const [isLoadingAISuggestions, setIsLoadingAISuggestions] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<string[]>([]);
  const [isLoadingNameSuggestions, setIsLoadingNameSuggestions] = useState(false);
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([]);
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [sidebarView, setSidebarView] = useState<'benefits' | 'funding'>('benefits');
  const [ventureData, setVentureData] = useState<VentureData>({
    purpose: '',
    country: '',
    businessDescription: '',
    businessTypes: [],
    businessName: '',
    userName: '',
    userRole: '',
    authMethod: '',
    language: '',
    currency: '',
  });

  const countries: Country[] = countryData as Country[];

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const selectedCountry = countries.find(c => c.code === ventureData.country);

  const steps = [
    {
      id: 'purpose',
      question: t('Why are you creating a business plan?'),
      description: t('The option you choose will not alter the structure of your plan; it just helps us to better understand your goals.'),
      type: 'choice'
    },
    {
      id: 'location',
      question: t('Where will the business be based?'),
      description: t('Select your country, language, and currency for your business plan.'),
      type: 'country-with-details'
    },
    {
      id: 'business-description',
      question: businessDescriptionSubStep === 0 
        ? t('What will the business do?')
        : t('Please choose the options that most accurately describe the business:'),
      description: businessDescriptionSubStep === 0 
        ? t('This will not appear in your plan, it just helps us understand the business. Below are a few examples:')
        : t('If none of the suggestions accurately describe your business, click the \'Manual\' button to search for other options.'),
      type: businessDescriptionSubStep === 0 ? 'textarea' : 'business-type-selection'
    },
    {
      id: 'business-name',
      question: t('What will the business be called?'),
      description: t('If you haven\'t chosen a name, enter a temporary one and change it later in the Business Settings.'),
      type: 'text'
    },
    {
      id: 'user-info',
      question: t('What is your name and role?'),
      description: t('Please provide your full name and describe your position or affiliation with the business.'),
      type: 'user-details'
    },
    {
      id: 'auth-method',
      question: t('Register with Google or set username & password?'),
      description: t('You can use Google to sign in and out of your account or you can manually set a username.'),
      type: 'auth'
    }
  ];

  const purposeOptions = [
    {
      value: 'validate-idea',
      title: t('Validate Idea'),
      description: t('To transform a business concept or idea into a structured plan, ensuring that the venture is both feasible and profitable')
    },
    {
      value: 'launch-startup',
      title: t('Launch Startup'),
      description: t('To create a roadmap for launching, scaling or funding a new business, including detailed objectives, strategies and forecasts.')
    },
    {
      value: 'drive-growth',
      title: t('Drive Growth'),
      description: t('To develop strategies for expanding operations, entering new markets, or optimising resources for success and increased profitability.')
    }
  ];

  const roleOptions = [
    'Founder',
    'Co-founder',
    'CEO',
    'Entrepreneur',
    'Business Owner',
    'Consultant',
    'Investor',
    'Other'
  ];

  const predefinedBusinessTypes = [
    'Software Company',
    'Mobile App Developer',
    'Website Designer',
    'E-commerce Platform',
    'Digital Marketing Agency',
    'Consulting Firm',
    'Manufacturing Business',
    'Restaurant',
    'Retail Store',
    'Healthcare Services',
    'Educational Services',
    'Financial Services',
    'Real Estate',
    'Construction Company',
    'Transportation Services',
    'Agriculture Business',
    'Tech Startup',
    'SaaS Company',
    'Online Marketplace',
    'Content Creation',
    'Event Planning',
    'Fitness & Wellness',
    'Beauty & Cosmetics',
    'Fashion & Apparel',
    'Food & Beverage',
    'Travel & Tourism',
    'Legal Services',
    'Accounting Services',
    'Photography Services',
    'Marketing Consultancy'
  ];

  const updateVentureData = (key: keyof VentureData, value: any) => {
    setVentureData(prev => ({ ...prev, [key]: value }));
  };

  const generateAISuggestions = async () => {
    if (!ventureData.businessDescription.trim()) return;
    
    setIsLoadingAISuggestions(true);
    try {
      const suggestions = await generateBusinessTypeSuggestions(ventureData.businessDescription);
      setAISuggestions(suggestions);
      setBusinessDescriptionSubStep(1);
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    } finally {
      setIsLoadingAISuggestions(false);
    }
  };

  const toggleBusinessType = (businessType: string) => {
    const currentTypes = ventureData.businessTypes;
    if (currentTypes.includes(businessType)) {
      updateVentureData('businessTypes', currentTypes.filter(type => type !== businessType));
    } else {
      updateVentureData('businessTypes', [...currentTypes, businessType]);
    }
  };

  const clearBusinessTypes = () => {
    updateVentureData('businessTypes', []);
  };

  const generateNameSuggestions = async () => {
    if (!ventureData.businessDescription.trim()) return;
    
    setIsLoadingNameSuggestions(true);
    try {
      const suggestions = await generateBusinessNameSuggestions(
        ventureData.businessDescription, 
        ventureData.businessTypes
      );
      setNameSuggestions(suggestions);
      setShowNameSuggestions(true);
    } catch (error) {
      console.error('Error generating name suggestions:', error);
    } finally {
      setIsLoadingNameSuggestions(false);
    }
  };

  const selectBusinessName = (name: string) => {
    updateVentureData('businessName', name);
    setShowNameSuggestions(false);
  };

  const selectCountry = (country: Country) => {
    updateVentureData('country', country.code);
    setCountrySearch(country.name);
    setShowCountryDropdown(false);
  };

  const handleNext = () => {
    // Special handling for business description step (now at index 2)
    if (currentStep === 2 && businessDescriptionSubStep === 0) {
      // Move to business type selection substep
      setBusinessDescriptionSubStep(1);
      return;
    }

    // Reset business description substep when moving to next step
    if (currentStep === 2) {
      setBusinessDescriptionSubStep(0);
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle completion
      handleComplete();
    }
  };

  const handlePrev = () => {
    // Special handling for business description step (now at index 2)
    if (currentStep === 2 && businessDescriptionSubStep === 1) {
      // Move back to business description substep
      setBusinessDescriptionSubStep(0);
      return;
    }

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Reset business description substep when moving to previous step
      if (currentStep === 3) {
        setBusinessDescriptionSubStep(0);
      }
    }
  };

  const handleComplete = () => {
    // Store venture data and navigate to business plan editor
    localStorage.setItem('ventureWizardData', JSON.stringify(ventureData));
    navigate('/business-plan/editor');
  };

  const handleGoogleSignIn = () => {
    // Handle Google sign in
    updateVentureData('authMethod', 'google');
    handleComplete();
  };

  const isStepComplete = (stepId: string) => {
    switch (stepId) {
      case 'purpose':
        return ventureData.purpose !== '';
      case 'location':
        return ventureData.country !== '' && ventureData.language !== '' && ventureData.currency !== '';
      case 'business-description':
        if (businessDescriptionSubStep === 0) {
          return ventureData.businessDescription !== '';
        } else {
          return ventureData.businessTypes.length > 0;
        }
      case 'business-name':
        return ventureData.businessName !== '';
      case 'user-info':
        return ventureData.userName !== '' && ventureData.userRole !== '';
      case 'auth-method':
        if (ventureData.authMethod === 'google') {
          return true;
        } else if (ventureData.authMethod === 'username') {
          return ventureData.username !== '' && ventureData.password !== '';
        }
        return false;

      default:
        return false;
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.type) {
      case 'choice':
        return (
          <div className="space-y-4">
            {purposeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateVentureData('purpose', option.value)}
                className={`w-full p-6 text-left rounded-lg border-2 transition-all relative ${
                  ventureData.purpose === option.value
                    ? 'border-yellow-400 bg-yellow-50 shadow-lg transform scale-[1.02]'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                                 {/* Selected indicator */}
                 {ventureData.purpose === option.value && (
                   <div className="absolute top-3 right-3 w-6 h-6 bg-yellow rounded-full flex items-center justify-center">
                     <svg className="w-4 h-4 text-dark" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                     </svg>
                   </div>
                 )}
                 <h3 className={`font-semibold text-lg mb-2 ${
                   ventureData.purpose === option.value ? 'text-dark' : 'text-gray-900'
                 }`}>
                   {option.title}
                 </h3>
                 <p className={`text-sm ${
                   ventureData.purpose === option.value ? 'text-dark/70' : 'text-gray-600'
                 }`}>
                  {option.description}
                </p>
              </button>
            ))}
          </div>
        );

      case 'country-with-details':
        return (
          <div className="space-y-6">
            {/* Country Selection */}
            <div className="relative">
              <Label htmlFor="country" className="text-sm font-medium text-dark">
                {t('Select Country')}
              </Label>
              <div className="relative mt-2">
                <div
                  className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white cursor-pointer hover:border-lightBlue/50 transition-colors"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {selectedCountry && (
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: selectedCountry.color }}
                        />
                      )}
                      <span className={selectedCountry ? 'text-dark' : 'text-gray-400'}>
                        {selectedCountry ? selectedCountry.name : t('Select Country')}
                      </span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${showCountryDropdown ? 'rotate-90' : ''}`} />
                  </div>
                </div>
                
                {showCountryDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-hidden">
                    <div className="p-3 border-b border-gray-200">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="text"
                          placeholder={t('Search countries...')}
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          className="pl-10 border-gray-300 focus:border-lightBlue"
                        />
                      </div>
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      {filteredCountries.map((country) => (
                        <div
                          key={country.code}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => selectCountry(country)}
                        >
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: country.color }}
                          />
                          <span className="text-dark">{country.name}</span>
                        </div>
                      ))}
                      {filteredCountries.length === 0 && (
                        <div className="p-3 text-gray-500 text-center">
                          {t('No countries found')}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-medium text-dark">
                {t('Select Language')}
              </Label>
              <Select value={ventureData.language} onValueChange={(value) => updateVentureData('language', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('Select Language')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Currency Selection */}
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-sm font-medium text-dark">
                {t('Select Currency')}
              </Label>
              <Select value={ventureData.currency} onValueChange={(value) => updateVentureData('currency', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('Select Currency')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                  <SelectItem value="CDF">Congolese Franc (CDF)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-4">
            {/* Description Examples */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">{t('Examples:')}</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-lightBlue">•</span>
                  <span>{t('We are a marketing agency specialising in TikTok and YouTube for small businesses.')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lightBlue">•</span>
                  <span>{t('A fintech startup developing mobile payment solutions for rural communities in Africa.')}</span>
                </div>
              </div>
            </div>
            
            <Textarea
              value={ventureData.businessDescription}
              onChange={(e) => updateVentureData('businessDescription', e.target.value)}
              placeholder={t('Describe your business here...')}
              className="min-h-[100px] resize-none"
            />
          </div>
        );

      case 'business-type-selection':
        return (
          <div className="space-y-6">
            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">{t('AI Suggestions')}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {aiSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => toggleBusinessType(suggestion)}
                      className={`p-3 text-center rounded-lg border-2 transition-all ${
                        ventureData.businessTypes.includes(suggestion)
                          ? 'border-lightBlue bg-lightBlue/10 text-lightBlue'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <span className="font-medium">{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-center">
                  <Button
                    onClick={clearBusinessTypes}
                    variant="outline"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {t('Clear All')}
                  </Button>
                </div>
              </div>
            )}

            {/* Load AI Suggestions Button */}
            {aiSuggestions.length === 0 && (
              <div className="text-center">
                <button
                  onClick={generateAISuggestions}
                  disabled={isLoadingAISuggestions || !ventureData.businessDescription.trim()}
                  className="inline-flex items-center space-x-2 px-6 py-3 border-2 border-dashed border-lightBlue text-lightBlue rounded-lg hover:bg-lightBlue/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingAISuggestions ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                  <span>
                    {isLoadingAISuggestions ? t('Loading') + '...' : t('Load AI Suggestions')}
                  </span>
                </button>
              </div>
            )}

            {/* Manual Selection Section */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">{t('Manual')}</h3>
              <p className="text-sm text-gray-600">
                {t('If none of the suggestions accurately describe your business, click the \'Manual\' button to search for other options.')}
              </p>
              
              <Select onValueChange={(value) => toggleBusinessType(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('Manual')} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {predefinedBusinessTypes.map((type, index) => (
                    <SelectItem 
                      key={index} 
                      value={type}
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Selected Business Types Display */}
              {ventureData.businessTypes.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">{t('Selected Types:')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {ventureData.businessTypes.map((type, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-lightBlue/10 text-lightBlue rounded-full text-sm"
                      >
                        <span>{type}</span>
                        <button
                          onClick={() => toggleBusinessType(type)}
                          className="text-lightBlue hover:text-lightBlue/80"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div className="relative">
              <Input
                value={ventureData.businessName}
                onChange={(e) => updateVentureData('businessName', e.target.value)}
                placeholder={t('e.g. BOMOKO Solutions')}
                className="pr-20"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <span className="text-gray-400 mr-3">or</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateNameSuggestions}
                  disabled={isLoadingNameSuggestions || !ventureData.businessDescription.trim()}
                  className="bg-lightBlue hover:bg-lightBlue/90 text-white border-lightBlue disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingNameSuggestions ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    t('Suggest Names')
                  )}
                </Button>
              </div>
            </div>

            {/* Name Suggestions */}
            {showNameSuggestions && nameSuggestions.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{t('Suggest Names')}</h3>
                  <button
                    onClick={() => setShowNameSuggestions(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    {t('Hide Suggestions')}
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {nameSuggestions.map((name, index) => (
                    <button
                      key={index}
                      onClick={() => selectBusinessName(name)}
                      className={`p-3 text-center rounded-lg border-2 transition-all ${
                        ventureData.businessName === name
                          ? 'border-lightBlue bg-lightBlue/10 text-lightBlue'
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <span className="font-medium">{name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading state for AI suggestions */}
            {isLoadingNameSuggestions && (
              <div className="text-center py-4">
                <div className="inline-flex items-center space-x-2 text-lightBlue">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Getting AI Options...</span>
                </div>
              </div>
            )}
          </div>
        );

      case 'user-details':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  value={ventureData.userName}
                  onChange={(e) => updateVentureData('userName', e.target.value)}
                                     placeholder={t('Full Name')}
                />
              </div>
              <div>
                <Select value={ventureData.userRole} onValueChange={(value) => updateVentureData('userRole', value)}>
                                     <SelectTrigger>
                     <SelectValue placeholder={t('Your Role')} />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'auth':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleGoogleSignIn}
                className="h-16 bg-white border-2 border-lightBlue hover:bg-lightBlue/5 text-lightBlue flex items-center justify-center space-x-3"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>{t('Register with Google')}</span>
              </Button>
              <Button
                onClick={() => updateVentureData('authMethod', 'username')}
                className="h-16 bg-lightGreen/20 hover:bg-lightGreen/30 text-dark border-2 border-lightGreen"
              >
                {t('Set Username & Password')}
              </Button>
            </div>
            
            {/* Username and Password fields when username auth method is selected */}
            {ventureData.authMethod === 'username' && (
              <div className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username" className="text-sm font-medium text-dark">
                      {t('Username')}
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={ventureData.username || ''}
                      onChange={(e) => updateVentureData('username', e.target.value)}
                      placeholder={t('Enter username')}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-sm font-medium text-dark">
                      {t('Password')}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={ventureData.password || ''}
                      onChange={(e) => updateVentureData('password', e.target.value)}
                      placeholder={t('Enter password')}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );



      default:
        return null;
    }
  };

  const currentStepData = steps[currentStep];

  // Define colors for numbers
  const numberColors = [
    'text-yellow', // 01 - Yellow
    'text-green-400', // 02 - Green
    'text-blue-400', // 03 - Blue
    'text-purple-400', // 04 - Purple
    'text-red-400', // 05 - Red
  ];

  const renderSidebarContent = () => {
    if (sidebarView === 'benefits') {
      return (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">{t('Benefits of using BOMOKO FUND')}</h3>
            <p className="text-sm text-gray-300">{t('for creating your business plan.')}</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className={`text-4xl font-bold ${numberColors[0]} opacity-90`}>01</div>
              <div>
                <h4 className="font-semibold mb-2 text-white">{t('AI-powered business planning')}</h4>
                <p className="text-sm text-gray-300">{t('Create a professional quality business plan in no time, just answer our multiple-choice questions and let BOMOKO FUND do the rest.')}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className={`text-4xl font-bold ${numberColors[1]} opacity-90`}>02</div>
              <div>
                <h4 className="font-semibold mb-2 text-white">{t('Access to funding opportunities')}</h4>
                <p className="text-sm text-gray-300">{t('Connect with investors and funding opportunities specifically designed for African entrepreneurs and high-potential projects.')}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className={`text-4xl font-bold ${numberColors[2]} opacity-90`}>03</div>
              <div>
                <h4 className="font-semibold mb-2 text-white">{t('Community of entrepreneurs')}</h4>
                <p className="text-sm text-gray-300">{t('Join a thriving ecosystem of visionary business owners, impact-driven investors, and supporters across Africa.')}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className={`text-4xl font-bold ${numberColors[3]} opacity-90`}>04</div>
              <div>
                <h4 className="font-semibold mb-2 text-white">{t('Expert guidance and mentorship')}</h4>
                <p className="text-sm text-gray-300">{t('Get guidance from experienced entrepreneurs and business experts who understand the African market landscape.')}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className={`text-4xl font-bold ${numberColors[4]} opacity-90`}>05</div>
              <div>
                <h4 className="font-semibold mb-2 text-white">{t('Comprehensive business tools')}</h4>
                <p className="text-sm text-gray-300">{t('Focus on high-potential projects that address critical social and economic needs across African communities.')}</p>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">{t('How funding works on BOMOKO FUND')}</h3>
            <p className="text-sm text-gray-300">{t('Step-by-step guide to get funded.')}</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className={`text-4xl font-bold ${numberColors[0]} opacity-90`}>01</div>
              <div>
                <h4 className="font-semibold mb-2 text-white">{t('Create Your Business Plan')}</h4>
                <p className="text-sm text-gray-300">{t('Build a comprehensive business plan using our AI-powered tools and templates specifically designed for African entrepreneurs.')}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className={`text-4xl font-bold ${numberColors[1]} opacity-90`}>02</div>
              <div>
                <h4 className="font-semibold mb-2 text-white">{t('Submit for Review')}</h4>
                <p className="text-sm text-gray-300">{t('Our expert team reviews your business plan to ensure it meets funding requirements and provides feedback for improvement.')}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className={`text-4xl font-bold ${numberColors[2]} opacity-90`}>03</div>
              <div>
                <h4 className="font-semibold mb-2 text-white">{t('Get Matched with Investors')}</h4>
                <p className="text-sm text-gray-300">{t('Connect with impact-driven investors who are specifically interested in funding high-potential African ventures and projects.')}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className={`text-4xl font-bold ${numberColors[3]} opacity-90`}>04</div>
              <div>
                <h4 className="font-semibold mb-2 text-white">{t('Receive Funding')}</h4>
                <p className="text-sm text-gray-300">{t('Once matched, receive funding through our secure platform and start building your business with ongoing support and mentorship.')}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className={`text-4xl font-bold ${numberColors[4]} opacity-90`}>05</div>
              <div>
                <h4 className="font-semibold mb-2 text-white">{t('Launch & Scale')}</h4>
                <p className="text-sm text-gray-300">{t('Launch your business with confidence and access our network of resources, mentors, and partners to scale your impact across Africa.')}</p>
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lightGreen/20 to-lightBlue/20 flex">
      {/* Sidebar */}
      <div className="w-1/3 bg-gradient-to-b from-[#02093d] to-[#0a1854] text-white p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-white rounded text-[#02093d] flex items-center justify-center font-bold">
                B
              </div>
              <span className="text-2xl font-bold text-white">{t('BOMOKO FUND')}</span>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center space-x-2 mb-4">
              <button
                onClick={() => setSidebarView('funding')}
                className={`text-sm px-3 py-1 rounded-full transition-colors ${
                  sidebarView === 'funding'
                    ? 'bg-white text-[#02093d]'
                    : 'bg-white/10 text-gray-200 hover:bg-white/20'
                }`}
              >
                {t('Funding')}
              </button>
              <button
                onClick={() => setSidebarView('benefits')}
                className={`text-sm px-3 py-1 rounded-full transition-colors ${
                  sidebarView === 'benefits'
                    ? 'bg-white text-[#02093d]'
                    : 'bg-white/10 text-gray-200 hover:bg-white/20'
                }`}
              >
                {t('Benefits')}
              </button>
            </div>

            {renderSidebarContent()}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 bg-yellow text-dark rounded-full text-sm font-medium mb-4">
              {t('FREE TRIAL')}
            </div>
            <h1 className="text-5xl font-bold mb-2 text-dark">
              {t('Create')} <span className="text-lightBlue">{t('Business Plan')}</span>
            </h1>
            <div className="text-right text-sm text-gray-500 mt-8">
              <span>{t('Already have an account?')} </span>
              <button className="text-lightBlue hover:text-lightBlue/80">{t('Log In')}</button>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-lightBlue rounded-full flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <h2 className="text-2xl font-bold text-dark">{currentStepData.question}</h2>
            </div>
            <p className="text-gray-600 mb-6">{currentStepData.description}</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center mt-8">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 0}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t('Back')}</span>
            </Button>

            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-lightBlue'
                      : index < currentStep
                      ? 'bg-dark'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={!isStepComplete(currentStepData.id)}
              className="flex items-center space-x-2 bg-lightBlue hover:bg-lightBlue/90 text-white"
            >
              <span>{currentStep === steps.length - 1 ? t('Complete Setup') : t('Continue')}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VentureWizard; 