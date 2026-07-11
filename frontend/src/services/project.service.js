import api from "./api"

export async function getProjects(){
    const response = await api.get("/api/projects");
    return response.data;
}

export async function createEnvironments(projectId, data){
    const response = await api.post(`/api/projects/${projectId}/environments`, data);
    console.log(response.data)
    return response.data;
}

export async function createFlag(data){
    const response = await api.post(`/api/projects/${data.projectId}/flags`, data);
    return response.data;
}