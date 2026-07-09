import api from "./api"

export async function toggleFlagValue(envId, flagId, is_enabled){
    const response = await api.patch(`/api/flags/${flagId}/environments/${envId}/toggle`, {is_enabled});
    return response.data;
}