import { useMemo, useState } from "react";
import FlagRows from "./components/FlagRows";
import EnvironmentTabs from "../../components/Tabs/EnvironmentTabs";
import "./Flags.css";
import NewFlagModal from "./components/NewFlagModal";
import FlagInfoModal from "./components/FlagInfoModal";
import SkeletonLoading from "../../components/Skeleton/SkeletonLoading";

function Flags({
    projectId,
    active,
    environments,
    flags,
    onEnvironmentChange,
    fetchFlags,
    isFlagInfoOpen,
    setIsFlagInfoOpen,
    setIsSidebarCollapsed,
    selectedFlag,
    setSelectedFlag,
    flagsByEnv,
    setFlagsByEnv,
    loading,
    flagsloading
}) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isnewFlagModalEnabled, setNewFlagModal] = useState(false);

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

    const handleFlagInfo = (flag)=>{
        setSelectedFlag(flag);
        setIsFlagInfoOpen(true);
        setIsSidebarCollapsed(true);
    }

    const closeFlagInfo = () => {
        setIsFlagInfoOpen(false);
        setSelectedFlag(null);
        setIsSidebarCollapsed(false);
    }

    return (
        <>
        <div className={isFlagInfoOpen ? "flags-page flags-page-expanded" : "flags-page"}>
            <div className={isFlagInfoOpen ? "flags-workspace flags-workspace-shrunk" : "flags-workspace"}>
                <EnvironmentTabs
                    environments={environments}
                    active={active?.name}
                    onEnvironmentChange={onEnvironmentChange}
                    setNewFlagModal={setNewFlagModal}
                    loading={loading}
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

                    {flagsloading ? 
                        <SkeletonLoading width={"100%"} height={80} count={3} radius={0}/> :
                    filteredFlags.map(flag => (
                        <FlagRows
                            key={`${environmentKey}-${flag.id ?? flag.key}`}
                            flag={flag}
                            handleFlagInfo={handleFlagInfo}
                            isSelected={selectedFlag?.id === flag.id}
                            activeEnv={active}
                            setFlagsByEnv={setFlagsByEnv}
                            loading={loading}
                        />
                    ))}

                </div>

                {isnewFlagModalEnabled && <NewFlagModal 
                    setNewFlagModal={setNewFlagModal}
                    projectId={projectId} 
                    environments={environments} 
                    fetchFlags={fetchFlags} />}
            </div>
            <FlagInfoModal
                isOpen={isFlagInfoOpen}
                flag={selectedFlag}
                flagsByEnv={flagsByEnv}
                environments={environments}
                onClose={closeFlagInfo}
                setFlagsByEnv={setFlagsByEnv}
            />
        </div>
        </>
    );
}

export default Flags;