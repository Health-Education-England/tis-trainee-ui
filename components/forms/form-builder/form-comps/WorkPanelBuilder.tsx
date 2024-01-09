import React from "react";
import { Work } from "../../../../models/FormRPartB";
import { WorkValidationSchema } from "../form-r/part-b/formBValidationSchema";
import { Button, Card, CloseIcon } from "nhsuk-react-components";
import { Text } from "../../form-builder/form-fields/Text";
import { Dates } from "../form-fields/Dates";
import { Selector } from "../form-fields/Selector";

type WorkPanelBuilderProps = {
  formFields: any;
  setFormFields: React.Dispatch<React.SetStateAction<any>>;
  isFormDirty: React.MutableRefObject<boolean>;
  workFormErrors: Map<number, any>;
  setWorkFormErrors: React.Dispatch<React.SetStateAction<Map<number, any>>>;
};

export const WorkPanelBuilder = ({
  formFields,
  setFormFields,
  isFormDirty,
  workFormErrors,
  setWorkFormErrors
}: WorkPanelBuilderProps) => {
  const addWorkPanel = () => {
    const newWorkPanel: Work = {
      typeOfWork: "",
      startDate: "",
      endDate: "",
      site: "",
      siteLocation: "",
      siteKnownAs: "",
      trainingPost: ""
    };

    // Update the form data with the new work panel
    setFormFields((prevFormFields: any) => ({
      ...prevFormFields,
      work: [...prevFormFields.work, newWorkPanel]
    }));
    isFormDirty.current = true;
  };

  // Define a function to remove a work panel by index
  const removeWorkPanel = (index: number) => {
    // Remove the work panel at the specified index
    setFormFields((prevFormFields: any) => {
      const newWorkPanels = [...prevFormFields.work];
      newWorkPanels.splice(index, 1);
      return {
        ...prevFormFields,
        work: newWorkPanels
      };
    });
    setWorkFormErrors((prevWorkFormErrors: Map<number, string>) => {
      const newWorkFormErrors = new Map<number, string>();
      prevWorkFormErrors.forEach((value, key) => {
        // Update the keys in the error map to reflect the shift in indices
        if (key > index) {
          newWorkFormErrors.set(key - 1, value);
        } else if (key < index) {
          newWorkFormErrors.set(key, value);
        }
      });
      return newWorkFormErrors;
    });
    isFormDirty.current = true;
  };

  const updateCurrentField = async (
    fieldName: string,
    index: number,
    currentValue: any
  ) => {
    setFormFields((prevFormFields: any) => {
      const newWorkPanels = [...prevFormFields.work];
      newWorkPanels[index] = {
        ...newWorkPanels[index],
        [fieldName]: currentValue
      };
      return {
        ...prevFormFields,
        work: newWorkPanels
      };
    });
    isFormDirty.current = true;
  };

  const validateCurrentField = (
    fieldName: string,
    index: number,
    currentValue: any
  ) => {
    if (Object.keys(WorkValidationSchema.fields).includes(fieldName)) {
      WorkValidationSchema.fields[fieldName]
        .validate(currentValue)
        .then(() => {
          if (workFormErrors.has(index)) {
            const currentErrors = { ...workFormErrors.get(index) };
            delete currentErrors[fieldName];
            if (Object.keys(currentErrors).length === 0) {
              // If there are no errors for this index, delete the entry from the Map
              workFormErrors.delete(index);
            } else {
              workFormErrors.set(index, currentErrors);
            }
            setWorkFormErrors(new Map(workFormErrors));
          }
        })
        .catch((error: any) => {
          const newWorkFormErrors = new Map(workFormErrors);
          if (newWorkFormErrors.has(index)) {
            const currentErrors = { ...newWorkFormErrors.get(index) };
            currentErrors[fieldName] = error.message;
            newWorkFormErrors.set(index, currentErrors);
          } else {
            newWorkFormErrors.set(index, { [fieldName]: error.message });
          }
          setWorkFormErrors(newWorkFormErrors);
        });
    }
  };

  const handleChange = (event: any, selectedOption?: any) => {
    const { name, value } = event.currentTarget;
    const currentValue = selectedOption ? selectedOption.value : value;

    const splitName = name.split(".");
    const field = splitName[1];
    const index = parseInt(splitName[0].split("[")[1].split("]")[0]);

    updateCurrentField(field, index, currentValue);
    validateCurrentField(field, index, currentValue);
  };

  const handleNextClick = async () => {
    try {
      // Validate all work panels using the schema
      await WorkValidationSchema.validate(formFields.work, {
        abortEarly: false
      });
      // If no errors, clear the workFormErrors state
      setWorkFormErrors(new Map());
      // Proceed to the next step
      // ...
    } catch (errors: any) {
      // If there are errors, map them to the workFormErrors state
      const newWorkFormErrors = new Map();
      errors.inner.forEach((error: any) => {
        // Get the index and the field name from the error path
        const [index, fieldName] = error.path.split(".");
        // Get the current errors for this index, or create a new object if none
        const currentErrors = newWorkFormErrors.get(index) || {};
        // Add the error message for this field
        currentErrors[fieldName] = error.message;
        // Set the new errors for this index
        newWorkFormErrors.set(index, currentErrors);
      });
      // Update the workFormErrors state
      // setWorkFormErrors(newWorkFormErrors);
      console.log(newWorkFormErrors);
    }
  };

  return (
    <>
      {formFields?.work?.length > 0 ? (
        formFields.work.map((work: any, index: number) => (
          <Card key={index} data-cy="workPanel">
            <Card.Content>
              <div className="nhsuk-grid-row">
                <div className="nhsuk-grid-column-one-quarter">
                  <p>
                    <b>Type of work {index + 1}</b>
                  </p>
                </div>
                <div className="nhsuk-grid-column-three-quarters">
                  <Button
                    reverse
                    type="button"
                    data-jest="removePanel"
                    data-cy={`closeIcon${index}`}
                    onClick={() => removeWorkPanel(index)}
                    className="panel-close-btn"
                    title="Delete"
                  >
                    <CloseIcon />
                  </Button>
                </div>
              </div>

              <div style={{ marginTop: 10 }} className="nhsuk-grid-row">
                <div className="nhsuk-grid-column-three-quarters">
                  <Selector
                    name={`work[${index}].trainingPost`}
                    label="Training Post"
                    formFields={formFields}
                    options={[
                      { label: "Yes", value: "Yes" },
                      { label: "No", value: "No" }
                    ]}
                    handleChange={handleChange}
                    fieldValue={work.trainingPost}
                  />
                  {workFormErrors.get(index) && (
                    <div
                      className="nhsuk-error-message"
                      data-cy={`work${index}-inline-error-msg`}
                    >
                      {workFormErrors.get(index).trainingPost}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 10 }} className="nhsuk-grid-row">
                <div className="nhsuk-grid-column-three-quarters">
                  <Text
                    name={`work[${index}].typeOfWork`}
                    label="Type of Work"
                    formFields={formFields}
                    handleChange={handleChange}
                    placeholder={"type here..."}
                    fieldValue={work.typeOfWork}
                    fieldError={
                      workFormErrors.get(index) &&
                      workFormErrors.get(index).typeOfWork
                    }
                  />
                  {workFormErrors.get(index) && (
                    <div
                      className="nhsuk-error-message"
                      data-cy={`work${index}-inline-error-msg`}
                    >
                      {workFormErrors.get(index).typeOfWork}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ marginTop: 10 }} className="nhsuk-grid-row">
                <div className="nhsuk-grid-column-three-quarters">
                  <Dates
                    name={`work[${index}].startDate`}
                    label="Start Date"
                    formFields={formFields}
                    handleChange={handleChange}
                    fieldValue={work.startDate}
                    fieldError={
                      workFormErrors.get(index) &&
                      workFormErrors.get(index).startDate
                    }
                  />
                  {workFormErrors.get(index) && (
                    <div
                      className="nhsuk-error-message"
                      data-cy={`work${index}-inline-error-msg`}
                    >
                      {workFormErrors.get(index).startDate}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ marginTop: 10 }} className="nhsuk-grid-row">
                <div className="nhsuk-grid-column-three-quarters">
                  <Dates
                    name={`work[${index}].endDate`}
                    label="End Date"
                    formFields={formFields}
                    handleChange={handleChange}
                    fieldValue={work.endDate}
                    fieldError={
                      workFormErrors.get(index) &&
                      workFormErrors.get(index).endDate
                    }
                  />
                  {workFormErrors.get(index) && (
                    <div
                      className="nhsuk-error-message"
                      data-cy={`work${index}-inline-error-msg`}
                    >
                      {workFormErrors.get(index).endDate}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 10 }} className="nhsuk-grid-row">
                <div className="nhsuk-grid-column-three-quarters">
                  <Text
                    name={`work[${index}].site`}
                    label="Site"
                    formFields={formFields}
                    handleChange={handleChange}
                    placeholder={"type here..."}
                    fieldValue={work.site}
                    fieldError={
                      workFormErrors.get(index) &&
                      workFormErrors.get(index).site
                    }
                  />
                  {workFormErrors.get(index) && (
                    <div
                      className="nhsuk-error-message"
                      data-cy={`work${index}-inline-error-msg`}
                    >
                      {workFormErrors.get(index).site}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 10 }} className="nhsuk-grid-row">
                <div className="nhsuk-grid-column-three-quarters">
                  <Text
                    name={`work[${index}].siteLocation`}
                    label="Site Location"
                    formFields={formFields}
                    handleChange={handleChange}
                    placeholder={"type here..."}
                    fieldValue={work.siteLocation}
                    fieldError={
                      workFormErrors.get(index) &&
                      workFormErrors.get(index).siteLocation
                    }
                  />
                  {workFormErrors.get(index) && (
                    <div
                      className="nhsuk-error-message"
                      data-cy={`work${index}-inline-error-msg`}
                    >
                      {workFormErrors.get(index).siteLocation}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 10 }} className="nhsuk-grid-row">
                <div className="nhsuk-grid-column-three-quarters">
                  <Text
                    name={`work[${index}].siteKnownAs`}
                    label="Site Known As"
                    formFields={formFields}
                    handleChange={handleChange}
                    placeholder={"type here..."}
                    fieldValue={work.siteKnownAs ? work.siteKnownAs : ""}
                    fieldError={
                      workFormErrors.get(index) &&
                      workFormErrors.get(index).siteKnownAs
                    }
                  />
                  {workFormErrors.get(index) && (
                    <div
                      className="nhsuk-error-message"
                      data-cy={`work${index}-inline-error-msg`}
                    >
                      {workFormErrors.get(index).siteKnownAs}
                    </div>
                  )}
                </div>
              </div>
            </Card.Content>
          </Card>
        ))
      ) : (
        <p>You must add at least one Type of Work</p>
      )}

      <button
        onClick={e => {
          e.preventDefault();
          addWorkPanel();
        }}
      >
        Add Work Panel
      </button>
      {/* display the error summary here*/}
      <WorkPanelErrors
        workPanelErrorsArrayFromMap={Array.from(workFormErrors.entries())}
      />
      <button
        onClick={e => {
          e.preventDefault();
          console.log(formFields.work);
          handleNextClick();
        }}
      >
        test btn
      </button>
    </>
  );
};

type ErrorMap = {
  [key: string]: string;
};

type WorkPanelError = {
  [index: number]: ErrorMap;
};

type WorkPanelErrorsProps = {
  workPanelErrorsArrayFromMap: WorkPanelError[];
};

const WorkPanelErrors: React.FC<WorkPanelErrorsProps> = ({
  workPanelErrorsArrayFromMap
}) => {
  return workPanelErrorsArrayFromMap.length > 0 ? (
    <div
      className="nhsuk-error-summary"
      aria-labelledby="error-summary-title"
      role="alert"
      tabIndex={-1}
      data-cy="errorSummary"
    >
      <p>
        <b>Please fix the following errors before proceeding:</b>
      </p>
      {Object.entries(workPanelErrorsArrayFromMap).map(error => (
        <div key={error[0]}>
          <p>
            <strong>{`Work panel ${Number(error[1][0]) + 1}`}</strong>
          </p>
          {Object.values(error[1][1]).map((value, i) => (
            <p key={i}>{value}</p>
          ))}
        </div>
      ))}
    </div>
  ) : null;
};

export default WorkPanelErrors;
