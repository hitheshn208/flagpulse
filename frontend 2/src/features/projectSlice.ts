import { ActualProject } from "@/data";
import { createSlice } from "@reduxjs/toolkit";

interface CreateProjectState {
    currentProject: ActualProject | undefined
    projects: ActualProject[]
}

const initialState : CreateProjectState = {
    currentProject: undefined,
    projects: []
}

export const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        setCurrentProject : (state, action)=>{
            state.currentProject = action.payload
        },
        setProjects: (state, action)=>{
            state.projects = action.payload
        }
    }
})

export const {setCurrentProject, setProjects} = projectSlice.actions
export default projectSlice.reducer