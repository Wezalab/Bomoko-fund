import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoreHorizontal, 
  FileText, 
  Edit3, 
  Eye, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Layers,
  BookOpen,
  Settings,
  Plus,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useTranslation } from '@/lib/TranslationContext';
import RichTextEditor from './RichTextEditor';

interface BusinessPlanSection {
  id: string;
  title: string;
  description?: string;
  chapter: number;
  order: number;
  category: 'initial' | 'business' | 'market' | 'strategy' | 'operations' | 'financial' | 'legal' | 'appendix';
  isRequired: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  estimatedTime: string;
  icon: React.ReactNode;
  
  subsections: BusinessPlanSubsection[];
  
  // Colors for UI
  bgColor: string;
  borderColor: string;
  textColor: string;
}

interface BusinessPlanSubsection {
  id: string;
  title: string;
  description?: string;
  order: number;
  step: number;
  type: 'text' | 'rich-text' | 'table' | 'chart' | 'form' | 'file-upload';
  
  content: string;
  isRequired: boolean;
  isCompleted: boolean;
  estimatedTime: string;
  
  aiGenerated?: boolean;
  aiSuggestions?: string[];
}

type ViewMode = 'structural' | 'document';

interface BusinessPlanViewsProps {
  initialSetupComplete: boolean;
  planData?: any;
  onSectionUpdate: (sectionId: string, content: string) => void;
  onSubsectionUpdate: (sectionId: string, subsectionId: string, content: string) => void;
}

