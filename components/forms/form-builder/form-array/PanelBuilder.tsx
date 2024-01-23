import React from "react";
import { Field } from "../FormBuilder";
import { Card } from "nhsuk-react-components";

interface PanelBuilderProps {
  field: Field;
  formFields: any;
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
  renderFormField
}: PanelBuilderProps) {
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
          </Card.Content>
        </Card>
      ))}
    </>
  );
}
