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
        },
        setNewProject : (state, action)=>{
            state.projects.push(action.payload);
        },
        changeFlagCountOfproject : (state, action)=>{
            const project = state.projects.find(project => project.id === state.currentProject?.id)
            if (project) {
                project.flags_count = Number((project.flags_count ?? 0)) + action.payload.count
            }
        },
        changeEnvironmentCountOfproject : (state, action)=>{
            const project = state.projects.find(project => project.id === state.currentProject?.id)
            if (project) {
                project.environments_count = Number((project.environments_count ?? 0)) + action.payload.count
            }
        },
        removeProject : (state, action)=>{
            state.projects = state.projects.filter(project=> project.id !== action.payload.id)

            if(state.projects.length > 0)
                state.currentProject = state.projects[0];
        }
    }
})

export const {setCurrentProject, setProjects, changeFlagCountOfproject, setNewProject, removeProject, changeEnvironmentCountOfproject} = projectSlice.actions
export default projectSlice.reducer