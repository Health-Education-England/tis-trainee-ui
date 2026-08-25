import { Field, Form, FormData, FormErrorsType, FormName } from "./FormBuilder";
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
  formErrors: FormErrorsType;
  pageIndex: number;
  jsonFormName: FormName;
  canEdit: boolean;
  options?: any;
};

function VisibleField({
  field,
  formData,
  formErrors,
  pageIndex,
  jsonFormName,
  canEdit,
  options
}: Readonly<VisibleFieldProps>) {
  const viewState = getFieldViewState(field, formData);
  // Note: info fields are UI-only to help form completion
  if (viewState === "hidden" || field.type === "info") {
    return null;
  }
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
            options={options}
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
          formErrors={formErrors}
        />
      </div>
    );
  }
  const error = formErrors[field.name];
  const errorMessage = typeof error === "string" ? error : null;

  return (
    <SummaryList className="nhsuk-u-margin-bottom-4">
      <SummaryList.Row key={field.name}>
        <SummaryList.Key data-cy={`${field.name}-label`} id={field.name}>
          <span>{field.label}</span>
          {errorMessage && (
            <span className="nhsuk-error-message">
              <span className="nhsuk-u-visually-hidden">Error:</span>{" "}
              {errorMessage}
            </span>
          )}
        </SummaryList.Key>
        <SummaryList.Value data-cy={`${field.name}-value`}>
          {formatEntryValue(
            resolveDisplayValue(field, formData, options),
            field.type
          )}
        </SummaryList.Value>
        {canEdit && viewState === "editable" && (
          <SummaryList.Action asElement="span">
            <ChangeLink
              targetField={field.name}
              label={field.label ?? ""}
              jsonFormName={jsonFormName}
              pageIndex={pageIndex}
            />
          </SummaryList.Action>
        )}
      </SummaryList.Row>
    </SummaryList>
  );
}

function resolveDisplayValue(field: Field, formData: FormData, options?: any) {
  if (field.altDisplayVal) return formData[field.altDisplayVal];
  const raw = formData[field.name];
  const fieldOptions = field.optionsKey ? options?.[field.optionsKey] : null;
  if (Array.isArray(fieldOptions)) {
    const match = fieldOptions.find(
      (o: any) => String(o.value) === String(raw)
    );
    if (match) return match.label;
  }
  return raw;
}

type FieldViewState = "hidden" | "editable" | "readOnly";

function getFieldViewState(field: Field, formData: FormData): FieldViewState {
  const fieldValue = formData[field.name];
  const isPopulated =
    fieldValue !== null && fieldValue !== undefined && fieldValue !== "";

  if (field.hideInViewWhenEmpty && !isPopulated) {
    return "hidden";
  }
  if (showFormField(field, formData)) {
    return "editable";
  }
  if (field.showInViewWhenPopulated && isPopulated) {
    return "readOnly"; // Note: field flagged showInViewWhenPopulated e.g. a startDate stamped at submission on the "No" path, which is not editable, so no change link is rendered.
  }
  return "hidden"; // Note: field flagged hideInViewWhenEmpty is hidden when no value
}

type FormViewBuilder = {
  jsonForm: Form;
  formData: FormData;
  canEdit: boolean;
  formErrors: FormErrorsType;
  options?: any;
  pageNotices?: Record<string, React.ReactNode>;
};

export default function FormViewBuilder({
  jsonForm,
  formData,
  canEdit,
  formErrors,
  options,
  pageNotices
}: Readonly<FormViewBuilder>) {
  return (
    <div>
      {jsonForm.pages.map((page, pageIndex) => (
        <div key={page.pageName}>
          <Card>
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
                    options={options}
                  />
                ))}
              </div>
            ))}
            {pageNotices?.[page.pageName]}
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
  formErrors: FormErrorsType;
};

function ArrayFieldRenderer({
  fieldVal,
  field,
  canEdit,
  pageIndex,
  jsonFormName,
  formErrors
}: Readonly<ArrayFieldRendererProps>) {
  if (!fieldVal || fieldVal.length === 0) {
    const errorMessage = formErrors[field.name] as string;
    return (
      <ArrayPanel
        title={
          <>
            <p
              data-cy="empty-array-panel-val"
              style={{ fontSize: "19px" }}
              id={field.name}
              tabIndex={-1}
            >
              Not provided
            </p>
            {errorMessage && (
              <span className="nhsuk-error-message">
                <span className="nhsuk-u-visually-hidden">Error:</span>{" "}
                {errorMessage}
              </span>
            )}
          </>
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
            <strong style={{ color: "#005eb8", fontSize: "19px" }}>
              {index + 1}.
            </strong>
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
              // nested error lookup for array items
              const arrayErrors = formErrors[field.name];
              const itemErrors = Array.isArray(arrayErrors)
                ? arrayErrors[index]
                : null;
              let errorMessage: string | null = null;
              if (
                itemErrors &&
                typeof itemErrors === "object" &&
                !Array.isArray(itemErrors)
              ) {
                const err = itemErrors[key];
                if (typeof err === "string") {
                  errorMessage = err;
                }
              }
              return (
                <SummaryList.Row key={i}>
                  <SummaryList.Key
                    data-cy={`${key}-key`}
                    id={`${field.name}-${index}-${key}`}
                    tabIndex={-1}
                  >
                    <span>{formatFieldName(key)}</span>
                    {errorMessage && (
                      <span className="nhsuk-error-message">
                        <span className="nhsuk-u-visually-hidden">Error:</span>{" "}
                        {errorMessage}
                      </span>
                    )}
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

function ArrayPanel({ children, title, action }: Readonly<ArrayPanelProps>) {
  return (
    <div className="nhsuk-u-padding-0 nhsuk-u-margin-bottom-5">
      {(title || action) && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            data-cy="array-panel-title"
            className="nhsuk-u-text-align-left nhsuk-u-margin-bottom-2"
          >
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
