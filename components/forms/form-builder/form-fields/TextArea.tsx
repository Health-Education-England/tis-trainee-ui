import { Textarea } from "nhsuk-react-components";
import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";
import FieldErrorInline from "./FieldErrorInline";
import { useFormContext } from "../FormContext";

type TextAreaProps = {
  name: string;
  label: string | undefined;
  fieldError: string;
  placeholder?: string;
  value: string;
  arrayIndex?: number;
  arrayName?: string;
  rows?: number;
  dtoName?: string;
};

export const TextArea: React.FC<TextAreaProps> = ({
  name,
  label,
  fieldError,
  placeholder,
  value,
  arrayIndex,
  arrayName,
  rows,
  dtoName
}: TextAreaProps) => {
  const { handleBlur, handleChange } = useFormContext();
  return (
    <>
      <label className="nhsuk-label" htmlFor={name} data-cy={`${name}-label`}>
        {label}
      </label>
      <Textarea
        data-cy={`${name}-text-area-input`}
        onKeyDown={handleKeyDown}
        name={name}
        value={value ?? ""}
        onChange={event =>
          handleChange(
            event as any,
            undefined,
            undefined,
            arrayIndex,
            arrayName,
            dtoName
          )
        }
        onBlur={handleBlur as any}
        placeholder={placeholder}
        rows={rows ?? 10}
        spellCheck={true}
      />
      {fieldError && (
        <FieldErrorInline fieldError={fieldError} fieldName={name} />
      )}
    </>
  );
};
