import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Button,
  Card,
  Col,
  Container,
  ErrorSummary,
  Row
} from "nhsuk-react-components";
import {
  createErrorObject,
  getEditPageNumber,
  validateFields,
  formatFieldName,
  showFormField,
  continueToConfirm,
  saveDraftForm,
  FormDataType
} from "../../../utilities/FormBuilderUtilities";
import { Link, useLocation } from "react-router-dom";
import { ImportantText } from "./form-sections/ImportantText";
import { AutosaveMessage } from "../AutosaveMessage";
import { AutosaveNote } from "../AutosaveNote";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { StartOverButton } from "../StartOverButton";
import ScrollToTop from "../../common/ScrollToTop";
import { ExpanderMsg, ExpanderNameType } from "../../common/ExpanderMsg";
import { FormFieldBuilder } from "./FormFieldBuilder";
import { useFormContext } from "./FormContext";
import { SaveAndExitButton } from "../SaveAndExitButton";

export type FieldType =
  | "text"
  | "textArea"
  | "radio"
  | "select"
  | "date"
  | "phone"
  | "checkbox"
  | "array"
  | "dto";

export type Field = {
  name: string;
  label?: string;
  type: FieldType;
  visible: boolean;
  optionsKey?: string;
  dependencies?: string[];
  visibleIf?: unknown[];
  placeholder?: string;
  warning?: Warning;
  canGrow?: boolean;
  viewWhenEmpty?: boolean;
  parent?: string;
  objectFields?: Field[];
  width?: number;
  isNumberField?: boolean;
  contributesToTotal?: string;
  readOnly?: boolean;
  rows?: number;
  isMultiSelect?: boolean;
  hint?: string;
};
export type FormData = {
  [key: string]: any;
};
type Page = {
  pageName: string;
  importantTxtName?: string;
  expanderLinkName?: string;
  sections: Section[];
};
type Section = {
  sectionHeader: string;
  fields: Field[];
  objectFields?: Field[];
};
export type FormName = "formA" | "formB" | "ltft";
export type FormDeclaration = {
  name: string;
  label: string;
};
export type Form = {
  name: FormName;
  pages: Page[];
  declarations: FormDeclaration[];
};
type FormBuilderProps = {
  options: any;
  validationSchema: any;
};
export type MatcherName = "prevDateTest" | "postcodeTest";
export type Warning = {
  matcher: MatcherName;
  msgText: string;
};

export type ReturnedWidthData = {
  fieldName: string;
  width: number;
};
export type FieldErrorType =
  | string
  | { [key: string]: FieldErrorType }
  | FieldErrorType[];
export type FormErrorsType = { [key: string]: FieldErrorType };

type LocationState = {
  fieldName?: string;
};

