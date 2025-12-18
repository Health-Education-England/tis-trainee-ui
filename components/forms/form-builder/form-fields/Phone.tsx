import React from "react";
import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";
import PhoneInput from "react-phone-number-input";
import { useFormContext } from "../FormContext";
import { FieldWrapper } from "./FieldWrapper";

type PhoneProps = {
  name: string;
  label?: string;
  fieldError?: string;
  value: string;
  arrayIndex?: number;
  arrayName?: string;
  dtoName?: string;
};

export const Phone = ({
  name,
  label,
  fieldError,
  value,
  arrayIndex,
  arrayName,
  dtoName
}: PhoneProps) => {
  const { handleChange } = useFormContext();

  return (
    <FieldWrapper
      name={name}
      label={label}
      fieldError={fieldError}
      arrayIndex={arrayIndex}
      arrayName={arrayName}
    >
      {({ inputId, labelId, errorId }) => (
        <PhoneInput
          id={inputId}
          data-cy={`${name}-input`}
          onKeyDown={handleKeyDown}
          placeholder={`Enter ${label}...`}
          name={name}
          defaultCountry="GB"
          onChange={val =>
            handleChange(
              { currentTarget: { name, value: val } },
              undefined,
              undefined,
              arrayIndex,
              arrayName,
              dtoName
            )
          }
          value={value}
          initialValueFormat="national"
          aria-labelledby={labelId}
          aria-describedby={fieldError ? errorId : undefined}
          className={fieldError ? "nhsuk-input--error" : ""}
        />
      )}
    </FieldWrapper>
  );
};
