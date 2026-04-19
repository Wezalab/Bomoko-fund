import splitApi from './api';
import {
  FinancialSheet,
  CreateFinanceSheetRequest,
  UpdateFinanceSheetRequest,
} from '@/types/finance';

export const financeService = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /api/finance?ventureId=<id> */
    getFinanceSheet: builder.query<FinancialSheet | null, string>({
      query: (ventureId) => `/api/finance?ventureId=${ventureId}`,
      transformResponse: (response: any) => {
        if (!response) return null;
        if (Array.isArray(response)) return response[0] ?? null;
        if (response?.sheet) return response.sheet;
        if (response?.data) return response.data;
        return response;
      },
    }),

    /** POST /api/finance */
    createFinanceSheet: builder.mutation<FinancialSheet, CreateFinanceSheetRequest>({
      query: (data) => ({
        url: '/api/finance',
        method: 'POST',
        body: data,
      }),
    }),

    /** PUT /api/finance/:id */
    updateFinanceSheet: builder.mutation<FinancialSheet, UpdateFinanceSheetRequest>({
      query: ({ id, ...data }) => ({
        url: `/api/finance/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    /** DELETE /api/finance/:id */
    deleteFinanceSheet: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/finance/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetFinanceSheetQuery,
  useCreateFinanceSheetMutation,
  useUpdateFinanceSheetMutation,
  useDeleteFinanceSheetMutation,
} = financeService;
