import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";
import FieldWarningMsg from "../../FieldWarningMsg";
import { FieldWarning } from "../FormBuilder";
import FieldErrorInline from "./FieldErrorInline";

type DatesProps = {
  name: string;
  label: string | undefined;
  handleChange: (
    event: any,
    selectedOption?: any,
    checkedStatus?: boolean,
    arrayIndex?: number,
    arrayName?: string,
    dtoName?: string
  ) => void;
  fieldError: string;
  placeholder?: string;
  value: string;
  arrayIndex?: number;
  arrayName?: string;
  dtoName?: string;
  fieldWarning?: FieldWarning;
};

export const Dates = ({
  name,
  label,
  handleChange,
  fieldError,
  placeholder,
  value,
  arrayIndex,
  arrayName,
  dtoName,
  fieldWarning
}: DatesProps) => {
  return (
    <div data-cy={name}>
      <label className="nhsuk-label" htmlFor={name} data-cy={`${name}-label`}>
        {label}
      </label>
      <input
        id={name}
        onKeyDown={handleKeyDown}
        type="date"
        data-cy={`${name}-input`}
        name={name}
        value={value}
        onChange={event => {
          handleChange(
            event,
            undefined,
            undefined,
            arrayIndex,
            arrayName,
            dtoName
          );
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
      {fieldWarning?.fieldName === name ? (
        <FieldWarningMsg warningMsg={fieldWarning?.warningMsg} />
      ) : null}
    </div>
  );
};
