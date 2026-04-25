import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/userSlice';
import { useTranslation } from '@/lib/TranslationContext';
import {
  useGetMyEntreprisesQuery,
  useUpdateVentureMutation,
  useDeleteVentureMutation,
  Venture,
} from '@/redux/services/ventureServices';
import {
  useGetUserCanvasesQuery,
  useDeleteCanvasMutation,
  useDuplicateCanvasMutation,
} from '@/redux/services/bmcServices';
import {
  useGetUserBusinessPlansQuery,
  useDeleteBusinessPlanMutation,
} from '@/redux/services/businessPlanServices';
import { setCanvas } from '@/redux/slices/bmcSlice';
import { useDispatch } from 'react-redux';
import {
  Building,
  LayoutGrid,
  FileText,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  ArrowUpRight,
  X,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  MapPin,
  Loader2,
  Save,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { BusinessModelCanvas } from '@/types/bmc';

/* ─── Types ─── */
type Tab = 'ventures' | 'bmc' | 'plans';

interface EditVentureForm {
  businessName: string;
  businessDescription: string;
  country: string;
  status: 'draft' | 'in-progress' | 'completed' | 'published';
}

/* ─── Status config ─── */
const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  completed:    { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'in-progress':{ bg: 'bg-blue-50',   text: 'text-blue-700',    dot: 'bg-blue-500'    },
  published:    { bg: 'bg-violet-50', text: 'text-violet-700',  dot: 'bg-violet-500'  },
  draft:        { bg: 'bg-amber-50',  text: 'text-amber-700',   dot: 'bg-amber-500'   },
};

const statusLabel = (s: string, lang: string) => {
  const map: Record<string, { en: string; fr: string }> = {
    completed:     { en: 'Completed',    fr: 'Terminé'      },
    'in-progress': { en: 'In Progress',  fr: 'En cours'     },
    published:     { en: 'Published',    fr: 'Publié'       },
    draft:         { en: 'Draft',        fr: 'Brouillon'    },
  };
  return (map[s] ?? map['draft'])[lang === 'fr' ? 'fr' : 'en'];
};

const fmtDate = (d: string) => {
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return ''; }
};

