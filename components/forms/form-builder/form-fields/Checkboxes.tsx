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
};

export const Checkboxes: React.FC<CheckboxesProps> = ({
  name,
  label,
  fieldError,
  placeholder,
  value,
  arrayIndex,
  arrayName,
  dtoName
}: CheckboxesProps) => {
  const { handleChange } = useFormContext();

  const inputId =
    arrayIndex !== undefined && arrayName
      ? `${arrayName}-${arrayIndex}-${name}--input`
      : name;
  const labelId = `${inputId}--label`;
  const errorId = `${inputId}-error`;

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
            checked={Boolean(value)}
            onChange={event => {
              handleChange(
                event,
                undefined,
                event.currentTarget.checked,
                arrayIndex,
                arrayName,
                dtoName
              );
            }}
            placeholder={placeholder}
            aria-labelledby={labelId}
            aria-describedby={fieldError ? errorId : undefined}
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
      </div>
    </div>
  );
};
