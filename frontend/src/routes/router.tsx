import App from "@/App";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage"
import {createBrowserRouter} from "react-router-dom";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage/>
    },
    {
        path:"/register",
        element: <RegisterPage/>
    },
    {
        path: "/",
        element: <App/>
    }
])