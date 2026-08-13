import { ActualEnvironment, ActualProject } from "@/data";
import api from "./api"

export async function getEnvironments(projectId : string): Promise<ActualEnvironment[]>{
    const response = await api.get(`/api/projects/${projectId}/environments`);
    return response.data.environments
}