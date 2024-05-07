import React, { useEffect, useMemo, useState } from "react";
import { Redirect } from "react-router-dom";
import FormViewBuilder from "./FormViewBuilder";
import ScrollTo from "../ScrollTo";
import FormSavePDF from "../FormSavePDF";
import {
  Button,
  Col,
  Container,
  Row,
  WarningCallout
} from "nhsuk-react-components";
import { FormRUtilities } from "../../../utilities/FormRUtilities";
import { useConfirm } from "material-ui-confirm";
import { dialogBoxWarnings } from "../../../utilities/Constants";
import history from "../../navigation/history";
import {
  createErrorObject,
  saveDraftForm,
  submitForm,
  validateFields
} from "../../../utilities/FormBuilderUtilities";
import { StartOverButton } from "../StartOverButton";
import { Form, FormData, FormErrors, FormName } from "./FormBuilder";
import Declarations from "./Declarations";

type FormViewProps = {
  formData: FormData;
  canEditStatus: boolean;
  formJson: Form;
  redirectPath: string;
  validationSchemaForView?: any;
};

export const FormView = ({
  formData,
  canEditStatus,
  formJson,
  validationSchemaForView,
  redirectPath
}: FormViewProps) => {
  const confirm = useConfirm();
  const formName = formJson.name as FormName;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [canSubmit, setCanSubmit] = useState(false);

  const allPagesFields = useMemo(() => {
    return formJson.pages.flatMap(page =>
      page.sections.flatMap(section => section.fields)
    );
  }, [formJson.pages]);

  useEffect(() => {
    if (canEditStatus) {
      validateFields(allPagesFields, formData, validationSchemaForView)
        .then(() => {
          setErrors({});
        })
        .catch((err: { inner: { path: string; message: string }[] }) => {
          setErrors(() => {
            const newErrors = createErrorObject(err);
            return newErrors;
          });
        });
    }
  }, [canEditStatus, formData, validationSchemaForView, allPagesFields]);

  const handleSubClick = (formData: FormData) => {
    setIsSubmitting(false);
    confirm({
      description: dialogBoxWarnings.formSubMsg
    })
      .then(() => submitForm(formJson, formData, history))
      .catch(() => setIsSubmitting(false));
  };

  return formData?.traineeTisId ? (
    <>
      <ScrollTo />
      {!canEditStatus && <FormSavePDF history={history} path={redirectPath} />}
      {canEditStatus && (
        <WarningCallout data-cy="warningConfirmation">
          <WarningCallout.Label visuallyHiddenText={false}>
            Confirmation
          </WarningCallout.Label>
          <p>
            {`Please check the information entered below is correct, agree to the
            Declarations at the bottom of the page, and then click 'Submit
            Form'.`}
          </p>
        </WarningCallout>
      )}
      {!canEditStatus &&
        FormRUtilities.displaySubmissionDate(
          formData.submissionDate,
          "submissionDateTop"
        )}
      <FormViewBuilder
        jsonForm={formJson}
        formData={formData}
        canEdit={canEditStatus}
        formErrors={errors}
      />
      {Object.keys(errors).length > 0 && <FormErrors formErrors={errors} />}

      <WarningCallout>
        <WarningCallout.Label>Declarations</WarningCallout.Label>
        <form onSubmit={() => setIsSubmitting(true)}>
          <Declarations
            setCanSubmit={setCanSubmit}
            canEdit={canEditStatus}
            formJson={formJson}
          />
          {canEditStatus && (
            <Button
              onClick={(e: { preventDefault: () => void }) => {
                e.preventDefault();
                setIsSubmitting(true);
                handleSubClick(formData);
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
      {canEditStatus && (
        <Container>
          <Row>
            <Col width="one-quarter">
              <Button
                secondary
                onClick={() => {
                  setIsSubmitting(true);
                  saveDraftForm(formName, formData, history);
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
      {!canEditStatus &&
        FormRUtilities.displaySubmissionDate(
          formData.submissionDate,
          "submissionDate"
        )}
    </>
  ) : (
    <Redirect to={redirectPath} />
  );
};
