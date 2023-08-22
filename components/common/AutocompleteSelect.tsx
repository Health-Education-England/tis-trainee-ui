import { Label } from "nhsuk-react-components";
import Select from "react-select";
import { colourStyles } from "../../utilities/FormBuilderUtilities";

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
    onChange(name, val ? val.label : null);
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
      {error ? (
        <span className="nhsuk-error-message">
          <span className="nhsuk-u-visually-hidden">Error: </span>
          {error}
        </span>
      ) : null}
      <Select
        data-cy={`${name}-select`}
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
