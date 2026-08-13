import App from "@/App";
import LoginPage from "@/pages/LoginPage";
import {createBrowserRouter} from "react-router-dom";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage/>
    },
    {
        path: "/",
        element: <App/>
    }
])