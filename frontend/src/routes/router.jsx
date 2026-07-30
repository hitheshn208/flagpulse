import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProjectsInfo from "../pages/ProjectsInfo";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/dashboard",
        element: <Dashboard/>
    },
    {
        path: "/projects/:projectId/environments",
        element: <ProjectsInfo/>
    }
]);