import { Label } from "nhsuk-react-components";
import Select, { Theme } from "react-select";
import { colourStyles } from "../../utilities/FormBuilderUtilities";
import CreatableSelect from "react-select/creatable";
import { ReactNode } from "react";

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
  isCreatable?: boolean;
  defaultOption?: any;
  hint?: string | ReactNode;
};

export const AutocompleteSelect: React.FC<AutocompleteSelectProps> = ({
  value,
  onChange,
  error,
  options,
  name,
  label,
  isMulti,
  closeMenuOnSelect,
  isCreatable,
  defaultOption,
  hint
}) => {
  const handleChange = (val: any) => {
    onChange(name, val ? val.value : null, true);
  };
  const handleMultiChange = (val: any) => onChange(name, val);
  const selectProps = {
    options: options,
    onChange: isMulti ? handleMultiChange : handleChange,
    value: value?.label,
    isClearable: true,
    isMulti: isMulti,
    closeMenuOnSelect: closeMenuOnSelect,
    defaultValue: isMulti ? null : defaultOption,
    placeholder: "Select or start typing...",
    className: "autocomplete-select",
    classNamePrefix: "react-select",
    theme: (theme: Theme) => ({
      ...theme,
      borderRadius: 0
    }),
    styles: colourStyles
  };
  return (
    <div
      data-cy={name}
      className={
        error ? "nhsuk-form-group nhsuk-form-group--error" : "nhsuk-form-group"
      }
    >
      <Label id={`${name}--label`} htmlFor="name">
        {label}
      </Label>
      {hint && <span className="nhsuk-hint">{hint}</span>}
      {error ? (
        <span className="nhsuk-error-message">
          <span className="nhsuk-u-visually-hidden">Error: </span>
          {error}
        </span>
      ) : null}
      {isCreatable ? (
        <CreatableSelect {...selectProps} />
      ) : (
        <Select {...selectProps} />
      )}
    </div>
  );
};
