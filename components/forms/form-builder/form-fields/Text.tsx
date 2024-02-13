import React from "react";
import {
  handleKeyDown,
  handleNumberInput
} from "../../../../utilities/FormBuilderUtilities";
import FieldWarningMsg from "../../FieldWarningMsg";
import { FieldWarning } from "../FormBuilder";
import FieldErrorInline from "./FieldErrorInline";

type TextProps = {
  name: string;
  label: string | undefined;
  handleChange: (
    event: any,
    selectedOption?: any,
    index?: number | undefined,
    name?: string | undefined
  ) => void;
  fieldError: string;
  placeholder?: string;
  fieldWarning?: FieldWarning;
  handleBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  value: string;
  arrayIndex?: number;
  arrayName?: string;
  width?: number;
  isNumberField?: boolean;
  total?: string[];
  readOnly?: boolean;
};

export const Text: React.FC<TextProps> = ({
  name,
  label,
  handleChange,
  fieldError,
  placeholder,
  fieldWarning,
  handleBlur,
  value,
  arrayIndex,
  arrayName,
  width,
  isNumberField,
  total,
  readOnly
}: TextProps) => {
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
            handleChange(event, undefined, arrayIndex, arrayName)) as any
        }
        className={`nhsuk-input nhsuk-input--width-${width ?? 20} ${
          fieldError ? "nhsuk-input--error" : ""
        } ${total ? "total-field" : ""}`}
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
