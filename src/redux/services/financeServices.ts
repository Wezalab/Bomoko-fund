import splitApi from './api';
import {
  FinancialSheet,
  CreateFinanceSheetRequest,
  UpdateFinanceSheetRequest,
} from '@/types/finance';

export const financeService = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /api/finance?ventureId=<id>
     *  Returns null when the backend responds 404 (route not yet deployed)
     *  so the UI stays functional in "create mode". */
    getFinanceSheet: builder.query<FinancialSheet | null, string>({
      queryFn: async (ventureId, _api, _extra, baseQuery) => {
        const result = await baseQuery(`/finance?ventureId=${ventureId}`);
        if (result.error) {
          const status = (result.error as any)?.status;
          // 404 = endpoint not implemented yet OR no sheet exists → treat as empty
          if (status === 404) return { data: null };
          return { error: result.error };
        }
        const raw: any = result.data;
        if (!raw) return { data: null };
        if (Array.isArray(raw)) return { data: raw[0] ?? null };
        if (raw?.sheet) return { data: raw.sheet };
        if (raw?.data) return { data: raw.data };
        return { data: raw };
      },
    }),

    /** POST /api/finance */
    createFinanceSheet: builder.mutation<FinancialSheet, CreateFinanceSheetRequest>({
      query: (data) => ({
        url: '/finance',
        method: 'POST',
        body: data,
      }),
    }),

    /** PUT /api/finance/:id */
    updateFinanceSheet: builder.mutation<FinancialSheet, UpdateFinanceSheetRequest>({
      query: ({ id, ...data }) => ({
        url: `/finance/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    /** DELETE /api/finance/:id */
    deleteFinanceSheet: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/finance/${id}`,
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
