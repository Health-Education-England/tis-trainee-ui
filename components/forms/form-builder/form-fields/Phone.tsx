import React from "react";
import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";
import PhoneInput from "react-phone-number-input";
import FieldErrorInline from "./FieldErrorInline";

type PhoneProps = {
  name: string;
  label: string | undefined;
  handleChange: (
    event: any,
    selectedOption?: any,
    checkedStatus?: boolean,
    arrayIndex?: number,
    arrayName?: string,
    dtoName?: string
  ) => void;
  fieldError: string;
  value: string;
  arrayIndex?: number;
  arrayName?: string;
  dtoName?: string;
};

export const Phone = ({
  name,
  label,
  handleChange,
  fieldError,
  value,
  arrayIndex,
  arrayName,
  dtoName
}: PhoneProps) => {
  return (
    <div data-cy={name}>
      <label className="nhsuk-label" htmlFor={name} data-cy={`${name}-label`}>
        {label}
      </label>
      <PhoneInput
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
      />
      {fieldError && (
        <FieldErrorInline fieldError={fieldError} fieldName={name} />
      )}
    </div>
  );
};
