import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Gift, Truck, Heart, DollarSign, Wrench, Cog, Handshake, Receipt } from 'lucide-react';

const bmcBlocks = [
  { num: 1, label: 'Segments de clientèle', icon: Users, color: 'bg-emerald-500' },
  { num: 2, label: 'Propositions de valeur', icon: Gift, color: 'bg-emerald-600' },
  { num: 3, label: 'Canaux', icon: Truck, color: 'bg-emerald-700' },
  { num: 4, label: 'Relations clients', icon: Heart, color: 'bg-teal-600' },
  { num: 5, label: 'Sources de revenus', icon: DollarSign, color: 'bg-teal-700' },
  { num: 6, label: 'Ressources clés', icon: Wrench, color: 'bg-rose-600' },
  { num: 7, label: 'Activités clés', icon: Cog, color: 'bg-rose-700' },
  { num: 8, label: 'Partenaires clés', icon: Handshake, color: 'bg-rose-800' },
  { num: 9, label: 'Structure de coûts', icon: Receipt, color: 'bg-rose-900' },
];

const BMCIntroduction: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Business Model Canvas
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Le Business Model Canvas est un outil stratégique qui vous permet de visualiser, concevoir et réinventer votre modèle d'affaires en une seule page. Il est composé de 9 blocs interconnectés qui décrivent comment votre entreprise crée, délivre et capture de la valeur.
        </p>
      </motion.div>

      {/* Visual BMC grid diagram */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <div className="border-2 border-gray-300 rounded-xl overflow-hidden bg-white shadow-lg">
          {/* Top row: 5 columns */}
          <div className="grid grid-cols-1 md:grid-cols-10 min-h-[280px]">
            {/* Key Partners */}
            <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-gray-300 p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-rose-800 text-white flex items-center justify-center text-xs font-bold">8</div>
                <span className="font-semibold text-sm text-gray-800">Partenaires clés</span>
              </div>
              <p className="text-xs text-gray-500">Qui sont vos partenaires et fournisseurs clés ?</p>
            </div>

            {/* Key Activities + Key Resources stacked */}
            <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-gray-300 flex flex-col">
              <div className="flex-1 border-b border-gray-300 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded bg-rose-700 text-white flex items-center justify-center text-xs font-bold">7</div>
                  <span className="font-semibold text-sm text-gray-800">Activités clés</span>
                </div>
                <p className="text-xs text-gray-500">Quelles activités essentielles votre entreprise doit-elle réaliser ?</p>
              </div>
              <div className="flex-1 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded bg-rose-600 text-white flex items-center justify-center text-xs font-bold">6</div>
                  <span className="font-semibold text-sm text-gray-800">Ressources clés</span>
                </div>
                <p className="text-xs text-gray-500">De quelles ressources avez-vous besoin ?</p>
              </div>
            </div>

            {/* Value Propositions */}
            <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-gray-300 p-3 bg-amber-50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">2</div>
                <span className="font-semibold text-sm text-gray-800">Propositions de valeur</span>
              </div>
              <p className="text-xs text-gray-500">Quelle valeur apportez-vous à vos clients ?</p>
            </div>

            {/* Customer Relationships + Channels stacked */}
            <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-gray-300 flex flex-col">
              <div className="flex-1 border-b border-gray-300 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded bg-teal-600 text-white flex items-center justify-center text-xs font-bold">4</div>
                  <span className="font-semibold text-sm text-gray-800">Relations clients</span>
                </div>
                <p className="text-xs text-gray-500">Quel type de relation établissez-vous ?</p>
              </div>
              <div className="flex-1 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">3</div>
                  <span className="font-semibold text-sm text-gray-800">Canaux</span>
                </div>
                <p className="text-xs text-gray-500">Comment atteignez-vous vos clients ?</p>
              </div>
            </div>

            {/* Customer Segments */}
            <div className="md:col-span-2 border-b md:border-b-0 p-3 bg-emerald-50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">1</div>
                <span className="font-semibold text-sm text-gray-800">Segments de clientèle</span>
              </div>
              <p className="text-xs text-gray-500">Qui sont vos clients cibles ?</p>
            </div>
          </div>

          {/* Bottom row: 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-gray-300">
            <div className="border-b md:border-b-0 md:border-r border-gray-300 p-3 min-h-[80px]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-rose-900 text-white flex items-center justify-center text-xs font-bold">9</div>
                <span className="font-semibold text-sm text-gray-800">Structure de coûts</span>
              </div>
              <p className="text-xs text-gray-500">Quels sont les coûts les plus importants de votre modèle ?</p>
            </div>
            <div className="p-3 min-h-[80px]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-teal-700 text-white flex items-center justify-center text-xs font-bold">5</div>
                <span className="font-semibold text-sm text-gray-800">Sources de revenus</span>
              </div>
              <p className="text-xs text-gray-500">Comment générez-vous des revenus ?</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Step-by-step fill order */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
          Remplissez votre BMC étape par étape
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {bmcBlocks.map((block, idx) => {
            const Icon = block.icon;
            return (
              <React.Fragment key={block.num}>
                <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                  <div className={`w-7 h-7 rounded ${block.color} text-white flex items-center justify-center text-xs font-bold`}>
                    {block.num}
                  </div>
                  <Icon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{block.label}</span>
                </div>
                {idx < bmcBlocks.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-gray-400 self-center hidden md:block" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </motion.div>

      {/* What a banker looks for */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-12"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">Ce qu'un financier recherche dans votre BMC :</h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">1</div>
            <span>Une <strong>description détaillée</strong> de vos segments de clientèle (marché cible, prix, exigences)</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">2</div>
            <span>La <strong>cohérence</strong> de chaque bloc avec le segment de clientèle et la proposition de valeur</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">3</div>
            <span>La <strong>cohérence entre les blocs</strong> (ex: les ressources clés correspondent à la structure de coûts)</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">4</div>
            <span>Un <strong>calcul détaillé</strong> de la structure de coûts et des prévisions de revenus</span>
          </li>
        </ul>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <button
          onClick={() => navigate('/bmc/wizard')}
          className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
          style={{ backgroundColor: 'rgb(3, 10, 61)' }}
        >
          Générer mon Business Model Canvas
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-sm text-gray-500 mt-3">
          Répondez à 9 questions simples et laissez l'IA structurer votre canvas
        </p>
      </motion.div>
    </div>
  );
};

export default BMCIntroduction;
