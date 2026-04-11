import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  Loader2,
  LayoutGrid,
} from 'lucide-react';
import { RootState } from '@/redux/store';
import { setStrategySuggestions } from '@/redux/slices/bmcSlice';
import { StrategySuggestion } from '@/types/bmc';
import { generateBMCStrategySuggestions } from '@/lib/groqService';

const categoryConfig: Record<
  StrategySuggestion['category'],
  { label: string; icon: React.ElementType; color: string; bg: string; border: string }
> = {
  growth: {
    label: 'Croissance',
    icon: TrendingUp,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  monetization: {
    label: 'Monétisation',
    icon: DollarSign,
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  risk: {
    label: 'Risques',
    icon: AlertTriangle,
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
};

const BMCStrategySuggestions: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const canvas = useSelector((s: RootState) => s.bmcReducer.currentCanvas);
  const [isRegenerating, setIsRegenerating] = useState(false);

  if (!canvas) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Aucun canvas trouvé.</p>
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

  const suggestions = canvas.strategySuggestions || [];
  const grouped = {
    growth: suggestions.filter((s) => s.category === 'growth'),
    monetization: suggestions.filter((s) => s.category === 'monetization'),
    risk: suggestions.filter((s) => s.category === 'risk'),
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const newSuggestions = await generateBMCStrategySuggestions(canvas.blocks);
      dispatch(setStrategySuggestions(newSuggestions));
    } catch (error) {
      console.error('Error regenerating strategies:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/bmc/${id}`)}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Recommandations stratégiques
            </h1>
            <p className="text-sm text-gray-500">{canvas.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/bmc/${id}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium"
          >
            <LayoutGrid className="w-4 h-4" />
            Voir le Canvas
          </button>
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
            style={{ backgroundColor: 'rgb(3, 10, 61)' }}
          >
            {isRegenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Régénérer
          </button>
        </div>
      </div>

      {/* Suggestions by category */}
      {suggestions.length === 0 ? (
        <div className="text-center py-16">
          <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            Aucune recommandation disponible. Générez des suggestions basées sur votre canvas.
          </p>
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="px-6 py-3 rounded-lg text-white font-semibold"
            style={{ backgroundColor: 'rgb(3, 10, 61)' }}
          >
            Générer des recommandations
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {(Object.keys(grouped) as StrategySuggestion['category'][]).map((category) => {
            const config = categoryConfig[category];
            const items = grouped[category];
            const Icon = config.icon;

            if (items.length === 0) return null;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-8 h-8 rounded-lg ${config.bg} ${config.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h2 className={`text-lg font-bold ${config.color}`}>{config.label}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((suggestion, idx) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`${config.bg} border ${config.border} rounded-xl p-5`}
                    >
                      <h3 className={`font-semibold ${config.color} mb-2`}>
                        {suggestion.title}
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {suggestion.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BMCStrategySuggestions;
