import React from "react";
import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";

type Radios = {
  name: string;
  label: string | undefined;
  options: any;
  formFields: Record<string, string>;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | any,
    selectedOption?: any
  ) => void;
};

export const Radios: React.FC<Radios> = ({
  name,
  label,
  options,
  formFields,
  handleChange
}: Radios) => {
  return (
    <div className="nhsuk-radios">
      <label className="nhsuk-label" htmlFor={name} data-cy={`${name}-label`}>
        {label}
      </label>
      {options &&
        options?.map((option: any) => (
          <div className="nhsuk-radios__item" key={option.value}>
            <input
              data-cy={`${name}-${option.label}-input`}
              onKeyDown={handleKeyDown}
              className="nhsuk-radios__input"
              title={`${name}-option`}
              type="radio"
              name={name}
              value={option.value}
              checked={formFields[name] === option.value}
              onChange={handleChange}
              placeholder={option.value}
              aria-labelledby={`${option.value}--label`}
            />
            <label className="nhsuk-label nhsuk-radios__label">
              {option.label}
            </label>
          </div>
        ))}
    </div>
  );
};
