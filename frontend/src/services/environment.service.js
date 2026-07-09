import api from "./api"

export async function getEnvironments(projectId){
    const response = await api.get(`/api/projects/${projectId}/environments`);
    return response.data
}

export async function getEnvironmentFlags(envId){
    const response = await api.get(`/api/environments/${envId}/flags`);
    return response.data;
}