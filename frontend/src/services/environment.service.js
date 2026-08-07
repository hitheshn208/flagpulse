import api from "./api"

export async function getEnvironments(projectId){
    const response = await api.get(`/api/projects/${projectId}/environments`);
    return response.data
}

export async function getEnvironmentFlags(envId){
    const response = await api.get(`/api/environments/${envId}/flags`);
    return response.data;
}

export async function deleteEnvironment(projectId, envId){
    const response = await api.delete(`/api/projects/${projectId}/environments/${envId}`);
    return response.data
}

export async function rotateEnvironmentKey(envId){
    const response = await api.patch(`api/environments/${envId}/rotate-key`);
    return response.data;
}