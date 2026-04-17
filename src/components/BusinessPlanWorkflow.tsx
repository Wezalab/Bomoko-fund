import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/lib/TranslationContext';
import BusinessPlanWizard from './BusinessPlanWizard';
import BusinessPlanEditor from './businessPlan/BusinessPlanEditor';

interface Step {
  number: number;
  title: string;
  subtitle: string;
  status: 'pending' | 'active' | 'completed';
}

const BusinessPlanWorkflow: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSetupCompleted, setIsSetupCompleted] = useState(false);

  const steps: Step[] = [
    {
      number: 1,
      title: t('Setup Business Plan'),
      subtitle: t('Complete the initial questionnaire to set up your business plan structure'),
      status: currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : 'pending'
    },
    {
      number: 2, 
      title: t('Complete Business Plan'),
      subtitle: t('Fill in all sections and chapters of your business plan'),
      status: currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : 'pending'
    },
    {
      number: 3,
      title: t('Download Business Plan'),
      subtitle: t('Export and download your completed business plan'),
      status: currentStep === 3 ? 'active' : 'pending'
    }
  ];

  const handleSetupComplete = () => {
    setIsSetupCompleted(true);
    // Redirect to the business plan setup page
    navigate('/business-plan/setup');
  };

  const handlePlanComplete = () => {
    setCurrentStep(3);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/dashboard');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-4">
                {isSetupCompleted ? t('STEP 1 - COMPLETED') : t('STEP 1 - IN PROGRESS')}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {t('Setup')} <span className="text-gray-600">{t('Business Plan')}</span>
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t('The type of business venture you\'re involved with on and the kind of business plan you intend to create dictate the chapters included. The system has selected the most appropriate chapters and sub-sections for you, but you have the option to modify, add, or remove chapters as necessary.')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">{t('Business Settings')}</h3>
                  <p className="text-sm text-gray-600">{t('Modify fundamental details such as the business name, location and language.')}</p>
                </div>
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                  ⚙️
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">{t('Business Plan Setup')}</h3>
                  <p className="text-sm text-gray-600">{t('Altering your answers to the setup questions will modify the plan structure but no data will be lost.')}</p>
                </div>
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                  📋
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">{t('New Plan / Business')}</h3>
                  <p className="text-sm text-gray-600">{t('You can create additional plans for this business or other businesses from the main menu.')}</p>
                </div>
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                  ➕
                </div>
              </div>
            </div>

            {!isSetupCompleted && (
              <BusinessPlanWizard onComplete={handleSetupComplete} />
            )}

            {isSetupCompleted && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                  ✓
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{t('Setup Complete!')}</h3>
                <p className="text-gray-600">{t('Your business plan structure has been created.')}</p>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('Continue to Complete Business Plan')}
                </button>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-4">
                {t('STEP 2')}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {t('Complete')} <span className="text-gray-600">{t('Business Plan')}</span>
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t('Each chapter in your business plan is listed below, every chapter has multiple sections. To finalise your business plan, enter each chapter and complete the sections within. The \'Executive Summary\' chapter should be completed last. You can also select and modify the cover page.')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border">
              <BusinessPlanEditor onComplete={handlePlanComplete} />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-4">
                {t('STEP 3')}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {t('Download')} <span className="text-gray-600">{t('Business Plan')}</span>
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t('After completing the chapters above, click below to download your business plan.')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-8 text-center space-y-6">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl">
                📄
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('Your Business Plan is Ready!')}</h3>
                <p className="text-gray-600">{t('Download your professionally formatted business plan document.')}</p>
              </div>

              <div className="space-y-4">
                <button className="w-full max-w-md px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg">
                  {t('Download Business Plan (PDF)')}
                </button>
                
                <button className="w-full max-w-md px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  {t('Upgrade Account')}
                </button>
                
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full max-w-md px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors font-semibold"
                >
                  {t('Return to Dashboard')}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Steps */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('back')}
            </button>

            {/* Step Progress */}
            <div className="flex items-center space-x-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                        step.status === 'completed'
                          ? 'bg-green-600 text-white'
                          : step.status === 'active'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {step.status === 'completed' ? '✓' : step.number}
                    </div>
                    <div className="ml-3">
                      <div className={`font-medium ${step.status === 'active' ? 'text-blue-600' : 'text-gray-900'}`}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-16 h-0.5 bg-gray-200 ml-4"></div>
                  )}
                </div>
              ))}
            </div>

            <div className="w-16"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default BusinessPlanWorkflow; 