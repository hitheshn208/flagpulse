import { FlagEnvironmentValue } from "@/data";
import api from "./api"

export async function toggleFlagValue(envId : string | undefined, flagId : string, is_enabled : boolean){
    const response = await api.patch(`/api/flags/${flagId}/environments/${envId}/toggle`, {is_enabled});
    return response.data;
}

export async function getFlagEnvironmentValues(flagId: string): Promise<FlagEnvironmentValue[]>{
    const response = await api.get(`/api/flags/${flagId}/environments`)
    return response.data
}