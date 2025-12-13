import React from "react";
import Select from "react-select";
import {
  colourStyles,
  handleKeyDown
} from "../../../../utilities/FormBuilderUtilities";
import { useFormContext } from "../FormContext";
import { Hint } from "nhsuk-react-components";

type SelectorProps = {
  name: string;
  label: string | undefined;
  options: any;
  fieldError: string;
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

  const inputId =
    arrayIndex !== undefined && arrayName
      ? `${arrayName}-${arrayIndex}-${name}--input`
      : name;
  const labelId = `${inputId}--label`;
  const errorId = `${inputId}-error`;

  return (
    <div
      className={`nhsuk-form-group${
        fieldError ? " nhsuk-form-group--error" : ""
      }`}
      data-cy={name}
    >
      <label
        className="nhsuk-label"
        htmlFor={inputId}
        id={labelId}
        data-cy={`${name}-label`}
      >
        {label}
      </label>
      {hint && <Hint data-cy={`${name}-hint`}>{hint}</Hint>}
      {fieldError && (
        <span id={errorId} className="nhsuk-error-message">
          <span className="nhsuk-u-visually-hidden">Error:</span> {fieldError}
        </span>
      )}
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
        theme={theme => ({
          ...theme,
          borderRadius: 0
        })}
        styles={colourStyles}
        placeholder={placeholder}
        value={
          isMultiSelect
            ? options?.filter((option: any) => value.includes(option.value))
            : options?.filter((option: any) => option.value === value)
        }
        isClearable={true}
        isMulti={isMultiSelect}
        // closeMenuOnSelect={!isMultiSelect}
      />
    </div>
  );
};
