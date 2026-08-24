import { store } from "@/app/store";
import axios from "axios";

const api = axios.create({
    baseURL: "",
    withCredentials: true
})

api.interceptors.request.use((config)=>{
    const projectId = store.getState().project.currentProject?.id

    if(projectId){
        config.headers["X-FlagPulse-Project-Id"] = projectId;
    }
    return config;
})

api.interceptors.response.use(
    (response)=>{
        return response
    },
    (error)=>{
        if(error.response?.status === 401)
            window.location.href = "/login";
        return Promise.reject(error)
    }
)

export default api;