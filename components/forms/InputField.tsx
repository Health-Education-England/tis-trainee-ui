// Note: This is a standalone component that can be used in non-form-builder contexts and where Formik library is too much.

type InputFieldType = "text" | "date";

type InputFieldProps = {
  isEditable: boolean;
  type: InputFieldType;
  value: string;
  formattedValue: string;
  onChange: (value: string) => void;
  validate: (value: string) => boolean;
  error: string | null;
  inputClassName?: string;
  dataCy: string;
  suffix?: string;
};

export function InputField({
  isEditable,
  type,
  value,
  formattedValue,
  onChange,
  validate,
  error,
  inputClassName,
  dataCy,
  suffix
}: InputFieldProps): JSX.Element {
  return (
    <>
      {isEditable ? (
        <>
          <input
            className={`nhsuk-input ${inputClassName || ""} ${
              error ? "nhsuk-input--error" : ""
            }`}
            type={type}
            value={value}
            onChange={e => {
              const newValue = e.target.value;
              onChange(newValue);
              validate(newValue);
            }}
            data-cy={dataCy}
          />
          {suffix && ` ${suffix}`}
          {error && (
            <span className="nhsuk-error-message" data-cy={`${dataCy}-error`}>
              <span className="nhsuk-u-visually-hidden">Error:</span> {error}
            </span>
          )}
        </>
      ) : (
        formattedValue
      )}
    </>
  );
}
