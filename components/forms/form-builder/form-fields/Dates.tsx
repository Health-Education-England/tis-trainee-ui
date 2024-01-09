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
  formFields: Record<string, string>;
  handleChange: (event: any, selectedOption?: any) => void;
  fieldError?: string;
  placeholder?: string;
  fieldValue?: string | undefined;
};

export const Dates = ({
  name,
  label,
  formFields,
  handleChange,
  fieldError,
  placeholder,
  fieldValue
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
        selected={displaySelectedDate(name, formFields, fieldValue)}
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

function displaySelectedDate(
  formFieldsName: string,
  formFields: Record<string, string>,
  fieldValue: string | undefined
) {
  const date = formFields[formFieldsName] || fieldValue;
  return date ? new Date(date) : null;
}
