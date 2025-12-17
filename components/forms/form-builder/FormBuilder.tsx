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
  isDisplayAltVal?: boolean;
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
export type MatcherName = "prevDateTest" | "postcodeTest" | "ltft16WeeksTest";
export type Warning = {
  matcher: MatcherName;
  msgText: string;
};

export type ReturnedWidthData = {
  fieldName: string;
  width: number;
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

  const location = useLocation<{ fieldName: string }>();

  const jsonFormName = jsonForm.name;
  const pages = jsonForm.pages;
  const lastPage = pages.length - 1;
  const initialPageValue = getEditPageNumber(jsonFormName);
  const [currentPage, setCurrentPage] = useState(initialPageValue);
  const [formErrors, setFormErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canEditStatus = useAppSelector(state => state[jsonFormName].canEdit);

  useEffect(() => {
    if (location.state?.fieldName) {
      const fieldElement = document.getElementById(location.state.fieldName);
      if (fieldElement) {
        fieldElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentPage, location.state]);

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
          {pages[currentPage]?.sections.map((section: Section) => (
            <React.Fragment key={section.sectionHeader}>
              <Card>
                <Card.Content>
                  <Card.Heading style={{ color: "#005eb8" }}>
                    {section.sectionHeader}
                  </Card.Heading>
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
                      <div
                        key={field.name}
                        id={field.name}
                        className="nhsuk-form-group"
                      >
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
      <AutosaveNote />
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
          {canEditStatus && (
            <Col width="one-half">
              <Button
                onClick={(e: { preventDefault: () => void }) =>
                  handlePageChange(e, true)
                }
                data-cy="BtnShortcutToConfirm"
                disabled={Object.keys(formErrors).length > 0}
              >
                {"Shortcut back to Review & submit"}
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

export function FormErrors(formErrors: any) {
  return (
    <ErrorSummary
      aria-labelledby="errorSummaryTitle"
      role="alert"
      tabIndex={-1}
    >
      <div className="error-summary" data-cy="errorSummary">
        <p>
          <b>
            Before proceeding to the next section please address the following:
          </b>
        </p>
        <FormErrorsList formErrors={formErrors} />
      </div>
    </ErrorSummary>
  );
}

type FormErrorsListProps = {
  formErrors: any;
};

function FormErrorsList({ formErrors }: Readonly<FormErrorsListProps>) {
  const renderErrors = (formErrors: any) => {
    return (
      <ul>
        {Object.keys(formErrors).map(key => {
          if (typeof formErrors[key] === "string") {
            return (
              <div
                key={key}
                className="error-spacing_div"
                data-cy={`error-txt-${formErrors[key]}`}
              >
                {formErrors[key]}
              </div>
            );
          } else if (Array.isArray(formErrors[key])) {
            return formErrors[key].map((error: any, index: number) => {
              return (
                <li
                  key={`${key}[${index}]`}
                  className="error-summary_li_nested"
                >
                  <span>
                    <b>{`${formatFieldName(key)} ${index + 1}`}</b>
                  </span>
                  <span>{renderErrors(error)}</span>
                </li>
              );
            });
          } else {
            return (
              <li key={key} className="error-summary_li">
                {renderErrors(formErrors[key])}
              </li>
            );
          }
        })}
      </ul>
    );
  };

  return <div>{renderErrors(formErrors)}</div>;
}
