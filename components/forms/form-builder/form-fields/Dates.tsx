import React from "react";
import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";
import FieldWarningMsg from "../../FieldWarningMsg";
import { useFormContext } from "../FormContext";
import { FieldWrapper } from "./FieldWrapper";

type DatesProps = {
  name: string;
  label?: string;
  fieldError?: string;
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
    <FieldWrapper
      name={name}
      label={label}
      fieldError={fieldError}
      arrayIndex={arrayIndex}
      arrayName={arrayName}
    >
      {({ inputId, labelId, errorId }) => (
        <>
          <input
            id={inputId}
            onKeyDown={handleKeyDown}
            type="date"
            data-cy={`${name}-input`}
            name={name}
            value={value}
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
            onBlur={event =>
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
            aria-labelledby={labelId}
            aria-describedby={fieldError ? errorId : undefined}
          />
          {fieldWarning?.fieldName === name && !fieldError ? (
            <FieldWarningMsg warningMsg={fieldWarning?.warningMsg} />
          ) : null}
        </>
      )}
    </FieldWrapper>
  );
};
