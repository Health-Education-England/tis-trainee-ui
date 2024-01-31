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
  const [fields, setFields] = useState<Field[]>([]);
  console.log("fields (JSON): ", fields);
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

  // Custom hook that tracks data changes and autosaves draft form data to db (currently triggered 2s after last dirty change)
  const { formFields, setFormFields } = useFormAutosave(
    fetchedFormData,
    jsonFormName,
    isFormDirty
  );

  // Get the current field names from the JSON and then get the current fields (which includes their visibility status) for validation purposes
  const fieldNamesForCurrentPage = pages[currentPage].sections.flatMap(
    (section: Section) => section.fields.map((field: Field) => field.name)
  );
  const fieldNamesForCurrentPageSet = new Set(fieldNamesForCurrentPage);
  const currentFields = fields.filter(field =>
    fieldNamesForCurrentPageSet.has(field.name)
  );

  // Initialize a state variable to hold the timestamp of the last field value change to ensure we can update the visble fields when handleChange is called
  const [lastChange, setLastChange] = useState(Date.now());

  // Initialise and track the fields (JSON) visibility based on the fetchedFormData state (which is needed if you load a saved draft where dependent fields would default back to hidden).
  useEffect(() => {
    const updatedFields = pages[currentPage].sections
      .flatMap((section: Section) => section.fields)
      .map(field => {
        if (field.visibleIf) {
          const shouldShow = field.visibleIf.includes(
            formFields[field.parent!!]
          );
          return {
            ...field,
            visible: shouldShow
          };
        }
        return field;
      })
      .filter(field => field.visible);
    setFields(updatedFields);
  }, [formFields, pages, currentPage, lastChange]);

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

  useEffect(() => {
    if (isFormDirty.current) {
      validateFields(fields, formFields)
        .then(() => {
          console.log("empty error object");
          setFormErrors({});
        })
        .catch((err: { inner: { path: string; message: string }[] }) => {
          setFormErrors(() => {
            const newErrors = createErrorObject(err);
            return newErrors;
          });
        });
    }
  }, [formFields, fields]);

  const renderFormField = (
    field: Field,
    value: unknown,
    error: any,
    arrayIndex?: number,
    arrayName?: string
  ): React.ReactElement | null => {
    const {
      name,
      type,
      label,
      placeholder,
      visible,
      visibleIf,
      parent,
      optionsKey
    } = field;
    // Note - Need to reference the parent field to ensure dependent fields are visible when they are meant to be shown (they default to hidden and are only shown via handleClick)
    if (visible || (parent && visibleIf?.includes(formFields[parent]))) {
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
    } else return null;
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFormFields((prev: FormData) => {
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

  const handleErrorCatching = (e: any) => {
    if (e) {
      const errors: Record<string, string> = {};
      e.inner.forEach((err: { path: string; message: string }) => {
        errors[err.path] = err.message;
      });
      setFormErrors(errors);
    }
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
          const [arrayKey, arrayIndex] = key.split(/[\[\]]/).filter(Boolean);
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
    console.log("createErrorObject: ", newErrors);
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

    // handleTextFieldWidth(event, currentValue, primaryField);
    // handleSoftValidationWarningMsgVisibility(inputValue, primaryField, name);

    let updatedFormData: FormData = {};
    setLastChange(Date.now());

    if (typeof arrayIndex === "number" && arrayName) {
      setFormFields((prevFormData: FormData) => {
        const newArray = [...prevFormData[arrayName]];
        newArray[arrayIndex] = {
          ...newArray[arrayIndex],
          [name]: currentValue
        };
        updatedFormData = { ...prevFormData, [arrayName]: newArray };
        return updatedFormData;
      });
    } else {
      setFormFields((prevFormData: FormData) => {
        updatedFormData = {
          ...prevFormData,
          [name]: currentValue
        };
        return updatedFormData;
      });
    }
    isFormDirty.current = true;
  };

  const calculateVisibleFields = (formFields: {
    [fieldName: string]: string;
  }) => {
    const visibleFormData = fields.reduce((formData, field: Field) => {
      if (
        field.visible ||
        (field.parent && field.visibleIf?.includes(formFields[field.parent]))
      ) {
        formData[field.name] = formFields[field.name];
      } else {
        formData[field.name] = "";
      }
      return formData;
    }, {} as FormData);
    // Need to add these vals listed below (from last lastSavedFormData) to ensure latest autosave data is included)
    return lastSavedFormData.id
      ? {
          ...visibleFormData,
          id: lastSavedFormData.id,
          lastModifiedDate: lastSavedFormData.lastModifiedDate,
          lifecycleState: lastSavedFormData.lifecycleState,
          traineeTisId: lastSavedFormData.traineeTisId
        }
      : {
          ...visibleFormData,
          traineeTisId: lastSavedFormData.traineeTisId
        };
  };

  const handlePageChange = () => {
    if (currentPage === lastPage) {
      validateFields(fields, formFields)
        .then(() => {
          const visibleFormData = calculateVisibleFields(formFields);
          continueToConfirm(jsonFormName, visibleFormData, history);
        })
        .catch(err => {
          handleErrorCatching(err);
        });
    } else {
      validateFields(currentFields, formFields)
        .then(() => {
          setCurrentPage(currentPage + 1);
        })
        .catch(err => {
          handleErrorCatching(err);
        });
    }
  };

  const handleSaveBtnClick = () => {
    setIsSubmitting(true);
    saveDraftForm(jsonFormName, formFields, history);
    setIsSubmitting(false);
  };

  return (
    formFields && (
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
                              formFields={formFields}
                              setFormFields={setFormFields}
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
                              formFields[field.name],
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

interface FormErrorsProps {
  formErrors: Record<string, string>;
}

export function FormErrors({ formErrors }: Readonly<FormErrorsProps>) {
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
        <ul>
          {Object.entries(formErrors).map(error => (
            <li
              data-cy={`error-txt-${error}`}
              key={error[0]}
            >{`${error[1]}`}</li>
          ))}
        </ul>
      </div>
    </ErrorSummary>
  );
}
