import { useState } from "react";

function FlagTypeSettings({ keyName, setValue, flagType }) {
    const [booleanValue, setBooleanValue] = useState("True");
    const [stringValue, setStringValue] = useState("");
    const [numberValue, setNumberValue] = useState("");

    const typeInstructions = {
        Boolean: "Use Boolean flags to enable or disable a feature without redeploying your application.",
        String: "Use String flags for dynamic text, labels, messages, or other text-based configuration.",
        Number: "Use Number flags for numeric configuration such as limits, thresholds, percentages, or timeouts."
    };

    return (
        <>
            <div className="new-flag-modal__boolean-input-container">

                {flagType && flagType !== "JSON" && (
                    <p className="new-flag-modal__type-instruction">
                        {typeInstructions[flagType]}
                    </p>
                )}

                {flagType === "Boolean" ?
                    <>
                        <label className="new-flag-modal__label">
                            Default Value
                        </label>

                        <div className="boolean-capsule-container">
                            {["True", "False"].map((element, index) => {
                                return (
                                    <div
                                        className={
                                            booleanValue === element
                                                ? `boolean-capsule boolean-capsule-active-${element}`
                                                : "boolean-capsule"
                                        }
                                        key={"boolean-value" + index}
                                        onClick={() => {
                                            setBooleanValue(element);
                                            setValue(element === "True");
                                        }}
                                    >
                                        {element}
                                    </div>
                                );
                            })}
                        </div>
                    </>

                    : flagType === "String" ?

                    <div className="new-flag-modal__input-container">
                        <label className="new-flag-modal__label">
                            Default Value
                        </label>

                        <input
                            type="text"
                            className="new-flag-modal__input"
                            required
                            value={stringValue}
                            onChange={(e) => {
                                setStringValue(e.target.value);
                                setValue(e.target.value);
                            }}
                        />
                    </div>

                    : flagType === "Number" ?

                    <div className="new-flag-modal__input-container">
                        <label className="new-flag-modal__label">
                            Default Value
                        </label>

                        <input
                            type="number"
                            className="new-flag-modal__input"
                            required
                            value={numberValue}
                            onChange={(e) => {
                                setNumberValue(e.target.value);
                                setValue(Number(e.target.value));
                            }}
                        />
                    </div>

                    : ""
                }

                {flagType && flagType !== "JSON" && (
                    <p className="new-flag-modal__default-hint">
                        This sets the default across all environments. You can override it per environment after creating the flag.
                    </p>
                )}

            </div>
        </>
    );
}

export default FlagTypeSettings;



                {/* <label className="new-flag-modal__label">SDK usage</label>
                <code className="sdk-usage-code">
                    <div className="code-editor-name">JavaScript</div>
                    <span style={{color:"rgb(255, 245, 111)"}}>const</span> 
                    {
                        flagType === "Boolean" ? " isEnabled ":
                        flagType === "String" ? " str " :
                        flagType === "Number" ? " num " : ""
                    }
                    = flagbase.get( <br/>
                    &nbsp; &nbsp;
                    <span style={{color:"rgb(111, 212, 255)"}}>'{keyName}'</span>,<br/>
                    &nbsp; &nbsp;
                    {
                        flagType === "Boolean" ?  booleanValue.toLocaleLowerCase() : 
                        flagType === "String" ? "\"default-string\"" :
                        flagType === "Number" ? " 0" :
                        "TDB"
                    }
                    <span style={{color:"rgb(130, 130, 130)"}}>&nbsp;&nbsp;&nbsp;//default fallback </span><br />
                    );
                </code> */}