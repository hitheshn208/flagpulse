import { useRef, useState, useEffect } from "react";
import "./EnvironmentRows.css";
import { deleteEnvironment } from "../../../services/environment.service";
import { Notify } from "../../../components/Toasts/Toast";

function EnvironmentRows(prop) {
    const [disabled, setDisabled] = useState(false);
    const [open, setOpen] = useState(false);
    const [deleteModal, setDeletemodal] = useState(false);
    const menuRef = useRef(null);
    const clientCount = Number(prop.clientCount) || 0;
    const hasClients = clientCount > 0;

    const maskSdkKey = (sdkKey) => {
        if (!sdkKey) {
            return "";
        }

        if (sdkKey.length <= 10) {
            return sdkKey;
        }

        return `${sdkKey.slice(0, 8)}${"•".repeat(12)}${sdkKey.slice(-4)}`;
    };

    const copyToClipboard = async (sdkKey) => {
        try {
            setDisabled(true);
            await navigator.clipboard.writeText(sdkKey);
            setTimeout(()=> setDisabled(false), 1500);
        } catch (err) {
            console.error("Copy failed ", err);
        }
    };

    useEffect(() => {
        function handleClick(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, []);

    const handleDelete = async ()=>{
        try {
            setDisabled(true);
            console.log(prop.id, prop.ProjectId);
            const response = await deleteEnvironment(prop.ProjectId, prop.id);
            prop.setEnvironments(prev =>
                prev.filter(env => env.id !== prop.id)
            );
            prop.setFlagsByEnv(prev => {
                const updated = { ...prev };
                delete updated[prop.id];
                return updated;
            });
            Notify("success", response.message);
        } catch (e) {
            if (e.response) {
                console.log(e.response.data.message);
                Notify("error", e.response.data.message);
            } else {
                Notify("error", "Network error");
            }
        }finally{
            setDeletemodal(false);
            setOpen(false);
            setDisabled(false);
        }
    }

    const borderTopColors = [ "green", "blue", "purple", "orange", "cyan", "pink", "red", "yellow", "indigo", "teal", "emerald", "rose"];

    return (
        <>        
            <div className={`env-card border-top-${borderTopColors[prop.index % borderTopColors.length]}`}>
                <div ref={menuRef}>
                <button onClick={() => setOpen(prev => !prev)} className="env-card-menu-button"><span className="material-symbols-outlined">more_vert</span></button>
                    <div className={open ? "env-card-menu env-card-menu-open" : "env-card-menu"}>
                        {/* <button>Edit</button> */}
                        <button onClick={()=>setDeletemodal(true)}><span className="material-symbols-outlined">delete</span>Delete</button>
                    </div>
                </div>
                <div className="env-name"> <span className="material-symbols-outlined">{prop.icon}</span> {prop.name}</div>
                <div className={hasClients ? "client-status client-status-active" : "client-status client-status-inactive"}>
                    <span className="client-status-dot" />
                    <span className="client-status-text">
                        {hasClients ? `${clientCount} clients connected` : "No clients connected"}
                    </span>
                </div>
                <div className="sdk-key-heading">SDK key</div>
                <div className="sdk-key-container">
                    <span className="material-symbols-outlined sdk-key-icon">vpn_key</span>
                    <code className="sdk-key">{maskSdkKey(prop.sdk_key)}</code>
                    <button className="copy-btn" disabled={disabled} onClick={()=> copyToClipboard(prop.sdk_key)}>
                        <span className="material-symbols-outlined copy-icon">{disabled ? "check" : "content_copy"}</span>
                    </button>
                </div>
                <div className="flags">{prop.total_flags} flags configured</div>
                <button className="regenerate-key-btn">
                    <span className="material-symbols-outlined">cached</span>Rotate Key
                </button>
            </div>
            {deleteModal &&
                <div className="modal-overlay">
                    <div className="delete-modal">
                        <div className="modal-header">
                            <div>
                                <h2>
                                    <div className="danger-icon">
                                        <span className="material-symbols-outlined">delete</span>
                                    </div>Delete Environment
                                </h2>
                            </div>
                            <p>
                                This action cannot be undone. All flags and SDK keys associated with
                                <strong> {prop.name}</strong> will be permanently removed.
                            </p>
                        </div>

                        <div className="warning-box">
                        <span className="material-symbols-outlined">warning</span>
                        Make sure this environment is no longer being used by any application.
                        </div>

                        <div className="modal-actions">
                        <button className="btn secondary" onClick={()=>setDeletemodal(false)}>Cancel</button>
                        <button className="btn danger" onClick={handleDelete} disabled={disabled}>
                            <span className="material-symbols-outlined">delete</span>
                            Delete Environment
                        </button>
                        </div>
                    </div>
                </div>}
        </>

    );
}

export default EnvironmentRows;