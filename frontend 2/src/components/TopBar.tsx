import {
  Search,
  Bell,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { ActualEnvironment } from "../data";
import "./TopBar.css";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";


type Page =
  | "projects"
  | "flags"
  | "environments"
  | "settings"
  | "audit";

interface TopBarProps {
  currentPage: Page;
  onEnvChange: (env: ActualEnvironment) => void;
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

export default function TopBar({currentPage,onEnvChange,sidebarCollapsed,onToggleSidebar}: TopBarProps) {

  const currentProject = useSelector((state: RootState) => state.project.currentProject)
  const environments = useSelector((state:RootState)=> state.environment.environments)
  const currentEnv = useSelector((state:RootState)=> state.environment.currentEnv)

  const environmentColors = [
    "#60A5FA", 
    "#34D399", 
    "#FBBF24",
    "#F87171", 
    "#A78BFA", 
    "#22D3EE", 
    "#FB923C", 
    "#F472B6", 
    "#94A3B8", 
    "#4ADE80", 
  ];

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
          {environments.map((env, index) => {
            const active = currentEnv?.id === env.id;
            return (
              <button
                key={env.id}
                onClick={() => onEnvChange(env)}
                className={`env-button ${active ? "env-button--active" : ""}`}
                style={{"--env-color": environmentColors[index % environmentColors.length]} as React.CSSProperties}>
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