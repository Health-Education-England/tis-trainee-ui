import React from "react";
import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";
import FieldErrorInline from "./FieldErrorInline";

type CheckboxesProps = {
  name: string;
  label: string | undefined;
  handleChange: (
    event: any,
    selectedOption?: any,
    checkedStatus?: boolean,
    arrayIndex?: number,
    arrayName?: string
  ) => void;
  fieldError: string;
  placeholder?: string;
  value: string;
  arrayIndex?: number;
  arrayName?: string;
};

export const Checkboxes: React.FC<CheckboxesProps> = ({
  name,
  label,
  handleChange,
  fieldError,
  placeholder,
  value,
  arrayIndex,
  arrayName
}: CheckboxesProps) => {
  return (
    <div className="nhsuk-checkboxes">
      <div className="nhsuk-checkboxes__item">
        <input
          className={`nhsuk-checkboxes__input ${
            fieldError ? "nhsuk-input--error" : ""
          }`}
          data-cy={`${name}-checkbox`}
          onKeyDown={handleKeyDown}
          type="checkbox"
          name={name}
          value={value}
          onChange={event => {
            handleChange(
              event,
              undefined,
              event.currentTarget.checked,
              arrayIndex,
              arrayName
            );
          }}
          placeholder={placeholder}
        />
        <label
          className="nhsuk-label nhsuk-checkboxes__label"
          htmlFor={name}
          data-cy={`${name}-label`}
        >
          {label}
        </label>
        {fieldError && (
          <FieldErrorInline fieldError={fieldError} fieldName={name} />
        )}
      </div>
    </div>
  );
};
