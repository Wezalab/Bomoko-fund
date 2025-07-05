import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { enhanceContent } from '../../lib/groqService';

interface AIEnhancementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentContent: string;
  onContentUpdated: (newContent: string) => void;
}

const AIEnhancementDialog: React.FC<AIEnhancementDialogProps> = ({
  isOpen,
  onClose,
  currentContent,
  onContentUpdated,
}) => {
  const [instructions, setInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [enhancedContent, setEnhancedContent] = useState('');

  const enhancementPresets = [
    {
      title: 'Rendre plus professionnel',
      description: 'Améliorer le langage et le ton pour paraître plus professionnel',
      instruction: 'Rendre ce contenu plus professionnel et formel, en utilisant un langage et une terminologie d\'entreprise.'
    },
    {
      title: 'Ajouter plus de détails',
      description: 'Développer avec des informations plus complètes',
      instruction: 'Ajouter des informations plus détaillées, des exemples et des explications pour rendre ce contenu plus complet.'
    },
    {
      title: 'Rendre plus persuasif',
      description: 'Améliorer le contenu pour qu\'il soit plus convaincant',
      instruction: 'Rendre ce contenu plus persuasif et convaincant pour les investisseurs et les parties prenantes.'
    },
    {
      title: 'Améliorer la clarté',
      description: 'Rendre le contenu plus clair et plus facile à comprendre',
      instruction: 'Améliorer la clarté et la lisibilité de ce contenu, en le rendant plus facile à comprendre.'
    },
    {
      title: 'Ajouter des données de marché',
      description: 'Inclure des statistiques et tendances de marché pertinentes',
      instruction: 'Ajouter des données de marché pertinentes, des statistiques et des tendances sectorielles pour soutenir ce contenu.'
    },
    {
      title: 'Rendre plus concis',
      description: 'Réduire la longueur tout en maintenant les points clés',
      instruction: 'Rendre ce contenu plus concis tout en préservant toutes les informations importantes et les points clés.'
    }
  ];

  const handleEnhance = async () => {
    if (!instructions.trim()) return;

    setIsProcessing(true);
    try {
      const enhanced = await enhanceContent(currentContent, instructions);
      setEnhancedContent(enhanced);
    } catch (error) {
      console.error('Erreur lors de l\'amélioration du contenu:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyEnhancement = () => {
    if (enhancedContent) {
      onContentUpdated(enhancedContent);
      onClose();
    }
  };

  const resetDialog = () => {
    setInstructions('');
    setEnhancedContent('');
    setIsProcessing(false);
  };

  const handleClose = () => {
    resetDialog();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Amélioration du contenu IA</h2>
              <p className="text-gray-600 text-sm">Améliorez le contenu de votre plan d'affaires avec l'aide de l'IA</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {!enhancedContent ? (
            <>
              {/* Options d'amélioration prédéfinies */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Options d'amélioration rapide</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {enhancementPresets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => setInstructions(preset.instruction)}
                      className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{preset.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{preset.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructions personnalisées */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Instructions personnalisées</h3>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Décrivez comment vous souhaitez améliorer ce contenu..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              {/* Aperçu du contenu actuel */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Contenu actuel</h3>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
                  <div 
                    className="text-sm text-gray-700 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentContent || 'Aucun contenu disponible' }}
                  />
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleEnhance}
                  disabled={!instructions.trim() || isProcessing}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Amélioration...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Améliorer le contenu
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Résultats du contenu amélioré */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Contenu amélioré</h3>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200 max-h-60 overflow-y-auto">
                  <div 
                    className="text-sm text-gray-700 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: enhancedContent }}
                  />
                </div>
              </div>

              {/* Comparaison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Original</h4>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
                    <div 
                      className="text-xs text-gray-600 prose prose-xs max-w-none"
                      dangerouslySetInnerHTML={{ __html: currentContent }}
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Amélioré</h4>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200 max-h-40 overflow-y-auto">
                    <div 
                      className="text-xs text-gray-600 prose prose-xs max-w-none"
                      dangerouslySetInnerHTML={{ __html: enhancedContent }}
                    />
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={resetDialog}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Essayer à nouveau
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Garder l'original
                </button>
                <button
                  onClick={handleApplyEnhancement}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  Appliquer l'amélioration
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AIEnhancementDialog; 