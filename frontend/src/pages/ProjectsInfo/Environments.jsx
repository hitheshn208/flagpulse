import EnvironmentRows from "./components/EnvironmentRows";

function Environments(prop) {
    const environments = prop.environments ?? [];

    return (
        <div className="environments-page">
            <div className="environments-header">
                <div>
                    <h1 className="environments-title">Environments</h1>
                    <p className="environments-caption">Manage SDK keys per environment</p>
                </div>

                <button type="button" className="new-environment-button">
                    <span className="material-symbols-outlined" aria-hidden="true">add</span>
                    <span>New environment</span>
                </button>
            </div>

            <div className="environments-list">
                {environments.map((environment, idx) => (
                    <EnvironmentRows
                        key={environment.id ?? environment.name ?? environment.sdk_key}
                        name={environment.name}
                        sdk_key={environment.sdk_key}
                        total_flags={environment.total_flags}
                        icon={environment.icon}
                        index={idx}
                    />
                ))}
            </div>
        </div>
    );
}

export default Environments;