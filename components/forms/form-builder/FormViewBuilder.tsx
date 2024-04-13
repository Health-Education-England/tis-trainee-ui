import { Fragment } from "react";
import { Field, Form, FormData } from "./FormBuilder";
import {
  Button,
  Card,
  Col,
  Container,
  Label,
  Row,
  SummaryList
} from "nhsuk-react-components";
import {
  formatFieldName,
  handleEditSection
} from "../../../utilities/FormBuilderUtilities";
import { DateUtilities } from "../../../utilities/DateUtilities";
import history from "../../navigation/history";

type VisibleFieldProps = {
  field: Field;
  formData: FormData;
  formErrors: { [key: string]: string };
};

function VisibleField({
  field,
  formData,
  formErrors
}: Readonly<VisibleFieldProps>) {
  const isVisible =
    field.visible ||
    (field.visibleIf && field.visibleIf.includes(formData[field.parent!!]));

  if (isVisible) {
    if (field.type === "dto") {
      return (
        <Fragment>
          {field.objectFields?.map(nestedField => (
            <VisibleField
              key={nestedField.name}
              field={nestedField}
              formData={formData[field.name]}
              formErrors={formErrors}
            />
          ))}
        </Fragment>
      );
    }
    return (
      <SummaryList.Row key={field.name}>
        <SummaryList.Key
          data-cy={`${field.name}-label`}
          className={formErrors[field.name] ? "nhsuk-error-message" : ""}
        >
          {field.label}
        </SummaryList.Key>
        <SummaryList.Value data-cy={`${field.name}-value`}>
          {displayListValue(formData[field.name], field.type)}
        </SummaryList.Value>
      </SummaryList.Row>
    );
  }
  return null;
}

type FormViewBuilder = {
  jsonForm: Form;
  formData: FormData;
  canEdit: boolean;
  formErrors: { [key: string]: string };
};

export default function FormViewBuilder({
  jsonForm,
  formData,
  canEdit,
  formErrors
}: Readonly<FormViewBuilder>) {
  return (
    <div>
      {jsonForm.pages.map((page, pageIndex) => (
        <div key={page.pageName}>
          <Card feature>
            <Card.Content>
              <Card.Heading>{page.pageName}</Card.Heading>
              {page.sections.map((section, _sectionIndex) => (
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
                    {section.fields.map(field => (
                      <VisibleField
                        key={field.name}
                        field={field}
                        formData={formData}
                        formErrors={formErrors}
                      />
                    ))}
                  </SummaryList>
                </div>
              ))}
            </Card.Content>
          </Card>
        </div>
      ))}
    </div>
  );
}

function displayListValue(fieldVal: any, fieldType?: string) {
  if (fieldVal === null || fieldVal === "") return "Not provided";
  if (fieldType === "array") {
    return fieldVal.map((item: any, index: number) => (
      <Card key={index} className="container-form-view">
        <Card.Content>
          {Object.entries(item).map((entry: any, index: number) => (
            <Container key={index}>
              <Row style={{ marginBottom: "0.5em" }}>
                <Col width="one-half">
                  <Label>
                    <b>{formatFieldName(entry[0])}</b>
                  </Label>
                </Col>
                <Col width="one-half">
                  {displayListValue(entry[1], entry[1]?.type ?? "")}
                </Col>
              </Row>
            </Container>
          ))}
        </Card.Content>
      </Card>
    ));
  }
  if (fieldType === "date" && fieldVal) {
    return DateUtilities.ToLocalDate(fieldVal);
  }
  if (typeof fieldVal === "boolean") {
    return fieldVal ? "Yes" : "No";
  }
  return fieldVal.toString();
}
