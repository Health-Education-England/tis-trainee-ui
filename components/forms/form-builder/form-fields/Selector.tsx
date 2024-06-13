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
  value: string;
  arrayIndex?: number;
  arrayName?: string;
  dtoName?: string;
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
  dtoName
}: SelectorProps) => {
  const id = `${name}-label`;
  return (
    <div data-cy={name}>
      <label id={id} className="nhsuk-label" data-cy={id}>
        {label}
      </label>
      <Select
        aria-labelledby={id}
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
        value={options?.filter((option: any) => option.value === value)}
        isClearable={true}
      />
      {fieldError && (
        <FieldErrorInline fieldError={fieldError} fieldName={name} />
      )}
    </div>
  );
};
