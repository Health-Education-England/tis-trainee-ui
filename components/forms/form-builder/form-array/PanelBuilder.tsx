import React from "react";
import { Field, FieldWarning } from "../FormBuilder";
import { Button, Card } from "nhsuk-react-components";
import {
  formatFieldName,
  showFormField
} from "../../../../utilities/FormBuilderUtilities";

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
    arrayDetails?: { arrayIndex: number; arrayName: string },
    dtoName?: string
  ) => JSX.Element | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  panelErrors: any;
  options?: any;
  isFormDirty: React.MutableRefObject<boolean>;
  dtoName?: string;
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
  options,
  isFormDirty,
  dtoName
}: Readonly<PanelBuilder>) {
  const newPanel = () => {
    const arrPanel = field.objectFields?.reduce((panel, objField) => {
      panel[objField.name] = "";
      return panel;
    }, {} as { [key: string]: string });
    return arrPanel;
  };

  const addPanel = () => {
    isFormDirty.current = true;
    const newPanelsArray = [...formData[field.name], newPanel()];
    setFormData({ ...formData, [field.name]: newPanelsArray });
  };

  const removePanel = (index: number) => {
    isFormDirty.current = true;
    const newPanelsArray = formData[field.name].filter(
      (_arrObj: any, i: number) => i !== index
    );
    setFormData({ ...formData, [field.name]: newPanelsArray });
  };

  const formattedFieldName = formatFieldName(field.name);

  return (
    <>
      {formData[field.name].map((_arrObj: any, index: number) => (
        <Card key={index} className="container">
          <Card.Content>
            <p>
              <b>{`${formattedFieldName} ${index + 1}`}</b>
            </p>
            {field.objectFields?.map((objField: Field) => (
              <div key={objField.name} className="nhsuk-form-group">
                {showFormField(objField, formData[field.name][index])
                  ? renderFormField(
                      objField,
                      formData[field.name][index][objField.name] ?? "",
                      panelErrors?.[index]?.[objField.name] ?? "",
                      fieldWarning,
                      { handleChange, handleBlur },
                      options,
                      { arrayIndex: index, arrayName: field.name },
                      dtoName
                    )
                  : null}
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
    </>
  );
}
