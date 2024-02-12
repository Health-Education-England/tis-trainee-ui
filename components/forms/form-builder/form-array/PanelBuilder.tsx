import React from "react";
import { Field, FieldWarning } from "../FormBuilder";
import { Card } from "nhsuk-react-components";

type PanelBuilder = {
  fieldWarning: FieldWarning | undefined;
  field: Field;
  formData: any;
  setFormData: React.Dispatch<any>;
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
    arrayDetails?: { arrayIndex: number; arrayName: string }
  ) => JSX.Element | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  panelErrors: any;
  options?: any;
};

export default function PanelBuilder({
  field,
  formData,
  setFormData,
  renderFormField,
  handleChange,
  handleBlur,
  panelErrors,
  fieldWarning,
  options
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
                  fieldWarning,
                  { handleChange, handleBlur },
                  options,
                  { arrayIndex: index, arrayName: field.name }
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
