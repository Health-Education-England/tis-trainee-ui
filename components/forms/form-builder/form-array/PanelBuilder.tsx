import React from "react";
import { Field } from "../FormBuilder";
import { Card } from "nhsuk-react-components";

interface PanelBuilderProps {
  field: Field;
  formFields: any;
  setFormFields: React.Dispatch<any>;
  renderFormField: (
    field: Field,
    value: unknown,
    arrayIndex?: number,
    arrayName?: string
  ) => JSX.Element | null;
}

export default function PanelBuilder({
  field,
  formFields,
  setFormFields,
  renderFormField
}: PanelBuilderProps) {
  const newPanel = () => {
    const arrPanel = field.objectFields?.reduce((panel, objField) => {
      panel[objField.name] = "";
      return panel;
    }, {} as { [key: string]: string });
    return arrPanel;
  };

  const addPanel = () => {
    const newPanelsArray = [...formFields[field.name], newPanel()];
    setFormFields({ ...formFields, [field.name]: newPanelsArray });
  };

  const removePanel = (index: number) => {
    const newPanelsArray = formFields[field.name].filter(
      (_arrObj: any, i: number) => i !== index
    );
    setFormFields({ ...formFields, [field.name]: newPanelsArray });
  };

  return (
    <>
      {formFields[field.name].map((_arrObj: any, index: number) => (
        <Card key={index}>
          <Card.Content>
            <p>
              <b>{`${field.name} ${index + 1}`}</b>
            </p>
            {field.objectFields?.map((objField: Field) => (
              <div key={objField.name} className="nhsuk-form-group">
                {renderFormField(
                  objField,
                  formFields[field.name][index][objField.name] || "",
                  index,
                  field.name
                )}
              </div>
            ))}
            <button
              onClick={e => {
                e.preventDefault();
                removePanel(index);
              }}
            >
              Remove Panel
            </button>
          </Card.Content>
        </Card>
      ))}
      <button
        onClick={e => {
          e.preventDefault();
          addPanel();
        }}
      >
        Add Panel
      </button>
    </>
  );
}
