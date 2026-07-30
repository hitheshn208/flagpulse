import api from "./api"

export async function toggleFlagValue(envId, flagId, is_enabled){
    const response = await api.patch(`/api/flags/${flagId}/environments/${envId}/toggle`, {is_enabled});
    return response.data;
}

export async function editFlag(envId, flagId, payload){
    const response = await api.patch(`/api/flags/${flagId}/environments/${envId}`, payload);
    return response.data;
}

export async function deleteflag(flagId){
    const response = await api.delete(`/api/flags/${flagId}`);
    return response.data;
}