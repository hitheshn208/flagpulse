import { Plus } from 'lucide-react'
import { PROJECTS, type Project, type ActualProject } from '../../data'
import './ProjectsPage.css'
import { useEffect, useState } from 'react'

interface ProjectsPageProps {
  projects : ActualProject[];
  onSelectProject: (project: ActualProject) => void
}

export default function ProjectsPage({
  projects,
  onSelectProject,
}: ProjectsPageProps) {


  const totalFlags = PROJECTS.reduce(
    (sum, project) => sum + project.flagCount,
    0
  )

  const totalEnvironments = PROJECTS.reduce(
    (sum, project) => sum + project.envCount,
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
            {PROJECTS.length} projects · {totalFlags} flags ·{' '}
            {totalEnvironments} environments
          </span>
        </div>

        <button className="new-project-btn" type="button">
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

          <span className="project-key">
            {project.slug}
          </span>
        </div>
{/* 
        <span className="project-arrow" aria-hidden="true">
          →
        </span> */}
      </div>

      {/* Description */}
      <p className="project-description">
        {project.description ?? project.name + " project"}
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