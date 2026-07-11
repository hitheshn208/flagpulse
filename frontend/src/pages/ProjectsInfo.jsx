import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEnvironmentFlags, getEnvironments } from "../services/environment.service";
import Sidebar from "../components/SideBar/Sidebar";
import "./ProjectsInfo/ProjectInfo.css"
import Flags from "./ProjectsInfo/Flags";
import Environments from "./ProjectsInfo/Environments";
import AuditLogs from "./ProjectsInfo/AuditLogs";
function ProjectsInfo() {
    const { projectId } = useParams();
    
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("environments");
    const [project, setProject] = useState({});
    const [environments, setEnvironments] = useState([]);
    const [activeEnvironment, setActiveEnvironment] = useState(null);
    const [flagsByEnv, setFlagsByEnv] = useState({});
    const [clientCounts, setClientCounts] = useState({}); 

    const fetchAllEnvironments = async () => {
        const response = await getEnvironments(projectId);
        setProject(response.project);
        setEnvironments(response.environments ?? []);
        setActiveEnvironment(response.environments?.[0] ?? null);
        setLoading(false);

        response.environments?.forEach(environment => {
            fetchFlags(environment.id);
        });
    };

    const fetchFlags = async (envId) => {
        const response = await getEnvironmentFlags(envId);
        setFlagsByEnv(prev => ({ ...prev, [envId]: response }));
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAllEnvironments();
        return () => {
            setFlagsByEnv({});
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    useEffect(() => {
        if (!environments?.length) return;

        const eventSources = environments.map(env => {
            const es = new EventSource(
                `${import.meta.env.VITE_API_URL}/api/v1/stream/dashboard?environment_id=${env.id}`,
                { withCredentials: true }
            );

            es.addEventListener('presence', (e) => {
                const { count } = JSON.parse(e.data);
                setClientCounts(prev => ({ ...prev, [env.id]: count }));
            });

            return es;
        });

        return () => {
            eventSources.forEach(es => es.close());
        };
    }, [environments]);

    const handleEnvironmentChange = (env) => {
        setActiveEnvironment(env);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // if (loading) {
    //     return <LoadingSkeleton />;
    // }

    return (
        <div className="page">
            <Sidebar name={project.name} onTabChange={handleTabChange} activeTab={activeTab} />
            <div className="project-info-content">
                {activeTab === "flags" ? (
                    <Flags
                        environments={environments}
                        projectId={projectId}
                        active={activeEnvironment}
                        onEnvironmentChange={handleEnvironmentChange}
                        fetchFlags={fetchFlags}
                        flags={flagsByEnv[activeEnvironment?.id] ?? []}
                    />
                ) : activeTab === "environments" ? (
                    <Environments 
                        projectId={projectId}
                        environments={environments} 
                        clientCounts={clientCounts}
                        setEnvironments={setEnvironments}    
                        setFlagsByEnv={setFlagsByEnv}
                    />
                ) : (
                    <AuditLogs />
                )}
            </div>
        </div>
    );
}

export default ProjectsInfo;