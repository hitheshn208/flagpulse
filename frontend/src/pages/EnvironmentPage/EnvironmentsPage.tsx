import { useState } from "react";
import { Copy, Check, Plus, Trash2, Ellipsis, Settings, TriangleAlert} from "lucide-react";
import { RotateCcw } from "lucide-react-motion";

import { type ActualEnvironment } from "../../data";
import "./EnvironmentPage.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import EnvIcon from "@/components/EnvIcon";
import CreateEnvironmentModal from "@/components/CreateEnvironmentModal";
import { deleteEnvironment, rotateEnvironmentKey } from "@/services/environment.service";
import { changeEnvironmentCountOfproject } from "@/features/projectSlice";
import { changeEnvironmentKey, removeEnvironment } from "@/features/environmentSlice";

interface EnvironmentsPageProps {
  onToast: (msg: string, type: "success" | "error" | "info") => void;
}

interface CopyBtnProps {
  text: string;
  onToast: (msg: string) => void;
}


function CopyBtn({ text, onToast }: CopyBtnProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).catch(() => {});

    setCopied(true);
    onToast("SDK key copied");

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <button className="copy-btn" onClick={handleCopy}>
      {copied ? <Check size={10} /> : <Copy size={10} />}

      {copied ? "Copied" : "Copy"}
    </button>
  );
}

interface RotateModalProps {
  env: ActualEnvironment;
  onClose: () => void;
  onConfirm: () => void;
}

