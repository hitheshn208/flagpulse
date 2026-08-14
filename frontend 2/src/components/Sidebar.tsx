import {
  Flag,
  Globe,
  Settings,
  ScrollText,
  ChevronDown,
  LogOut,
  Zap,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import { ActualProject, type Project } from "../data";
import "./Sidebar.css";
import { RootState } from "@/app/store";

type Page =
  | "projects"
  | "flags"
  | "environments"
  | "settings"
  | "audit";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onProjectChange: (project: ActualProject) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const NAV = [
  { key: "flags" as Page, label: "Flags", icon: Flag },
  { key: "environments" as Page, label: "Environments", icon: Globe },
  { key: "audit" as Page, label: "Audit Log", icon: ScrollText },
  { key: "settings" as Page, label: "Settings", icon: Settings },
];

export default function Sidebar({
  currentPage,
  onNavigate,
  onProjectChange,
  collapsed,
}: SidebarProps) {

  const currentProject = useSelector((state: RootState) => state.project.currentProject)
  const projects = useSelector((state:RootState)=> state.project.projects)

  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <Zap size={14} fill="var(--color-text-primary)" stroke="none" />
        </div>

        {!collapsed && (
          <span className="sidebar__logo-text">
            FlagPulse
          </span>
        )}
      </div>

      {/* Project Switcher */}
      {!collapsed && (
        <div className="project-switcher">
          <div className="project-switcher__label">
            Project
          </div>

          <div className="project-select-wrapper">
            <select
              value={currentProject?.id}
              onChange={(e) => {
                const project = projects.find(
                  (p) => p.id === e.target.value
                );

                if (project) {
                  onProjectChange(project);
                }
              }}
              className="project-select"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            <ChevronDown
              size={13}
              className="project-select__icon"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar__nav">
        {/* Projects */}
        <button
          onClick={() => onNavigate("projects")}
          className={`nav-item ${
            currentPage === "projects" ? "nav-item--active" : ""
          }`}
        >
          <Globe size={15} />

          {!collapsed && <span>Projects</span>}
        </button>

        {!collapsed && (
          <div className="nav-section-title">
            Current Project
          </div>
        )}

        {collapsed && <div className="nav-spacer" />}

        {NAV.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            className={`nav-item ${
              currentPage === key ? "nav-item--active" : ""
            }`}
          >
            <Icon size={15} />

            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="sidebar__user">
        <div className="user-avatar">
          AK
        </div>

        {!collapsed && (
          <>
            <div className="user-info">
              <div className="user-name">
                Arjun Kapoor
              </div>

              <div className="user-role">
                Admin
              </div>
            </div>

            <button className="logout-button">
              <LogOut size={13} />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}