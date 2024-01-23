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

export const Selector = ({
  name,
  label,
  options,
  handleChange,
  value,
  arrayIndex,
  arrayName
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
                value: selectedOption ?? ""
              }
            },
            selectedOption,
            arrayIndex,
            arrayName
          )
        }
        className="autocomplete-select"
        classNamePrefix="react-select"
        theme={theme => ({
          ...theme,
          borderRadius: 0
        })}
        styles={colourStyles}
        value={options?.filter((option: any) => option.value === value)}
        isClearable={true}
      />
    </div>
  );
};