export default function FormBuilder({
  options,
  validationSchema
}: Readonly<FormBuilderProps>) {
  const {
    formData,
    isFormDirty,
    setIsFormDirty,
    currentPageFields,
    setCurrentPageFields,
    jsonForm,
    isAutosaving
  } = useFormContext();

  const jsonFormName = jsonForm.name;
  const pages = jsonForm.pages;
  const lastPage = pages.length - 1;
  const initialPageValue = getEditPageNumber(jsonFormName);
  const [currentPage, setCurrentPage] = useState(initialPageValue);
  const [formErrors, setFormErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canEditStatusLtft = useAppSelector(state => state.ltft.canEdit);
  const location = useLocation<LocationState>();

  useEffect(() => {
    setCurrentPageFields(
      pages[currentPage].sections.flatMap((section: Section) => section.fields)
    );
  }, [currentPage, pages, formData, setCurrentPageFields]);

  useEffect(() => {
    if (isFormDirty) {
      validateFields(currentPageFields, formData, validationSchema)
        .then(() => {
          setFormErrors({});
        })
        .catch((err: { inner: { path: string; message: string }[] }) => {
          setFormErrors(() => {
            const newErrors = createErrorObject(err);
            return newErrors;
          });
        });
    }
  }, [formData, currentPageFields, validationSchema, isFormDirty]);

  const handlePageChange = (
    e: { preventDefault: () => void },
    isShortcut?: boolean
  ) => {
    e.preventDefault();
    setIsFormDirty(false);
    validateFields(currentPageFields, formData, validationSchema)
      .then(() => {
        if (currentPage === lastPage || isShortcut) {
          saveDraftForm(
            jsonForm,
            formData as FormDataType,
            true,
            false,
            false,
            false
          );
          continueToConfirm(jsonFormName, formData);
        } else {
          setCurrentPage(currentPage + 1);
        }
      })
      .catch((err: { inner: { path: string; message: string }[] }) => {
        setFormErrors(() => {
          const newErrors = createErrorObject(err);
          return newErrors;
        });
      });
  };

  const handleSaveBtnClick = async () => {
    setIsSubmitting(true);
    await saveDraftForm(jsonForm, formData as FormDataType);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handlePageChange} acceptCharset="UTF-8">
      <ScrollToTop
        errors={formErrors}
        page={currentPage}
        isPageDirty={isFormDirty}
      />
      {pages && (
        <div data-cy="progress-header">
          {pages[currentPage].pageName && (
            <h3>{`Part ${currentPage + 1} of ${pages.length} - ${
              pages[currentPage].pageName
            }`}</h3>
          )}
          {pages[currentPage].importantTxtName && (
            <ImportantText
              txtName={pages[currentPage].importantTxtName ?? ""}
            />
          )}
          {pages[currentPage].expanderLinkName && (
            <ExpanderMsg
              expanderName={
                pages[currentPage].expanderLinkName as ExpanderNameType
              }
            />
          )}
          <AutosaveNote />
          {pages[currentPage]?.sections.map((section: Section) => (
            <React.Fragment key={section.sectionHeader}>
              <Card feature>
                <Card.Content>
                  <Card.Heading>{section.sectionHeader}</Card.Heading>
                  {section.fields.map((field: Field) => {
                    const fieldComponent = (
                      <FormFieldBuilder
                        field={field}
                        value={formData[field.name] ?? ""}
                        error={formErrors[field.name] ?? ""}
                        options={options}
                      />
                    );
                    return (
                      <div key={field.name} className="nhsuk-form-group">
                        {showFormField(field, formData) ? fieldComponent : null}
                      </div>
                    );
                  })}
                </Card.Content>
              </Card>
            </React.Fragment>
          ))}
        </div>
      )}
      <AutosaveMessage formName={jsonFormName} />
      {Object.keys(formErrors).length > 0 && (
        <FormErrors formErrors={formErrors} />
      )}
      <nav className="nhsuk-pagination">
        <ul className="nhsuk-list nhsuk-pagination__list">
          <li className="nhsuk-pagination-item--previous">
            {currentPage > 0 && pages.length > 1 && (
              <Link
                to="#"
                className={
                  "nhsuk-pagination__link nhsuk-pagination__link--prev"
                }
                onClick={() => {
                  setIsFormDirty(false);
                  setFormErrors({});
                  setCurrentPage(currentPage - 1);
                }}
                data-cy="navPrevious"
              >
                <span className="nhsuk-pagination__title">{"Previous"}</span>
                <span className="nhsuk-u-visually-hidden">:</span>
                <span className="nhsuk-pagination__page">
                  <div>{`${currentPage}. ${
                    pages[currentPage - 1].pageName
                  }`}</div>
                </span>
                <ArrowLeftIcon />
              </Link>
            )}
          </li>
          <li className="nhsuk-pagination-item--next">
            <Link
              to="#"
              className={`nhsuk-pagination__link nhsuk-pagination__link--next ${
                Object.keys(formErrors).length > 0 ? "disabled-link" : ""
              }`}
              onClick={handlePageChange}
              data-cy="navNext"
            >
              <span className="nhsuk-pagination__title">{"Next"}</span>
              <span className="nhsuk-u-visually-hidden">:</span>
              <span className="nhsuk-pagination__page">
                {currentPage === lastPage ? (
                  <>{"Review & submit"}</>
                ) : (
                  <div>{`${currentPage + 2}. ${
                    pages[currentPage + 1].pageName
                  }`}</div>
                )}
              </span>
              <ArrowRightIcon />
            </Link>
          </li>
        </ul>
      </nav>
      <Container>
        <Row>
          {/* TODO: remove canEditStatusLtft after LTFT routes are refactored */}
          {(canEditStatusLtft || location.state?.fieldName) && (
            <Col width="one-half">
              <Button
                onClick={(e: { preventDefault: () => void }) =>
                  handlePageChange(e, true)
                }
                data-cy="BtnShortcutToConfirm"
                disabled={Object.keys(formErrors).length > 0}
              >
                {"Return to Review & submit"}
              </Button>
            </Col>
          )}
          <Col width="one-quarter">
            <SaveAndExitButton
              onClick={handleSaveBtnClick}
              isSubmitting={isSubmitting}
              isAutosaving={isAutosaving}
              formName={jsonFormName}
            />
          </Col>
          {formData.status?.current?.state != "UNSUBMITTED" ? (
            <Col width="one-quarter">
              <StartOverButton formName={jsonFormName} btnLocation="form" />
            </Col>
          ) : null}
        </Row>
      </Container>
    </form>
  );
}

export function FormErrors({
  formErrors
}: Readonly<{ formErrors: FormErrorsType }>) {
  return (
    <ErrorSummary
      aria-labelledby="errorSummaryTitle"
      role="alert"
      tabIndex={-1}
    >
      <div className="error-summary" data-cy="errorSummary">
        <h2 id="errorSummaryTitle" className="nhsuk-error-summary__title">
          There is a problem
        </h2>
        <FormErrorsList formErrors={formErrors} />
      </div>
    </ErrorSummary>
  );
}

type FormErrorsListProps = {
  formErrors: FormErrorsType;
};

function FormErrorsList({ formErrors }: Readonly<FormErrorsListProps>) {
  const scrollToField = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element =
      document.getElementById(id) || document.getElementById(`${id}--input`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.focus({ preventScroll: true });
    }
  };
  const renderErrors = (errors: FormErrorsType, parentKey: string = "") => {
    return (
      <ul className="nhsuk-list nhsuk-error-summary__list">
        {Object.keys(errors).map(key => {
          const error = errors[key];
          const uniqueId = parentKey ? `${parentKey}-${key}` : key;
          if (typeof error === "string") {
            return (
              <li key={uniqueId}>
                <a
                  href={`#${uniqueId}-error`}
                  data-cy={`error-txt-${error}`}
                  onClick={e => {
                    e.preventDefault();
                    scrollToField(e, uniqueId);
                  }}
                >
                  {error}
                </a>
              </li>
            );
          } else if (Array.isArray(error)) {
            return error.map((itemError: any, index: number) => {
              if (!itemError || Object.keys(itemError).length === 0)
                return null;
              const itemParentKey = `${uniqueId}-${index}`;
              return (
                <li key={`${key}[${index}]`}>
                  <span className="nhsuk-u-font-weight-bold">
                    {`${formatFieldName(key)} ${index + 1}`}
                  </span>
                  {renderErrors(itemError, itemParentKey)}
                </li>
              );
            });
          } else {
            return <li key={key}>{renderErrors(error, uniqueId)}</li>;
          }
        })}
      </ul>
    );
  };

  return <>{renderErrors(formErrors)}</>;
}
