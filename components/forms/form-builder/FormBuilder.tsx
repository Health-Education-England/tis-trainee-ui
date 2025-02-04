import React, { useEffect, useMemo, useRef, useState } from "react";
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
  continueToConfirm,
  createErrorObject,
  getEditPageNumber,
  handleSoftValidationWarningMsgVisibility,
  handleTextFieldWidth,
  saveDraftForm,
  validateFields,
  formatFieldName,
  showFormField,
  updateFormData,
  determineCurrentValue,
  updateTotalField,
  setFinalFormFields,
  handlePageChange
} from "../../../utilities/FormBuilderUtilities";
import { Link } from "react-router-dom";
import { ImportantText } from "./form-sections/ImportantText";
import useFormAutosave from "../../../utilities/hooks/useFormAutosave";
import { AutosaveMessage } from "../AutosaveMessage";
import { AutosaveNote } from "../AutosaveNote";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { StartOverButton } from "../StartOverButton";
import ScrollToTop from "../../common/ScrollToTop";
import { useSelectFormData } from "../../../utilities/hooks/useSelectFormData";
import { ExpanderMsg, ExpanderNameType } from "../../common/ExpanderMsg";
import { FormFieldBuilder } from "./FormFieldBuilder";
import { useFormContext } from "./FormContext";

type FieldType =
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
  isTotal?: boolean;
  readOnly?: boolean;
  rows?: number;
  isMultiSelect?: boolean;
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
  jsonForm: Form;
  options: any;
  validationSchema: any;
  history: string[];
};
export type MatcherName = "prevDateTest" | "postcodeTest";
export type FieldWarning = {
  fieldName: MatcherName;
  warningMsg: string;
};
export type Warning = {
  matcher: string;
  msgText: string;
};

export default function FormBuilder({
  jsonForm,
  options,
  validationSchema,
  history
}: Readonly<FormBuilderProps>) {
  const { formData } = useFormContext();
  console.log("formData from context in FormBuilder", formData);
  const jsonFormName = jsonForm.name;
  const pages = jsonForm.pages;
  const isFormDirty = useRef(false);
  const isAutosaving =
    useAppSelector(state => state.formA.autosaveStatus) === "saving";
  const lastPage = pages.length - 1;
  const initialPageValue = useMemo(
    () => getEditPageNumber(jsonFormName),
    [jsonFormName]
  );
  const [currentPage, setCurrentPage] = useState(initialPageValue);
  // const { formData, setFormData } = useFormAutosave(
  //   fetchedFormData,
  //   jsonFormName,
  //   isFormDirty
  // );
  const [formErrors, setFormErrors] = useState<any>({});

  const currentPageFields = useMemo(() => {
    return pages[currentPage].sections.flatMap(
      (section: Section) => section.fields
    );
  }, [currentPage, pages]);

  const canEditStatus = useAppSelector(state => state[jsonFormName].canEdit);

  useEffect(() => {
    if (isFormDirty.current) {
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
  }, [formData, currentPageFields, validationSchema]);

  return (
    <form onSubmit={handlePageChange} acceptCharset="UTF-8">
      <ScrollToTop
        errors={formErrors}
        page={currentPage}
        isPageDirty={isFormDirty.current}
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
                        isFormDirty={isFormDirty}
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
                  isFormDirty.current = false;
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
                onClick={(e: { preventDefault: () => void }) => {
                  e.preventDefault();
                  // handleShortcutToConfirm();
                }}
                data-cy="BtnShortcutToConfirm"
                disabled={Object.keys(formErrors).length > 0}
              >
                {"Shortcut to Confirm"}
              </Button>
            </Col>
          )}
          <Col width="one-quarter">
            <Button
              secondary
              onClick={(e: { preventDefault: () => void }) => {
                e.preventDefault();
                // handleSaveBtnClick();
              }}
              disabled={isAutosaving}
              data-cy="BtnSaveDraft"
            >
              {"Save & exit"}
            </Button>
          </Col>
          <Col width="one-quarter">
            <StartOverButton />
          </Col>
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
