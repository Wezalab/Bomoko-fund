import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectUser, setUser, setToken, initialState } from '@/redux/slices/userSlice';
import { ProjectInitialState, setProject } from '@/redux/slices/projectSlice';
import { useTranslation } from '@/lib/TranslationContext';
import { useGetUserVenturesQuery } from '@/redux/services/ventureServices';
import {
  Home,
  Edit,
  Eye,
  DollarSign,
  Users,
  Settings,
  User,
  ArrowUpRight,
  Trash2,
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
  Clock,
  Zap,
  Shield,
  HelpCircle,
  HeartHandshake,
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

interface PlanData {
  id: string;
  name: string;
  businessId: string;
  createdAt: string;
  type: string;
  status: 'setup' | 'not_setup' | 'completed';
  description: string;
}

const NAV_ITEMS = [
  { path: '/dashboard', icon: Home, labelKey: 'home' },
  { path: '/business-plan/wizard', icon: FileText, labelKey: 'addPlan' },
  { path: '/business-plan-editor', icon: Edit, labelKey: 'editPlan' },
  { path: '/business-plan', icon: Eye, labelKey: 'viewPlan' },
  { path: '/bmc', icon: LayoutGrid, labelKey: 'bmc' },
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

  const { data: venturesResponse, isLoading: isLoadingVentures, error: venturesError } =
    useGetUserVenturesQuery({ userId: user?._id || '', page: 1, limit: 50 }, { skip: !user?._id });

  const ventures = Array.isArray(venturesResponse)
    ? venturesResponse
    : venturesResponse && typeof venturesResponse === 'object' && 'data' in venturesResponse && Array.isArray((venturesResponse as any).data)
    ? (venturesResponse as any).data
    : [];

  useEffect(() => {
    console.log('[DEBUG] User ID:', user?._id);
    console.log('[DEBUG] Ventures API Response:', venturesResponse);
  }, [user?._id, venturesResponse]);

  const displayVentures = ventures;

  const [plans, setPlans] = useState<PlanData[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('1');

  useEffect(() => {
    if (Array.isArray(displayVentures) && displayVentures.length > 0 && !selectedBusinessId) {
      setSelectedBusinessId(displayVentures[0]._id);
    }
  }, [displayVentures, selectedBusinessId]);

  const selectedBusiness =
    Array.isArray(displayVentures) && displayVentures.find
      ? displayVentures.find((v) => v._id === selectedBusinessId) || null
      : null;

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

  const handleDeleteBusiness = (businessId: string) => {
    if (window.confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      if (selectedBusinessId === businessId && Array.isArray(displayVentures)) {
        const remaining = displayVentures.filter((v) => v._id !== businessId);
        setSelectedBusinessId(remaining.length > 0 ? remaining[0]._id : '');
      }
    }
  };

  const handleDeletePlan = (planId: string) => {
    if (window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      setPlans(plans.filter((p) => p.id !== planId));
      if (selectedPlanId === planId) {
        const remaining = plans.filter((p) => p.id !== planId);
        setSelectedPlanId(remaining.length > 0 ? remaining[0].id : '');
      }
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const userName = user?.name || user?.email?.split('@')[0] || 'User';

  /* ─── Quick Action Cards ─── */
  const quickActions = [
    {
      label: t('planEditor') || 'Plan Editor',
      desc: t('continueWorkingOnPlan') || 'Continue working on your plan',
      icon: Edit,
      gradient: 'from-[#020A3C] to-[#0d1f8c]',
      path: '/business-plan-editor',
      disabled: false,
    },
    {
      label: t('planViewer') || 'Plan Viewer',
      desc: t('viewOrDownloadPlan') || 'View or download your plan',
      icon: Eye,
      gradient: 'from-[#3AB6FF] to-[#0e8fdb]',
      path: '/business-plan',
      disabled: false,
    },
    {
      label: t('businessSettings') || 'Business Settings',
      desc: t('modifyBusinessDetails') || 'Modify business details',
      icon: Building,
      gradient: 'from-violet-600 to-purple-700',
      path: '/business-settings',
      disabled: false,
    },
    {
      label: t('userAccess') || 'User Access',
      desc: t('manageUserAccess') || 'Manage collaborators',
      icon: Users,
      gradient: 'from-emerald-500 to-teal-600',
      path: '/user-access',
      disabled: false,
    },
    {
      label: t('accountSettings') || 'Account Settings',
      desc: t('manageUserProfileAccountBilling') || 'Profile, account & billing',
      icon: Shield,
      gradient: 'from-orange-500 to-red-500',
      path: '/account-settings',
      disabled: false,
    },
    {
      label: t('frequentQuestions') || 'FAQ',
      desc: t('findAnswersTutorialVideos') || 'Find answers & tutorials',
      icon: HelpCircle,
      gradient: 'from-pink-500 to-rose-600',
      path: '/faq',
      disabled: false,
    },
    {
      label: t('requestSupport') || 'Request Support',
      desc: t('getInTouchSupportTeam') || 'Get in touch with support',
      icon: HeartHandshake,
      gradient: 'from-sky-500 to-blue-600',
      path: '/support',
      disabled: false,
    },
    {
      label: t('partnerProgram') || 'Partner Program',
      desc: t('earnRewardsReferNewCustomers') || 'Earn rewards by referring',
      icon: Sparkles,
      gradient: 'from-amber-500 to-yellow-500',
      path: '',
      disabled: true,
    },
  ];

  /* ─────────────── JSX ─────────────── */
  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #f8faff 100%)' }}>

      {/* ═══════════════════════════════════════
          SIDEBAR
      ═══════════════════════════════════════ */}
      <aside
        className="w-[72px] flex flex-col items-center py-5 fixed left-0 top-0 bottom-0 z-30 shadow-xl"
        style={{ background: 'linear-gradient(180deg, #020A3C 0%, #030e5a 60%, #020A3C 100%)' }}
      >
        {/* Logo */}
        <div
          className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center cursor-pointer mb-8 shadow-lg hover:scale-105 transition-transform"
          onClick={() => handleNavigation('/dashboard')}
        >
          <span className="text-[#020A3C] font-black text-lg">B</span>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-2 flex-1 w-full px-3">
          {NAV_ITEMS.map(({ path, icon: Icon, labelKey }) => {
            const active = isActiveRoute(path);
            return (
              <button
                key={path}
                onClick={() => handleNavigation(path)}
                title={t(labelKey) || labelKey}
                className={`relative w-full h-11 flex items-center justify-center rounded-xl transition-all duration-200 group ${
                  active
                    ? 'bg-white/15 shadow-inner'
                    : 'hover:bg-white/10'
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#3AB6FF]" />
                )}
                <Icon
                  className={`w-[18px] h-[18px] transition-colors ${
                    active ? 'text-white' : 'text-white/60 group-hover:text-white/90'
                  }`}
                />
                <span className="absolute left-[calc(100%+12px)] px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl">
                  {t(labelKey) || labelKey}
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                </span>
              </button>
            );
          })}
        </nav>

        {/* Upgrade button */}
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

      {/* ═══════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════ */}
      <main className="flex-1 ml-[72px] flex flex-col min-h-screen overflow-hidden">

        {/* ── Top Header ── */}
        <header
          className="relative overflow-hidden px-8 pt-8 pb-10"
          style={{ background: 'linear-gradient(135deg, #020A3C 0%, #0a1963 50%, #0d2080 100%)' }}
        >
          {/* Background decorative circles */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute -bottom-16 -left-10 w-60 h-60 bg-[#3AB6FF]/10 rounded-full pointer-events-none" />
          <div className="absolute top-4 right-64 w-32 h-32 bg-white/3 rounded-full pointer-events-none" />

          <div className="relative flex items-start justify-between">
            <div className="flex flex-col">
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
              {/* Search */}
              <div className="relative hidden lg:flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-white/40" />
                <input
                  className="bg-white/10 text-white text-sm placeholder-white/40 border border-white/15 rounded-xl pl-9 pr-4 py-2.5 w-52 focus:outline-none focus:border-[#3AB6FF]/50 focus:bg-white/15 transition-all"
                  placeholder="Search..."
                />
              </div>

              {/* Bell */}
              <button className="relative w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center border border-white/15 transition-colors">
                <Bell className="w-4.5 h-4.5 text-white/80" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#3AB6FF] rounded-full" />
              </button>

              {/* User Dropdown */}
              {user?.email && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl h-11 px-3 transition-all">
                      <img
                        src={userAvatar}
                        className="w-8 h-8 rounded-xl object-cover ring-2 ring-[#3AB6FF]/40"
                        alt="profile"
                        onError={handleImageError}
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-sm font-medium text-white hidden sm:block max-w-[120px] truncate">
                        {userName}
                      </span>
                      <ChevronDown className="w-4 h-4 text-white/60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="p-2 w-64 shadow-2xl border-gray-100 rounded-2xl">
                    <div className="flex items-center gap-3 p-3 mb-1 bg-gray-50 rounded-xl">
                      <img
                        src={userAvatar}
                        className="w-10 h-10 rounded-xl object-cover"
                        alt="profile"
                        onError={handleImageError}
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{userName}</p>
                        <p className="text-gray-500 text-xs truncate">{user?.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup className="space-y-0.5">
                      <DropdownMenuItem
                        className="p-2.5 rounded-xl cursor-pointer"
                        onClick={() => handleNavigation('/profile')}
                      >
                        <User className="w-4 h-4 mr-2.5 text-gray-500" />
                        <span className="text-sm">{t('profile') || 'Profile'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="p-2.5 rounded-xl cursor-pointer"
                        onClick={() => handleNavigation('/projects')}
                      >
                        <Building className="w-4 h-4 mr-2.5 text-gray-500" />
                        <span className="text-sm">{t('projects') || 'Projects'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="p-2.5 rounded-xl cursor-pointer"
                        onClick={() => handleNavigation('/settings')}
                      >
                        <Settings className="w-4 h-4 mr-2.5 text-gray-500" />
                        <span className="text-sm">{t('settings') || 'Settings'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="p-2.5 rounded-xl cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-50"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 mr-2.5" />
                        <span className="text-sm">{t('logout') || 'Logout'}</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* ── Stats Bar ── */}
          <div className="relative mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Total Ventures',
                value: isLoadingVentures ? '…' : (Array.isArray(displayVentures) ? displayVentures.length : 0),
                icon: Building,
                color: 'from-[#3AB6FF]/20 to-[#3AB6FF]/5',
                iconColor: 'text-[#3AB6FF]',
                trend: '+2 this month',
              },
              {
                label: 'Business Plans',
                value: plans.length,
                icon: FileText,
                color: 'from-violet-400/20 to-violet-400/5',
                iconColor: 'text-violet-300',
                trend: 'Create your first',
              },
              {
                label: 'Active Projects',
                value: Array.isArray(displayVentures)
                  ? displayVentures.filter((v) => v.status === 'in-progress').length
                  : 0,
                icon: TrendingUp,
                color: 'from-emerald-400/20 to-emerald-400/5',
                iconColor: 'text-emerald-300',
                trend: 'In progress',
              },
              {
                label: 'Completed',
                value: Array.isArray(displayVentures)
                  ? displayVentures.filter((v) => v.status === 'completed').length
                  : 0,
                icon: CheckCircle2,
                color: 'from-amber-400/20 to-amber-400/5',
                iconColor: 'text-amber-300',
                trend: 'Well done!',
              },
            ].map(({ label, value, icon: Icon, color, iconColor, trend }) => (
              <div
                key={label}
                className={`bg-gradient-to-br ${color} border border-white/10 rounded-2xl p-4 backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/60 text-xs font-medium">{label}</span>
                  <div className={`w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                  </div>
                </div>
                <p className="text-white text-2xl font-bold">{value}</p>
                <p className="text-white/40 text-xs mt-1">{trend}</p>
              </div>
            ))}
          </div>
        </header>

        {/* ── Page Body ── */}
        <div className="flex-1 p-8 space-y-8">

          {/* ── Ventures + Plans ── */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* ── My Ventures ── */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 flex items-center justify-between border-b border-gray-50">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{t('myVentures') || 'My Ventures'}</h2>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {Array.isArray(displayVentures) ? displayVentures.length : 0} venture
                    {Array.isArray(displayVentures) && displayVentures.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => handleNavigation('/venture-wizard')}
                  className="w-9 h-9 bg-[#020A3C] hover:bg-[#0a1963] text-white rounded-xl flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
                  title={t('createNewBusiness') || 'New Venture'}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6">
                {!user?._id ? (
                  <EmptyState
                    icon={<Building className="w-8 h-8 text-gray-300" />}
                    title="Sign in required"
                    desc="Please sign in to view your ventures"
                  />
                ) : isLoadingVentures ? (
                  <LoadingState />
                ) : venturesError ? (
                  <EmptyState
                    icon={<Building className="w-8 h-8 text-red-300" />}
                    title="Couldn't load ventures"
                    desc="Please try again later"
                    error
                  />
                ) : Array.isArray(displayVentures) && displayVentures.length > 0 ? (
                  <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
                    {displayVentures.map((venture) => {
                      const isSelected = selectedBusinessId === venture._id;
                      const statusCfg = STATUS_CONFIG[venture.status] || STATUS_CONFIG['draft'];
                      return (
                        <div
                          key={venture._id}
                          className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border-2 group ${
                            isSelected
                              ? 'border-[#3AB6FF] bg-gradient-to-r from-[#3AB6FF]/5 to-[#020A3C]/3 shadow-sm'
                              : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/60'
                          }`}
                          onClick={() => setSelectedBusinessId(venture._id)}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                                isSelected ? 'bg-[#020A3C] text-white' : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {(venture.businessName || 'V')[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="font-semibold text-gray-900 text-sm truncate">{venture.businessName}</h3>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteBusiness(venture._id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 transition-all text-red-400 hover:text-red-600 flex-shrink-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              {venture.businessDescription && (
                                <p className="text-gray-400 text-xs mt-0.5 truncate">{venture.businessDescription}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusCfg.bg} ${statusCfg.text}`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                                  {statusCfg.label}
                                </span>
                                {venture.country && (
                                  <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                                    <MapPin className="w-3 h-3" />
                                    {venture.country}
                                  </span>
                                )}
                                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(venture.createdAt)}
                                </span>
                              </div>
                              {venture.businessTypes?.length > 0 && (
                                <div className="flex gap-1 mt-2 flex-wrap">
                                  {venture.businessTypes.slice(0, 2).map((type: string, i: number) => (
                                    <span
                                      key={i}
                                      className="bg-[#3AB6FF]/10 text-[#3AB6FF] px-2 py-0.5 rounded-full text-[10px] font-medium"
                                    >
                                      {type}
                                    </span>
                                  ))}
                                  {venture.businessTypes.length > 2 && (
                                    <span className="text-[10px] text-gray-400 self-center">
                                      +{venture.businessTypes.length - 2} more
                                    </span>
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
                    desc={t('createBusinessMessage') || 'Create your first venture to get started'}
                    btnLabel={t('createNewBusiness') || 'Create Venture'}
                    onBtnClick={() => handleNavigation('/venture-wizard')}
                  />
                )}
              </div>
            </div>

            {/* ── My Business Plans ── */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 flex items-center justify-between border-b border-gray-50">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{t('myBusinessPlans') || 'Business Plans'}</h2>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {plans.length} plan{plans.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => handleNavigation('/business-plan/wizard')}
                  className="w-9 h-9 bg-[#3AB6FF] hover:bg-[#2aa5ee] text-white rounded-xl flex items-center justify-center transition-colors shadow-md shadow-[#3AB6FF]/30 hover:shadow-lg"
                  title={t('createNewPlan') || 'New Plan'}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6">
                {plans.length > 0 ? (
                  <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
                    {plans.map((plan) => {
                      const isSelected = selectedPlanId === plan.id;
                      const statusCfg = STATUS_CONFIG[plan.status] || STATUS_CONFIG['draft'];
                      return (
                        <div
                          key={plan.id}
                          className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border-2 group ${
                            isSelected
                              ? 'border-[#3AB6FF] bg-gradient-to-r from-[#3AB6FF]/5 to-transparent'
                              : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/60'
                          }`}
                          onClick={() => setSelectedPlanId(plan.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-[#3AB6FF] text-white' : 'bg-gray-100 text-gray-500'}`}>
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 text-sm truncate">{plan.name}</h3>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDeletePlan(plan.id); }}
                                  className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 transition-all text-red-400 hover:text-red-600"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-gray-400 text-xs mt-0.5 truncate">{plan.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusCfg.bg} ${statusCfg.text}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                                  {statusCfg.label}
                                </span>
                                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                                  <Clock className="w-3 h-3" />
                                  {formatDate(plan.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyActionState
                    icon={<FileText className="w-8 h-8 text-gray-300" />}
                    title={t('noPlansCreated') || 'No business plans yet'}
                    desc={t('createPlanMessage') || 'Generate an AI-powered business plan for your venture'}
                    btnLabel={t('createNewPlan') || 'Create Plan'}
                    onBtnClick={() => handleNavigation('/business-plan/wizard')}
                    accent
                  />
                )}
              </div>
            </div>
          </div>

          {/* ── Quick Actions (only when a venture is selected) ── */}
          {selectedBusiness && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-[#020A3C] rounded-xl flex items-center justify-center">
                  <Zap className="w-4 h-4 text-[#3AB6FF]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
                  <p className="text-gray-400 text-xs">For <span className="text-[#020A3C] font-medium">{selectedBusiness.businessName}</span></p>
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
                        ? 'opacity-50 cursor-not-allowed bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200'
                        : `bg-gradient-to-br ${gradient} shadow-md hover:shadow-xl hover:-translate-y-1 cursor-pointer`
                    }`}
                  >
                    {!disabled && (
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                    )}
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${disabled ? 'bg-gray-200' : 'bg-white/20'}`}>
                        <Icon className={`w-5 h-5 ${disabled ? 'text-gray-400' : 'text-white'}`} />
                      </div>
                      <h3 className={`font-semibold text-sm mb-1 ${disabled ? 'text-gray-500' : 'text-white'}`}>
                        {label}
                      </h3>
                      <p className={`text-xs leading-relaxed ${disabled ? 'text-gray-400' : 'text-white/70'}`}>
                        {desc}
                      </p>
                      {!disabled && (
                        <ArrowUpRight className="absolute top-0 right-0 w-4 h-4 text-white/50 group-hover:text-white group-hover:scale-110 transition-all" />
                      )}
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

          {/* ── Inspirational Quote ── */}
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
              <p className="text-[#3AB6FF] font-medium text-sm">
                {t('quoteAuthor') || '— Proverb'}
              </p>
            </div>
          </div>

          {/* ── Footer ── */}
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
                    <button
                      key={hover}
                      className={`w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 ${hover} transition-colors`}
                    >
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
  <div className="flex flex-col items-center justify-center py-14 gap-3">
    <div className="w-10 h-10 rounded-2xl border-[3px] border-[#3AB6FF]/30 border-t-[#3AB6FF] animate-spin" />
    <p className="text-gray-400 text-sm">Loading…</p>
  </div>
);

const EmptyState = ({
  icon,
  title,
  desc,
  error = false,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  error?: boolean;
}) => (
  <div className="flex flex-col items-center justify-center py-14 text-center">
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${error ? 'bg-red-50' : 'bg-gray-50'}`}>
      {icon}
    </div>
    <p className="font-semibold text-gray-700 text-sm">{title}</p>
    <p className="text-gray-400 text-xs mt-1">{desc}</p>
  </div>
);

const EmptyActionState = ({
  icon,
  title,
  desc,
  btnLabel,
  onBtnClick,
  accent = false,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  btnLabel: string;
  onBtnClick: () => void;
  accent?: boolean;
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">{icon}</div>
    <p className="font-semibold text-gray-700 text-sm">{title}</p>
    <p className="text-gray-400 text-xs mt-1 mb-5 max-w-[200px]">{desc}</p>
    <button
      onClick={onBtnClick}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 ${
        accent
          ? 'bg-gradient-to-r from-[#3AB6FF] to-[#2aa5ee] text-white shadow-[#3AB6FF]/30'
          : 'bg-[#020A3C] text-white hover:bg-[#0a1963]'
      }`}
    >
      <Plus className="w-4 h-4" />
      {btnLabel}
    </button>
  </div>
);

export default Dashboard;
