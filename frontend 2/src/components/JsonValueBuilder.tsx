import { X, Plus } from "lucide-react";
import { useState } from "react";

type JsonValueType = "string" | "integer" | "boolean" | "array";

export interface JsonRow {
  id: number;
  key: string;
  value: string;
  type: JsonValueType;
}

interface JsonValueBuilderProps {
  value: JsonRow[];
  onChange: (rows: JsonRow[]) => void;
}

const VALUE_TYPES: {
  value: JsonValueType;
  label: string;
}[] = [
  { value: "string", label: "String" },
  { value: "integer", label: "Integer" },
  { value: "boolean", label: "Boolean" },
  { value: "array", label: "Array" },
];

export default function JsonValueBuilder({
  value,
  onChange,
}: JsonValueBuilderProps) {
  const updateRow = (id: number, field: keyof JsonRow, newValue: string) => {
    onChange(
      value.map((row) => (row.id === id ? { ...row, [field]: newValue } : row)),
    );
  };

  const addRow = () => {
    onChange([
      ...value,
      {
        id: Date.now(),
        key: "",
        value: "",
        type: "string",
      },
    ]);
  };

  const removeRow = (id: number) => {
    // Minimum one key-value pair
    if (value.length === 1) return;

    onChange(value.filter((row) => row.id !== id));
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="grid grid-cols-[1fr_1fr_140px_36px] gap-2 px-1">
        <span className="text-[11px] font-medium uppercase tracking-wide text-(--color-text-muted)">
          Key
        </span>

        <span className="text-[11px] font-medium uppercase tracking-wide text-(--color-text-muted)">
          Value
        </span>

        <span className="text-[11px] font-medium uppercase tracking-wide text-(--color-text-muted) pl-1.5">
          Type
        </span>

        <span />
      </div>

      {/* Rows */}
      {value.map((row) => (
        <div
          key={row.id}
          className="grid grid-cols-[1fr_1fr_140px_36px] gap-2 items-center"
        >
          {/* Key */}
          <input
            value={row.key}
            onChange={(e) => updateRow(row.id, "key", e.target.value)}
            placeholder="key"
            className="
              h-9 w-full rounded-md
              border border-(--color-border)
              bg-(--color-code-bg)
              px-3 text-sm text-(--color-text)
              outline-none transition
              placeholder:text-(--color-text-subtle)
              focus:border-(--color-border-active)
            "
          />

          {/* Value */}
          {row.type === "boolean" ? (
            <select
              value={row.value || "false"}
              onChange={(e) => updateRow(row.id, "value", e.target.value)}
              className="
                h-9 w-full rounded-md
                border border-(--color-border)
                bg-(--color-surface)
                px-3 text-sm text-(--color-text)
                outline-none transition
                focus:border-(--color-border-active)
              "
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          ) : (
            <input
              type={row.type === "integer" ? "number" : "text"}
              value={row.value}
              onChange={(e) => updateRow(row.id, "value", e.target.value)}
              placeholder={
                row.type === "array"
                  ? '["value1", "value2"]'
                  : row.type === "integer"
                    ? "0"
                    : "value"
              }
              className="
                h-9 w-full rounded-sm
                border border-(--color-border)
                bg-(--color-surface)
                px-3 text-sm text-(--color-text)
                outline-none transition
                placeholder:text-(--color-text-subtle)
                focus:border-(--color-border-active)
              "
            />
          )}

          {/* Type */}
          <select
            value={row.type}
            onChange={(e) => {
              const newType = e.target.value as JsonValueType;
              onChange(value.map((item) =>
                  item.id === row.id ?
                    {
                        ...item,
                        type: newType,
                        value: newType === "boolean" ? "false" : "",
                    }
                    : item,
                ))}}
            className="
              h-9 w-full rounded-sm
              border border-(--color-border)
              bg-(--color-surface)
              px-2.5 text-sm text-(--color-text)
              outline-none transition
              focus:border-(--color-border-active)
            "
          >
            {VALUE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          {/* Remove */}
          <button
            type="button"
            disabled={value.length === 1}
            onClick={() => removeRow(row.id)}
            title={
              value.length === 1
                ? "At least one key-value pair is required"
                : "Remove"
            }
            className="
              flex h-9 w-9 items-center justify-center
              rounded-md
              border border-transparent
              text-(--color-text-subtle)
              transition
              hover:border-(--color-border)
              hover:bg-(--color-surface-hover)
              hover:text-(--color-text)
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            <X size={17} />
          </button>
        </div>
      ))}

      {/* Add row */}
      <button
        type="button"
        onClick={addRow}
        className="
          mt-1 flex items-center gap-1.5
          text-[14px] font-medium
          text-(--color-text-muted)
          transition
          hover:text-(--color-text)
        "
      >
        <Plus size={15} />
        Add property
      </button>

      <div className="text-[11px] mt-2.5 text-(--color-text-subtle)">
        Add at least one property. Arrays should be entered as valid JSON, for
        example <code>["admin", "user"]</code>.
      </div>
    </div>
  );
}
