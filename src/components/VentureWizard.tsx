import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  User,
  Plus,
  X,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useTranslation } from '../lib/TranslationContext';
import { apiUrl } from '../lib/env';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectUser, selectToken, setToken, setUser } from '@/redux/slices/userSlice';
import {
  useCreateEntrepriseMutation,
  EntreprisePayload,
  EntrepriseSecteur,
  EntrepriseCustomerType,
  EntrepriseCategoryBase,
  EntrepriseTeamMember,
} from '@/redux/services/ventureServices';

type EntrepriseDraft = {
  company_name: string;
  mini_bio: string;
  description: string;
  founding_date: string;
  mission: string;
  vision: string;
  phone: string;
  full_address: string;
  secteur: EntrepriseSecteur[];
  stage: string;
  type_of_customers: EntrepriseCustomerType[];
  customer_base: string[];
  category_base: EntrepriseCategoryBase[];
  website: string;
  email: string;
  social_Media: string[];
  team: EntrepriseTeamMember[];
};

const emptyDraft: EntrepriseDraft = {
  company_name: '',
  mini_bio: '',
  description: '',
  founding_date: '',
  mission: '',
  vision: '',
  phone: '',
  full_address: '',
  secteur: [],
  stage: '',
  type_of_customers: [],
  customer_base: [],
  category_base: [],
  website: '',
  email: '',
  social_Media: [],
  team: [],
};

const SECTEUR_OPTIONS: { value: EntrepriseSecteur; labelKey: string; fallback: string }[] = [
  { value: 'AGRO-TRANSFORMATION', labelKey: 'sectorAgro', fallback: 'Agro-transformation' },
  { value: 'SERVICE', labelKey: 'sectorService', fallback: 'Service' },
  { value: 'AUTRE', labelKey: 'sectorOther', fallback: 'Other' },
];

const STAGE_OPTIONS: { value: string; labelKey: string; fallback: string }[] = [
  { value: 'IDEA', labelKey: 'stageIdea', fallback: 'Idea' },
  { value: 'MVP', labelKey: 'stageMvp', fallback: 'MVP' },
  { value: 'EARLY', labelKey: 'stageEarly', fallback: 'Early stage' },
  { value: 'GROWTH', labelKey: 'stageGrowth', fallback: 'Growth' },
  { value: 'SCALE', labelKey: 'stageScale', fallback: 'Scale' },
];

const CUSTOMER_TYPE_OPTIONS: { value: EntrepriseCustomerType; label: string }[] = [
  { value: 'B2B', label: 'B2B' },
  { value: 'B2C', label: 'B2C' },
  { value: 'B2B2C', label: 'B2B2C' },
  { value: 'C2C', label: 'C2C' },
  { value: 'B2G', label: 'B2G' },
];

const CATEGORY_BASE_OPTIONS: { value: EntrepriseCategoryBase; labelKey: string; fallback: string }[] = [
  { value: 'PME', labelKey: 'categoryPME', fallback: 'PME' },
  { value: 'JEUNE', labelKey: 'categoryJEUNE', fallback: 'Youth' },
  { value: 'FEMME', labelKey: 'categoryFEMME', fallback: 'Women-led' },
  { value: 'PSDE', labelKey: 'categoryPSDE', fallback: 'PSDE' },
];

type StepDef = {
  id: string;
  titleKey: string;
  titleFallback: string;
  descKey: string;
  descFallback: string;
};

