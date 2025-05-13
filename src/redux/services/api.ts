import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { apiUrl } from "@/lib/env";

// Add this utility function at the top of the file
const debugAPIResponse = (label: string, data: any) => {
  console.log(`[DEBUG API FULL] ${label}:`, JSON.stringify(data, null, 2));
  
  // Check if it's an array
  if (Array.isArray(data)) {
    console.log(`[DEBUG API FULL] ${label} is an array with ${data.length} items`);
    data.forEach((item, index) => {
      console.log(`[DEBUG API FULL] ${label} item ${index}:`, JSON.stringify(item, null, 2));
    });
  } else if (data && typeof data === 'object') {
    console.log(`[DEBUG API FULL] ${label} is an object with keys:`, Object.keys(data));
  } else {
    console.log(`[DEBUG API FULL] ${label} type:`, typeof data);
  }
};

// Custom fetch implementation that ignores SSL certificate errors in production
const customFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    console.log("[DEBUG API] Request URL:", 
        typeof input === 'string' 
            ? input 
            : input instanceof URL 
                ? input.toString() 
                : input.url);
    console.log("[DEBUG API] Request method:", init?.method || 'GET');
    console.log("[DEBUG API] Request headers:", init?.headers);
    
    return fetch(input, init)
        .then(response => {
            console.log("[DEBUG API] Response status:", response.status);
            console.log("[DEBUG API] Response OK:", response.ok);
            // Clone the response to log it without consuming it
            return response.clone().text().then(text => {
                try {
                    const data = text ? JSON.parse(text) : {};
                    const url = typeof input === 'string' 
                        ? input 
                        : input instanceof URL 
                            ? input.toString() 
                            : input.url;
                    
                    // Use the new utility function to better debug responses
                    debugAPIResponse(`Response for ${url}`, data);
                    
                    return response;
                } catch (e) {
                    console.log("[DEBUG API] Response text (not JSON):", text.substring(0, 500));
                    return response;
                }
            });
        })
        .catch(err => {
            console.error("[DEBUG API ERROR] Fetch error:", err);
            if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
                console.error("[DEBUG API ERROR] Network error - possible SSL issue in production");
            }
            throw err;
        });
};

const baseQuery=fetchBaseQuery({
    baseUrl:apiUrl,
    prepareHeaders:(headers,{getState})=>{
        const token=(getState() as RootState ).userReducer.token
        if(token){
            console.log("[DEBUG API] Adding Authorization header with token");
            headers.set('authorization',`Bearer ${token}`)
        } else {
            console.log("[DEBUG API] No token available for request");
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