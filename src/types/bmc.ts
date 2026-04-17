export type BMCBlockKey =
  | 'customerSegments'
  | 'valuePropositions'
  | 'channels'
  | 'customerRelationships'
  | 'revenueStreams'
  | 'keyResources'
  | 'keyActivities'
  | 'keyPartnerships'
  | 'costStructure';

export interface BMCBlock {
  id: string;
  key: BMCBlockKey;
  title: string;
  content: string;
  aiGenerated: boolean;
}

export type BMCStatus = 'draft' | 'completed';

export interface StrategySuggestion {
  id: string;
  category: 'growth' | 'monetization' | 'risk';
  title: string;
  description: string;
}

export interface BusinessModelCanvas {
  _id: string;
  userId: string;
  title: string;
  description: string;
  blocks: BMCBlock[];
  strategySuggestions: StrategySuggestion[];
  status: BMCStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BMCWizardAnswers {
  customerSegments: string;
  valuePropositions: string;
  channels: string;
  customerRelationships: string;
  revenueStreams: string;
  keyResources: string;
  keyActivities: string;
  keyPartnerships: string;
  costStructure: string;
  businessName?: string;
  industry?: string;
}

export interface CreateBMCRequest {
  title: string;
  description?: string;
  blocks: BMCBlock[];
  strategySuggestions?: StrategySuggestion[];
  status?: BMCStatus;
}

export interface UpdateBMCRequest {
  id: string;
  title?: string;
  description?: string;
  blocks?: BMCBlock[];
  strategySuggestions?: StrategySuggestion[];
  status?: BMCStatus;
}

export const BMC_BLOCK_ORDER: BMCBlockKey[] = [
  'customerSegments',
  'valuePropositions',
  'channels',
  'customerRelationships',
  'revenueStreams',
  'keyResources',
  'keyActivities',
  'keyPartnerships',
  'costStructure',
];

export const BMC_BLOCK_LABELS: Record<BMCBlockKey, { fr: string; en: string; number: number }> = {
  customerSegments:      { fr: 'Segments de clientèle',    en: 'Customer Segments',      number: 1 },
  valuePropositions:     { fr: 'Propositions de valeur',   en: 'Value Propositions',     number: 2 },
  channels:              { fr: 'Canaux',                   en: 'Channels',               number: 3 },
  customerRelationships: { fr: 'Relations clients',        en: 'Customer Relationships', number: 4 },
  revenueStreams:        { fr: 'Sources de revenus',       en: 'Revenue Streams',        number: 5 },
  keyResources:          { fr: 'Ressources clés',          en: 'Key Resources',          number: 6 },
  keyActivities:         { fr: 'Activités clés',           en: 'Key Activities',         number: 7 },
  keyPartnerships:       { fr: 'Partenaires clés',         en: 'Key Partnerships',       number: 8 },
  costStructure:         { fr: 'Structure de coûts',       en: 'Cost Structure',         number: 9 },
};
