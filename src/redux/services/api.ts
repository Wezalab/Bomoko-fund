import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

const baseQuery=fetchBaseQuery({
    baseUrl:`https://bomoko-fund-api.onrender.com/api`,
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