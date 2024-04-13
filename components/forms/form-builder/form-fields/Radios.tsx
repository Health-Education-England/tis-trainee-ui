import React from "react";
import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";
import FieldErrorInline from "./FieldErrorInline";

type RadiosProps = {
  name: string;
  label: string | undefined;
  options: any;
  handleChange: (
    event: any,
    selectedOption?: any,
    checkedStatus?: boolean,
    arrayIndex?: number,
    arrayName?: string,
    dtoName?: string
  ) => void;
  fieldError: string;
  value: string | boolean | null;
  arrayIndex?: number;
  arrayName?: string;
  dtoName?: string;
};

export const Radios: React.FC<RadiosProps> = ({
  name,
  label,
  options,
  handleChange,
  fieldError,
  value,
  arrayIndex,
  arrayName,
  dtoName
}: RadiosProps) => {
  return (
    <div className="nhsuk-radios">
      <label className="nhsuk-label" htmlFor={name} data-cy={`${name}-label`}>
        {label}
      </label>
      {options?.map((option: any) => (
        <div className="nhsuk-radios__item" key={option.value}>
          <input
            data-cy={`${name}-${option.label}-input`}
            onKeyDown={handleKeyDown}
            className="nhsuk-radios__input"
            title={`${name}-option`}
            type="radio"
            name={name}
            value={option.value}
            checked={isChecked(value, option.value)}
            onChange={event =>
              handleChange(
                event,
                undefined,
                undefined,
                arrayIndex,
                arrayName,
                dtoName
              )
            }
            placeholder={option.value}
            aria-labelledby={`${option.value}--label`}
          />
          <label className="nhsuk-label nhsuk-radios__label">
            {option.label}
          </label>
        </div>
      ))}
      {fieldError && (
        <FieldErrorInline fieldError={fieldError} fieldName={name} />
      )}
    </div>
  );
};

function isChecked(
  formDataValue: string | boolean | null,
  optionValue: string
) {
  if (formDataValue === null || formDataValue === "") return false;
  return (
    (formDataValue === true ? "Yes" : "No") === optionValue ||
    formDataValue === optionValue
  );
}
