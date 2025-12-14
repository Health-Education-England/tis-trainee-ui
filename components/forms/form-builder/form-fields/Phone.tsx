import React from "react";
import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";
import PhoneInput from "react-phone-number-input";
import { useFormContext } from "../FormContext";

type PhoneProps = {
  name: string;
  label: string | undefined;
  fieldError: string;
  value: string;
  arrayIndex?: number;
  arrayName?: string;
  dtoName?: string;
};

export const Phone = ({
  name,
  label,
  fieldError,
  value,
  arrayIndex,
  arrayName,
  dtoName
}: PhoneProps) => {
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
      <PhoneInput
        id={inputId}
        data-cy={`${name}-input`}
        onKeyDown={handleKeyDown}
        placeholder={`Enter ${label}...`}
        name={name}
        defaultCountry="GB"
        onChange={value => {
          handleChange(
            { currentTarget: { name, value } },
            undefined,
            undefined,
            arrayIndex,
            arrayName,
            dtoName
          );
        }}
        value={value}
        initialValueFormat="national"
        aria-labelledby={labelId}
        aria-describedby={fieldError ? errorId : undefined}
        className={fieldError ? "nhsuk-input--error" : ""}
      />
    </div>
  );
};
