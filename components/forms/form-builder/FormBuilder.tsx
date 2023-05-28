import { useMemo, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import { Button, Card, ErrorSummary } from "nhsuk-react-components";
import {
  continueToConfirm,
  getEditPageNumber,
  saveDraftForm,
  setTextFieldWidth,
  showFieldMatchWarning
} from "../../../utilities/FormBuilderUtilities";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import {
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataSourceMsg from "../../common/DataSourceMsg";
import { Text } from "./form-fields/Text";
import { Radios } from "./form-fields/Radios";
import { Selector } from "./form-fields/Selector";
import { Dates } from "./form-fields/Dates";
import { Phone } from "./form-fields/Phone";
import { ImportantText } from "./form-sections/ImportantText";
import useFormAutosave from "../../../utilities/hooks/useFormLocalStorageAutosave";

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
interface FormBuilder {
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

const FormBuilder: React.FC<FormBuilder> = ({
  jsonForm,
  fetchedFormData,
  options,
  validationSchema,
  history
}: FormBuilder) => {
  const { pages, name } = jsonForm;
  const lastPage = pages.length - 1;
  const initialPageValue = useMemo(() => getEditPageNumber(name), [name]);
  const [currentPage, setCurrentPage] = useState(initialPageValue);
  // Custom hook that tracks data changes and autosaves draft form data to localStorage (triggered 2s after onChange)
  const { formFields, setFormFields } = useFormAutosave(fetchedFormData, name);
  const formId: string | undefined = formFields?.id;
  const traineeId: string = formFields?.traineeTisId;
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldWarning, setFieldWarning] = useState<FieldWarning | undefined>(
    undefined
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fields: Field[] = useMemo(() => {
    return pages.flatMap((page: Page) =>
      page.sections.flatMap((section: Section) => section.fields)
    );
  }, [pages]);

  // Separate the fields of each page in a separate array
  const pagesFields: Field[][] = useMemo(() => {
    return pages.map((page: Page) =>
      page.sections.flatMap((section: Section) => section.fields)
    );
  }, [pages]);

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

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | any,
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
        const depField = fields.find(field => field.name === fieldToShow);
        if (depField && depField.visibleIf) {
          const shouldShow = depField.visibleIf.includes(currentValue);
          depField.visible = shouldShow;
        }
        if (!depField?.visible) {
          setFormErrors((prev: FormData) => {
            const { [fieldToShow]: omittedField, ...newErrors } = prev;
            return newErrors;
          });
        }
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

  const handlePageChange = async () => {
    try {
      if (currentPage === lastPage) {
        await validateFields(fields, formFields);
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
        // need to add the formId(?) and traineeId back to the formData
        const updatedFormData = formId
          ? { ...visibleFormData, id: formId, traineeTisId: traineeId }
          : { ...visibleFormData, traineeTisId: traineeId };
        continueToConfirm(name, updatedFormData, history);
      } else {
        await validateFields(pagesFields[currentPage], formFields);
        setCurrentPage(currentPage + 1);
      }
    } catch (err: any) {
      const errors: Record<string, string> = {};
      err.inner.forEach((e: { path: string; message: string }) => {
        errors[e.path] = e.message;
      });
      setFormErrors(errors);
    }
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
          {/* TODO progress bar instead? */}
          <div data-cy="progress-header">
            {pages[currentPage].pageName && (
              <h3>{`Part ${currentPage + 1} of ${pages.length} - ${
                pages[currentPage].pageName
              }`}</h3>
            )}
            {pages[currentPage].sections &&
              pages[currentPage].sections.map((section: Section) => (
                <React.Fragment key={section.sectionHeader}>
                  <Card feature>
                    <Card.Content>
                      <Card.Heading>{section.sectionHeader}</Card.Heading>
                      {section.fields &&
                        section.fields.map((field: Field) => (
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

      <div className="nhsuk-grid-row form-navigation">
        <div className="nhsuk-grid-column-one-third">
          {currentPage > 0 && pages.length > 1 && (
            <>
              <Link
                to="#"
                className="nhsuk-back-link nhsuk-u-margin-top-0 nhsuk-u-font-size-24"
                onClick={() => {
                  setFormErrors({});
                  setCurrentPage(currentPage - 1);
                }}
                data-cy={`btnBack-${currentPage - 1}`}
              >
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  style={{ fontSize: "0.8em" }}
                />
                Back
              </Link>
              <p className="form-nav_text">{`${currentPage}. ${
                pages[currentPage - 1].pageName
              }`}</p>
            </>
          )}
        </div>
        <div className="nhsuk-grid-column-one-third form-navigation-save-button">
          <Button
            secondary
            onClick={async () => {
              setIsSubmitting(true);
              saveDraftForm(name, formFields, history);
              setIsSubmitting(false);
            }}
            disabled={isSubmitting}
            data-cy="BtnSaveDraft"
          >
            Save & exit
          </Button>
        </div>
        <div className="nhsuk-grid-column-one-third form-navigation-next-link">
          <div className="page-nav-link">
            <Link
              to="#"
              className="nhsuk-back-link nhsuk-u-margin-top-0 nhsuk-u-font-size-24"
              onClick={handlePageChange}
              data-cy="BtnContinue"
            >
              {currentPage === lastPage ? "Review & submit" : "Next"}
              <FontAwesomeIcon
                icon={faChevronRight}
                style={{ fontSize: "0.8em" }}
              />
            </Link>
            {currentPage === lastPage ? (
              <p> </p>
            ) : (
              <p className="form-nav_text">{`${currentPage + 2}. ${
                pages[currentPage + 1].pageName
              }`}</p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};
export default FormBuilder;

interface FormErrors {
  formErrors: Record<string, string>;
}

function FormErrors({ formErrors }: FormErrors) {
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
