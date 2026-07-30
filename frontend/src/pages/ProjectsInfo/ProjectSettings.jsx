import { useState } from "react";
import "./ProjectSettings.css";
import { deleteProject, editProject } from "../../services/project.service";
import { Notify } from "../../components/Toasts/Toast";
import {useNavigate} from "react-router-dom";

// Props you'll wire up to your backend:
// project: { name, key, createdAt }
// stats: { environmentCount, flagCount, enabledCount, disabledCount }
// onRenameProject: (newName) => Promise
// onDeleteProject: () => Promise

export default function ProjectSettings({project, stats={}, environments, flagCount, totalStatusFlags}) {

    console.log(project);
    
    const navigate = useNavigate();
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameDraft, setNameDraft] = useState(project.name);
    const [newName, setNewName] = useState(project.name);
    const [savingName, setSavingName] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [deleting, setDeleting] = useState(false);

  const createdLabel = new Date(project.created_at).toLocaleDateString(
    undefined,
    { year: "numeric", month: "long", day: "numeric" }
  );

  const handleSaveName = async () => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === nameDraft) {
      setIsEditingName(false);
      setNameDraft(nameDraft);
      return;
    }
    try {
      setSavingName(true);
      const response = await editProject(project.id, {name: trimmed});
      setIsEditingName(false);
      setNameDraft(trimmed);
      setNewName(trimmed);
    Notify("success", response.message);
    } catch(e){
        if (e.response) {
            console.log(e.response.data.message);
            Notify("error", e.response.data.message);
        } else {
            Notify("error", "Network error");
        }
    } finally {
      setSavingName(false);
    }
  };

  const handleCancelName = () => {
    setNameDraft(nameDraft);
    setIsEditingName(false);
  };

  const handleDelete = async () => {
    if (confirmText !== nameDraft) return;
    try {
      setDeleting(true);
      const response = await deleteProject(project.id);
        Notify("success", response.message);
      navigate("/dashboard");
    } catch(e)  {
        if (e.response) {
            console.log(e.response.data.message);
            Notify("error", e.response.data.message);
        } else {
            Notify("error", "Network error");
        }
    }finally {
      setDeleting(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your project details and configuration</p>
      </div>

      {/* Overview stats */}
      <div className="settings-stats-row">
        <div className="stat-card">
          <span className="stat-icon material-symbols-outlined">language</span>
          <div>
            <div className="stat-value">{environments.length}</div>
            <div className="stat-label">Environments</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon material-symbols-outlined">flag_2</span>
          <div>
            <div className="stat-value">{flagCount}</div>
            <div className="stat-label">Total flags</div>
          </div>
        </div>
        <div className="stat-card">
            <div className="client-status client-status-active">
                <span className="client-status-dot"/>
            </div>
          <div>
            <div className="stat-value">{totalStatusFlags.enabled}</div>
            <div className="stat-label">Enabled</div>
          </div>
        </div>
        <div className="stat-card">
         <div className="client-status client-status-inactive">
                <span className="client-status-dot"/>
            </div>
          <div>
            <div className="stat-value">{totalStatusFlags.disabled}</div>
            <div className="stat-label">Disabled</div>
          </div>
        </div>
      </div>

      {/* General settings */}
      <div className="settings-card">
        <div className="settings-card-header">
          <h2>General</h2>
        </div>

        <div className="settings-row">
          <div className="settings-row-label">
            <span className="settings-label-title">Project name</span>
            <span className="settings-label-sub">
              Shown across the dashboard and audit log
            </span>
          </div>
          <div className="settings-row-control">
            {isEditingName ? (
              <div className="name-edit-group">
                <input
                  className="name-input"
                  value={newName}
                  autoFocus
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveName();
                    if (e.key === "Escape") handleCancelName();
                  }}
                />
                <button
                  className="btn btn-ghost"
                  onClick={handleCancelName}
                  disabled={savingName}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveName}
                  disabled={savingName}
                >
                  {savingName ? "Saving…" : "Save"}
                </button>
              </div>
            ) : (
              <div className="name-display-group">
                <span className="name-display">{nameDraft}</span>
                <button
                  className="icon-btn"
                  onClick={() => setIsEditingName(true)}
                  aria-label="Edit project name"
                >
                  ✎
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="settings-row">
          <div className="settings-row-label">
            <span className="settings-label-title">Project id</span>
            <span className="settings-label-sub">
              Used in API requests, can't be changed
            </span>
          </div>
          <div className="settings-row-control">
            <span className="key-chip">
              {/* <span className="key-icon">🔑</span> */}
              <code>{project.id}</code>
            </span>
          </div>
        </div>

        <div className="settings-row">
          <div className="settings-row-label">
            <span className="settings-label-title">Created</span>
            <span className="settings-label-sub">Project creation date</span>
          </div>
          <div className="settings-row-control">
            <span className="created-date">{createdLabel}</span>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="settings-card danger-card">
        <div className="settings-card-header">
          <h2>Danger zone</h2>
        </div>

        <div className="settings-row">
          <div className="settings-row-label">
            <span className="settings-label-title">Delete this project</span>
            <span className="settings-label-sub">
              Permanently deletes all environments, flags, SDK keys, and
              audit history. This can't be undone.
            </span>
          </div>
          <div className="settings-row-control">
            <button
              className="btn btn-danger"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete project
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete "{project.name}"?</h3>
            <p>
              This will permanently delete all environments, flags, SDK
              keys, and audit history for this project. Type{" "}
              <strong>{project.name}</strong> to confirm.
            </p>
            <input
              className="confirm-input"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={project.name}
              autoFocus
            />
            <div className="modal-actions">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText("");
                }}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                disabled={confirmText !== project.name || deleting}
                onClick={handleDelete}
              >
                {deleting ? "Deleting…" : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}