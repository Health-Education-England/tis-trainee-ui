import React from "react";
import Select from "react-select";
import {
  colourStyles,
  handleKeyDown
} from "../../../../utilities/FormBuilderUtilities";
import { useFormContext } from "../FormContext";
import { FieldWrapper } from "./FieldWrapper";

type SelectorProps = {
  name: string;
  label?: string;
  options: any;
  fieldError?: string;
  value: string | string[];
  arrayIndex?: number;
  arrayName?: string;
  dtoName?: string;
  isMultiSelect?: boolean;
  hint?: string;
  placeholder?: string;
};

export const Selector = ({
  name,
  label,
  options,
  fieldError,
  value,
  arrayIndex,
  arrayName,
  dtoName,
  isMultiSelect,
  hint,
  placeholder
}: SelectorProps) => {
  const { handleChange } = useFormContext();

  return (
    <FieldWrapper
      name={name}
      label={label}
      hint={hint}
      fieldError={fieldError}
      arrayIndex={arrayIndex}
      arrayName={arrayName}
    >
      {({ inputId, labelId, errorId }) => (
        <Select
          inputId={inputId}
          aria-labelledby={labelId}
          aria-describedby={fieldError ? errorId : undefined}
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
          theme={theme => ({ ...theme, borderRadius: 0 })}
          styles={colourStyles}
          placeholder={placeholder}
          value={
            isMultiSelect
              ? options?.filter((option: any) =>
                  (value as string[])?.includes(option.value)
                )
              : options?.filter((option: any) => option.value === value)
          }
          isClearable
          isMulti={isMultiSelect}
        />
      )}
    </FieldWrapper>
  );
};
