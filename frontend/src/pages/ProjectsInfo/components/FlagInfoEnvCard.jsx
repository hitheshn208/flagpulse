import { memo, useEffect, useState } from "react";
import {editFlag, toggleFlagValue} from "../../../services/flags.service.js"
import {Notify} from "../../../components/Toasts/Toast";
import "./FlagInfoEnvCard.css";

function FlagInfoEnvCard({ flag, environment, setFlagsByEnv }) {
    console.log("rendered env");
    console.log(flag?.targeting_return_value, "it's type is ", typeof flag?.targeting_return_value);
    
    const [isEditing, setEditing] = useState(false);
    const [draftValue, setDraftValue] = useState(flag?.targeting_return_value ?? "");
    const [isdisabled, setDisabled] = useState(false);
    const [isBackendCall, setBackendCall] = useState(false);

    useEffect(() => {
        setDraftValue(flag?.targeting_return_value ?? "");
        setEditing(false);
    }, [flag?.id, flag?.targeting_return_value]);

    const type = flag?.type ?? "string";
    const isEnabled = Boolean(flag?.is_enabled);
    const displayValue = type === "boolean"
        ? String(flag?.targeting_return_value === true || flag?.targeting_return_value === "true")
        : flag?.targeting_return_value ?? "";

    const handleToggleBoolean = (nextValue) => {
        setDraftValue(nextValue);
    };

    const handleToggleStatus = async (envId, flagId, nextEnabled) => {
        setDisabled(true);
        if (!envId) {
            return;
        }
        try{
            await toggleFlagValue(envId, flagId, nextEnabled)
    
            setFlagsByEnv(prev => ({
                ...prev,
                [envId]: (prev[envId] ?? []).map(item => (
                    item.id === flagId ? { ...item, is_enabled: nextEnabled } : item
                ))
            }));
        }catch(e){
            Notify("error", "Failed to change status")
        }finally{
            setTimeout(()=>setDisabled(false), 1000);
        }
    };

    const handleSave = async () => {
        try {
            if(draftValue === flag?.targeting_return_value)
                return;

            setBackendCall(true);
            const payload = {
                is_enabled : flag?.is_enabled,
                rollout_percentage: flag?.rollout_percentage,
                targeting_attribute: flag?.targeting_attribute,
                targeting_value: flag?.targeting_value,
                targeting_return_value: draftValue
            }
            await editFlag(environment?.id, flag?.id, payload);
            setFlagsByEnv(prev => ({
                ...prev,
                [environment?.id]: (prev[environment?.id] ?? []).map(item => (
                    item.id === flag?.id ? { ...item,  
                        targeting_return_value: draftValue  //We can add other parameters later like roll_out and all
                    } : item
                ))
            }));
            Notify("success", "Flag value updated");
        } catch (e) {
            if (e.response) {
                console.log(e.response.data.message);
                Notify("error", e.response.data.message);
            } else {
                Notify("error", "Network error");
            }
            setDraftValue(flag?.targeting_return_value);
        }finally{
            setEditing(false);
            setBackendCall(false);
        }
        
    };

    const handleCancel = () => {
        setDraftValue(flag?.targeting_return_value ?? "");
        setEditing(false);
    };

    return (
        <div className="flag-info-env-card">
            <div className="flag-info-env-card__header">
                <div>
                    <div className="flag-info-env-heading"><span className="material-symbols-outlined" aria-hidden="true">{environment?.icon}</span>{environment?.name}</div>
                    {/* <div className="flag-info-env-subtitle">{type}</div> */}
                </div>

                <div className="flag-info-env-card__actions">
                    <button
                        type="button"
                        className={isEnabled ? "flag_switch flag_switch_enabled" : "flag_switch"}
                        onClick={(event) => {
                            event.stopPropagation();
                            handleToggleStatus(flag?.environment_id, flag?.id, !isEnabled);
                        }}
                        aria-pressed={isEnabled}
                        aria-label={`Toggle ${environment?.name} status`}
                        disabled={isdisabled}
                    >
                        <span className="flag_switch_thumb" />
                    </button>

                    <button type="button" className="env-edit-button env-edit-button--icon" onClick={() => setEditing(true)} aria-label={`Edit ${environment?.name}`}>
                        <span className="material-symbols-outlined" aria-hidden="true">edit</span>
                    </button>
                </div>
            </div>

            {isEditing ? (
                <div className="flag-info-env-card__editor">
                    {type === "boolean" ? (
                        <div className="flag-info-env-boolean-group" role="group" aria-label={`Boolean value for ${environment?.name}`}>
                            <button
                                type="button"
                                className={draftValue === true || draftValue === "true" ? "flag-info-env-choice flag-info-env-choice--active" : "flag-info-env-choice"}
                                onClick={() => handleToggleBoolean(true)}
                            >
                                true
                            </button>
                            <button
                                type="button"
                                className={draftValue === false || draftValue === "false" ? "flag-info-env-choice flag-info-env-choice--active" : "flag-info-env-choice"}
                                onClick={() => handleToggleBoolean(false)}
                            >
                                false
                            </button>
                        </div>
                    ) : type === "number" ? (
                        <input
                            type="number"
                            inputMode="decimal"
                            className="flag-info-env-input"
                            value={draftValue}
                            onChange={(event) => setDraftValue(event.target.value)}
                        />
                    ) : (
                        <input
                            type="text"
                            className="flag-info-env-input"
                            value={draftValue}
                            onChange={(event) => setDraftValue(event.target.value)}
                        />
                    )}

                    <div className="save-and-cancel-button-container">
                        <button type="button" className="flag-info-env-button flag-info-env-button--primary" onClick={handleSave} disabled={isBackendCall}>
                            Save
                        </button>
                        <button type="button" className="flag-info-env-button flag-info-env-button--secondary" onClick={handleCancel} disabled={isBackendCall}>
                            Cancel
                        </button>
                    </div>

                    <p className="flag-info-env-help">Editing value for this environment only</p>
                </div>
            ) : (
                <div className="flag-info-env-card__viewer">
                    <div className={`flag-info-env-value flag-info-env-${flag.type}`}>{draftValue.toString()}</div>
                </div>
            )}
        </div>
    );
}

function areEqual(prevProps, nextProps) {
    return (
        prevProps.flag === nextProps.flag &&
        prevProps.environment === nextProps.environment &&
        prevProps.setFlagsByEnv === nextProps.setFlagsByEnv
    );
}

export default memo(FlagInfoEnvCard, areEqual);