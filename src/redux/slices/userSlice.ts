import { User  } from "@/types";
import { createSlice,  } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const initialState={
    user:{
        profile:"",
        email:"",
        phone_number:"",
        password:"",
        projects:[],
        cryptoWallet:[]
    } satisfies User,
    token:""
    
}

export const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        setUser:(state,action)=>{
            state.user=action.payload
        },
        setToken:(state,action)=>{
            state.token=action.payload
        }
    }
})

export const {setUser,setToken}=userSlice.actions

export const selectUser=(state:RootState)=>state.userReducer.user
export const selectToken=(state:RootState)=>state.userReducer.token

export default userSlice.reducer