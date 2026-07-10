import { useMemo, useState } from "react";
import FlagRows from "../../components/Flags/FlagRows";
import EnvironmentTabs from "../../components/Tabs/EnvironmentTabs";
import { toggleFlagValue } from "../../services/flags.service";
import "./Flags.css";

function Flags({
    active,
    environments,
    flags,
    onEnvironmentChange,
}) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const environmentKey = active?.id ?? active?.name ?? "environment";

    const counts = useMemo(() => ({
        all: flags.length,
        enabled: flags.filter(flag => flag.is_enabled).length,
        disabled: flags.filter(flag => !flag.is_enabled).length,
    }), [flags]);

    const filteredFlags = useMemo(() => {
        const query = search.trim().toLowerCase();

        return flags.filter(flag => {
            const matchesSearch =
                !query ||
                (flag.name ?? "").toLowerCase().includes(query) ||
                (flag.key ?? "").toLowerCase().includes(query);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "enabled" && flag.is_enabled) ||
                (statusFilter === "disabled" && !flag.is_enabled);

            return matchesSearch && matchesStatus;
        });
    }, [flags, search, statusFilter]);

    const handleToggleFlag = (flag, status) => {
        return toggleFlagValue(active.id, flag.id, status);
    };

    return (
        <>
            <EnvironmentTabs
                environments={environments}
                active={active?.name}
                onEnvironmentChange={onEnvironmentChange}
            />

            <div className="flags_toolbar">

                <div className="search_container">
                    <span className="material-symbols-outlined search_icon">
                        search
                    </span>

                    <input
                        type="text"
                        placeholder="Search flags by name or key"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="filter_pills">

                    <button
                        className={`filter_pill ${statusFilter === "all" ? "active" : ""}`}
                        onClick={() => setStatusFilter("all")}
                    >
                        All {counts.all}
                    </button>

                    <button
                        className={`filter_pill ${statusFilter === "enabled" ? "active enabled" : ""}`}
                        onClick={() => setStatusFilter("enabled")}
                    >
                        Enabled {counts.enabled}
                    </button>

                    <button
                        className={`filter_pill ${statusFilter === "disabled" ? "active disabled" : ""}`}
                        onClick={() => setStatusFilter("disabled")}
                    >
                        Disabled {counts.disabled}
                    </button>

                </div>

            </div>

            <div className="flag_rows_container">

                <div className="flag_table_header">
                    <div className="flag_table_cell flag_table_cell_name">FLAG</div>
                    <div className="flag_table_cell flag_table_cell_type">TYPE</div>
                    <div className="flag_table_cell flag_table_cell_updated">UPDATED</div>
                    <div className="flag_table_cell flag_table_cell_status">STATUS</div>
                </div>

                {filteredFlags.map(flag => (
                    <FlagRows
                        key={`${environmentKey}-${flag.id ?? flag.key}`}
                        flag={flag}
                        onToggle={handleToggleFlag}
                    />
                ))}

            </div>
        </>
    );
}

export default Flags;