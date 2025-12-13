import React from "react";
import { Hint, Textarea } from "nhsuk-react-components";
import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";
import { useFormContext } from "../FormContext";

type TextAreaProps = {
  name: string;
  label: string | undefined;
  hint?: string;
  fieldError: string;
  placeholder?: string;
  value: string;
  arrayIndex?: number;
  arrayName?: string;
  rows?: number;
  dtoName?: string;
};

export const TextArea: React.FC<TextAreaProps> = ({
  name,
  label,
  hint,
  fieldError,
  placeholder,
  value,
  arrayIndex,
  arrayName,
  rows,
  dtoName
}: TextAreaProps) => {
  const { handleBlur, handleChange } = useFormContext();

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
      <Textarea
        id={inputId}
        data-cy={`${name}-text-area-input`}
        onKeyDown={handleKeyDown}
        name={name}
        value={value ?? ""}
        onChange={event =>
          handleChange(
            event as any,
            undefined,
            undefined,
            arrayIndex,
            arrayName,
            dtoName
          )
        }
        onBlur={handleBlur as any}
        placeholder={placeholder}
        rows={rows ?? 10}
        spellCheck={true}
        aria-describedby={fieldError ? errorId : undefined}
        className={fieldError ? "nhsuk-textarea--error" : ""}
      />
    </div>
  );
};
