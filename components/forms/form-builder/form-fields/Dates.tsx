import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";
import FieldErrorInline from "./FieldErrorInline";

type DatesProps = {
  name: string;
  label: string | undefined;
  handleChange: (
    event: any,
    selectedOption?: any,
    arrayIndex?: number,
    arrayName?: string
  ) => void;
  fieldError: string;
  placeholder?: string;
  value: string | Date;
  arrayIndex?: number;
  arrayName?: string;
};

export const Dates = ({
  name,
  label,
  handleChange,
  fieldError,
  placeholder,
  value,
  arrayIndex,
  arrayName
}: DatesProps) => {
  return (
    <div data-cy={name}>
      <label className="nhsuk-label" htmlFor={name} data-cy={`${name}-label`}>
        {label}
      </label>
      <input
        onKeyDown={handleKeyDown}
        type="date"
        data-cy={`${name}-input`}
        name={name}
        value={value as string}
        onChange={event => {
          handleChange(event, undefined, arrayIndex, arrayName);
        }}
        className={`nhsuk-input nhsuk-input--width-20 ${
          fieldError ? "nhsuk-input--error" : ""
        }`}
        placeholder={placeholder}
        min="1920-01-01"
        max="2119-12-31"
      />
      {fieldError && (
        <FieldErrorInline fieldError={fieldError} fieldName={name} />
      )}
    </div>
  );
};
