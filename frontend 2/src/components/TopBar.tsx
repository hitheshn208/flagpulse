import {
  Search,
  Bell,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { type Project, type Environment, ActualProject } from "../data";
import "./TopBar.css";

type Page =
  | "projects"
  | "flags"
  | "environments"
  | "settings"
  | "audit";

interface TopBarProps {
  currentPage: Page;
  currentProject: ActualProject | undefined;
  currentEnv: Environment;
  environments: Environment[];
  onEnvChange: (env: Environment) => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

const PAGE_LABELS: Record<Page, string> = {
  projects: "Projects",
  flags: "Flags",
  environments: "Environments",
  settings: "Settings",
  audit: "Audit Log",
};

export default function TopBar({
  currentPage,
  currentProject,
  currentEnv,
  environments,
  onEnvChange,
  sidebarCollapsed,
  onToggleSidebar,
}: TopBarProps) {
  return (
    <header className="topbar">
      {/* Sidebar Toggle */}
      <button
        onClick={onToggleSidebar}
        className="topbar__icon-button"
      >
        {sidebarCollapsed ? (
          <PanelLeftOpen size={15} />
        ) : (
          <PanelLeftClose size={15} />
        )}
      </button>

      {/* Breadcrumb */}
      {currentPage !== "projects" ? (
        <nav className="topbar__breadcrumb">
          <span className="topbar__project-name">
            {currentProject?.name}
          </span>

          <ChevronRight
            size={12}
            className="topbar__breadcrumb-icon"
          />

          <span className="topbar__page-name">
            {PAGE_LABELS[currentPage]}
          </span>
        </nav>
      ) : (
        <span className="topbar__page-name">
          All Projects
        </span>
      )}

      <div className="topbar__spacer" />

      {/* Environment Switcher */}
      {currentPage !== "projects" && (
        <div className="env-switcher">
          {environments.map((env) => {
            const active = currentEnv.id === env.id;

            return (
              <button
                key={env.id}
                onClick={() => onEnvChange(env)}
                className={`env-button ${
                  active ? "env-button--active" : ""
                }`}
                style={
                  {
                    "--env-color": env.color,
                  } as React.CSSProperties
                }
              >
                <span className="env-button__dot" />
                {env.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Search */}
      <div className="topbar__search">
        <Search
          size={13}
          className="topbar__search-icon"
        />

        <input
          type="text"
          placeholder="Search flags..."
          className="topbar__search-input"
        />
      </div>

      {/* Notifications */}
      <button className="topbar__notification">
        <Bell size={15} />

        <span className="notification-dot" />
      </button>
    </header>
  );
}