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
    } satisfies User
    
}

export const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        setUser:(state,action)=>{
            state.user=action.payload
        }
    }
})

export const {setUser}=userSlice.actions

export const selectUser=(state:RootState)=>state.userReducer.user

export default userSlice.reducer