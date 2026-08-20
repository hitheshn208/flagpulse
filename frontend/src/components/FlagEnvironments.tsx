import { useEffect, useState } from "react";
import { Check, Pencil, Plus, X } from "lucide-react";
import type { FlagEnvironmentValue } from "../data";
import "./FlagEnvironments.css";
import EnvIcon from "./EnvIcon";

type FlagType = "boolean" | "string" | "number" | "json";

interface FlagInfo {
  id: string;
  type: FlagType;
}

interface FlagEnvironmentsProps {
  flag: FlagInfo;
  environments: FlagEnvironmentValue[];

  onToggle: (flagId: string, environmentId: string, isEnabled: boolean) => void;

  onSaveValue: (
    flag: FlagEnvironmentValue,
    environmentId: string,
    value: string | number | boolean | object,
  ) => void;
  editLoading: boolean
}

type JsonValueType = "string" | "integer" | "boolean" | "array";

interface JsonRow {
  id: number;
  key: string;
  value: string;
  type: JsonValueType;
}

const ENVIRONMENT_COLORS = [
  "var(--env-1)",
  "var(--env-2)",
  "var(--env-3)",
  "var(--env-4)",
  "var(--env-5)",
  "var(--env-6)",
  "var(--env-7)",
  "var(--env-8)",
  "var(--env-9)",
  "var(--env-10)",
];

function createEmptyJsonRow(): JsonRow {
  return {
    id: Date.now() + Math.random(),
    key: "",
    value: "",
    type: "string",
  };
}

function convertObjectToRows(value: unknown): JsonRow[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [createEmptyJsonRow()];
  }

  const rows: JsonRow[] = [];

  Object.entries(value).forEach(([key, item]) => {
    if (typeof item === "boolean") {
      rows.push({
        id: Date.now() + Math.random(),
        key,
        value: String(item),
        type: "boolean",
      });

      return;
    }

    if (typeof item === "number") {
      rows.push({
        id: Date.now() + Math.random(),
        key,
        value: String(item),
        type: "integer",
      });

      return;
    }

    if (Array.isArray(item)) {
      rows.push({
        id: Date.now() + Math.random(),
        key,
        value: JSON.stringify(item),
        type: "array",
      });

      return;
    }

    rows.push({
      id: Date.now() + Math.random(),
      key,
      value: String(item ?? ""),
      type: "string",
    });
  });

  return rows.length ? rows : [createEmptyJsonRow()];
}

