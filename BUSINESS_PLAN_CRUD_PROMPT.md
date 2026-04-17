# PROMPT LLM : Création du Système CRUD Business Plan Adaptatif

## CONTEXTE
Créer un système CRUD complet pour un business plan avec MongoDB/Express qui s'adapte dynamiquement au modèle d'affaires spécifique. Le système doit être flexible et permettre à l'IA d'adapter automatiquement les chapitres et sections selon les besoins du business.

## DONNÉES D'ENTRÉE DU BUSINESS PLAN WIZARD

### Initial Setup (Configuration initiale)
```typescript
interface BusinessPlanWizardData {
  // Q1-Q3: Business Basics
  established_business: 'yes' | 'no';
  business_established_date?: { month: string, year: string };
  business_planned_date?: { month: string, year: string } | 'unknown';
  
  // Q4-Q5: Plan Type & Legal Structure
  plan_type: 'fullBusinessPlan' | 'basicBusinessPlan';
  company_structure: 'soleProprietorship' | 'partnership' | 'llp' | 'trust' | 'corporation' | 'nonprofit';
  
  // Q6-Q7: Staffing
  staff: 'yes' | 'no';
  staff_future?: 'yes' | 'no';
  
  // Q8-Q9: Location & Scope
  business_location: string;
  business_scope: 'localArea' | 'national' | 'international';
  
  // Q10-Q11: Products & Product Grouping
  products_yn: 'yes' | 'no';
  product_grouping?: string[]; // AI-generated product categories
  
  // Q12-Q13: Services & Service Grouping  
  services_yn: 'yes' | 'no';
  service_grouping?: string[]; // AI-generated service categories
  
  // Q14: Intellectual Property
  proprietary_IP: 'yes' | 'no';
  
  // Q15-Q19: Financial Projections (Conditional)
  financial_model_required_yn: 'yes' | 'no';
  forecast_start_date?: { month: string, year: string };
  financial_year_end?: string; // Month name
  forecast_years?: '1' | '2' | '3' | '4' | '5';
  inventory_management?: 'yes' | 'no';
  
  // Q20-Q22: Finance & Exit
  finance_required: 'yes' | 'no';
  exit_planned: 'yes' | 'no';
  tone: 'Casual' | 'Professional' | 'Formal';
}
```

### Venture Data (Données du venture depuis l'API)
```typescript
interface VentureData {
  _id: string;
  businessName: string;
  businessDescription: string;
  businessTypes: string[];
  country: string;
  purpose: 'validate-idea' | 'launch-startup' | 'drive-growth';
  userName: string;
  userRole: string;
  language: string;
  currency: string;
}
```

## STRUCTURE DU BUSINESS PLAN À CRÉER

### Modèle MongoDB
```typescript
interface BusinessPlan {
  _id: ObjectId;
  ventureId: ObjectId; // Référence au venture
  userId: ObjectId;
  
  // Métadonnées
  metadata: {
    title: string;
    version: string;
    createdAt: Date;
    updatedAt: Date;
    status: 'draft' | 'in-progress' | 'completed' | 'published';
    language: string;
    currency: string;
    tone: 'casual' | 'professional' | 'formal';
  };
  
  // Configuration initiale (du wizard)
  initialSetup: BusinessPlanWizardData;
  
  // Sections adaptatives générées par IA
  sections: BusinessPlanSection[];
  
  // Configuration financière
  financialConfig?: {
    forecastStartDate: Date;
    financialYearEnd: string;
    forecastYears: number;
    includeInventoryManagement: boolean;
    includeProjections: boolean;
  };
  
  // Métriques de progression
  progress: {
    totalSections: number;
    completedSections: number;
    completionPercentage: number;
    lastModifiedSection: string;
  };
}

interface BusinessPlanSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  category: 'initial' | 'business' | 'market' | 'strategy' | 'operations' | 'financial' | 'legal' | 'appendix';
  isRequired: boolean;
  isCompleted: boolean;
  estimatedTime: string; // "5 Min"
  
  // Contenu adaptatif
  subsections: BusinessPlanSubsection[];
  
  // Configuration IA
  aiGenerated: boolean;
  aiPromptUsed?: string;
  adaptedForBusiness: boolean;
}

interface BusinessPlanSubsection {
  id: string;
  title: string;
  description?: string;
  order: number;
  type: 'text' | 'rich-text' | 'table' | 'chart' | 'form' | 'file-upload';
  
  // Contenu
  content: string; // HTML/Rich text content
  
  // Données structurées (pour tableaux, graphiques)
  structuredData?: any;
  
  // Configuration
  isRequired: boolean;
  isCompleted: boolean;
  aiGenerated: boolean;
  
  // Suggestions IA
  aiSuggestions?: string[];
  enhancementPrompts?: string[];
}
```

