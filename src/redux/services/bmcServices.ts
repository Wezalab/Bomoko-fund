import splitApi from './api';
import { BusinessModelCanvas, CreateBMCRequest, UpdateBMCRequest } from '@/types/bmc';

/**
 * Normalize backend response shapes for BMC payloads.
 *
 * The backend returns either:
 *  - a bare array / object
 *  - { message, data: [...] | {...} }
 *  - { message, bmcs: [...] } / { message, bmc: {...} }
 * Consumers in the UI assume an array (for list endpoints) or a canvas
 * object (for single-doc endpoints), so we unwrap once here instead of
 * forcing every component to handle every shape.
 */
const unwrapList = (response: any): BusinessModelCanvas[] => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.bmcs)) return response.bmcs;
  if (Array.isArray(response?.canvases)) return response.canvases;
  return [];
};

const unwrapOne = (response: any): BusinessModelCanvas =>
  response?.data ?? response?.bmc ?? response?.canvas ?? response;

// baseUrl already ends with `/api`, so endpoints must NOT repeat `/api`.
export const bmcService = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserCanvases: builder.query<BusinessModelCanvas[], void>({
      query: () => '/bmc',
      transformResponse: unwrapList,
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map((c) => ({ type: 'BMC' as const, id: c._id })),
              { type: 'BMC' as const, id: 'LIST' },
            ]
          : [{ type: 'BMC' as const, id: 'LIST' }],
    }),
    getCanvas: builder.query<BusinessModelCanvas, string>({
      query: (id) => `/bmc/${id}`,
      transformResponse: unwrapOne,
      providesTags: (_result, _err, id) => [{ type: 'BMC', id }],
    }),
    createCanvas: builder.mutation<BusinessModelCanvas, CreateBMCRequest>({
      query: (data) => ({
        url: '/bmc',
        method: 'POST',
        body: data,
      }),
      transformResponse: unwrapOne,
      invalidatesTags: [{ type: 'BMC', id: 'LIST' }],
    }),
    updateCanvas: builder.mutation<BusinessModelCanvas, UpdateBMCRequest>({
      query: ({ id, ...data }) => ({
        url: `/bmc/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: unwrapOne,
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'BMC', id },
        { type: 'BMC', id: 'LIST' },
      ],
    }),
    deleteCanvas: builder.mutation<void, string>({
      query: (id) => ({
        url: `/bmc/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'BMC', id },
        { type: 'BMC', id: 'LIST' },
      ],
    }),
    duplicateCanvas: builder.mutation<BusinessModelCanvas, string>({
      query: (id) => ({
        url: `/bmc/${id}/duplicate`,
        method: 'POST',
      }),
      transformResponse: unwrapOne,
      invalidatesTags: [{ type: 'BMC', id: 'LIST' }],
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
