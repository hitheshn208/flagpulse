import api from "./api"

export async function getProjects(){
    const response = await api.get("/api/projects");
    return response.data
}