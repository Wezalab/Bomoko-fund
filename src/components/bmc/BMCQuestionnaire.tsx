import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Loader2,
  Users,
  Gift,
  Truck,
  Heart,
  DollarSign,
  Wrench,
  Cog,
  Handshake,
  Receipt,
  Building2,
} from 'lucide-react';
import { RootState } from '@/redux/store';
import {
  setWizardStep,
  setWizardAnswer,
  setWizardAnswers,
  setCanvas,
  setIsGenerating,
  setStrategySuggestions,
} from '@/redux/slices/bmcSlice';
import { BMCWizardAnswers, BMCBlockKey, BMC_BLOCK_ORDER, BusinessModelCanvas } from '@/types/bmc';
import { generateBMCFromAnswers, generateBMCStrategySuggestions } from '@/lib/groqService';
import BMCTimer from './BMCTimer';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'bmcWizardData';

interface StepConfig {
  key: keyof BMCWizardAnswers;
  title: string;
  question: string;
  placeholder: string;
  tips: string[];
  icon: React.ElementType;
  color: string;
}

const steps: StepConfig[] = [
  {
    key: 'businessName',
    title: 'Votre entreprise',
    question: 'Quel est le nom de votre entreprise et votre secteur d\'activité ?',
    placeholder: 'Ex: Mama Rice - Transformation de riz étuvé',
    tips: [
      'Indiquez le nom de votre entreprise',
      'Précisez votre secteur ou industrie',
    ],
    icon: Building2,
    color: 'bg-indigo-600',
  },
  {
    key: 'customerSegments',
    title: '1. Segments de clientèle',
    question: 'Qui sont vos clients cibles ?',
    placeholder: 'Ex: Grossistes et entreprises de reconditionnement servant les détaillants. Clients institutionnels (hôpitaux, écoles, restaurants)...',
    tips: [
      'Pensez aux personnes ou organisations que vous visez',
      'Regroupez-les par besoins et comportements communs',
      'Exemples : genre, tranche d\'âge, zone géographique, profession',
    ],
    icon: Users,
    color: 'bg-emerald-500',
  },
  {
    key: 'valuePropositions',
    title: '2. Propositions de valeur',
    question: 'Quelle valeur apportez-vous à vos clients ?',
    placeholder: 'Ex: Riz étuvé de haute qualité. Prix compétitif par rapport aux importations. Certifié et conditionné dans un emballage pratique...',
    tips: [
      'Quel problème résolvez-vous pour vos clients ?',
      'Pourquoi vous choisiraient-ils plutôt que la concurrence ?',
      'Pensez : performance, qualité, prix, design, accessibilité',
    ],
    icon: Gift,
    color: 'bg-emerald-600',
  },
  {
    key: 'channels',
    title: '3. Canaux',
    question: 'Comment atteignez-vous vos clients ?',
    placeholder: 'Ex: Vente au point de transformation, marché local, plateforme e-commerce, livraison directe aux clients...',
    tips: [
      'Comment communiquez-vous avec vos clients ?',
      'Comment distribuez-vous vos produits/services ?',
      'Canaux directs (votre boutique) vs indirects (distributeurs)',
    ],
    icon: Truck,
    color: 'bg-emerald-700',
  },
  {
    key: 'customerRelationships',
    title: '4. Relations clients',
    question: 'Quel type de relation entretenez-vous avec vos clients ?',
    placeholder: 'Ex: Livraison sur appels téléphoniques, livraison sur commande écrite dans les 2 semaines, contrat de livraison régulière négocié...',
    tips: [
      'Assistance personnelle, self-service, ou automatisé ?',
      'Comment fidélisez-vous vos clients ?',
      'Objectif : acquérir, retenir, ou développer les ventes',
    ],
    icon: Heart,
    color: 'bg-teal-600',
  },
  {
    key: 'revenueStreams',
    title: '5. Sources de revenus',
    question: 'Comment générez-vous des revenus ?',
    placeholder: 'Ex: Vente mensuelle de 2500 unités (1kg) de riz de qualité aux détaillants. Vente bimensuelle de 6 chargements (6 tonnes) aux grossistes...',
    tips: [
      'Pour quelle valeur vos clients paient-ils ?',
      'Précisez les quantités, la fréquence et les prix',
      'Pensez aux variations saisonnières',
    ],
    icon: DollarSign,
    color: 'bg-teal-700',
  },
  {
    key: 'keyResources',
    title: '6. Ressources clés',
    question: 'Quelles sont vos ressources clés ?',
    placeholder: 'Ex: Équipement de transformation (capacité 48t/an), fonds communs, savoir-faire technique, main-d\'œuvre, pots, seaux, bâches...',
    tips: [
      'Ressources physiques : équipements, bâtiments, véhicules',
      'Ressources intellectuelles : savoir-faire, brevets, marques',
      'Ressources humaines et financières',
      'Considérez toujours l\'âge et la durée de vie utile',
    ],
    icon: Wrench,
    color: 'bg-rose-600',
  },
  {
    key: 'keyActivities',
    title: '7. Activités clés',
    question: 'Quelles sont vos activités clés ?',
    placeholder: 'Ex: Acheter le paddy, vanner, décortiquer, trier, laver, tremper, étuver, sécher au soleil, emballer, vendre...',
    tips: [
      'Production : agriculture, transformation, fabrication',
      'Résolution de problèmes : services, conseil, formation',
      'Plateforme : e-commerce, réseau',
    ],
    icon: Cog,
    color: 'bg-rose-700',
  },
  {
    key: 'keyPartnerships',
    title: '8. Partenaires clés',
    question: 'Qui sont vos partenaires clés ?',
    placeholder: 'Ex: Coopérative de producteurs de riz, banque, fournisseur d\'engrais, autorités de certification...',
    tips: [
      'Fournisseurs, distributeurs, alliances stratégiques',
      'Les partenariats aident à acquérir des ressources et activités',
      'Réduire les risques, optimiser, faire des économies d\'échelle',
    ],
    icon: Handshake,
    color: 'bg-rose-800',
  },
  {
    key: 'costStructure',
    title: '9. Structure de coûts',
    question: 'Quels sont vos principaux coûts ?',
    placeholder: 'Ex: Achat de paddy, eau, bois de chauffage, service de décorticage, matériel d\'emballage, transport, main-d\'œuvre, équipements...',
    tips: [
      'Coûts fixes : loyer, salaires permanents, équipements',
      'Coûts variables : matières premières, main-d\'œuvre saisonnière',
      'Faites un calcul détaillé pour convaincre un financier',
    ],
    icon: Receipt,
    color: 'bg-rose-900',
  },
];

