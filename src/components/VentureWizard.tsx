import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import countryData from '../constants/countries.json';

interface VentureData {
  purpose: string;
  country: string;
  businessDescription: string;
  businessName: string;
  userName: string;
  userRole: string;
  authMethod: 'google' | 'username' | '';
  username?: string;
  password?: string;
}

const VentureWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [ventureData, setVentureData] = useState<VentureData>({
    purpose: '',
    country: '',
    businessDescription: '',
    businessName: '',
    userName: '',
    userRole: '',
    authMethod: '',
  });

  const steps = [
    {
      id: 'purpose',
      question: 'Why are you creating a business plan?',
      description: 'The option you choose will not alter the structure of your plan; it just helps us to better understand your goals.',
      type: 'choice'
    },
    {
      id: 'location',
      question: 'Where will the business be based?',
      description: 'If the business will operate internationally select the country that the head office will be situated in.',
      type: 'country'
    },
    {
      id: 'business-description',
      question: 'What will the business do?',
      description: 'This will not appear in your plan, it just helps us understand the business. Below are a few examples:',
      type: 'textarea'
    },
    {
      id: 'business-name',
      question: 'What will the business be called?',
      description: 'If you haven\'t chosen a name, enter a temporary one and change it later in the Business Settings.',
      type: 'text'
    },
    {
      id: 'user-info',
      question: 'What is your name and role?',
      description: 'Please provide your full name and describe your position or affiliation with the business.',
      type: 'user-details'
    },
    {
      id: 'auth-method',
      question: 'Register with Google or set username & password?',
      description: 'You can use Google to sign in and out of your account or you can manually set a username.',
      type: 'auth'
    }
  ];

  const purposeOptions = [
    {
      value: 'validate-idea',
      title: 'Validate Idea',
      description: 'To transform a business concept or idea into a structured plan, ensuring that the venture is both feasible and profitable'
    },
    {
      value: 'launch-startup',
      title: 'Launch Startup',
      description: 'To create a roadmap for launching, scaling or funding a new business, including detailed objectives, strategies and forecasts.'
    },
    {
      value: 'drive-growth',
      title: 'Drive Growth',
      description: 'To develop strategies for expanding operations, entering new markets, or optimising resources for success and increased profitability.'
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

  const updateVentureData = (key: keyof VentureData, value: any) => {
    setVentureData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle completion
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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
        return ventureData.country !== '';
      case 'business-description':
        return ventureData.businessDescription !== '';
      case 'business-name':
        return ventureData.businessName !== '';
      case 'user-info':
        return ventureData.userName !== '' && ventureData.userRole !== '';
      case 'auth-method':
        return ventureData.authMethod !== '';
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
                className={`w-full p-6 text-left rounded-lg border-2 transition-all ${
                  ventureData.purpose === option.value
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm">{option.description}</p>
              </button>
            ))}
          </div>
        );

      case 'country':
        return (
          <div className="space-y-4">
            <Select value={ventureData.country} onValueChange={(value) => updateVentureData('country', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Please Select" />
              </SelectTrigger>
              <SelectContent>
                {countryData.map((country) => (
                  <SelectItem key={country.code} value={country.name}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-4">
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span>→</span>
                <span>We are a supplier of specialist glass for use in commercial buildings.</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>→</span>
                <span>We are a marketing agency specialising in TikTok and YouTube.</span>
              </div>
            </div>
            <Textarea
              value={ventureData.businessDescription}
              onChange={(e) => updateVentureData('businessDescription', e.target.value)}
              placeholder="e.g. We are a supplier of specialist glass for use in commercial buildings, we specialise in high-end laptops."
              className="min-h-[120px] resize-none"
            />
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div className="relative">
              <Input
                value={ventureData.businessName}
                onChange={(e) => updateVentureData('businessName', e.target.value)}
                placeholder="e.g. Venture Planner"
                className="pr-20"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <span className="text-gray-400 mr-3">or</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-400"
                >
                  Suggest Names
                </Button>
              </div>
            </div>
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
                  placeholder="e.g. Joe Bloggs"
                />
              </div>
              <div>
                <Select value={ventureData.userRole} onValueChange={(value) => updateVentureData('userRole', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Please Select" />
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
                className="h-16 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 flex items-center justify-center space-x-3"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Register with Google</span>
              </Button>
              <Button
                onClick={() => updateVentureData('authMethod', 'username')}
                className="h-16 bg-gray-100 hover:bg-gray-200 text-gray-700 border-2 border-gray-300"
              >
                Create Username
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div className="w-1/3 bg-gradient-to-b from-teal-600 to-teal-800 text-white p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-white rounded text-teal-600 flex items-center justify-center font-bold">
                V
              </div>
              <span className="text-2xl font-bold">Venture</span>
            </div>
            <span className="text-2xl font-bold text-yellow-400">Planner</span>
          </div>

          <div className="space-y-8">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-sm bg-teal-700 px-3 py-1 rounded-full">Pricing</span>
              <span className="text-sm bg-white text-teal-600 px-3 py-1 rounded-full">Benefits</span>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">5 Reasons to use Venture Planner</h3>
              <p className="text-sm text-teal-100">for creating your business plan.</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="text-4xl font-bold text-teal-400 opacity-50">01</div>
                <div>
                  <h4 className="font-semibold mb-2">Quick & Easy</h4>
                  <p className="text-sm text-teal-100">Create a professional quality business plan in no time, just answer our multiple-choice questions and let Venture Planner do the rest.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="text-4xl font-bold text-teal-400 opacity-50">02</div>
                <div>
                  <h4 className="font-semibold mb-2">Avoid Failure</h4>
                  <p className="text-sm text-teal-100">Reduce the risk failure with our thorough risk assessments and expert guidance to identify and overcome potential pitfalls.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="text-4xl font-bold text-yellow-400 opacity-75">03</div>
                <div>
                  <h4 className="font-semibold mb-2">Powerful Forecasting</h4>
                  <p className="text-sm text-teal-100">Our platform generates all your financial projections, tables, and charts, ensuring your business plan is financially viable.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="text-4xl font-bold text-pink-400 opacity-75">04</div>
                <div>
                  <h4 className="font-semibold mb-2">Your Vision, Enhanced</h4>
                  <p className="text-sm text-teal-100">Venture Planner uses thousands of data points to tailor your plan to your ideas, goals, and vision without you having to type a single word.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="text-4xl font-bold text-red-400 opacity-75">05</div>
                <div>
                  <h4 className="font-semibold mb-2">Expert Guidance</h4>
                  <p className="text-sm text-teal-100">Our AI will guide you through every decision and provide strategy recommendations to help ensure the best chance success.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium mb-4">
              FREE TRIAL
            </div>
            <h1 className="text-5xl font-bold mb-2">
              Create <span className="text-black">Business Plan</span>
            </h1>
            <div className="text-right text-sm text-gray-500 mt-8">
              <span>Already have an account? </span>
              <button className="text-blue-600 hover:text-blue-800">Click Here</button>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <h2 className="text-2xl font-bold">{currentStepData.question}</h2>
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
              <span>Back</span>
            </Button>

            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-teal-600'
                      : index < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={!isStepComplete(currentStepData.id)}
              className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700"
            >
              <span>{currentStep === steps.length - 1 ? 'Complete' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VentureWizard; 