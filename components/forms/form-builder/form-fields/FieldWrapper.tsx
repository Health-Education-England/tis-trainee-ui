import React from "react";
import { Hint } from "nhsuk-react-components";

export type BaseFieldProps = {
  name: string;
  label?: string;
  hint?: string;
  fieldError?: string;
  arrayIndex?: number;
  arrayName?: string;
};

type FieldWrapperProps = BaseFieldProps & {
  children: (ids: {
    inputId: string;
    labelId: string;
    errorId: string;
  }) => React.ReactNode;
};

export function FieldWrapper({
  name,
  label,
  hint,
  fieldError,
  arrayIndex,
  arrayName,
  children
}: FieldWrapperProps) {
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
      {hint && <Hint data-cy={`${name}-hint`}>{hint}</Hint>}
      {fieldError && (
        <span id={errorId} className="nhsuk-error-message">
          <span className="nhsuk-u-visually-hidden">Error:</span> {fieldError}
        </span>
      )}
      {children({ inputId, labelId, errorId })}
    </div>
  );
}
