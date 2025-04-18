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
            query:()=>"/project-categories"
        }),
        getProjectCategory:builder.query({
            query:(id)=>`/project-categories/${id}`
        }),
        getProjectTypes:builder.query({
            query:()=>"/project-types"
        }),
        getProvinces:builder.query({
            query:()=>"/provinces"
        }),
        getTerritories:builder.query({
            query:()=>"/territories"
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