import splitApi from "./api";

export interface VentureData {
  purpose: string;
  country: string;
  businessDescription: string;
  businessTypes: string[];
  businessName: string;
  userName: string;
  userRole: string;
  authMethod: 'google' | '';
  language: string;
  currency: string;
  googleUser?: {
    email: string;
    name: string;
    picture: string;
    access_token: string;
  };
}

export interface Venture extends VentureData {
  _id: string;
  userId: string;
  status: 'draft' | 'in-progress' | 'completed' | 'published';
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export const ventureService = splitApi.injectEndpoints({
  endpoints: builder => ({
    createVenture: builder.mutation<Venture, VentureData & { user_id: string; userId?: string }>({
      query(data) {
        console.log("[DEBUG API] Creating venture with data:", data);
        console.log("[DEBUG API] Data userId specifically:", data.userId);
        console.log("[DEBUG API] Data keys:", Object.keys(data));
        
        const requestConfig = {
          url: "/ventures",
          method: "POST" as const,  // TypeScript const assertion
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)  // Explicitly stringify the body
        };
        
        console.log("[DEBUG API] Final request config:", requestConfig);
        console.log("[DEBUG API] Request config method:", requestConfig.method);
        
        return requestConfig;
      },
      transformResponse: (response: any) => {
        console.log("[DEBUG API] Create venture response:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error("[DEBUG API ERROR] Create venture error:", response);
        return response;
      }
    }),
    getUserVentures: builder.query<Venture[], { userId: string; page?: number; limit?: number; status?: string; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }>({
      query: ({ userId, page = 1, limit = 10, status, search, sortBy = 'createdAt', sortOrder = 'desc' } = { userId: '' }) => {
        const params = new URLSearchParams({
          userId,
          page: page.toString(),
          limit: limit.toString(),
          sortBy,
          sortOrder,
        });
        
        if (status) {
          params.append('status', status);
        }
        
        if (search) {
          params.append('search', search);
        }
        
        console.log("[DEBUG API] Fetching user ventures with params:", params.toString());
        return `/ventures?${params.toString()}`;
      },
      transformResponse: (response: any) => {
        console.log("[DEBUG API] Get user ventures response:", response);
        // Based on the API specification, the response has a "ventures" property
        return response?.ventures || response;
      },
      transformErrorResponse: (response: any) => {
        console.error("[DEBUG API ERROR] Get user ventures error:", response);
        return response;
      }
    }),
    getVenture: builder.query<Venture, string>({
      query: (id) => {
        console.log("[DEBUG API] Fetching venture with id:", id);
        return `/ventures/${id}`;
      },
      transformResponse: (response: any) => {
        console.log("[DEBUG API] Get venture response:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error("[DEBUG API ERROR] Get venture error:", response);
        return response;
      }
    }),
    updateVenture: builder.mutation<Venture, { id: string; data: Partial<VentureData> }>({
      query({ id, data }) {
        console.log("[DEBUG API] Updating venture with id:", id, "data:", data);
        return {
          url: `/ventures/${id}`,
          method: "PUT",
          body: data
        }
      },
      transformResponse: (response: any) => {
        console.log("[DEBUG API] Update venture response:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error("[DEBUG API ERROR] Update venture error:", response);
        return response;
      }
    }),
    deleteVenture: builder.mutation<{ message: string }, string>({
      query(id) {
        console.log("[DEBUG API] Deleting venture with id:", id);
        return {
          url: `/ventures/${id}`,
          method: "DELETE"
        }
      },
      transformResponse: (response: any) => {
        console.log("[DEBUG API] Delete venture response:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error("[DEBUG API ERROR] Delete venture error:", response);
        return response;
      }
    }),
    getBusinessTypes: builder.query<string[], void>({
      query: () => {
        console.log("[DEBUG API] Fetching business types");
        return "/ventures/business-types";
      },
      transformResponse: (response: any) => {
        console.log("[DEBUG API] Get business types response:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error("[DEBUG API ERROR] Get business types error:", response);
        return response;
      }
    }),
    publishVenture: builder.mutation<Venture, string>({
      query(id) {
        console.log("[DEBUG API] Publishing venture with id:", id);
        return {
          url: `/ventures/${id}/publish`,
          method: "POST"
        }
      },
      transformResponse: (response: any) => {
        console.log("[DEBUG API] Publish venture response:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error("[DEBUG API ERROR] Publish venture error:", response);
        return response;
      }
    })
  }),
  overrideExisting: true
});

export const {
  useCreateVentureMutation,
  useGetUserVenturesQuery,
  useGetVentureQuery,
  useUpdateVentureMutation,
  useDeleteVentureMutation,
  useGetBusinessTypesQuery,
  usePublishVentureMutation
} = ventureService;
