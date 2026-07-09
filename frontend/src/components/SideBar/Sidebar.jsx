import "./Sidebar.css"
function Sidebar(prop) {
    return (
        <div className="sidebar">
            <p className="project-word">Project</p>
            <p className="project-name">{prop.name}</p>

            <ul className="sidebar-options">
                <li className={prop.activeTab === "environments" ? "option active" : "option"} onClick={()=> prop.onTabChange("environments")}>
                    <span className="material-symbols-outlined option-icon" aria-hidden="true">settings</span>
                    <span>Environments</span>
                </li>
                <li className={prop.activeTab === "flags" ? "option active" : "option"} onClick={()=> prop.onTabChange("flags")}>
                    <span className="material-symbols-outlined option-icon" aria-hidden="true">flag</span>
                    <span>Flags</span>
                </li>
                <li className={prop.activeTab === "auditLogs" ? "option active" : "option"} onClick={()=> prop.onTabChange("auditLogs")}>
                    <span className="material-symbols-outlined option-icon" aria-hidden="true">history</span>
                    <span>Audit log</span>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;