const BusinessPlanViews: React.FC<BusinessPlanViewsProps> = ({
  initialSetupComplete,
  planData,
  onSectionUpdate,
  onSubsectionUpdate
}) => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>('structural');
  const [activeSection, setActiveSection] = useState<string>('');
  const [activeSubsection, setActiveSubsection] = useState<string>('');
  const [expandedChapters, setExpandedChapters] = useState<Record<number, boolean>>({});

  // Mock data - this would come from API in real implementation
  const [sections, setSections] = useState<BusinessPlanSection[]>([
    // Chapter 1: Business Description
    {
      id: 'business-description',
      title: 'Business Description',
      description: 'Define your business concept, products, and services',
      chapter: 1,
      order: 1,
      category: 'business',
      isRequired: true,
      isCompleted: false,
      isLocked: !initialSetupComplete,
      estimatedTime: '25 Min',
      icon: <FileText className="w-5 h-5" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      subsections: [
        {
          id: 'overview',
          title: 'Overview',
          order: 1,
          step: 1,
          type: 'rich-text',
          content: '',
          isRequired: true,
          isCompleted: false,
          estimatedTime: '5 Min'
        },
        {
          id: 'problem-solution',
          title: 'Problem & Solution',
          order: 2,
          step: 2,
          type: 'rich-text',
          content: '',
          isRequired: true,
          isCompleted: false,
          estimatedTime: '5 Min'
        },
        {
          id: 'mission-vision-values',
          title: 'Mission, Vision & Values',
          order: 3,
          step: 3,
          type: 'rich-text',
          content: '',
          isRequired: true,
          isCompleted: false,
          estimatedTime: '5 Min'
        },
        {
          id: 'intellectual-property',
          title: 'Intellectual Property',
          order: 4,
          step: 4,
          type: 'rich-text',
          content: '',
          isRequired: false,
          isCompleted: false,
          estimatedTime: '5 Min'
        },
        {
          id: 'achievements',
          title: 'Achievements',
          order: 5,
          step: 5,
          type: 'rich-text',
          content: '',
          isRequired: false,
          isCompleted: false,
          estimatedTime: '5 Min'
        },
        {
          id: 'structure-ownership',
          title: 'Structure & Ownership',
          order: 6,
          step: 6,
          type: 'rich-text',
          content: '',
          isRequired: true,
          isCompleted: false,
          estimatedTime: '3 Min'
        }
      ]
    },
    // Chapter 2: Situation Analysis
    {
      id: 'situation-analysis',
      title: 'Situation Analysis',
      description: 'Analyze market conditions and competitive landscape',
      chapter: 2,
      order: 2,
      category: 'market',
      isRequired: true,
      isCompleted: false,
      isLocked: !initialSetupComplete,
      estimatedTime: '35 Min',
      icon: <Eye className="w-5 h-5" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      subsections: [
        {
          id: 'products-services',
          title: 'Products & Services',
          order: 1,
          step: 7,
          type: 'rich-text',
          content: '',
          isRequired: true,
          isCompleted: false,
          estimatedTime: '5 Min'
        },
        {
          id: 'market-segments',
          title: 'Market Segments',
          order: 2,
          step: 8,
          type: 'rich-text',
          content: '',
          isRequired: true,
          isCompleted: false,
          estimatedTime: '5 Min'
        },
        {
          id: 'buyer-personas',
          title: 'Buyer Personas',
          order: 3,
          step: 9,
          type: 'rich-text',
          content: '',
          isRequired: true,
          isCompleted: false,
          estimatedTime: '5 Min'
        },
        {
          id: 'competitors',
          title: 'Competitors',
          order: 4,
          step: 10,
          type: 'rich-text',
          content: '',
          isRequired: true,
          isCompleted: false,
          estimatedTime: '10 Min'
        },
        {
          id: 'swot',
          title: 'SWOT',
          order: 5,
          step: 11,
          type: 'rich-text',
          content: '',
          isRequired: true,
          isCompleted: false,
          estimatedTime: '5 Min'
        }
      ]
    },
    // Chapter 3: Objectives
    {
      id: 'objectives',
      title: 'Objectives',
      description: 'Set clear business goals and targets',
      chapter: 3,
      order: 3,
      category: 'strategy',
      isRequired: true,
      isCompleted: false,
      isLocked: !initialSetupComplete,
      estimatedTime: '10 Min',
      icon: <CheckCircle className="w-5 h-5" />,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      subsections: [
        {
          id: 'corporate-objectives',
          title: 'Corporate Objectives',
          order: 1,
          step: 12,
          type: 'rich-text',
          content: '',
          isRequired: true,
          isCompleted: false,
          estimatedTime: '10 Min'
        }
      ]
    },
    // Chapter 4: Business Strategy
    {
      id: 'business-strategy',
      title: 'Business Strategy',
      description: 'Define strategic approach and execution plan',
      chapter: 4,
      order: 4,
      category: 'strategy',
      isRequired: true,
      isCompleted: false,
      isLocked: !initialSetupComplete,
      estimatedTime: '75 Min',
      icon: <Settings className="w-5 h-5" />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
      subsections: [
        {
          id: 'product-strategy',
          title: 'Product Strategy',
          order: 1,
          step: 13,
          type: 'rich-text',
          content: '',
          isRequired: true,
          isCompleted: false,
          estimatedTime: '15 Min'
        },
        {
          id: 'distribution-strategy',
          title: 'Distribution Strategy',
          order: 2,
          step: 14,
          type: 'rich-text',
          content: '',
          isRequired: true,
          isCompleted: false,
          estimatedTime: '15 Min'
        },
        {
          id: 'price-strategy',
          title: 'Price Strategy',
          order: 3,
          step: 15,
          type: 'rich-text',
          content: '',
          isRequired: true,
          isCompleted: false,
          estimatedTime: '15 Min'
        },
        {
          id: 'promotional-strategy',
          title: 'Promotional Strategy',
          order: 4,
          step: 16,
          type: 'rich-text',
          content: '',
          isRequired: true,
          isCompleted: false,
          estimatedTime: '15 Min'
        },
        {
          id: 'people-strategy',
          title: 'People Strategy',
          order: 5,
          step: 17,
          type: 'rich-text',
          content: '',
          isRequired: true,
          isCompleted: false,
          estimatedTime: '15 Min'
        }
      ]
    },
    // Chapter 5: Funding
    {
      id: 'funding',
      title: 'Funding',
      description: 'Financial requirements and funding strategy',
      chapter: 5,
      order: 5,
      category: 'financial',
      isRequired: true,
      isCompleted: false,
      isLocked: !initialSetupComplete,
      estimatedTime: '10 Min',
      icon: <Settings className="w-5 h-5" />,
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-700',
      subsections: [
        {
          id: 'funding-requirements',
          title: 'Funding Requirements',
          order: 1,
          step: 18,
          type: 'rich-text',
          content: '',
          isRequired: true,
          isCompleted: false,
          estimatedTime: '5 Min'
        }
      ]
    },
    // Chapter 6: Financial Projections
    {
      id: 'financial-projections',
      title: 'Financial Projections',
      description: 'Revenue, costs, and profitability forecasts',
      chapter: 6,
      order: 6,
      category: 'financial',
      isRequired: true,
      isCompleted: false,
      isLocked: !initialSetupComplete,
      estimatedTime: '40 Min',
      icon: <Settings className="w-5 h-5" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      subsections: [
        {
          id: 'revenue',
          title: 'Revenue',
          order: 1,
          step: 19,
          type: 'rich-text',
          content: '',
          isRequired: true,
          isCompleted: false,
          estimatedTime: '5 Min'
        },
        {
          id: 'staffing',
          title: 'Staffing',
          order: 2,
          step: 20,
          type: 'rich-text',
          content: '',
          isRequired: true,
          isCompleted: false,
          estimatedTime: '5 Min'
        },
        {
          id: 'expenses',
          title: 'Expenses',
          order: 3,
          step: 21,
          type: 'rich-text',
          content: '',
          isRequired: true,
          isCompleted: false,
          estimatedTime: '5 Min'
        },
        {
          id: 'assets',
          title: 'Assets',
          order: 4,
          step: 22,
          type: 'rich-text',
          content: '',
          isRequired: true,
          isCompleted: false,
          estimatedTime: '5 Min'
        },
        {
          id: 'inventory',
          title: 'Inventory',
          order: 5,
          step: 23,
          type: 'rich-text',
          content: '',
          isRequired: false,
          isCompleted: false,
          estimatedTime: '5 Min'
        },
        {
          id: 'financing',
          title: 'Financing',
          order: 6,
          step: 24,
          type: 'rich-text',
          content: '',
          isRequired: true,
          isCompleted: false,
          estimatedTime: '5 Min'
        },
        {
          id: 'overview',
          title: 'Overview',
          order: 7,
          step: 25,
          type: 'rich-text',
          content: '',
          isRequired: true,
          isCompleted: false,
          estimatedTime: '2 Min'
        }
      ]
    },
    // Chapter 7: Executive Summary
    {
      id: 'executive-summary',
      title: 'Executive Summary',
      description: 'Comprehensive overview of the business plan',
      chapter: 7,
      order: 7,
      category: 'initial',
      isRequired: true,
      isCompleted: false,
      isLocked: !initialSetupComplete,
      estimatedTime: '5 Min',
      icon: <BookOpen className="w-5 h-5" />,
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      textColor: 'text-teal-700',
      subsections: [
        {
          id: 'executive-summary',
          title: 'Executive Summary',
          order: 1,
          step: 26,
          type: 'rich-text',
          content: '',
          isRequired: true,
          isCompleted: false,
          estimatedTime: '5 Min'
        }
      ]
    }
  ]);

  // Toggle chapter expansion
  const toggleChapter = (chapterNumber: number) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterNumber]: !prev[chapterNumber]
    }));
  };

  // Get current active section and subsection
  const getCurrentSection = () => {
    return sections.find(s => s.id === activeSection);
  };

  const getCurrentSubsection = () => {
    const section = getCurrentSection();
    return section?.subsections.find(sub => sub.id === activeSubsection);
  };

  // Handle content updates
  const handleContentUpdate = (content: string) => {
    if (activeSection && activeSubsection) {
      onSubsectionUpdate(activeSection, activeSubsection, content);
      
      // Update local state
      setSections(prev => prev.map(section => 
        section.id === activeSection 
          ? {
              ...section,
              subsections: section.subsections.map(subsection =>
                subsection.id === activeSubsection
                  ? { ...subsection, content, isCompleted: content.trim().length > 0 }
                  : subsection
              )
            }
          : section
      ));
    }
  };

  // Structural View Component
  const StructuralView = () => (
    <div className="space-y-6">
      {sections.map(section => {
        const isExpanded = expandedChapters[section.chapter] !== false; // Default to expanded
        const completedSubsections = section.subsections.filter(sub => sub.isCompleted).length;
        const totalSubsections = section.subsections.length;
        const sectionProgress = Math.round((completedSubsections / totalSubsections) * 100);

        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg border ${section.borderColor} ${section.bgColor} ${
              section.isLocked ? 'opacity-50' : ''
            }`}
          >
            {/* Chapter Header */}
            <div 
              className="p-4 cursor-pointer"
              onClick={() => toggleChapter(section.chapter)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${section.bgColor} ${section.textColor}`}>
                    {section.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">
                        CHAPTER {section.chapter}
                      </h3>
                      {section.isLocked && (
                        <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                          {t('locked') || 'Verrouillé'}
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mt-1">
                      {section.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {section.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {completedSubsections}/{totalSubsections} {t('completed') || 'complété'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {section.estimatedTime}
                    </div>
                  </div>
                  <div className="w-12 h-12 relative">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                        fill="none"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={`${sectionProgress * 1.26} 126`}
                        className="transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-700">
                        {sectionProgress}%
                      </span>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Subsections */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200"
                >
                  <div className="p-4 space-y-2">
                    {section.subsections.map(subsection => (
                      <motion.div
                        key={subsection.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          subsection.isCompleted
                            ? 'bg-green-50 border-green-200'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        } ${section.isLocked ? 'pointer-events-none' : ''}`}
                        onClick={() => {
                          if (!section.isLocked) {
                            setActiveSection(section.id);
                            setActiveSubsection(subsection.id);
                            setViewMode('document');
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                              subsection.isCompleted
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {subsection.isCompleted ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                subsection.step
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {subsection.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {subsection.estimatedTime}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );

  // Document View Component  
  const DocumentView = () => {
    const currentSection = getCurrentSection();
    const currentSubsection = getCurrentSubsection();

    if (!currentSection || !currentSubsection) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>{t('selectSectionToEdit') || 'Sélectionnez une section à modifier'}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Chapter {currentSection.chapter}</span>
          <span>•</span>
          <span>{currentSection.title}</span>
          <span>•</span>
          <span className="font-medium text-gray-900">{currentSubsection.title}</span>
        </div>

        {/* Section Header */}
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {currentSubsection.title}
          </h1>
          <p className="text-gray-600">
            {currentSubsection.description || `Complete this section to enhance your business plan.`}
          </p>
          <div className="flex items-center space-x-4 mt-3">
            <span className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {currentSubsection.estimatedTime}
            </span>
            <span className={`px-2 py-1 text-xs rounded ${
              currentSubsection.isCompleted
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {currentSubsection.isCompleted ? (t('completed') || 'Complété') : (t('inProgress') || 'En cours')}
            </span>
          </div>
        </div>

        {/* Content Editor */}
        <div>
          <RichTextEditor
            value={currentSubsection.content}
            onChange={handleContentUpdate}
            placeholder={`Enter content for ${currentSubsection.title}...`}
          />
        </div>

        {/* AI Suggestions */}
        {currentSubsection.aiSuggestions && currentSubsection.aiSuggestions.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">
              {t('aiSuggestions') || 'Suggestions IA'}
            </h4>
            <ul className="space-y-1 text-sm text-blue-800">
              {currentSubsection.aiSuggestions.map((suggestion, index) => (
                <li key={index}>• {suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* View Toggle */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('structural')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'structural'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layers className="w-4 h-4 mr-2" />
            Structural View
          </button>
          <button
            onClick={() => setViewMode('document')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'document'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Document View
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <MoreHorizontal className="w-5 h-5" />
          </button>
          <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Settings className="w-4 h-4 mr-2" />
            Customize
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {viewMode === 'structural' ? <StructuralView /> : <DocumentView />}
      </div>
    </div>
  );
};

export default BusinessPlanViews;
