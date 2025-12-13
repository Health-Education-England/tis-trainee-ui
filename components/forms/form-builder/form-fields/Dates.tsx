import React from "react";
import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";
import FieldWarningMsg from "../../FieldWarningMsg";
import { useFormContext } from "../FormContext";

type DatesProps = {
  name: string;
  label: string | undefined;
  fieldError: string;
  placeholder?: string;
  value: string;
  arrayIndex?: number;
  arrayName?: string;
  dtoName?: string;
};

export const Dates = ({
  name,
  label,
  fieldError,
  placeholder,
  value,
  arrayIndex,
  arrayName,
  dtoName
}: DatesProps) => {
  const { handleBlur, handleChange, fieldWarning } = useFormContext();

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
      data-cy={name}
    >
      <label
        className="nhsuk-label"
        htmlFor={inputId}
        id={labelId}
        data-cy={`${name}-label`}
      >
        {label}
      </label>
      {fieldError && (
        <span id={errorId} className="nhsuk-error-message">
          <span className="nhsuk-u-visually-hidden">Error:</span> {fieldError}
        </span>
      )}
      <input
        id={inputId}
        onKeyDown={handleKeyDown}
        type="date"
        data-cy={`${name}-input`}
        name={name}
        value={value}
        onChange={event => {
          handleChange(
            event,
            undefined,
            undefined,
            arrayIndex,
            arrayName,
            dtoName
          );
        }}
        onBlur={(event: React.FocusEvent<HTMLInputElement>) =>
          handleBlur(
            event,
            undefined,
            undefined,
            arrayIndex,
            arrayName,
            dtoName
          )
        }
        className={`nhsuk-input nhsuk-input--width-20 ${
          fieldError ? "nhsuk-input--error" : ""
        }`}
        placeholder={placeholder}
        min="1920-01-01"
        max="2119-12-31"
        aria-labelledby={labelId}
        aria-describedby={fieldError ? errorId : undefined}
      />
      {fieldWarning?.fieldName === name && !fieldError ? (
        <FieldWarningMsg warningMsg={fieldWarning?.warningMsg} />
      ) : null}
    </div>
  );
};
