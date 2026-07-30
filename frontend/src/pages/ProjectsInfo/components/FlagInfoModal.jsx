import { useEffect, useMemo, useState } from "react";
import "./FlagInfoModal.css";
import FlagInfoEnvCard from "./FlagInfoEnvCard";
import { Notify } from "../../../components/Toasts/Toast";
import { deleteflag } from "../../../services/flags.service";

function FlagInfoModal({
    isOpen,
    flag = null,
    onClose,
    onDeleteFlag,
    flagsByEnv,
    setFlagsByEnv,
    environments
}) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        setShowDeleteConfirm(false);
    }, [flag?.id]);

    const flagTypeLabel = useMemo(() => {
        if (!flag?.type) {
            return "Unknown";
        }

        return flag.type.charAt(0).toUpperCase() + flag.type.slice(1);
    }, [flag?.type]);

    const handleDelete = async (flagId) => {
        try {
            await deleteflag(flagId);
            setFlagsByEnv(prev => {
                const updated = {};
                for (const envId in prev) {
                    updated[envId] = prev[envId].filter(flag => flag.id !== flagId);
                }
                return updated;
            });
            onClose?.();
        } catch (e) {
            if (e.response) {
                console.log(e.response.data.message);
                Notify("error", e.response.data.message);
            } else {
                Notify("error", "Network error");
            }
        }finally{
            setShowDeleteConfirm(false);
        }
    };

    return (
        <>
            <aside
                className={isOpen ? "flag-info-container flag-info-open" : "flag-info-container flag-info-closed"}
                aria-hidden={!isOpen}
            >
                <div className="flag-info-header">
                    <div className="flag-info-heading-copy">
                        <p className="flag-info-title">Flag details</p>
                        <p className="flag-info-name">{flag?.name ?? "Select a flag"}</p>
                        <p className="flag-info-key">{flag?.key}</p>
                    </div>

                    <button type="button" className="flag-info-close" onClick={onClose} aria-label="Close flag details">
                        <span className="material-symbols-outlined" aria-hidden="true">close</span>
                    </button>
                </div>

                <div className="flag-info-summary-card">
                    <div className="flag-info-summary-row">
                        <span className="flag-info-summary-label">Type</span>
                        <span className="flag-info-summary-value">{flagTypeLabel}</span>
                    </div>

                    <div className="flag-info-summary-row">
                        <span className="flag-info-summary-label">Description</span>
                        <span className="flag-info-summary-value flag-info-summary-value--description">
                            {flag?.description || "No description provided."}
                        </span>
                    </div>
                </div>

                <div className="flag-info-section">
                    <div className="flag-info-section-header">
                        <p className="flag-info-section-title">Environments</p>
                        <p className="flag-info-section-caption">Edit the value per environment.</p>
                    </div>

                    <div className="flag-info-environments-container">
                        {flag && environments.map(env => {
                            const envFlag = flagsByEnv?.[env.id]?.find(ele => ele?.id === flag.id);

                            if (!envFlag) {
                                return null;
                            }

                            return (
                                <FlagInfoEnvCard
                                    key={`${envFlag.id}-${env.id}`}
                                    flag={envFlag}
                                    environment={env}
                                    setFlagsByEnv={setFlagsByEnv}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="flag-info-footer">
                    <p><span className="material-symbols-outlined">warning</span>
                    This flag is live. Deleting it will remove it from all environments.</p>
                    <button
                        type="button"
                        className="flag-info-delete-button"
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={!flag}
                    >
                        Delete flag
                    </button>
                </div>
            </aside>

            {showDeleteConfirm && (
                <div className="flag-delete-modal" role="dialog" aria-modal="true" aria-labelledby="flag-delete-title">
                    <div className="flag-delete-modal__backdrop" onClick={() => setShowDeleteConfirm(false)} aria-hidden="true" />
                    <div className="flag-delete-modal__panel">
                        <p className="flag-delete-modal__eyebrow">Danger zone</p>
                        <h3 id="flag-delete-title" className="flag-delete-modal__title">
                            Delete {flag?.name ?? "this flag"} flag?
                        </h3>
                        <p className="flag-delete-modal__description">
                            This flag is live. Deleting it will remove it from every environment.
                        </p>

                        <div className="flag-delete-modal__actions">
                            <button
                                type="button"
                                className="flag-delete-modal__button flag-delete-modal__button--secondary"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="flag-delete-modal__button flag-delete-modal__button--danger"
                                onClick={() => handleDelete(flag?.id)}
                            >
                                Delete flag
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default FlagInfoModal;