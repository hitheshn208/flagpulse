import "./EnvironmentTabs.css"
function EnvironmentTabs(props) {
    return (
        <div className="capsule_container">
            <div className="capsule_group">
                {props.environments.map(env => (
                    <div className={props.active === env.name ? "capsule capsule_active" : "capsule"} key={env.id}
                        onClick={() => props.onEnvironmentChange(env)}
                    >
                        <span className="material-symbols-outlined">{env.icon}</span>{env.name}
                    </div>
                ))}
            </div>
            <button type="button" className="new_flag_button"
            onClick={()=> props.setNewFlagModal(true)}>
                <span className="new_flag_icon">+</span>
                New flag
            </button>
        </div>
    );
}

export default EnvironmentTabs;