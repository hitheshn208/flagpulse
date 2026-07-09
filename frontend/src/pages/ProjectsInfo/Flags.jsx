import FlagRows from "../../components/Flags/FlagRows";
import EnvironmentTabs from "../../components/Tabs/EnvironmentTabs";
import { toggleFlagValue } from "../../services/flags.service";

function Flags(prop) {
    const environmentKey = prop.active?.id ?? prop.active?.name ?? "environment";

    const handleToggleFlag = async (flagid, status, ) => {
            const response = await toggleFlagValue(prop.active.id, flagid, status);
            return response;
    }

    return (
        <>
            <EnvironmentTabs environments={prop.environments} active={prop.active.name} onEnvironmentChange={prop.onEnvironmentChange}/>
            <div className="flag_rows_container">
                <div className="flag_table_header" role="row">
                    <div className="flag_table_cell flag_table_cell_name">FLAG</div>
                    <div className="flag_table_cell flag_table_cell_type">TYPE</div>
                    <div className="flag_table_cell flag_table_cell_updated">UPDATED</div>
                    <div className="flag_table_cell flag_table_cell_status">STATUS</div>
                </div>

                {prop.flags.map(flag => (
                    <FlagRows
                        flag={flag}
                        onToggle={handleToggleFlag}
                        key={`${environmentKey}-${flag.id ?? flag.key ?? flag.slug}`}
                    />
                ))}
            </div>

        </>
    );
}

export default Flags;