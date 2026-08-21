import { useEffect, useMemo, useState } from "react";
import { ChevronDown, X, Trash2, RotateCcw } from "lucide-react";
import { AuditLog, AuditType } from "@/data";
import "./AuditLogPage.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { deleteAuditLogs, fetchAuditLogs } from "@/services/project.service";
import { setAuditLogs } from "@/features/projectSlice";

interface AuditLogPageProps {
  onToast: (msg: string, type: "success" | "error" | "info") => void;
}

type AuditFilter = "all" | AuditType;
type EntityFilter = "all" | "project" | "environment" | "flag";

const ACTION_LABELS: Record<AuditType, string> = {
  project_creation: "Project created",
  environment_creation: "Environment created",
  flag_creation: "Flag created",
  environment_deletion: "Environment deleted",
  key_rotation: "SDK key rotated",
  flag_toggle: "Flag toggled",
  flag_updation: "Flag updated",
  flag_deletion: "Flag deleted",
};

const ACTION_OPTIONS: { value: AuditType; label: string }[] = [
  {
    value: "project_creation",
    label: "Project created",
  },
  {
    value: "environment_creation",
    label: "Environment created",
  },
  {
    value: "flag_creation",
    label: "Flag created",
  },
  {
    value: "environment_deletion",
    label: "Environment deleted",
  },
  {
    value: "key_rotation",
    label: "SDK key rotated",
  },
  {
    value: "flag_toggle",
    label: "Flag toggled",
  },
  {
    value: "flag_updation",
    label: "Flag updated",
  },
  {
    value: "flag_deletion",
    label: "Flag deleted",
  },
];

const ENTITY_OPTIONS: {
  value: EntityFilter;
  label: string;
}[] = [
  {
    value: "project",
    label: "Project",
  },
  {
    value: "environment",
    label: "Environment",
  },
  {
    value: "flag",
    label: "Flag",
  },
];

const getActionLabel = (type: AuditType) => ACTION_LABELS[type];

