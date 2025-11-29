import { Field, Form, FormData, FormName } from "./FormBuilder";
import { Card, SummaryList } from "nhsuk-react-components";
import {
  formatFieldName,
  getEditPageLocation,
  setEditPageNumber,
  showFormField
} from "../../../utilities/FormBuilderUtilities";
import { DateUtilities } from "../../../utilities/DateUtilities";
import history from "../../navigation/history";
import { strDateRegex } from "../../../utilities/Constants";
import { Link } from "react-router-dom";

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
        <>
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
        </>
      );
    }
    if (field.type === "array") {
      return (
        <SummaryList.Row key={field.name}>
          <h3 className="nhsuk-heading-s nhsuk-u-margin-bottom-4">
            {field.label}
          </h3>
          {displayListValue(
            formData,
            field,
            canEdit as boolean,
            pageIndex,
            jsonFormName,
            history
          )}
        </SummaryList.Row>
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
          {displayListValue(
            formData,
            field,
            canEdit as boolean,
            pageIndex,
            jsonFormName,
            history
          )}
        </SummaryList.Value>
        {canEdit && (
          <SummaryList.Actions>
            <Link
              to={getEditPageLocation(jsonFormName as FormName, field.name)}
              data-cy={`edit-${field.name}`}
              onClick={() =>
                setEditPageNumber(jsonFormName as FormName, pageIndex as number)
              }
            >
              Change
            </Link>
            <span className="nhsuk-u-visually-hidden">{`Change: ${field.label}`}</span>
          </SummaryList.Actions>
        )}
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
                        canEdit={canEdit}
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

function displayListValue(
  formData: FormData,
  field: Field,
  canEdit: boolean,
  pageIndex?: number,
  jsonFormName?: string,
  history?: any
) {
  const fieldVal = formData[field.name];
  const fieldType = field.type;
  if (fieldVal === null || fieldVal === "") return "Not provided";
  if (fieldType === "array") {
    if (fieldVal.length === 0) return "Not provided";
    return fieldVal.map((item: any, index: number) => (
      <div key={index} className="nhsuk-u-padding-0 nhsuk-u-margin-bottom-5">
        {canEdit && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div
              className="nhsuk-u-text-align-left nhsuk-u-margin-bottom-2"
              style={{ color: "#005eb8", fontSize: "1.5rem" }}
            >
              <strong>{index + 1}.</strong>
            </div>
            <div className="nhsuk-u-text-align-right nhsuk-u-margin-bottom-2">
              <Link
                className="nhsuk-link--no-visited-state"
                data-cy={`edit-${field.name}-${index}`}
                to={getEditPageLocation(
                  jsonFormName as FormName,
                  `${field.name}-${index}`
                )}
                onClick={() => {
                  setEditPageNumber(
                    jsonFormName as FormName,
                    pageIndex as number
                  );
                }}
              >
                Change
                <span className="nhsuk-u-visually-hidden">
                  {` item ${index + 1}`}
                </span>
              </Link>
            </div>
          </div>
        )}
        <SummaryList className="nhsuk-u-margin-bottom-0">
          {Object.entries(item).map((entry: any, i: number) => (
            <SummaryList.Row key={i}>
              <SummaryList.Key>{formatFieldName(entry[0])}</SummaryList.Key>
              <SummaryList.Value>
                {formatEntryValue(entry[1], fieldType)}
              </SummaryList.Value>
            </SummaryList.Row>
          ))}
        </SummaryList>
      </div>
    ));
  }
  if (fieldVal && (fieldType === "date" || strDateRegex.test(fieldVal))) {
    return DateUtilities.ToLocalDate(fieldVal);
  }
  if (typeof fieldVal === "boolean") {
    return fieldVal ? "Yes" : "No";
  }
  return fieldVal?.toString();
}
