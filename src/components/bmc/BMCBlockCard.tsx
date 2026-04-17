import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Edit3, Check, X, Sparkles, Loader2 } from 'lucide-react';
import { RootState } from '@/redux/store';
import { updateBlock, setEditingBlock } from '@/redux/slices/bmcSlice';
import { BMCBlock, BMCBlockKey, BMC_BLOCK_LABELS } from '@/types/bmc';
import { enrichBMCBlock } from '@/lib/groqService';

interface BMCBlockCardProps {
  block: BMCBlock;
  className?: string;
}

const blockColors: Record<string, { header: string; bg: string; badge: string }> = {
  customerSegments:      { header: 'bg-emerald-600', bg: 'bg-emerald-50',  badge: 'bg-emerald-500' },
  valuePropositions:     { header: 'bg-amber-600',   bg: 'bg-amber-50',    badge: 'bg-amber-500' },
  channels:              { header: 'bg-emerald-700', bg: 'bg-emerald-50',  badge: 'bg-emerald-700' },
  customerRelationships: { header: 'bg-teal-600',    bg: 'bg-teal-50',     badge: 'bg-teal-600' },
  revenueStreams:        { header: 'bg-teal-700',    bg: 'bg-teal-50',     badge: 'bg-teal-700' },
  keyResources:          { header: 'bg-rose-600',    bg: 'bg-rose-50',     badge: 'bg-rose-600' },
  keyActivities:         { header: 'bg-rose-700',    bg: 'bg-rose-50',     badge: 'bg-rose-700' },
  keyPartnerships:       { header: 'bg-rose-800',    bg: 'bg-rose-50',     badge: 'bg-rose-800' },
  costStructure:         { header: 'bg-gray-700',    bg: 'bg-gray-50',     badge: 'bg-gray-700' },
};

const BMCBlockCard: React.FC<BMCBlockCardProps> = ({ block, className = '' }) => {
  const dispatch = useDispatch();
  const editingBlockKey = useSelector((s: RootState) => s.bmcReducer.editingBlockKey);
  const isEditing = editingBlockKey === block.key;
  const [draft, setDraft] = useState(block.content);
  const [isEnriching, setIsEnriching] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(draft.length, draft.length);
    }
  }, [isEditing]);

  useEffect(() => {
    setDraft(block.content);
  }, [block.content]);

  const colors = blockColors[block.key] || blockColors.costStructure;
  const label = BMC_BLOCK_LABELS[block.key];

  const handleSave = () => {
    dispatch(updateBlock({ key: block.key, content: draft }));
    dispatch(setEditingBlock(null));
  };

  const handleCancel = () => {
    setDraft(block.content);
    dispatch(setEditingBlock(null));
  };

  const handleEnrich = async () => {
    setIsEnriching(true);
    try {
      const enriched = await enrichBMCBlock(block, '');
      setDraft(enriched);
      dispatch(updateBlock({ key: block.key, content: enriched }));
    } catch {
      // keep current content
    } finally {
      setIsEnriching(false);
    }
  };

  return (
    <div className={`flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden ${colors.bg} ${className}`}>
      {/* Header */}
      <div className={`${colors.header} px-3 py-2 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className={`w-5 h-5 rounded ${colors.badge} text-white flex items-center justify-center text-[10px] font-bold`}>
            {label.number}
          </span>
          <span className="text-white text-xs font-semibold truncate">{label.fr}</span>
        </div>
        {!isEditing && (
          <button
            onClick={() => {
              dispatch(setEditingBlock(block.key));
            }}
            className="text-white/80 hover:text-white transition-colors"
            title="Modifier"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-3 overflow-y-auto">
        {isEditing ? (
          <div className="flex flex-col h-full">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="flex-1 w-full p-2 text-xs text-gray-800 border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px]"
            />
            <div className="flex items-center justify-between mt-2 gap-1">
              <button
                onClick={handleEnrich}
                disabled={isEnriching}
                className="flex items-center gap-1 text-[10px] text-purple-700 hover:text-purple-900 disabled:opacity-50"
                title="Enrichir avec l'IA"
              >
                {isEnriching ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                IA
              </button>
              <div className="flex gap-1">
                <button
                  onClick={handleCancel}
                  className="p-1 rounded text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleSave}
                  className="p-1 rounded text-emerald-600 hover:bg-emerald-100 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
            {block.content || (
              <span className="text-gray-400 italic">Cliquez sur le crayon pour ajouter du contenu</span>
            )}
          </p>
        )}
      </div>

      {/* AI badge */}
      {block.aiGenerated && !isEditing && (
        <div className="px-3 pb-2">
          <span className="inline-flex items-center gap-1 text-[10px] text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
            <Sparkles className="w-2.5 h-2.5" />
            Généré par IA
          </span>
        </div>
      )}
    </div>
  );
};

export default BMCBlockCard;
