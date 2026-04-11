import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Plus,
  LayoutGrid,
  Eye,
  Edit3,
  Trash2,
  Copy,
  Calendar,
  Loader2,
} from 'lucide-react';
import { RootState } from '@/redux/store';
import { setCanvas, setSavedCanvases, resetCurrentCanvas } from '@/redux/slices/bmcSlice';
import {
  useGetUserCanvasesQuery,
  useDeleteCanvasMutation,
  useDuplicateCanvasMutation,
} from '@/redux/services/bmcServices';
import { BusinessModelCanvas } from '@/types/bmc';
import toast from 'react-hot-toast';

const BMCDashboardList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { savedCanvases, currentCanvas } = useSelector((s: RootState) => s.bmcReducer);
  const { data: apiCanvases, isLoading, refetch } = useGetUserCanvasesQuery();
  const [deleteCanvas] = useDeleteCanvasMutation();
  const [duplicateCanvas] = useDuplicateCanvasMutation();

  useEffect(() => {
    if (apiCanvases) {
      dispatch(setSavedCanvases(apiCanvases));
    }
  }, [apiCanvases, dispatch]);

  const canvases: BusinessModelCanvas[] = apiCanvases || savedCanvases;

  const allCanvases = currentCanvas
    ? [currentCanvas, ...canvases.filter((c) => c._id !== currentCanvas._id)]
    : canvases;

  const handleView = (canvas: BusinessModelCanvas) => {
    dispatch(setCanvas(canvas));
    navigate(`/bmc/${canvas._id}`);
  };

  const handleDelete = async (canvas: BusinessModelCanvas) => {
    if (!confirm('Supprimer ce Business Model Canvas ?')) return;
    try {
      await deleteCanvas(canvas._id).unwrap();
      if (currentCanvas?._id === canvas._id) {
        dispatch(resetCurrentCanvas());
      }
      toast.success('Canvas supprimé');
      refetch();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleDuplicate = async (canvas: BusinessModelCanvas) => {
    try {
      const dup = await duplicateCanvas(canvas._id).unwrap();
      dispatch(setCanvas(dup));
      toast.success('Canvas dupliqué');
      refetch();
    } catch {
      toast.error('Erreur lors de la duplication');
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Business Model Canvas
          </h1>
          <p className="text-gray-500 mt-1">
            Visualisez et gérez vos modèles d'affaires
          </p>
        </div>
        <button
          onClick={() => navigate('/bmc/new')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          style={{ backgroundColor: 'rgb(3, 10, 61)' }}
        >
          <Plus className="w-5 h-5" />
          Nouveau BMC
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && allCanvases.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <LayoutGrid className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Aucun Business Model Canvas
          </h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Créez votre premier Business Model Canvas pour visualiser et structurer votre modèle d'affaires en une seule page.
          </p>
          <button
            onClick={() => navigate('/bmc/new')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold"
            style={{ backgroundColor: 'rgb(3, 10, 61)' }}
          >
            <Plus className="w-5 h-5" />
            Créer mon premier BMC
          </button>
        </motion.div>
      )}

      {/* Canvas cards */}
      {allCanvases.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCanvases.map((canvas, idx) => (
            <motion.div
              key={canvas._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
            >
              {/* Mini BMC preview */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => handleView(canvas)}
              >
                <div className="grid grid-cols-5 gap-0.5 h-16 mb-3 rounded overflow-hidden border border-gray-200">
                  {canvas.blocks.slice(0, 5).map((block) => (
                    <div
                      key={block.key}
                      className={`text-[6px] p-0.5 overflow-hidden ${
                        block.content ? 'bg-emerald-100' : 'bg-gray-100'
                      }`}
                    >
                      <div className="truncate text-gray-500">{block.content?.slice(0, 30)}</div>
                    </div>
                  ))}
                </div>

                <h3 className="font-semibold text-gray-900 mb-1 truncate">
                  {canvas.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span
                    className={`px-2 py-0.5 rounded-full font-medium ${
                      canvas.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {canvas.status === 'completed' ? 'Complété' : 'Brouillon'}
                  </span>
                  {canvas.createdAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(canvas.createdAt)}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-100 px-4 py-2 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleView(canvas)}
                  className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Voir"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleView(canvas)}
                  className="p-2 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                  title="Modifier"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDuplicate(canvas)}
                  className="p-2 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                  title="Dupliquer"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(canvas)}
                  className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BMCDashboardList;