const formatValue = (value: string | null) => {
  if (value === null) return null;

  try {
    const parsed = JSON.parse(value);

    if (typeof parsed === "object") {
      return JSON.stringify(parsed);
    }

    return String(parsed);
  } catch {
    return value;
  }
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const difference = now.getTime() - date.getTime();

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

const formatExactTime = (dateString: string) => {
  return new Date(dateString).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getEntity = (log: AuditLog) => {
  if (log.domain === "flag") {
    return log.flag_key || "—";
  }

  if(log.type === "key_rotation"){
    return "—"
  }

  if (log.domain === "environment") {
    return log.environment_name || log.old_value || "—";
  }

  return "Project";
};

const getEnvironment = (log: AuditLog) => {
  if(log.type === "environment_creation")
    return log.new_value || "—"

  if(log.type === "key_rotation")
    return log.environment_name || "—";
  
  if (log.domain !== "flag") {
    return "—";
  }

  return log.environment_name || "—";
};

const hasValueChange = (log: AuditLog) => {
  if (log.type === "environment_deletion") {
    return false;
  }

  return log.old_value !== null || log.new_value !== null;
};

function ChangeValue({ log }: { log: AuditLog }) {
  const oldValue = formatValue(log.old_value);
  const newValue = formatValue(log.new_value);

  if (!hasValueChange(log)) {
    return <span className="audit-change-empty">—</span>;
  }

  if (oldValue === null && newValue !== null) {
    return (
      <code className="audit-change-value audit-change-created">
        {newValue}
      </code>
    );
  }

  if (oldValue !== null && newValue === null) {
    return (
      <code className="audit-change-value audit-change-deleted">
        {oldValue}
      </code>
    );
  }

  return (
    <div className="audit-change">
      <code className="audit-change-value audit-change-old">{oldValue}</code>

      <span className="audit-change-arrow">→</span>

      <code className="audit-change-value audit-change-new">{newValue}</code>
    </div>
  );
}

function AuditLogRow({ log }: { log: AuditLog }) {
  const userName = log.user_name || "Unknown user";

  return (
    <div className="audit-row">
      <div className="audit-cell audit-time-cell">
        <span className="audit-time" title={formatExactTime(log.created_at)}>
          {formatRelativeTime(log.created_at)}
        </span>
      </div>

      <div className="audit-cell audit-action-cell">
        <span className={`audit-action audit-action-${log.type}`}>
          {getActionLabel(log.type)}
        </span>
      </div>

      <div className="audit-cell audit-entity-cell">
        <code className="audit-entity" title={getEntity(log)}>
          {getEntity(log)}
        </code>
      </div>

      <div className="audit-cell audit-environment-cell">
        <span className="audit-environment">{getEnvironment(log)}</span>
      </div>

      <div className="audit-cell audit-user-cell">
        <span className="audit-user">{userName}</span>
      </div>

      <div className="audit-cell audit-change-cell">
        <ChangeValue log={log} />
      </div>
    </div>
  );
}

function AuditLogHeader() {
  return (
    <div className="audit-table-header">
      <div>Time</div>
      <div>Action</div>
      <div>Entity</div>
      <div>Environment</div>
      <div>User</div>
      <div>Change</div>
    </div>
  );
}

function AuditLogEmpty() {
  return (
    <div className="audit-empty">
      <div className="audit-empty-title">No activity found</div>

      <div className="audit-empty-description">
        Try changing or clearing your filters.
      </div>
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

function FilterSelect({ label, value, onChange, children }: FilterSelectProps) {
  return (
    <label className="audit-filter">
      <span className="audit-filter-label">{label}</span>

      <div className="audit-filter-select-wrapper">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="audit-filter-select"
        >
          {children}
        </select>

        <ChevronDown size={13} className="audit-filter-chevron" />
      </div>
    </label>
  );
}

function AuditFilters({
  action,
  environment,
  entity,
  environments,
  onActionChange,
  onEnvironmentChange,
  onEntityChange,
  onClear,
  handleDelete,
  handleRefresh
}: {
  action: AuditFilter;
  environment: string;
  entity: EntityFilter;
  environments: {
    id: string;
    name: string;
  }[];
  onActionChange: (value: AuditFilter) => void;
  onEnvironmentChange: (value: string) => void;
  onEntityChange: (value: EntityFilter) => void;
  onClear: () => void;
  handleDelete: ()=> void;
  handleRefresh: ()=> void;
}) {
  const hasFilters =
    action !== "all" || environment !== "all" || entity !== "all";

  return (
    <div className="audit-filters">
      <div className="audit-filters-left">
        <span className="audit-filters-title">Filters</span>

        <FilterSelect
          label="Action"
          value={action}
          onChange={(value) => onActionChange(value as AuditFilter)}
        >
          <option value="all">All actions</option>

          {ACTION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Environment"
          value={environment}
          onChange={onEnvironmentChange}
        >
          <option value="all">All environments</option>

          {environments.map((environment) => (
            <option key={environment.id} value={environment.id}>
              {environment.name}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Entity"
          value={entity}
          onChange={(value) => onEntityChange(value as EntityFilter)}
        >
          <option value="all">All entities</option>

          {ENTITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </FilterSelect>

        {hasFilters && (
          <button
            type="button"
            className="audit-clear-filters"
            onClick={onClear}
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>
        <div className="action-button-logs">
          <button className="audit-log-refresh-btn" onClick={handleRefresh}>
            <RotateCcw size={13} color="black"/> Refresh
          </button>
          <button className="audit-log-delete-btn" onClick={handleDelete}>
            <Trash2 size={13} color="white"/> Delete all logs
          </button>
        </div>
    </div>
  );
}

export default function AuditLogPage({ onToast }: AuditLogPageProps) {
  const currentProject = useSelector(
    (state: RootState) => state.project.currentProject,
  );

  const auditLogs = useSelector((state: RootState) => state.project.auditLogs);
  const environments = useSelector((state: RootState) => state.environment.environments,);
  const dispatch = useDispatch();
  const [actionFilter, setActionFilter] = useState<AuditFilter>("all");
  const [environmentFilter, setEnvironmentFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState<EntityFilter>("all");

  const getAuditLogs = async () => {
    try {
      if(!currentProject) return;
      const logs = await fetchAuditLogs(currentProject?.id);
      dispatch(setAuditLogs(logs));
    } catch (error) {
      onToast("Failed to fetch audit logs", "error");
    }
  };

  useEffect(() => {
    if (currentProject && !auditLogs)
      getAuditLogs();
  }, [currentProject?.id]);

  const handleDelete = async ()=>{
    if(!currentProject) return;
    try{
      await deleteAuditLogs(currentProject?.id)
      dispatch(setAuditLogs(undefined))
    }catch(error){
      onToast("Deleted all the logs", "success");
    }finally{
      
    }
  }

  const filteredAuditLogs = useMemo(() => {
    if (!auditLogs) {
      return [];
    }

    return auditLogs.filter((log) => {
      const matchesAction = actionFilter === "all" || log.type === actionFilter;

      const matchesEntity =
        entityFilter === "all" || log.domain === entityFilter;

      const matchesEnvironment =
        environmentFilter === "all" ||
        (log.domain === "flag" && log.environment_id === environmentFilter) ||
        (log.domain === "environment" &&
          log.environment_id === environmentFilter);

      return matchesAction && matchesEntity && matchesEnvironment;
    });
  }, [auditLogs, actionFilter, environmentFilter, entityFilter]);

  const clearFilters = () => {
    setActionFilter("all");
    setEnvironmentFilter("all");
    setEntityFilter("all");
  };

  return (
    <section className="audit-page">
      <header className="audit-page-header">
        <div>
          <h1 className="audit-page-title">Audit Log</h1>

          <p className="audit-page-description">
            Track changes and activity across your project.
          </p>
        </div>
      </header>

      <AuditFilters
        action={actionFilter}
        environment={environmentFilter}
        entity={entityFilter}
        environments={environments}
        onActionChange={setActionFilter}
        onEnvironmentChange={setEnvironmentFilter}
        onEntityChange={setEntityFilter}
        onClear={clearFilters}
        handleDelete={handleDelete}
        handleRefresh={getAuditLogs}
      />

      <div className="audit-results">
        <span>
          {filteredAuditLogs.length}{" "}
          {filteredAuditLogs.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      <div className="audit-table">
        <AuditLogHeader />

        <div className="audit-table-body">
          {filteredAuditLogs.length === 0 ? (
            <AuditLogEmpty />
          ) : (
            filteredAuditLogs.map((auditLog) => (
              <AuditLogRow key={auditLog.id} log={auditLog} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
