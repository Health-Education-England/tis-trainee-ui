import React from "react";
import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";
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
  value?: string;
  arrayIndex?: number;
  arrayName?: string;
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
  arrayName
}: TextProps) => {
  return (
    <>
      <label className="nhsuk-label" htmlFor={name} data-cy={`${name}-label`}>
        {label}
      </label>
      <input
        data-cy={`${name}-input`}
        onKeyDown={handleKeyDown}
        type="text"
        name={name}
        value={value}
        onChange={
          ((event: any) =>
            handleChange(event, undefined, arrayIndex, arrayName)) as any
        }
        className={`nhsuk-input nhsuk-input--width-20 ${
          fieldError ? "nhsuk-input--error" : ""
        }`}
        placeholder={placeholder}
        aria-labelledby={`${name}--label`}
        onBlur={handleBlur}
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
