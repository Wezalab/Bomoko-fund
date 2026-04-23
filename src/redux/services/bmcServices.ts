import splitApi from './api';
import { BusinessModelCanvas, CreateBMCRequest, UpdateBMCRequest } from '@/types/bmc';

// baseUrl already ends with `/api`, so endpoints must NOT repeat `/api`.
export const bmcService = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserCanvases: builder.query<BusinessModelCanvas[], void>({
      query: () => '/bmc',
    }),
    getCanvas: builder.query<BusinessModelCanvas, string>({
      query: (id) => `/bmc/${id}`,
    }),
    createCanvas: builder.mutation<BusinessModelCanvas, CreateBMCRequest>({
      query: (data) => ({
        url: '/bmc',
        method: 'POST',
        body: data,
      }),
    }),
    updateCanvas: builder.mutation<BusinessModelCanvas, UpdateBMCRequest>({
      query: ({ id, ...data }) => ({
        url: `/bmc/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteCanvas: builder.mutation<void, string>({
      query: (id) => ({
        url: `/bmc/${id}`,
        method: 'DELETE',
      }),
    }),
    duplicateCanvas: builder.mutation<BusinessModelCanvas, string>({
      query: (id) => ({
        url: `/bmc/${id}/duplicate`,
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
