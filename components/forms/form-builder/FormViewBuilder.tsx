import React from "react";
import { Form, FormData } from "./FormBuilder";
import { Button, Card, SummaryList } from "nhsuk-react-components";
import { handleEditSection } from "../../../utilities/FormBuilderUtilities";
import { DateUtilities } from "../../../utilities/DateUtilities";
import history from "../../navigation/history";
interface FormViewBuilder {
  jsonForm: Form;
  formData: FormData;
  canEdit: boolean;
}

const FormViewBuilder: React.FC<FormViewBuilder> = ({
  jsonForm,
  formData,
  canEdit
}: FormViewBuilder) => {
  return (
    <div>
      {jsonForm.pages.map((page, pageIndex) => (
        <div key={page.pageName}>
          <Card feature>
            <Card.Content>
              <Card.Heading>{page.pageName}</Card.Heading>
              {page.sections.map((section, sectionIndex) => (
                <div key={section.sectionHeader}>
                  {canEdit && (
                    <Button
                      data-cy={`edit-${section.sectionHeader}`}
                      secondary
                      onClick={() =>
                        handleEditSection(pageIndex, jsonForm.name, history)
                      }
                    >
                      Edit Section
                    </Button>
                  )}
                  <SummaryList>
                    {section.fields.map(field =>
                      // viewWhenEmpty json field prop is used when we want to to display empty fields as "Not provided"
                      formData[field.name] || field.viewWhenEmpty ? (
                        <SummaryList.Row key={field.name}>
                          <SummaryList.Key data-cy={`${field.name}-label`}>
                            {field.label}
                          </SummaryList.Key>
                          <SummaryList.Value data-cy={`${field.name}-value`}>
                            {displayListValue(formData[field.name], field.type)}
                          </SummaryList.Value>
                        </SummaryList.Row>
                      ) : null
                    )}
                  </SummaryList>
                </div>
              ))}
            </Card.Content>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default FormViewBuilder;

function displayListValue(fieldName: string, fieldType: string) {
  if (!fieldName) return "Not provided";
  if (fieldType === "date" && fieldName) {
    return DateUtilities.ToLocalDate(fieldName);
  }
  return fieldName;
}
