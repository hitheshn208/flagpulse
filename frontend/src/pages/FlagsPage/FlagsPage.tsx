import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Plus, Search, ChevronRight } from "lucide-react";
import { type ActualFlag } from "../../data";
import FlagDetailSlideOver from "../../components/FlagDetailSlideOver";
import "./FlagsPage.css";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/app/store";
import { getFlags } from "@/services/environment.service";
import { setFlags, setToggleValue, setCurrentFlag } from "@/features/flagSlice";
import { toggleFlagValue } from "@/services/flag.service";

type Page =
  | "projects"
  | "flags"
  | "environments"
  | "settings"
  | "audit"
  | "create-flag";

type FilterType = "all" | "boolean" | "string" | "number" | "json";

type StatusFilter = "all" | "on" | "off";

const ENVIRONMENT_COLORS = [
  "env-color-1",
  "env-color-2",
  "env-color-3",
  "env-color-4",
  "env-color-5",
  "env-color-6",
  "env-color-7",
  "env-color-8",
];

interface FlagsPageProps {
  onNavigate: (page: Page) => void;
  onToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function FlagsPage({ onNavigate, onToast }: FlagsPageProps) {
  const dispatch = useDispatch();

  const environments = useSelector(
    (state: RootState) => state.environment.environments,
  );

  const currentEnv = useSelector(
    (state: RootState) => state.environment.currentEnv,
  );

  const flagsByEnv = useSelector((state: RootState) => state.flag.flagsByEnv);

  const flagsOfEnv = currentEnv ? flagsByEnv[currentEnv.id] : undefined;

  const selectedFlag = useSelector(
    (state: RootState) => state.flag.selectedFlag,
  );
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(false);

  /*
   * Fetch flags only when the current environment
   * has not been fetched before.
   */
  useEffect(() => {
    if (!currentEnv) return;
    if (flagsByEnv[currentEnv.id]) return;
    fetchFlags(currentEnv.id);
  }, [currentEnv]);

  const fetchFlags = async (environmentId: string) => {
    try {
      setLoading(true);

      const response = await getFlags(environmentId);

      dispatch(
        setFlags({
          flags: response,
          envId: environmentId,
        }),
      );
    } catch (error) {
      onToast("Failed to fetch flags", "error");
    } finally {
      setLoading(false);
    }
  };

  /*
   * Since ENVIRONMENTS comes from the DB in a stable
   * order, its index determines the environment color.
   */
  const currentEnvironmentIndex = Math.max(
    environments.findIndex((environment) => environment.id === currentEnv?.id),
    0,
  );

  const currentEnvironmentColor =
    ENVIRONMENT_COLORS[currentEnvironmentIndex % ENVIRONMENT_COLORS.length];

  /*
   * Number of enabled flags in the current environment.
   */
  const enabledCount =
    flagsOfEnv?.filter((flag) => flag.is_enabled).length ?? 0;

  /*
   * Search + type + status filtering.
   */
  const filteredFlags = (flagsOfEnv ?? []).filter((flag) => {
    const query = search.toLowerCase().trim();

    const matchesSearch =
      !query ||
      flag.key.toLowerCase().includes(query) ||
      flag.name.toLowerCase().includes(query);

    const matchesType = typeFilter === "all" || flag.type === typeFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "on" && flag.is_enabled) ||
      (statusFilter === "off" && !flag.is_enabled);

    return matchesSearch && matchesType && matchesStatus;
  });

