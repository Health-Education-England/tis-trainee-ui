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
  getEditPageNumber,
  saveDraftForm,
  setTextFieldWidth,
  showFieldMatchWarning
} from "../../../utilities/FormBuilderUtilities";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import DataSourceMsg from "../../common/DataSourceMsg";
import { Text } from "./form-fields/Text";
import { Radios } from "./form-fields/Radios";
import { Selector } from "./form-fields/Selector";
import { Phone } from "./form-fields/Phone";
import { ImportantText } from "./form-sections/ImportantText";
import useFormAutosave from "../../../utilities/hooks/useFormAutosave";
import { AutosaveMessage } from "../AutosaveMessage";
import { AutosaveNote } from "../AutosaveNote";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { StartOverButton } from "../StartOverButton";
import store from "../../../redux/store/store";
import PanelBuilder from "./form-array/PanelBuilder";
import { Dates } from "./form-fields/Dates";

export interface Field {
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
}
export interface FormData {
  [key: string]: any;
}
interface Page {
  pageName: string;
  importantTxtName?: string;
  msgLinkName?: string;
  sections: Section[];
}
interface Section {
  sectionHeader: string;
  fields: Field[];
  objectFields?: Field[];
}
export interface Form {
  name: string;
  pages: Page[];
}
interface FormBuilderProps {
  jsonForm: Form;
  fetchedFormData: FormData;
  options: any;
  validationSchema: any;
  history: string[];
}
export interface FieldWarning {
  fieldName: string;
  warningMsg: string;
}
export interface Warning {
  matcher: string;
  msgText: string;
}

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
  const filteredOptions = (optionsKey: string | undefined, options: any) => {
    return optionsKey && options[optionsKey]?.length > 0
      ? options[optionsKey]
      : [];
  };
  const [lastChange, setLastChange] = useState<number>(0);

  // Initialise and track the visible fields (using JSON instructions and current formData state)
  useEffect(() => {
    const updatedFields = pages[currentPage].sections
      .flatMap((section: Section) => section.fields)
      .reduce((visibleFields: Field[], field: Field) => {
        if (
          field.visible ||
          (field.visibleIf &&
            field.visibleIf.includes(formData[field.parent!!]))
        ) {
          visibleFields.push(field);
        }
        return visibleFields;
      }, []);

    setVisibleFields(updatedFields);
  }, [formData, pages, currentPage, lastChange]);

  useEffect(() => {
    if (lastChange) {
      validateFields(visibleFields, formData)
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
  }, [formData, visibleFields, lastChange]);

  const renderFormField = (
    field: Field,
    value: unknown,
    error: any,
    arrayIndex?: number,
    arrayName?: string
  ): React.ReactElement | null => {
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
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFormData((prev: FormData) => {
      return { ...prev, [name]: value.trim() };
    });
  };

  const handleTextFieldWidth = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    currentValue: string,
    primaryField: Field | undefined
  ) => {
    if (
      primaryField?.type === "text" &&
      currentValue.length >= 20 &&
      primaryField?.canGrow
    ) {
      const thisFieldWidth = setTextFieldWidth(currentValue?.length);
      event.currentTarget.className = `nhsuk-input nhsuk-input--width-${thisFieldWidth}`;
    }
  };

  const handleSoftValidationWarningMsgVisibility = (
    inputVal: string | undefined,
    primaryFormField: Field | undefined,
    fieldName: string
  ) => {
    // show warning if the value of the current field matches the warning criteria
    if (inputVal?.length && primaryFormField?.warning) {
      const matcher = new RegExp(primaryFormField.warning.matcher, "i");
      const msg = primaryFormField.warning.msgText;
      const warning = showFieldMatchWarning(inputVal, matcher, msg, fieldName);
      setFieldWarning(warning as FieldWarning);
    } else setFieldWarning(undefined);
  };

  const validateFields = (fields: Field[], values: FormData) => {
    let finalValidationSchema = Yup.object().shape({});
    finalValidationSchema = fields.reduce((schema, field) => {
      const fieldSchema = validationSchema.fields[field.name];
      if (field.type === "array") {
        const nestedFields = Object.keys(values[field.name][0]).reduce(
          (nestedSchema: { [key: string]: any }, nestedField: string) => {
            nestedSchema[nestedField] =
              fieldSchema.innerType.fields[nestedField];
            return nestedSchema;
          },
          {}
        );
        const nestedSchema = Yup.object().shape(nestedFields);
        schema = schema.shape({
          [field.name]: Yup.array().of(nestedSchema)
        });
      } else {
        schema = schema.shape({
          [field.name]: fieldSchema
        });
      }
      return schema;
    }, finalValidationSchema);
    return finalValidationSchema.validate(values, { abortEarly: false });
  };

  // NOTE: bit hacky but does works for both nested and non-nested fields
  const createErrorObject = (err: {
    inner: { path: string; message: string }[];
  }) => {
    const newErrors: unknown = {};

    const setNestedValue = (obj: any, path: string, value: string) => {
      const keys = path.split(".");
      const lastKey = keys.pop() as string;
      const lastObj = keys.reduce((obj, key, i) => {
        if (key.includes("[")) {
          const [arrayKey, arrayIndex] = key.split(/[[\]]/).filter(Boolean);
          obj[arrayKey] = obj[arrayKey] || [];
          obj[arrayKey][arrayIndex] = obj[arrayKey][arrayIndex] || {};
          return obj[arrayKey][arrayIndex];
        } else {
          obj[key] =
            obj[key] || (keys[i + 1] && keys[i + 1].includes("[") ? [] : {});
          return obj[key];
        }
      }, obj);
      lastObj[lastKey] = value;
    };

    err.inner.forEach(({ path, message }) => {
      setNestedValue(newErrors, path, message);
    });
    return newErrors;
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    selectedOption?: any,
    arrayIndex?: number,
    arrayName?: string
  ) => {
    const { name, value } = event.currentTarget;
    const currentValue = selectedOption ? selectedOption.value : value;

    // TODO this only works for non-nested fields
    const primaryField = visibleFields.find(field => field.name === name);
    handleTextFieldWidth(event, currentValue, primaryField);
    handleSoftValidationWarningMsgVisibility(currentValue, primaryField, name);
    //-----------------------------------------------------------

    let updatedFormData: FormData = {};
    setLastChange(Date.now());

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
    validateFields(visibleFields, formData)
      .then(() => {
        setFormErrors({});
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
    setLastChange(0);
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
                      {section?.fields.map((field: Field) => (
                        <div key={field.name} className="nhsuk-form-group">
                          {field.type === "array" ? (
                            <PanelBuilder
                              field={field}
                              formData={formData}
                              setFormData={setFormData}
                              renderFormField={(
                                field: Field,
                                value: unknown,
                                error: any,
                                arrayIndex?: number,
                                arrayName?: string
                              ) =>
                                renderFormField(
                                  field,
                                  value,
                                  error,
                                  arrayIndex,
                                  arrayName
                                )
                              }
                              panelErrors={formErrors[field.name]}
                            />
                          ) : (
                            renderFormField(
                              field,
                              formData[field.name],
                              formErrors[field.name]
                            )
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

interface FormErrorsListProps {
  formErrors: any;
}

function FormErrorsList({ formErrors }: Readonly<FormErrorsListProps>) {
  const renderErrors = (formErrors: any) => {
    return (
      <ul>
        {Object.keys(formErrors).map(key => {
          if (typeof formErrors[key] === "string") {
            return <div key={key}>{formErrors[key]}</div>;
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
