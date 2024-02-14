import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";
import FieldErrorInline from "./FieldErrorInline";

type TextAreaProps = {
  name: string;
  label: string | undefined;
  handleChange: (
    event: any,
    selectedOption?: any,
    index?: number | undefined,
    name?: string | undefined
  ) => void;
  fieldError: string;
  placeholder?: string;
  handleBlur: (event: any) => void;
  value: string;
  arrayIndex?: number;
  arrayName?: string;
  rows?: number;
};

export const TextArea: React.FC<TextAreaProps> = ({
  name,
  label,
  handleChange,
  fieldError,
  placeholder,
  handleBlur,
  value,
  arrayIndex,
  arrayName,
  rows
}: TextAreaProps) => {
  return (
    <>
      <label className="nhsuk-label" htmlFor={name} data-cy={`${name}-label`}>
        {label}
      </label>
      <textarea
        data-cy={`${name}-text-area-input`}
        onKeyDown={handleKeyDown}
        name={name}
        value={value ?? ""}
        onChange={event =>
          handleChange(event, undefined, arrayIndex, arrayName)
        }
        onBlur={handleBlur}
        placeholder={placeholder}
        rows={rows}
      />
      {fieldError && (
        <FieldErrorInline fieldError={fieldError} fieldName={name} />
      )}
    </>
  );
};
