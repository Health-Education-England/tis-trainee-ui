import React from "react";
import {
  handleKeyDown,
  toISOIgnoreTimezone
} from "../../../../utilities/FormBuilderUtilities";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type DatesProps = {
  name: string;
  label: string | undefined;
  handleChange: (event: any, selectedOption?: any) => void;
  fieldError?: string;
  placeholder?: string;
  value: string | Date;
};

export const Dates = ({
  name,
  label,
  handleChange,
  fieldError,
  placeholder,
  value
}: DatesProps) => {
  return (
    <div data-cy={name}>
      <label className="nhsuk-label" htmlFor={name} data-cy={`${name}-label`}>
        {label}
      </label>
      <DatePicker
        data-cy={`${name}-input`}
        onKeyDown={handleKeyDown}
        name={name}
        selected={value ? new Date(value) : null}
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
