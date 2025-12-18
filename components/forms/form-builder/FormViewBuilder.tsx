import { Fragment } from "react";
import { Field, Form, FormData, FormName } from "./FormBuilder";
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
  handleEditSection,
  showFormField
} from "../../../utilities/FormBuilderUtilities";
import { DateUtilities } from "../../../utilities/DateUtilities";
import history from "../../navigation/history";
import { strDateRegex } from "../../../utilities/Constants";
import FieldWarningMsg from "../FieldWarningMsg";

type VisibleFieldProps = {
  field: Field;
  formData: FormData;
  formErrors: { [key: string]: string };
  pageIndex?: number;
  jsonFormName?: string;
  history?: any;
  canEdit?: boolean;
};

function VisibleField({
  field,
  formData,
  formErrors,
  pageIndex,
  jsonFormName,
  history,
  canEdit
}: Readonly<VisibleFieldProps>) {
  const isVisible = showFormField(field, formData);
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
              pageIndex={pageIndex}
              jsonFormName={jsonFormName}
              history={history}
              canEdit={canEdit}
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
          {displayListValue(formData, field)}
          {/* Just for mock-up, TODO proper logic */}
          {field.name === "startDate" && formData.startDate && (
            <FieldWarningMsg warningMsg="Late application (less than 16 weeks from today)" />
          )}
        </SummaryList.Value>
        <SummaryList.Actions>
          <a
            style={{ cursor: "pointer", textDecorationLine: "underline" }}
            data-cy={`edit-${field.name}`}
            onClick={() =>
              handleEditSection(
                pageIndex as number,
                jsonFormName as FormName,
                history,
                field.name
              )
            }
          >
            Change
          </a>
          <span className="nhsuk-u-visually-hidden">{`Change: ${field.label}`}</span>
        </SummaryList.Actions>
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
          <Card>
            <Card.Content>
              <Card.Heading style={{ color: "#005eb8" }}>
                {page.pageName}
              </Card.Heading>
              {page.sections.map((section, _sectionIndex) => (
                <div key={section.sectionHeader}>
                  <SummaryList>
                    {section.fields.map(field => (
                      <VisibleField
                        key={field.name}
                        field={field}
                        formData={formData}
                        formErrors={formErrors}
                        pageIndex={pageIndex}
                        jsonFormName={jsonForm.name}
                        history={history}
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

function formatEntryValue(value: any, fieldType: string) {
  if (value === null || value === "") return "Not provided";
  if (fieldType === "date" || strDateRegex.test(value)) {
    return DateUtilities.ToLocalDate(value);
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  return value?.toString();
}

function displayListValue(formData: FormData, field: Field) {
  const fieldVal = formData[field.name];
  const fieldType = field.type;
  const isDisplayAltVal = field.isDisplayAltVal ?? false;
  if (fieldVal === null || fieldVal === "") return "Not provided";
  if (fieldType === "array") {
    if (fieldVal.length === 0) return "Not provided";
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
                  {formatEntryValue(entry[1], fieldType)}
                </Col>
              </Row>
            </Container>
          ))}
        </Card.Content>
      </Card>
    ));
  }
  if (fieldVal && (fieldType === "date" || strDateRegex.test(fieldVal))) {
    return DateUtilities.ToLocalDate(fieldVal);
  }
  if (typeof fieldVal === "boolean") {
    return fieldVal ? "Yes" : "No";
  }
  // TODO needs proper mapping for other fields with alt values
  if (isDisplayAltVal && field.name === "pmId") {
    return formData["pmName"];
  }

  if (Array.isArray(fieldVal)) {
    if (fieldVal.length === 0) return "Not provided";
    return fieldVal
      .map((val: any) => formatEntryValue(val, fieldType))
      .join(", ");
  }

  return fieldVal?.toString();
}
