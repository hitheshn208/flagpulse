import { ActualEnvironment, ActualFlag, ActualProject, AuditLog } from "@/data";
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

export async function fetchAuditLogs(projectId: string) : Promise<AuditLog[] | undefined>{
    const response = await api.get(`/api/projects/${projectId}/auditlogs`)
    return response.data;
}

export async function deleteAuditLogs(projectId: string){
    const response = await api.delete(`/api/projects/${projectId}/auditlogs`)
    return response.data;
}


export async function editProject(projectId: string, data : {name: string ; url: string | null}) {
    const response = await api.patch(`/api/projects/${projectId}`, data);
    return response.data;
}