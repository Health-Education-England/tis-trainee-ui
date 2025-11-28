import React from "react";
import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";
import PhoneInput from "react-phone-number-input";
import FieldErrorInline from "./FieldErrorInline";
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
  return (
    <div data-cy={name}>
      <label
        className="nhsuk-label"
        htmlFor={name}
        id={`${name}--label`}
        data-cy={`${name}-label`}
      >
        {label}
      </label>
      <PhoneInput
        id={name}
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
        aria-labelledby={`${name}--label`}
      />
      {fieldError && (
        <FieldErrorInline fieldError={fieldError} fieldName={name} />
      )}
    </div>
  );
};
