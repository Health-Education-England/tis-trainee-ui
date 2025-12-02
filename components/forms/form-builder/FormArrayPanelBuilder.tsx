import React from "react";
import { Field } from "./FormBuilder";
import { Button, Card } from "nhsuk-react-components";
import {
  formatFieldName,
  showFormField
} from "../../../utilities/FormBuilderUtilities";
import { FormFieldBuilder } from "./FormFieldBuilder";
import { useFormContext } from "./FormContext";
import { useScrollToField } from "../../../utilities/hooks/useScrollToField";

type FormArrayPanelBuilderProps = {
  field: Field;
  panelErrors: any;
  options?: any;
};

export function FormArrayPanelBuilder({
  field,
  panelErrors,
  options
}: Readonly<FormArrayPanelBuilderProps>) {
  const { formData, setFormData, setIsFormDirty } = useFormContext();

  useScrollToField(
    (target: string) =>
      target === field.name || target.startsWith(`${field.name}-`)
  );

  const newPanel = () => {
    const arrPanel = field.objectFields?.reduce((panel, objField) => {
      panel[objField.name] = "";
      return panel;
    }, {} as { [key: string]: string });
    return arrPanel;
  };

  const addPanel = () => {
    setIsFormDirty(true);
    const currentPanelsArray = formData[field.name] ?? [];
    const newPanelsArray = [...currentPanelsArray, newPanel()];
    setFormData({ ...formData, [field.name]: newPanelsArray });
  };

  const removePanel = (index: number) => {
    setIsFormDirty(true);
    const newPanelsArray = formData[field.name].filter(
      (_arrObj: any, i: number) => i !== index
    );
    setFormData({ ...formData, [field.name]: newPanelsArray });
  };

  const formattedFieldName = formatFieldName(field.name);

  return (
    <div id={field.name} data-cy={`${field.name}-panel`}>
      {formData[field.name]?.map((_arrObj: any, index: number) => (
        <Card key={index} id={`${field.name}-${index}`} className="container">
          <Card.Content>
            <p>
              <b>{`${formattedFieldName} ${index + 1}`}</b>
            </p>
            {field.objectFields?.map(objField => (
              <div key={objField.name} className="nhsuk-form-group">
                {showFormField(objField, formData[field.name][index]) ? (
                  <FormFieldBuilder
                    field={objField}
                    value={formData[field.name][index][objField.name] ?? ""}
                    error={panelErrors?.[index]?.[objField.name] ?? ""}
                    options={options}
                    arrayDetails={{ arrayIndex: index, arrayName: field.name }}
                  />
                ) : null}
              </div>
            ))}
            <div>
              <Button
                secondary
                onClick={(e: { preventDefault: () => void }) => {
                  e.preventDefault();
                  removePanel(index);
                }}
                data-cy={`remove-${formattedFieldName}-${index + 1}-button`}
              >
                {`Remove ${formattedFieldName} ${index + 1}`}
              </Button>
            </div>
          </Card.Content>
        </Card>
      ))}
      <Button
        onClick={(e: { preventDefault: () => void }) => {
          e.preventDefault();
          addPanel();
        }}
        data-cy={`add-${formattedFieldName}-button`}
      >
        {`Add a ${formattedFieldName} panel`}
      </Button>
    </div>
  );
}
