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
  filteredOptions,
  getEditPageNumber,
  handleSoftValidationWarningMsgVisibility,
  handleTextFieldWidth,
  saveDraftForm,
  validateFields
} from "../../../utilities/FormBuilderUtilities";
import { Link } from "react-router-dom";
import DataSourceMsg from "../../common/DataSourceMsg";
import { Text } from "./form-fields/Text";
import { Radios } from "./form-fields/Radios";
import { Selector } from "./form-fields/Selector";
import { Dates } from "./form-fields/Dates";
import { Phone } from "./form-fields/Phone";
import { ImportantText } from "./form-sections/ImportantText";
import useFormAutosave from "../../../utilities/hooks/useFormAutosave";
import { AutosaveMessage } from "../AutosaveMessage";
import { AutosaveNote } from "../AutosaveNote";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { StartOverButton } from "../StartOverButton";
import store from "../../../redux/store/store";
import PanelBuilder from "./form-array/PanelBuilder";

export type Field = {
  name: string;
  label?: string;
  type: string;
  visible: boolean;
  optionsKey?: string;
  dependencies?: string[];
  visibleIf?: string[];
  placeholder?: string;
  warning?: Warning;
  canGrow?: boolean;
  viewWhenEmpty?: boolean;
  parent?: string;
  objectFields?: Field[];
  value?: unknown;
};
export type FormData = {
  [key: string]: any;
};
type Page = {
  pageName: string;
  importantTxtName?: string;
  msgLinkName?: string;
  sections: Section[];
};
type Section = {
  sectionHeader: string;
  fields: Field[];
  objectFields?: Field[];
};
export type Form = {
  name: string;
  pages: Page[];
};
type FormBuilderProps = {
  jsonForm: Form;
  fetchedFormData: FormData;
  options: any;
  validationSchema: any;
  history: string[];
};
export type FieldWarning = {
  fieldName: string;
  warningMsg: string;
};
export type Warning = {
  matcher: string;
  msgText: string;
};

