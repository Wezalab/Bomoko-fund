import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Users, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import businessPlanData from '../constants/businessPlanData.json';
import { 
  MultiSelectCards, 
  ProblemSolutionMapping, 
  OwnershipTable, 
  CompetitorMatrix, 
  LocationTable 
} from './businessPlan/FieldComponents';

interface WizardData {
  [key: string]: any;
}

const BusinessPlanWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>({});
  const [isInitialSetup, setIsInitialSetup] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentSubsection, setCurrentSubsection] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);

  const initialQuestions = businessPlanData.initialQuestions;
  const businessPlan = businessPlanData.businessPlanStructure;

  const updateWizardData = (key: string, value: any) => {
    setWizardData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNextStep = () => {
    if (isInitialSetup) {
      if (currentStep < initialQuestions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsInitialSetup(false);
        setShowWelcome(true);
      }
    } else {
      // Handle business plan navigation
      const section = businessPlan.sections[currentSection];
      if (currentSubsection < section.subsections.length - 1) {
        setCurrentSubsection(currentSubsection + 1);
      } else if (currentSection < businessPlan.sections.length - 1) {
        setCurrentSection(currentSection + 1);
        setCurrentSubsection(0);
      }
    }
  };

  const handlePrevStep = () => {
    if (isInitialSetup) {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    } else {
      const section = businessPlan.sections[currentSection];
      if (currentSubsection > 0) {
        setCurrentSubsection(currentSubsection - 1);
      } else if (currentSection > 0) {
        setCurrentSection(currentSection - 1);
        const prevSection = businessPlan.sections[currentSection - 1];
        setCurrentSubsection(prevSection.subsections.length - 1);
      }
    }
  };

  if (isInitialSetup) {
    return (
      <InitialSetupWizard
        questions={initialQuestions}
        currentStep={currentStep}
        wizardData={wizardData}
        onUpdateData={updateWizardData}
        onNext={handleNextStep}
        onPrev={handlePrevStep}
      />
    );
  }

  return (
    <BusinessPlanOverview
      wizardData={wizardData}
      onStartPlan={() => console.log('Start plan')}
      onViewPlan={() => {
        localStorage.setItem('businessPlanWizardData', JSON.stringify(wizardData));
        navigate('/business-plan/editor');
      }}
    />
  );
};

const WelcomeModal: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/business-plan/editor');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Modeliks!</h2>
          <p className="text-gray-600 mb-4">We are excited to have you on board!</p>
          <p className="text-gray-600 mb-6">Get started by exploring the various features and modules.</p>
        </div>
        
        <div className="mb-6">
          <img src="/api/placeholder/400/200" alt="Modeliks Preview" className="w-full rounded-lg" />
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            If you have any questions, our support team is here to assist you or consult our help center for guidance. We also offer live-chat during our business hours
          </p>
        </div>
        
        <button
          onClick={handleGetStarted}
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

