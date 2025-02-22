import { IProject, Project, projectProps } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const ProjectInitialState={
    project:{
        _id:"",
        accessCodestatus:"",
        actualBalance:0,
        attachments:[],
        category:{
            _id:"",
            name:""
        },
        currency:"",
        description:"",
        endDate:"",
        medias:[],
        name:"",
        projectOwner:{
            _id:"",
            gender:""
        },
        province:{
            _id:"",
            name:""
        },
        startDate:"",
        status:"",
        targetAmount:0,
        territory:{
            _id:"",
            name:""
        },
        type:{
            _id:"",
            name:""
        }
    } satisfies projectProps,
    projects:[
        {
            _id:"",
            accessCodestatus:"",
            actualBalance:0,
            attachments:[],
            category:{
                _id:"",
                name:""
            },
            currency:"",
            description:"",
            endDate:"",
            medias:[],
            name:"",
            projectOwner:{
                _id:"",
                gender:""
            },
            province:{
                _id:"",
                name:""
            },
            startDate:"",
            status:"",
            targetAmount:0,
            territory:{
                _id:"",
                name:""
            },
            type:{
                _id:"",
                name:""
            }
        }
    ]
}

export const projectSlice=createSlice({
    name:"project",
    initialState:ProjectInitialState,
    reducers:{
        setProject:(state,action)=>{
            //@ts-ignore
            state.project=action.payload
        },
        setProjects:(state,action)=>{
            state.projects=action.payload
        }
    }
})

export const { setProject,setProjects }=projectSlice.actions

export const selectProject=(state:RootState)=>state.projectReducer.project
export const selectProjects=(state:RootState)=>state.projectReducer.projects

export default projectSlice.reducer