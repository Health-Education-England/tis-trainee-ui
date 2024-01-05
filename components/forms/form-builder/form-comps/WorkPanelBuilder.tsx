import React, { useState } from "react";
import { Work } from "../../../../models/FormRPartB";
import { WorkValidationSchema } from "../form-r/part-b/formBValidationSchema";
import { Button, Card, CloseIcon } from "nhsuk-react-components";
import { Text } from "../../form-builder/form-fields/Text";

type WorkPanelBuilderProps = {
  formFields: any;
  setFormFields: React.Dispatch<React.SetStateAction<any>>;
  isFormDirty: React.MutableRefObject<boolean>;
};

export const WorkPanelBuilder = ({
  formFields,
  setFormFields,
  isFormDirty
}: WorkPanelBuilderProps) => {
  const [workFormErrors, setWorkFormErrors] = useState(new Map());
  const workFormErrorsArray = Array.from(workFormErrors.entries());
  console.log("workFormErrorsArray", Array.from(workFormErrors.entries()));

  // Define a function to add a new work panel
  const addWorkPanel = () => {
    // Create a new work panel object
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
            const newWorkFormErrors = new Map(workFormErrors);
            newWorkFormErrors.set(index, currentErrors);
            setWorkFormErrors(newWorkFormErrors);
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
      <WorkPanelErrors workPanelErrorsArrayFromMap={workFormErrorsArray} />
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
  return (
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
      {Object.entries(workPanelErrorsArrayFromMap).map(error => {
        console.log("error", error);
        return (
          <div key={error[0]}>
            <p>
              <strong>{`Work panel ${Number(error[1][0]) + 1}`}</strong>
            </p>
            {Object.values(error[1][1]).map((value, i) => {
              console.log("value", value);
              return <p key={i}>{value}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default WorkPanelErrors;
