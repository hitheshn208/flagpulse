import { useEffect, useState } from "react";
import { getProjects } from "../services/dashboard.service";
import ProjectCard from "../components/Cards/ProjectCard";

function Dashboard() {
    const [projects, setProjects] = useState([]);
    useEffect(()=>{
        async function fetchAllProjects() {
            const response = await getProjects();
            console.log(response);
            setProjects(response);
        }
        fetchAllProjects()
    },[])
    return (
        <>
            <h1>Hello from Dashboard</h1>
            {projects.map(project=> <ProjectCard key={project.id} id={project.id} name={project.name} created_at={project.created_at}/>)}
        </>
    );
}

export default Dashboard;