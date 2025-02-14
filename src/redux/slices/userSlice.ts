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
        cryptoWallet:[],
        name:'',
        location:"",
        isGoogleUser:false
    } satisfies User,
    token:"",
    signUpData:{
        phone:"",
        otp:"",
        email:""
    }
    
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
        },
        setSignUpData:(state,action)=>{
            state.signUpData=action.payload
        }
    }
})

export const {setUser,setToken,setSignUpData}=userSlice.actions

export const selectUser=(state:RootState)=>state.userReducer.user
export const selectToken=(state:RootState)=>state.userReducer.token
export const selectSignUpData=(state:RootState)=>state.userReducer.signUpData

export default userSlice.reducer