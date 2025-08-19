import splitApi from "./api";

export const userService=splitApi.injectEndpoints({
    endpoints:builder=>({
        registerOtp:builder.mutation({
            query(data){
                return{
                    url:'/auth/register-otp',
                    method:"POST",
                    body:data
                }
            }
        }),
        registerEmail:builder.mutation({
            query(data){
                return{
                    url:"/auth/register",
                    method:"POST",
                    body:data
                }
            }
        }),
        verifyOtp:builder.mutation({
            query(data){
                return{
                    url:"/auth/verify-otp",
                    method:"POST",
                    body:data
                }
            }
        }),
        finalizeRegistration:builder.mutation({
            query(data){
                return{
                    url:"/auth/finalize-register",
                    method:"POST",
                    body:data
                }
            }
        }),
        register:builder.mutation({
            query(data){
                return{
                    url:"/auth/register",
                    method:"POST",
                    body:data
                }
            }
        }),
        editProfile:builder.mutation({
            query({userId,data}){
                return{
                    url:`/auth/me/${userId}/edit`,
                    method:"PUT",
                    body:data
                }
            }
        }),
        changePassword:builder.mutation({
            query({userId,data}){
                return{
                    url:`/auth/me/${userId}/change-password`,
                    method:"PUT",
                    body:data
                }
            }
        }),
        login:builder.mutation({
            query(data){
                return{
                    url:"/auth/login",
                    method:"POST",
                    body:data
                }
            }
        }),
        loginPhone:builder.mutation({
            query(data){
                return{
                    url:"/auth/login-phone",
                    method:"POST",
                    body:data
                }
            }
        }),
        resetPasswordRequest:builder.mutation({
            query(data){
                return{
                    url:"/auth/reset-password-request",
                    method:"POST",
                    body:data
                }
            }
        }),
        resetPassword:builder.mutation({
            query(data){
                return{
                    url:"/auth/reset-password",
                    method:"POST",
                    body:data
                }
            }
        }),
        getProfile:builder.mutation({
            query(userId){
                return{
                    url:`/auth/me/${userId}`,
                    
                }
            }
        }),
        // Google OAuth integration - Check auth status after OAuth callback
        googleAuthCallback:builder.mutation({
            query(data){
                return{
                    url:"/auth/google/status",
                    method:"GET",
                    credentials: 'include' // Include session cookies
                }
            }
        }),
        checkGoogleUser:builder.mutation({
            query(data){
                return{
                    url:"/auth/google/status",
                    method:"GET",
                    credentials: 'include' // Important for session cookies
                }
            }
        }),
        checkGoogleUserWithToken:builder.mutation({
            query(data){
                return{
                    url:"/auth/google/check",
                    method:"GET"
                }
            }
        }),
        // Exchange Google OAuth token for backend JWT token
        exchangeGoogleToken: builder.mutation({
            query: (googleToken) => ({
                url: '/auth/exchange-google-token',
                method: 'POST',
                body: { googleToken }
            }),
            transformResponse: (response: any) => {
                console.log('✅ Google token exchange successful:', { 
                    hasToken: !!response.token, 
                    hasUser: !!response.user,
                    userName: response.user?.name 
                });
                return response;
            },
            transformErrorResponse: (response: any) => {
                console.error('❌ Google token exchange failed:', response);
                return response;
            }
        })
    }),
    overrideExisting:true
})


export const {
    useRegisterOtpMutation,
    useVerifyOtpMutation,
    useFinalizeRegistrationMutation,
    useChangePasswordMutation,
    useEditProfileMutation,
    useLoginMutation,
    useResetPasswordMutation,
    useResetPasswordRequestMutation,
    useGetProfileMutation,
    useRegisterEmailMutation,
    useLoginPhoneMutation,
    useRegisterMutation,
    useGoogleAuthCallbackMutation,
    useCheckGoogleUserMutation,
    useCheckGoogleUserWithTokenMutation,
    useExchangeGoogleTokenMutation
}=userService