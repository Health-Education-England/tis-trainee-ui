import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";
import FieldWarningMsg from "../../FieldWarningMsg";
import { useFormContext } from "../FormContext";
import FieldErrorInline from "./FieldErrorInline";

type DatesProps = {
  name: string;
  label: string | undefined;
  fieldError: string;
  placeholder?: string;
  value: string;
  arrayIndex?: number;
  arrayName?: string;
  dtoName?: string;
};

export const Dates = ({
  name,
  label,
  fieldError,
  placeholder,
  value,
  arrayIndex,
  arrayName,
  dtoName
}: DatesProps) => {
  const { handleBlur, handleChange, fieldWarning } = useFormContext();
  return (
    <div data-cy={name}>
      <label
        className="nhsuk-label"
        htmlFor={name}
        id={`${name}--label`}
        data-cy={`${name}-label`}
      >
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
        onBlur={(event: React.FocusEvent<HTMLInputElement>) =>
          handleBlur(
            event,
            undefined,
            undefined,
            arrayIndex,
            arrayName,
            dtoName
          )
        }
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
      {fieldWarning?.fieldName === name && !fieldError ? (
        <FieldWarningMsg warningMsg={fieldWarning?.warningMsg} />
      ) : null}
    </div>
  );
};