export default function FlagEnvironments({
  flag,
  environments,
  onToggle,
  onSaveValue,
  editLoading
}: FlagEnvironmentsProps) {
  const [editingEnvironmentId, setEditingEnvironmentId] = useState<
    string | null
  >(null);

  return (
    <section className="flag-env-section">
      <div className="flag-env-section-label">ENVIRONMENTS</div>

      <div className="flag-env-list">
        {environments.map((environment, index) => {
          const isEditing = editingEnvironmentId === environment.environment_id;

          return (
            <EnvironmentCard
              key={`${environment.environment_id}-${environment.id}`}
              flag={flag}
              environment={environment}
              color={ENVIRONMENT_COLORS[index % ENVIRONMENT_COLORS.length]}
              isEditing={isEditing}
              onEdit={() => setEditingEnvironmentId(environment.environment_id)}
              onCancel={() => setEditingEnvironmentId(null)}
              onToggle={onToggle}
              onSaveValue={(environment, environmentId, value) => {
                onSaveValue(environment, environmentId, value);
                setEditingEnvironmentId(null);
              }}
              editLoading={editLoading}
            />
          );
        })}

        {environments.length === 0 && (
          <div className="flag-env-empty">No environment values found.</div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   Environment Card
========================================================= */

interface EnvironmentCardProps {
  flag: FlagInfo;
  environment: FlagEnvironmentValue;
  color: string;
  isEditing: boolean;

  onEdit: () => void;
  onCancel: () => void;

  onToggle: (flagId: string, environmentId: string, isEnabled: boolean) => void;

  onSaveValue: (
    flag: FlagEnvironmentValue,
    environmentId: string,
    value: string | number | boolean | object,
  ) => void;
  editLoading: boolean
}

function EnvironmentCard({
  flag,
  environment,
  color,
  isEditing,
  onEdit,
  onCancel,
  onToggle,
  onSaveValue,
  editLoading
}: EnvironmentCardProps) {
  return (
    <div className={`flag-env-card ${isEditing ? "is-editing" : ""} ${editLoading ? "flag-env-card-disable" : ""}`}>
      {/* =========================
          Environment Header
      ========================= */}

      <div className="flag-env-header">
        <div className="flag-env-identity">
          <EnvIcon name={environment.environment_icon} size={18}/>
          <span className="flag-env-name">{environment.environment_name}</span>
        </div>

        {!isEditing && (
          <div className="flag-env-actions">
            <code className="flag-env-value">
              {flag.type === "json"
                ? JSON.stringify(environment.targeting_return_value)
                : String(environment.targeting_return_value)}
            </code>

            <EnvironmentToggle
              enabled={environment.is_enabled}
              onChange={(value) =>
                onToggle(flag.id, environment.environment_id, value)
              }
            />

            <button
              type="button"
              className="flag-env-edit-button"
              onClick={onEdit}
            >
              <Pencil size={11} />
              Edit
            </button>
          </div>
        )}
      </div>

      {/* =========================
          Editor
      ========================= */}

      {isEditing && (
        <EnvironmentEditor
          flagIdAndType={flag}
          flag={environment}
          onCancel={onCancel}
          onSave={onSaveValue}
        />
      )}
    </div>
  );
}

/* =========================================================
   Toggle
========================================================= */

interface EnvironmentToggleProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
}

function EnvironmentToggle({ enabled, onChange }: EnvironmentToggleProps) {
  return (
    <button
      type="button"
      className={`flag-env-toggle ${enabled ? "enabled" : "disabled"}`}
      onClick={() => onChange(!enabled)}
      aria-label={enabled ? "Disable flag" : "Enable flag"}
    >
      <span />
    </button>
  );
}

/* =========================================================
   Environment Editor
========================================================= */

interface EnvironmentEditorProps {
  flagIdAndType: FlagInfo;
  flag: FlagEnvironmentValue;

  onCancel: () => void;

  onSave: (
    flag: FlagEnvironmentValue,
    environmentId: string,
    value: string | number | boolean | object,
  ) => void;
}

function EnvironmentEditor({
  flagIdAndType,
  flag,
  onCancel,
  onSave,
}: EnvironmentEditorProps) {
  const [value, setValue] = useState<string | number | boolean>(
    flagIdAndType.type === "boolean"
      ? Boolean(flag.targeting_return_value)
      : flagIdAndType.type === "number"
        ? Number(flag.targeting_return_value)
        : String(flag.targeting_return_value ?? ""),
  );

  const [jsonRows, setJsonRows] = useState<JsonRow[]>([]);

  const [jsonError, setJsonError] = useState("");

  useEffect(() => {
    if (flagIdAndType.type !== "json") return;

    setJsonRows(convertObjectToRows(flag.targeting_return_value));
  }, [
    flagIdAndType.type,
    flag.environment_id,
    flag.targeting_return_value,
  ]);

  const handleSave = () => {
    if (flagIdAndType.type === "boolean") {
      onSave(flag, flag.environment_id, Boolean(value));

      return;
    }

    if (flagIdAndType.type === "string") {
      onSave(flag, flag.environment_id, String(value));

      return;
    }

    if (flagIdAndType.type === "number") {
      const numberValue = Number(value);

      if (Number.isNaN(numberValue)) return;

      onSave(flag, flag.environment_id, numberValue);

      return;
    }

    /* =========================
       JSON
    ========================= */

    const result: Record<string, unknown> = {};

    for (const row of jsonRows) {
      const key = row.key.trim();

      if (!key) {
        setJsonError("Every property needs a key.");
        return;
      }

      if (row.type === "string") {
        result[key] = row.value;
      }

      if (row.type === "integer") {
        const numberValue = Number.parseInt(row.value, 10);

        if (Number.isNaN(numberValue)) {
          setJsonError(`Invalid integer for "${key}".`);
          return;
        }

        result[key] = numberValue;
      }

      if (row.type === "boolean") {
        result[key] = row.value === "true";
      }

      if (row.type === "array") {
        try {
          const parsed = JSON.parse(row.value);

          if (!Array.isArray(parsed)) {
            setJsonError(`"${key}" must contain a valid array.`);
            return;
          }

          result[key] = parsed;
        } catch {
          setJsonError(`Invalid array for "${key}".`);
          return;
        }
      }
    }

    if (Object.keys(result).length === 0) {
      setJsonError("At least one key-value pair is required.");
      return;
    }

    setJsonError("");

    onSave(flag, flag.environment_id, result);
  };

  const updateJsonRow = (
    id: number,
    field: keyof JsonRow,
    newValue: string,
  ) => {
    setJsonRows((rows) =>
      rows.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: newValue,
            }
          : row,
      ),
    );

    setJsonError("");
  };

  const changeJsonType = (id: number, type: JsonValueType) => {
    setJsonRows((rows) =>
      rows.map((row) =>
        row.id === id
          ? {
              ...row,
              type,
              value: type === "boolean" ? "false" : "",
            }
          : row,
      ),
    );

    setJsonError("");
  };

  const addJsonRow = () => {
    setJsonRows((rows) => [...rows, createEmptyJsonRow()]);
  };

  const removeJsonRow = (id: number) => {
    // Never allow zero rows.
    if (jsonRows.length <= 1) return;

    setJsonRows((rows) => rows.filter((row) => row.id !== id));
  };

  return (
    <div className="flag-env-editor">
      {/* =========================
          Boolean
      ========================= */}

      {flagIdAndType.type === "boolean" && (
        <div className="flag-env-boolean-editor">
          <button
            type="button"
            className={value === true ? "selected" : ""}
            onClick={() => setValue(true)}
          >
            true
          </button>

          <button
            type="button"
            className={value === false ? "selected" : ""}
            onClick={() => setValue(false)}
          >
            false
          </button>
        </div>
      )}

      {/* =========================
          String
      ========================= */}

      {flagIdAndType.type === "string" && (
        <input
          className="flag-env-editor-input"
          value={String(value)}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter value"
          autoFocus
        />
      )}

      {/* =========================
          Number
      ========================= */}

      {flagIdAndType.type === "number" && (
        <input
          type="number"
          className="flag-env-editor-input"
          value={String(value)}
          onChange={(e) =>
            setValue(e.target.value === "" ? "" : Number(e.target.value))
          }
          placeholder="Enter numeric value"
          autoFocus
        />
      )}

      {/* =========================
          JSON
      ========================= */}

      {flagIdAndType.type === "json" && (
        <div className="flag-env-json-editor">
          <div className="flag-env-json-header">
            <span>KEY</span>
            <span>VALUE</span>
            <span>TYPE</span>
            <span />
          </div>

          <div className="flag-env-json-rows">
            {jsonRows.map((row) => (
              <div className="flag-env-json-row" key={row.id}>
                {/* Key */}

                <input
                  value={row.key}
                  onChange={(e) => updateJsonRow(row.id, "key", e.target.value)}
                  placeholder="key"
                />

                {/* Value */}

                {row.type === "boolean" ? (
                  <select
                    value={row.value}
                    onChange={(e) =>
                      updateJsonRow(row.id, "value", e.target.value)
                    }
                  >
                    <option value="true">true</option>

                    <option value="false">false</option>
                  </select>
                ) : (
                  <input
                    type={row.type === "integer" ? "number" : "text"}
                    value={row.value}
                    onChange={(e) =>
                      updateJsonRow(row.id, "value", e.target.value)
                    }
                    placeholder={
                      row.type === "array"
                        ? '["a", "b"]'
                        : row.type === "integer"
                          ? "0"
                          : "value"
                    }
                  />
                )}

                {/* Type */}

                <select
                  value={row.type}
                  onChange={(e) =>
                    changeJsonType(row.id, e.target.value as JsonValueType)
                  }
                >
                  <option value="string">String</option>

                  <option value="integer">Integer</option>

                  <option value="boolean">Boolean</option>

                  <option value="array">Array</option>
                </select>

                {/* Remove */}

                <button
                  type="button"
                  className="flag-env-json-remove"
                  disabled={jsonRows.length === 1}
                  onClick={() => removeJsonRow(row.id)}
                  title={
                    jsonRows.length === 1
                      ? "At least one property is required"
                      : "Remove property"
                  }
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="flag-env-json-add"
            onClick={addJsonRow}
          >
            <Plus size={12} />
            Add property
          </button>

          {jsonError && <div className="flag-env-json-error">{jsonError}</div>}
        </div>
      )}

      {/* =========================
          Editor Footer
      ========================= */}

      <div className="flag-env-editor-footer">
        <button type="button" className="flag-env-cancel" onClick={onCancel}>
          Cancel
        </button>

        <button type="button" className="flag-env-save" onClick={handleSave}>
          <Check size={12} />
          Save
        </button>
      </div>
    </div>
  );
}
