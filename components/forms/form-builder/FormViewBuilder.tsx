import { Field, Form, FormData, FormName } from "./FormBuilder";
import { Card, SummaryList } from "nhsuk-react-components";
import {
  formatFieldName,
  getEditPageLocation,
  setEditPageNumber,
  showFormField
} from "../../../utilities/FormBuilderUtilities";
import { DateUtilities } from "../../../utilities/DateUtilities";
import { strDateRegex } from "../../../utilities/Constants";
import { Link } from "react-router-dom";

type VisibleFieldProps = {
  field: Field;
  formData: FormData;
  formErrors: { [key: string]: string };
  pageIndex: number;
  jsonFormName: FormName;
  canEdit: boolean;
};

function VisibleField({
  field,
  formData,
  formErrors,
  pageIndex,
  jsonFormName,
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
              canEdit={canEdit}
            />
          ))}
        </>
      );
    }
    if (field.type === "array") {
      return (
        <div key={field.name}>
          <h3
            data-cy={`${field.name}-array-panel-header`}
            className="nhsuk-heading-s nhsuk-u-margin-bottom-4"
          >
            {field.label}
          </h3>
          <ArrayFieldRenderer
            fieldVal={formData[field.name]}
            field={field}
            canEdit={canEdit}
            pageIndex={pageIndex}
            jsonFormName={jsonFormName}
          />
        </div>
      );
    }
    return (
      <SummaryList className="nhsuk-u-margin-bottom-4">
        <SummaryList.Row key={field.name}>
          <SummaryList.Key
            data-cy={`${field.name}-label`}
            className={formErrors[field.name] ? "nhsuk-error-message" : ""}
          >
            {field.label}
          </SummaryList.Key>
          <SummaryList.Value data-cy={`${field.name}-value`}>
            {formatEntryValue(formData[field.name], field.type)}
          </SummaryList.Value>
          {canEdit && (
            <SummaryList.Actions>
              <ChangeLink
                targetField={field.name}
                label={field.label ?? ""}
                jsonFormName={jsonFormName}
                pageIndex={pageIndex}
              />
            </SummaryList.Actions>
          )}
        </SummaryList.Row>
      </SummaryList>
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
              <Card.Heading
                data-cy={`pageHeader-${page.pageName}`}
                style={{ color: "#005eb8" }}
              >
                {page.pageName}
              </Card.Heading>
              {page.sections.map((section, _sectionIndex) => (
                <div key={section.sectionHeader}>
                  {section.fields.map(field => (
                    <VisibleField
                      key={field.name}
                      field={field}
                      formData={formData}
                      formErrors={formErrors}
                      pageIndex={pageIndex}
                      jsonFormName={jsonForm.name}
                      canEdit={canEdit}
                    />
                  ))}
                </div>
              ))}
            </Card.Content>
          </Card>
        </div>
      ))}
    </div>
  );
}

function formatEntryValue(value: any, fieldType?: string) {
  if (value === null || value === undefined || value === "")
    return "Not provided";
  if (fieldType === "date") {
    return DateUtilities.ToLocalDate(value);
  }
  // fallback (e.g. nested type is unknown)
  if (
    (!fieldType || fieldType === "string") &&
    typeof value === "string" &&
    strDateRegex.test(value)
  ) {
    return DateUtilities.ToLocalDate(value);
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  return value.toString();
}

type ArrayFieldRendererProps = {
  fieldVal: FormData[];
  field: Field;
  canEdit: boolean;
  pageIndex: number;
  jsonFormName: FormName;
};

function ArrayFieldRenderer({
  fieldVal,
  field,
  canEdit,
  pageIndex,
  jsonFormName
}: ArrayFieldRendererProps) {
  if (!fieldVal || fieldVal.length === 0) {
    return (
      <ArrayPanel
        title={
          <p data-cy="empty-array-panel-val" style={{ fontSize: "19px" }}>
            Not provided
          </p>
        }
        action={
          canEdit ? (
            <ChangeLink
              targetField={field.name}
              label={field.label ?? ""}
              jsonFormName={jsonFormName}
              pageIndex={pageIndex}
            />
          ) : null
        }
      />
    );
  }

  return (
    <>
      {fieldVal.map((item: FormData, index: number) => (
        <ArrayPanel
          key={index}
          title={
            canEdit ? (
              <strong style={{ color: "#005eb8", fontSize: "19px" }}>
                {index + 1}.
              </strong>
            ) : null
          }
          action={
            canEdit ? (
              <ChangeLink
                targetField={`${field.name}-${index}`}
                label={`item ${index + 1}`}
                jsonFormName={jsonFormName}
                pageIndex={pageIndex}
              />
            ) : null
          }
        >
          <SummaryList className="nhsuk-u-margin-bottom-0">
            {Object.entries(item).map((entry, i) => {
              // Note: for array nested fields, we need to find the nested field type to make formatEntryValue target the correct type
              const [key, value] = entry;
              const subField = field.objectFields?.find(f => f.name === key);
              const valueType = subField?.type;
              return (
                <SummaryList.Row key={i}>
                  <SummaryList.Key data-cy={`${key}-key`}>
                    {formatFieldName(key)}
                  </SummaryList.Key>
                  <SummaryList.Value data-cy={`${key}-value`}>
                    {formatEntryValue(value, valueType)}
                  </SummaryList.Value>
                </SummaryList.Row>
              );
            })}
          </SummaryList>
        </ArrayPanel>
      ))}
    </>
  );
}

type ArrayPanelProps = {
  children?: React.ReactNode;
  title?: React.ReactNode;
  action?: React.ReactNode;
};

function ArrayPanel({ children, title, action }: ArrayPanelProps) {
  return (
    <div className="nhsuk-u-padding-0 nhsuk-u-margin-bottom-5">
      {(title || action) && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="nhsuk-u-text-align-left nhsuk-u-margin-bottom-2">
            {title}
          </div>
          <div className="nhsuk-u-text-align-right nhsuk-u-margin-bottom-2">
            {action}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

type ChangeLinkProps = {
  targetField: string;
  label: string;
  jsonFormName: FormName;
  pageIndex: number;
};

const ChangeLink = ({
  targetField,
  label,
  jsonFormName,
  pageIndex
}: ChangeLinkProps) => (
  <>
    <Link
      to={getEditPageLocation(jsonFormName, targetField)}
      data-cy={`edit-${targetField}`}
      onClick={() => setEditPageNumber(jsonFormName, pageIndex)}
      className="nhsuk-link--no-visited-state"
      style={{ fontSize: "19px" }}
    >
      Change
    </Link>
    <span className="nhsuk-u-visually-hidden">{`Change: ${label}`}</span>
  </>
);
