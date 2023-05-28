import React from "react";
import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";
import FieldWarningMsg from "../../FieldWarningMsg";
import { FieldWarning } from "../FormBuilder";

type Text = {
  name: string;
  label: string | undefined;
  formFields: Record<string, string>;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | any,
    selectedOption?: any
  ) => void;
  fieldError?: string;
  placeholder?: string;
  fieldWarning?: FieldWarning | undefined;
};

export const Text: React.FC<Text> = ({
  name,
  label,
  formFields,
  handleChange,
  fieldError,
  placeholder,
  fieldWarning
}: Text) => {
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
        value={formFields[name]}
        onChange={handleChange}
        className={`nhsuk-input nhsuk-input--width-20 ${
          fieldError ? "nhsuk-input--error" : ""
        }`}
        placeholder={placeholder}
        aria-labelledby={`${name}--label`}
      />
      {fieldWarning?.fieldName === name ? (
        <FieldWarningMsg warningMsg={fieldWarning?.warningMsg} />
      ) : null}
    </>
  );
};
