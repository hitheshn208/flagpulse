import { ActualProject } from "@/data";
import api from "./api"

export async function getProjects(): Promise<ActualProject[]>{
    const response = await api.get("/api/projects")
    return response.data;
}