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
                console.log("[DEBUG API] Provinces raw response:", response);
                // Detailed logging of API response structure
                if (Array.isArray(response)) {
                    console.log("[DEBUG API] Provinces is an array with length:", response.length);
                    if (response.length > 0) {
                        console.log("[DEBUG API] First province item:", response[0]);
                        console.log("[DEBUG API] Province properties:", Object.keys(response[0]));
                        response.forEach((item, index) => {
                            console.log(`[DEBUG API] Province ${index}:`, item);
                            console.log(`[DEBUG API] Province ${index} properties:`, Object.keys(item));
                            console.log(`[DEBUG API] Province ${index} name:`, item.name);
                            console.log(`[DEBUG API] Province ${index} id:`, item._id);
                            console.log(`[DEBUG API] Province ${index} status:`, item.status);
                        });
                    } else {
                        console.log("[DEBUG API] Provinces array is empty");
                    }
                } else {
                    console.log("[DEBUG API] Provinces is NOT an array:", typeof response);
                    console.log("[DEBUG API] Provinces response structure:", response);
                }
                return response;
            },
            transformErrorResponse: (response: any) => {
                console.error("[DEBUG API ERROR] Provinces error:", response);
                console.error("[DEBUG API ERROR] Provinces error status:", response.status);
                console.error("[DEBUG API ERROR] Provinces error data:", response.data);
                return response;
            }
        }),
        getTerritories:builder.query({
            query: () => {
                console.log("[DEBUG API] Fetching territories");
                return "/territories";
            },
            transformResponse: (response: any) => {
                console.log("[DEBUG API] Territories raw response:", response);
                // Detailed logging of API response structure
                if (Array.isArray(response)) {
                    console.log("[DEBUG API] Territories is an array with length:", response.length);
                    if (response.length > 0) {
                        console.log("[DEBUG API] First territory item:", response[0]);
                        console.log("[DEBUG API] Territory properties:", Object.keys(response[0]));
                        response.forEach((item, index) => {
                            console.log(`[DEBUG API] Territory ${index}:`, item);
                            console.log(`[DEBUG API] Territory ${index} properties:`, Object.keys(item));
                            console.log(`[DEBUG API] Territory ${index} name:`, item.name);
                            console.log(`[DEBUG API] Territory ${index} id:`, item._id);
                            console.log(`[DEBUG API] Territory ${index} status:`, item.status);
                        });
                    } else {
                        console.log("[DEBUG API] Territories array is empty");
                    }
                } else {
                    console.log("[DEBUG API] Territories is NOT an array:", typeof response);
                    console.log("[DEBUG API] Territories response structure:", response);
                }
                return response;
            },
            transformErrorResponse: (response: any) => {
                console.error("[DEBUG API ERROR] Territories error:", response);
                console.error("[DEBUG API ERROR] Territories error status:", response.status);
                console.error("[DEBUG API ERROR] Territories error data:", response.data);
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