import { Field } from "../form-builder/FormBuilder";
import { FormFieldBuilder } from "../form-builder/FormFieldBuilder";
import { useFormContext } from "../form-builder/FormContext";
import { showFormField } from "../../../utilities/FormBuilderUtilities";

type CctFieldsProps = {
  fields: Field[];
  options: any;
};

// Note: must be rendered inside a FormProvider - the form-builder field components all read it for their change handlers.
export function CctFields({ fields, options }: Readonly<CctFieldsProps>) {
  const { formData } = useFormContext();

  const conditionalChildNames = new Set(
    fields
      .filter(field => field.type === "checkbox" && field.conditionalField)
      .map(field => field.conditionalField as string)
  );

  return (
    <>
      {fields.map(field => {
        if (conditionalChildNames.has(field.name)) return null;
        if (!showFormField(field, formData)) return null;
        return (
          <div key={field.name} className="nhsuk-form-group">
            <FormFieldBuilder
              field={field}
              value={formData[field.name] ?? ""}
              error=""
              options={options}
            />
          </div>
        );
      })}
    </>
  );
}
