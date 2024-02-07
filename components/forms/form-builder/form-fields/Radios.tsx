import React from "react";
import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";

type RadiosProps = {
  name: string;
  label: string | undefined;
  options: any;
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

export const Radios: React.FC<RadiosProps> = ({
  name,
  label,
  options,
  handleChange,
  value,
  arrayIndex,
  arrayName
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
            checked={value === option.value}
            onChange={event =>
              handleChange(event, undefined, arrayIndex, arrayName)
            }
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
