import SkeletonLoading from "../../components/Skeleton/SkeletonLoading";
import { Notify } from "../../components/Toasts/Toast";
import { rotateEnvironmentKey } from "../../services/environment.service";
import { createEnvironments } from "../../services/project.service";
import EnvironmentRows from "./components/EnvironmentRows";
import NewEnvironmentModal from "./components/NewEnvironmentModal";
import { useCallback, useState } from "react";

function Environments(prop) {
    const environments = prop.environments ?? [];
    const [isModalOpen, setModalOpen] = useState(false);
    const [rotatedSdkKeysByEnv, setRotatedSdkKeysByEnv] = useState({});

    const handleCloseModal = ()=>{
        setModalOpen(false);
    }

    const handleModalSubmit = async (data)=>{
        try {
            const response = await createEnvironments(prop.projectId, data);
            console.log(response.environment, response.flags);
            prop.setEnvironments(prev => [...prev, response.environment]);
            prop.setFlagsByEnv(prev => ({ ...prev, [response.environment.id]: response.flags }));
        } catch (e) {
            if (e.response) {
                console.log(e.response.data.message);
                Notify("error", e.response.data.message);
            } else {
                Notify("error", "Network error");
            }
        }finally{
            setModalOpen(false);
        }
    }

    const handleRotateKey = useCallback(async (envId, setLoading) => {
        try {
            setLoading(true);
            const response = await rotateEnvironmentKey(envId);
            console.log(response.sdk_key);
            setRotatedSdkKeysByEnv(prev => ({ ...prev, [envId]: response.sdk_key }));
        } catch (e) {
            if (e.response) {
                console.log(e.response.data.message);
                Notify("error", e.response.data.message);
            } else {
                Notify("error", "Network error");
            }
        }finally{
            setLoading(false);
        }
    }, []);

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
                {
                    prop.loading ?
                    <SkeletonLoading count={3} width={340} height={260}/> :
                    environments.length === 0 ? 
                    <p>Hello</p> 
                    
                    :environments.map((environment, idx) => (
                    <EnvironmentRows
                        key={environment.id ?? environment.name ?? environment.sdk_key}
                        id={environment.id}
                        name={environment.name}
                        sdk_key={rotatedSdkKeysByEnv[environment.id] ?? environment.sdk_key}
                        total_flags={environment.total_flags}
                        icon={environment.icon}
                        index={idx}
                        setEnvironments={prop.setEnvironments}
                        ProjectId={prop.ProjectId}
                        setFlagsByEnv={prop.setFlagsByEnv}
                        handleRotateKey={handleRotateKey}
                    />
                ))}
            </div>
        </div>

        {isModalOpen && <NewEnvironmentModal onClose={handleCloseModal} onCreate={handleModalSubmit}/>}

        </>
    );
}

export default Environments;