import React from "react";
import { Field, FieldWarning } from "./FormBuilder";
import { showFormField } from "../../../utilities/FormBuilderUtilities";
import { FormFieldBuilder } from "./FormFieldBuilder";
import { useFormContext } from "./FormContext";

type FormDtoBuilderProps = {
  field: Field;
  dtoErrors: any;
  options?: any;
};

export function FormDtoBuilder({
  field,
  dtoErrors,
  options
}: Readonly<FormDtoBuilderProps>) {
  const { formData } = useFormContext();
  return (
    <div>
      <h2>{field.label}</h2>
      {field.objectFields?.map(objField => (
        <div key={objField.name} className="nhsuk-form-group">
          {showFormField(objField, formData[field.name]) ? (
            <FormFieldBuilder
              field={objField}
              value={formData[field.name][objField.name]}
              error={dtoErrors?.[objField.name]}
              options={options}
              dtoName={field.name}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
