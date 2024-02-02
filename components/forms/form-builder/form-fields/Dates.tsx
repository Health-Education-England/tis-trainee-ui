import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";
type DatesProps = {
  name: string;
  label: string | undefined;
  formFields: Record<string, string>;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fieldError: string;
  placeholder?: string;
};

export const Dates = ({
  name,
  label,
  formFields,
  handleChange,
  fieldError,
  placeholder
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
        value={formFields[name]}
        onChange={event => {
          handleChange(event);
        }}
        className={`nhsuk-input nhsuk-input--width-20 ${
          fieldError ? "nhsuk-input--error" : ""
        }`}
        placeholder={placeholder}
        min="1920-01-01"
        max="2119-12-31"
      />
    </div>
  );
};
