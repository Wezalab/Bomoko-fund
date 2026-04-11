import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowLeft, Lightbulb, Save, Download, Loader2 } from 'lucide-react';
import { RootState } from '@/redux/store';
import { useCreateCanvasMutation, useUpdateCanvasMutation } from '@/redux/services/bmcServices';
import BMCBlockCard from './BMCBlockCard';
import toast from 'react-hot-toast';

const BMCCanvasGrid: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const canvas = useSelector((s: RootState) => s.bmcReducer.currentCanvas);
  const [createCanvas, { isLoading: isCreating }] = useCreateCanvasMutation();
  const [updateCanvas, { isLoading: isUpdating }] = useUpdateCanvasMutation();

  if (!canvas) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Aucun canvas trouvé. Commencez par en créer un.</p>
        <button
          onClick={() => navigate('/bmc/new')}
          className="px-6 py-3 rounded-lg text-white font-semibold"
          style={{ backgroundColor: 'rgb(3, 10, 61)' }}
        >
          Créer un BMC
        </button>
      </div>
    );
  }

  const blockMap = Object.fromEntries(canvas.blocks.map((b) => [b.key, b]));

  const handleSave = async () => {
    try {
      if (canvas._id && canvas._id.length > 20) {
        await createCanvas({
          title: canvas.title,
          description: canvas.description,
          blocks: canvas.blocks,
          strategySuggestions: canvas.strategySuggestions,
          status: canvas.status,
        }).unwrap();
      } else {
        await updateCanvas({
          id: canvas._id,
          blocks: canvas.blocks,
          status: canvas.status,
        }).unwrap();
      }
      toast.success('Canvas sauvegardé avec succès');
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const isSaving = isCreating || isUpdating;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/bmc')}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{canvas.title}</h1>
            {canvas.description && (
              <p className="text-sm text-gray-500">{canvas.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/bmc/${id}/strategies`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-300 text-purple-700 hover:bg-purple-50 transition-colors text-sm font-medium"
          >
            <Lightbulb className="w-4 h-4" />
            Stratégies
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
            style={{ backgroundColor: 'rgb(3, 10, 61)' }}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Sauvegarder
          </button>
        </div>
      </div>

      {/* BMC Grid - Desktop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden lg:block"
      >
        <div className="border-2 border-gray-300 rounded-xl overflow-hidden bg-white shadow-lg">
          {/* Top row */}
          <div className="grid grid-cols-10" style={{ minHeight: '340px' }}>
            {/* 8. Key Partners */}
            <div className="col-span-2 border-r border-gray-300">
              {blockMap.keyPartnerships && (
                <BMCBlockCard block={blockMap.keyPartnerships} className="h-full rounded-none border-0" />
              )}
            </div>

            {/* 7. Key Activities + 6. Key Resources stacked */}
            <div className="col-span-2 border-r border-gray-300 flex flex-col">
              <div className="flex-1 border-b border-gray-300">
                {blockMap.keyActivities && (
                  <BMCBlockCard block={blockMap.keyActivities} className="h-full rounded-none border-0" />
                )}
              </div>
              <div className="flex-1">
                {blockMap.keyResources && (
                  <BMCBlockCard block={blockMap.keyResources} className="h-full rounded-none border-0" />
                )}
              </div>
            </div>

            {/* 2. Value Propositions */}
            <div className="col-span-2 border-r border-gray-300">
              {blockMap.valuePropositions && (
                <BMCBlockCard block={blockMap.valuePropositions} className="h-full rounded-none border-0" />
              )}
            </div>

            {/* 4. Customer Relationships + 3. Channels stacked */}
            <div className="col-span-2 border-r border-gray-300 flex flex-col">
              <div className="flex-1 border-b border-gray-300">
                {blockMap.customerRelationships && (
                  <BMCBlockCard block={blockMap.customerRelationships} className="h-full rounded-none border-0" />
                )}
              </div>
              <div className="flex-1">
                {blockMap.channels && (
                  <BMCBlockCard block={blockMap.channels} className="h-full rounded-none border-0" />
                )}
              </div>
            </div>

            {/* 1. Customer Segments */}
            <div className="col-span-2">
              {blockMap.customerSegments && (
                <BMCBlockCard block={blockMap.customerSegments} className="h-full rounded-none border-0" />
              )}
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-2 border-t border-gray-300" style={{ minHeight: '140px' }}>
            {/* 9. Cost Structure */}
            <div className="border-r border-gray-300">
              {blockMap.costStructure && (
                <BMCBlockCard block={blockMap.costStructure} className="h-full rounded-none border-0" />
              )}
            </div>
            {/* 5. Revenue Streams */}
            <div>
              {blockMap.revenueStreams && (
                <BMCBlockCard block={blockMap.revenueStreams} className="h-full rounded-none border-0" />
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* BMC Grid - Tablet */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden md:grid lg:hidden grid-cols-2 gap-3"
      >
        {canvas.blocks.map((block) => (
          <BMCBlockCard key={block.key} block={block} className="min-h-[160px]" />
        ))}
      </motion.div>

      {/* BMC Grid - Mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:hidden flex flex-col gap-3"
      >
        {canvas.blocks.map((block) => (
          <BMCBlockCard key={block.key} block={block} className="min-h-[140px]" />
        ))}
      </motion.div>
    </div>
  );
};

export default BMCCanvasGrid;
