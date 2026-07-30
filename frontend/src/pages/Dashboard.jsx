import { useEffect, useState } from "react";
import { createProject, getProjects } from "../services/project.service.js";
import "./DashBoard.css"
import { Link } from "react-router-dom";
import { Notify, Toast } from "../components/Toasts/Toast.jsx";

function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [totalEnvs, setTotalEnvs] = useState(0);
    const [totalFlags, setTotalFlags] = useState(0);
    const [totalProjects, setTotalProjects] = useState(0);
    const [newProjectModal, setNewProjectModal] = useState(false);
    const [projectName, setprojectName] = useState("");
    const [createButtonDisabled, setCreateButtonDisabled] = useState(false);

    const closeModal = ()=>{
        setNewProjectModal(false);
        setprojectName("");
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try {
            setCreateButtonDisabled(true);
            const newProject = await createProject({name: projectName});
            console.log(newProject)
            setProjects(prev => [...prev, newProject]);
            setTotalEnvs(prev => prev + Number(newProject?.environments_count));
            setTotalFlags(prev => prev + Number(newProject?.flags_count));
            setTotalProjects(prev=> prev + 1);
        } catch (e) {
            if(e.response)
                Notify("error", e.response.data)
            else
                Notify("error", "Failed to create project");
        }finally{
            setNewProjectModal(false); 
            setCreateButtonDisabled(false);
            setprojectName("");
        }
    }

    useEffect(() => {
        async function fetchAllProjects() {
            try {
                const response = await getProjects();
                setTotalEnvs(0);
                setTotalFlags(0);
                setProjects(response);
                response.forEach(project => {
                    setTotalEnvs(prev => prev + Number(project?.environments_count));
                    setTotalFlags(prev => prev + Number(project?.flags_count));
                });
                setTotalProjects(response.length);
            } catch (e) {
                if (e.response)
                    Notify("error", e.response.data.message);
                else
                    Notify("error", "Network error");
            }
        }
        fetchAllProjects()
    }, [])

    const colors = [
        "#EC4899",
        "#8B5CF6",
        "#3B82F6",
        "#F59E0B",
        "#14B8A6",
        "#EF4444",
        "#22C55E",
        "#06B6D4",
        "#A855F7",
        "#F97316"
    ];

    return (
        <main className="dashboard">
            <section className="dashboard-header">
                <div className="dashboard-copy">
                    <h1>Welcome back, Hithesh</h1>
                    <p className="dashboard-subtitle">Overview of your projects.</p>
                </div>
                <button className="new-project-btn" type="button" onClick={()=> setNewProjectModal(true)}>
                    <span className="material-symbols-rounded">add</span>
                    New Project
                </button>
            </section>

            <section className="stats-grid">
                <article className="stat-card">
                    <div className="card-icon card-icon-projects">
                        <span className="material-symbols-rounded">folder</span>
                    </div>
                    <div>
                        <h4>Projects</h4>
                        <h2>{totalProjects}</h2>
                    </div>
                </article>

                <article className="stat-card">
                    <div className="card-icon card-icon-envs">
                        <span className="material-symbols-rounded">language</span>
                    </div>
                    <div>
                        <h4>Environments</h4>
                        <h2>{totalEnvs}</h2>
                    </div>
                </article>

                <article className="stat-card">
                    <div className="card-icon card-icon-flags">
                        <span className="material-symbols-rounded">flag</span>
                    </div>
                    <div>
                        <h4>Feature Flags</h4>
                        <h2>{totalFlags}</h2>
                    </div>
                </article>
            </section>

            <section className="projects-card">
                <div className="project-header">
                    <div>
                        {/* <p className="eyebrow">Projects table</p> */}
                        <h2>Projects</h2>
                    </div>
                    <span className="projects-count">{projects.length} total</span>
                </div>

                <div className="projects-table">
                    {projects.length === 0 ? (
                        <div className="projects-empty">
                            <h3>No projects yet</h3>
                            <p>Create your first project to start managing environments and feature flags.</p>
                        </div>
                    ) : (
                        projects.map((project, index) => {
                            const color = colors[index % colors.length];
                            const initials = project?.name
                                ?.split("")
                                .filter(Boolean)
                                .slice(0, 2)
                                .map((word) => word[0])
                                .join("")
                                .toUpperCase();

                            return (
                                <Link
                                    to={`/projects/${project.id}/environments`}
                                    className="project-link"
                                    key={project.id}
                                >
                                    <div className="project-row">
                                        <div className="project-left">
                                            <div className="project-avatar" style={{ background: color }}>
                                                {initials}
                                            </div>
                                            <div className="project-meta">
                                                <h3>{project.name}</h3>
                                                <span>{project?.updated || "Recently updated"}</span>
                                            </div>
                                        </div>
                                        <div className="project-row-envs">
                                            <h4>{project?.environments_count}</h4>
                                            <span className="material-symbols-rounded">language</span>
                                        </div>
                                        <div className="project-row-flags">
                                            <h4>{project?.flags_count}</h4>
                                            <span className="material-symbols-rounded">flag</span>
                                        </div>
                                        <span className="material-symbols-outlined arrow">chevron_right</span>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </section>

            <section className="quick-start">
                <div className="quick-left">
                    <h3>Quick Start</h3>
                    <p>Learn how to set up and use feature flags in your project.</p>
                    <button type="button">View Docs <span className="material-symbols-rounded">open_in_new</span></button>
                </div>

                <div className="steps">
                    {[
                        ["flag", "Create Flags", "Define feature flags for this project"],
                        ["language", "Add Environments", "Set up dev, staging, production"],
                        ["code", "Integrate SDK", "Add the SDK using your environment key"],
                        ["bar_chart", "Evaluate & Launch", "Toggle flags live, no redeploy needed"],
                    ].map((step) => (
                        <div className="step" key={step[1]}>
                            <span className="material-symbols-rounded">{step[0]}</span>
                            <h4>{step[1]}</h4>
                            {/* <p className="step-desc">{step[2]}</p> */}
                        </div>
                    ))}
                </div>
            </section>
            {
                newProjectModal && 
                <div className="new-project-modal-wrapper">
                    <div
                        className="new-project-modal-backdrop"
                        onClick={closeModal}
                    />
                    <div
                        className="new-project-modal-container"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="new-project-modal-close"
                            onClick={closeModal}
                        >
                            <span className="material-symbols-rounded">
                                close
                            </span>
                        </button>
                        <h2 className="new-project-modal-title">
                            New project
                        </h2>
                        <p className="new-project-modal-subtitle">
                            Create a new project to organize your feature flags, environment and SDKs.
                        </p>
                        <form onSubmit={(e)=>handleSubmit(e)}>
                            <div className="new-project-modal-field">
                                <label className="new-project-modal-label">
                                    Project name
                                </label>
                                <input
                                    className="new-project-modal-input"
                                    placeholder="Enter the project name"
                                    required
                                    value={projectName}
                                    onChange={(e)=> setprojectName(e.target.value)}
                                    minLength={2}
                                />
                            </div>
                            <div className="new-project-modal-actions">
                                <button
                                    className="new-project-modal-cancel-btn"
                                    onClick={closeModal}
                                    type="button"
                                >
                                    Cancel
                                </button>
                                <button className="new-project-modal-create-btn" type="submit" disabled={createButtonDisabled}>
                                    Create project
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            }
            <Toast/>
        </main>

    );
}

export default Dashboard;