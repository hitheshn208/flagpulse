import api from "./api.ts"

type AuthUser = {
    name: String,
    email: String,
    password: String,
    confirmPassword: String
}

type AuthResponse = {
    email: string
    name: string
    message: String
}

export async function login(data : Pick<AuthUser, "email" | "password">) : Promise<AuthResponse> {
    const response = await api.post("/api/auth/login", data);
    return response.data;
}

export async function register(data : AuthUser) : Promise<AuthResponse>{
    const response = await api.post<AuthResponse>("/api/auth/register", data);
    return response.data;
}

export async function logout() : Promise<void> {
    await api.post("/api/auth/logout");
    return;
}