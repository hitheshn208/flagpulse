import { useState, useEffect } from "react";
import "./NewFlagModal.css"
import Loader from "../../../components/Loaders/Loader";
import FlagTypeSettings from "./FlagTypeSettings";
import { createFlag } from "../../../services/project.service";

function NewFlagModal({setNewFlagModal, projectId, environments = [], fetchFlags}) {
    const [flagName, setflagName] = useState("");
    const [keyName, setKeyName] = useState("");
    const [description, setDescription] = useState("");
    const [flagType, setFlagType] = useState("");
    const flagTypes = ["Boolean", "String", "Number", "JSON"];
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState(null);

    const handleClose = ()=>{
        setflagName("");
        setValue(null);
        setNewFlagModal(false);
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()
        
        const data = {
            projectId,
            name: flagName,
            key: keyName,
            description: description,
            type: flagType.toLocaleLowerCase(),
            value
        }
        console.log(data);
        try {
            await createFlag(data);
            environments.forEach(env => {
                fetchFlags(env.id);
            });
            
        } catch (error) {
            console.log(error);
        }finally{
            setflagName("");
            setValue(null);
            setNewFlagModal(false);
            setLoading(false);
        }
    }
    
    const handleNameChange = (e)=>{
        setflagName(e.target.value);
        setKeyName(e.target.value.toLowerCase().replace(/\s+/g, "-"));
    }

    const handleKeyChange = (e)=>{
        setKeyName(e.target.value.toLowerCase().replace(/\s+/g, "-"))
    }

    useEffect(()=>{
        console.log("Value is", value)
    }, [value])

    useEffect(() => {
        if (flagType === "Boolean") {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setValue(true);
        }else{
            setValue(null)
        }
        }, [flagType]);
    
    return (
        <>
            <div className="new-flag-modal" role="dialog" aria-modal="true" aria-labelledby="new-flag-title">
                <div className="new-flag-modal__backdrop" onClick={handleClose} aria-hidden="true" />
                <form onSubmit={handleSubmit} className="new-flag-modal__outer-panel">
                    <div className="new-flag-modal__header">
                        <div>
                            <h2 id="new-flag-title" className="new-flag-modal__title">Add Flag</h2>
                        </div>

                        <button type="button" className="new-flag-modal__close" onClick={handleClose} aria-label="Close modal">
                            <span className="material-symbols-outlined" aria-hidden="true">close</span>
                        </button>
                    </div>
                    <div className="new-flag-modal__inner-panel">
                        <div className="new-flag-modal__left-panel">
                            <div className="new-flag-modal__input-container">
                                <label htmlFor="flagName" className="new-flag-modal__label">Name</label>
                                <input type="text" id="flagName" className="new-flag-modal__input" 
                                value={flagName}
                                onChange={handleNameChange}
                                required
                                />
                            </div>

                            <div className="new-flag-modal__input-container">
                                <label htmlFor="flagkey" className="new-flag-modal__label">Key</label>
                                <input type="text" id="flagName" className="new-flag-modal__code" 
                                value={keyName}
                                onChange={handleKeyChange}
                                required
                                />
                            </div>

                            <div className="new-flag-modal__input-container" style={{flexGrow: 1}}>
                                <label htmlFor="flagkey" className="new-flag-modal__label">Description</label>
                                <textarea name="description" id="description" cols="30" rows="3" placeholder="What does this flag control?" className="new-flag-modal__textarea"
                                value={description}
                                onChange={e=> setDescription(e.target.value)}                         
                                ></textarea>
                            </div>
                        </div>

                    <div className="new-flag-modal__right-panel">

                        <div className="new-flag-modal__input-container">
                            <label htmlFor="flagkey" className="new-flag-modal__label">Type</label>
                            <div className="new-flag-modal__flag-type-container">
                                {flagTypes.map((type, index)=>{
                                    return <div className={flagType === type ? "flag-type-capsule capsule-active" : "flag-type-capsule"} key={index}
                                    onClick={()=> setFlagType(type)}
                                    >{type}</div>
                                })}
                            </div>
                        </div>

                        <div className="new-flag-modal__value-input-container">
                            {
                                flagType === "Boolean" ?
                                <FlagTypeSettings keyName={keyName} setValue={setValue} flagType={flagType}/> : 
                                flagType === "String" ? 
                                <FlagTypeSettings keyName={keyName} setValue={setValue} flagType={flagType}/> : 
                                flagType === "Number" ?
                                <FlagTypeSettings keyName={keyName} setValue={setValue} flagType={flagType}/> :                                 
                                flagType === "JSON" ? 
                                "Coming soon" :
                                <p className="no-flag-type-message">Choose a type to configure its default value</p>
                            }
                        </div>
                    </div>
                    </div>

                    <div className="new-environment-modal__actions">
                    <button type="button" className="new-flag-modal__button new-flag-modal__button--secondary" onClick={handleClose}>
                        Cancel
                    </button>
                    <button type="submit" className="new-flag-modal__button new-flag-modal__button--primary">
                        {loading ? <Loader r={5} cx={5} cy={5}/> : "Create flag"}
                    </button>
                </div>
                </form>
            </div>
        </>
    );
}

export default NewFlagModal;