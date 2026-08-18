import { ActualEnvironment, ActualFlag, ActualProject } from "@/data";
import api from "./api"

export async function getEnvironments(projectId : string): Promise<ActualEnvironment[]>{
    const response = await api.get(`/api/projects/${projectId}/environments`);
    return response.data.environments
}

export async function getFlags(envId: string | undefined): Promise<ActualFlag[] | []>{
    if(!envId)
        return [];
    const response = await api.get(`/api/environments/${envId}/flags`);
    return response.data
}

export async function deleteEnvironment(projectId : string, envId : string){
    const response = await api.delete(`/api/projects/${projectId}/environments/${envId}`);
    return response.data
}
