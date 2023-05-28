import React from "react";
import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";
import PhoneInput from "react-phone-number-input";

type Phone = {
  name: string;
  label: string | undefined;
  formFields: Record<string, string>;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | any,
    selectedOption?: any
  ) => void;
};

export const Phone = ({ name, label, formFields, handleChange }: Phone) => {
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
          handleChange({ currentTarget: { name, value } });
        }}
        value={formFields[name]}
        initialValueFormat="national"
      />
    </div>
  );
};
