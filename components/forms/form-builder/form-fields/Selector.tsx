import React from "react";
import Select from "react-select";
import {
  colourStyles,
  handleKeyDown
} from "../../../../utilities/FormBuilderUtilities";
import FieldErrorInline from "./FieldErrorInline";

type SelectorProps = {
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
  value: string | string[];
  arrayIndex?: number;
  arrayName?: string;
  dtoName?: string;
  isMultiSelect?: boolean;
};

export const Selector = ({
  name,
  label,
  options,
  handleChange,
  fieldError,
  value,
  arrayIndex,
  arrayName,
  dtoName,
  isMultiSelect
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
            undefined,
            arrayIndex,
            arrayName,
            dtoName
          )
        }
        className="autocomplete-select"
        classNamePrefix="react-select"
        theme={theme => ({
          ...theme,
          borderRadius: 0
        })}
        styles={colourStyles}
        value={
          isMultiSelect
            ? options?.filter((option: any) => value.includes(option.value))
            : options?.filter((option: any) => option.value === value)
        }
        isClearable={true}
        isMulti={isMultiSelect}
        // closeMenuOnSelect={!isMultiSelect}
      />
      {fieldError && (
        <FieldErrorInline fieldError={fieldError} fieldName={name} />
      )}
    </div>
  );
};
