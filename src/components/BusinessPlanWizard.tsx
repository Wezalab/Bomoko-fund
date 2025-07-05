import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Users, Plus, X } from 'lucide-react';
import businessPlanData from '../constants/businessPlanData.json';

interface WizardData {
  [key: string]: any;
}

const BusinessPlanWizard: React.FC = () => {
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

  if (showWelcome && !isInitialSetup) {
    return <WelcomeModal onContinue={() => setShowWelcome(false)} />;
  }

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
          onClick={onContinue}
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
  const section = businessPlan.sections[currentSection];
  const subsection = section.subsections[currentSubsection];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">Create your business plan with AI</h1>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              Business Plan Wizard
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg">
              Preview Mode
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg">
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b bg-blue-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Business Plan (original)
            </h2>
            <p className="text-gray-600 mb-6">
              Your business plan is organized into chapters, with each chapter containing several sections. 
              To complete your plan, navigate through each chapter and fill in the corresponding sections. 
              Be sure to finish the "Executive Summary" chapter last. You can also customize the cover page as needed.
            </p>
            <p className="text-gray-600">
              Please use English as a primary language for building your business plan.
            </p>

            <div className="grid grid-cols-5 gap-6 mt-8">
              {businessPlan.sections.map((sec: any, index: number) => (
                <div key={sec.id} className="text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-3 mx-auto ${
                      index <= currentSection
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {sec.id}
                  </div>
                  <h3 className="font-semibold text-gray-900">{sec.title}</h3>
                </div>
              ))}
            </div>
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
                <p className="text-gray-600">{section.title}</p>
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

    case 'multi-select':
      return (
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">{field.label}</h3>
          <p className="text-gray-600 text-sm mb-4">{field.description}</p>
          <div className="grid grid-cols-2 gap-3">
            {field.options.map((option: string) => {
              const isSelected = value?.includes(option) || false;
              return (
                <button
                  key={option}
                  onClick={() => {
                    const currentValues = value || [];
                    if (isSelected) {
                      onChange(currentValues.filter((v: string) => v !== option));
                    } else {
                      onChange([...currentValues, option]);
                    }
                  }}
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
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

    default:
      return <div>Unsupported field type: {field.type}</div>;
  }
};

export default BusinessPlanWizard; 