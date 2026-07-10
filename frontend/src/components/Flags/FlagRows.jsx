import "./FlagRows.css";
import { useState } from "react";

function FlagRows({ flag, onToggle }) {
    
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

    const handleToggleButton = async (flag, isEnabled) => {
        try{
            setRowDisabled(true);
            const response = await onToggle?.(flag, !isEnabled);
            flag.is_enabled = response.is_enabled;
            setIsEnabled(response.is_enabled);
        }catch(e){
            console.log(e);
        }finally{
            setRowDisabled(false);
        }
    }
    const key = flag.id ?? flag.key ?? flag.slug;
    const [isEnabled, setIsEnabled] = useState(flag.is_enabled);
    const flagKey = flag.key ?? "-";
    const flagType = formatFlagType(flag.type);
    const updatedAt = formatUpdatedAt(flag.updated_at);
    const flagTypeClass = flagType !== "-" ? `flag_type_badge flag_type_badge_${flagType}` : "flag_type_badge flag_type_badge_unknown";

    const [rowDisabled, setRowDisabled] = useState(false);

    return (
        <div className={rowDisabled ? "flag_row disabled-row" : "flag_row"} key={key} role="row">
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
                    onClick={() => handleToggleButton(flag, isEnabled)}
                    aria-pressed={isEnabled}
                    aria-label={`Toggle ${flag.name}`}
                >
                    <span className="flag_switch_thumb" />
                </button>
            </div>
        </div>
    );
}

export default FlagRows;