const BMCQuestionnaire: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wizardStep, wizardAnswers, isGenerating } = useSelector(
    (state: RootState) => state.bmcReducer
  );
  const [currentStep, setCurrentStep] = useState(wizardStep);

  // Load saved data on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as BMCWizardAnswers;
        dispatch(setWizardAnswers(parsed));
      }
    } catch {
      // ignore
    }
  }, [dispatch]);

  // Save to localStorage on every answer change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wizardAnswers));
  }, [wizardAnswers]);

  const stepConfig = steps[currentStep];
  const totalSteps = steps.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      dispatch(setWizardStep(next));
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      dispatch(setWizardStep(prev));
    }
  };

  const handleChange = (value: string) => {
    dispatch(setWizardAnswer({ key: stepConfig.key, value }));
  };

  const currentValue = wizardAnswers[stepConfig.key] || '';

  const handleGenerate = useCallback(async () => {
    dispatch(setIsGenerating(true));
    try {
      const blocks = await generateBMCFromAnswers(wizardAnswers);
      const strategies = await generateBMCStrategySuggestions(blocks);
      const canvasId = uuidv4();
      const canvas: BusinessModelCanvas = {
        _id: canvasId,
        userId: '',
        title: wizardAnswers.businessName
          ? `BMC - ${wizardAnswers.businessName}`
          : 'Mon Business Model Canvas',
        description: wizardAnswers.industry || '',
        blocks,
        strategySuggestions: strategies,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch(setCanvas(canvas));
      dispatch(setStrategySuggestions(strategies));
      localStorage.removeItem(STORAGE_KEY);
      navigate(`/bmc/${canvasId}`);
    } catch (error) {
      console.error('BMC generation failed:', error);
    } finally {
      dispatch(setIsGenerating(false));
    }
  }, [wizardAnswers, dispatch, navigate]);

  const isLastStep = currentStep === totalSteps - 1;
  const Icon = stepConfig.icon;
  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/bmc/new')}
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
        <BMCTimer />
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Étape {currentStep + 1} sur {totalSteps}</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: 'rgb(3, 10, 61)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        {/* Step dots */}
        <div className="flex justify-between mt-3">
          {steps.map((s, idx) => (
            <button
              key={s.key}
              onClick={() => {
                setCurrentStep(idx);
                dispatch(setWizardStep(idx));
              }}
              className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                idx === currentStep
                  ? 'text-white shadow-lg scale-110'
                  : idx < currentStep && wizardAnswers[s.key]
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-400'
              }`}
              style={
                idx === currentStep ? { backgroundColor: 'rgb(3, 10, 61)' } : undefined
              }
              title={s.title}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8"
        >
          {/* Step header */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-lg ${stepConfig.color} text-white flex items-center justify-center`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{stepConfig.title}</h2>
              <p className="text-gray-600">{stepConfig.question}</p>
            </div>
          </div>

          {/* Input */}
          <textarea
            value={currentValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={stepConfig.placeholder}
            className="w-full min-h-[160px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y text-gray-800 placeholder:text-gray-400"
          />

          {/* Tips */}
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-amber-800 mb-2">Conseils :</p>
            <ul className="space-y-1">
              {stepConfig.tips.map((tip, idx) => (
                <li key={idx} className="text-sm text-amber-700 flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Précédent
        </button>

        {isLastStep ? (
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-8 py-3 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
            style={{ backgroundColor: 'rgb(3, 10, 61)' }}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Générer mon BMC
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-colors"
            style={{ backgroundColor: 'rgb(3, 10, 61)' }}
          >
            Suivant
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default BMCQuestionnaire;
