import { memo, useState } from "react";
import {toggleFlagValue} from "../../../services/flags.service.js"
import {Notify} from "../../../components/Toasts/Toast";
import "./FlagRows.css";

function FlagRows({ flag, handleFlagInfo, isSelected = false, activeEnv, setFlagsByEnv, loading }) {
    console.log("Redered rows");
    
    const [referenceTime] = useState(() => Date.now());

    const formatFlagType = (value) => {
        if (!value) {
            return "-";
        }

        return String(value).toLowerCase();
    };

    const formatUpdatedAt = (value) => {
        if (!value) {
            return "-";
        }

        const updatedDate = new Date(value);

        if (Number.isNaN(updatedDate.getTime())) {
            return "-";
        }

        const diffMs = referenceTime - updatedDate.getTime();

        if (diffMs < 0) {
            return "just now";
        }

        const diffMinutes = Math.floor(diffMs / 60000);

        if (diffMinutes < 1) {
            return "just now";
        }

        if (diffMinutes < 60) {
            return `${diffMinutes}m ago`;
        }

        const diffHours = Math.floor(diffMinutes / 60);

        if (diffHours < 24) {
            return `${diffHours}h ago`;
        }

        const diffDays = Math.floor(diffHours / 24);

        if (diffDays < 30) {
            return `${diffDays}d ago`;
        }

        return updatedDate.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const isEnabled = Boolean(flag?.is_enabled);
    const [isdisabled, setDisabled] = useState(false);

    const updateFlagEnabled = async (envId, flagId, nextEnabled) => {
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

    const handleToggleButton = (flag, nextEnabled) => {
        updateFlagEnabled(activeEnv?.id, flag.id, nextEnabled);
    };
    const key = flag.id ?? flag.key ?? flag.slug;
    const flagKey = flag.key ?? "-";
    const flagType = formatFlagType(flag.type);
    const updatedAt = formatUpdatedAt(flag.updated_at);
    const flagTypeClass = flagType !== "-" ? `flag_type_badge flag_type_badge_${flagType}` : "flag_type_badge flag_type_badge_unknown";

    return (
        <div className={isSelected ? "flag_row flag_row_selected" : "flag_row"} key={key} role="row" onClick={()=>{handleFlagInfo(flag)}}>
            <div className="flag_table_cell flag_table_cell_name">
                <p className="flag_name">{flag.name}</p>
                <code className="flag_key">{flagKey}</code>
            </div>

            <div className="flag_table_cell flag_table_cell_type">
                <span className={flagTypeClass}>{flagType}</span>
            </div>

            <div className="flag_table_cell flag_table_cell_updated">{updatedAt}</div>

            <div className="flag_table_cell flag_table_cell_status">
                <button
                    type="button"
                    className={isEnabled ? "flag_switch flag_switch_enabled" : "flag_switch"}
                    onClick={(event) => {
                        event.stopPropagation();
                        handleToggleButton(flag, !isEnabled);
                    }}
                    aria-pressed={isEnabled}
                    aria-label={`Toggle ${flag.name}`}
                    disabled={isdisabled}
                >
                    <span className="flag_switch_thumb" />
                </button>

                <span className="material-symbols-outlined flag_row_right_arrow">
                            arrow_forward_ios
                </span>
            </div>
        </div>
    );
}

function areEqual(prevProps, nextProps) {
    return (
        prevProps.flag === nextProps.flag &&
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.activeEnv?.id === nextProps.activeEnv?.id &&
        prevProps.setFlagsByEnv === nextProps.setFlagsByEnv
    );
}

export default memo(FlagRows, areEqual);
