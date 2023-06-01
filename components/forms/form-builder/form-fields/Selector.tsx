import React from "react";
import Select from "react-select";
import {
  colourStyles,
  handleKeyDown
} from "../../../../utilities/FormBuilderUtilities";

type SelectorProps = {
  name: string;
  label: string | undefined;
  options: any;
  formFields: Record<string, string>;
  handleChange: (event: any, selectedOption?: any) => void;
};

export const Selector = ({
  name,
  label,
  options,
  formFields,
  handleChange
}: SelectorProps) => {
  return (
    <div data-cy={name}>
      <label className="nhsuk-label" htmlFor={name} data-cy={`${name}-label`}>
        {label}
      </label>
      <Select
        onKeyDown={handleKeyDown}
        options={options}
        onChange={selectedOption =>
          handleChange(
            {
              currentTarget: {
                name,
                value: selectedOption ? selectedOption : ""
              }
            },
            selectedOption
          )
        }
        className="autocomplete-select"
        classNamePrefix="react-select"
        theme={theme => ({
          ...theme,
          borderRadius: 0
        })}
        styles={colourStyles}
        value={options?.filter(
          (option: any) => option.value === formFields[name]
        )}
        isClearable={true}
      />
    </div>
  );
};
