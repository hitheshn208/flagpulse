import { useState } from "react";
import {
  Copy,
  Check,
  RotateCcw,
  Plus,
  Users,
} from "lucide-react";

import { type ActualEnvironment } from "../../data";
import "./EnvironmentPage.css";

interface EnvironmentsPageProps {
  environments: ActualEnvironment[];
  onToast: (
    msg: string,
    type: "success" | "error" | "info"
  ) => void;
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
      {copied ? (
        <Check size={10} />
      ) : (
        <Copy size={10} />
      )}

      {copied ? "Copied" : "Copy"}
    </button>
  );
}

interface RotateModalProps {
  env: ActualEnvironment;
  onClose: () => void;
  onConfirm: () => void;
}

function RotateModal({
  env,
  onClose,
  onConfirm,
}: RotateModalProps) {
  return (
    <div className="rotate-modal-overlay">
      <div className="rotate-modal">
        <div className="rotate-modal__header">
          <div className="rotate-modal__icon">
            <RotateCcw size={15} />
          </div>

          <h3>Rotate SDK Key</h3>
        </div>

        <p className="rotate-modal__description">
          Rotating the{" "}
          <strong>{env.name}</strong> SDK key will
          immediately invalidate the current key. Any
          clients using the old key will lose connectivity
          until updated.
        </p>

        <div className="rotate-modal__actions">
          <button
            className="rotate-modal__confirm"
            onClick={onConfirm}
          >
            Rotate Key
          </button>

          <button
            className="rotate-modal__cancel"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EnvironmentsPage({
  environments,
  onToast,
}: EnvironmentsPageProps) {
  const [rotateTarget, setRotateTarget] =
    useState<ActualEnvironment | null>(null);

  const handleRotate = () => {
    if (!rotateTarget) return;

    setRotateTarget(null);

    onToast(
      `SDK key rotated for ${rotateTarget.name}. Update your clients immediately.`,
      "info"
    );
  };

  return (
    <div className="environments-page">
      {/* Header */}
      <div className="environments-header">
        <div>
          <h1>Environments</h1>

          <p>
            Manage SDK keys and client connections per
            environment
          </p>
        </div>

        <button className="add-environment-btn">
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
          />
        ))}

        {/* Add Environment Card */}
        {/* <button className="add-environment-card">
          <div className="add-environment-card__icon">
            <Plus size={14} />
          </div>

          <span>Add environment</span>
        </button> */}
      </div>

      {/* Rotate Modal */}
      {rotateTarget && (
        <RotateModal
          env={rotateTarget}
          onClose={() => setRotateTarget(null)}
          onConfirm={handleRotate}
        />
      )}
    </div>
  );
}

interface EnvCardProps {
  env: ActualEnvironment;
  onRotate: () => void;
  onToast: (
    msg: string,
    type: "success" | "error" | "info"
  ) => void;
  index: number
}

function EnvCard({
  env,
  onRotate,
  onToast,
  index
}: EnvCardProps) {
  const maskedKey = env.sdk_key.slice(0, 4) +"••••••••••••••••" +env.sdk_key.slice(-4);
  const borderTopColors = [ "rgb(130, 255, 128)", "rgb(56, 115, 255)", "rgb(210, 119, 255)", "orange", "cyan", "pink", "red", "yellow", "indigo", "teal", "emerald", "rose"];
  
  return (
    <div className="env-card" >
      {/* Header */}
      <div className="env-card__header">
        {/* <span className="env-card__status" /> */}
        <span className="material-symbols-outlined">{env.icon}</span>
        <span className="env-card__name">
          {env.name}
        </span>
      </div>

      <p className="env-card__description">
        Total flags {env.total_flags}
      </p>

      {/* Connected Clients */}
      <div className="connected-clients">
        <span className="connected-clients__status" />

        <Users size={12} />

        <span>
          <strong>
            {env.clients?.toLocaleString()}
          </strong>{" "}
          clients connected
        </span>
      </div>

      {/* SDK Key */}
      <div className="sdk-key">
        <div className="sdk-key__label">
          SDK KEY
        </div>

        <div className="sdk-key__row">
          <code>{maskedKey}</code>

          <CopyBtn
            text={env.sdk_key}
            onToast={(msg) => onToast(msg, "info")}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="env-card__actions">
        <button
          className="rotate-key-btn"
          onClick={onRotate}
        >
          <RotateCcw size={11} fontWeight={900}/>
          Rotate Key
        </button>

        <button
          className="manage-btn"
          onClick={() =>
            onToast(
              "Manage environment settings",
              "info"
            )
          }
        >
          Manage
        </button>
      </div>
    </div>
  );
}