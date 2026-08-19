import { useState } from "react";
import { ArrowLeft, Copy, Check } from "lucide-react";
import JsonValueBuilder, {JsonRow,} from "../../components/JsonValueBuilder";
import "./CreateFlagPage.css";
import { createFlag } from "@/services/project.service";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { addNewFlag } from "@/features/flagSlice";
import { changeFlagCountOfproject } from "@/features/projectSlice";

type Page = "flags" | "create-flag" | string;

interface CreateFlagPageProps {
  onNavigate: (page: Page) => void;
  onToast: (msg: string, type: "success" | "error" | "info") => void;
}

type FlagType = "boolean" | "string" | "number" | "json";

const TYPES: {
  key: FlagType;
  label: string;
  desc: string;
}[] = [
  {
    key: "boolean",
    label: "Boolean",
    desc: "true / false toggle",
  },
  {
    key: "string",
    label: "String",
    desc: "arbitrary text value",
  },
  {
    key: "number",
    label: "Number",
    desc: "integer or decimal",
  },
  {
    key: "json",
    label: "JSON",
    desc: "structured object / array",
  },
];

function toKey(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CreateFlagPage({
  onNavigate,
  onToast,
}: CreateFlagPageProps) {
  const [name, setName] = useState("");
  const [keyOverride, setKeyOverride] = useState("");
  const [keyEdited, setKeyEdited] = useState(false);
  const [description, setDescription] = useState("");
  const [type, setType] = useState<FlagType>("boolean");
  const [defaultBool, setDefaultBool] = useState(false);
  const [defaultStr, setDefaultStr] = useState("");
  const [defaultNum, setDefaultNum] = useState<number>();
  const [defaultJson, setDefaultJson] = useState<JsonRow[]>([
      {
        id: Date.now(),
        key: "",
        value: "",
        type: "string",
      },
    ]);

  const currentProject = useSelector(
    (state: RootState) => state.project.currentProject,
  );
  const dispatch = useDispatch();
  const [copied, setCopied] = useState(false);

  const key = keyEdited ? keyOverride : toKey(name);

  const displayKey = key || "my-flag-key";

  const buildJsonValue = () => {
    const result: Record<string, unknown> = {};
    for (const row of defaultJson) {
      const key = row.key.trim();
      if (!key) continue;
      switch (row.type) {
        case "string":
          result[key] = row.value;
          break;

        case "integer":
          result[key] = Number.parseInt(row.value, 10);
          break;

        case "boolean":
          result[key] = row.value === "true";
          break;

        case "array":
          try {
            const parsed = JSON.parse(row.value);
            if (!Array.isArray(parsed)) {
              throw new Error("Not an array");
            }
            result[key] = parsed;
          } catch {
            return null;
          }
          break;
      }
    }
    console.log(result);
    
    return result;
  };

  const jsonPreview = {};

const codeSnippet =
  type === "boolean"
    ? `const isEnabled = useFlag('${displayKey}', false)`
    : `const value = useFlag('${displayKey}', ${
        type === "number"
          ? String(defaultNum) || "0"
          : type === "string"
            ? `'${defaultStr || "default"}'`
            : JSON.stringify(jsonPreview ?? {}, null, 2)
      })`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet).catch(() => {
      onToast("Failed to copy", "error");
    });
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };


  const handleSubmit = async () => {
    try{
        let flagValue: unknown;

      if (type === "boolean") {
        flagValue = defaultBool;
      } else if (type === "string") {
        flagValue = defaultStr;
      } else if (type === "number") {
        flagValue = defaultNum;
      } else {
        flagValue = buildJsonValue();
      }

      if (flagValue === null || flagValue === undefined) {
        onToast("Invalid JSON value", "error");
        return;
      }

      if (!name.trim()) {
        onToast("Flag name is required", "error");
        return;
      }

      const data = {
        key,
        name,
        type,
        description,
        default_value: flagValue,
      };
      const response = await createFlag(data, currentProject?.id);
      dispatch(addNewFlag({ ...response, data }));
      dispatch(changeFlagCountOfproject({ count: 1 }));
      onToast(`Flag "${key}" created successfully`, "success");
      onNavigate("flags");
    }catch(error){
      onToast("Failed to create flag", "error")
    }
  };

  return (
    <div className="create-flag-page">
      {/* =========================
          Header
      ========================= */}

      <div className="create-flag-header">
        <button
          type="button"
          className="back-button"
          onClick={() => onNavigate("flags")}
        >
          <ArrowLeft size={14} />
          Flags
        </button>

        <span className="breadcrumb-separator">/</span>

        <h1>Create Flag</h1>
      </div>

      <div className="create-flag-layout">
        {/* =========================
            Left: Form
        ========================= */}

        <div className="create-flag-form">
          {/* Basic Info */}

          <section className="form-card">
            <div className="card-title">BASIC INFO</div>

            <div className="form-fields">
              {/* Name */}

              <div className="form-field">
                <label htmlFor="flag-name">
                  Flag name <span className="required">*</span>
                </label>

                <input
                  id="flag-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. New Checkout Flow"
                />
              </div>

              {/* Key */}

              <div className="form-field">
                <label htmlFor="flag-key">Flag key</label>

                <div className="key-input-wrapper">
                  <input
                    id="flag-key"
                    value={key}
                    onChange={(e) => {
                      setKeyEdited(true);
                      setKeyOverride(e.target.value);
                    }}
                    placeholder="new-checkout-flow"
                    className="key-input"
                  />

                  {!keyEdited && name && (
                    <span className="auto-generated">auto-generated</span>
                  )}
                </div>

                <div className="field-help">
                  Must be unique within this project. Cannot be changed after
                  creation.
                </div>
              </div>

              {/* Description */}

              <div className="form-field">
                <label htmlFor="flag-description">Description</label>

                <textarea
                  id="flag-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this flag control? When should it be enabled?"
                  rows={3}
                />
              </div>
            </div>
          </section>

          {/* Flag Type */}

          <section className="form-card">
            <div className="card-title">FLAG TYPE</div>

            <div className="type-grid">
              {TYPES.map((flagType) => (
                <button
                  key={flagType.key}
                  type="button"
                  className={`type-option ${
                    type === flagType.key ? "selected" : ""
                  } type-${flagType.key}`}
                  onClick={() => setType(flagType.key)}
                >
                  <div className="type-option-label">{flagType.label}</div>

                  <div className="type-option-description">{flagType.desc}</div>
                </button>
              ))}
            </div>

            {/* Default Value */}

            <div className="default-value-section">
              <label>Default value</label>

              {/* Boolean */}

              {type === "boolean" && (
                <div className="boolean-options">
                  {[true, false].map((value) => (
                    <button
                      key={String(value)}
                      type="button"
                      className={`boolean-option ${defaultBool === value ? "selected" : ""}`}
                      onClick={() => setDefaultBool(value)}
                    >
                      {value ? "true" : "false"}
                    </button>
                  ))}
                </div>
              )}

              {/* String */}

              {type === "string" && (
                <input
                  value={defaultStr}
                  onChange={(e) => setDefaultStr(e.target.value)}
                  placeholder="Default string value"
                />
              )}

              {/* Number */}

              {type === "number" && (
                <div className="number-inputs">
                  <input
                    type="number"
                    value={defaultNum}
                    placeholder="Default numeric value"
                    onChange={(e) => setDefaultNum(parseInt(e.target.value))}
                  />
                </div>
              )}

              {/* JSON */}

              {type === "json" && (
                <JsonValueBuilder
                  value={defaultJson}
                  onChange={setDefaultJson}
                />
              )}
            </div>
          </section>

          {/* Submit */}

          <div className="form-actions">
            <button
              type="button"
              className="create-button"
              disabled={!name.trim()}
              onClick={handleSubmit}
            >
              Create Flag
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={() => onNavigate("flags")}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* =========================
            Right: Preview
        ========================= */}

        <div className="create-flag-sidebar">
          {/* Preview */}

          <section className="sidebar-card">
            <div className="sidebar-title">PREVIEW</div>

            <div className="flag-preview">
              <div className="preview-info">
                <div className={`preview-name ${name ? "has-value" : ""}`}>
                  {name || "Flag name"}
                </div>

                <code className="preview-key">{displayKey}</code>
              </div>

              <span className={`preview-type type-${type}`}>{type}</span>
            </div>
          </section>

          {/* SDK Usage */}

          <section className="sidebar-card">
            <div className="sdk-header">
              <div className="sidebar-title">SDK USAGE</div>

              <button
                type="button"
                className="copy-code-button"
                onClick={handleCopy}
              >
                {copied ? <Check size={10} /> : <Copy size={10} />}

                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <pre className="code-preview">
              <span className="code-comment">// React SDK</span>
              {"\n"}

              {type === "boolean" ? (
                <>
                  <span className="code-purple">const</span>{" "}
                  <span className="code-blue">isEnabled</span>
                  {" = "}
                  <span className="code-green">useFlag</span>
                  {"("}
                  <span className="code-amber">'{displayKey}'</span>
                  {", "}
                  <span className="code-amber">false</span>
                  {")"}
                </>
              ) : (
                <>
                  <span className="code-purple">const</span>{" "}
                  <span className="code-blue">value</span>
                  {" = "}
                  <span className="code-green">useFlag</span>
                  {"("}
                  <span className="code-amber">'{displayKey}'</span>
                  {", "}
                  <span className="code-amber">
                    {type === "number"
                      ? defaultNum || "0"
                      : type === "string"
                        ? `'${defaultStr || "default"}'`
                        : "{}"}
                  </span>
                  {")"}
                </>
              )}
            </pre>

            <div className="sdk-note">
              Real-time via SSE — no polling required
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
