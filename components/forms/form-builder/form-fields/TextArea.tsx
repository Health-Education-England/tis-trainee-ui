import React from "react";
import { CharacterCount, Textarea } from "nhsuk-react-components";
import { handleKeyDown } from "../../../../utilities/FormBuilderUtilities";
import FieldWarningMsg from "../../FieldWarningMsg";
import { useFormContext } from "../FormContext";
import { FieldWrapper } from "./FieldWrapper";

type TextAreaProps = {
  name: string;
  label?: string;
  hint?: string;
  fieldError?: string;
  placeholder?: string;
  value: string;
  arrayIndex?: number;
  arrayName?: string;
  rows?: number;
  dtoName?: string;
  maxLength?: number;
};

export const TextArea: React.FC<TextAreaProps> = ({
  name,
  label,
  hint,
  fieldError,
  placeholder,
  value,
  arrayIndex,
  arrayName,
  rows,
  dtoName,
  maxLength
}) => {
  const { handleBlur, handleChange, fieldWarningMsgs } = useFormContext();
  const warningMsgs = fieldWarningMsgs[name] ?? [];
  const TextareaElement = maxLength ? CharacterCount : Textarea;

  return (
    <FieldWrapper
      name={name}
      label={label}
      hint={hint}
      fieldError={fieldError}
      arrayIndex={arrayIndex}
      arrayName={arrayName}
    >
      {({ inputId, errorId }) => (
        <>
          <TextareaElement
            id={inputId}
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
            spellCheck
            aria-describedby={fieldError ? errorId : undefined}
            className={fieldError ? "nhsuk-textarea--error" : ""}
            maxLength={maxLength}
          />
          {warningMsgs.length > 0 && !fieldError && (
            <FieldWarningMsg warningMsgs={warningMsgs} />
          )}
        </>
      )}
    </FieldWrapper>
  );
};
