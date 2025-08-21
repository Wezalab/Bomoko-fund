import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base URL for business plan API
const BASE_URL = 'http://localhost:7008/api/business-plans';

// Types
export interface BusinessPlanWizardData {
  established_business: 'yes' | 'no';
  business_established_date?: { month: string; year: string };
  business_planned_date?: { month: string; year: string } | 'unknown';
  plan_type: 'fullBusinessPlan' | 'basicBusinessPlan';
  company_structure: string;
  staff: 'yes' | 'no';
  staff_future?: 'yes' | 'no';
  business_location: string;
  business_scope: 'localArea' | 'national' | 'international';
  products_yn: 'yes' | 'no';
  product_grouping?: string[];
  services_yn: 'yes' | 'no';
  service_grouping?: string[];
  proprietary_IP: 'yes' | 'no';
  financial_model_required_yn: 'yes' | 'no';
  forecast_start_date?: { month: string; year: string };
  financial_year_end?: string;
  forecast_years?: '1' | '2' | '3' | '4' | '5';
  inventory_management?: 'yes' | 'no';
  finance_required: 'yes' | 'no';
  exit_planned: 'yes' | 'no';
  tone: 'Casual' | 'Professional' | 'Formal';
}

export interface CreateBusinessPlanRequest {
  ventureId: string;
  wizardData: BusinessPlanWizardData;
  title: string;
  language: string;
  currency: string;
  generateInitialContent?: boolean;
}

export interface BusinessPlanSubsection {
  id: string;
  title: string;
  description?: string;
  order: number;
  step: number;
  type: 'text' | 'rich-text' | 'table' | 'chart' | 'form' | 'file-upload';
  content: string;
  isRequired: boolean;
  isCompleted: boolean;
  estimatedTime: string;
  aiGenerated?: boolean;
  aiSuggestions?: string[];
}

export interface BusinessPlanSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  category: 'initial' | 'business' | 'market' | 'strategy' | 'operations' | 'financial' | 'legal' | 'appendix';
  isRequired: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  estimatedTime: string;
  subsections: BusinessPlanSubsection[];
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
}

export interface BusinessPlan {
  _id: string;
  ventureId: string;
  userId: string;
  metadata: {
    title: string;
    version: string;
    status: 'draft' | 'in-progress' | 'completed' | 'published';
    language: string;
    currency: string;
    tone: string;
    createdAt: string;
    updatedAt: string;
  };
  initialSetup: BusinessPlanWizardData;
  sections: BusinessPlanSection[];
  progress: {
    totalSections: number;
    completedSections: number;
    completionPercentage: number;
    lastModifiedSection: string;
  };
}

export interface GenerateContentRequest {
  sectionId: string;
  subsectionId?: string;
  contentType?: 'rich-text' | 'text' | 'table';
  tone?: 'casual' | 'professional' | 'formal';
  contentLength?: 'court' | 'moyen' | 'long';
  specificPrompt?: string;
}

export interface UpdateContentRequest {
  content: string;
  structuredData?: any;
}

export interface BusinessPlanSuggestion {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: 'content' | 'structure' | 'data';
  implementationTime: string;
}

export interface BusinessPlanAnalytics {
  progress: {
    totalSections: number;
    completedSections: number;
    completionPercentage: number;
    subsectionCompletionPercentage: number;
  };
  aiUsage: {
    aiGeneratedSections: number;
    adaptedSections: number;
    aiUsagePercentage: number;
  };
  structure: {
    sectionsByCategory: Record<string, number>;
    estimatedTotalTime: string;
    averageTimePerSection: string;
  };
}

