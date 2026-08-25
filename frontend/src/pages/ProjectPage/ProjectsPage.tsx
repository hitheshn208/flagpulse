import { Plus } from 'lucide-react'
import { type ActualProject } from '../../data'
import './ProjectsPage.css'
import { useState } from 'react'
import CreateProjectModal from '@/components/CreateProjectModal';

interface ProjectsPageProps {
  projects : ActualProject[];
  onSelectProject: (project: ActualProject) => void
  onToast: (
    msg: string,
    type: "success" | "error" | "info"
  ) => void;
}

export default function ProjectsPage({projects, onSelectProject, onToast}: ProjectsPageProps) {
  const [newProjectModal, setNewProjectModal] = useState(false);

  const totalFlags = projects.reduce(
    (sum, project) => sum + Number(project.flags_count),
    0
  )

  const totalEnvironments = projects.reduce(
    (sum, project) => sum + Number(project.environments_count),
    0
  )

  return (
    <main className="projects-page">
      {/* Header */}
      <header className="projects-header">
        <div className="projects-heading">
          <h1>Projects</h1>

          <p>Manage your projects and feature flags</p>

          <span className="projects-summary">
            {projects.length} projects · {totalFlags} flags ·{' '}
            {totalEnvironments} environments
          </span>
        </div>

        <button className="new-project-btn" type="button" onClick={()=>setNewProjectModal(true)}>
          <Plus size={15} />
          New Project
        </button>
      </header>

      {/* Project Cards */}
      <section className="projects-grid">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => onSelectProject(project)}
          />
        ))}
      </section>
      {newProjectModal && <CreateProjectModal onClose={()=>setNewProjectModal(false)} onToast={onToast}/>}
    </main>
  )
}

interface ProjectCardProps {
  project: ActualProject
  onClick: () => void
}

function ProjectCard({
  project,
  onClick,
}: ProjectCardProps) {

    const getDate = (date: string): string=>{
        return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <button
      className="project-card"
      type="button"
      onClick={onClick}
    >
      {/* Project identity */}
      <div className="project-card-header">
        <div>
          <h2>{project.name}</h2>

          <span className="project-key" onClick={(e) => e.stopPropagation()}>
            {project.slug}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="project-description">
        {project.description ? project.description:  project.name + " project"}
      </p>

      {/* Project stats */}
      <div className="project-stats">
        <div className="project-stat">
          <span className="project-stat-value">
            {project.flags_count}
          </span>

          <span className="project-stat-label">
            Flags
          </span>
        </div>

        <div className="project-stat-divider" />

        <div className="project-stat">
          <span className="project-stat-value">
            {project.environments_count}
          </span>

          <span className="project-stat-label">
            Environments
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="project-card-footer">
        <span>Created on {getDate(project.created_at)}</span>

        <span className="project-view">
          View project →
        </span>
      </div>
    </button>
  )
}