/* ═══════════════════════════════════════════════════════
   MANAGE PAGE
═══════════════════════════════════════════════════════ */
const ManagePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, language } = useTranslation() as any;
  const user = useAppSelector(selectUser) as any;

  const lang = (language as string) || 'en';

  const [activeTab, setActiveTab] = useState<Tab>('ventures');

  /* ─── State: modals ─── */
  const [editVenture, setEditVenture] = useState<Venture | null>(null);
  const [editForm, setEditForm] = useState<EditVentureForm>({ businessName: '', businessDescription: '', country: '', status: 'draft' });
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; type: Tab } | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* ─── Ventures ─── */
  const {
    data: venturesResp,
    isLoading: loadingVentures,
    refetch: refetchVentures,
  } = useGetMyEntreprisesQuery({ userId: user?._id || '' }, { skip: !user?._id });

  const ventures: Venture[] = Array.isArray(venturesResp)
    ? venturesResp
    : Array.isArray((venturesResp as any)?.ventures)
    ? (venturesResp as any).ventures
    : Array.isArray((venturesResp as any)?.data)
    ? (venturesResp as any).data
    : [];

  const [updateVenture] = useUpdateVentureMutation();
  const [deleteVentureMutation] = useDeleteVentureMutation();

  /* ─── BMC ─── */
  const { data: apiCanvases, isLoading: loadingBMC, refetch: refetchBMC } = useGetUserCanvasesQuery();
  const canvases: BusinessModelCanvas[] = apiCanvases || [];
  const [deleteCanvasMutation] = useDeleteCanvasMutation();
  const [duplicateCanvasMutation] = useDuplicateCanvasMutation();

  /* ─── Business Plans ─── */
  const {
    data: plansResp,
    isLoading: loadingPlans,
    refetch: refetchPlans,
  } = useGetUserBusinessPlansQuery({ userId: user?._id || '', page: 1, limit: 50 }, { skip: !user?._id });

  const plans: any[] = (() => {
    if (!plansResp) return [];
    if (Array.isArray(plansResp)) return plansResp;
    if (Array.isArray((plansResp as any)?.businessPlans)) return (plansResp as any).businessPlans;
    if (Array.isArray((plansResp as any)?.data)) return (plansResp as any).data;
    return [];
  })();

  const [deletePlanMutation] = useDeleteBusinessPlanMutation();

  /* ─── Open edit venture modal ─── */
  const openEditVenture = (v: Venture) => {
    setEditVenture(v);
    setEditForm({
      businessName: v.businessName,
      businessDescription: v.businessDescription,
      country: v.country,
      status: v.status as EditVentureForm['status'],
    });
  };

  /* ─── Save venture edit ─── */
  const handleSaveVenture = async () => {
    if (!editVenture) return;
    setSaving(true);
    try {
      await updateVenture({ id: editVenture._id, data: editForm }).unwrap();
      toast.success(lang === 'fr' ? 'Entreprise mise à jour' : 'Venture updated');
      setEditVenture(null);
      refetchVentures();
    } catch {
      toast.error(lang === 'fr' ? 'Erreur lors de la mise à jour' : 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  /* ─── Delete handler ─── */
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (deleteTarget.type === 'ventures') {
        await deleteVentureMutation(deleteTarget.id).unwrap();
        toast.success(lang === 'fr' ? 'Entreprise supprimée' : 'Venture deleted');
        refetchVentures();
      } else if (deleteTarget.type === 'bmc') {
        await deleteCanvasMutation(deleteTarget.id).unwrap();
        toast.success(lang === 'fr' ? 'BMC supprimé' : 'Canvas deleted');
        refetchBMC();
      } else {
        await deletePlanMutation(deleteTarget.id).unwrap();
        toast.success(lang === 'fr' ? "Plan supprimé" : 'Plan deleted');
        refetchPlans();
      }
      setDeleteTarget(null);
    } catch {
      toast.error(lang === 'fr' ? 'Erreur lors de la suppression' : 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  /* ─── Duplicate BMC ─── */
  const handleDuplicate = async (canvas: BusinessModelCanvas) => {
    try {
      const dup = await duplicateCanvasMutation(canvas._id).unwrap();
      dispatch(setCanvas(dup));
      toast.success(lang === 'fr' ? 'Canvas dupliqué' : 'Canvas duplicated');
      refetchBMC();
    } catch {
      toast.error(lang === 'fr' ? 'Erreur lors de la duplication' : 'Failed to duplicate');
    }
  };

  /* ─── Tabs config ─── */
  const tabs: { id: Tab; label: string; icon: React.ElementType; count: number; loading: boolean }[] = [
    {
      id: 'ventures',
      label: lang === 'fr' ? 'Entreprises' : 'Ventures',
      icon: Building,
      count: ventures.length,
      loading: loadingVentures,
    },
    {
      id: 'bmc',
      label: 'Business Model Canvas',
      icon: LayoutGrid,
      count: canvases.length,
      loading: loadingBMC,
    },
    {
      id: 'plans',
      label: lang === 'fr' ? "Plans d'affaires" : 'Business Plans',
      icon: FileText,
      count: plans.length,
      loading: loadingPlans,
    },
  ];

  /* ═══════════════════════════════ */
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #f8faff 100%)' }}>

      {/* ── Page Header ── */}
      <div
        className="relative overflow-hidden px-8 py-10"
        style={{ background: 'linear-gradient(135deg, #020A3C 0%, #0a1963 50%, #0d2080 100%)' }}
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#3AB6FF]/10 rounded-full pointer-events-none" />
        <div className="relative">
          <h1 className="text-3xl font-bold text-white">
            {lang === 'fr' ? 'Gestion' : 'Manage'}
          </h1>
          <p className="text-white/50 text-sm mt-1">
            {lang === 'fr'
              ? 'Gérez vos entreprises, vos BMC et vos plans d\'affaires'
              : 'Manage your ventures, BMCs and business plans'}
          </p>

          {/* Summary pills */}
          <div className="flex flex-wrap gap-3 mt-6">
            {tabs.map(({ id, label, icon: Icon, count, loading }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === id
                    ? 'bg-white text-[#020A3C] shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/15'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${activeTab === id ? 'bg-[#020A3C] text-white' : 'bg-white/20 text-white'}`}>
                  {loading ? '…' : count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-8">

        {/* ═══════════════════════════════════
            VENTURES TAB
        ═══════════════════════════════════ */}
        {activeTab === 'ventures' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {lang === 'fr' ? 'Mes entreprises' : 'My Ventures'}
                </h2>
                <p className="text-gray-400 text-sm mt-0.5">
                  {ventures.length} {lang === 'fr' ? 'entreprise(s)' : 'venture(s)'}
                </p>
              </div>
              <button
                onClick={() => navigate('/venture')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#020A3C] hover:bg-[#0a1963] text-white rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                {lang === 'fr' ? 'Nouvelle entreprise' : 'New Venture'}
              </button>
            </div>

            {loadingVentures ? (
              <GridLoadingState />
            ) : ventures.length === 0 ? (
              <EmptyTab
                icon={<Building className="w-8 h-8 text-gray-300" />}
                title={lang === 'fr' ? 'Aucune entreprise' : 'No ventures yet'}
                desc={lang === 'fr' ? 'Créez votre première entreprise' : 'Create your first venture to get started'}
                btnLabel={lang === 'fr' ? 'Créer une entreprise' : 'Create Venture'}
                onBtnClick={() => navigate('/venture')}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {ventures.map((v) => {
                  const sCfg = STATUS_CONFIG[v.status] || STATUS_CONFIG['draft'];
                  return (
                    <div key={v._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                      {/* Card header strip */}
                      <div className="h-1.5 w-full bg-gradient-to-r from-[#020A3C] to-[#3AB6FF]" />
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#020A3C] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                              {(v.businessName || 'V')[0].toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-gray-900 text-sm truncate max-w-[160px]">{v.businessName}</h3>
                              {v.country && (
                                <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3" />
                                  {v.country}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ${sCfg.bg} ${sCfg.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sCfg.dot}`} />
                            {statusLabel(v.status, lang)}
                          </span>
                        </div>

                        {v.businessDescription && (
                          <p className="text-gray-500 text-xs line-clamp-2 mb-3">{v.businessDescription}</p>
                        )}

                        {v.businessTypes?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {v.businessTypes.slice(0, 2).map((bt: string, i: number) => (
                              <span key={i} className="bg-[#3AB6FF]/10 text-[#3AB6FF] px-2 py-0.5 rounded-full text-[10px] font-medium">{bt}</span>
                            ))}
                            {v.businessTypes.length > 2 && (
                              <span className="text-[10px] text-gray-400">+{v.businessTypes.length - 2}</span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-4">
                          <Calendar className="w-3 h-3" />
                          {fmtDate(v.createdAt)}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditVenture(v)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-50 hover:bg-[#020A3C] hover:text-white text-gray-600 rounded-xl text-xs font-semibold transition-all"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            {t('Edit') || 'Edit'}
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: v._id, name: v.businessName, type: 'ventures' })}
                            className="w-9 h-9 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 rounded-xl transition-all"
                            title={t('Delete') || 'Delete'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════
            BMC TAB
        ═══════════════════════════════════ */}
        {activeTab === 'bmc' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Business Model Canvas</h2>
                <p className="text-gray-400 text-sm mt-0.5">
                  {canvases.length} canvas{canvases.length !== 1 ? (lang === 'fr' ? '' : 'es') : ''}
                </p>
              </div>
              <button
                onClick={() => navigate('/bmc/new')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-emerald-100 hover:shadow-lg hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                {lang === 'fr' ? 'Nouveau BMC' : 'New BMC'}
              </button>
            </div>

            {loadingBMC ? (
              <GridLoadingState />
            ) : canvases.length === 0 ? (
              <EmptyTab
                icon={<LayoutGrid className="w-8 h-8 text-gray-300" />}
                title={lang === 'fr' ? 'Aucun BMC' : 'No canvases yet'}
                desc={lang === 'fr' ? 'Créez votre premier Business Model Canvas' : 'Create your first Business Model Canvas'}
                btnLabel={lang === 'fr' ? 'Créer un BMC' : 'Create BMC'}
                onBtnClick={() => navigate('/bmc/new')}
                accent="emerald"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {canvases.map((canvas) => {
                  const filled = canvas.blocks.filter((b) => b.content?.trim()).length;
                  const total = canvas.blocks.length;
                  const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
                  return (
                    <div key={canvas._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-teal-500" />
                      <div className="p-5">
                        {/* Mini 9-cell grid preview */}
                        <div
                          className="grid grid-cols-3 gap-0.5 h-14 rounded-xl overflow-hidden border border-gray-100 mb-4 cursor-pointer"
                          onClick={() => { dispatch(setCanvas(canvas)); navigate(`/bmc/${canvas._id}`); }}
                        >
                          {Array.from({ length: 9 }).map((_, i) => {
                            const block = canvas.blocks[i];
                            return (
                              <div
                                key={i}
                                className={`flex items-center justify-center ${block?.content?.trim() ? 'bg-emerald-100' : 'bg-gray-50'} transition-colors`}
                                title={block?.title}
                              >
                                {block?.content?.trim() && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />}
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex items-start justify-between mb-2">
                          <h3
                            className="font-bold text-gray-900 text-sm truncate max-w-[160px] cursor-pointer hover:text-emerald-600"
                            onClick={() => { dispatch(setCanvas(canvas)); navigate(`/bmc/${canvas._id}`); }}
                          >
                            {canvas.title}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ${canvas.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${canvas.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            {canvas.status === 'completed' ? (lang === 'fr' ? 'Complété' : 'Completed') : (lang === 'fr' ? 'Brouillon' : 'Draft')}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                          <span>{filled}/{total} {lang === 'fr' ? 'blocs remplis' : 'blocks filled'}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                          <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>

                        {canvas.createdAt && (
                          <p className="text-[10px] text-gray-400 flex items-center gap-1 mb-4">
                            <Calendar className="w-3 h-3" />
                            {fmtDate(canvas.createdAt)}
                          </p>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => { dispatch(setCanvas(canvas)); navigate(`/bmc/${canvas._id}`); }}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 rounded-xl text-xs font-semibold transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            {t('Edit') || 'Edit'}
                          </button>
                          <button
                            onClick={() => handleDuplicate(canvas)}
                            className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl transition-all"
                            title={lang === 'fr' ? 'Dupliquer' : 'Duplicate'}
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: canvas._id, name: canvas.title, type: 'bmc' })}
                            className="w-9 h-9 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 rounded-xl transition-all"
                            title={t('Delete') || 'Delete'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════
            PLANS TAB
        ═══════════════════════════════════ */}
        {activeTab === 'plans' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {lang === 'fr' ? "Plans d'affaires" : 'Business Plans'}
                </h2>
                <p className="text-gray-400 text-sm mt-0.5">
                  {plans.length} {lang === 'fr' ? 'plan(s)' : 'plan(s)'}
                </p>
              </div>
              <button
                onClick={() => navigate('/business-plan/wizard')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-violet-100 hover:shadow-lg hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                {lang === 'fr' ? 'Nouveau plan' : 'New Plan'}
              </button>
            </div>

            {loadingPlans ? (
              <GridLoadingState />
            ) : plans.length === 0 ? (
              <EmptyTab
                icon={<FileText className="w-8 h-8 text-gray-300" />}
                title={lang === 'fr' ? 'Aucun plan' : 'No plans yet'}
                desc={lang === 'fr' ? "Créez votre premier plan d'affaires" : 'Create your first business plan'}
                btnLabel={lang === 'fr' ? "Créer un plan" : 'Create Plan'}
                onBtnClick={() => navigate('/business-plan/wizard')}
                accent="violet"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {plans.map((plan: any) => {
                  const s = plan.metadata?.status || 'draft';
                  const sCfg = STATUS_CONFIG[s] || STATUS_CONFIG['draft'];
                  const pct = plan.progress?.completionPercentage ?? 0;
                  const title = plan.metadata?.title || (lang === 'fr' ? "Plan d'affaires" : 'Business Plan');
                  const lang_ = plan.metadata?.language;
                  const tone = plan.metadata?.tone;
                  return (
                    <div key={plan._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                      <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 to-purple-600" />
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-violet-600" />
                          </div>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${sCfg.bg} ${sCfg.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sCfg.dot}`} />
                            {statusLabel(s, lang)}
                          </span>
                        </div>

                        <h3 className="font-bold text-gray-900 text-sm mb-1 truncate">{title}</h3>

                        <div className="flex items-center gap-2 flex-wrap text-[10px] text-gray-400 mb-3">
                          {lang_ && <span className="bg-gray-100 px-2 py-0.5 rounded-full">{lang_}</span>}
                          {tone && <span className="bg-gray-100 px-2 py-0.5 rounded-full">{tone}</span>}
                          {plan.metadata?.createdAt && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {fmtDate(plan.metadata.createdAt)}
                            </span>
                          )}
                        </div>

                        {/* Progress */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-500">{lang === 'fr' ? 'Avancement' : 'Progress'}</span>
                            <span className="font-semibold text-gray-700">{pct}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${pct >= 100 ? 'bg-emerald-400' : 'bg-violet-400'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate('/business-plan-editor')}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-violet-50 hover:bg-violet-600 hover:text-white text-violet-700 rounded-xl text-xs font-semibold transition-all"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            {t('Edit') || 'Edit'}
                          </button>
                          <button
                            onClick={() => navigate('/business-plan')}
                            className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl transition-all"
                            title={t('viewPlan') || 'View'}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: plan._id, name: title, type: 'plans' })}
                            className="w-9 h-9 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 rounded-xl transition-all"
                            title={t('Delete') || 'Delete'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════
          EDIT VENTURE MODAL
      ═══════════════════════════════════ */}
      {editVenture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setEditVenture(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div
              className="px-7 py-5 flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, #020A3C 0%, #0a1963 100%)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                  <Building className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">
                    {lang === 'fr' ? 'Modifier l\'entreprise' : 'Edit Venture'}
                  </h3>
                  <p className="text-white/50 text-xs">{editVenture.businessName}</p>
                </div>
              </div>
              <button
                onClick={() => setEditVenture(null)}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-7 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  {lang === 'fr' ? 'Nom de l\'entreprise' : 'Business Name'} *
                </label>
                <input
                  value={editForm.businessName}
                  onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#3AB6FF] focus:ring-2 focus:ring-[#3AB6FF]/20 transition-all"
                  placeholder={lang === 'fr' ? 'Nom de votre entreprise' : 'Your business name'}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  {lang === 'fr' ? 'Description' : 'Description'}
                </label>
                <textarea
                  value={editForm.businessDescription}
                  onChange={(e) => setEditForm({ ...editForm, businessDescription: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#3AB6FF] focus:ring-2 focus:ring-[#3AB6FF]/20 transition-all resize-none"
                  placeholder={lang === 'fr' ? 'Décrivez votre entreprise…' : 'Describe your business…'}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    {lang === 'fr' ? 'Pays' : 'Country'}
                  </label>
                  <input
                    value={editForm.country}
                    onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#3AB6FF] focus:ring-2 focus:ring-[#3AB6FF]/20 transition-all"
                    placeholder={lang === 'fr' ? 'Pays' : 'Country'}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    {lang === 'fr' ? 'Statut' : 'Status'}
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as EditVentureForm['status'] })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#3AB6FF] focus:ring-2 focus:ring-[#3AB6FF]/20 transition-all bg-white"
                  >
                    <option value="draft">{lang === 'fr' ? 'Brouillon' : 'Draft'}</option>
                    <option value="in-progress">{lang === 'fr' ? 'En cours' : 'In Progress'}</option>
                    <option value="completed">{lang === 'fr' ? 'Terminé' : 'Completed'}</option>
                    <option value="published">{lang === 'fr' ? 'Publié' : 'Published'}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-7 pb-6 flex gap-3">
              <button
                onClick={() => setEditVenture(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                {t('Cancel') || 'Cancel'}
              </button>
              <button
                onClick={handleSaveVenture}
                disabled={saving || !editForm.businessName.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#020A3C] hover:bg-[#0a1963] text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {t('Save') || 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════
          DELETE CONFIRMATION MODAL
      ═══════════════════════════════════ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-7 text-center">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {lang === 'fr' ? 'Confirmer la suppression' : 'Confirm Delete'}
              </h3>
              <p className="text-gray-500 text-sm mb-1">
                {lang === 'fr' ? 'Voulez-vous supprimer' : 'Are you sure you want to delete'}
              </p>
              <p className="font-semibold text-gray-800 text-sm mb-4 truncate px-4">"{deleteTarget.name}"</p>
              <p className="text-xs text-red-400 mb-6">
                {lang === 'fr' ? 'Cette action est irréversible.' : 'This action cannot be undone.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  {t('Cancel') || 'Cancel'}
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  {t('Delete') || 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Helper sub-components ─── */

const GridLoadingState = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
        <div className="h-1.5 w-full bg-gray-100 rounded mb-4" />
        <div className="flex gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-100 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-100 rounded w-3/4" />
            <div className="h-2 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-2 bg-gray-100 rounded" />
          <div className="h-2 bg-gray-100 rounded w-5/6" />
        </div>
        <div className="flex gap-2">
          <div className="flex-1 h-8 bg-gray-100 rounded-xl" />
          <div className="w-9 h-8 bg-gray-100 rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);

const EmptyTab = ({
  icon, title, desc, btnLabel, onBtnClick, accent,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  btnLabel: string;
  onBtnClick: () => void;
  accent?: 'emerald' | 'violet';
}) => {
  const bg = accent === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'
           : accent === 'violet'  ? 'bg-violet-600 hover:bg-violet-700 shadow-violet-100'
           : 'bg-[#020A3C] hover:bg-[#0a1963]';
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 shadow-inner">{icon}</div>
      <p className="font-bold text-gray-700 text-base">{title}</p>
      <p className="text-gray-400 text-sm mt-1 mb-6 max-w-xs">{desc}</p>
      <button
        onClick={onBtnClick}
        className={`inline-flex items-center gap-2 px-5 py-2.5 ${bg} text-white rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5`}
      >
        <Plus className="w-4 h-4" />
        {btnLabel}
      </button>
    </div>
  );
};

export default ManagePage;
