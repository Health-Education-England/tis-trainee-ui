import React from "react";
import {
  handleKeyDown,
  handleNumberInput
} from "../../../../utilities/FormBuilderUtilities";
import FieldWarningMsg from "../../FieldWarningMsg";
import { useFormContext } from "../FormContext";
import { Hint } from "nhsuk-react-components";

type TextProps = {
  name: string;
  label: string | undefined;
  fieldError: string;
  placeholder?: string;
  value: string;
  arrayIndex?: number;
  arrayName?: string;
  width?: number;
  isNumberField?: boolean;
  readOnly?: boolean;
  dtoName?: string;
  hint?: string;
};

export const Text: React.FC<TextProps> = ({
  name,
  label,
  fieldError,
  placeholder,
  value,
  arrayIndex,
  arrayName,
  width = 20,
  isNumberField,
  readOnly,
  dtoName,
  hint
}: TextProps) => {
  const { handleBlur, handleChange, fieldWarning, fieldWidthData } =
    useFormContext();

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
      <input
        autoComplete="off"
        id={inputId}
        data-cy={`${name}-input`}
        onKeyDown={handleKeyDown}
        onInput={e => handleNumberInput(isNumberField, e)}
        type="text"
        name={name}
        value={value ?? ""}
        onChange={(event: any) =>
          handleChange(
            event,
            undefined,
            undefined,
            arrayIndex,
            arrayName,
            dtoName
          )
        }
        className={`nhsuk-input nhsuk-input--width-${
          fieldWidthData?.fieldName === name ? fieldWidthData.width : width
        } ${fieldError ? "nhsuk-input--error" : ""} ${
          readOnly ? "readonly-field" : ""
        }`}
        placeholder={placeholder}
        aria-labelledby={labelId}
        aria-describedby={fieldError ? errorId : undefined}
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
        maxLength={isNumberField ? 4 : 4096}
        readOnly={readOnly}
      />
      {fieldWarning?.fieldName === name && !fieldError ? (
        <FieldWarningMsg warningMsg={fieldWarning?.warningMsg} />
      ) : null}
    </div>
  );
};
