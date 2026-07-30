import { useState } from "react";
import "./NewEnvironmentModal.css";
import Loader from "../../../components/Loaders/Loader";

const DEFAULT_ICONS = [
    { label: "Code", value: "code_xml" },
    { label: "Science", value: "science" },
    { label: "Rocket", value: "rocket_launch" },
    { label: "Global", value: "public" },
    { label: "Bug", value: "bug_report" },
    { label: "Settings", value: "settings" },
];

function NewEnvironmentModal({
    open = true,
    onClose,
    onCreate,
    defaultIcon = DEFAULT_ICONS[0].value,
    title = "New environment",
    description = "Environments let you manage flags separately per stage.",
    iconOptions = DEFAULT_ICONS,
}) {
    const [environmentName, setEnvironmentName] = useState("");
    const [loading, setLoading] = useState(false)
    const [selectedIcon, setSelectedIcon] = useState(defaultIcon);

    if (!open) {
        return null;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        await onCreate?.({
            name: environmentName.trim(),
            icon: selectedIcon,
        });
        setLoading(false);
    };

    const handleClose = ()=>{
        onClose();
        setEnvironmentName("")
        setSelectedIcon(defaultIcon);
    }

    return (
        <div className="new-environment-modal" role="dialog" aria-modal="true" aria-labelledby="new-environment-title">
            <div className="new-environment-modal__backdrop" onClick={handleClose} aria-hidden="true" />

            <form className="new-environment-modal__panel" onSubmit={handleSubmit}>
                <div className="new-environment-modal__header">
                    <div>
                        <h2 id="new-environment-title" className="new-environment-modal__title">{title}</h2>
                        <p className="new-environment-modal__description">{description}</p>
                    </div>

                    <button type="button" className="new-environment-modal__close" onClick={handleClose} aria-label="Close modal">
                        <span className="material-symbols-outlined" aria-hidden="true">close</span>
                    </button>
                </div>

                <label className="new-environment-modal__field">
                    <span className="new-environment-modal__label">Environment name</span>
                    <input
                        className="new-environment-modal__input"
                        type="text"
                        value={environmentName}
                        onChange={(event) => setEnvironmentName(event.target.value)}
                        placeholder="e.g. staging"
                    />
                </label>

                <div className="new-environment-modal__field">
                    <span className="new-environment-modal__label">Icon</span>

                    <div className="new-environment-modal__icons" role="radiogroup" aria-label="Choose an environment icon">
                        {iconOptions.map((iconOption) => {
                            const isSelected = selectedIcon === iconOption.value;

                            return (
                                <button
                                    key={iconOption.value}
                                    type="button"
                                    className={isSelected ? "new-environment-modal__icon is-selected" : "new-environment-modal__icon"}
                                    onClick={() => setSelectedIcon(iconOption.value)}
                                    aria-pressed={isSelected}
                                    aria-label={iconOption.label}
                                >
                                    <span className="material-symbols-outlined" aria-hidden="true">{iconOption.value}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="new-environment-modal__actions">
                    <button type="button" className="new-environment-modal__button new-environment-modal__button--secondary" onClick={handleClose}>
                        Cancel
                    </button>
                    <button type="submit" className="new-environment-modal__button new-environment-modal__button--primary" disabled={environmentName === ""}>
                        {loading ? <Loader r={5} cx={5} cy={5}/> : "Create environment"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewEnvironmentModal;