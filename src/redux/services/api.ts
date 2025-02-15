import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { apiUrl } from "@/lib/env";

const baseQuery=fetchBaseQuery({
    baseUrl:apiUrl,
    prepareHeaders:(headers,{getState})=>{
        const token=(getState() as RootState ).userReducer.token
        if(token){
            headers.set('authorization',`Bearer ${token}`)
        }
        return headers
    }

})
const splitApi=createApi({
    reducerPath: 'splitApi',
    baseQuery: baseQuery,
    tagTypes:[],
    endpoints:()=>({})
})

export default splitApi