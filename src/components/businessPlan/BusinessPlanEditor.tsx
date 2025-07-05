import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Save, 
  Download, 
  Share2, 
  Eye, 
  Edit, 
  Sparkles, 
  ChevronRight,
  ArrowLeft,
  Settings,
  Zap,
  BookOpen,
  TrendingUp,
  Target,
  Users,
  DollarSign,
  BarChart3,
  Globe,
  Briefcase,
  CheckCircle,
  Wand2,
  PieChart,
  Calculator,
  CreditCard,
  Calendar,
  LineChart
} from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import AIEnhancementDialog from './AIEnhancementDialog';
import PDFExport from './PDFExport';
import { generateBusinessPlanContent, enhanceContent } from '../../lib/groqService';

interface BusinessPlanSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
  isCompleted?: boolean;
}

interface BusinessPlanEditorProps {
  onBack?: () => void;
  companyName?: string;
  industry?: string;
}

const BusinessPlanEditor: React.FC<BusinessPlanEditorProps> = ({ 
  onBack, 
  companyName = "REST-DRC", 
  industry = "Restaurant" 
}) => {
  const [activeSection, setActiveSection] = useState<string>('cover');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wizardData, setWizardData] = useState<any>(null);
  const [showEnhancementDialog, setShowEnhancementDialog] = useState(false);

  const [sections, setSections] = useState<BusinessPlanSection[]>([
    {
      id: 'cover',
      title: 'Page de couverture',
      icon: <FileText className="w-5 h-5" />,
      content: `<div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">${companyName}</h1>
        <h2 class="text-2xl text-gray-600 mb-8">Plan d'affaires</h2>
        <p class="text-lg text-gray-500">${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
      </div>`,
      isCompleted: true
    },
    {
      id: 'business-overview',
      title: 'Aperçu de l\'entreprise',
      icon: <Briefcase className="w-5 h-5" />,
      content: '',
      isCompleted: false
    },
    {
      id: 'opportunity',
      title: 'Opportunité',
      icon: <Target className="w-5 h-5" />,
      content: '',
      isCompleted: false
    },
    {
      id: 'market-analysis',
      title: 'Analyse du marché',
      icon: <TrendingUp className="w-5 h-5" />,
      content: '',
      isCompleted: false
    },
    {
      id: 'competition',
      title: 'Concurrence',
      icon: <BarChart3 className="w-5 h-5" />,
      content: '',
      isCompleted: false
    },
    {
      id: 'marketing',
      title: 'Marketing',
      icon: <Zap className="w-5 h-5" />,
      content: '',
      isCompleted: false
    },
    {
      id: 'operations',
      title: 'Opérations',
      icon: <Settings className="w-5 h-5" />,
      content: '',
      isCompleted: false
    },
    {
      id: 'team',
      title: 'Équipe',
      icon: <Users className="w-5 h-5" />,
      content: '',
      isCompleted: false
    },
    {
      id: 'financial-plan',
      title: 'Plan financier',
      icon: <DollarSign className="w-5 h-5" />,
      content: '',
      isCompleted: false
    },
    {
      id: 'profit-loss',
      title: 'Compte de résultat',
      icon: <PieChart className="w-5 h-5" />,
      content: '',
      isCompleted: false
    },
    {
      id: 'balance-sheet',
      title: 'Bilan',
      icon: <Calculator className="w-5 h-5" />,
      content: '',
      isCompleted: false
    },
    {
      id: 'cash-flow',
      title: 'État des flux de trésorerie',
      icon: <CreditCard className="w-5 h-5" />,
      content: '',
      isCompleted: false
    },
    {
      id: 'profit-loss-monthly',
      title: 'Compte de résultat (mensuel)',
      icon: <LineChart className="w-5 h-5" />,
      content: '',
      isCompleted: false
    },
    {
      id: 'balance-sheet-monthly',
      title: 'Bilan (mensuel)',
      icon: <Calendar className="w-5 h-5" />,
      content: '',
      isCompleted: false
    },
    {
      id: 'cash-flow-monthly',
      title: 'Flux de trésorerie (mensuel)',
      icon: <Globe className="w-5 h-5" />,
      content: '',
      isCompleted: false
    },
    {
      id: 'executive-summary',
      title: 'Résumé exécutif',
      icon: <BookOpen className="w-5 h-5" />,
      content: '',
      isCompleted: false
    }
  ]);

  const currentSection = sections.find(s => s.id === activeSection);

  // Charger les données de l'assistant et auto-générer le contenu au montage
  useEffect(() => {
    const loadWizardData = () => {
      const savedData = localStorage.getItem('businessPlanWizardData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setWizardData(parsedData);
          
          // Extraire les informations de l'entreprise des données de l'assistant
          const companyInfo = {
            name: parsedData.question_2 || companyName,
            industry: parsedData.question_3 || industry
          };
          
          // Auto-générer le contenu pour toutes les sections
          autoGenerateAllSections(companyInfo);
        } catch (error) {
          console.error('Erreur lors de l\'analyse des données de l\'assistant:', error);
        }
      }
    };

    loadWizardData();
  }, []);

  const autoGenerateAllSections = async (companyInfo: any) => {
    setIsGenerating(true);
    
    try {
      const sectionsToGenerate = [
        'business-overview',
        'opportunity',
        'market-analysis',
        'competition',
        'marketing',
        'operations',
        'team',
        'financial-plan',
        'profit-loss',
        'balance-sheet',
        'cash-flow',
        'profit-loss-monthly',
        'balance-sheet-monthly',
        'cash-flow-monthly',
        'executive-summary'
      ];

      // Générer le contenu pour chaque section
      for (const sectionId of sectionsToGenerate) {
        const section = sections.find(s => s.id === sectionId);
        if (section && section.content === '') {
          try {
            const generatedContent = await generateBusinessPlanContent(
              section.title, 
              companyInfo.name, 
              companyInfo.industry
            );
            
            // Convertir le texte brut en HTML avec un formatage approprié
            const htmlContent = generatedContent
              .split('\n\n')
              .map(paragraph => `<p>${paragraph}</p>`)
              .join('');
            
            updateSectionContent(sectionId, htmlContent);
            
            // Petit délai entre les générations pour éviter la limitation de taux
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (error) {
            console.error(`Erreur lors de la génération du contenu pour ${sectionId}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'auto-génération des sections:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateSectionContent = (sectionId: string, content: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, content, isCompleted: content.length > 100 }
        : section
    ));
  };

  const handleGenerateContent = async () => {
    if (!currentSection || currentSection.id === 'cover') return;

    setIsGenerating(true);
    try {
      const sectionName = currentSection.title;
      const generatedContent = await generateBusinessPlanContent(sectionName, companyName, industry);
      
      // Convertir le texte brut en HTML avec un formatage approprié
      const htmlContent = generatedContent
        .split('\n\n')
        .map(paragraph => `<p>${paragraph}</p>`)
        .join('');
      
      updateSectionContent(currentSection.id, htmlContent);
    } catch (error) {
      console.error('Erreur lors de la génération du contenu:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simuler la sauvegarde vers le backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const completedSections = sections.filter(s => s.isCompleted).length;
  const totalSections = sections.length;
  const progressPercentage = (completedSections / totalSections) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Plan d'affaires {companyName}</h1>
                <p className="text-sm text-gray-500">
                  {completedSections} sur {totalSections} sections terminées
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {lastSaved && (
                <span className="text-sm text-gray-500">
                  Sauvegardé à {lastSaved.toLocaleTimeString()}
                </span>
              )}
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>

              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Modifier' : 'Aperçu'}
              </button>

              <button
                onClick={() => setShowEnhancementDialog(true)}
                disabled={!currentSection?.content || currentSection.id === 'cover'}
                className="flex items-center gap-2 px-4 py-2 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wand2 className="w-4 h-4" />
                Améliorer
              </button>

              <PDFExport
                sections={sections.map(s => ({ id: s.id, title: s.title, content: s.content }))}
                companyName={wizardData?.question_2 || companyName}
                onExport={() => console.log('Exportation terminée')}
              />
            </div>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="h-1 bg-gray-200">
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Barre latérale */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Sections du plan d'affaires</h2>
                <div className="text-sm text-gray-600">
                  {completedSections} sur {totalSections} terminées ({Math.round(progressPercentage)}%)
                </div>
              </div>
              
              <nav className="p-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeSection === section.id
                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className={`flex-shrink-0 ${
                          activeSection === section.id ? 'text-blue-600' : 'text-gray-400'
                        }`}>
                          {section.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {section.title}
                          </div>
                        </div>
                        {section.isCompleted && (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        )}
                        {activeSection === section.id && (
                          <ChevronRight className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {currentSection?.icon}
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          {currentSection?.title}
                        </h1>
                        <p className="text-gray-600 mt-1">
                          {currentSection?.id === 'cover' 
                            ? 'La page de couverture de votre plan d\'affaires'
                            : `Créez un contenu convaincant pour votre ${currentSection?.title.toLowerCase()}`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {currentSection && (
                    <RichTextEditor
                      key={currentSection.id}
                      content={currentSection.content}
                      onChange={(content) => updateSectionContent(currentSection.id, content)}
                      placeholder={`Rédigez votre ${currentSection.title.toLowerCase()} ici...`}
                      onGenerateContent={currentSection.id !== 'cover' ? handleGenerateContent : undefined}
                      isGenerating={isGenerating}
                    />
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Dialogue d'amélioration IA */}
      <AIEnhancementDialog
        isOpen={showEnhancementDialog}
        onClose={() => setShowEnhancementDialog(false)}
        currentContent={currentSection?.content || ''}
        onContentUpdated={(newContent) => {
          if (currentSection) {
            updateSectionContent(currentSection.id, newContent);
          }
        }}
      />

      {/* Overlay de génération */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Génération du contenu IA</h3>
            <p className="text-gray-600">
              Veuillez patienter pendant que nous créons un contenu professionnel pour votre plan d'affaires...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessPlanEditor; 