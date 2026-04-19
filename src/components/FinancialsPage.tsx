import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/userSlice';
import { useTranslation } from '@/lib/TranslationContext';
import { useGetUserVenturesQuery } from '@/redux/services/ventureServices';
import {
  useGetFinanceSheetQuery,
  useCreateFinanceSheetMutation,
  useUpdateFinanceSheetMutation,
} from '@/redux/services/financeServices';
import {
  CostItem,
  LabourItem,
  RevenueItem,
  FinancialSheet,
  CreateFinanceSheetRequest,
  calcDepreciation,
  calcCostItemTotal,
  calcLabourTotal,
  calcRevenueItemTotal,
  computeSummary,
} from '@/types/finance';
import {
  Plus,
  Trash2,
  Save,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building,
  Loader2,
  Info,
  ChevronDown,
  Calculator,
  BarChart3,
  Package,
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ─── helpers ─── */
const newId = () => crypto.randomUUID();

const emptySheet = (): Omit<CreateFinanceSheetRequest, 'ventureId'> => ({
  currency: 'USD',
  exchangeRate: 1,
  fixedCosts: [],
  variableCosts: { inputsServices: [], labour: [] },
  revenueItems: [],
});

const fmt = (n: number, decimals = 2) =>
  n.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

type Tab = 'costs' | 'revenue' | 'analysis';

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const FinancialsPage: React.FC = () => {
  const { t, language } = useTranslation() as any;
  const lang = (language as string) || 'en';
  const user = useAppSelector(selectUser) as any;

  const [activeTab, setActiveTab] = useState<Tab>('costs');
  const [selectedVentureId, setSelectedVentureId] = useState('');
  const [sheetId, setSheetId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  /* sheet state */
  const [currency, setCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [fixedCosts, setFixedCosts] = useState<CostItem[]>([]);
  const [inputsServices, setInputsServices] = useState<CostItem[]>([]);
  const [labour, setLabour] = useState<LabourItem[]>([]);
  const [revenueItems, setRevenueItems] = useState<RevenueItem[]>([]);

  /* ── Ventures ── */
  const { data: venturesResp, isLoading: loadingVentures } = useGetUserVenturesQuery(
    { userId: user?._id || '', page: 1, limit: 50 },
    { skip: !user?._id },
  );
  const ventures: any[] = Array.isArray(venturesResp)
    ? venturesResp
    : Array.isArray((venturesResp as any)?.ventures)
    ? (venturesResp as any).ventures
    : Array.isArray((venturesResp as any)?.data)
    ? (venturesResp as any).data
    : [];

  useEffect(() => {
    if (ventures.length > 0 && !selectedVentureId) {
      setSelectedVentureId(ventures[0]._id);
    }
  }, [ventures, selectedVentureId]);

  /* ── Load existing sheet ── */
  const { data: existingSheet, isLoading: loadingSheet, refetch } = useGetFinanceSheetQuery(
    selectedVentureId,
    { skip: !selectedVentureId },
  );

  const [createSheet] = useCreateFinanceSheetMutation();
  const [updateSheet] = useUpdateFinanceSheetMutation();

  /* hydrate local state when sheet loads */
  useEffect(() => {
    if (existingSheet) {
      setSheetId(existingSheet._id);
      setCurrency(existingSheet.currency || 'USD');
      setExchangeRate(existingSheet.exchangeRate ?? 1);
      setFixedCosts(existingSheet.fixedCosts ?? []);
      setInputsServices(existingSheet.variableCosts?.inputsServices ?? []);
      setLabour(existingSheet.variableCosts?.labour ?? []);
      setRevenueItems(existingSheet.revenueItems ?? []);
    } else if (existingSheet === null) {
      setSheetId(null);
      const blank = emptySheet();
      setCurrency(blank.currency);
      setExchangeRate(blank.exchangeRate);
      setFixedCosts([]);
      setInputsServices([]);
      setLabour([]);
      setRevenueItems([]);
    }
  }, [existingSheet]);

  /* ── Computed summary ── */
  const summary = computeSummary({
    ventureId: selectedVentureId,
    currency,
    exchangeRate,
    fixedCosts,
    variableCosts: { inputsServices, labour },
    revenueItems,
  });

  /* ── Save ── */
  const handleSave = async () => {
    if (!selectedVentureId) {
      toast.error(lang === 'fr' ? 'Sélectionnez une entreprise' : 'Select a venture first');
      return;
    }
    setSaving(true);
    const payload: CreateFinanceSheetRequest = {
      ventureId: selectedVentureId,
      currency,
      exchangeRate,
      fixedCosts,
      variableCosts: { inputsServices, labour },
      revenueItems,
    };
    try {
      if (sheetId) {
        await updateSheet({ id: sheetId, ...payload }).unwrap();
      } else {
        const created = await createSheet(payload).unwrap();
        setSheetId(created._id);
      }
      toast.success(lang === 'fr' ? 'Données financières sauvegardées' : 'Financial data saved');
      refetch();
    } catch {
      toast.error(lang === 'fr' ? 'Erreur lors de la sauvegarde' : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  /* ── Row mutations ── */
  const addFixedCost = () =>
    setFixedCosts((p) => [
      ...p,
      { id: newId(), name: '', unit: '', quantity: 1, unitPrice: 0, periodOfUse: 1, resaleValue: 0 },
    ]);
  const addInput = () =>
    setInputsServices((p) => [...p, { id: newId(), name: '', unit: '', quantity: 1, unitPrice: 0 }]);
  const addLabour = () =>
    setLabour((p) => [...p, { id: newId(), name: '', unit: '', quantity: 1, unitPrice: 0 }]);
  const addRevenue = (type: 'product' | 'by-product') =>
    setRevenueItems((p) => [...p, { id: newId(), name: '', unit: '', quantity: 1, unitPrice: 0, type }]);

  const selectedVenture = ventures.find((v) => v._id === selectedVentureId);

  /* ─────────────────────────────────────────────────────── */
  return (
    <div className="w-full" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #f8faff 100%)' }}>

      {/* ══ Hero Header ══ */}
      <div
        className="relative overflow-hidden px-8 py-10"
        style={{ background: 'linear-gradient(135deg, #020A3C 0%, #0a1963 50%, #0d2080 100%)' }}
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 left-1/2 w-48 h-48 bg-[#3AB6FF]/10 rounded-full pointer-events-none" />
        <div className="relative flex items-start justify-between gap-6 flex-wrap">
          <div>
            <p className="text-[#3AB6FF] text-xs font-semibold uppercase tracking-widest mb-1">
              {lang === 'fr' ? 'Analyse financière' : 'Financial Analysis'}
            </p>
            <h1 className="text-3xl font-bold text-white">
              {lang === 'fr' ? 'Finances' : 'Financials'}
            </h1>
            <p className="text-white/50 text-sm mt-1">
              {lang === 'fr'
                ? 'Calculez vos coûts, revenus et marges'
                : 'Calculate your costs, revenue and margins'}
            </p>
          </div>

          {/* Venture selector */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <select
                value={selectedVentureId}
                onChange={(e) => setSelectedVentureId(e.target.value)}
                className="bg-white/10 text-white text-sm border border-white/20 rounded-xl pl-9 pr-10 py-2.5 appearance-none focus:outline-none focus:border-[#3AB6FF]/60 cursor-pointer"
              >
                {loadingVentures ? (
                  <option>Loading…</option>
                ) : ventures.length === 0 ? (
                  <option value="">{lang === 'fr' ? 'Aucune entreprise' : 'No ventures'}</option>
                ) : (
                  ventures.map((v) => (
                    <option key={v._id} value={v._id} className="text-gray-900 bg-white">
                      {v.businessName}
                    </option>
                  ))
                )}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
            </div>

            {/* Currency + Exchange rate */}
            <input
              value={currency}
              onChange={(e) => setCurrency(e.target.value.toUpperCase().slice(0, 5))}
              className="w-20 bg-white/10 text-white text-sm border border-white/20 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#3AB6FF]/60 placeholder-white/40"
              placeholder="USD"
              title={lang === 'fr' ? 'Devise' : 'Currency'}
            />
            <div className="flex items-center gap-1.5">
              <span className="text-white/50 text-xs">1 {currency} =</span>
              <input
                type="number"
                min={0}
                step="any"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 1)}
                className="w-24 bg-white/10 text-white text-sm border border-white/20 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#3AB6FF]/60"
              />
              <span className="text-white/50 text-xs">USD</span>
            </div>

            <button
              onClick={handleSave}
              disabled={saving || !selectedVentureId}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#3AB6FF] hover:bg-[#2aa5ee] disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-[#3AB6FF]/30 hover:-translate-y-0.5 hover:shadow-xl"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {lang === 'fr' ? 'Enregistrer' : 'Save'}
            </button>
          </div>
        </div>

        {/* Summary pills */}
        {selectedVentureId && (
          <div className="relative mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: lang === 'fr' ? 'Charges fixes' : 'Fixed Costs', value: summary.totalFixedCosts, color: 'text-orange-300', sign: '' },
              { label: lang === 'fr' ? 'Charges variables' : 'Variable Costs', value: summary.totalVariableCosts, color: 'text-yellow-300', sign: '' },
              { label: lang === 'fr' ? 'Coûts totaux' : 'Total Costs', value: summary.totalCosts, color: 'text-red-300', sign: '' },
              { label: lang === 'fr' ? 'Chiffre d\'affaires' : 'Gross Revenue', value: summary.grossRevenue, color: 'text-emerald-300', sign: '' },
              { label: 'Gross Margin (GM)', value: summary.grossMargin, color: summary.grossMargin >= 0 ? 'text-emerald-300' : 'text-red-300', sign: summary.grossMargin >= 0 ? '+' : '' },
              { label: 'Net Margin (NM)', value: summary.netMargin, color: summary.netMargin >= 0 ? 'text-emerald-300' : 'text-red-300', sign: summary.netMargin >= 0 ? '+' : '' },
            ].map(({ label, value, color, sign }) => (
              <div key={label} className="bg-white/8 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
                <p className="text-white/50 text-[10px] font-medium truncate">{label}</p>
                <p className={`text-base font-bold mt-1 ${color}`}>
                  {sign}{fmt(value)} <span className="text-[10px] font-normal opacity-70">{currency}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══ Tabs ══ */}
      <div className="px-8 pt-6">
        <div className="flex gap-2 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 w-fit">
          {([
            { id: 'costs' as Tab, icon: Calculator, label: lang === 'fr' ? '1. Calcul des coûts' : '1. Cost Calculation' },
            { id: 'revenue' as Tab, icon: Package, label: lang === 'fr' ? '2. Revenus' : '2. Revenue' },
            { id: 'analysis' as Tab, icon: BarChart3, label: lang === 'fr' ? '3. Analyse' : '3. Analysis' },
          ] as const).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === id
                  ? 'bg-[#020A3C] text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ══ Content ══ */}
      <div className="p-8 space-y-6">
        {loadingSheet && selectedVentureId ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
          </div>
        ) : !selectedVentureId ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
              <Building className="w-8 h-8 text-gray-300" />
            </div>
            <p className="font-semibold text-gray-600">
              {lang === 'fr' ? 'Sélectionnez une entreprise pour commencer' : 'Select a venture to get started'}
            </p>
          </div>
        ) : (
          <>
            {/* ════════════════════════════
                TAB 1 — COST CALCULATION
            ════════════════════════════ */}
            {activeTab === 'costs' && (
              <div className="space-y-6">

                {/* ── Fixed Costs ── */}
                <SectionCard
                  number="1"
                  title={lang === 'fr' ? 'Charges fixes' : 'Fixed Costs'}
                  color="orange"
                  tooltip={lang === 'fr'
                    ? 'Coûts qui ne changent pas avec le volume de production. Exemples : équipements, infrastructure.'
                    : 'Costs that do not change with the production volume. Examples: equipment, infrastructure.'}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#5a7a3a]/10 text-[#3a5a1e]">
                          <Th>{lang === 'fr' ? 'Désignation' : 'Item'}</Th>
                          <Th>{lang === 'fr' ? 'Unité' : 'Unit'}</Th>
                          <Th>{lang === 'fr' ? 'Quantité' : 'Qty'}</Th>
                          <Th>{lang === 'fr' ? 'Prix unitaire' : 'Unit Price'} ({currency})</Th>
                          <Th>{lang === 'fr' ? 'Durée (ans)' : 'Period (yrs)'}</Th>
                          <Th>{lang === 'fr' ? 'Val. résiduelle' : 'Resale Value'}</Th>
                          <Th className="text-right">{lang === 'fr' ? 'Amortissement/an' : 'Depreciation/yr'}</Th>
                          <Th />
                        </tr>
                      </thead>
                      <tbody>
                        {fixedCosts.map((item, idx) => (
                          <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                            <Td>
                              <input
                                value={item.name}
                                onChange={(e) => setFixedCosts(update(fixedCosts, idx, { name: e.target.value }))}
                                className={inputCls}
                                placeholder={lang === 'fr' ? 'ex. Moissonneuse' : 'e.g. Harvester'}
                              />
                            </Td>
                            <Td>
                              <UnitInput id={item.id} value={item.unit} onChange={(v) => setFixedCosts(update(fixedCosts, idx, { unit: v }))} />
                            </Td>
                            <Td>
                              <NumInput value={item.quantity} onChange={(v) => setFixedCosts(update(fixedCosts, idx, { quantity: v }))} />
                            </Td>
                            <Td>
                              <NumInput value={item.unitPrice} onChange={(v) => setFixedCosts(update(fixedCosts, idx, { unitPrice: v }))} />
                            </Td>
                            <Td>
                              <NumInput value={item.periodOfUse ?? 1} onChange={(v) => setFixedCosts(update(fixedCosts, idx, { periodOfUse: v }))} min={1} />
                            </Td>
                            <Td>
                              <NumInput value={item.resaleValue ?? 0} onChange={(v) => setFixedCosts(update(fixedCosts, idx, { resaleValue: v }))} />
                            </Td>
                            <Td className="text-right font-semibold text-orange-700">
                              {fmt(calcDepreciation(item))}
                            </Td>
                            <Td>
                              <button
                                onClick={() => setFixedCosts(fixedCosts.filter((_, i) => i !== idx))}
                                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </Td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between mt-3 px-1">
                    <button onClick={addFixedCost} className={addRowBtn('orange')}>
                      <Plus className="w-3.5 h-3.5" />
                      {lang === 'fr' ? 'Ajouter une ligne' : 'Add row'}
                    </button>
                    <TotalRow label={lang === 'fr' ? 'Total charges fixes' : 'Total Fixed Costs'} value={summary.totalFixedCosts} currency={currency} color="orange" />
                  </div>
                </SectionCard>

                {/* ── Variable Costs — Inputs ── */}
                <SectionCard
                  number="2"
                  title={lang === 'fr' ? 'Charges variables — Intrants & services' : 'Variable Costs — Inputs & Services'}
                  color="yellow"
                  tooltip={lang === 'fr'
                    ? 'Coûts qui varient proportionnellement à la production. Exemples : semences, engrais, emballage.'
                    : 'Costs that vary proportionally with production. Examples: seeds, fertilizer, packaging.'}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-yellow-50 text-yellow-800">
                          <Th>{lang === 'fr' ? 'Désignation' : 'Item'}</Th>
                          <Th>{lang === 'fr' ? 'Unité' : 'Unit'}</Th>
                          <Th>{lang === 'fr' ? 'Quantité' : 'Qty'}</Th>
                          <Th>{lang === 'fr' ? 'Prix unitaire' : 'Unit Price'} ({currency})</Th>
                          <Th className="text-right">Total ({currency})</Th>
                          <Th className="text-right">Total (USD)</Th>
                          <Th />
                        </tr>
                      </thead>
                      <tbody>
                        {inputsServices.map((item, idx) => (
                          <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                            <Td>
                              <input
                                value={item.name}
                                onChange={(e) => setInputsServices(update(inputsServices, idx, { name: e.target.value }))}
                                className={inputCls}
                                placeholder={lang === 'fr' ? 'ex. Engrais' : 'e.g. Fertilizer'}
                              />
                            </Td>
                            <Td>
                              <UnitInput id={item.id} value={item.unit} onChange={(v) => setInputsServices(update(inputsServices, idx, { unit: v }))} />
                            </Td>
                            <Td>
                              <NumInput value={item.quantity} onChange={(v) => setInputsServices(update(inputsServices, idx, { quantity: v }))} />
                            </Td>
                            <Td>
                              <NumInput value={item.unitPrice} onChange={(v) => setInputsServices(update(inputsServices, idx, { unitPrice: v }))} />
                            </Td>
                            <Td className="text-right font-semibold text-yellow-700">{fmt(calcCostItemTotal(item))}</Td>
                            <Td className="text-right text-gray-400">{fmt(calcCostItemTotal(item) * exchangeRate)}</Td>
                            <Td>
                              <button onClick={() => setInputsServices(inputsServices.filter((_, i) => i !== idx))} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </Td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between mt-3 px-1">
                    <button onClick={addInput} className={addRowBtn('yellow')}>
                      <Plus className="w-3.5 h-3.5" />
                      {lang === 'fr' ? 'Ajouter une ligne' : 'Add row'}
                    </button>
                  </div>
                </SectionCard>

                {/* ── Variable Costs — Labour ── */}
                <SectionCard
                  number="3"
                  title={lang === 'fr' ? 'Charges variables — Main-d\'œuvre' : 'Variable Costs — Labour'}
                  color="blue"
                  tooltip={lang === 'fr'
                    ? 'Coûts de main-d\'œuvre par journée-personne (JP). Listez chaque tâche séparément.'
                    : 'Labour costs per Person-Day (PD). List each task separately.'}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-blue-50 text-blue-800">
                          <Th>{lang === 'fr' ? 'Tâche' : 'Task'}</Th>
                          <Th>{lang === 'fr' ? 'Unité' : 'Unit'}</Th>
                          <Th>{lang === 'fr' ? 'Nb. journées (JP)' : 'Person-Days (PD)'}</Th>
                          <Th>{lang === 'fr' ? 'Prix / JP' : 'Price / PD'} ({currency})</Th>
                          <Th className="text-right">Total ({currency})</Th>
                          <Th className="text-right">Total (USD)</Th>
                          <Th />
                        </tr>
                      </thead>
                      <tbody>
                        {labour.map((item, idx) => (
                          <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                            <Td>
                              <input
                                value={item.name}
                                onChange={(e) => setLabour(update(labour, idx, { name: e.target.value }))}
                                className={inputCls}
                                placeholder={lang === 'fr' ? 'ex. Récolte' : 'e.g. Harvesting'}
                              />
                            </Td>
                            <Td>
                              <UnitInput id={item.id} value={item.unit} onChange={(v) => setLabour(update(labour, idx, { unit: v }))} />
                            </Td>
                            <Td>
                              <NumInput value={item.quantity} onChange={(v) => setLabour(update(labour, idx, { quantity: v }))} />
                            </Td>
                            <Td>
                              <NumInput value={item.unitPrice} onChange={(v) => setLabour(update(labour, idx, { unitPrice: v }))} />
                            </Td>
                            <Td className="text-right font-semibold text-blue-700">{fmt(calcLabourTotal(item))}</Td>
                            <Td className="text-right text-gray-400">{fmt(calcLabourTotal(item) * exchangeRate)}</Td>
                            <Td>
                              <button onClick={() => setLabour(labour.filter((_, i) => i !== idx))} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </Td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between mt-3 px-1">
                    <button onClick={addLabour} className={addRowBtn('blue')}>
                      <Plus className="w-3.5 h-3.5" />
                      {lang === 'fr' ? 'Ajouter une ligne' : 'Add row'}
                    </button>
                    <TotalRow label={lang === 'fr' ? 'Total main-d\'œuvre' : 'Total Labour'} value={labour.reduce((a, i) => a + calcLabourTotal(i), 0)} currency={currency} color="blue" />
                  </div>
                </SectionCard>

                {/* ── Cost Summary Banner ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SummaryBanner label={lang === 'fr' ? 'Total charges variables' : 'Total Variable Costs'} value={summary.totalVariableCosts} currency={currency} exchangeRate={exchangeRate} bg="bg-yellow-50" border="border-yellow-200" text="text-yellow-800" />
                  <SummaryBanner label={lang === 'fr' ? 'Total charges fixes' : 'Total Fixed Costs'} value={summary.totalFixedCosts} currency={currency} exchangeRate={exchangeRate} bg="bg-orange-50" border="border-orange-200" text="text-orange-800" />
                  <SummaryBanner label={lang === 'fr' ? 'Coûts totaux' : 'Total Costs'} value={summary.totalCosts} currency={currency} exchangeRate={exchangeRate} bg="bg-red-50" border="border-red-200" text="text-red-800" bold />
                </div>
              </div>
            )}

            {/* ════════════════════════════
                TAB 2 — REVENUE
            ════════════════════════════ */}
            {activeTab === 'revenue' && (
              <div className="space-y-6">
                <SectionCard
                  number="Σ"
                  title={lang === 'fr' ? 'Calcul du chiffre d\'affaires brut' : 'Gross Revenue Calculation'}
                  color="green"
                  tooltip={lang === 'fr'
                    ? 'Listez chaque produit et sous-produit vendu. Multipliez la quantité par le prix de vente.'
                    : 'List each product and by-product sold. Multiply quantity by selling price.'}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-emerald-50 text-emerald-800">
                          <Th>{lang === 'fr' ? 'Type' : 'Type'}</Th>
                          <Th>{lang === 'fr' ? 'Produit / Service' : 'Product / Service'}</Th>
                          <Th>{lang === 'fr' ? 'Unité' : 'Unit'}</Th>
                          <Th>{lang === 'fr' ? 'Quantité' : 'Quantity'}</Th>
                          <Th>{lang === 'fr' ? 'Prix de vente' : 'Selling Price'} ({currency})</Th>
                          <Th className="text-right">Total ({currency})</Th>
                          <Th className="text-right">Total (USD)</Th>
                          <Th />
                        </tr>
                      </thead>
                      <tbody>
                        {revenueItems.map((item, idx) => (
                          <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                            <Td>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.type === 'product' ? 'bg-emerald-100 text-emerald-700' : 'bg-teal-100 text-teal-700'}`}>
                                {item.type === 'product' ? (lang === 'fr' ? 'Produit' : 'Product') : (lang === 'fr' ? 'Sous-produit' : 'By-product')}
                              </span>
                            </Td>
                            <Td>
                              <input
                                value={item.name}
                                onChange={(e) => setRevenueItems(update(revenueItems, idx, { name: e.target.value }))}
                                className={inputCls}
                                placeholder={lang === 'fr' ? 'ex. Riz étuvé' : 'e.g. Parboiled rice'}
                              />
                            </Td>
                            <Td>
                              <UnitInput id={item.id} value={item.unit} onChange={(v) => setRevenueItems(update(revenueItems, idx, { unit: v }))} />
                            </Td>
                            <Td>
                              <NumInput value={item.quantity} onChange={(v) => setRevenueItems(update(revenueItems, idx, { quantity: v }))} />
                            </Td>
                            <Td>
                              <NumInput value={item.unitPrice} onChange={(v) => setRevenueItems(update(revenueItems, idx, { unitPrice: v }))} />
                            </Td>
                            <Td className="text-right font-semibold text-emerald-700">{fmt(calcRevenueItemTotal(item))}</Td>
                            <Td className="text-right text-gray-400">{fmt(calcRevenueItemTotal(item) * exchangeRate)}</Td>
                            <Td>
                              <button onClick={() => setRevenueItems(revenueItems.filter((_, i) => i !== idx))} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </Td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between mt-3 px-1 flex-wrap gap-3">
                    <div className="flex gap-2">
                      <button onClick={() => addRevenue('product')} className={addRowBtn('green')}>
                        <Plus className="w-3.5 h-3.5" />
                        {lang === 'fr' ? 'Produit' : 'Product'}
                      </button>
                      <button onClick={() => addRevenue('by-product')} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl text-xs font-semibold transition-colors border border-teal-200">
                        <Plus className="w-3.5 h-3.5" />
                        {lang === 'fr' ? 'Sous-produit' : 'By-product'}
                      </button>
                    </div>
                    <TotalRow label={lang === 'fr' ? 'Chiffre d\'affaires brut' : 'Gross Revenue'} value={summary.grossRevenue} currency={currency} color="green" />
                  </div>
                </SectionCard>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SummaryBanner label={lang === 'fr' ? 'Nb. de lignes produits' : 'Product lines'} value={revenueItems.filter((r) => r.type === 'product').length} currency="" exchangeRate={1} bg="bg-emerald-50" border="border-emerald-200" text="text-emerald-800" isCount />
                  <SummaryBanner label={lang === 'fr' ? 'Nb. de sous-produits' : 'By-product lines'} value={revenueItems.filter((r) => r.type === 'by-product').length} currency="" exchangeRate={1} bg="bg-teal-50" border="border-teal-200" text="text-teal-800" isCount />
                  <SummaryBanner label={lang === 'fr' ? 'Chiffre d\'affaires brut' : 'Gross Revenue'} value={summary.grossRevenue} currency={currency} exchangeRate={exchangeRate} bg="bg-emerald-50" border="border-emerald-200" text="text-emerald-800" bold />
                </div>
              </div>
            )}

            {/* ════════════════════════════
                TAB 3 — ANALYSIS
            ════════════════════════════ */}
            {activeTab === 'analysis' && (
              <div className="space-y-6">

                {/* Venture name */}
                {selectedVenture && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Building className="w-4 h-4" />
                    <span className="font-medium text-gray-700">{selectedVenture.businessName}</span>
                    <span>—</span>
                    <span>{lang === 'fr' ? 'Analyse des marges' : 'Margin Analysis'}</span>
                  </div>
                )}

                {/* Calculation cascade */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* Left: step-by-step */}
                  <div className="space-y-4">
                    <MarginStep
                      label={lang === 'fr' ? 'Chiffre d\'affaires brut' : 'Gross Revenue'}
                      value={summary.grossRevenue}
                      currency={currency}
                      exchangeRate={exchangeRate}
                      bg="bg-emerald-50"
                      border="border-emerald-300"
                      text="text-emerald-800"
                      icon={<DollarSign className="w-5 h-5 text-emerald-500" />}
                      detail={lang === 'fr' ? 'Σ (quantité × prix de vente)' : 'Σ (quantity × selling price)'}
                    />
                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <span className="text-yellow-600 font-bold text-lg">−</span>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-yellow-700">{lang === 'fr' ? 'Charges variables' : 'Variable Costs'}</p>
                        <p className="text-xs text-yellow-500">{lang === 'fr' ? 'Intrants + Main-d\'œuvre' : 'Inputs + Labour'}</p>
                      </div>
                      <span className="font-bold text-yellow-700">{fmt(summary.totalVariableCosts)} {currency}</span>
                    </div>

                    <MarginStep
                      label="Gross Margin (GM)"
                      value={summary.grossMargin}
                      currency={currency}
                      exchangeRate={exchangeRate}
                      bg={summary.grossMargin >= 0 ? 'bg-blue-50' : 'bg-red-50'}
                      border={summary.grossMargin >= 0 ? 'border-blue-300' : 'border-red-300'}
                      text={summary.grossMargin >= 0 ? 'text-blue-800' : 'text-red-800'}
                      icon={summary.grossMargin >= 0 ? <TrendingUp className="w-5 h-5 text-blue-500" /> : <TrendingDown className="w-5 h-5 text-red-500" />}
                      detail={lang === 'fr' ? 'CA brut − Charges variables' : 'Gross Revenue − Variable Costs'}
                      badge={summary.grossMargin < 0 ? (lang === 'fr' ? '⚠ Marge négative' : '⚠ Negative margin') : undefined}
                    />

                    <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-xl">
                      <span className="text-orange-600 font-bold text-lg">−</span>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-orange-700">{lang === 'fr' ? 'Charges fixes' : 'Fixed Costs'}</p>
                        <p className="text-xs text-orange-500">{lang === 'fr' ? 'Amortissements annuels' : 'Annual depreciation'}</p>
                      </div>
                      <span className="font-bold text-orange-700">{fmt(summary.totalFixedCosts)} {currency}</span>
                    </div>

                    <MarginStep
                      label="Net Margin (NM)"
                      value={summary.netMargin}
                      currency={currency}
                      exchangeRate={exchangeRate}
                      bg={summary.netMargin >= 0 ? 'bg-[#020A3C]/5' : 'bg-red-50'}
                      border={summary.netMargin >= 0 ? 'border-[#020A3C]/20' : 'border-red-300'}
                      text={summary.netMargin >= 0 ? 'text-[#020A3C]' : 'text-red-800'}
                      icon={summary.netMargin >= 0 ? <TrendingUp className="w-5 h-5 text-[#3AB6FF]" /> : <TrendingDown className="w-5 h-5 text-red-500" />}
                      detail={lang === 'fr' ? 'Marge brute − Charges fixes' : 'Gross Margin − Fixed Costs'}
                      large
                      badge={summary.netMargin < 0 ? (lang === 'fr' ? '⚠ Perte nette' : '⚠ Net loss') : undefined}
                    />
                  </div>

                  {/* Right: summary table */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 bg-gray-50">
                      <h3 className="font-bold text-gray-800 text-sm">
                        {lang === 'fr' ? 'Récapitulatif' : 'Summary Table'}
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {[
                        { label: lang === 'fr' ? '1. Chiffre d\'affaires brut' : '1. Gross Revenue', value: summary.grossRevenue, cls: 'font-semibold text-emerald-700' },
                        { label: lang === 'fr' ? '2. Charges variables' : '2. Variable Costs', value: -summary.totalVariableCosts, cls: 'text-yellow-700' },
                        { label: lang === 'fr' ? '3. Marge brute (MB)' : '3. Gross Margin (GM)', value: summary.grossMargin, cls: `font-bold ${summary.grossMargin >= 0 ? 'text-blue-700' : 'text-red-600'}` },
                        { label: lang === 'fr' ? '4. Charges fixes' : '4. Fixed Costs', value: -summary.totalFixedCosts, cls: 'text-orange-700' },
                        { label: lang === 'fr' ? '5. Marge nette (MN)' : '5. Net Margin (NM)', value: summary.netMargin, cls: `font-bold text-base ${summary.netMargin >= 0 ? 'text-[#020A3C]' : 'text-red-600'}` },
                      ].map(({ label, value, cls }) => (
                        <div key={label} className="flex items-center justify-between px-6 py-3">
                          <span className="text-sm text-gray-600">{label}</span>
                          <div className="text-right">
                            <span className={`text-sm ${cls}`}>{value >= 0 ? '' : ''}{fmt(value)} {currency}</span>
                            {exchangeRate !== 1 && (
                              <p className="text-[10px] text-gray-400">{fmt(value * exchangeRate)} USD</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Margin % */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 space-y-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {lang === 'fr' ? 'Taux de marge' : 'Margin Rates'}
                      </p>
                      {[
                        {
                          label: lang === 'fr' ? 'Taux marge brute' : 'Gross Margin Rate',
                          pct: summary.grossRevenue > 0 ? (summary.grossMargin / summary.grossRevenue) * 100 : 0,
                        },
                        {
                          label: lang === 'fr' ? 'Taux marge nette' : 'Net Margin Rate',
                          pct: summary.grossRevenue > 0 ? (summary.netMargin / summary.grossRevenue) * 100 : 0,
                        },
                      ].map(({ label, pct }) => (
                        <div key={label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500">{label}</span>
                            <span className={`font-bold ${pct >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{fmt(pct, 1)}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pct >= 0 ? 'bg-emerald-400' : 'bg-red-400'}`}
                              style={{ width: `${Math.min(Math.abs(pct), 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Interpretation note */}
                <div className={`rounded-2xl border p-5 ${summary.netMargin >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${summary.netMargin >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                      {summary.netMargin >= 0
                        ? <TrendingUp className="w-4 h-4 text-emerald-600" />
                        : <TrendingDown className="w-4 h-4 text-red-500" />}
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${summary.netMargin >= 0 ? 'text-emerald-800' : 'text-red-700'}`}>
                        {summary.netMargin >= 0
                          ? (lang === 'fr' ? '✓ Votre activité est rentable' : '✓ Your business is profitable')
                          : (lang === 'fr' ? '✗ Votre activité n\'est pas encore rentable' : '✗ Your business is not yet profitable')}
                      </p>
                      <p className={`text-xs mt-1 ${summary.netMargin >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {summary.netMargin >= 0
                          ? (lang === 'fr'
                              ? `Votre marge nette est de ${fmt(summary.netMargin)} ${currency}. Continuez à optimiser vos coûts pour améliorer la rentabilité.`
                              : `Your net margin is ${fmt(summary.netMargin)} ${currency}. Keep optimizing costs to improve profitability.`)
                          : (lang === 'fr'
                              ? 'Si la marge brute est négative, la perte est certaine. Révisez vos coûts variables ou augmentez vos prix.'
                              : 'If gross margin is negative, loss is guaranteed. Review your variable costs or increase your prices.')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SMALL HELPER COMPONENTS
═══════════════════════════════════════════════════════════════ */

const inputCls =
  'w-full border-0 bg-transparent text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-[#3AB6FF]/40 rounded px-1 py-0.5 placeholder-gray-300';

const UNIT_OPTIONS = [
  'kg', 'g', 't', 'l', 'ml', 'm³',
  'm', 'm²', 'km',
  'pcs', 'unit', 'box', 'bag', 'bundle', 'set',
  'hr', 'day', 'week', 'month', 'year',
  'JP', 'PD',
  '%', 'lot',
];

const UnitInput: React.FC<{ id: string; value: string; onChange: (v: string) => void }> = ({ id, value, onChange }) => (
  <>
    <datalist id={`units-${id}`}>
      {UNIT_OPTIONS.map((u) => <option key={u} value={u} />)}
    </datalist>
    <input
      list={`units-${id}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputCls} w-24`}
      placeholder="unit…"
    />
  </>
);

const Th: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <th className={`px-3 py-2.5 text-left text-xs font-semibold whitespace-nowrap ${className}`}>{children}</th>
);

const Td: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <td className={`px-3 py-2 ${className}`}>{children}</td>
);

const NumInput: React.FC<{ value: number; onChange: (v: number) => void; min?: number }> = ({ value, onChange, min = 0 }) => (
  <input
    type="number"
    min={min}
    step="any"
    value={value}
    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
    className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:border-[#3AB6FF]/50 focus:ring-1 focus:ring-[#3AB6FF]/20"
  />
);

const colorMap = {
  orange: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100',
  blue:   'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
  green:  'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100',
};

const addRowBtn = (color: keyof typeof colorMap) =>
  `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${colorMap[color]}`;

const TotalRow: React.FC<{ label: string; value: number; currency: string; color: keyof typeof colorMap }> = ({
  label, value, currency, color,
}) => {
  const cls = { orange: 'text-orange-800 bg-orange-100', yellow: 'text-yellow-800 bg-yellow-100', blue: 'text-blue-800 bg-blue-100', green: 'text-emerald-800 bg-emerald-100' }[color];
  return (
    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${cls}`}>
      {label}: {fmt(value)} {currency}
    </span>
  );
};

const SectionCard: React.FC<{
  number: string;
  title: string;
  color: 'orange' | 'yellow' | 'blue' | 'green';
  tooltip: string;
  children: React.ReactNode;
}> = ({ number, title, color, tooltip, children }) => {
  const [showTip, setShowTip] = useState(false);
  const headBg = { orange: 'bg-[#5a7a3a]', yellow: 'bg-[#5a7a3a]', blue: 'bg-[#5a7a3a]', green: 'bg-[#5a7a3a]' }[color];
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className={`${headBg} px-5 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 bg-white/20 text-white rounded-full flex items-center justify-center text-xs font-black">{number}</span>
          <h3 className="text-white font-bold text-sm">{title}</h3>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowTip(!showTip)}
            className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-white" />
          </button>
          {showTip && (
            <div className="absolute right-0 top-9 z-20 w-72 bg-[#3a5a1e] text-white text-xs rounded-xl p-3 shadow-xl leading-relaxed">
              {tooltip}
              <div className="absolute -top-1.5 right-3 w-3 h-3 bg-[#3a5a1e] rotate-45" />
            </div>
          )}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
};

const SummaryBanner: React.FC<{
  label: string; value: number; currency: string; exchangeRate: number;
  bg: string; border: string; text: string; bold?: boolean; isCount?: boolean;
}> = ({ label, value, currency, exchangeRate, bg, border, text, bold, isCount }) => (
  <div className={`${bg} border ${border} rounded-2xl p-4`}>
    <p className={`text-xs font-semibold ${text} opacity-70 mb-1`}>{label}</p>
    <p className={`${text} ${bold ? 'text-2xl font-black' : 'text-xl font-bold'}`}>
      {isCount ? value : fmt(value)}
      {!isCount && <span className="text-sm font-normal ml-1 opacity-70">{currency}</span>}
    </p>
    {!isCount && exchangeRate !== 1 && (
      <p className="text-xs opacity-50 mt-0.5">{fmt(value * exchangeRate)} USD</p>
    )}
  </div>
);

const MarginStep: React.FC<{
  label: string; value: number; currency: string; exchangeRate: number;
  bg: string; border: string; text: string;
  icon: React.ReactNode; detail: string; large?: boolean; badge?: string;
}> = ({ label, value, currency, exchangeRate, bg, border, text, icon, detail, large, badge }) => (
  <div className={`${bg} border-2 ${border} rounded-2xl p-4`}>
    <div className="flex items-center gap-2 mb-1">
      {icon}
      <span className={`font-bold text-sm ${text}`}>{label}</span>
      {badge && (
        <span className="ml-auto bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>
      )}
    </div>
    <p className={`${text} ${large ? 'text-3xl font-black' : 'text-2xl font-bold'} mt-1`}>
      {fmt(value)} <span className="text-sm font-normal opacity-60">{currency}</span>
    </p>
    {exchangeRate !== 1 && (
      <p className="text-xs opacity-50">{fmt(value * exchangeRate)} USD</p>
    )}
    <p className="text-xs opacity-50 mt-1">= {detail}</p>
  </div>
);

/* ── generic immutable update helper ── */
function update<T>(arr: T[], idx: number, patch: Partial<T>): T[] {
  return arr.map((item, i) => (i === idx ? { ...item, ...patch } : item));
}

export default FinancialsPage;