const STEPS: StepDef[] = [
  {
    id: 'identity',
    titleKey: 'wizardStepIdentity',
    titleFallback: 'Identity',
    descKey: 'wizardStepIdentityDesc',
    descFallback: 'Tell us the name of your venture and a one-line bio.',
  },
  {
    id: 'vision',
    titleKey: 'wizardStepVision',
    titleFallback: 'Vision & mission',
    descKey: 'wizardStepVisionDesc',
    descFallback: 'Describe what you do, why you do it, and when you started.',
  },
  {
    id: 'sector',
    titleKey: 'wizardStepSector',
    titleFallback: 'Sector & stage',
    descKey: 'wizardStepSectorDesc',
    descFallback: 'What sector are you in and how mature is the venture?',
  },
  {
    id: 'customers',
    titleKey: 'wizardStepCustomers',
    titleFallback: 'Customers',
    descKey: 'wizardStepCustomersDesc',
    descFallback: 'Who do you serve and what categories does your venture fit?',
  },
  {
    id: 'contact',
    titleKey: 'wizardStepContact',
    titleFallback: 'Contact',
    descKey: 'wizardStepContactDesc',
    descFallback: 'How can people reach you?',
  },
  {
    id: 'team',
    titleKey: 'wizardStepTeam',
    titleFallback: 'Team',
    descKey: 'wizardStepTeamDesc',
    descFallback: 'Add the people building this venture with you.',
  },
  {
    id: 'review',
    titleKey: 'wizardStepReview',
    titleFallback: 'Review & submit',
    descKey: 'wizardStepReviewDesc',
    descFallback: 'Double-check everything before saving your venture.',
  },
];

const numberColors = [
  'text-yellow',
  'text-green-400',
  'text-blue-400',
  'text-purple-400',
  'text-red-400',
];

