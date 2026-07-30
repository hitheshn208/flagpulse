import "./Sidebar.css"
function Sidebar(prop) {
    return (
        <div className={prop.collapsed ? "sidebar sidebar-collapsed" : "sidebar"}>
            <div className="sidebar-project">
                <p className="project-word">Project</p>
                <p className="project-name">{prop.name}</p>
            </div>

            <ul className="sidebar-options">
                <li className={prop.activeTab === "environments" ? "option active" : "option"} onClick={()=> prop.onTabChange("environments")}>
                    <span className="material-symbols-outlined option-icon" aria-hidden="true">settings</span>
                    <span className="option-label">Environments</span>
                </li>
                <li className={prop.activeTab === "flags" ? "option active" : "option"} onClick={()=> prop.onTabChange("flags")}>
                    <span className="material-symbols-outlined option-icon" aria-hidden="true">flag</span>
                    <span className="option-label">Flags</span>
                </li>
                <li className={prop.activeTab === "auditLogs" ? "option active" : "option"} onClick={()=> prop.onTabChange("auditLogs")}>
                    <span className="material-symbols-outlined option-icon" aria-hidden="true">history</span>
                    <span className="option-label">Audit log</span>
                </li>
                <li className={prop.activeTab === "settings" ? "option active" : "option"} onClick={()=> prop.onTabChange("settings")}>
                    <span className="material-symbols-outlined option-icon" aria-hidden="true">settings</span>
                    <span className="option-label">Settings</span>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;