const InitialSetupWizard: React.FC<{
  questions: any[];
  currentStep: number;
  wizardData: WizardData;
  onUpdateData: (key: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}> = ({ questions, currentStep, wizardData, onUpdateData, onNext, onPrev }) => {
  const question = questions[currentStep];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-500 mb-2">Let's get you started!</h1>
          <p className="text-gray-600">Please answer 9 quick questions to tailor your plan.</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {currentStep + 1}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{question.question}</h2>
                  <p className="text-gray-600 text-sm">{question.description}</p>
                </div>
              </div>

              <QuestionRenderer
                question={question}
                value={wizardData[`question_${question.id}`]}
                onChange={(value) => onUpdateData(`question_${question.id}`, value)}
              />
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <button
              onClick={onPrev}
              disabled={currentStep === 0}
              className="flex items-center px-4 py-2 text-gray-600 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            <div className="flex space-x-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentStep ? 'bg-blue-500' : 
                    index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={onNext}
              className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {currentStep === questions.length - 1 ? 'Complete' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BusinessPlanOverview: React.FC<{
  wizardData: WizardData;
  onStartPlan: () => void;
  onViewPlan: () => void;
}> = ({ wizardData, onStartPlan, onViewPlan }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create your business plan with AI</h1>
          <p className="text-gray-600 max-w-4xl mx-auto mb-2">
            Your business plan is organized into chapters, with each chapter containing several sections. To complete your plan, navigate through each chapter and fill in the corresponding sections. Be sure to finish the "Executive Summary" chapter last. You can also customize the cover page as needed.
          </p>
          <p className="text-gray-600 font-medium">
            Please use English as a primary language for building your business plan.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Plan Name: Business Plan (Original) <span className="text-blue-500">{'>'}</span>
            </h2>
          </div>

          <div className="grid grid-cols-5 gap-4 mb-8">
            {/* Business Overview */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                  1
                </div>
                <h3 className="text-base font-semibold text-gray-900">Business<br/>Overview</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">1.1</span>
                    <span className="text-gray-700 text-sm">Description</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Start
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">1.2</span>
                    <span className="text-gray-700 text-sm">Our Values</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Start
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">1.3</span>
                    <span className="text-gray-700 text-sm">Ownership</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Start
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">1.4</span>
                    <span className="text-gray-700 text-sm">Products &<br/>Services</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Start
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">1.5</span>
                    <span className="text-gray-700 text-sm">Intellectual<br/>Property</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Start
                  </button>
                </div>
              </div>
            </div>

            {/* Market Analysis */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                  2
                </div>
                <h3 className="text-base font-semibold text-gray-900">Market<br/>Analysis</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">2.1</span>
                    <span className="text-gray-700 text-sm">Problems<br/>& Solutions</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Start
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">2.2</span>
                    <span className="text-gray-700 text-sm">Target<br/>Market</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Start
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">2.3</span>
                    <span className="text-gray-700 text-sm">Market<br/>Trends</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Start
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">2.4</span>
                    <span className="text-gray-700 text-sm">Target<br/>Customers</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Start
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">2.5</span>
                    <span className="text-gray-700 text-sm">Competition</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Start
                  </button>
                </div>
              </div>
            </div>

            {/* Strategy */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                  3
                </div>
                <h3 className="text-base font-semibold text-gray-900">Strategy</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">3.1</span>
                    <span className="text-gray-700 text-sm">Marketing</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Start
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">3.2</span>
                    <span className="text-gray-700 text-sm">Pricing</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Start
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">3.3</span>
                    <span className="text-gray-700 text-sm">Sales</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Start
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">3.4</span>
                    <span className="text-gray-700 text-sm">Operations</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Start
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">3.5</span>
                    <span className="text-gray-700 text-sm">Team</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Start
                  </button>
                </div>
              </div>
            </div>

            {/* Financials */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                  4
                </div>
                <h3 className="text-base font-semibold text-gray-900">Financials</h3>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">4.1</span>
                    <span className="text-gray-700 text-sm">Financial<br/>Forecast</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Start
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-3">
                  See your Forecast and analyze your future financial projections.
                </p>
                <div className="inline-flex flex-col items-center p-4 border border-blue-200 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg mb-2 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                    </svg>
                  </div>
                  <p className="text-xs text-blue-500 font-medium">
                    Financial<br/>Forecast
                  </p>
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                  5
                </div>
                <h3 className="text-base font-semibold text-gray-900">Executive<br/>Summary</h3>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">5.1</span>
                    <span className="text-gray-700 text-sm">Executive<br/>Summary</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Generate
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-3">
                  See your Forecast and analyze your future financial projections.
                </p>
                <div className="inline-flex flex-col items-center p-4 border border-blue-200 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg mb-2 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                    </svg>
                  </div>
                  <p className="text-xs text-blue-500 font-medium">
                    Generate<br/>Executive<br/>Summary
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={onStartPlan}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Start your business plan
            </button>
            <button
              onClick={onViewPlan}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              View plan
            </button>
          </div>

          <div className="text-center mt-4">
            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
              Share & Downloads Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuestionRenderer: React.FC<{
  question: any;
  value: any;
  onChange: (value: any) => void;
}> = ({ question, value, onChange }) => {
  switch (question.type) {
    case 'text':
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={question.placeholder}
        />
      );
    
    case 'textarea':
      return (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={question.placeholder}
          rows={4}
        />
      );
    
    case 'select':
      return (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select an option</option>
          {question.options.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    
    case 'multi-select':
      return (
        <MultiSelectCards
          options={question.options}
          value={value || []}
          onChange={onChange}
          title={question.label || ''}
          description={question.description || ''}
        />
      );
    
    case 'problem-solution':
      return (
        <ProblemSolutionMapping
          problems={question.problems}
          solutions={value || {}}
          onChange={onChange}
        />
      );
    
    default:
      return <div>Unsupported question type: {question.type}</div>;
  }
};

export default BusinessPlanWizard; 