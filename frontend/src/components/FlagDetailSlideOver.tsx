import { X, Copy, Check, Clock, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { ActualFlag, AuditLog, type FlagEnvironmentValue } from "../data";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { deleteflag, editFlagValue, getFlagEnvironmentValues, getFlagLogs, toggleFlagValue } from "@/services/flag.service";
import "./FlagDetailSlideOver.css";
import { removeFlag, setEditValue, setToggleValue } from "@/features/flagSlice";
import { changeFlagCountOfproject } from "@/features/projectSlice";
import FlagEnvironments from "./FlagEnvironments";
import EnvIcon from "./EnvIcon";

interface FlagDetailProps {
  onClose: () => void;
  onToast: (msg: string, type: "success" | "error" | "info") => void;
}

const ENVIRONMENT_COLORS = [
  "var(--env-1)",
  "var(--env-2)",
  "var(--env-3)",
  "var(--env-4)",
  "var(--env-5)",
  "var(--env-6)",
  "var(--env-7)",
  "var(--env-8)",
  "var(--env-9)",
  "var(--env-10)",
];

function formatDate(dateString?: string) {
  if (!dateString) return "—";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(dateString?: string) {
  if (!dateString) return "—";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

  

function CopyButton({ text, onCopy }: { text?: string; onCopy: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text ?? "").catch(() => {});

    setCopied(true);
    onCopy();

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <button
      type="button"
      className="copy-button"
      onClick={handleCopy}
      aria-label="Copy flag key"
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
    </button>
  );
}

export default function FlagDetailSlideOver({
  onClose,
  onToast,
}: FlagDetailProps) {
  const [flagEnvironmentsValues, setFlagEnvironmentsValues] = useState<
    FlagEnvironmentValue[]
  >([]);
  const [flagAuditLogs, setFlagAuditLogs] = useState<AuditLog[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const flag = useSelector((state: RootState) => state.flag.selectedFlag);
  const dispatch = useDispatch();

  const fetchFlagEnvironmentValues = async (flagId: string) => {
    try {
      const response = await getFlagEnvironmentValues(flagId);
      setFlagEnvironmentsValues(response);
    } catch (error) {
      onToast("Failed to load flag environments", "error");
    }
  };

  const fetchFlagLogs = async (flagId: string) => {
    try{
      const response = await getFlagLogs(flagId)
      setFlagAuditLogs(response);
    }catch(error){
      onToast("Failed to fetch recent activity", "error");
    }
  }

  useEffect(() => {
    if (!flag) return;
    fetchFlagEnvironmentValues(flag.id);
    fetchFlagLogs(flag.id)
  }, [flag?.id]);


  if (!flag) return null;

  const handleDelete = async (flagId: string) => {
    setDeleteLoading(true);
    try {
      const response = await deleteflag(flagId);
      dispatch(removeFlag({ envIds: response.envIds, flagId: flag.id }));
      dispatch(changeFlagCountOfproject({ count: -1 }));
    } catch (error) {
      onToast("Failed to delete the flag", "error");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      onClose();
    }
  };

  const toggleFlag = async (flagId : string, environmentId : string, isEnabled : boolean) => {
    setEditLoading(true);
    try {
      await toggleFlagValue(environmentId, flagId, isEnabled)
      dispatch(setToggleValue({envId: environmentId, flagId: flagId, value: isEnabled}));
      setFlagEnvironmentsValues((prev) => prev.map(flag=>
        flag.environment_id === environmentId ?
        {...flag, is_enabled: isEnabled}
        : flag))
    } catch (e) {
      onToast(`Failed to ${isEnabled ? "enable" : "disable"} the flag`,'error')
    }finally{
      setTimeout(()=> setEditLoading(false), 2000);
    }
  }

  const handleSave =  async (flag : FlagEnvironmentValue, environmentId : string, data: string | object | number | boolean) => {
    setEditLoading(true);
    try{
      const payload : Pick<ActualFlag, "is_enabled" | "rollout_percentage" | "targeting_attribute" | "targeting_return_value" | "targeting_value"> = {
        targeting_return_value: data,
        is_enabled: flag.is_enabled,
        rollout_percentage: flag.rollout_percentage,
        targeting_attribute: flag.targeting_attribute,
        targeting_value: flag.targeting_value
      }
      const response = await editFlagValue(flag.flag_id, environmentId, payload)
      setFlagEnvironmentsValues((prev)=> prev.map(f=>
        f.environment_id === environmentId ?
        {...f, ...response} :
        f));
      dispatch(setEditValue({envId: environmentId, flagId: flag.flag_id, data: response}))
    }catch(error){
      onToast(`Error when changing falg value in ${flag.environment_name} environment`, "error")
    }finally{
      setTimeout(()=> setEditLoading(false), 2000);
    }
  }

  return (
    <div className="flag-detail-overlay">
      <div className="flag-detail-panel">
        {/* =========================
            Header
        ========================= */}

        <div className="flag-detail-header">
          <div className="flag-detail-heading">
            <div className="flag-title-row">
              <span className="flag-detail-name">{flag.name}</span>

              <span className={`detail-type-badge type-${flag.type}`}>
                {flag.type}
              </span>
            </div>

            <div className="flag-key-row">
              <code className="detail-flag-key">{flag.key}</code>

              <CopyButton
                text={flag.key}
                onCopy={() => onToast("Key copied to clipboard", "info")}
              />
            </div>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* =========================
            Body
        ========================= */}

        <div className="flag-detail-body">
          {/* Description */}

          <p className="flag-description">
            {flag.description || "No description provided."}
          </p>

          {/* Metadata */}

          <div className="flag-meta">
            <div className="meta-card">
              <div className="meta-label">CREATED</div>

              <div className="meta-value">{formatDate(flag.created_at)}</div>

              <div className="meta-subvalue">
                {formatDateTime(flag.created_at)}
              </div>
            </div>

            <div className="meta-card">
              <div className="meta-label">LAST MODIFIED</div>

              <div className="meta-value">{formatDate(flag.updated_at)}</div>

              <div className="meta-subvalue">
                {formatDateTime(flag.updated_at)}
              </div>
            </div>
          </div>

          {/* =========================
              Environments
          ========================= */}

          <FlagEnvironments
            flag={{
              id: flag.id,
              type: flag.type
            }}
            environments={flagEnvironmentsValues}
            onToggle={toggleFlag}
            onSaveValue={handleSave}
            editLoading={editLoading}
          />

          {/* =========================
              Recent Activity
          ========================= */}

          <section className="detail-section">
            <div className="section-label">RECENT ACTIVITY</div>

            <div className="activity-list">
              {flagAuditLogs.length === 0 && <div className="no-flag-activity">No Recent Activity</div>}
              {flagAuditLogs.map((log, index)=>
                <ActivityItem log={log} key={index + log.id} isLast={flagAuditLogs.length === index+1}/>
              )}
            </div>
          </section>
        </div>

        {/* =========================
            Footer
        ========================= */}

        <div className="flag-detail-footer">
          <button
            type="button"
            className="save-button"
            onClick={onClose}
          >
            Save Changes
          </button>

          <button
            type="button"
            className="delete-button"
            onClick={() => setShowDeleteModal(true)}
            disabled={deleteLoading}
          >
            {" "}
            Delete
          </button>
        </div>

        {showDeleteModal && (
          <div className="delete-modal-overlay">
            <div
              className="delete-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-flag-title"
            >
              <div className="delete-modal-content">
                <h2 id="delete-flag-title">Delete flag?</h2>

                <p>
                  This will permanently delete <strong>{flag.name}</strong> and
                  remove it from all environments.
                </p>

                <p className="delete-modal-warning">
                  This action cannot be undone.
                </p>
              </div>

              <div className="delete-modal-actions">
                <button
                  type="button"
                  className="delete-cancel-button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="delete-confirm-button"
                  onClick={() => handleDelete(flag?.id)}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting.." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =================================
   Activity Item
================================= */

function getActivityText(log: AuditLog) {
  if (log.type === "flag_creation")
    return <span><strong>Flag created</strong></span>;

  if (log.type === "flag_toggle")
    return (
      <span>
        <strong>Flag {log.new_value === "true" ? "enabled" : "disabled"}</strong>{" "}
        in {log.environment_name} environment
      </span>
    );

  if (log.type === "flag_updation")
    return (
      <span>
        <strong>Flag value changed</strong> in {log.environment_name} environment
        {/* {log.old_value !== null && log.new_value !== null && (
          <span className="activity-diff">
            {log.old_value} <ArrowRight size={10} /> {log.new_value}
          </span>
        )} */}
      </span>
    );
}

interface ActivityItemProps {
  log: AuditLog
  isLast: boolean
}

function ActivityItem({
  log,
  isLast
}: ActivityItemProps) {
    
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const difference = now.getTime() - date.getTime();

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

   const formatAbsoluteTime = (dateString: string) =>
    new Date(dateString).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const avatarClass =
    log.type === "flag_toggle"
      ? log.new_value === "true"
        ? "activity-avatar enabled"
        : "activity-avatar disabled"
      : "activity-avatar";

  return (
    <div className={`activity-item ${isLast ? "last" : ""}`}>
      {!isLast && <div className="activity-line" />}
      <div className={avatarClass}>
        <EnvIcon name={log.type} size={16} />
      </div>

      <div className="activity-content">
        <span className="activity-text">{getActivityText(log)}</span>

        <div className="activity-time" title={formatAbsoluteTime(log.created_at)}>
          <Clock size={10} />
          {formatRelativeTime(log.created_at)}
        </div>
      </div>
    </div>
  );
}