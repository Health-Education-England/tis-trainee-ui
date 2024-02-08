import React from "react";
import { Field } from "../FormBuilder";
import { Card } from "nhsuk-react-components";

type PanelBuilder = {
  field: Field;
  formData: any;
  setFormData: React.Dispatch<any>;
  renderFormField: (
    field: Field,
    value: any,
    error: string,
    arrayDetails: { index: number; parent: string }
  ) => JSX.Element;
  panelErrors: any;
};

export default function PanelBuilder({
  field,
  formData,
  setFormData,
  renderFormField,
  panelErrors
}: Readonly<PanelBuilder>) {
  const newPanel = () => {
    const arrPanel = field.objectFields?.reduce((panel, objField) => {
      panel[objField.name] = "";
      return panel;
    }, {} as { [key: string]: string });
    return arrPanel;
  };

  const addPanel = () => {
    const newPanelsArray = [...formData[field.name], newPanel()];
    setFormData({ ...formData, [field.name]: newPanelsArray });
  };

  const removePanel = (index: number) => {
    const newPanelsArray = formData[field.name].filter(
      (_arrObj: any, i: number) => i !== index
    );
    setFormData({ ...formData, [field.name]: newPanelsArray });
  };

  return (
    <>
      {formData[field.name].map((_arrObj: any, index: number) => (
        <Card key={index}>
          <Card.Content>
            <p>
              <b>{`${field.name} ${index + 1}`}</b>
            </p>
            {field.objectFields?.map((objField: Field) => (
              <div key={objField.name} className="nhsuk-form-group">
                {renderFormField(
                  objField,
                  formData[field.name][index][objField.name] ?? "",
                  panelErrors?.[index]?.[objField.name] ?? "",
                  { index, parent: field.name }
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
