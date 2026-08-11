import { useState } from "react";
import "./JsonEditor.css"

export default function JsonEditor({ value = {}, setValue }) {
  // const [rows, setRows] = useState(
  //   Object.entries(value).map(([key, val]) => ({
  //     id: crypto.randomUUID(),
  //     key,
  //     value: JSON.stringify(val),
  //   }))
  // );

  const [rows, setRows] = useState([{
        id: crypto.randomUUID(),
        key: "",
        value: "",
      }]); 

  const updateRows = (newRows) => {
    if(newRows.length === 0)
      return;
    
    setRows(newRows);

    const json = {};

    for (const row of newRows) {
      if (!row.key.trim()) continue;

      try {
        json[row.key] = JSON.parse(row.value);
      } catch {
        // Keep invalid values out of the final JSON
      }
    }
    setValue(json);
  };

  const addRow = () => {
    updateRows([
      ...rows,
      {
        id: crypto.randomUUID(),
        key: "",
        value: "",
      },
    ]);
  };

  const updateRow = (id, field, newValue) => {
    const newRows = rows.map((row) =>
      row.id === id
        ? { ...row, [field]: newValue }
        : row
    );

    updateRows(newRows);
  };

  const deleteRow = (id) => {
    updateRows(rows.filter((row) => row.id !== id));
  };

  const isValidJson = (value) => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="json-editor">
      <p className="new-flag-modal__type-instruction">Use JSON flags for complex configuration containing multiple related values.<br/><br/> <strong>Tip : </strong>Strings must be wrapped in double quotes ("), while numbers and booleans should not be quoted.</p>

      {/* Header */}
      <div className="json-editor-header">
        <div className="json-column key-column">
          Key
        </div>

        <div className="json-column value-column">
          Value
        </div>

        <div className="json-column action-column">
        </div>
      </div>

      {/* Rows */}
      <div className="json-editor-body">
        {rows.map((row) => (
          <div className="json-row" key={row.id}>

            {/* Key */}
            <div className="json-input-wrapper">
              <input
                type="text"
                placeholder="key"
                value={row.key}
                onChange={(e) =>
                  updateRow(row.id, "key", e.target.value)
                }
              />
            </div>

            {/* Value */}
            <div className="json-input-wrapper">
              <input
                type="text"
                placeholder="value"
                value={row.value}
                onChange={(e) =>
                  updateRow(row.id, "value", e.target.value)
                }
              />

              {row.key && !isValidJson(row.value) && (
                <span className="json-error">
                  Invalid JSON
                </span>
              )}
            </div>

            {/* Delete */}
           {rows.length == 1 ? "" : <button
              type="button"
              className="delete-button"
              onClick={() => deleteRow(row.id)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>}

          </div>
        ))}
      </div>

      {/* Add */}
      <button
        type="button"
        className="add-field-button"
        onClick={addRow}
      >
        + Add field
      </button>

    </div>
  );
}