// RTK Query API
export const businessPlanApi = createApi({
  reducerPath: 'businessPlanApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get token from Redux state or localStorage
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['BusinessPlan', 'BusinessPlanSection', 'BusinessPlanSubsection'],
  endpoints: (builder) => ({
    // 1. Get available templates
    getBusinessPlanTemplates: builder.query<any, { industry?: string; country?: string; businessType?: string }>({
      query: ({ industry, country, businessType }) => {
        const params = new URLSearchParams();
        if (industry) params.append('industry', industry);
        if (country) params.append('country', country);
        if (businessType) params.append('businessType', businessType);
        return `/templates?${params.toString()}`;
      },
    }),

    // 2. Create business plan
    createBusinessPlan: builder.mutation<{ success: boolean; businessPlan: BusinessPlan }, CreateBusinessPlanRequest>({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['BusinessPlan'],
    }),

    // 3. Get business plan by ID
    getBusinessPlan: builder.query<{ success: boolean; businessPlan: BusinessPlan }, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'BusinessPlan', id }],
    }),

    // 4. Adapt business plan structure with AI
    adaptBusinessPlanStructure: builder.mutation<any, { id: string; forceRegeneration?: boolean }>({
      query: ({ id, forceRegeneration = false }) => ({
        url: `/${id}/adapt-structure`,
        method: 'POST',
        body: { forceRegeneration },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'BusinessPlan', id }],
    }),

    // 5. Generate content for a section
    generateSectionContent: builder.mutation<any, { id: string } & GenerateContentRequest>({
      query: ({ id, ...body }) => ({
        url: `/${id}/generate-content`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'BusinessPlan', id }],
    }),

    // 6. Update subsection content
    updateSubsectionContent: builder.mutation<any, { 
      businessPlanId: string; 
      sectionId: string; 
      subsectionId: string; 
      data: UpdateContentRequest 
    }>({
      query: ({ businessPlanId, sectionId, subsectionId, data }) => ({
        url: `/${businessPlanId}/sections/${sectionId}/subsections/${subsectionId}/content`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { businessPlanId, sectionId }) => [
        { type: 'BusinessPlan', id: businessPlanId },
        { type: 'BusinessPlanSection', id: sectionId },
      ],
    }),

    // 7. Get improvement suggestions
    getBusinessPlanSuggestions: builder.mutation<{ 
      success: boolean; 
      suggestions: BusinessPlanSuggestion[];
      analysis: any;
    }, { 
      id: string; 
      sectionId?: string; 
      currentContent?: string; 
      improvementAreas?: string[] 
    }>({
      query: ({ id, ...body }) => ({
        url: `/${id}/suggestions`,
        method: 'POST',
        body,
      }),
    }),

    // 8. Enhance section with AI
    enhanceSection: builder.mutation<any, { 
      id: string; 
      sectionId: string; 
      enhancementType?: string; 
      specificInstructions?: string 
    }>({
      query: ({ id, ...body }) => ({
        url: `/${id}/enhance-section`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'BusinessPlan', id }],
    }),

    // 9. Generate specialized market analysis
    generateMarketAnalysis: builder.mutation<any, { 
      id: string; 
      targetMarket?: string; 
      competitors?: string[]; 
      focusAreas?: string[] 
    }>({
      query: ({ id, ...body }) => ({
        url: `/${id}/generate-market-analysis`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'BusinessPlan', id }],
    }),

    // 10. Add custom section
    addBusinessPlanSection: builder.mutation<any, { 
      id: string; 
      section: Omit<BusinessPlanSection, 'subsections'> & { subsections: Omit<BusinessPlanSubsection, 'content' | 'isCompleted'>[] }
    }>({
      query: ({ id, section }) => ({
        url: `/${id}/sections`,
        method: 'POST',
        body: section,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'BusinessPlan', id }],
    }),

    // 11. Reorder sections
    reorderBusinessPlanSections: builder.mutation<any, { id: string; newOrder: string[] }>({
      query: ({ id, newOrder }) => ({
        url: `/${id}/sections/reorder`,
        method: 'POST',
        body: { newOrder },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'BusinessPlan', id }],
    }),

    // 12. Add subsection
    addSubsection: builder.mutation<any, { 
      businessPlanId: string; 
      sectionId: string; 
      subsection: Omit<BusinessPlanSubsection, 'content' | 'isCompleted'>
    }>({
      query: ({ businessPlanId, sectionId, subsection }) => ({
        url: `/${businessPlanId}/sections/${sectionId}/subsections`,
        method: 'POST',
        body: subsection,
      }),
      invalidatesTags: (result, error, { businessPlanId, sectionId }) => [
        { type: 'BusinessPlan', id: businessPlanId },
        { type: 'BusinessPlanSection', id: sectionId },
      ],
    }),

    // 13. Get business plan analytics
    getBusinessPlanAnalytics: builder.query<{ success: boolean; analytics: BusinessPlanAnalytics }, string>({
      query: (id) => `/${id}/analytics`,
    }),

    // 14. Get user's business plans
    getUserBusinessPlans: builder.query<any, { 
      userId: string; 
      page?: number; 
      limit?: number; 
      status?: string; 
      sortBy?: string; 
      sortOrder?: 'asc' | 'desc' 
    }>({
      query: ({ userId, page = 1, limit = 10, status, sortBy = 'updatedAt', sortOrder = 'desc' }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy,
          sortOrder,
        });
        if (status) params.append('status', status);
        return `/user/${userId}?${params.toString()}`;
      },
      providesTags: ['BusinessPlan'],
    }),

    // 15. Get business plans by venture
    getVentureBusinessPlans: builder.query<any, string>({
      query: (ventureId) => `/venture/${ventureId}`,
      providesTags: ['BusinessPlan'],
    }),

    // 16. Update business plan metadata
    updateBusinessPlan: builder.mutation<any, { id: string; updates: Partial<BusinessPlan['metadata']> }>({
      query: ({ id, updates }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'BusinessPlan', id }],
    }),

    // 17. Delete business plan
    deleteBusinessPlan: builder.mutation<any, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BusinessPlan'],
    }),
  }),
});

// Export hooks
export const {
  useGetBusinessPlanTemplatesQuery,
  useCreateBusinessPlanMutation,
  useGetBusinessPlanQuery,
  useAdaptBusinessPlanStructureMutation,
  useGenerateSectionContentMutation,
  useUpdateSubsectionContentMutation,
  useGetBusinessPlanSuggestionsMutation,
  useEnhanceSectionMutation,
  useGenerateMarketAnalysisMutation,
  useAddBusinessPlanSectionMutation,
  useReorderBusinessPlanSectionsMutation,
  useAddSubsectionMutation,
  useGetBusinessPlanAnalyticsQuery,
  useGetUserBusinessPlansQuery,
  useGetVentureBusinessPlansQuery,
  useUpdateBusinessPlanMutation,
  useDeleteBusinessPlanMutation,
} = businessPlanApi;
