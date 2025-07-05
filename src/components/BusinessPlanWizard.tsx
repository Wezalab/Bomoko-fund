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
import { generateDomainSpecificOptions, generateSectionQuestions } from '../lib/groqService';

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

  // Reset wizard state on component mount to ensure fresh start
  React.useEffect(() => {
    setCurrentStep(0);
    setIsInitialSetup(true);
    setWizardData({});
  }, []);

  const initialQuestions = businessPlanData.initialQuestions;
  const businessPlan = businessPlanData.businessPlanStructure;

  // Debug logging
  console.log('BusinessPlanWizard rendered with:', {
    initialQuestionsLength: initialQuestions?.length,
    businessPlanData: businessPlanData,
    isInitialSetup,
    currentStep
  });

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
      }
    } else {
      // Handle business plan navigation - work with section IDs, not indices
      const section = businessPlan.sections.find((s: any) => s.id === currentSection);
      if (!section) return;
      
      if (currentSubsection < section.subsections.length - 1) {
        setCurrentSubsection(currentSubsection + 1);
      } else {
        // Find next section
        const currentIndex = businessPlan.sections.findIndex((s: any) => s.id === currentSection);
        if (currentIndex < businessPlan.sections.length - 1) {
          const nextSection = businessPlan.sections[currentIndex + 1];
          setCurrentSection(nextSection.id);
          setCurrentSubsection(0);
        }
      }
    }
  };

  const handlePrevStep = () => {
    if (isInitialSetup) {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    } else {
      // Handle business plan navigation - work with section IDs, not indices
      if (currentSubsection > 0) {
        setCurrentSubsection(currentSubsection - 1);
      } else {
        // Find previous section
        const currentIndex = businessPlan.sections.findIndex((s: any) => s.id === currentSection);
        if (currentIndex > 0) {
          const prevSection = businessPlan.sections[currentIndex - 1];
          setCurrentSection(prevSection.id);
          setCurrentSubsection(prevSection.subsections.length - 1);
        }
      }
    }
  };

  // Toujours commencer par le setup initial
  if (isInitialSetup && initialQuestions && initialQuestions.length > 0) {
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

  // Si on a terminé le setup initial, montrer l'aperçu ou les sections du plan
  if (!isInitialSetup) {
    // Si on n'a pas encore commencé l'évaluation des sections (currentSection === 0)
    const isInSectionEvaluation = currentSection > 0 || currentSubsection > 0;
    
    if (!isInSectionEvaluation) {
      return (
        <BusinessPlanOverview
          wizardData={wizardData}
          onStartPlan={() => {
            console.log('Commencer l\'évaluation des sections du plan d\'affaires');
            setCurrentSection(1); // Commencer à la première section (id: 1)
            setCurrentSubsection(0); // Première sous-section
          }}
          onViewPlan={() => {
            localStorage.setItem('businessPlanWizardData', JSON.stringify(wizardData));
            navigate('/business-plan/editor');
          }}
        />
      );
    } else {
      // Dans l'évaluation des sections du businessPlanStructure
      return (
        <BusinessPlanSectionWizard
          businessPlan={businessPlan}
          currentSection={currentSection}
          currentSubsection={currentSubsection}
          wizardData={wizardData}
          onUpdateData={updateWizardData}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
          onNavigateToSubsection={(subsectionIndex: number) => {
            setCurrentSubsection(subsectionIndex);
          }}
          onFinish={() => {
            localStorage.setItem('businessPlanWizardData', JSON.stringify(wizardData));
            navigate('/business-plan/editor');
          }}
        />
      );
    }
  }

  // État de chargement par défaut
  return (
    <div className="bg-gray-50 py-20 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Chargement...</h2>
        <p className="text-gray-600">Préparation de votre assistant de plan d'affaires</p>
      </div>
    </div>
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
                          <span className="text-white font-bold text-xl">B</span>
          </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue chez Bomoko Fund !</h2>
                      <p className="text-gray-600 mb-4">Nous sommes ravis de vous accueillir !</p>
            <p className="text-gray-600 mb-6">Créez votre plan d'affaires professionnel avec l'aide de notre IA et accédez au financement participatif.</p>
        </div>
        
        <div className="mb-6">
                      <img src="/api/placeholder/400/200" alt="Aperçu Bomoko Fund" className="w-full rounded-lg" />
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Si vous avez des questions, notre équipe de support est là pour vous aider ou consultez notre centre d'aide pour des conseils. Nous offrons également un chat en direct pendant nos heures d'ouverture
          </p>
        </div>
        
        <button
          onClick={handleGetStarted}
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          Commencer
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
  // Debug logging
  console.log('InitialSetupWizard rendered with:', {
    questionsLength: questions?.length,
    currentStep,
    questionsData: questions
  });

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Chargement des questions...</h2>
            <p className="text-gray-600">Veuillez patienter pendant que nous chargeons vos questions.</p>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentStep];

  if (!question) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Erreur</h2>
            <p className="text-gray-600">Question non trouvée pour l'étape {currentStep + 1}</p>
            <p className="text-gray-500 text-sm mt-2">Questions disponibles: {questions.length}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-500 mb-2">Commençons !</h1>
          <p className="text-gray-600">Veuillez répondre à 9 questions rapides pour personnaliser votre plan.</p>
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
              Précédent
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
              {currentStep === questions.length - 1 ? 'Terminer' : 'Suivant'}
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
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Créez votre plan d'affaires avec l'IA</h1>
          <p className="text-gray-600 max-w-4xl mx-auto mb-2">
            Votre plan d'affaires est organisé en chapitres, chaque chapitre contenant plusieurs sections. Pour compléter votre plan, naviguez à travers chaque chapitre et remplissez les sections correspondantes. Assurez-vous de terminer le chapitre "Résumé exécutif" en dernier. Vous pouvez également personnaliser la page de couverture selon vos besoins.
          </p>
          <p className="text-gray-600 font-medium">
            Veuillez utiliser le français comme langue principale pour la création de votre plan d'affaires.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Nom du plan : Plan d'affaires (Original) <span className="text-blue-500">{'>'}</span>
            </h2>
          </div>

          <div className="grid grid-cols-5 gap-4 mb-8">
            {/* Aperçu de l'entreprise */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                  1
                </div>
                <h3 className="text-base font-semibold text-gray-900">Aperçu de<br/>l'entreprise</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">1.1</span>
                    <span className="text-gray-700 text-sm">Description</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Commencer
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">1.2</span>
                    <span className="text-gray-700 text-sm">Nos valeurs</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Commencer
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">1.3</span>
                    <span className="text-gray-700 text-sm">Propriété</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Commencer
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">1.4</span>
                    <span className="text-gray-700 text-sm">Produits et<br/>services</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Commencer
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">1.5</span>
                    <span className="text-gray-700 text-sm">Propriété<br/>intellectuelle</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Commencer
                  </button>
                </div>
              </div>
            </div>

            {/* Analyse du marché */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                  2
                </div>
                <h3 className="text-base font-semibold text-gray-900">Analyse du<br/>marché</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">2.1</span>
                    <span className="text-gray-700 text-sm">Problèmes et<br/>solutions</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Commencer
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">2.2</span>
                    <span className="text-gray-700 text-sm">Marché<br/>cible</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Commencer
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">2.3</span>
                    <span className="text-gray-700 text-sm">Tendances<br/>du marché</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Commencer
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">2.4</span>
                    <span className="text-gray-700 text-sm">Clients<br/>cibles</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Commencer
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">2.5</span>
                    <span className="text-gray-700 text-sm">Concurrence</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Commencer
                  </button>
                </div>
              </div>
            </div>

            {/* Stratégie */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                  3
                </div>
                <h3 className="text-base font-semibold text-gray-900">Stratégie</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">3.1</span>
                    <span className="text-gray-700 text-sm">Marketing</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Commencer
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">3.2</span>
                    <span className="text-gray-700 text-sm">Tarification</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Commencer
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">3.3</span>
                    <span className="text-gray-700 text-sm">Ventes</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Commencer
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">3.4</span>
                    <span className="text-gray-700 text-sm">Opérations</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Commencer
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">3.5</span>
                    <span className="text-gray-700 text-sm">Équipe</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Commencer
                  </button>
                </div>
              </div>
            </div>

            {/* Financier */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                  4
                </div>
                <h3 className="text-base font-semibold text-gray-900">Financier</h3>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">4.1</span>
                    <span className="text-gray-700 text-sm">Prévisions<br/>financières</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Commencer
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Consultez vos prévisions et analysez vos projections financières futures.
                </p>
                <div className="inline-flex flex-col items-center p-4 border border-blue-200 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg mb-2 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                    </svg>
                  </div>
                  <p className="text-xs text-blue-500 font-medium">
                    Prévisions<br/>financières
                  </p>
                </div>
              </div>
            </div>

            {/* Résumé exécutif */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                  5
                </div>
                <h3 className="text-base font-semibold text-gray-900">Résumé<br/>exécutif</h3>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-medium text-sm mr-2">5.1</span>
                    <span className="text-gray-700 text-sm">Résumé<br/>exécutif</span>
                  </div>
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 transition-colors">
                    Générer
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Consultez vos prévisions et analysez vos projections financières futures.
                </p>
                <div className="inline-flex flex-col items-center p-4 border border-blue-200 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg mb-2 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                    </svg>
                  </div>
                  <p className="text-xs text-blue-500 font-medium">
                    Générer<br/>résumé<br/>exécutif
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
              Commencer votre plan d'affaires
            </button>
            <button
              onClick={onViewPlan}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Voir le plan
            </button>
          </div>

          <div className="text-center mt-4">
            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
              Partager et télécharger le plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BusinessPlanSectionWizard: React.FC<{
  businessPlan: any;
  currentSection: number;
  currentSubsection: number;
  wizardData: WizardData;
  onUpdateData: (key: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
  onNavigateToSubsection: (subsectionIndex: number) => void;
  onFinish: () => void;
}> = ({ businessPlan, currentSection, currentSubsection, wizardData, onUpdateData, onNext, onPrev, onNavigateToSubsection, onFinish }) => {
  const navigate = useNavigate();
  const [isGeneratingOptions, setIsGeneratingOptions] = useState(false);
  const [dynamicFields, setDynamicFields] = useState<any[]>([]);
  const [hasGeneratedContent, setHasGeneratedContent] = useState(false);
  
  console.log('BusinessPlanSectionWizard rendered with:', {
    currentSection,
    currentSubsection,
    businessPlanSections: businessPlan?.sections?.length
  });

  // Fonction pour obtenir le domaine d'activité depuis les données du wizard
  const getBusinessDomain = () => {
    // Rechercher la réponse à "Que fait l'entreprise ?" dans les données du wizard
    // Cette réponse est généralement dans section_1_0_field_1 (section 1, subsection 0, champ 1)
    const businessDomainFromWizard = wizardData['section_1_0_field_1'] || 
                                     wizardData.question_3 || // Secteur d'activité du setup initial
                                     '';
    
    // Si le domaine est vide ou générique, retourner une valeur par défaut
    if (!businessDomainFromWizard || businessDomainFromWizard.trim() === '') {
      return 'commerce général';
    }
    
    return businessDomainFromWizard.trim();
  };

  // Fonction pour générer des questions et options spécifiques au domaine
  const generateDynamicContent = async () => {
    const businessDomain = getBusinessDomain();
    if (!businessDomain || businessDomain === 'commerce général') return;

    setIsGeneratingOptions(true);
    
    try {
      const section = businessPlan.sections.find((s: any) => s.id === currentSection);
      const subsection = section?.subsections[currentSubsection];
      
      if (!subsection) return;

      // Générer des questions spécifiques au domaine
      const generatedQuestions = await generateSectionQuestions(
        businessDomain,
        section.title,
        subsection.title
      );

      // Générer des options pour les questions existantes qui ont des options
      const enhancedFields = await Promise.all(
        (subsection.fields || []).map(async (field: any) => {
          if (field.type === 'multi-select' || field.type === 'single-choice') {
            const generatedOptions = await generateDomainSpecificOptions(
              businessDomain,
              field.type,
              field.label,
              section.title
            );
            
            return {
              ...field,
              options: generatedOptions.length > 0 ? generatedOptions : field.options
            };
          }
          return field;
        })
      );

      // Combiner les champs existants avec les questions générées
      const combinedFields = [
        ...enhancedFields,
        ...generatedQuestions.map((q: any) => ({
          ...q,
          isGenerated: true
        }))
      ];

      setDynamicFields(combinedFields);
      setHasGeneratedContent(true);
      
    } catch (error) {
      console.error('Error generating dynamic content:', error);
    } finally {
      setIsGeneratingOptions(false);
    }
  };

  // Fonction pour regénérer les options
  const regenerateOptions = async () => {
    await generateDynamicContent();
  };

  // Réinitialiser les champs dynamiques quand on change de section/sous-section
  useEffect(() => {
    setDynamicFields([]);
    setHasGeneratedContent(false);
  }, [currentSection, currentSubsection]);

  // Générer automatiquement le contenu si le domaine d'activité est renseigné
  useEffect(() => {
    const businessDomain = getBusinessDomain();
    const shouldGenerate = businessDomain && 
                          businessDomain !== 'commerce général' && 
                          !hasGeneratedContent &&
                          !isGeneratingOptions;
    
    if (shouldGenerate) {
      generateDynamicContent();
    }
  }, [wizardData['section_1_0_field_1'], hasGeneratedContent]);

  if (!businessPlan || !businessPlan.sections) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Erreur</h2>
            <p className="text-gray-600">Structure du plan d'affaires non trouvée</p>
          </div>
        </div>
      </div>
    );
  }

  const section = businessPlan.sections.find((s: any) => s.id === currentSection);
  if (!section) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Section non trouvée</h2>
            <p className="text-gray-600">Section {currentSection} introuvable</p>
            <button
              onClick={onFinish}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Terminer et voir le plan
            </button>
          </div>
        </div>
      </div>
    );
  }

  const subsection = section.subsections[currentSubsection];
  if (!subsection) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sous-section non trouvée</h2>
            <p className="text-gray-600">Sous-section {currentSubsection} de la section "{section.title}" introuvable</p>
            <button
              onClick={onNext}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Section suivante
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentSectionIndex = businessPlan.sections.findIndex((s: any) => s.id === currentSection);
  const isLastSection = currentSectionIndex === businessPlan.sections.length - 1;
  const isLastSubsection = currentSubsection === section.subsections.length - 1;

  // Function to check if a subsection is completed
  const isSubsectionCompleted = (subsectionIndex: number) => {
    const subsectionToCheck = section.subsections[subsectionIndex];
    if (!subsectionToCheck?.fields) return false;
    
    return subsectionToCheck.fields.every((field: any, fieldIndex: number) => {
      const fieldKey = `section_${currentSection}_${subsectionIndex}_field_${fieldIndex}`;
      const value = wizardData[fieldKey];
      return value !== undefined && value !== null && value !== '';
    });
  };

  // Function to check if a subsection has been started
  const isSubsectionStarted = (subsectionIndex: number) => {
    const subsectionToCheck = section.subsections[subsectionIndex];
    if (!subsectionToCheck?.fields) return false;
    
    return subsectionToCheck.fields.some((field: any, fieldIndex: number) => {
      const fieldKey = `section_${currentSection}_${subsectionIndex}_field_${fieldIndex}`;
      const value = wizardData[fieldKey];
      return value !== undefined && value !== null && value !== '';
    });
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-8 mb-8 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-6">
                <span className="text-6xl font-bold text-blue-400 opacity-60">{subsection.id}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{subsection.title}</h1>
                <p className="text-gray-600 text-lg">{section.title}</p>
                {subsection.description && (
                  <p className="text-gray-700 mt-3 max-w-2xl">{subsection.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Indicateur du domaine d'activité */}
              <div className={`text-sm px-3 py-1 rounded-full ${
                getBusinessDomain() === 'commerce général' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                Domaine: <span className="font-medium">{getBusinessDomain()}</span>
                {getBusinessDomain() === 'commerce général' && (
                  <span className="ml-2 text-xs">(Obligatoire pour la génération IA)</span>
                )}
              </div>
              
              {/* Bouton Regenerate options - seulement si le domaine est spécifié */}
              {getBusinessDomain() !== 'commerce général' && (
                <button
                  onClick={regenerateOptions}
                  disabled={isGeneratingOptions}
                  className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg 
                    className={`w-4 h-4 mr-2 ${isGeneratingOptions ? 'animate-spin' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {isGeneratingOptions ? 'Génération...' : 'Regenerate options'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-lg shadow-lg p-8">

            {/* Indicateur de génération */}
            {isGeneratingOptions && (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Génération de questions personnalisées pour votre domaine d'activité...</p>
              </div>
            )}

            {/* Utiliser les champs dynamiques si disponibles, sinon les champs statiques */}
            {!isGeneratingOptions && (
              (dynamicFields.length > 0 ? dynamicFields : subsection.fields || []).length > 0 ? (
                <div className="space-y-6">
                  {(dynamicFields.length > 0 ? dynamicFields : subsection.fields || []).map((field: any, index: number) => (
                    <div key={index}>
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-gray-500 text-sm">{index + 1}</span>
                        </div>
                        <label className="block text-sm font-medium text-gray-700">
                          {field.label}
                          {field.isGenerated && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              IA
                            </span>
                          )}
                        </label>
                      </div>
                      {field.description && (
                        <p className="text-sm text-gray-500 mb-3 ml-9">{field.description}</p>
                      )}
                      <div className="ml-9">
                        <QuestionRenderer
                          question={field}
                          value={wizardData[`section_${currentSection}_${currentSubsection}_field_${index}`]}
                          onChange={(value) => onUpdateData(`section_${currentSection}_${currentSubsection}_field_${index}`, value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Cette section n'a pas de champs à remplir pour le moment.</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Renseignez votre domaine d'activité dans "Que fait l'entreprise ?" pour obtenir des questions personnalisées.
                  </p>
                </div>
              )
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={onPrev}
                disabled={currentSectionIndex === 0 && currentSubsection === 0}
                className="flex items-center px-4 py-2 text-gray-600 disabled:opacity-50 hover:text-gray-800"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Précédent
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  {currentSubsection + 1} sur {section.subsections.length} sous-sections
                </p>
              </div>

              <button
                onClick={isLastSection && isLastSubsection ? onFinish : onNext}
                className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {isLastSection && isLastSubsection ? 'Terminer' : 'Suivant'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Right Sidebar - Overview Panel */}
          <div className="w-80 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
            
            <div className="space-y-3 mb-6">
              {section.subsections.map((subsectionItem: any, index: number) => {
                const completed = isSubsectionCompleted(index);
                const started = isSubsectionStarted(index);
                const isCurrent = index === currentSubsection;
                
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isCurrent 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        completed 
                          ? 'bg-green-500 text-white' 
                          : started 
                            ? 'bg-yellow-500 text-white' 
                            : 'bg-gray-200 text-gray-500'
                      }`}>
                        {completed ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <span className="text-xs">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${
                          isCurrent ? 'text-blue-700' : 'text-gray-700'
                        }`}>
                          {subsectionItem.id}
                        </p>
                        <p className={`text-xs ${
                          isCurrent ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {subsectionItem.title}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        if (index !== currentSubsection) {
                          onNavigateToSubsection(index);
                        }
                      }}
                      className={`px-3 py-1 text-xs font-medium rounded ${
                        isCurrent
                          ? 'bg-blue-500 text-white'
                          : completed
                            ? 'bg-green-100 text-green-700'
                            : started
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {completed ? 'Terminé' : started ? 'En cours' : 'Commencer'}
                    </button>
                  </div>
                );
              })}
            </div>
            
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  // Navigate back to plan overview
                  localStorage.setItem('businessPlanWizardData', JSON.stringify(wizardData));
                  navigate('/business-plan');
                }}
                className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium"
              >
                Aperçu du plan
              </button>
              
              <button
                onClick={onFinish}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
              >
                Voir le plan
              </button>
            </div>
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
          <option value="">Sélectionnez une option</option>
          {question.options.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    
    case 'single-choice':
      return (
        <div className="space-y-3">
          {question.options.map((option: string, index: number) => (
            <label
              key={index}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                value === option
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
                className="mr-3 text-blue-500"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      );
    
    case 'single-select':
      return (
        <div className="space-y-3">
          {question.options.map((option: string, index: number) => (
            <label
              key={index}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                value === option
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id || question.label}`}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
                className="mr-3 text-blue-500"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      );
    
    case 'ownership-table':
      return (
        <OwnershipTable
          owners={value || []}
          onChange={onChange}
        />
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
    
    case 'problem-solution-mapping':
      return (
        <ProblemSolutionMapping
          problems={question.problems || []}
          solutions={value || {}}
          onChange={onChange}
        />
      );
    
    case 'competitor-matrix':
      return (
        <CompetitorMatrix
          competitors={question.competitors || []}
          factors={question.factors || ['Prix', 'Qualité', 'Service client', 'Innovation', 'Réputation']}
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
    
    case 'month-year':
      return (
        <div className="flex gap-4">
          <select
            value={value?.split(' ')[0] || ''}
            onChange={(e) => {
              const month = e.target.value;
              const year = value?.split(' ')[1] || new Date().getFullYear();
              onChange(`${month} ${year}`);
            }}
            className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Mois</option>
            {[
              'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
              'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
            ].map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={value?.split(' ')[1] || ''}
            onChange={(e) => {
              const month = value?.split(' ')[0] || 'Janvier';
              const year = e.target.value;
              onChange(`${month} ${year}`);
            }}
            className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Année</option>
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      );
    
    case 'user-management':
      return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-gray-500 mb-4">Ajoutez des membres de votre équipe</p>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            {question.placeholder}
          </button>
        </div>
      );
    
    case 'multi-text':
      return (
        <div className="space-y-4">
          {(value || []).map((item: string, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const newValue = [...(value || [])];
                  newValue[index] = e.target.value;
                  onChange(newValue);
                }}
                className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Élément ${index + 1}`}
              />
              <button
                onClick={() => {
                  const newValue = (value || []).filter((_: any, i: number) => i !== index);
                  onChange(newValue);
                }}
                className="p-4 text-red-500 hover:text-red-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          <button
            onClick={() => onChange([...(value || []), ''])}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
          >
            + Ajouter un élément
          </button>
        </div>
      );
    
    case 'location':
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {question.fields.map((field: string, index: number) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field}
              </label>
              <input
                type="text"
                value={value?.[field] || ''}
                onChange={(e) => {
                  const newValue = { ...(value || {}), [field]: e.target.value };
                  onChange(newValue);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={field}
              />
            </div>
          ))}
        </div>
      );
    
    case 'date':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.fields.map((field: string, index: number) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field}
              </label>
              {field === 'Mois' ? (
                <select
                  value={value?.[field] || ''}
                  onChange={(e) => {
                    const newValue = { ...(value || {}), [field]: e.target.value };
                    onChange(newValue);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionnez un mois</option>
                  {[
                    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
                  ].map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="number"
                  value={value?.[field] || ''}
                  onChange={(e) => {
                    const newValue = { ...(value || {}), [field]: e.target.value };
                    onChange(newValue);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={field}
                  min="1900"
                  max="2100"
                />
              )}
            </div>
          ))}
        </div>
      );
    
    case 'ip-management':
      return (
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            {question.types.map((type: string) => (
              <button
                key={type}
                onClick={() => {
                  const newValue = [...(value || []), { type, name: '', description: '' }];
                  onChange(newValue);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                + {type}
              </button>
            ))}
          </div>
          {(value || []).map((item: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900">{item.type}</h4>
                <button
                  onClick={() => {
                    const newValue = (value || []).filter((_: any, i: number) => i !== index);
                    onChange(newValue);
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la PI
                  </label>
                  <input
                    type="text"
                    value={item.name || ''}
                    onChange={(e) => {
                      const newValue = [...(value || [])];
                      newValue[index] = { ...newValue[index], name: e.target.value };
                      onChange(newValue);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nom de la propriété intellectuelle"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={item.description || ''}
                    onChange={(e) => {
                      const newValue = [...(value || [])];
                      newValue[index] = { ...newValue[index], description: e.target.value };
                      onChange(newValue);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Description de la propriété intellectuelle"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
          {(value || []).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Aucune propriété intellectuelle ajoutée. Cliquez sur les boutons ci-dessus pour en ajouter.</p>
            </div>
          )}
        </div>
      );
    
    default:
      return <div>Type de question non supporté : {question.type}</div>;
  }
};

export default BusinessPlanWizard; 