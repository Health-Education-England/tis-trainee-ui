import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../../../redux/hooks/hooks";
import {
  selectCanEditStatus,
  selectSavedFormA
} from "../../../../../redux/slices/formASlice";
import { Redirect } from "react-router-dom";
import formAJson from "./formA.json";
import FormViewBuilder from "../../FormViewBuilder";
import ScrollTo from "../../../ScrollTo";
import FormSavePDF from "../../../FormSavePDF";
import {
  Button,
  Col,
  Container,
  Row,
  WarningCallout
} from "nhsuk-react-components";
import { FormRUtilities } from "../../../../../utilities/FormRUtilities";
import { useConfirm } from "material-ui-confirm";
import { FormRPartA } from "../../../../../models/FormRPartA";
import { dialogBoxWarnings } from "../../../../../utilities/Constants";
import history from "../../../../navigation/history";
import {
  saveDraftForm,
  submitForm
} from "../../../../../utilities/FormBuilderUtilities";
import { StartOverButton } from "../../../StartOverButton";
import { formAValidationSchemaView } from "./formAValidationSchema";
import { ValidationError } from "yup";
import { FormErrors } from "../../FormBuilder";
import Declarations from "../../Declarations";

const FormAView = () => {
  const confirm = useConfirm();
  const formName = formAJson.name;
  const canEdit = useAppSelector(selectCanEditStatus);
  const formAData = useAppSelector(selectSavedFormA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    if (canEdit) {
      formAValidationSchemaView
        .validate(formAData, { abortEarly: false })
        .then(() => {
          setErrors({});
        })
        .catch(err => {
          if (err) {
            const errorMessages: { [key: string]: string } = {};
            err.inner.forEach((error: ValidationError) => {
              if (error.path) {
                errorMessages[error.path] = error.message;
              }
            });
            setErrors(errorMessages);
          }
        });
    }
  }, [canEdit, formAData]);

  const handleSubClick = (formData: FormRPartA) => {
    setIsSubmitting(false);
    confirm({
      description: dialogBoxWarnings.formSubMsg
    })
      .then(() => submitForm(formAJson, formData, history))
      .catch(() => {
        console.log("form a submit cancelled");
      });
  };

  return formAData.traineeTisId ? (
    <>
      <ScrollTo />
      {!canEdit && <FormSavePDF history={history} path={"/formr-a"} />}
      {canEdit && (
        <WarningCallout data-cy="warningConfirmation">
          <WarningCallout.Label visuallyHiddenText={false}>
            Confirmation
          </WarningCallout.Label>
          <p>
            Please check the information entered below is correct, agree to the
            Declarations at the bottom of the page, and then click 'Submit
            Form'.
          </p>
        </WarningCallout>
      )}
      {!canEdit &&
        FormRUtilities.displaySubmissionDate(
          formAData.submissionDate,
          "submissionDateTop"
        )}
      <FormViewBuilder
        jsonForm={formAJson}
        formData={formAData}
        canEdit={canEdit}
        formErrors={errors}
      />
      {Object.keys(errors).length > 0 && <FormErrors formErrors={errors} />}

      <WarningCallout>
        <WarningCallout.Label>Declarations</WarningCallout.Label>
        <form onSubmit={() => setIsSubmitting(true)}>
          <Declarations
            setCanSubmit={setCanSubmit}
            canEdit={canEdit}
            formJson={formAJson}
          />
          {canEdit && (
            <Button
              onClick={(e: { preventDefault: () => void }) => {
                e.preventDefault();
                setIsSubmitting(true);
                handleSubClick(formAData);
              }}
              disabled={
                !canSubmit || isSubmitting || Object.keys(errors).length > 0
              }
              data-cy="BtnSubmit"
            >
              Submit Form
            </Button>
          )}
        </form>
      </WarningCallout>

      {canEdit && (
        <Container>
          <Row>
            <Col width="one-quarter">
              <Button
                secondary
                onClick={() => {
                  setIsSubmitting(true);
                  saveDraftForm(formName, formAData, history);
                }}
                disabled={isSubmitting}
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
      )}
      {!canEdit &&
        FormRUtilities.displaySubmissionDate(
          formAData.submissionDate,
          "submissionDate"
        )}
    </>
  ) : (
    <Redirect to="/formr-a" />
  );
};

export default FormAView;