function RotateModal({ env, onClose, onConfirm }: RotateModalProps) {
  return (
    <div className="rotate-modal-overlay">
      <div className="rotate-modal">
        <div className="rotate-modal__header">
          <div className="rotate-modal__icon">
            <TriangleAlert size={15} />
          </div>

          <h3>Rotate SDK Key ?</h3>
        </div>

        <p className="rotate-modal__description">
          Rotating the <strong>{env.name}</strong> SDK key will immediately
          invalidate the current key. <br/><br/>
          <span className="text-amber-300">Any clients using the old key will lose
          connectivity until updated.</span>
        </p>

        <div className="rotate-modal__actions">
          <button className="rotate-modal__confirm" onClick={onConfirm}>
            Rotate Key
          </button>

          <button className="rotate-modal__cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EnvironmentsPage({ onToast }: EnvironmentsPageProps) {
  const environments = useSelector(
    (state: RootState) => state.environment.environments,
  );
  const currentProject = useSelector(
    (state: RootState) => state.project.currentProject,
  );
  const dispatch = useDispatch();
  const [rotateTarget, setRotateTarget] = useState<ActualEnvironment | null>(null);
  const [createEnvModal, setCreateEnvModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ActualEnvironment | null>(
    null,
  );
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleRotate = async () => {
    if (!rotateTarget) return;
    try{
      const response = await rotateEnvironmentKey(rotateTarget.id);
      dispatch(changeEnvironmentKey({id: rotateTarget.id, sdk_key: response }))
      onToast(
        `SDK key rotated for ${rotateTarget.name}. Update your clients immediately.`,
        "info",
      );
    }catch(error){
      onToast(
        `Failed to change the SDK key`,
        "error",
      );
    }finally{
      setRotateTarget(null);
    }
  };

  const handleDelete = async (env: ActualEnvironment | null) => {
    if (!env || !currentProject) return;
    setDeleteLoading(true);
    try {
      await deleteEnvironment(currentProject?.id, env.id);
      dispatch(changeEnvironmentCountOfproject({ count: -1 }));
      dispatch(removeEnvironment({ id: env.id }));
      onToast(`${env.name} environment deleted successfully`, "success");
    } catch (error) {
      onToast("Failed to delete Environment", "error");
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
      setDeleteModal(false);
    }
  };

  return (
    <div className="environments-page">
      {/* Header */}
      <div className="environments-header">
        <div>
          <h1>Environments</h1>

          <p>Manage SDK keys and client connections per environment</p>
        </div>

        <button
          className="add-environment-btn"
          onClick={() => setCreateEnvModal(true)}
        >
          <Plus size={14} />
          Add Environment
        </button>
      </div>

      {/* Environment Cards */}
      <div className="environments-grid">
        {environments.map((env, index) => (
          <EnvCard
            key={env.id}
            env={env}
            index={index}
            onRotate={() => setRotateTarget(env)}
            onToast={onToast}
            onDelete={() => {
              setDeleteTarget(env);
              setDeleteModal(true);
            }}
          />
        ))}
      </div>

      {/* Rotate Modal */}
      {rotateTarget && (
        <RotateModal
          env={rotateTarget}
          onClose={() => setRotateTarget(null)}
          onConfirm={handleRotate}
        />
      )}

      {createEnvModal && (
        <CreateEnvironmentModal
          onClose={() => setCreateEnvModal(false)}
          onToast={onToast}
        />
      )}
      {deleteModal && (
        <DeleteEnvModal
          isLoading={deleteLoading}
          onClose={() => setDeleteModal(false)}
          deleteTarget={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget)}
        />
      )}
    </div>
  );
}

interface EnvCardProps {
  env: ActualEnvironment;
  onRotate: () => void;
  onToast: (msg: string, type: "success" | "error" | "info") => void;
  index: number;
  onDelete: () => void;
}

function EnvCard({ env, onRotate, onToast, onDelete, index }: EnvCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const maskedKey =
    env.sdk_key.slice(0, 4) + "••••••••••••••••" + env.sdk_key.slice(-4);

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
    <div
      className="env-card"
      style={{
        borderTopColor: environmentColors[index % environmentColors.length],
      }}
    >
      {/* Header */}
      <div className="env-card__header">
        <EnvIcon name={env.icon} size={20} />

        <span className="env-card__name">{env.name}</span>

        {/* Menu */}
        <div className="env-card__menu">
          <button
            className="env-card__menu-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Environment actions"
          >
            <Ellipsis size={18} />
          </button>

          {menuOpen && (
            <div className="env-card__dropdown">
              <button
                className="env-card__dropdown-item"
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                <Settings size={15} />
                Manage
              </button>

              <button
                className="env-card__dropdown-item env-card__dropdown-item--danger"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="env-card__url">
        {env.url ? <a href={env.url} target='_blank' className='hover:text-white'>{env.url}</a>: "No URL Provided"}
      </p>

      {/* SDK Key */}
      <div className="sdk-key">
        <div className="sdk-key__label">SDK KEY</div>

        <div className="sdk-key__row">
          <code>{maskedKey}</code>

          <CopyBtn text={env.sdk_key} onToast={(msg) => onToast(msg, "info")} />
        </div>
      </div>

      {/* Actions */}
      <div className="env-card__actions">
        <button className="rotate-key-btn" onClick={onRotate}>
          <RotateCcw size={11} trigger="parent-hover" />
          Rotate Key
        </button>
      </div>
    </div>
  );
}

function DeleteEnvModal({
  onClose,
  deleteTarget,
  onConfirm,
  isLoading,
}: {
  onClose: () => void;
  deleteTarget: ActualEnvironment | null;
  onConfirm: () => void;
  isLoading: boolean;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid #1E2926",
          borderRadius: 5,
          padding: 24,
          maxWidth: 420,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <h3
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              color: "#F0FDF4",
              margin: 0,
            }}
          >
            Delete Environment
          </h3>
        </div>
        <p
          style={{
            fontSize: 13,
            color: "#94A3A8",
            lineHeight: 1.6,
            marginBottom: 20,
          }}
        >
          Deleting{" "}
          <strong style={{ color: "#F0FDF4" }}>{deleteTarget?.name}</strong>{" "}
          will permanently remove all flag values for this environment. This
          cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              background: "rgb(200, 2, 2)",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "9px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Sora', sans-serif",
            }}
            disabled={isLoading}
          >
            Delete Environment
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: "transparent",
              border: "1px solid #1E2926",
              borderRadius: 6,
              padding: "9px",
              fontSize: 13,
              color: "#94A3A8",
              cursor: "pointer",
            }}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
