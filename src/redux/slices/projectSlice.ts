import { IProject, Project } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const ProjectInitialState={
    project:{
        id:"",
        title:"",
        image:"",
        desc:"",
        type:"",
        amount:0,
        limit:0,
        profile:'',
        projectEndDate:"",
        notifications:[],
        projectAttachement:[]

    } satisfies IProject
}

export const projectSlice=createSlice({
    name:"project",
    initialState:ProjectInitialState,
    reducers:{
        setProject:(state,action:PayloadAction<IProject>)=>{
            //@ts-ignore
            state.project=action.payload
        }
    }
})

export const { setProject }=projectSlice.actions

export const selectProject=(state:RootState)=>state.projectReducer.project

export default projectSlice.reducer