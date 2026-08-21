import { ActualProject, AuditLog } from "@/data";
import { createSlice } from "@reduxjs/toolkit";
import { stat } from "fs";

interface CreateProjectState {
    currentProject: ActualProject | undefined
    projects: ActualProject[]
    auditLogs: AuditLog[] | undefined
}

const initialState : CreateProjectState = {
    currentProject: undefined,
    projects: [],
    auditLogs: undefined
}

export const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        setCurrentProject : (state, action)=>{
            state.currentProject = action.payload;
            state.auditLogs = undefined;
        },
        setProjects: (state, action)=>{
            state.projects = action.payload
            state.auditLogs = undefined;
        },
        setNewProject : (state, action)=>{
            state.projects.push(action.payload);
            state.auditLogs = undefined;
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
            state.auditLogs = undefined;
        },
        setAuditLogs : (state, action)=>{
            state.auditLogs = action.payload
        },
        updateProjectName: (state, action) => {
            const project = state.projects.find(
                (p) => p.id === action.payload.id
            );

            if (project){
                project.name = action.payload.name;
            }

            if (state.currentProject && state.currentProject?.id === action.payload.id){
                state.currentProject.name = action.payload.name;
            }
        },
    }
})

export const {setCurrentProject, setProjects, updateProjectName, changeFlagCountOfproject, setNewProject, removeProject, changeEnvironmentCountOfproject, setAuditLogs} = projectSlice.actions
export default projectSlice.reducer