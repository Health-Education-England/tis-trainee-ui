import React from "react";
import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";
import PhoneInput from "react-phone-number-input";

type PhoneProps = {
  name: string;
  label: string | undefined;
  handleChange: (
    event: any,
    selectedOption?: any,
    arrayIndex?: number,
    arrayName?: string
  ) => void;
  value: string;
  arrayIndex?: number;
  arrayName?: string;
};

export const Phone = ({
  name,
  label,
  handleChange,
  value,
  arrayIndex,
  arrayName
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
            arrayIndex,
            arrayName
          );
        }}
        value={value}
        initialValueFormat="national"
      />
    </div>
  );
};
