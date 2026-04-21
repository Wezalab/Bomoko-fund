import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectUser, setUser, setToken, initialState } from '@/redux/slices/userSlice';
import { ProjectInitialState, setProject } from '@/redux/slices/projectSlice';
import { useTranslation } from '@/lib/TranslationContext';
import { useGetUserVenturesQuery } from '@/redux/services/ventureServices';
import { useGetVentureBusinessPlansQuery } from '@/redux/services/businessPlanServices';
import { useGetUserCanvasesQuery } from '@/redux/services/bmcServices';
import { useGetFinanceSheetQuery } from '@/redux/services/financeServices';
import { useUsersProjectsQuery } from '@/redux/services/projectServices';
import { computeSummary } from '@/types/finance';
import { setCanvas } from '@/redux/slices/bmcSlice';
import {
  Home,
  Edit,
  Eye,
  DollarSign,
  Users,
  Settings,
  User,
  ArrowUpRight,
  Plus,
  Building,
  FileText,
  Youtube,
  Facebook,
  Linkedin,
  Instagram,
  Lock,
  ChevronDown,
  LogOut,
  LayoutGrid,
  Sparkles,
  TrendingUp,
  Bell,
  Search,
  Calendar,
  MapPin,
  CheckCircle2,
  Zap,
  Shield,
  HelpCircle,
  HeartHandshake,
  FolderOpen,
  ChevronRight,
  Loader2,
  BarChart3,
  Megaphone,
  ExternalLink,
  Activity,
  Coins,
} from 'lucide-react';
import profileImage from '../assets/profileImage.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { BusinessModelCanvas } from '@/types/bmc';

interface ExtendedUser {
  _id: string;
  name?: string;
  gender?: 'M' | 'F' | 'OTHER';
  avatar?: string;
  bio?: string;
  location?: string;
  email: string;
  phone_number?: string;
  phone?: string;
  type?: 'INDIVIDUAL' | 'ENTREPRISE' | 'DONATOR' | 'ENTREPRENEUR';
  isGoogleUser?: boolean;
  isStillRegistering?: boolean;
  isDeactivated?: boolean;
  deactivateReason?: string;
  googleId?: string | null;
  updatedAt?: string;
  profile?: string;
  projects?: any[];
  cryptoWallet?: any[];
}

const NAV_ITEMS = [
  { path: '/dashboard', icon: Home, labelKey: 'home' },
  { path: '/business-plan/wizard', icon: FileText, labelKey: 'addPlan' },
  { path: '/business-plan-editor', icon: Edit, labelKey: 'editPlan' },
  { path: '/business-plan', icon: Eye, labelKey: 'viewPlan' },
  { path: '/bmc', icon: LayoutGrid, labelKey: 'bmc' },
  { path: '/manage', icon: FolderOpen, labelKey: 'manage' },
  { path: '/financials', icon: DollarSign, labelKey: 'financials' },
  { path: '/users', icon: Users, labelKey: 'users' },
  { path: '/settings', icon: Settings, labelKey: 'settings' },
];

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Completed' },
  'in-progress': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', label: 'In Progress' },
  published: { bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-500', label: 'Published' },
  draft: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Draft' },
};

const getTimeGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser) as unknown as ExtendedUser;
  const { t } = useTranslation();

  const isActiveRoute = (path: string) => {
    if (location.pathname === path) return true;
    if (path === '/bmc' && location.pathname.startsWith('/bmc')) return true;
    return false;
  };

  /* ─── Ventures ─── */
  const { data: venturesResponse, isLoading: isLoadingVentures, error: venturesError } =
    useGetUserVenturesQuery({ userId: user?._id || '', page: 1, limit: 50 }, { skip: !user?._id });

  const ventures = Array.isArray(venturesResponse)
    ? venturesResponse
    : venturesResponse && typeof venturesResponse === 'object' && 'data' in venturesResponse && Array.isArray((venturesResponse as any).data)
    ? (venturesResponse as any).data
    : [];

  const [selectedVentureId, setSelectedVentureId] = useState<string>('');

  useEffect(() => {
    if (Array.isArray(ventures) && ventures.length > 0 && !selectedVentureId) {
      setSelectedVentureId(ventures[0]._id);
    }
  }, [ventures, selectedVentureId]);

  const selectedVenture = Array.isArray(ventures)
    ? ventures.find((v) => v._id === selectedVentureId) || null
    : null;

  /* ─── Business Plans for selected venture ─── */
  const {
    data: ventureBusinessPlansResponse,
    isLoading: isLoadingPlans,
  } = useGetVentureBusinessPlansQuery(selectedVentureId, {
    skip: !selectedVentureId,
  });

  const ventureBusinessPlans: any[] = (() => {
    if (!ventureBusinessPlansResponse) return [];
    if (Array.isArray(ventureBusinessPlansResponse)) return ventureBusinessPlansResponse;
    if (Array.isArray((ventureBusinessPlansResponse as any)?.businessPlans))
      return (ventureBusinessPlansResponse as any).businessPlans;
    if (Array.isArray((ventureBusinessPlansResponse as any)?.data))
      return (ventureBusinessPlansResponse as any).data;
    return [];
  })();

  /* ─── BMC canvases ─── */
  const { data: apiCanvases, isLoading: isLoadingCanvases } = useGetUserCanvasesQuery();
  const allCanvases: BusinessModelCanvas[] = apiCanvases || [];
  const ventureCanvases = selectedVentureId
    ? allCanvases.filter((c) => !c.ventureId || c.ventureId === selectedVentureId)
    : allCanvases;

  /* ─── Finance sheet for selected venture ─── */
  const { data: financeSheet, isLoading: isLoadingFinance } = useGetFinanceSheetQuery(
    selectedVentureId,
    { skip: !selectedVentureId },
  );
  const financeSummary = financeSheet ? computeSummary(financeSheet) : null;

  /* ─── User projects (crowdfunding) ─── */
  const { data: userProjectsRaw, isLoading: isLoadingProjects } = useUsersProjectsQuery(
    user?._id || '',
    { skip: !user?._id },
  );
  const userProjects: any[] = (() => {
    if (!userProjectsRaw) return [];
    if (Array.isArray(userProjectsRaw)) return userProjectsRaw;
    if (Array.isArray((userProjectsRaw as any)?.data)) return (userProjectsRaw as any).data;
    return [];
  })();

  /* ─── Helpers ─── */
  const getOptimizedImageUrl = (url: string) => {
    if (!url) return profileImage;
    if (url.includes('googleusercontent.com'))
      return url.replace(/=s\d+-c/, '=s200-c').replace(/\/photo\.jpg$/, '');
    return url;
  };

  let userAvatar = profileImage;
  if (user?.profile) userAvatar = getOptimizedImageUrl(user.profile);
  else if (user?.avatar) userAvatar = getOptimizedImageUrl(user.avatar);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = profileImage;
  };

  const handleLogout = () => {
    navigate('/');
    dispatch(setUser(initialState.user));
    dispatch(setToken(initialState.token));
    dispatch(setProject(ProjectInitialState.project));
  };

  const handleNavigation = (path: string) => navigate(path);

  const handleOpenBMC = (canvas: BusinessModelCanvas) => {
    dispatch(setCanvas(canvas));
    navigate(`/bmc/${canvas._id}`);
  };

  const handleNewBMC = () => {
    /* Pass ventureId as query param so the wizard can pre-link the canvas */
    const params = selectedVentureId ? `?ventureId=${selectedVentureId}` : '';
    navigate(`/bmc/new${params}`);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const formatDateShort = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
    } catch { return ''; }
  };

  const userName = user?.name || user?.email?.split('@')[0] || 'User';

  /* ─── Quick Action Cards ─── */
  const quickActions = [
    { label: t('planEditor') || 'Plan Editor', desc: t('continueWorkingOnPlan') || 'Continue working on your plan', icon: Edit, gradient: 'from-[#020A3C] to-[#0d1f8c]', path: '/business-plan-editor', disabled: false },
    { label: t('planViewer') || 'Plan Viewer', desc: t('viewOrDownloadPlan') || 'View or download your plan', icon: Eye, gradient: 'from-[#3AB6FF] to-[#0e8fdb]', path: '/business-plan', disabled: false },
    { label: t('businessSettings') || 'Business Settings', desc: t('modifyBusinessDetails') || 'Modify business details', icon: Building, gradient: 'from-violet-600 to-purple-700', path: '/business-settings', disabled: false },
    { label: t('userAccess') || 'User Access', desc: t('manageUserAccess') || 'Manage collaborators', icon: Users, gradient: 'from-emerald-500 to-teal-600', path: '/user-access', disabled: false },
    { label: t('accountSettings') || 'Account Settings', desc: t('manageUserProfileAccountBilling') || 'Profile, account & billing', icon: Shield, gradient: 'from-orange-500 to-red-500', path: '/account-settings', disabled: false },
    { label: t('frequentQuestions') || 'FAQ', desc: t('findAnswersTutorialVideos') || 'Find answers & tutorials', icon: HelpCircle, gradient: 'from-pink-500 to-rose-600', path: '/faq', disabled: false },
    { label: t('manage') || 'Manage', desc: 'Ventures, BMC & plans CRUD', icon: FolderOpen, gradient: 'from-indigo-500 to-violet-600', path: '/manage', disabled: false },
    { label: t('financials') || 'Financials', desc: t('costsRevenueMargins') || 'Costs, revenue & margins', icon: TrendingUp, gradient: 'from-emerald-500 to-green-600', path: '/financials', disabled: false },
    { label: t('requestSupport') || 'Request Support', desc: t('getInTouchSupportTeam') || 'Get in touch with support', icon: HeartHandshake, gradient: 'from-sky-500 to-blue-600', path: '/support', disabled: false },
    { label: t('partnerProgram') || 'Partner Program', desc: t('earnRewardsReferNewCustomers') || 'Earn rewards by referring', icon: Sparkles, gradient: 'from-amber-500 to-yellow-500', path: '', disabled: true },
  ];

  /* ─────────────── JSX ─────────────── */
  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #f8faff 100%)' }}>

      {/* ═══ SIDEBAR ═══ */}
      <aside
        className="w-[72px] flex flex-col items-center py-5 fixed left-0 top-0 bottom-0 z-30 shadow-xl"
        style={{ background: 'linear-gradient(180deg, #020A3C 0%, #030e5a 60%, #020A3C 100%)' }}
      >
        <div
          className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center cursor-pointer mb-8 shadow-lg hover:scale-105 transition-transform"
          onClick={() => handleNavigation('/dashboard')}
        >
          <span className="text-[#020A3C] font-black text-lg">B</span>
        </div>

        <nav className="flex flex-col gap-2 flex-1 w-full px-3">
          {NAV_ITEMS.map(({ path, icon: Icon, labelKey }) => {
            const active = isActiveRoute(path);
            return (
              <button
                key={path}
                onClick={() => handleNavigation(path)}
                title={t(labelKey) || labelKey}
                className={`relative w-full h-11 flex items-center justify-center rounded-xl transition-all duration-200 group ${active ? 'bg-white/15 shadow-inner' : 'hover:bg-white/10'}`}
              >
                {active && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#3AB6FF]" />}
                <Icon className={`w-[18px] h-[18px] transition-colors ${active ? 'text-white' : 'text-white/60 group-hover:text-white/90'}`} />
                <span className="absolute left-[calc(100%+12px)] px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl">
                  {t(labelKey) || labelKey}
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                </span>
              </button>
            );
          })}
        </nav>

        <div className="px-3 w-full mt-2">
          <button
            onClick={() => handleNavigation('/upgrade')}
            title={t('upgrade') || 'Upgrade'}
            className="w-full h-11 flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400 transition-all group shadow-lg hover:shadow-amber-400/30 hover:scale-105"
          >
            <Lock className="w-[18px] h-[18px] text-amber-900" />
          </button>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-1 ml-[72px] flex flex-col min-h-screen overflow-hidden">

        {/* ── Hero Header ── */}
        <header
          className="relative overflow-hidden px-8 pt-8 pb-10"
          style={{ background: 'linear-gradient(135deg, #020A3C 0%, #0a1963 50%, #0d2080 100%)' }}
        >
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute -bottom-16 -left-10 w-60 h-60 bg-[#3AB6FF]/10 rounded-full pointer-events-none" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-[#3AB6FF] text-sm font-medium mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {getTimeGreeting()}
              </p>
              <h1 className="text-3xl font-bold text-white mb-1">
                {t('Welcome') || 'Welcome back,'}{' '}
                <span className="text-[#3AB6FF]">{userName}</span> 👋
              </h1>
              <p className="text-white/50 text-sm mt-0.5">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden lg:flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-white/40" />
                <input
                  className="bg-white/10 text-white text-sm placeholder-white/40 border border-white/15 rounded-xl pl-9 pr-4 py-2.5 w-52 focus:outline-none focus:border-[#3AB6FF]/50 focus:bg-white/15 transition-all"
                  placeholder="Search..."
                />
              </div>
              <button className="relative w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center border border-white/15 transition-colors">
                <Bell className="w-[18px] h-[18px] text-white/80" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#3AB6FF] rounded-full" />
              </button>
              {user?.email && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl h-11 px-3 transition-all">
                      <img src={userAvatar} className="w-8 h-8 rounded-xl object-cover ring-2 ring-[#3AB6FF]/40" alt="profile" onError={handleImageError} crossOrigin="anonymous" referrerPolicy="no-referrer" />
                      <span className="text-sm font-medium text-white hidden sm:block max-w-[120px] truncate">{userName}</span>
                      <ChevronDown className="w-4 h-4 text-white/60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="p-2 w-64 shadow-2xl border-gray-100 rounded-2xl">
                    <div className="flex items-center gap-3 p-3 mb-1 bg-gray-50 rounded-xl">
                      <img src={userAvatar} className="w-10 h-10 rounded-xl object-cover" alt="profile" onError={handleImageError} crossOrigin="anonymous" referrerPolicy="no-referrer" />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{userName}</p>
                        <p className="text-gray-500 text-xs truncate">{user?.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup className="space-y-0.5">
                      <DropdownMenuItem className="p-2.5 rounded-xl cursor-pointer" onClick={() => handleNavigation('/profile')}>
                        <User className="w-4 h-4 mr-2.5 text-gray-500" /><span className="text-sm">{t('profile') || 'Profile'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="p-2.5 rounded-xl cursor-pointer" onClick={() => handleNavigation('/projects')}>
                        <Building className="w-4 h-4 mr-2.5 text-gray-500" /><span className="text-sm">{t('projects') || 'Projects'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="p-2.5 rounded-xl cursor-pointer" onClick={() => handleNavigation('/settings')}>
                        <Settings className="w-4 h-4 mr-2.5 text-gray-500" /><span className="text-sm">{t('settings') || 'Settings'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="p-2.5 rounded-xl cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-50" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2.5" /><span className="text-sm">{t('logout') || 'Logout'}</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="relative mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Ventures', value: isLoadingVentures ? '…' : (Array.isArray(ventures) ? ventures.length : 0), icon: Building, color: 'from-[#3AB6FF]/20 to-[#3AB6FF]/5', iconColor: 'text-[#3AB6FF]', trend: '+2 this month' },
              { label: 'Business Plans', value: ventureBusinessPlans.length, icon: FileText, color: 'from-violet-400/20 to-violet-400/5', iconColor: 'text-violet-300', trend: selectedVenture ? `For ${selectedVenture.businessName?.slice(0,12)}…` : 'Select a venture' },
              { label: 'BMC Canvases', value: isLoadingCanvases ? '…' : allCanvases.length, icon: LayoutGrid, color: 'from-emerald-400/20 to-emerald-400/5', iconColor: 'text-emerald-300', trend: 'Business models' },
              { label: 'Completed', value: Array.isArray(ventures) ? ventures.filter((v) => v.status === 'completed').length : 0, icon: CheckCircle2, color: 'from-amber-400/20 to-amber-400/5', iconColor: 'text-amber-300', trend: 'Well done!' },
            ].map(({ label, value, icon: Icon, color, iconColor, trend }) => (
              <div key={label} className={`bg-gradient-to-br ${color} border border-white/10 rounded-2xl p-4 backdrop-blur-sm`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/60 text-xs font-medium">{label}</span>
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                  </div>
                </div>
                <p className="text-white text-2xl font-bold">{value}</p>
                <p className="text-white/40 text-xs mt-1 truncate">{trend}</p>
              </div>
            ))}
          </div>
        </header>

        {/* ── Page Body ── */}
        <div className="flex-1 p-8 space-y-8">

          {/* ═══════════════════════════════════════════
              MAIN GRID: Ventures (left) + Detail (right)
          ═══════════════════════════════════════════ */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

            {/* ── Ventures List (left, 2 cols) ── */}
            <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="px-6 py-5 flex items-center justify-between border-b border-gray-50">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{t('myVentures') || 'My Ventures'}</h2>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {Array.isArray(ventures) ? ventures.length : 0} entreprise{Array.isArray(ventures) && ventures.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => handleNavigation('/venture-wizard')}
                  className="w-9 h-9 bg-[#020A3C] hover:bg-[#0a1963] text-white rounded-xl flex items-center justify-center transition-colors shadow-md"
                  title={t('createNewBusiness') || 'New Venture'}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 flex-1 overflow-hidden">
                {!user?._id ? (
                  <EmptyState icon={<Building className="w-8 h-8 text-gray-300" />} title="Sign in required" desc="Please sign in to view your ventures" />
                ) : isLoadingVentures ? (
                  <LoadingState />
                ) : venturesError ? (
                  <EmptyState icon={<Building className="w-8 h-8 text-red-300" />} title="Couldn't load ventures" desc="Please try again later" error />
                ) : Array.isArray(ventures) && ventures.length > 0 ? (
                  <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
                    {ventures.map((venture) => {
                      const isSelected = selectedVentureId === venture._id;
                      const statusCfg = STATUS_CONFIG[venture.status] || STATUS_CONFIG['draft'];
                      return (
                        <div
                          key={venture._id}
                          className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border-2 group ${
                            isSelected
                              ? 'border-[#020A3C] bg-gradient-to-r from-[#020A3C]/5 to-transparent shadow-sm'
                              : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/60'
                          }`}
                          onClick={() => setSelectedVentureId(venture._id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm transition-colors ${isSelected ? 'bg-[#020A3C] text-white' : 'bg-gray-100 text-gray-500'}`}>
                              {(venture.businessName || 'V')[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 text-sm truncate">{venture.businessName}</h3>
                                {isSelected && <ChevronRight className="w-4 h-4 text-[#020A3C] flex-shrink-0" />}
                              </div>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusCfg.bg} ${statusCfg.text}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                                  {statusCfg.label}
                                </span>
                                {venture.country && (
                                  <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                                    <MapPin className="w-3 h-3" />
                                    {venture.country}
                                  </span>
                                )}
                              </div>
                              {venture.businessTypes?.length > 0 && (
                                <div className="flex gap-1 mt-1.5 flex-wrap">
                                  {venture.businessTypes.slice(0, 2).map((type: string, i: number) => (
                                    <span key={i} className="bg-[#3AB6FF]/10 text-[#3AB6FF] px-2 py-0.5 rounded-full text-[10px] font-medium">{type}</span>
                                  ))}
                                  {venture.businessTypes.length > 2 && (
                                    <span className="text-[10px] text-gray-400 self-center">+{venture.businessTypes.length - 2}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyActionState
                    icon={<Building className="w-8 h-8 text-gray-300" />}
                    title={t('noBusinessCreated') || 'No ventures yet'}
                    desc={t('createBusinessMessage') || 'Create your first venture'}
                    btnLabel={t('createNewBusiness') || 'Create Venture'}
                    onBtnClick={() => handleNavigation('/venture-wizard')}
                  />
                )}
              </div>
            </div>

            {/* ── Right Panel: 4 Venture Sections (3 cols) ── */}
            <div className="xl:col-span-3">
              {!selectedVenture ? (
                /* ── No venture selected placeholder ── */
                <div className="h-full min-h-[400px] bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center p-10">
                  <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-5 border-2 border-dashed border-gray-200">
                    <Building className="w-9 h-9 text-gray-300" />
                  </div>
                  <h3 className="font-bold text-gray-700 text-lg mb-2">Select a Venture</h3>
                  <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                    Pick an entreprise from the left panel to explore its Business Plan, BMC, Financials, and Crowdfunding.
                  </p>
                </div>
              ) : (
                /* ── 4-Section Grid ── */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 h-full">

                  {/* ══════════════════════════════
                      1. BUSINESS PLAN  (violet)
                  ══════════════════════════════ */}
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                    {/* Card Header */}
                    <div className="px-5 pt-5 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-200">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm">Business Plan</h3>
                            <p className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[130px]">
                              {selectedVenture.businessName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="bg-violet-50 text-violet-700 text-xs font-bold px-2.5 py-1 rounded-full">
                            {isLoadingPlans ? '…' : ventureBusinessPlans.length}
                          </span>
                        </div>
                      </div>

                      {/* Stat pill row */}
                      <div className="flex gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 bg-violet-50 rounded-xl px-3 py-1.5">
                          <Activity className="w-3 h-3 text-violet-500" />
                          <span className="text-[11px] font-semibold text-violet-700">
                            {ventureBusinessPlans.filter((p: any) => p.metadata?.status === 'completed').length} Completed
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-amber-50 rounded-xl px-3 py-1.5">
                          <Edit className="w-3 h-3 text-amber-500" />
                          <span className="text-[11px] font-semibold text-amber-700">
                            {ventureBusinessPlans.filter((p: any) => p.metadata?.status !== 'completed').length} In Draft
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Plan List */}
                    <div className="px-5 flex-1 overflow-hidden">
                      {isLoadingPlans ? (
                        <div className="py-4 flex justify-center"><Loader2 className="w-5 h-5 text-violet-300 animate-spin" /></div>
                      ) : ventureBusinessPlans.length > 0 ? (
                        <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar">
                          {ventureBusinessPlans.slice(0, 4).map((plan: any) => {
                            const statusCfg = STATUS_CONFIG[plan.metadata?.status] || STATUS_CONFIG['draft'];
                            const pct = plan.progress?.completionPercentage ?? 0;
                            return (
                              <div
                                key={plan._id}
                                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/40 cursor-pointer transition-all group/item"
                                onClick={() => handleNavigation('/business-plan-editor')}
                              >
                                <div className="w-7 h-7 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <FileText className="w-3.5 h-3.5 text-violet-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-gray-800 truncate">{plan.metadata?.title || 'Business Plan'}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${statusCfg.bg} ${statusCfg.text}`}>
                                      {statusCfg.label}
                                    </span>
                                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-violet-400 rounded-full" style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="text-[9px] text-gray-400 flex-shrink-0">{pct}%</span>
                                  </div>
                                </div>
                                <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover/item:text-violet-500 flex-shrink-0 transition-colors" />
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="py-4 text-center">
                          <p className="text-xs text-gray-400">No plans yet. Create your first!</p>
                        </div>
                      )}
                    </div>

                    {/* CTA Footer */}
                    <div className="px-5 py-4 mt-2 border-t border-gray-50 flex gap-2">
                      <button
                        onClick={() => handleNavigation('/business-plan/wizard')}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm shadow-violet-200"
                      >
                        <Plus className="w-3.5 h-3.5" /> New Plan
                      </button>
                      <button
                        onClick={() => handleNavigation('/business-plan')}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-semibold rounded-xl transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> View All
                      </button>
                    </div>
                  </div>

                  {/* ══════════════════════════════
                      2. BMC  (emerald)
                  ══════════════════════════════ */}
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                    <div className="px-5 pt-5 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                            <LayoutGrid className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm">BMC</h3>
                            <p className="text-[10px] text-gray-400 mt-0.5">Business Model Canvas</p>
                          </div>
                        </div>
                        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                          {isLoadingCanvases ? '…' : ventureCanvases.length}
                        </span>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 bg-emerald-50 rounded-xl px-3 py-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span className="text-[11px] font-semibold text-emerald-700">
                            {ventureCanvases.filter((c) => c.status === 'completed').length} Completed
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-sky-50 rounded-xl px-3 py-1.5">
                          <LayoutGrid className="w-3 h-3 text-sky-500" />
                          <span className="text-[11px] font-semibold text-sky-700">
                            {allCanvases.length} Total
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 flex-1 overflow-hidden">
                      {isLoadingCanvases ? (
                        <div className="py-4 flex justify-center"><Loader2 className="w-5 h-5 text-emerald-300 animate-spin" /></div>
                      ) : ventureCanvases.length > 0 ? (
                        <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar">
                          {ventureCanvases.slice(0, 4).map((canvas) => {
                            const filled = canvas.blocks.filter((b) => b.content?.trim()).length;
                            const total = canvas.blocks.length;
                            const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
                            return (
                              <div
                                key={canvas._id}
                                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/40 cursor-pointer transition-all group/item"
                                onClick={() => handleOpenBMC(canvas)}
                              >
                                {/* Mini grid preview */}
                                <div className="w-9 h-7 grid grid-cols-3 gap-px rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                  {Array.from({ length: 9 }).map((_, i) => (
                                    <div key={i} className={canvas.blocks[i]?.content?.trim() ? 'bg-emerald-300' : 'bg-gray-100'} />
                                  ))}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-gray-800 truncate">{canvas.title}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${canvas.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                      {canvas.status === 'completed' ? 'Done' : 'Draft'}
                                    </span>
                                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="text-[9px] text-gray-400 flex-shrink-0">{filled}/{total}</span>
                                  </div>
                                </div>
                                <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover/item:text-emerald-500 flex-shrink-0 transition-colors" />
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="py-4 text-center">
                          <p className="text-xs text-gray-400">No canvas yet. Build your model!</p>
                        </div>
                      )}
                    </div>

                    <div className="px-5 py-4 mt-2 border-t border-gray-50 flex gap-2">
                      <button
                        onClick={handleNewBMC}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm shadow-emerald-200"
                      >
                        <Plus className="w-3.5 h-3.5" /> New BMC
                      </button>
                      <button
                        onClick={() => handleNavigation('/bmc')}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> View All
                      </button>
                    </div>
                  </div>

                  {/* ══════════════════════════════
                      3. FINANCIALS  (indigo/blue)
                  ══════════════════════════════ */}
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                    <div className="px-5 pt-5 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-[#020A3C] flex items-center justify-center shadow-lg shadow-[#020A3C]/20">
                            <BarChart3 className="w-5 h-5 text-[#3AB6FF]" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm">Financials</h3>
                            <p className="text-[10px] text-gray-400 mt-0.5">Costs · Revenue · Margins</p>
                          </div>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${financeSheet ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                          {isLoadingFinance ? '…' : financeSheet ? 'Active' : 'Not set'}
                        </span>
                      </div>

                      {/* Finance summary pills */}
                      {financeSummary ? (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
                            <p className="text-[10px] text-blue-500 font-medium mb-0.5">Revenue</p>
                            <p className="text-sm font-bold text-blue-800">
                              {financeSheet?.currency || '$'}{' '}
                              {financeSummary.grossRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-3 border border-indigo-100">
                            <p className="text-[10px] text-indigo-500 font-medium mb-0.5">Net Margin</p>
                            <p className={`text-sm font-bold ${financeSummary.netMargin >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                              {financeSheet?.currency || '$'}{' '}
                              {financeSummary.netMargin.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-3 border border-gray-100">
                            <p className="text-[10px] text-gray-500 font-medium mb-0.5">Total Costs</p>
                            <p className="text-sm font-bold text-gray-700">
                              {financeSheet?.currency || '$'}{' '}
                              {financeSummary.totalCosts.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-3 border border-amber-100">
                            <p className="text-[10px] text-amber-600 font-medium mb-0.5">Gross Margin</p>
                            <p className={`text-sm font-bold ${financeSummary.grossMargin >= 0 ? 'text-amber-700' : 'text-red-600'}`}>
                              {financeSheet?.currency || '$'}{' '}
                              {financeSummary.grossMargin.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                          </div>
                        </div>
                      ) : isLoadingFinance ? (
                        <div className="py-4 flex justify-center"><Loader2 className="w-5 h-5 text-blue-300 animate-spin" /></div>
                      ) : (
                        <div className="py-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 text-center">
                          <Coins className="w-8 h-8 text-blue-200 mx-auto mb-2" />
                          <p className="text-xs text-blue-400 font-medium">No financial sheet yet</p>
                          <p className="text-[10px] text-blue-300 mt-0.5">Set up costs, revenue & margins</p>
                        </div>
                      )}
                    </div>

                    <div className="px-5 py-4 mt-auto border-t border-gray-50">
                      <button
                        onClick={() => handleNavigation(`/financials${selectedVentureId ? `?ventureId=${selectedVentureId}` : ''}`)}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-[#020A3C] hover:bg-[#0a1963] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                        {financeSheet ? 'Open Financials' : 'Set Up Financials'}
                      </button>
                    </div>
                  </div>

                  {/* ══════════════════════════════
                      4. CROWDFUNDING  (amber/orange)
                  ══════════════════════════════ */}
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                    <div className="px-5 pt-5 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200">
                            <Megaphone className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm">Crowdfunding</h3>
                            <p className="text-[10px] text-gray-400 mt-0.5">Campaigns · Donations</p>
                          </div>
                        </div>
                        <span className="bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                          {isLoadingProjects ? '…' : userProjects.length}
                        </span>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 bg-amber-50 rounded-xl px-3 py-1.5">
                          <CheckCircle2 className="w-3 h-3 text-amber-500" />
                          <span className="text-[11px] font-semibold text-amber-700">
                            {userProjects.filter((p: any) => p.status === 'active' || p.status === 'published').length} Active
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-orange-50 rounded-xl px-3 py-1.5">
                          <HeartHandshake className="w-3 h-3 text-orange-500" />
                          <span className="text-[11px] font-semibold text-orange-700">
                            {userProjects.filter((p: any) => p.status === 'draft').length} Draft
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 flex-1 overflow-hidden">
                      {isLoadingProjects ? (
                        <div className="py-4 flex justify-center"><Loader2 className="w-5 h-5 text-amber-300 animate-spin" /></div>
                      ) : userProjects.length > 0 ? (
                        <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar">
                          {userProjects.slice(0, 4).map((project: any) => {
                            const raised = project.amountRaised ?? project.raised ?? 0;
                            const goal = project.goalAmount ?? project.goal ?? 0;
                            const fundPct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
                            return (
                              <div
                                key={project._id}
                                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/40 cursor-pointer transition-all group/item"
                                onClick={() => handleNavigation(`/projects/${project._id}`)}
                              >
                                <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Megaphone className="w-3.5 h-3.5 text-amber-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-gray-800 truncate">{project.title || project.name || 'Campaign'}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${fundPct}%` }} />
                                    </div>
                                    <span className="text-[9px] text-gray-400 flex-shrink-0">{fundPct}%</span>
                                  </div>
                                </div>
                                <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover/item:text-amber-500 flex-shrink-0 transition-colors" />
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="py-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 text-center">
                          <Megaphone className="w-8 h-8 text-amber-200 mx-auto mb-2" />
                          <p className="text-xs text-amber-400 font-medium">No campaigns yet</p>
                          <p className="text-[10px] text-amber-300 mt-0.5">Launch a crowdfunding campaign</p>
                        </div>
                      )}
                    </div>

                    <div className="px-5 py-4 mt-2 border-t border-gray-50 flex gap-2">
                      <button
                        onClick={() => handleNavigation('/projects/create')}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-semibold rounded-xl transition-all shadow-sm shadow-amber-200"
                      >
                        <Plus className="w-3.5 h-3.5" /> New Campaign
                      </button>
                      <button
                        onClick={() => handleNavigation('/projects')}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold rounded-xl transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Browse
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              QUICK ACTIONS (when venture selected)
          ═══════════════════════════════════════════ */}
          {selectedVenture && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-[#020A3C] rounded-xl flex items-center justify-center">
                  <Zap className="w-4 h-4 text-[#3AB6FF]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
                  <p className="text-gray-400 text-xs">For <span className="text-[#020A3C] font-medium">{selectedVenture.businessName}</span></p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map(({ label, desc, icon: Icon, gradient, path, disabled }) => (
                  <button
                    key={label}
                    onClick={() => !disabled && path && handleNavigation(path)}
                    disabled={disabled}
                    className={`group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 ${
                      disabled
                        ? 'opacity-50 cursor-not-allowed bg-gray-50 border border-gray-200'
                        : `bg-gradient-to-br ${gradient} shadow-md hover:shadow-xl hover:-translate-y-1 cursor-pointer`
                    }`}
                  >
                    {!disabled && <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />}
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${disabled ? 'bg-gray-200' : 'bg-white/20'}`}>
                        <Icon className={`w-5 h-5 ${disabled ? 'text-gray-400' : 'text-white'}`} />
                      </div>
                      <h3 className={`font-semibold text-sm mb-1 ${disabled ? 'text-gray-500' : 'text-white'}`}>{label}</h3>
                      <p className={`text-xs leading-relaxed ${disabled ? 'text-gray-400' : 'text-white/70'}`}>{desc}</p>
                      {!disabled && <ArrowUpRight className="absolute top-0 right-0 w-4 h-4 text-white/50 group-hover:text-white group-hover:scale-110 transition-all" />}
                      {disabled && (
                        <span className="inline-flex items-center gap-1 mt-2 bg-gray-200 text-gray-500 text-[10px] font-medium px-2 py-0.5 rounded-full">
                          <Lock className="w-2.5 h-2.5" /> Coming soon
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─── Inspirational Quote ─── */}
          <div
            className="relative overflow-hidden rounded-3xl p-8 text-center"
            style={{ background: 'linear-gradient(135deg, #020A3C 0%, #0a1963 100%)' }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#3AB6FF]/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/3 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="relative">
              <Sparkles className="w-6 h-6 text-[#3AB6FF] mx-auto mb-4 opacity-80" />
              <p className="text-2xl lg:text-3xl font-bold text-white mb-3 leading-snug max-w-2xl mx-auto">
                {t('quoteMessage') || '"The best time to plant a tree was 20 years ago. The second best time is now."'}
              </p>
              <p className="text-[#3AB6FF] font-medium text-sm">{t('quoteAuthor') || '— Proverb'}</p>
            </div>
          </div>

          {/* ─── Footer ─── */}
          <footer className="border-t border-gray-100 pt-8 pb-4">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <span className="text-gray-500 text-sm">{t('findUsOnSocialMedia') || 'Follow us'}</span>
                <div className="flex items-center gap-2">
                  {[
                    { Icon: Youtube, hover: 'hover:text-red-500' },
                    { Icon: Facebook, hover: 'hover:text-blue-600' },
                    { Icon: Linkedin, hover: 'hover:text-blue-700' },
                    { Icon: Instagram, hover: 'hover:text-pink-500' },
                  ].map(({ Icon, hover }) => (
                    <button key={hover} className={`w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 ${hover} transition-colors`}>
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#020A3C] rounded-2xl flex items-center justify-center shadow-md">
                  <span className="text-white font-black text-lg">B</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base leading-none">BOMOKO FUND</p>
                  <p className="text-gray-400 text-xs mt-0.5">{t('aiDrivenPlanning') || 'AI-driven business planning'}</p>
                </div>
              </div>
            </div>
            <div className="text-center mt-6 space-y-1">
              <p className="text-gray-400 text-xs">{t('freeTrialMessage') || 'Start your free trial today — no credit card required.'}</p>
              <p className="text-gray-400 text-xs">{t('craftingStrategies') || 'Crafting winning strategies for entrepreneurs worldwide.'}</p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

/* ─────────────────────────────────────────
   Helper Sub-Components
───────────────────────────────────────── */

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-10 gap-3">
    <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
    <p className="text-gray-400 text-sm">Loading…</p>
  </div>
);

const EmptyState = ({ icon, title, desc, error = false }: { icon: React.ReactNode; title: string; desc: string; error?: boolean }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${error ? 'bg-red-50' : 'bg-gray-50'}`}>{icon}</div>
    <p className="font-semibold text-gray-700 text-sm">{title}</p>
    <p className="text-gray-400 text-xs mt-1">{desc}</p>
  </div>
);

const EmptyActionState = ({ icon, title, desc, btnLabel, onBtnClick, accent = false }: { icon: React.ReactNode; title: string; desc: string; btnLabel: string; onBtnClick: () => void; accent?: boolean }) => (
  <div className="flex flex-col items-center justify-center py-10 text-center">
    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">{icon}</div>
    <p className="font-semibold text-gray-700 text-sm">{title}</p>
    <p className="text-gray-400 text-xs mt-1 mb-5 max-w-[200px]">{desc}</p>
    <button
      onClick={onBtnClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 ${
        accent ? 'bg-gradient-to-r from-[#3AB6FF] to-[#2aa5ee] text-white' : 'bg-[#020A3C] text-white hover:bg-[#0a1963]'
      }`}
    >
      <Plus className="w-4 h-4" />
      {btnLabel}
    </button>
  </div>
);

export default Dashboard;
