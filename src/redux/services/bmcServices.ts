import splitApi from './api';
import { BusinessModelCanvas, CreateBMCRequest, UpdateBMCRequest } from '@/types/bmc';

export const bmcService = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserCanvases: builder.query<BusinessModelCanvas[], void>({
      query: () => '/api/bmc',
    }),
    getCanvas: builder.query<BusinessModelCanvas, string>({
      query: (id) => `/api/bmc/${id}`,
    }),
    createCanvas: builder.mutation<BusinessModelCanvas, CreateBMCRequest>({
      query: (data) => ({
        url: '/api/bmc',
        method: 'POST',
        body: data,
      }),
    }),
    updateCanvas: builder.mutation<BusinessModelCanvas, UpdateBMCRequest>({
      query: ({ id, ...data }) => ({
        url: `/api/bmc/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteCanvas: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/bmc/${id}`,
        method: 'DELETE',
      }),
    }),
    duplicateCanvas: builder.mutation<BusinessModelCanvas, string>({
      query: (id) => ({
        url: `/api/bmc/${id}/duplicate`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetUserCanvasesQuery,
  useGetCanvasQuery,
  useCreateCanvasMutation,
  useUpdateCanvasMutation,
  useDeleteCanvasMutation,
  useDuplicateCanvasMutation,
} = bmcService;
