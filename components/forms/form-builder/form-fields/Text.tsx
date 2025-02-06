import React from "react";
import {
  handleKeyDown,
  handleNumberInput
} from "../../../../utilities/FormBuilderUtilities";
import FieldWarningMsg from "../../FieldWarningMsg";
import FieldErrorInline from "./FieldErrorInline";
import { useFormContext } from "../FormContext";

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
  isTotal?: boolean;
  readOnly?: boolean;
  dtoName?: string;
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
  isTotal,
  readOnly,
  dtoName
}: TextProps) => {
  const { handleBlur, handleChange, fieldWarning, fieldWidthData } =
    useFormContext();
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
          isTotal ? "total-field" : ""
        }`}
        placeholder={placeholder}
        aria-labelledby={`${name}--label`}
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
      {fieldError && (
        <FieldErrorInline fieldError={fieldError} fieldName={name} />
      )}
      {fieldWarning?.fieldName === name && !fieldError ? (
        <FieldWarningMsg warningMsg={fieldWarning?.warningMsg} />
      ) : null}
    </>
  );
};
