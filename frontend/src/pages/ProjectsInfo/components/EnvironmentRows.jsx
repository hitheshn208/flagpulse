import { useState } from "react";
import "./EnvironmentRows.css";

function EnvironmentRows(prop) {
    const [disabled, setDisabled] = useState(false);
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

    const borderTopColors = [ "green", "blue", "purple", "orange", "cyan", "pink", "red", "yellow", "indigo", "teal", "emerald", "rose"];

    return (
        <>        
            <div className={`env-card border-top-${borderTopColors[prop.index % borderTopColors.length]}`}>
                <div className="env-name"> <span className="material-symbols-outlined">{prop.icon}</span> {prop.name}</div>
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

        </>

    );
}

export default EnvironmentRows;