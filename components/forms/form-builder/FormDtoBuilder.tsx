import React from "react";
import { Field, FieldWarning } from "./FormBuilder";
import { showFormField } from "../../../utilities/FormBuilderUtilities";
import { FormFieldBuilder } from "./FormFieldBuilder";

type FormDtoBuilderProps = {
  field: Field;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<any>;
  dtoErrors: any;
  options?: any;
  fieldWarning: FieldWarning | undefined;
  isFormDirty: React.MutableRefObject<boolean>;
};

export function FormDtoBuilder({
  field,
  formData,
  handleChange,
  handleBlur,
  setFormData,
  dtoErrors,
  options,
  fieldWarning,
  isFormDirty
}: Readonly<FormDtoBuilderProps>) {
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
              fieldWarning={fieldWarning}
              handlers={{ handleChange, handleBlur, setFormData }}
              options={options}
              dtoName={field.name}
              formData={formData}
              isFormDirty={isFormDirty}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
