import React from "react";
import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";
import FieldErrorInline from "./FieldErrorInline";
import { useFormContext } from "../FormContext";

type CheckboxesProps = {
  name: string;
  label: string | undefined;
  fieldError: string;
  placeholder?: string;
  value: string;
  arrayIndex?: number;
  arrayName?: string;
  dtoName?: string;
};

export const Checkboxes: React.FC<CheckboxesProps> = ({
  name,
  label,
  fieldError,
  placeholder,
  value,
  arrayIndex,
  arrayName,
  dtoName
}: CheckboxesProps) => {
  const { handleChange } = useFormContext();
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
          checked={Boolean(value)}
          onChange={event => {
            handleChange(
              event,
              undefined,
              event.currentTarget.checked,
              arrayIndex,
              arrayName,
              dtoName
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
