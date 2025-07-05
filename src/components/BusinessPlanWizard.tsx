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
    <BusinessPlanBuilder
      businessPlan={businessPlan}
      currentSection={currentSection}
      currentSubsection={currentSubsection}
      wizardData={wizardData}
      onUpdateData={updateWizardData}
      onNext={handleNextStep}
      onPrev={handlePrevStep}
      onSectionChange={setCurrentSection}
      onSubsectionChange={setCurrentSubsection}
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
                  className={`w-2 h-2 rounded-full ${
                    index <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={onNext}
              className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
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
    case 'single-choice':
      return (
        <div className="space-y-3">
          {question.options.map((option: string) => (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`w-full p-4 text-left border rounded-lg transition-colors ${
                value === option
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      );

    case 'text':
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          className="w-full p-4 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
        />
      );

    case 'month-year':
      return (
        <input
          type="month"
          value={value || '2025-05'}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
        />
      );

    case 'user-management':
      return (
        <div className="space-y-4">
          <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-blue-500 hover:border-blue-400 flex items-center justify-center">
            <Users className="w-5 h-5 mr-2" />
            Add user +
          </button>
        </div>
      );

    default:
      return <div>Unsupported question type</div>;
  }
};

const BusinessPlanBuilder: React.FC<{
  businessPlan: any;
  currentSection: number;
  currentSubsection: number;
  wizardData: WizardData;
  onUpdateData: (key: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
  onSectionChange: (section: number) => void;
  onSubsectionChange: (subsection: number) => void;
}> = ({
  businessPlan,
  currentSection,
  currentSubsection,
  wizardData,
  onUpdateData,
  onNext,
  onPrev,
  onSectionChange,
  onSubsectionChange
}) => {
  const navigate = useNavigate();
  const [showOverview, setShowOverview] = useState(true);

  // Business plan sections for overview
  const planSections = [
    {
      id: 'business-overview',
      title: 'Business Overview',
      number: '1',
      subsections: [
        { title: 'Description', id: 'description' },
        { title: 'Our Values', id: 'values' },
        { title: 'Ownership', id: 'ownership' },
        { title: 'Products & Services', id: 'products' },
        { title: 'Intellectual Property', id: 'ip' }
      ]
    },
    {
      id: 'market-analysis',
      title: 'Market Analysis',
      number: '2',
      subsections: [
        { title: 'Problems & Solutions', id: 'problems' },
        { title: 'Target Market', id: 'target-market' },
        { title: 'Market Trends', id: 'trends' },
        { title: 'Target Customers', id: 'customers' },
        { title: 'Competition', id: 'competition' }
      ]
    },
    {
      id: 'strategy',
      title: 'Strategy',
      number: '3',
      subsections: [
        { title: 'Marketing', id: 'marketing' },
        { title: 'Pricing', id: 'pricing' },
        { title: 'Sales', id: 'sales' },
        { title: 'Operations', id: 'operations' },
        { title: 'Team', id: 'team' }
      ]
    },
    {
      id: 'financials',
      title: 'Financials',
      number: '4',
      subsections: [
        { title: 'Financial Forecast', id: 'forecast' }
      ]
    },
    {
      id: 'executive-summary',
      title: 'Executive Summary',
      number: '5',
      subsections: [
        { title: 'Generate Executive Summary', id: 'summary' }
      ]
    }
  ];

  const handleViewPlan = () => {
    // Store wizard data in localStorage to pass to editor
    localStorage.setItem('businessPlanWizardData', JSON.stringify(wizardData));
    navigate('/business-plan/editor');
  };

  if (showOverview) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Create your business plan with AI</h1>
            <p className="text-gray-600 max-w-4xl mx-auto mb-2">
              Your business plan is organized into chapters, with each chapter containing several sections. To complete your plan, navigate through each chapter and fill in the corresponding sections. Be sure to finish the "Executive Summary" chapter last. You can also customize the cover page as needed.
            </p>
            <p className="text-gray-600 font-medium">
              Please use English as a primary language for building your business plan.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Plan Name: Business Plan (Original) <span className="text-blue-500">{'>'}</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              {planSections.map((section, index) => (
                <div key={section.id} className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">
                      {section.number}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {section.subsections.map((subsection, subIndex) => (
                      <div key={subsection.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-blue-500 font-medium text-sm mr-2">
                            {section.number}.{subIndex + 1}
                          </span>
                          <span className="text-gray-700 text-sm">{subsection.title}</span>
                        </div>
                        <button 
                          onClick={() => setShowOverview(false)}
                          className="px-3 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors"
                        >
                          Start
                        </button>
                      </div>
                    ))}
                  </div>

                  {(section.id === 'financials' || section.id === 'executive-summary') && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-3">
                        See your Forecast and analyze your future financial projections.
                      </p>
                      <div className="flex justify-center">
                        <div className="p-4 border border-blue-200 rounded-lg">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                            <span className="text-blue-500 text-lg">📊</span>
                          </div>
                          <p className="text-xs text-blue-500 font-medium text-center">
                            {section.id === 'financials' ? 'Financial\nForecast' : 'Generate\nExecutive\nSummary'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowOverview(false)}
                className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Start your business plan
              </button>
              <button
                onClick={handleViewPlan}
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
  }

  // Show the detailed section editing when not in overview
  const section = businessPlan.sections[currentSection];
  const subsection = section.subsections[currentSubsection];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">Create your business plan with AI</h1>
          <div className="flex space-x-4">
            <button 
              onClick={() => setShowOverview(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Back to Overview
            </button>
            <button 
              onClick={handleViewPlan}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              View Plan
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b bg-blue-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>
            <p className="text-gray-600">
              {section.description}
            </p>
          </div>

          <div className="flex">
            <div className="w-1/3 bg-gray-50 p-6">
              <div className="space-y-2">
                {section.subsections.map((sub: any, index: number) => (
                  <button
                    key={sub.id}
                    onClick={() => onSubsectionChange(index)}
                    className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${
                      index === currentSubsection
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span>{sub.id} {sub.title}</span>
                    {index === currentSubsection && (
                      <span className="bg-white text-blue-500 px-2 py-1 rounded text-sm">
                        Start
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-2/3 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {subsection.id} {subsection.title}
                </h2>
                <p className="text-gray-600">{subsection.description}</p>
              </div>

              <SubsectionRenderer
                subsection={subsection}
                data={wizardData}
                onUpdate={onUpdateData}
              />

              <div className="flex justify-between mt-8">
                <button
                  onClick={onPrev}
                  className="flex items-center px-4 py-2 text-gray-600"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous Section
                </button>

                <button
                  onClick={onNext}
                  className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Next Section
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SubsectionRenderer: React.FC<{
  subsection: any;
  data: WizardData;
  onUpdate: (key: string, value: any) => void;
}> = ({ subsection, data, onUpdate }) => {
  if (!subsection.fields) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">This section is under construction.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {subsection.fields.map((field: any, index: number) => (
        <FieldRenderer
          key={index}
          field={field}
          value={data[`${subsection.id}_field_${index}`]}
          onChange={(value) => onUpdate(`${subsection.id}_field_${index}`, value)}
        />
      ))}
    </div>
  );
};

const FieldRenderer: React.FC<{
  field: any;
  value: any;
  onChange: (value: any) => void;
}> = ({ field, value, onChange }) => {
  switch (field.type) {
    case 'text':
      return (
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">{field.label}</h3>
          <p className="text-gray-600 text-sm mb-3">{field.description}</p>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>
      );

    case 'textarea':
      return (
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">{field.label}</h3>
          <p className="text-gray-600 text-sm mb-3">{field.description}</p>
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>
      );

    case 'single-select':
      return (
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">{field.label}</h3>
          <p className="text-gray-600 text-sm mb-4">{field.description}</p>
          <div className="space-y-3">
            {field.options.map((option: string) => (
              <button
                key={option}
                onClick={() => onChange(option)}
                className={`w-full p-4 text-left border rounded-lg transition-colors ${
                  value === option
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );

    case 'multi-select':
      return (
        <MultiSelectCards
          options={field.options}
          value={value || []}
          onChange={onChange}
          maxSelection={field.maxSelection}
          title={field.label}
          description={field.description}
        />
      );

    case 'multi-text':
      return (
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">{field.label}</h3>
          <p className="text-gray-600 text-sm mb-4">{field.description}</p>
          <div className="space-y-3">
            {field.options?.map((option: string, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <input
                  type="text"
                  value={option}
                  readOnly
                  className="w-full bg-transparent border-none focus:outline-none"
                />
              </div>
            ))}
          </div>
          <button className="mt-3 flex items-center text-blue-500 hover:text-blue-600">
            <Plus className="w-4 h-4 mr-1" />
            Add More
          </button>
        </div>
      );

    case 'location':
      return (
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">{field.label}</h3>
          <p className="text-gray-600 text-sm mb-3">{field.description}</p>
          <div className="grid grid-cols-3 gap-4">
            {field.fields.map((fieldName: string) => (
              <input
                key={fieldName}
                type="text"
                placeholder={fieldName}
                value={value?.[fieldName] || ''}
                onChange={(e) => onChange({
                  ...value,
                  [fieldName]: e.target.value
                })}
                className="p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            ))}
          </div>
        </div>
      );

    case 'date':
      return (
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">{field.label}</h3>
          <p className="text-gray-600 text-sm mb-3">{field.description}</p>
          <div className="grid grid-cols-2 gap-4">
            {field.fields.map((fieldName: string) => (
              <input
                key={fieldName}
                type={fieldName.toLowerCase() === 'month' ? 'text' : 'number'}
                placeholder={fieldName === 'Month' ? 'Month in text format, e.g. January' : 'Year in number format, e.g. 2024'}
                value={value?.[fieldName] || ''}
                onChange={(e) => onChange({
                  ...value,
                  [fieldName]: e.target.value
                })}
                className="p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            ))}
          </div>
        </div>
      );

    case 'ownership-table':
      return (
        <OwnershipTable
          owners={value || []}
          onChange={onChange}
        />
      );

    case 'ip-management':
      return (
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">{field.label}</h3>
          <p className="text-gray-600 text-sm mb-4">{field.description}</p>
          
          <div className="mb-4">
            <h4 className="font-medium mb-3">Intellectual Property 1</h4>
            <div className="grid grid-cols-5 gap-3 mb-4">
              {field.types.map((type: string) => (
                <button
                  key={type}
                  onClick={() => onChange({
                    ...value,
                    selectedType: type
                  })}
                  className={`p-3 text-center border rounded-lg transition-colors ${
                    value?.selectedType === type
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                How will you name this intellectual property in your business plan?
              </label>
              <input
                type="text"
                placeholder="IP Name"
                value={value?.name || ''}
                onChange={(e) => onChange({
                  ...value,
                  name: e.target.value
                })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                placeholder="IP Description"
                value={value?.description || ''}
                onChange={(e) => onChange({
                  ...value,
                  description: e.target.value
                })}
                rows={3}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      );

    case 'problem-solution-mapping':
      return (
        <ProblemSolutionMapping
          problems={field.problems || []}
          solutions={value || {}}
          onChange={onChange}
        />
      );

    case 'competitor-matrix':
      return (
        <CompetitorMatrix
          competitors={field.competitors || []}
          factors={field.factors || []}
          ratings={value || {}}
          onChange={onChange}
        />
      );

    case 'location-table':
      return (
        <LocationTable
          locations={value || []}
          onChange={onChange}
        />
      );

    default:
      return <div>Unsupported field type: {field.type}</div>;
  }
};

export default BusinessPlanWizard; 