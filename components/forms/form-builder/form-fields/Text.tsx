import React from "react";
import {
  handleKeyDown,
  handleNumberInput
} from "../../../../utilities/FormBuilderUtilities";
import FieldWarningMsg from "../../FieldWarningMsg";
import { FieldWarning } from "../FormBuilder";
import FieldErrorInline from "./FieldErrorInline";
import { useFormContext } from "../FormContext";

type TextProps = {
  name: string;
  label: string | undefined;
  fieldError: string;
  placeholder?: string;
  fieldWarning?: FieldWarning;
  value: string;
  arrayIndex?: number;
  arrayName?: string;
  width?: number;
  isNumberField?: boolean;
  isTotal?: boolean;
  readOnly?: boolean;
  dtoName?: string;
};

export const Text: React.FC<TextProps> = ({
  name,
  label,
  fieldError,
  placeholder,
  fieldWarning,
  value,
  arrayIndex,
  arrayName,
  width,
  isNumberField,
  isTotal,
  readOnly,
  dtoName
}: TextProps) => {
  const { handleBlur, handleChange } = useFormContext();
  return (
    <>
      <label className="nhsuk-label" htmlFor={name} data-cy={`${name}-label`}>
        {label}
      </label>
      <input
        data-cy={`${name}-input`}
        onKeyDown={handleKeyDown}
        onInput={e => handleNumberInput(isNumberField, e)}
        type="text"
        name={name}
        value={value ?? ""}
        onChange={
          ((event: any) =>
            handleChange(
              event,
              undefined,
              undefined,
              arrayIndex,
              arrayName,
              dtoName
            )) as any
        }
        className={`nhsuk-input nhsuk-input--width-${width ?? 20} ${
          fieldError ? "nhsuk-input--error" : ""
        } ${isTotal ? "total-field" : ""}`}
        placeholder={placeholder}
        aria-labelledby={`${name}--label`}
        onBlur={handleBlur}
        width={width}
        maxLength={isNumberField ? 4 : 4096}
        readOnly={readOnly}
      />
      {fieldError && (
        <FieldErrorInline fieldError={fieldError} fieldName={name} />
      )}
      {fieldWarning?.fieldName === name ? (
        <FieldWarningMsg warningMsg={fieldWarning?.warningMsg} />
      ) : null}
    </>
  );
};
