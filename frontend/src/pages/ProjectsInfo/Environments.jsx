import { createEnvironments } from "../../services/project.service";
import EnvironmentRows from "./components/EnvironmentRows";
import NewEnvironmentModal from "./components/NewEnvironmentModal";
import { useState } from "react";

function Environments(prop) {
    const environments = prop.environments ?? [];
    const [isModalOpen, setModalOpen] = useState(false);

    const handleCloseModal = ()=>{
        setModalOpen(false);
    }

    const handleModalSubmit = async (data)=>{
        const response = await createEnvironments(prop.projectId, data);
        console.log(response.environment, response.flags);
        prop.setEnvironments(prev => [...prev, response.environment]);
        prop.setFlagsByEnv(prev => ({ ...prev, [response.environment.id]: response.flags }));
        setModalOpen(false);
    }

    return (
        <>
        <div className="environments-page">
            <div className="environments-header">
                <div>
                    <h1 className="environments-title">Environments</h1>
                    <p className="environments-caption">Manage SDK keys per environment</p>
                </div>

                <button type="button" className="new-environment-button" onClick={()=> setModalOpen(true)}>
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
                        clientCount={prop.clientCounts[environment.id] ?? 0}
                    />
                ))}
            </div>
        </div>

        {isModalOpen && <NewEnvironmentModal onClose={handleCloseModal} onCreate={handleModalSubmit}/>}

        </>
    );
}

export default Environments;