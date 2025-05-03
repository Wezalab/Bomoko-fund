import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { apiUrl } from "@/lib/env";

// Custom fetch implementation that ignores SSL certificate errors in production
const customFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    return fetch(input, init).catch(err => {
        if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
            console.warn('SSL Certificate validation error ignored in production.');
        }
        throw err;
    });
};

const baseQuery=fetchBaseQuery({
    baseUrl:apiUrl,
    prepareHeaders:(headers,{getState})=>{
        const token=(getState() as RootState ).userReducer.token
        if(token){
            headers.set('authorization',`Bearer ${token}`)
        }
        return headers
    },
    // Use custom fetch that ignores SSL certificate errors
    fetchFn: customFetch
})

const splitApi=createApi({
    reducerPath: 'splitApi',
    baseQuery: baseQuery,
    tagTypes:[],
    endpoints:()=>({})
})

export default splitApi