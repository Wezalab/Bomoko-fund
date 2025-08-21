import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, FileText, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/userSlice';
import { useTranslation } from '@/lib/TranslationContext';
import InitialSetupValidation from './InitialSetupValidation';
import BusinessPlanViews from './BusinessPlanViews';

interface ExtendedUser {
  _id: string;
  name?: string;
  email?: string;
}

interface BusinessPlanLayoutProps {
  onBack?: () => void;
}

const BusinessPlanLayout: React.FC<BusinessPlanLayoutProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser) as ExtendedUser;
  const { t } = useTranslation();

  // State management
  const [initialSetupComplete, setInitialSetupComplete] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [planData, setPlanData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load BusinessPlanWizard data
  useEffect(() => {
    const loadWizardData = () => {
      try {
        const savedData = localStorage.getItem('businessPlanWizardData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setPlanData(parsedData);
          console.log('BusinessPlanLayout - Loaded wizard data:', parsedData);
          
          // Simulate initial validation
          setTimeout(() => {
            setIsValidating(false);
          }, 1000);
        } else {
          console.log('BusinessPlanLayout - No wizard data found');
          setIsValidating(false);
        }
      } catch (error) {
        console.error('Error loading wizard data:', error);
        setIsValidating(false);
      }
    };

    loadWizardData();
  }, []);

  // Handle validation completion
  const handleValidationComplete = (isValid: boolean, validatedData: any) => {
    setValidationResults({ isValid, data: validatedData });
    if (isValid) {
      setInitialSetupComplete(true);
    }
  };

  // Handle business plan save
  const handleSavePlan = async () => {
    if (!validationResults?.isValid) {
      console.error('Cannot save plan - validation failed');
      return;
    }

    setIsSaving(true);
    try {
      // Here you would call your API to save the business plan
      console.log('Saving business plan with data:', validationResults.data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful save
      setSaveSuccess(true);
      setInitialSetupComplete(true);
      
      // Show success message briefly
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
      console.log('Business plan saved successfully');
    } catch (error) {
      console.error('Error saving business plan:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle section content updates
  const handleSectionUpdate = (sectionId: string, content: string) => {
    console.log('Section updated:', sectionId, content);
    // Here you would update the section in your state/API
  };

  // Handle subsection content updates
  const handleSubsectionUpdate = (sectionId: string, subsectionId: string, content: string) => {
    console.log('Subsection updated:', sectionId, subsectionId, content);
    // Here you would update the subsection in your state/API
  };

  // Handle back navigation
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/dashboard');
    }
  };

  // Loading state
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">{t('loadingPlan') || 'Chargement du plan...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {initialSetupComplete 
                    ? (t('businessPlan') || 'Plan d\'affaires')
                    : (t('initialSetup') || 'Configuration initiale')
                  }
                </h1>
                <p className="text-sm text-gray-600">
                  {initialSetupComplete
                    ? (t('editYourPlan') || 'Modifiez et personnalisez votre plan d\'affaires')
                    : (t('completeSetup') || 'Complétez la configuration pour débloquer votre plan')
                  }
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center space-x-3">
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 rounded-full"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {t('planSaved') || 'Plan sauvegardé'}
                  </span>
                </motion.div>
              )}
              
              {initialSetupComplete && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {t('planUnlocked') || 'Plan débloqué'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {!initialSetupComplete ? (
            <motion.div
              key="validation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <InitialSetupValidation
                formData={planData || {}}
                onValidationComplete={handleValidationComplete}
                onSavePlan={handleSavePlan}
              />
            </motion.div>
          ) : (
            <motion.div
              key="plan-views"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-[calc(100vh-12rem)]"
            >
              <div className="bg-white rounded-lg border border-gray-200 h-full">
                <BusinessPlanViews
                  initialSetupComplete={initialSetupComplete}
                  planData={planData}
                  onSectionUpdate={handleSectionUpdate}
                  onSubsectionUpdate={handleSubsectionUpdate}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Saving Overlay */}
      <AnimatePresence>
        {isSaving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
            >
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('savingPlan') || 'Sauvegarde du plan...'}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('pleaseWait') || 'Veuillez patienter pendant que nous sauvegardons votre plan d\'affaires.'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BusinessPlanLayout;
