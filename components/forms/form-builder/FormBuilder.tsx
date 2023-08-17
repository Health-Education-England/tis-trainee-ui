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
import { Dates } from "./form-fields/Dates";
import { Phone } from "./form-fields/Phone";
import { ImportantText } from "./form-sections/ImportantText";
import useFormAutosave from "../../../utilities/hooks/useFormAutosave";
import { AutosaveMessage } from "../AutosaveMessage";
import { AutosaveNote } from "../AutosaveNote";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { StartOverButton } from "../StartOverButton";
import store from "../../../redux/store/store";

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

const FormBuilder: React.FC<FormBuilderProps> = ({
  jsonForm,
  fetchedFormData,
  options,
  validationSchema,
  history
}: FormBuilderProps) => {
  const jsonFormName = jsonForm.name;
  const pages = jsonForm.pages;
  const [fields, setFields] = useState<Field[]>([]);
  const isFormDirty = useRef(false);
  const isAutosaving =
    useAppSelector(state => state.formA.autosaveStatus) === "saving";
  // Initialise the dependent JSON form fields visibility based on the fetchedFormData state (which is needed if you load a saved draft where dependent fields would default back to hidden).
  useEffect(() => {
    const updatedFields = pages
      .flatMap((page: Page) =>
        page.sections.flatMap((section: Section) => section.fields)
      )
      .map(field => {
        if (field.visibleIf) {
          const shouldShow = field.visibleIf.includes(
            fetchedFormData[field.parent!!]
          );
          return {
            ...field,
            visible: shouldShow
          };
        }
        return field;
      });

    setFields(updatedFields);
  }, [jsonForm, fetchedFormData, pages]);

  const lastPage = pages.length - 1;
  const initialPageValue = useMemo(
    () => getEditPageNumber(jsonFormName),
    [jsonFormName]
  );
  const [currentPage, setCurrentPage] = useState(initialPageValue);
  // Get the current field names from the JSON and then get the current fields (which includes their visibility status) for validation purposes
  const fieldNamesForCurrentPage = pages[currentPage].sections.flatMap(
    (section: Section) => section.fields.map((field: Field) => field.name)
  );
  const fieldNamesForCurrentPageSet = useMemo(
    () => new Set(fieldNamesForCurrentPage),
    [fieldNamesForCurrentPage]
  );
  const currentFields = useMemo(() => {
    return fields.filter(field => fieldNamesForCurrentPageSet.has(field.name));
  }, [fields, fieldNamesForCurrentPageSet]);

  // Custom hook that tracks data changes and autosaves draft form data to db (currently triggered 2s after last dirty change)
  const { formFields, setFormFields } = useFormAutosave(
    fetchedFormData,
    jsonFormName,
    isFormDirty
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldWarning, setFieldWarning] = useState<FieldWarning | undefined>(
    undefined
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredOptions = (optionsKey: string | undefined, options: any) => {
    return optionsKey && options[optionsKey]?.length > 0
      ? options[optionsKey]
      : [];
  };

  const renderFormField = (field: Field) => {
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
    const fieldError = formErrors[name];
    // Note - Need to reference the parent field to ensure dependent fields are visible when they are meant to be shown (they default to hidden and are only shown via handleClick)
    if (visible || (parent && visibleIf?.includes(formFields[parent]))) {
      switch (type) {
        case "text":
          return (
            <Text
              name={name}
              label={label}
              formFields={formFields}
              handleChange={handleChange}
              fieldError={fieldError}
              placeholder={placeholder}
              fieldWarning={fieldWarning}
              handleBlur={handleBlur}
            />
          );
        case "radio":
          return (
            <Radios
              name={name}
              label={label}
              formFields={formFields}
              options={filteredOptions(optionsKey, options)}
              handleChange={handleChange}
            />
          );

        case "select":
          return (
            <Selector
              name={name}
              label={label}
              formFields={formFields}
              options={filteredOptions(optionsKey, options)}
              handleChange={handleChange}
            />
          );

        case "date":
          return (
            <Dates
              name={name}
              label={label}
              formFields={formFields}
              handleChange={handleChange}
              fieldError={fieldError}
              placeholder={placeholder}
            />
          );

        case "phone":
          return (
            <Phone
              name={name}
              label={label}
              formFields={formFields}
              handleChange={handleChange}
            />
          );
      }
    } else return null;
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFormFields((prev: FormData) => {
      return { ...prev, [name]: value.trim() };
    });
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    selectedOption?: any
  ) => {
    const { name, value } = event.currentTarget;
    const currentValue = selectedOption ? selectedOption.value : value;
    const primaryField = fields.find(field => field.name === name);

    // increase the width of the text field if the value is longer than 20 characters
    if (
      primaryField?.type === "text" &&
      currentValue.length >= 20 &&
      primaryField?.canGrow
    ) {
      const thisFieldWidth = setTextFieldWidth(currentValue?.length);
      event.currentTarget.className = `nhsuk-input nhsuk-input--width-${thisFieldWidth}`;
    }

    // show/hide fields based on the value of the current field
    if (primaryField?.dependencies) {
      primaryField.dependencies.forEach(fieldToShow => {
        setFields(prevFields => {
          const updatedFields = prevFields.map(field => {
            if (field.name === fieldToShow) {
              const shouldShow = field.visibleIf
                ? field.visibleIf.includes(currentValue)
                : false;
              return {
                ...field,
                visible: shouldShow
              };
            }
            return field;
          });

          updatedFields.forEach(depField => {
            if (depField.name === fieldToShow && !depField.visible) {
              setFormErrors((prev: FormData) => {
                const { [fieldToShow]: omittedField, ...newErrors } = prev;
                return newErrors;
              });
            }
          });

          return updatedFields;
        });
      });
    }

    // show warning if the value of the current field matches the warning criteria
    const inputValue = selectedOption ? selectedOption.value : value;
    if (inputValue?.length && primaryField?.warning) {
      const matcher = new RegExp(primaryField.warning.matcher, "i");
      const msg = primaryField.warning.msgText;
      const warning = showFieldMatchWarning(inputValue, matcher, msg, name);
      setFieldWarning(warning as FieldWarning);
    } else setFieldWarning(undefined);

    // update the value of the current field
    setFormFields((prev: FormData) => {
      return { ...prev, [name]: currentValue };
    });

    // validate the current field only if validation is needed on that field
    if (Object.keys(validationSchema.fields).includes(name)) {
      validationSchema
        .validateAt(name, { [name]: currentValue })
        .then(() => {
          // remove error for the current field
          setFormErrors((prev: FormData) => {
            const { [name]: currentValue, ...newErrors } = prev;
            return newErrors;
          });
        })
        .catch((err: { message: string }) => {
          // set error for the current field
          setFormErrors((prev: FormData) => {
            return { ...prev, [name]: err.message };
          });
        });
    }
    isFormDirty.current = true;
  };

  const validateFields = (fields: Field[], values: FormData) => {
    let visibleValidationSchema = Yup.object().shape({});
    visibleValidationSchema = fields.reduce((schema, field) => {
      if (field.visible) {
        const fieldSchema = validationSchema.fields[field.name];
        schema = schema.shape({
          [field.name]: fieldSchema
        });
      }
      return schema;
    }, visibleValidationSchema);

    return visibleValidationSchema.validate(values, { abortEarly: false });
  };

  const handlePageChange = () => {
    const lastSavedFormData = store.getState().formA.formAData;
    if (currentPage === lastPage) {
      validateFields(fields, formFields)
        .then(() => {
          const visibleFormData = fields.reduce((formData, field) => {
            if (
              field.visible ||
              (field.parent &&
                field.visibleIf?.includes(formFields[field.parent]))
            ) {
              formData[field.name] = formFields[field.name];
            } else {
              formData[field.name] = "";
            }
            return formData;
          }, {} as FormData);
          // Need to add these vals listed below (from last lastSavedFormData) to ensure latest autosave data is included)
          const updatedFormData = lastSavedFormData.id
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
          continueToConfirm(jsonFormName, updatedFormData, history);
        })
        .catch((err: any) => {
          const errors: Record<string, string> = {};
          err.inner.forEach((e: { path: string; message: string }) => {
            errors[e.path] = e.message;
          });
          setFormErrors(errors);
        });
    } else {
      validateFields(currentFields, formFields)
        .then(() => {
          setCurrentPage(currentPage + 1);
        })
        .catch((err: any) => {
          const errors: Record<string, string> = {};
          err.inner.forEach((e: { path: string; message: string }) => {
            errors[e.path] = e.message;
          });
          setFormErrors(errors);
        });
    }
  };

  const handleSaveBtnClick = () => {
    setIsSubmitting(true);
    saveDraftForm(jsonFormName, formFields, history);
    setIsSubmitting(false);
  };

  return (
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
                        {formFields && renderFormField(field)}
                        {formErrors[field.name] && (
                          <div
                            className="nhsuk-error-message"
                            data-cy={`${field.name}-inline-error-msg`}
                          >
                            {formErrors[field.name]}
                          </div>
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
      {/* Render error summary for the entire form */}
      {Object.keys(formErrors).length > 0 && (
        <ErrorSummary
          aria-labelledby="errorSummaryTitle"
          role="alert"
          tabIndex={-1}
        >
          <FormErrors formErrors={formErrors} />
        </ErrorSummary>
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
                  <>
                    <div>{`${currentPage + 2}. ${
                      pages[currentPage + 1].pageName
                    }`}</div>
                  </>
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
  );
};
export default FormBuilder;

interface FormErrorsProps {
  formErrors: Record<string, string>;
}

function FormErrors({ formErrors }: FormErrorsProps) {
  return (
    <div className="error-summary" data-cy="errorSummary">
      <p>
        <b>Please fix the following errors before proceeding:</b>
      </p>
      <ul>
        {Object.entries(formErrors).map(error => (
          <li data-cy={`error-txt-${error}`} key={error[0]}>{`${error[1]}`}</li>
        ))}
      </ul>
    </div>
  );
}