const VentureWizard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const isLoggedIn = !!(currentUser?.email || currentUser?.phone_number) && !!token && !!currentUser?._id;

  const [currentStep, setCurrentStep] = useState(0);
  const [draft, setDraft] = useState<EntrepriseDraft>(emptyDraft);
  const [sidebarView, setSidebarView] = useState<'benefits' | 'funding'>('benefits');
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultModalType, setResultModalType] = useState<'success' | 'error'>('success');
  const [resultModalMessage, setResultModalMessage] = useState('');

  // Local input buffers for chip-style inputs (so the user can type without
  // committing on every keystroke).
  const [customerBaseBuf, setCustomerBaseBuf] = useState('');
  const [socialBuf, setSocialBuf] = useState('');

  const [createEntreprise, { isLoading: isCreating }] = useCreateEntrepriseMutation();

  const update = <K extends keyof EntrepriseDraft>(key: K, value: EntrepriseDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayValue = <T extends string>(arr: T[], value: T): T[] => {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
  };

  const addChip = (key: 'customer_base' | 'social_Media', value: string) => {
    const v = value.trim();
    if (!v) return;
    if (draft[key].includes(v)) return;
    update(key, [...draft[key], v]);
  };

  const removeChip = (key: 'customer_base' | 'social_Media', value: string) => {
    update(
      key,
      draft[key].filter((v) => v !== value)
    );
  };

  const addTeamMember = () => {
    update('team', [...draft.team, { name: '', email: '', phone: '' }]);
  };

  const updateTeamMember = (index: number, field: keyof EntrepriseTeamMember, value: string) => {
    const next = draft.team.slice();
    next[index] = { ...next[index], [field]: value };
    update('team', next);
  };

  const removeTeamMember = (index: number) => {
    update(
      'team',
      draft.team.filter((_, i) => i !== index)
    );
  };

  const isStepComplete = (stepId: string) => {
    switch (stepId) {
      case 'identity':
        // Only company_name is required (matches API contract).
        return draft.company_name.trim().length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const buildPayload = (ownerId: string): EntreprisePayload => {
    // Strip empty strings / empty arrays so we don't send noisy fields the
    // backend doesn't need (everything except `owner` and `company_name` is
    // optional on the API side).
    const cleanedTeam = draft.team
      .map((m) => ({
        name: m.name.trim(),
        email: m.email?.trim() || undefined,
        phone: m.phone?.trim() || undefined,
      }))
      .filter((m) => m.name.length > 0);

    const payload: EntreprisePayload = {
      owner: ownerId,
      company_name: draft.company_name.trim(),
    };
    if (draft.mini_bio.trim()) payload.mini_bio = draft.mini_bio.trim();
    if (draft.description.trim()) payload.description = draft.description.trim();
    if (draft.founding_date) payload.founding_date = draft.founding_date;
    if (draft.mission.trim()) payload.mission = draft.mission.trim();
    if (draft.vision.trim()) payload.vision = draft.vision.trim();
    if (draft.phone.trim()) payload.phone = draft.phone.trim();
    if (draft.full_address.trim()) payload.full_address = draft.full_address.trim();
    if (draft.secteur.length) payload.secteur = draft.secteur;
    if (draft.stage) payload.stage = draft.stage;
    if (draft.type_of_customers.length) payload.type_of_customers = draft.type_of_customers;
    if (draft.customer_base.length) payload.customer_base = draft.customer_base;
    if (draft.category_base.length) payload.category_base = draft.category_base;
    if (draft.website.trim()) payload.website = draft.website.trim();
    if (draft.email.trim()) payload.email = draft.email.trim();
    if (draft.social_Media.length) payload.social_Media = draft.social_Media;
    if (cleanedTeam.length) payload.team = cleanedTeam;
    return payload;
  };

  const handleComplete = async () => {
    if (!isLoggedIn || !currentUser?._id) {
      toast.error(t('Please sign in to create a venture') || 'Please sign in to create a venture');
      return;
    }
    if (!draft.company_name.trim()) {
      toast.error(t('Company name is required') || 'Company name is required');
      return;
    }

    try {
      const payload = buildPayload(currentUser._id);
      const result = await createEntreprise(payload).unwrap();
      console.log('✅ Entreprise created:', result);

      setResultModalType('success');
      setResultModalMessage(
        `${t('ventureCreatedSuccessfully') || 'Venture created successfully!'} "${draft.company_name.trim()}"`
      );
      setShowResultModal(true);
      toast.success(`🎉 ${t('ventureCreatedSuccessfully') || 'Venture created successfully!'}`);
    } catch (error: any) {
      console.error('❌ Error creating entreprise:', error);
      let errorMessage = t('failedToCreateVenture') || 'Failed to create venture. Please try again.';
      if (error?.data?.message) errorMessage = error.data.message;
      else if (error?.message) errorMessage = error.message;
      else if (error?.status) errorMessage = `${t('Server error') || 'Server error'}: ${error.status}`;
      setResultModalType('error');
      setResultModalMessage(errorMessage);
      setShowResultModal(true);
      toast.error(`❌ ${errorMessage}`);
    }
  };

  // ---------- Google auth pre-step (only when not logged in) ----------
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const backendResponse = await fetch(`${apiUrl}/auth/exchange-google-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleToken: credentialResponse.credential,
          idToken: credentialResponse.credential,
          credential: credentialResponse.credential,
          token: credentialResponse.credential,
        }),
      });

      if (!backendResponse.ok) {
        const errorText = await backendResponse.text();
        throw new Error(`Backend authentication failed: ${backendResponse.status} - ${errorText || 'Unknown error'}.`);
      }

      const authData = await backendResponse.json();
      const userId = authData.userId || authData.user?._id || authData.user?.id || authData.user?.sub;
      const isSuccess = authData.success || userId || authData.jwtToken || authData.token;

      if (!isSuccess) throw new Error(authData.message || 'Authentication failed');

      dispatch(setToken(authData.jwtToken || authData.token));
      dispatch(
        setUser({
          _id: userId,
          email: authData.user?.email || '',
          name: authData.user?.name || '',
          phone_number: authData.user?.phone || '',
          bio: authData.user?.bio || '',
          location: authData.user?.location || '',
          isGoogleUser: true,
          profile: authData.user?.avatar || authData.user?.picture || '',
          projects: authData.user?.projects || [],
          cryptoWallet: authData.user?.cryptoWallet || [],
        })
      );

      toast.success(t('Successfully signed in with Google') || 'Successfully signed in with Google');
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error(t('Google authentication failed. Please try again.') || 'Google authentication failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    console.error('Google sign-in failed');
    toast.error(t('Google authentication failed. Please try again.') || 'Google authentication failed. Please try again.');
  };

  // ---------- Sidebar content ----------
  const renderSidebarContent = () => {
    if (sidebarView === 'benefits') {
      return (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">
              {t('Benefits of using BOMOKO FUND') || 'Benefits of using BOMOKO FUND'}
            </h3>
            <p className="text-sm text-gray-300">
              {t('for creating your business plan.') || 'for creating your business plan.'}
            </p>
          </div>
          <div className="space-y-6">
            {[
              {
                title: t('AI-powered business planning') || 'AI-powered business planning',
                desc:
                  t(
                    'Create a professional quality business plan in no time, just answer our multiple-choice questions and let BOMOKO FUND do the rest.'
                  ) ||
                  'Create a professional quality business plan in no time, just answer our multiple-choice questions and let BOMOKO FUND do the rest.',
              },
              {
                title: t('Access to funding opportunities') || 'Access to funding opportunities',
                desc:
                  t(
                    'Connect with investors and funding opportunities specifically designed for African entrepreneurs and high-potential projects.'
                  ) ||
                  'Connect with investors and funding opportunities specifically designed for African entrepreneurs and high-potential projects.',
              },
              {
                title: t('Community of entrepreneurs') || 'Community of entrepreneurs',
                desc:
                  t(
                    'Join a thriving ecosystem of visionary business owners, impact-driven investors, and supporters across Africa.'
                  ) ||
                  'Join a thriving ecosystem of visionary business owners, impact-driven investors, and supporters across Africa.',
              },
              {
                title: t('Expert guidance and mentorship') || 'Expert guidance and mentorship',
                desc:
                  t(
                    'Get guidance from experienced entrepreneurs and business experts who understand the African market landscape.'
                  ) ||
                  'Get guidance from experienced entrepreneurs and business experts who understand the African market landscape.',
              },
              {
                title: t('Comprehensive business tools') || 'Comprehensive business tools',
                desc:
                  t(
                    'Focus on high-potential projects that address critical social and economic needs across African communities.'
                  ) ||
                  'Focus on high-potential projects that address critical social and economic needs across African communities.',
              },
            ].map((b, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className={`text-4xl font-bold ${numberColors[i]} opacity-90`}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-white">{b.title}</h4>
                  <p className="text-sm text-gray-300">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }
    return (
      <>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-white">
            {t('How funding works on BOMOKO FUND') || 'How funding works on BOMOKO FUND'}
          </h3>
          <p className="text-sm text-gray-300">
            {t('Step-by-step guide to get funded.') || 'Step-by-step guide to get funded.'}
          </p>
        </div>
      </>
    );
  };

  // ---------- Step content ----------
  const renderStepContent = () => {
    const step = STEPS[currentStep];
    switch (step.id) {
      case 'identity':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="company_name">
                {t('companyName') || 'Company name'} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="company_name"
                value={draft.company_name}
                onChange={(e) => update('company_name', e.target.value)}
                placeholder={t('companyName') || 'Company name'}
              />
            </div>
            <div>
              <Label htmlFor="mini_bio">{t('miniBio') || 'Short description'}</Label>
              <Input
                id="mini_bio"
                value={draft.mini_bio}
                onChange={(e) => update('mini_bio', e.target.value)}
                placeholder={t('miniBioPlaceholder') || 'A one-line description of your venture'}
                maxLength={200}
              />
            </div>
          </div>
        );

      case 'vision':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">{t('descriptionLabel') || 'Description'}</Label>
              <Textarea
                id="description"
                value={draft.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder={t('descriptionPlaceholder') || 'Describe what your venture does in detail.'}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="mission">{t('mission') || 'Mission'}</Label>
              <Textarea
                id="mission"
                value={draft.mission}
                onChange={(e) => update('mission', e.target.value)}
                placeholder={t('missionPlaceholder') || 'What problem do you solve?'}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="vision">{t('vision') || 'Vision'}</Label>
              <Textarea
                id="vision"
                value={draft.vision}
                onChange={(e) => update('vision', e.target.value)}
                placeholder={t('visionPlaceholder') || 'Where do you see this venture in 5 years?'}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="founding_date">{t('foundingDate') || 'Founding date'}</Label>
              <Input
                id="founding_date"
                type="date"
                value={draft.founding_date}
                onChange={(e) => update('founding_date', e.target.value)}
              />
            </div>
          </div>
        );

      case 'sector':
        return (
          <div className="space-y-6">
            <div>
              <Label className="mb-2 block">{t('sectorLabel') || 'Sector'}</Label>
              <div className="flex flex-wrap gap-2">
                {SECTEUR_OPTIONS.map((opt) => {
                  const active = draft.secteur.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update('secteur', toggleArrayValue(draft.secteur, opt.value))}
                      className={`px-4 py-2 rounded-full border-2 text-sm transition-colors ${
                        active
                          ? 'border-lightBlue bg-lightBlue text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {t(opt.labelKey) || opt.fallback}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label className="mb-2 block">{t('stageLabel') || 'Stage'}</Label>
              <div className="flex flex-wrap gap-2">
                {STAGE_OPTIONS.map((opt) => {
                  const active = draft.stage === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update('stage', active ? '' : opt.value)}
                      className={`px-4 py-2 rounded-full border-2 text-sm transition-colors ${
                        active
                          ? 'border-lightBlue bg-lightBlue text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {t(opt.labelKey) || opt.fallback}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'customers':
        return (
          <div className="space-y-6">
            <div>
              <Label className="mb-2 block">{t('customerTypesLabel') || 'Customer types'}</Label>
              <div className="flex flex-wrap gap-2">
                {CUSTOMER_TYPE_OPTIONS.map((opt) => {
                  const active = draft.type_of_customers.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        update('type_of_customers', toggleArrayValue(draft.type_of_customers, opt.value))
                      }
                      className={`px-4 py-2 rounded-full border-2 text-sm transition-colors ${
                        active
                          ? 'border-lightBlue bg-lightBlue text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label className="mb-2 block">{t('customerBaseLabel') || 'Customer base'}</Label>
              <div className="flex gap-2">
                <Input
                  value={customerBaseBuf}
                  onChange={(e) => setCustomerBaseBuf(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addChip('customer_base', customerBaseBuf);
                      setCustomerBaseBuf('');
                    }
                  }}
                  placeholder={t('customerBasePlaceholder') || 'e.g. Urban customers, then press Enter'}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    addChip('customer_base', customerBaseBuf);
                    setCustomerBaseBuf('');
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {draft.customer_base.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {draft.customer_base.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700"
                    >
                      {c}
                      <button
                        type="button"
                        onClick={() => removeChip('customer_base', c)}
                        className="hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label className="mb-2 block">{t('categoryBaseLabel') || 'Category'}</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_BASE_OPTIONS.map((opt) => {
                  const active = draft.category_base.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        update('category_base', toggleArrayValue(draft.category_base, opt.value))
                      }
                      className={`px-4 py-2 rounded-full border-2 text-sm transition-colors ${
                        active
                          ? 'border-lightBlue bg-lightBlue text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {t(opt.labelKey) || opt.fallback}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">{t('phone') || 'Phone'}</Label>
                <Input
                  id="phone"
                  value={draft.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+243..."
                />
              </div>
              <div>
                <Label htmlFor="email">{t('email') || 'Email'}</Label>
                <Input
                  id="email"
                  type="email"
                  value={draft.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="hello@yourcompany.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="full_address">{t('fullAddress') || 'Address'}</Label>
              <Input
                id="full_address"
                value={draft.full_address}
                onChange={(e) => update('full_address', e.target.value)}
                placeholder={t('fullAddressPlaceholder') || 'Kinshasa, DRC'}
              />
            </div>
            <div>
              <Label htmlFor="website">{t('website') || 'Website'}</Label>
              <Input
                id="website"
                type="url"
                value={draft.website}
                onChange={(e) => update('website', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label className="mb-2 block">{t('socialMedia') || 'Social media'}</Label>
              <div className="flex gap-2">
                <Input
                  value={socialBuf}
                  onChange={(e) => setSocialBuf(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addChip('social_Media', socialBuf);
                      setSocialBuf('');
                    }
                  }}
                  placeholder={t('socialMediaPlaceholder') || 'Paste a profile URL and press Enter'}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    addChip('social_Media', socialBuf);
                    setSocialBuf('');
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {draft.social_Media.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {draft.social_Media.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700 max-w-full truncate"
                    >
                      <span className="truncate max-w-[260px]">{s}</span>
                      <button
                        type="button"
                        onClick={() => removeChip('social_Media', s)}
                        className="hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-4">
            {draft.team.length === 0 && (
              <p className="text-sm text-gray-500">
                {t('teamEmptyHint') || 'No team members yet — add the founders, co-founders, or key teammates.'}
              </p>
            )}
            {draft.team.map((m, idx) => (
              <div key={idx} className="border rounded-lg p-4 bg-gray-50/60 space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeTeamMember(idx)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                  aria-label={t('removeTeamMember') || 'Remove'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div>
                  <Label>{t('teamMemberName') || 'Name'}</Label>
                  <Input
                    value={m.name}
                    onChange={(e) => updateTeamMember(idx, 'name', e.target.value)}
                    placeholder={t('teamMemberNamePlaceholder') || 'Full name'}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>{t('email') || 'Email'}</Label>
                    <Input
                      type="email"
                      value={m.email || ''}
                      onChange={(e) => updateTeamMember(idx, 'email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>{t('phone') || 'Phone'}</Label>
                    <Input
                      value={m.phone || ''}
                      onChange={(e) => updateTeamMember(idx, 'phone', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addTeamMember} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {t('addTeamMember') || 'Add team member'}
            </Button>
          </div>
        );

      case 'review':
        return <ReviewPanel draft={draft} />;

      default:
        return null;
    }
  };

  // ---------- Auth gate ----------
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lightGreen/20 to-lightBlue/20 flex">
        <div className="w-1/3 bg-gradient-to-b from-[#02093d] to-[#0a1854] text-white p-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-white rounded text-[#02093d] flex items-center justify-center font-bold">
                  B
                </div>
                <span className="text-2xl font-bold text-white">{t('BOMOKO FUND') || 'BOMOKO FUND'}</span>
              </div>
            </div>
            <div className="space-y-8">{renderSidebarContent()}</div>
          </div>
        </div>

        <div className="flex-1 p-8 bg-white flex items-center justify-center">
          <div className="max-w-md w-full text-center space-y-6">
            <h1 className="text-3xl font-bold text-dark">
              {t('signInToCreateVenture') || 'Sign in to create your venture'}
            </h1>
            <p className="text-gray-600">
              {t('signInToCreateVentureDesc') ||
                'You need to be signed in to create a new venture in Bomoko Fund.'}
            </p>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                size="large"
                width="100%"
                text="signin_with"
                useOneTap={false}
              />
            </div>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              {t('Go to Dashboard') || 'Go to Dashboard'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Wizard ----------
  const currentStepData = STEPS[currentStep];
  const stepTitle = t(currentStepData.titleKey) || currentStepData.titleFallback;
  const stepDesc = t(currentStepData.descKey) || currentStepData.descFallback;

  return (
    <div className="min-h-screen bg-gradient-to-br from-lightGreen/20 to-lightBlue/20 flex">
      {/* Sidebar */}
      <div className="w-1/3 bg-gradient-to-b from-[#02093d] to-[#0a1854] text-white p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-white rounded text-[#02093d] flex items-center justify-center font-bold">
                B
              </div>
              <span className="text-2xl font-bold text-white">{t('BOMOKO FUND') || 'BOMOKO FUND'}</span>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center space-x-2 mb-4">
              <button
                onClick={() => setSidebarView('funding')}
                className={`text-sm px-3 py-1 rounded-full transition-colors ${
                  sidebarView === 'funding'
                    ? 'bg-white text-[#02093d]'
                    : 'bg-white/10 text-gray-200 hover:bg-white/20'
                }`}
              >
                {t('Funding') || 'Funding'}
              </button>
              <button
                onClick={() => setSidebarView('benefits')}
                className={`text-sm px-3 py-1 rounded-full transition-colors ${
                  sidebarView === 'benefits'
                    ? 'bg-white text-[#02093d]'
                    : 'bg-white/10 text-gray-200 hover:bg-white/20'
                }`}
              >
                {t('Benefits') || 'Benefits'}
              </button>
            </div>

            {renderSidebarContent()}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 bg-yellow text-dark rounded-full text-sm font-medium mb-4">
              {t('newVenture') || 'New Venture'}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-dark">
              {t('Create') || 'Create'}{' '}
              <span className="text-lightBlue">{t('Venture') || 'Venture'}</span>
            </h1>
            {currentUser && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-3">
                {currentUser.profile ? (
                  <img
                    src={currentUser.profile}
                    alt={t('profile') || 'Profile'}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span>
                  {t('signedInAs') || 'Signed in as'} {currentUser.name || currentUser.email}
                </span>
              </div>
            )}
          </div>

          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-lightBlue rounded-full flex items-center justify-center text-white font-bold">
                {currentStep + 1}
              </div>
              <h2 className="text-2xl font-bold text-dark">{stepTitle}</h2>
            </div>
            <p className="text-gray-600 mb-6">{stepDesc}</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center mt-8">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 0 || isCreating}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t('Back') || 'Back'}</span>
            </Button>

            <div className="flex space-x-2">
              {STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-lightBlue'
                      : index < currentStep
                      ? 'bg-dark'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={!isStepComplete(currentStepData.id) || isCreating}
              className="flex items-center space-x-2 bg-lightBlue hover:bg-lightBlue/90 text-white"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('Creating...') || 'Creating...'}</span>
                </>
              ) : (
                <>
                  <span>
                    {currentStep === STEPS.length - 1
                      ? t('createVenture') || 'Create Venture'
                      : t('Continue') || 'Continue'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
            <div className="text-center">
              {resultModalType === 'success' ? (
                <>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    {t('Success!') || 'Success!'}
                  </h3>
                  <p className="text-gray-600 mb-6">{resultModalMessage}</p>
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => navigate('/dashboard')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      {t('Go to Dashboard') || 'Go to Dashboard'}
                    </Button>
                    <Button
                      onClick={() => setShowResultModal(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      {t('Close') || 'Close'}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-red-800 mb-2">
                    {t('Error!') || 'Error!'}
                  </h3>
                  <p className="text-gray-600 mb-6">{resultModalMessage}</p>
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => setShowResultModal(false)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      {t('Try Again') || 'Try Again'}
                    </Button>
                    <Button
                      onClick={() => navigate('/dashboard')}
                      variant="outline"
                      className="flex-1"
                    >
                      {t('Go to Dashboard') || 'Go to Dashboard'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReviewPanel: React.FC<{ draft: EntrepriseDraft }> = ({ draft }) => {
  const { t } = useTranslation();
  const rows = useMemo(
    () => [
      { label: t('companyName') || 'Company name', value: draft.company_name },
      { label: t('miniBio') || 'Short description', value: draft.mini_bio },
      { label: t('descriptionLabel') || 'Description', value: draft.description },
      { label: t('mission') || 'Mission', value: draft.mission },
      { label: t('vision') || 'Vision', value: draft.vision },
      { label: t('foundingDate') || 'Founding date', value: draft.founding_date },
      { label: t('sectorLabel') || 'Sector', value: draft.secteur.join(', ') },
      { label: t('stageLabel') || 'Stage', value: draft.stage },
      { label: t('customerTypesLabel') || 'Customer types', value: draft.type_of_customers.join(', ') },
      { label: t('customerBaseLabel') || 'Customer base', value: draft.customer_base.join(', ') },
      { label: t('categoryBaseLabel') || 'Category', value: draft.category_base.join(', ') },
      { label: t('phone') || 'Phone', value: draft.phone },
      { label: t('email') || 'Email', value: draft.email },
      { label: t('fullAddress') || 'Address', value: draft.full_address },
      { label: t('website') || 'Website', value: draft.website },
      { label: t('socialMedia') || 'Social media', value: draft.social_Media.join(', ') },
      {
        label: t('team') || 'Team',
        value: draft.team
          .map((m) => `${m.name}${m.email ? ` <${m.email}>` : ''}${m.phone ? ` (${m.phone})` : ''}`)
          .join(' · '),
      },
    ],
    [draft, t]
  );

  return (
    <div className="border rounded-lg divide-y">
      {rows.map((row, i) => (
        <div key={i} className="flex items-start gap-4 px-4 py-3">
          <div className="w-40 shrink-0 text-sm font-medium text-gray-600">{row.label}</div>
          <div className="flex-1 text-sm text-gray-900 break-words">
            {row.value && row.value.toString().trim().length > 0 ? row.value : <span className="text-gray-400">—</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VentureWizard;
