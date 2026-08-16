import { ActualFlag, ActualProject } from "@/data";
import api from "./api"

export async function getProjects(): Promise<ActualProject[]>{
    const response = await api.get("/api/projects")
    return response.data;
}

// export async function createEnvironments(projectId, data){
//     const response = await api.post(`/api/projects/${projectId}/environments`, data);
//     console.log(response.data)
//     return response.data;
// }

export async function createFlag(data : Pick<ActualFlag, "key" | "name" | "type" | "description" | "default_value">, projectId : string | undefined) :
Promise<{flag_id: string; envIds: string[]; message: string}>{
    const response = await api.post(`/api/projects/${projectId}/flags`, data);
    return response.data;
}