## SECTIONS ADAPTATIVES PAR TYPE DE BUSINESS

### Base Template (Toutes les entreprises)
```typescript
const baseSections = [
  {
    id: 'cover',
    title: 'Page de couverture',
    category: 'initial',
    required: true,
    subsections: ['title', 'company-info', 'date', 'confidentiality']
  },
  {
    id: 'executive-summary',
    title: 'Résumé exécutif',
    category: 'initial',
    required: true,
    subsections: ['business-overview', 'market-opportunity', 'competitive-advantage', 'financial-highlights', 'funding-request']
  },
  {
    id: 'business-description',
    title: 'Description de l\'entreprise',
    category: 'business',
    required: true,
    subsections: ['overview', 'mission-vision-values', 'history', 'legal-structure', 'location']
  }
];
```

### Adaptations par Industry/Business Type
```typescript
// Pour un Restaurant
const restaurantAdaptations = {
  additionalSections: [
    {
      id: 'menu-development',
      title: 'Développement du menu',
      category: 'operations',
      subsections: ['cuisine-concept', 'menu-items', 'pricing-strategy', 'seasonal-variations']
    },
    {
      id: 'kitchen-operations',
      title: 'Opérations de cuisine',
      category: 'operations',
      subsections: ['equipment-needs', 'supplier-relationships', 'food-safety', 'inventory-management']
    }
  ],
  modifiedSections: {
    'market-analysis': {
      subsections: ['local-dining-market', 'target-demographics', 'location-analysis', 'foot-traffic-patterns']
    }
  }
};

// Pour une Tech Startup
const techStartupAdaptations = {
  additionalSections: [
    {
      id: 'product-development',
      title: 'Développement produit',
      category: 'strategy',
      subsections: ['technical-architecture', 'development-roadmap', 'mvp-features', 'scalability-plan']
    },
    {
      id: 'intellectual-property',
      title: 'Propriété intellectuelle',
      category: 'legal',
      subsections: ['patents-trademarks', 'trade-secrets', 'licensing-strategy', 'ip-protection']
    }
  ],
  modifiedSections: {
    'financial-projections': {
      subsections: ['development-costs', 'saas-metrics', 'user-acquisition-costs', 'revenue-models']
    }
  }
};
```

## LOGIQUE D'ADAPTATION IA

### Critères d'adaptation
```typescript
interface AdaptationCriteria {
  // Du Venture
  businessTypes: string[];
  businessDescription: string;
  industry: string;
  
  // Du Wizard
  hasProducts: boolean;
  hasServices: boolean;
  productCategories: string[];
  serviceCategories: string[];
  hasStaff: boolean;
  planType: 'full' | 'basic';
  businessScope: 'local' | 'national' | 'international';
  needsFinancing: boolean;
  hasIP: boolean;
  
  // Contexte géographique
  country: string;
  market: 'emerging' | 'developed';
}
```

### Prompts d'adaptation IA
```typescript
const adaptationPrompts = {
  sectionGeneration: `
    Basé sur les critères suivants, génère les sections de business plan optimales :
    - Type d'entreprise: {businessTypes}
    - Description: {businessDescription} 
    - Secteur: {industry}
    - Produits: {productCategories}
    - Services: {serviceCategories}
    - Portée: {businessScope}
    - Pays: {country}
    
    Retourne un JSON avec les sections adaptées selon le template suivant:
    {sectionTemplate}
  `,
  
  contentGeneration: `
    Génère le contenu pour la section "{sectionTitle}" d'un business plan pour:
    - Entreprise: {businessName}
    - Description: {businessDescription}
    - Secteur: {industry}
    - Contexte: {context}
    
    Le contenu doit être:
    - Professionnel et adapté au ton: {tone}
    - Spécifique au marché {country}
    - Pertinent pour {businessTypes}
    - En français
    - Format HTML structuré
  `,
  
  enhancementSuggestions: `
    Propose 3-5 améliorations pour cette section:
    Section: {sectionTitle}
    Contenu actuel: {currentContent}
    
    Les suggestions doivent être:
    - Spécifiques et actionables
    - Adaptées au business: {businessDescription}
    - Focalisées sur l'amélioration de la qualité du plan
  `
};
```

## APIS CRUD À CRÉER

