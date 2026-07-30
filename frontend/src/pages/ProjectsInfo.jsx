import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEnvironmentFlags, getEnvironments } from "../services/environment.service";
import Sidebar from "../components/SideBar/Sidebar";
import Flags from "./ProjectsInfo/Flags";
import Environments from "./ProjectsInfo/Environments";
import AuditLogs from "./ProjectsInfo/AuditLogs";
import {Toast, Notify} from "../components/Toasts/Toast";

import "./ProjectsInfo/ProjectInfo.css"
import ProjectSettings from "./ProjectsInfo/ProjectSettings";

function ProjectsInfo() {
    const { projectId } = useParams();
    
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(true);
    const [flagsloading, setFlagsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("environments");
    const [project, setProject] = useState({});
    const [environments, setEnvironments] = useState([]);
    const [activeEnvironment, setActiveEnvironment] = useState(null);
    const [flagsByEnv, setFlagsByEnv] = useState({});
    const [clientCounts, setClientCounts] = useState({}); 
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isFlagInfoOpen, setIsFlagInfoOpen] = useState(false);
    const [selectedFlag, setSelectedFlag] = useState(null);

    const [totalStatusFlags, setTotalStatusFlags] = useState({enabled: 0, disabled: 0})

    const fetchAllEnvironments = async () => {
        try {
            const response = await getEnvironments(projectId);
            setProject(response.project);
            setEnvironments(response.environments ?? []);
            setActiveEnvironment(response.environments?.[0] ?? null);   
            setLoading(false);
            await Promise.all(
                response.environments.map(environment =>
                    fetchFlags(environment.id)
                )
            );
        } catch (e) {
            if (e.response) {
                console.log(e.response.data.message);
                Notify("error", e.response.data.message);
            } else {
                Notify("error", "Network error");
            }
        } finally{
            setLoading(false);
            setFlagsLoading(false)
        }
    };

    const fetchFlags = async (envId) => {
        const response = await getEnvironmentFlags(envId);
        const totals = response.reduce(
        (acc, flag) => {
            flag.is_enabled ? acc.enabled++ : acc.disabled++;
            return acc;
        },
        { enabled: 0, disabled: 0 }
        );

        setTotalStatusFlags(totals);
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
        setIsFlagInfoOpen(false);
        setSelectedFlag(null);
        setIsSidebarCollapsed(false);
    };

    // if (loading) {
    //     return <LoadingSkeleton />;
    // }

    return (
        <div className="page">
           <Sidebar
                name={project.name}
                onTabChange={handleTabChange}
                activeTab={activeTab}
                collapsed={isSidebarCollapsed}
            />
            <div className="project-info-content">
                {activeTab === "flags" ? (
                    <Flags
                        environments={environments}
                        projectId={projectId}
                        active={activeEnvironment}
                        onEnvironmentChange={handleEnvironmentChange}
                        fetchFlags={fetchFlags}
                        flags={flagsByEnv[activeEnvironment?.id] ?? []}
                        isFlagInfoOpen={isFlagInfoOpen}
                        setIsFlagInfoOpen={setIsFlagInfoOpen}
                        setIsSidebarCollapsed={setIsSidebarCollapsed}
                        selectedFlag={selectedFlag}
                        setSelectedFlag={setSelectedFlag}
                        flagsByEnv={flagsByEnv}
                        setFlagsByEnv={setFlagsByEnv}
                        loading={loading}
                        flagsloading={flagsloading}
                    />
                ) : activeTab === "environments" ? (
                    <Environments 
                        projectId={projectId}
                        environments={environments} 
                        clientCounts={clientCounts}
                        setEnvironments={setEnvironments}    
                        setFlagsByEnv={setFlagsByEnv}
                        loading={loading}
                        ProjectId={projectId}
                    />
                ) : activeTab === "settings" ?  (
                    <ProjectSettings
                        project={project}
                        environments={environments}
                        flagCount={flagsByEnv[activeEnvironment?.id].length ?? 0}
                        totalStatusFlags={totalStatusFlags}
                    />
                ) : (
                    <AuditLogs />
                )}
            </div>
            <Toast/>
        </div>
    );
}

export default ProjectsInfo;