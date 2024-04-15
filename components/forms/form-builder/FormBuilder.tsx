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
  sumFieldValues,
  saveDraftForm,
  validateFields,
  formatFieldName,
  showFormField
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
import PanelBuilder from "./form-array/PanelBuilder";
import { TextArea } from "./form-fields/TextArea";
import ScrollToTop from "../../common/ScrollToTop";
import { Checkboxes } from "./form-fields/Checkboxes";
import { useSelectFormData } from "../../../utilities/hooks/useSelectFormData";
import DtoBuilder from "./form-dto/DtoBuilder";

export type Field = {
  name: string;
  label?: string;
  type: string;
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
export type FormName = "formA" | "formB";
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
  const isFormDirty = useRef(false);
  const isAutosaving =
    useAppSelector(state => state.formA.autosaveStatus) === "saving";
  const lastSavedFormData = useSelectFormData(jsonFormName);
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

  const currentPageFields = useMemo(() => {
    return pages[currentPage].sections.flatMap(
      (section: Section) => section.fields
    );
  }, [currentPage, formData]);

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

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFormData((prev: FormData) => {
      return { ...prev, [name]: value.trim() };
    });
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    selectedOption?: any,
    checkedStatus?: boolean,
    arrayIndex?: number,
    arrayName?: string,
    dtoName?: string
  ) => {
    // Note - Bit of a faff, need to transform radio inputs ("Yes", "No") to boolean values (true, false) so that they can be stored in the database as such.
    const name = event.currentTarget.name;
    const primaryField = currentPageFields.find(field => field.name === name);
    const totalName = primaryField?.contributesToTotal;

    let value: string | boolean = event.currentTarget.value;
    if (value === "Yes") value = true;
    if (value === "No") value = false;
    let currentValue: string | boolean;
    if (selectedOption) {
      currentValue = selectedOption.value;
    } else if (checkedStatus !== undefined) {
      currentValue = checkedStatus;
    } else {
      currentValue = value;
    }

    // Note this code still only works for non-nested text fields
    if (typeof currentValue === "string") {
      handleTextFieldWidth(event, currentValue, primaryField);
      handleSoftValidationWarningMsgVisibility(
        currentValue,
        primaryField,
        name,
        setFieldWarning
      );
    }
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
    } else if (dtoName) {
      setFormData((prevFormData: FormData) => {
        const dto = prevFormData[dtoName];
        const updatedDto = {
          ...dto,
          [name]: currentValue
        };
        updatedFormData = {
          ...prevFormData,
          [dtoName]: updatedDto
        };
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

    // Update total field if the field that triggers the handleChange contributes to a number total
    if (totalName) {
      const fieldsToTotal = currentPageFields.filter(
        field => field.contributesToTotal === totalName
      );
      setFormData((prevFormData: FormData) => {
        const total = sumFieldValues(prevFormData, fieldsToTotal);
        return {
          ...prevFormData,
          [totalName]: total
        };
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
    validateFields(currentPageFields, formData, validationSchema)
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
        <ScrollToTop
          errors={formErrors}
          page={currentPage}
          isPageDirty={isFormDirty.current}
        />
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
                      {currentPageFields.map((field: Field) => {
                        let fieldComponent = null;
                        switch (field.type) {
                          case "array":
                            fieldComponent = (
                              <PanelBuilder
                                field={field}
                                formData={formData}
                                setFormData={setFormData}
                                renderFormField={renderFormField}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                panelErrors={formErrors[field.name]}
                                fieldWarning={fieldWarning}
                                options={options}
                                isFormDirty={isFormDirty}
                              />
                            );
                            break;
                          case "dto":
                            fieldComponent = (
                              <DtoBuilder
                                field={field}
                                formData={formData}
                                renderFormField={renderFormField}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                errors={formErrors[field.name]}
                                options={options}
                                dtoName={field.name}
                              />
                            );
                            break;
                          default:
                            fieldComponent = renderFormField(
                              field,
                              formData[field.name] ?? "",
                              formErrors[field.name] ?? "",
                              fieldWarning,
                              { handleChange, handleBlur },
                              options
                            );
                        }
                        return (
                          <div key={field.name} className="nhsuk-form-group">
                            {showFormField(field, formData)
                              ? fieldComponent
                              : null}
                          </div>
                        );
                      })}
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
            {canEditStatus && (
              <Col width="one-half">
                <Button
                  onClick={(e: { preventDefault: () => void }) => {
                    e.preventDefault();
                    continueToConfirm(jsonFormName, finalFormFields, history);
                  }}
                  data-cy="BtnShortcutToConfirm"
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

function renderFormField(
  field: Field,
  value: string,
  error: string,
  fieldWarning: FieldWarning | undefined,
  handlers: {
    handleChange: (
      event: any,
      selectedOption?: any,
      checkedStatus?: boolean,
      index?: number,
      name?: string
    ) => void;
    handleBlur: (
      event: any,
      selectedOption?: any,
      checkedStatus?: boolean,
      index?: number,
      name?: string
    ) => void;
  },
  options?: any,
  arrayDetails?: { arrayIndex: number; arrayName: string },
  dtoName?: string
): React.ReactElement | null {
  const {
    name,
    type,
    label,
    placeholder,
    optionsKey,
    width,
    isNumberField,
    isTotal,
    readOnly,
    rows
  } = field;
  const { handleChange, handleBlur } = handlers;
  const { arrayIndex, arrayName } = arrayDetails ?? {};

  switch (type) {
    case "text":
      return (
        <Text
          name={name}
          label={label}
          handleChange={handleChange}
          fieldError={error}
          fieldWarning={fieldWarning}
          placeholder={placeholder}
          handleBlur={handleBlur}
          value={value}
          arrayIndex={arrayIndex}
          arrayName={arrayName}
          dtoName={dtoName}
          width={width}
          isNumberField={isNumberField}
          isTotal={isTotal}
          readOnly={readOnly}
        />
      );

    case "textArea":
      return (
        <TextArea
          name={name}
          label={label}
          handleChange={handleChange}
          fieldError={error}
          placeholder={placeholder}
          handleBlur={handleBlur}
          value={value}
          arrayIndex={arrayIndex}
          arrayName={arrayName}
          dtoName={dtoName}
          rows={rows}
        />
      );

    case "radio":
      return (
        <Radios
          name={name}
          label={label}
          options={filteredOptions(optionsKey, options)}
          handleChange={handleChange}
          fieldError={error}
          value={value}
          arrayIndex={arrayIndex}
          arrayName={arrayName}
          dtoName={dtoName}
        />
      );

    case "select":
      return (
        <Selector
          name={name}
          label={label}
          options={filteredOptions(optionsKey, options)}
          handleChange={handleChange}
          fieldError={error}
          value={value}
          arrayIndex={arrayIndex}
          arrayName={arrayName}
          dtoName={dtoName}
        />
      );

    case "date":
      return (
        <Dates
          name={name}
          label={label}
          handleChange={handleChange}
          fieldError={error}
          placeholder={placeholder}
          value={value}
          arrayIndex={arrayIndex}
          arrayName={arrayName}
          dtoName={dtoName}
        />
      );

    case "phone":
      return (
        <Phone
          name={name}
          label={label}
          handleChange={handleChange}
          fieldError={error}
          value={value}
          arrayIndex={arrayIndex}
          arrayName={arrayName}
          dtoName={dtoName}
        />
      );
    case "checkbox":
      return (
        <Checkboxes
          name={name}
          label={label}
          handleChange={handleChange}
          fieldError={error}
          value={value}
          arrayIndex={arrayIndex}
          arrayName={arrayName}
          dtoName={dtoName}
        />
      );
    default:
      return null;
  }
}