### Routes Express
```typescript
// Business Plan CRUD
POST   /api/business-plans              // Créer un nouveau business plan
GET    /api/business-plans/:id          // Récupérer un business plan
PUT    /api/business-plans/:id          // Mettre à jour un business plan
DELETE /api/business-plans/:id          // Supprimer un business plan
GET    /api/business-plans/user/:userId // Récupérer tous les plans d'un utilisateur
GET    /api/business-plans/venture/:ventureId // Plans pour un venture spécifique

// Sections CRUD
POST   /api/business-plans/:id/sections     // Ajouter une section
PUT    /api/business-plans/:id/sections/:sectionId // Mettre à jour une section
DELETE /api/business-plans/:id/sections/:sectionId // Supprimer une section
POST   /api/business-plans/:id/sections/:sectionId/reorder // Réorganiser les sections

// Subsections CRUD
POST   /api/business-plans/:id/sections/:sectionId/subsections // Ajouter une subsection
PUT    /api/business-plans/:id/sections/:sectionId/subsections/:subId // Mettre à jour
DELETE /api/business-plans/:id/sections/:sectionId/subsections/:subId // Supprimer

// AI Enhancement
POST   /api/business-plans/:id/generate-content // Générer du contenu IA
POST   /api/business-plans/:id/adapt-structure  // Adapter la structure avec IA
POST   /api/business-plans/:id/enhance-section  // Améliorer une section avec IA
POST   /api/business-plans/:id/suggestions      // Obtenir des suggestions d'amélioration

// Export & Templates
GET    /api/business-plans/:id/export/pdf      // Exporter en PDF
GET    /api/business-plans/:id/export/docx     // Exporter en Word
POST   /api/business-plans/from-template       // Créer depuis un template
GET    /api/business-plans/templates           // Récupérer les templates disponibles
```

### Services IA intégrés
```typescript
// Service d'adaptation automatique
POST   /api/ai/adapt-business-plan
{
  ventureData: VentureData,
  wizardData: BusinessPlanWizardData,
  preferences: {
    includeFinancials: boolean,
    detailLevel: 'basic' | 'detailed' | 'comprehensive',
    focusAreas: string[]
  }
}

// Service de génération de contenu
POST   /api/ai/generate-section-content
{
  businessPlanId: string,
  sectionId: string,
  context: BusinessContext,
  tone: string,
  language: string
}

// Service de suggestions d'amélioration
POST   /api/ai/enhancement-suggestions
{
  businessPlanId: string,
  sectionId?: string,
  currentContent: string,
  improvementAreas: string[]
}
```

## CONTRAINTES ET EXIGENCES

### Flexibilité structurelle
1. **Sections modulaires** : Possibilité d'ajouter/supprimer des sections selon le business
2. **Contenu adaptatif** : L'IA doit pouvoir modifier les subsections selon les besoins
3. **Templates dynamiques** : Générer des templates spécifiques par industrie
4. **Versioning** : Historique des modifications et versions du plan

### Intégration IA
1. **Auto-adaptation** : Proposer automatiquement des sections selon le business
2. **Génération de contenu** : Créer du contenu initial basé sur les données du wizard
3. **Suggestions continues** : Proposer des améliorations au fur et à mesure
4. **Cohérence globale** : Maintenir la cohérence entre toutes les sections

### Performance et scalabilité
1. **Lazy loading** : Charger les sections à la demande
2. **Mise en cache** : Cache intelligent pour le contenu généré par IA
3. **Optimisation** : Structure MongoDB optimisée pour les requêtes fréquentes
4. **Backup** : Sauvegarde automatique des modifications

### Localisation et contexte
1. **Multi-langue** : Support français/anglais avec templates adaptés
2. **Contexte géographique** : Adaptation aux spécificités du marché (RDC/Afrique)
3. **Conformité légale** : Sections adaptées au cadre juridique local
4. **Devises et métriques** : Support des devises et unités locales

## INSTRUCTIONS POUR LE LLM

**Génère le code complet incluant :**

1. **Modèles MongoDB/Mongoose** avec toute la structure définie
2. **Routes Express** avec toutes les opérations CRUD
3. **Contrôleurs** avec logique métier complète
4. **Services IA** pour l'adaptation et génération de contenu
5. **Middleware** pour validation, authentification, etc.
6. **Utils** pour la gestion des templates et adaptations
7. **Types TypeScript** pour toutes les interfaces
8. **Tests unitaires** pour les fonctionnalités principales

**Le code doit être :**
- Production-ready avec gestion d'erreurs complète
- Optimisé pour les performances
- Documenté avec JSDoc
- Utiliser les best practices Node.js/Express/MongoDB
- Inclure la validation des données avec Joi/Zod
- Intégrer les services IA existants (groqService)
- Compatible avec l'architecture existante du projet

**Attention particulière à :**
- L'adaptation dynamique des structures selon le type de business
- L'intégration fluide avec les données du BusinessPlanWizard existant
- La cohérence avec les données des ventures de l'API
- La flexibilité pour ajouter de nouveaux types de business à l'avenir