  const toggleFlag = async (flag: ActualFlag, value: boolean) => {
    try {
      await toggleFlagValue(currentEnv?.id, flag.id, value);
      dispatch(
        setToggleValue({
          envId: currentEnv?.id,
          flagId: flag.id,
          value: value,
        }),
      );
      onToast(
        `Flag ${value ? "enabled" : "disabled"} in ${currentEnv?.name}`,
        "success",
      );
    } catch (e) {
      onToast(`Failed to ${value} the flag`, "error");
    } finally {
    }
  };

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setStatusFilter("all");
  };

  useEffect(()=>{
    return ()=> { dispatch(setCurrentFlag(null)) }
  },[]);

  return (
    <div className="flags-page">
      <div className="flags-content">
        <header className="flags-header">
          <div>
            <h1>Feature Flags</h1>

            <p className="flags-summary">
              {flagsOfEnv?.length ?? 0} flags · {enabledCount} enabled
              {" in "}
              <span className={`environment-text ${currentEnvironmentColor}`}>
                {currentEnv?.name ?? "Environment"}
              </span>
            </p>
          </div>

          <button
            className="create-flag-btn"
            type="button"
            onClick={() => onNavigate("create-flag")}
          >
            <Plus size={15} />
            Create Flag
          </button>
        </header>

        <div className="flags-toolbar">
          {/* Search */}

          <div className="flag-search">
            <Search size={14} />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search flags by key or name..."
            />
          </div>

          {/* Type filter */}

          <div className="filter-group">
            <span className="filter-label">Type</span>

            {(
              ["all", "boolean", "string", "number", "json"] as FilterType[]
            ).map((type) => (
              <button
                key={type}
                type="button"
                className={`filter-btn ${typeFilter === type ? "active" : ""}`}
                onClick={() => setTypeFilter(type)}
              >
                {type === "all" ? "All" : type}
              </button>
            ))}
          </div>

          {/* Status filter */}

          <div className="filter-group">
            <span className="filter-label">Status</span>

            {(["all", "on", "off"] as StatusFilter[]).map((status) => (
              <button
                key={status}
                type="button"
                className={`filter-btn ${
                  statusFilter === status ? "active" : ""
                }`}
                onClick={() => setStatusFilter(status)}
              >
                {status === "all" ? "All" : status === "on" ? "● On" : "○ Off"}
              </button>
            ))}
          </div>
        </div>

        <div className="flags-table-container">
          <table className="flags-table">
            <thead>
              <tr>
                <th className="flag-column">Flag</th>

                <th>Type</th>

                <th className={`environment-header ${currentEnvironmentColor}`}>
                  {currentEnv?.name}
                </th>

                <th>Returning Value</th>
                <th>Last Updated</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({
                  length: 6,
                }).map((_, index) => <SkeletonRow key={index} />)
              ) : filteredFlags.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyFlags onClear={clearFilters} />
                  </td>
                </tr>
              ) : (
                filteredFlags.map((flag) => (
                  <FlagRow
                    key={flag.id}
                    flag={flag}
                    onToggle={(value) => toggleFlag(flag, value)}
                    onClick={() => dispatch(setCurrentFlag(flag))}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Count */}

        <div className="flags-count">
          Showing {filteredFlags.length} of {flagsOfEnv?.length ?? 0} flags
        </div>
      </div>

      {selectedFlag && (
        <FlagDetailSlideOver
          onClose={() => dispatch(setCurrentFlag(null))}
          onToast={onToast}
        />
      )}
    </div>
  );
}

interface FlagRowProps {
  flag: ActualFlag;
  onToggle: (value: boolean) => void;
  onClick: () => void;
}

function FlagRow({ flag, onToggle, onClick }: FlagRowProps) {
  const [isToggling, setIsToggling] = useState(false);
  return (
    <tr className={isToggling ? "flag-row flag-row-disabled" : "flag-row"} onClick={onClick}>
      {/* Flag info */}

      <td className="flag-info">
        <div className="flag-name">{flag.name}</div>

        <div className="flag-key-row">
          <code className="flag-key">{flag.key}</code>
        </div>
      </td>

      {/* Type */}

      <td>
        <span className={`type-badge ${flag.type}-capsule`}>
          {flag.type.toUpperCase()}
        </span>
      </td>

      {/* Environment state */}

      <td>
        <Toggle on={flag.is_enabled} onChange={onToggle} setIsToggling={setIsToggling}/>
      </td>

      {/* Returning Value */}

      <td><code className="flag-value-cell">{JSON.stringify(flag.targeting_return_value)}</code></td>

      {/* Modified */}

      <td className="modified-cell">
        <div className="modified-info">
          <span>{formatUpdatedAt(flag.updated_at)}</span>
        </div>
      </td>

      {/* Arrow */}

      <td className="action-cell">
        <ChevronRight size={14} className="row-chevron" />
      </td>
    </tr>
  );
}

interface ToggleProps {
  on: boolean;
  onChange: (value: boolean) => void;
  setIsToggling: Dispatch<SetStateAction<boolean>>
}

function Toggle({ on, onChange, setIsToggling }: ToggleProps) {
  return (
    <button
      type="button"
      className={`flag-toggle ${on ? "enabled" : "disabled"}`}
      aria-label={on ? "Disable flag" : "Enable flag"}
      onClick={(event) => {
        event.stopPropagation();
        setIsToggling(true);
        onChange(!on);
        setTimeout(()=> setIsToggling(false), 2000);
      }}
    >
      <span />
    </button>
  );
}

function SkeletonRow() {
  return (
    <tr className="skeleton-row">
      <td>
        <div className="skeleton skeleton-large" />
      </td>

      <td>
        <div className="skeleton skeleton-small" />
      </td>

      <td>
        <div className="skeleton skeleton-toggle" />
      </td>

      <td>
        <div className="skeleton skeleton-medium" />
      </td>

      <td />
    </tr>
  );
}

function EmptyFlags({ onClear }: { onClear: () => void }) {
  return (
    <div className="empty-flags">
      <div className="empty-icon">
        <Search size={20} />
      </div>

      <div className="empty-title">No matching flags</div>

      <div className="empty-description">
        Try adjusting your search or filter criteria
      </div>

      <button type="button" className="clear-filters-btn" onClick={onClear}>
        Clear all filters
      </button>
    </div>
  );
}

function formatUpdatedAt(updatedAt: string): string {
  const date = new Date(updatedAt);

  if (Number.isNaN(date.getTime())) {
    return updatedAt;
  }

  return date.toLocaleString();
}
