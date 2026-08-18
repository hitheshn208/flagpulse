import { ActualEnvironment, ActualFlag, ActualProject } from "@/data";
import api from "./api"

export async function getProjects(): Promise<ActualProject[]>{
    const response = await api.get("/api/projects")
    return response.data;
}

export async function createEnvironment(projectId : string, data : {name: string, icon: string}) : Promise<ActualEnvironment>{
    const response = await api.post(`/api/projects/${projectId}/environments`, data);
    return response.data;
}

export async function createFlag(data : Pick<ActualFlag, "key" | "name" | "type" | "description" | "default_value">, projectId : string | undefined) :
Promise<{flag_id: string; envIds: string[]; message: string}>{
    const response = await api.post(`/api/projects/${projectId}/flags`, data);
    return response.data;
}

export async function createProject(data : Pick<ActualProject, "name" | "description" | "url"> & {environment_name: string ; environment_icon : string}) : Promise<ActualProject>{
    const response = await api.post("/api/projects", data);
    return response.data;
}

export async function deleteProject(projectId: string){
    const response = await api.delete(`/api/projects/${projectId}`);
    return response.data;
}