import splitApi from "./api";

export const projectService=splitApi.injectEndpoints({
    endpoints:builder=>({
        getAllProjects:builder.query({
            query:()=>'/projects'
        }),
        getProject:builder.query({
            query:(id)=>`/projects/${id}`
        }),
        findProject:builder.mutation({
            query(id){
                return{
                    url:`/projects/${id}`
                }
            }
        }),
        filterProjects: builder.mutation({
            query: (filters) => {
                const queryParams = new URLSearchParams();
        
                // Ensure we only append valid strings or arrays
                Object.entries(filters).forEach(([key, value]) => {
                if (value && Array.isArray(value)) {
                    // For array values (e.g., multiple categories)
                    value.forEach((v) => {
                    if (v) queryParams.append(key, v);
                    });
                } else if (value && typeof value === 'string') {
                    // For string values (e.g., status, startDate)
                    queryParams.append(key, value);
                }
                });
        
                return {
                url: `/projects/filter?${queryParams.toString()}`,
                method: "GET",
                };
            },
        }),
        usersProjects:builder.query({
            query:(id)=>`/projects/user-projects/${id}`
        }),
        createProject:builder.mutation({
            query(data){
                return{
                    url:"/projects",
                    method:"POST",
                    body:data
                }
            }
        }),
        getProjectCategories:builder.query({
            query: () => {
                console.log("[DEBUG API] Fetching project categories");
                return "/project-categories";
            },
            transformResponse: (response: any) => {
                console.log("[DEBUG API] Project categories raw response:", response);
                // Detailed logging of API response structure
                if (Array.isArray(response)) {
                    console.log("[DEBUG API] Project categories is an array with length:", response.length);
                    response.forEach((item, index) => {
                        console.log(`[DEBUG API] Category ${index}:`, item);
                        console.log(`[DEBUG API] Category ${index} properties:`, Object.keys(item));
                        console.log(`[DEBUG API] Category ${index} name:`, item.name);
                        console.log(`[DEBUG API] Category ${index} id:`, item._id);
                        console.log(`[DEBUG API] Category ${index} status:`, item.status);
                    });
                } else {
                    console.log("[DEBUG API] Project categories is NOT an array:", typeof response);
                }
                return response;
            },
            transformErrorResponse: (response: any) => {
                console.error("[DEBUG API ERROR] Project categories error:", response);
                return response;
            }
        }),
        getProjectCategory:builder.query({
            query:(id)=>`/project-categories/${id}`
        }),
        getProjectTypes:builder.query({
            query: () => {
                console.log("[DEBUG API] Fetching project types");
                return "/project-types";
            },
            transformResponse: (response: any) => {
                console.log("[DEBUG API] Project types raw response:", response);
                // Detailed logging of API response structure
                if (Array.isArray(response)) {
                    console.log("[DEBUG API] Project types is an array with length:", response.length);
                    response.forEach((item, index) => {
                        console.log(`[DEBUG API] Type ${index}:`, item);
                        console.log(`[DEBUG API] Type ${index} properties:`, Object.keys(item));
                        console.log(`[DEBUG API] Type ${index} name:`, item.name);
                        console.log(`[DEBUG API] Type ${index} id:`, item._id);
                        console.log(`[DEBUG API] Type ${index} status:`, item.status);
                    });
                } else {
                    console.log("[DEBUG API] Project types is NOT an array:", typeof response);
                }
                return response;
            },
            transformErrorResponse: (response: any) => {
                console.error("[DEBUG API ERROR] Project types error:", response);
                return response;
            }
        }),
        getProvinces:builder.query({
            query: () => {
                console.log("[DEBUG API] Fetching provinces");
                return "/provinces";
            },
            transformResponse: (response: any) => {
                console.log("[DEBUG API] Provinces response:", response);
                return response;
            },
            transformErrorResponse: (response: any) => {
                console.error("[DEBUG API ERROR] Provinces error:", response);
                return response;
            }
        }),
        getTerritories:builder.query({
            query: () => {
                console.log("[DEBUG API] Fetching territories");
                return "/territories";
            },
            transformResponse: (response: any) => {
                console.log("[DEBUG API] Territories response:", response);
                return response;
            },
            transformErrorResponse: (response: any) => {
                console.error("[DEBUG API ERROR] Territories error:", response);
                return response;
            }
        }),
        donate:builder.mutation({
            query(data){
                return{
                    url:'/donations',
                    method:"POST",
                    body:data
                }
            }
        }),
        cashout:builder.mutation({
            query(data){
                return{
                    url:"/cashouts",
                    method:"POST",
                    body:data
                }
            }
        }),
        editProject:builder.mutation({
            query({id,data}){
                return{
                    url:`/projects/${id}`,
                    method:"PUT",
                    body:data
                }
            }
        })
    }),
    overrideExisting:true
})

export const {
    useGetAllProjectsQuery,
    useGetProjectQuery,
    useCreateProjectMutation,
    useGetProjectCategoriesQuery,
    useGetProjectCategoryQuery,
    useGetProjectTypesQuery,
    useGetProvincesQuery,
    useGetTerritoriesQuery,
    useDonateMutation,
    useUsersProjectsQuery,
    useFindProjectMutation,
    useCashoutMutation,
    useFilterProjectsMutation,
    useEditProjectMutation
}=projectService