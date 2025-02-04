import { IProject } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const initialState={
    project:{
        id:"",
        title:"",
        image:"",
        desc:"",
        type:"",
        amount:0,
        limit:0,
        profile:''
    } satisfies IProject
}

export const projectSlice=createSlice({
    name:"project",
    initialState,
    reducers:{
        setProject:(state,action:PayloadAction<IProject>)=>{
            state.project=action.payload
        }
    }
})

export const { setProject }=projectSlice.actions

export const selectProject=(state:RootState)=>state.projectReducer.project

export default projectSlice.reducer