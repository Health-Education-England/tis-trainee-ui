import React from "react";
import {
  handleKeyDown,
  toISOIgnoreTimezone
} from "../../../../utilities/FormBuilderUtilities";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Dates = {
  name: string;
  label: string | undefined;
  formFields: Record<string, string>;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | any,
    selectedOption?: any
  ) => void;
  fieldError?: string;
  placeholder?: string;
};

export const Dates = ({
  name,
  label,
  formFields,
  handleChange,
  fieldError,
  placeholder
}: Dates) => {
  return (
    <div data-cy={name}>
      <label className="nhsuk-label" htmlFor={name} data-cy={`${name}-label`}>
        {label}
      </label>
      <DatePicker
        data-cy={`${name}-input`}
        onKeyDown={handleKeyDown}
        name={name}
        selected={formFields[name] ? new Date(formFields[name]) : null}
        onChange={(date: Date) => {
          handleChange({
            currentTarget: {
              name,
              value: toISOIgnoreTimezone(date)
            }
          });
        }}
        className={`nhsuk-input nhsuk-input--width-20 ${
          fieldError ? "nhsuk-input--error" : ""
        }`}
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder}
        showYearDropdown
      />
    </div>
  );
};
