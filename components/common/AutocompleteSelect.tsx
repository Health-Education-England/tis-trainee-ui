import { Label } from "nhsuk-react-components";
import Select from "react-select";

type AutocompleteSelectProps = {
  value: any;
  onChange: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
  error: any;
  options: any;
  name: string;
  label: string;
  isMulti: boolean;
  closeMenuOnSelect: boolean;
};

export const AutocompleteSelect: React.FC<AutocompleteSelectProps> = ({
  value,
  onChange,
  error,
  options,
  name,
  label,
  isMulti,
  closeMenuOnSelect
}) => {
  const handleChange = (val: any) => {
    onChange(name, !!val ? val.label : "");
  };
  const handleMultiChange = (val: any) => onChange(name, val);
  return (
    <div
      data-cy={name}
      className={
        error ? "nhsuk-form-group nhsuk-form-group--error" : "nhsuk-form-group"
      }
    >
      <Label id={`${name}--label`}>{label}</Label>
      {!!error ? (
        <span className="nhsuk-error-message">
          <span className="nhsuk-u-visually-hidden">Error: </span>
          {error}
        </span>
      ) : null}
      <Select
        aria-labelledby={`${name}--label`}
        options={options}
        onChange={isMulti ? handleMultiChange : handleChange}
        value={value?.label}
        isClearable
        isMulti={isMulti}
        closeMenuOnSelect={closeMenuOnSelect}
        defaultValue={
          isMulti
            ? null
            : {
                value: value,
                label: value
              }
        }
        placeholder="Select or start typing..."
        className="autocomplete-select"
        classNamePrefix="react-select"
        theme={theme => ({
          ...theme,
          borderRadius: 0
        })}
        styles={colourStyles}
      />
    </div>
  );
};

const colourStyles = {
  option: (baseStyles: any, { isFocused, isSelected }: any) => ({
    ...baseStyles,
    background: isFocused ? "#2884FF" : "none",
    color: isFocused ? "white" : undefined,
    zIndex: 1,
    fontSize: "1rem",
    "@media (min-width: 40.0625em)": {
      ...baseStyles["@media (min-width: 40.0625em)"],
      fontSize: "1.1875rem"
    },
    paddingTop: "1px",
    paddingBottom: "1px"
  }),
  control: (baseStyles: any, { isFocused }: any) => ({
    ...baseStyles,
    border: "0.0625rem solid #4C6272",
    borderColor: "#4C6272",
    "&:hover": {
      borderColor: "#4C6272"
    },
    boxShadow: isFocused ? "inset 0 0 0 2px" : "none",
    outline: isFocused ? "4px solid #ffeb3b" : "1px solid #4c6272"
  }),
  singleValue: (baseStyles: any) => ({
    ...baseStyles,
    fontSize: "1rem",
    "@media (min-width: 40.0625em)": {
      ...baseStyles["@media (min-width: 40.0625em)"],
      fontSize: "1.1875rem"
    }
  }),
  dropdownIndicator: (baseStyles: any) => ({
    ...baseStyles,
    padding: "0 2px 0 2px",
    width: "1.125rem",
    color: "#212b32"
  }),
  clearIndicator: (baseStyles: any) => ({
    ...baseStyles,
    padding: "0 2px 0 0",
    width: "1.125rem",
    color: "#212b32"
  }),
  container: (baseStyles: any) => ({
    ...baseStyles,
    maxWidth: "100%",
    "@media (min-width: 40.0625em)": {
      ...baseStyles["@media (min-width: 40.0625em)"],
      maxWidth: "52%"
    }
  })
};
