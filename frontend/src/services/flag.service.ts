import { ActualFlag, AuditLog, FlagEnvironmentValue } from "@/data";
import api from "./api"

export async function toggleFlagValue(envId : string | undefined, flagId : string, is_enabled : boolean){
    const response = await api.patch(`/api/flags/${flagId}/environments/${envId}/toggle`, {is_enabled});
    return response.data;
}

export async function getFlagEnvironmentValues(flagId: string): Promise<FlagEnvironmentValue[]>{
    const response = await api.get(`/api/flags/${flagId}/environments`)
    return response.data
}

export async function deleteflag(flagId: string) : Promise<{envIds : string[]}>{
    const response = await api.delete(`/api/flags/${flagId}`);
    return response.data;
}

export async function editFlagValue(flagId : string, envId : string | undefined, data: Pick<ActualFlag, "is_enabled" | "rollout_percentage" | "targeting_attribute" | "targeting_return_value" | "targeting_value">){
    const response = await api.patch(`/api/flags/${flagId}/environments/${envId}`, data);
    return response.data;
}


export async function getFlagLogs(flagId: string): Promise<AuditLog[]>{
    const response = await api.get(`/api/flags/${flagId}/audit`)
    return response.data;
}