import { Textarea } from "nhsuk-react-components";
import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";
import FieldErrorInline from "./FieldErrorInline";

type TextAreaProps = {
  name: string;
  label: string | undefined;
  handleChange: (
    event: any,
    selectedOption?: any,
    checkedStatus?: boolean,
    index?: number | undefined,
    name?: string | undefined,
    dtoName?: string
  ) => void;
  fieldError: string;
  placeholder?: string;
  handleBlur: (event: any) => void;
  value: string;
  arrayIndex?: number;
  arrayName?: string;
  rows?: number;
  dtoName?: string;
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
  rows,
  dtoName
}: TextAreaProps) => {
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
            event,
            undefined,
            undefined,
            arrayIndex,
            arrayName,
            dtoName
          )
        }
        onBlur={handleBlur}
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
