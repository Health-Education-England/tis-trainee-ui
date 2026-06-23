import React from "react";
import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";
import { useFormContext } from "../FormContext";

type CheckboxesProps = {
  name: string;
  label: string | undefined;
  fieldError: string;
  placeholder?: string;
  value: string;
  arrayIndex?: number;
  arrayName?: string;
  dtoName?: string;
  conditional?: React.ReactNode;
  conditionalFieldName?: string;
};

export const Checkboxes: React.FC<CheckboxesProps> = ({
  name,
  label,
  fieldError,
  placeholder,
  value,
  arrayIndex,
  arrayName,
  dtoName,
  conditional
}: CheckboxesProps) => {
  const { handleChange, setFormData } = useFormContext();

  const inputId =
    arrayIndex !== undefined && arrayName
      ? `${arrayName}-${arrayIndex}-${name}--input`
      : name;
  const labelId = `${inputId}--label`;
  const errorId = `${inputId}-error`;
  const conditionalId = `conditional-${inputId}`;
  const checked = Boolean(value);

  return (
    <div
      className={`nhsuk-form-group${
        fieldError ? " nhsuk-form-group--error" : ""
      }`}
    >
      <div className="nhsuk-checkboxes">
        <div className="nhsuk-checkboxes__item">
          <input
            id={inputId}
            className="nhsuk-checkboxes__input"
            data-cy={`${name}-checkbox`}
            onKeyDown={handleKeyDown}
            type="checkbox"
            name={name}
            checked={checked}
            onChange={event => {
              const isChecked = event.currentTarget.checked;
              handleChange(
                event,
                undefined,
                isChecked,
                arrayIndex,
                arrayName,
                dtoName
              );
              if (!isChecked) {
                const conditionalFieldName = CONDITIONAL_FIELD_MAP[name];
                if (conditionalFieldName) {
                  setFormData(prev => ({
                    ...prev,
                    [conditionalFieldName]: ""
                  }));
                }
              }
            }}
            placeholder={placeholder}
            aria-labelledby={labelId}
            aria-describedby={fieldError ? errorId : undefined}
            aria-controls={conditional ? conditionalId : undefined}
            aria-expanded={conditional ? checked : undefined}
          />
          <label
            className="nhsuk-label nhsuk-checkboxes__label"
            htmlFor={inputId}
            data-cy={`${name}-label`}
          >
            {label}
          </label>
          {fieldError && (
            <span id={errorId} className="nhsuk-error-message">
              <span className="nhsuk-u-visually-hidden">Error:</span>{" "}
              {fieldError}
            </span>
          )}
        </div>

        {conditional && checked && (
          <div className="nhsuk-checkboxes__conditional" id={conditionalId}>
            {conditional}
          </div>
        )}
      </div>
    </div>
  );
};

const CONDITIONAL_FIELD_MAP: Record<string, string> = {
  hasGmcNumber: "gmcNumber",
  hasGdcNumber: "gdcNumber"
};
