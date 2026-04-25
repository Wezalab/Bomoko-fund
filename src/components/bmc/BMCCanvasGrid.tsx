import React, { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowLeft, Lightbulb, Save, Download, Loader2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';
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
  const printRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

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
    // A client-generated UUID contains dashes; a persisted MongoDB ObjectId does not.
    const isNewCanvas = !canvas._id || canvas._id.includes('-');
    try {
      if (isNewCanvas) {
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
    } catch (error: any) {
      console.error('[BMC] Save failed:', error);
      const status = error?.status;
      const detail =
        error?.data?.message ||
        error?.data?.error ||
        error?.error ||
        (typeof error?.data === 'string' ? error.data : null);
      const message = status
        ? `Erreur ${status}${detail ? ` — ${detail}` : ''}`
        : detail || 'Erreur lors de la sauvegarde';
      toast.error(message);
    }
  };

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    setIsExporting(true);
    // Transliterate diacritics (é→e, ô→o, ç→c) so the filename keeps the original word shape.
    const safeTitle = (canvas.title || 'BMC')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '_');
    const filename = `${safeTitle}.pdf`;
    try {
      await html2pdf()
        .set({
          margin: [8, 8, 8, 8],
          filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            windowWidth: 1200,
            scrollY: 0,
          },
          jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' },
          pagebreak: { mode: ['css', 'legacy'] },
        })
        .from(printRef.current)
        .save();
      toast.success('PDF exporté avec succès');
    } catch (error) {
      console.error('[BMC] PDF export failed:', error);
      toast.error("Échec de l'export PDF");
    } finally {
      setIsExporting(false);
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
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-60"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            PDF
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

      {/* Hidden print layout — always rendered at full desktop width, off-screen.
          Guarantees PDF export looks identical regardless of user's viewport. */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: '-10000px',
          width: '1200px',
          padding: '24px',
          background: '#ffffff',
          zIndex: -1,
        }}
      >
        {/* Scoped overrides: let content grow instead of being clipped by block scrollbars.
            Without these, long AI-generated bullets get cut off in the exported image. */}
        <style>{`
          .bmc-print-scope .overflow-y-auto { overflow: visible !important; }
          .bmc-print-scope ul, .bmc-print-scope li, .bmc-print-scope span {
            word-break: break-word;
            overflow-wrap: anywhere;
          }
          .bmc-print-scope { line-height: 1.35; }
        `}</style>
        <div ref={printRef} className="bmc-print-scope" style={{ width: '1152px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>
              {canvas.title}
            </h1>
            {canvas.description && (
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                {canvas.description}
              </p>
            )}
          </div>
          <div className="border-2 border-gray-300 rounded-xl overflow-hidden bg-white">
            <div className="grid grid-cols-10" style={{ alignItems: 'stretch' }}>
              <div className="col-span-2 border-r border-gray-300">
                {blockMap.keyPartnerships && (
                  <BMCBlockCard block={blockMap.keyPartnerships} className="h-full rounded-none border-0" />
                )}
              </div>
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
              <div className="col-span-2 border-r border-gray-300">
                {blockMap.valuePropositions && (
                  <BMCBlockCard block={blockMap.valuePropositions} className="h-full rounded-none border-0" />
                )}
              </div>
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
              <div className="col-span-2">
                {blockMap.customerSegments && (
                  <BMCBlockCard block={blockMap.customerSegments} className="h-full rounded-none border-0" />
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 border-t border-gray-300">
              <div className="border-r border-gray-300">
                {blockMap.costStructure && (
                  <BMCBlockCard block={blockMap.costStructure} className="h-full rounded-none border-0" />
                )}
              </div>
              <div>
                {blockMap.revenueStreams && (
                  <BMCBlockCard block={blockMap.revenueStreams} className="h-full rounded-none border-0" />
                )}
              </div>
            </div>
          </div>
          <div style={{ marginTop: '10px', fontSize: '10px', color: '#9ca3af', textAlign: 'right' }}>
            Généré par Bomoko Fund · {new Date().toLocaleDateString('fr-FR')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMCCanvasGrid;
