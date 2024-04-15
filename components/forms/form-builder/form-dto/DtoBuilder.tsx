import React from "react";
import { Field, FieldWarning } from "../FormBuilder";
import { showFormField } from "../../../../utilities/FormBuilderUtilities";

type DtoBuilder = {
  field: Field;
  formData: any;
  renderFormField: (
    field: Field,
    value: string,
    error: string,
    FieldWarning: FieldWarning | undefined,
    handlers: {
      handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
      handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    },
    options?: any,
    arrayDetails?: { arrayIndex: number; arrayName: string },
    dtoName?: string
  ) => JSX.Element | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  errors: any;
  options?: any;
  dtoName?: string;
};

export default function DtoBuilder({
  field,
  formData,
  renderFormField,
  handleChange,
  handleBlur,
  errors,
  options,
  dtoName
}: Readonly<DtoBuilder>) {
  return (
    <div>
      <h2>{field.label}</h2>
      {field.objectFields?.map(objField => (
        <div key={objField.name} className="nhsuk-form-group">
          {showFormField(objField, formData[dtoName as string])
            ? renderFormField(
                objField,
                formData[dtoName as string][objField.name],
                errors ? errors[objField.name] : "",
                undefined,
                { handleChange, handleBlur },
                options,
                undefined,
                dtoName
              )
            : null}
        </div>
      ))}
    </div>
  );
}