export default function FormBuilder({
  jsonForm,
  fetchedFormData,
  options,
  validationSchema,
  history
}: Readonly<FormBuilderProps>) {
  const jsonFormName = jsonForm.name;
  const pages = jsonForm.pages;
  const [visibleFields, setVisibleFields] = useState<Field[]>([]);
  const isFormDirty = useRef(false);
  const isAutosaving =
    useAppSelector(state => state.formA.autosaveStatus) === "saving";
  const lastSavedFormData = store.getState().formA.formAData;
  const lastPage = pages.length - 1;
  const initialPageValue = useMemo(
    () => getEditPageNumber(jsonFormName),
    [jsonFormName]
  );
  const [currentPage, setCurrentPage] = useState(initialPageValue);
  const { formData, setFormData } = useFormAutosave(
    fetchedFormData,
    jsonFormName,
    isFormDirty
  );
  const [formErrors, setFormErrors] = useState<any>({});
  const [fieldWarning, setFieldWarning] = useState<FieldWarning | undefined>(
    undefined
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const flatFields = useMemo(
    () =>
      pages[currentPage].sections.flatMap((section: Section) => section.fields),
    [currentPage, pages]
  );

  // Initialise and track the visible fields (using JSON instructions and current formData state)
  useEffect(() => {
    const updatedFields = flatFields.reduce(
      (visibleFields: Field[], field: Field) => {
        if (
          field.visible ||
          (field.visibleIf &&
            field.visibleIf.includes(formData[field.parent!!]))
        ) {
          visibleFields.push(field);
        }
        return visibleFields;
      },
      []
    );

    setVisibleFields(updatedFields);
  }, [formData, flatFields, currentPage]);

  useEffect(() => {
    if (isFormDirty.current) {
      validateFields(visibleFields, formData, validationSchema)
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
  }, [formData, visibleFields, validationSchema]);

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFormData((prev: FormData) => {
      return { ...prev, [name]: value.trim() };
    });
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    selectedOption?: any,
    arrayIndex?: number,
    arrayName?: string
  ) => {
    const { name, value } = event.currentTarget;
    const currentValue = selectedOption ? selectedOption.value : value;

    // Note this code still only works for non-nested text fields
    const primaryField = visibleFields.find(field => field.name === name);
    handleTextFieldWidth(event, currentValue, primaryField);
    handleSoftValidationWarningMsgVisibility(
      currentValue,
      primaryField,
      name,
      setFieldWarning
    );
    //-----------------------------------------------------------

    let updatedFormData: FormData = {};
    if (typeof arrayIndex === "number" && arrayName) {
      setFormData((prevFormData: FormData) => {
        const newArray = [...prevFormData[arrayName]];
        newArray[arrayIndex] = {
          ...newArray[arrayIndex],
          [name]: currentValue
        };
        updatedFormData = { ...prevFormData, [arrayName]: newArray };
        return updatedFormData;
      });
    } else {
      setFormData((prevFormData: FormData) => {
        updatedFormData = {
          ...prevFormData,
          [name]: currentValue
        };
        return updatedFormData;
      });
    }
    isFormDirty.current = true;
  };

  const finalFormFields = lastSavedFormData.id
    ? {
        ...formData,
        id: lastSavedFormData.id,
        lastModifiedDate: lastSavedFormData.lastModifiedDate,
        lifecycleState: lastSavedFormData.lifecycleState,
        traineeTisId: lastSavedFormData.traineeTisId
      }
    : { ...formData, traineeTisId: lastSavedFormData.traineeTisId };

  const handlePageChange = () => {
    isFormDirty.current = false;
    validateFields(visibleFields, formData, validationSchema)
      .then(() => {
        if (currentPage === lastPage) {
          continueToConfirm(jsonFormName, finalFormFields, history);
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

  const handleSaveBtnClick = () => {
    setIsSubmitting(true);
    saveDraftForm(jsonFormName, formData, history);
    setIsSubmitting(false);
  };

  return (
    formData && (
      <form onSubmit={handlePageChange} acceptCharset="UTF-8">
        {pages && (
          <>
            <div>
              {pages[currentPage].importantTxtName && (
                <ImportantText
                  txtName={pages[currentPage].importantTxtName as string}
                />
              )}
            </div>
            {pages[currentPage].msgLinkName && <DataSourceMsg />}
            <div data-cy="progress-header">
              {pages[currentPage].pageName && (
                <h3>{`Part ${currentPage + 1} of ${pages.length} - ${
                  pages[currentPage].pageName
                }`}</h3>
              )}
              {pages[currentPage]?.sections.map((section: Section) => (
                <React.Fragment key={section.sectionHeader}>
                  <AutosaveNote />
                  <Card feature>
                    <Card.Content>
                      <Card.Heading>{section.sectionHeader}</Card.Heading>
                      {visibleFields.map((field: Field) => (
                        <div key={field.name} className="nhsuk-form-group">
                          {field.type === "array"
                            ? renderArrayField(
                                field,
                                formData,
                                setFormData,
                                formErrors,
                                renderFormField
                              )
                            : renderFormField(
                                field,
                                handleChange,
                                fieldWarning,
                                handleBlur,
                                options,
                                formData[field.name],
                                formErrors[field.name]
                              )}
                        </div>
                      ))}
                    </Card.Content>
                  </Card>
                  <AutosaveMessage formName={jsonFormName} />
                </React.Fragment>
              ))}
            </div>
          </>
        )}
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
                  isSubmitting || Object.keys(formErrors).length > 0
                    ? "disabled-link"
                    : ""
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
            <Col width="one-quarter">
              <Button
                secondary
                onClick={(e: { preventDefault: () => void }) => {
                  e.preventDefault();
                  handleSaveBtnClick();
                }}
                disabled={isSubmitting || isAutosaving}
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
    )
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
          <b>Please fix the following errors before proceeding:</b>
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
                    <b>{`${key} ${index + 1}`}</b>
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

function renderFormField(
  field: Field,
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  fieldWarning: FieldWarning | undefined,
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void,
  options: any,
  value: unknown,
  error: any,
  arrayIndex?: number,
  arrayName?: string
): React.ReactElement | null {
  const { name, type, label, placeholder, optionsKey } = field;
  switch (type) {
    case "text":
      return (
        <Text
          name={name}
          label={label}
          handleChange={handleChange}
          fieldError={error ?? ""}
          placeholder={placeholder}
          fieldWarning={fieldWarning}
          handleBlur={handleBlur}
          value={value as string}
          arrayIndex={arrayIndex}
          arrayName={arrayName}
        />
      );
    case "radio":
      return (
        <Radios
          name={name}
          label={label}
          options={filteredOptions(optionsKey, options)}
          handleChange={handleChange}
          value={value as string}
          arrayIndex={arrayIndex}
          arrayName={arrayName}
        />
      );

    case "select":
      return (
        <Selector
          name={name}
          label={label}
          options={filteredOptions(optionsKey, options)}
          handleChange={handleChange}
          fieldError={error ?? ""}
          value={value as string}
          arrayIndex={arrayIndex}
          arrayName={arrayName}
        />
      );

    case "date":
      return (
        <Dates
          name={name}
          label={label}
          handleChange={handleChange}
          fieldError={error ?? ""}
          placeholder={placeholder}
          value={value as string | Date}
          arrayIndex={arrayIndex}
          arrayName={arrayName}
        />
      );

    case "phone":
      return (
        <Phone
          name={name}
          label={label}
          handleChange={handleChange}
          value={value as string}
          arrayIndex={arrayIndex}
          arrayName={arrayName}
        />
      );
    default:
      return null;
  }
}

function renderArrayField(
  field: Field,
  formData: any,
  setFormData: any,
  formErrors: any,
  renderFormField: any
) {
  return (
    <PanelBuilder
      field={field}
      formData={formData}
      setFormData={setFormData}
      renderFormField={renderFormField}
      panelErrors={formErrors[field.name]}
    />
  );
}
