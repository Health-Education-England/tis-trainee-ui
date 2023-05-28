import React, { useState } from "react";
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
import { Button, WarningCallout } from "nhsuk-react-components";
import { FormRUtilities } from "../../../../../utilities/FormRUtilities";
import { useConfirm } from "material-ui-confirm";
import { FormRPartA } from "../../../../../models/FormRPartA";
import { dialogBoxWarnings } from "../../../../../utilities/Constants";
import history from "../../../../navigation/history";
import {
  saveDraftForm,
  submitForm
} from "../../../../../utilities/FormBuilderUtilities";

const FormAView = () => {
  const confirm = useConfirm();
  const formName: string = "formA";
  const canEdit = useAppSelector(selectCanEditStatus);
  const formAData = useAppSelector(selectSavedFormA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubClick = (formData: FormRPartA) => {
    setIsSubmitting(false);
    confirm({
      description: dialogBoxWarnings.formSubMsg
    })
      .then(() => submitForm(formName, formData, history))
      .catch(() => {
        console.log("form a submit cancelled");
      });
  };

  return formAData.traineeTisId ? (
    <>
      <ScrollTo />
      {!canEdit && <FormSavePDF history={history} formrPath={"/formr-a"} />}
      {canEdit && (
        <WarningCallout data-cy="warningConfirmation">
          <WarningCallout.Label visuallyHiddenText={false}>
            Confirmation
          </WarningCallout.Label>
          <p>
            Check the information entered below is correct and click Submit at
            the bottom of the page.
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
      />
      {canEdit && (
        <WarningCallout data-cy="warningSubmit">
          <WarningCallout.Label visuallyHiddenText={false}>
            Important
          </WarningCallout.Label>
          <p>
            By submitting this form, I confirm that the information above is
            correct and I will keep my Designated Body and the GMC informed as
            soon as possible of any change to my contact details.
          </p>
        </WarningCallout>
      )}
      {canEdit && (
        <div className="nhsuk-grid-row">
          <div className="nhsuk-grid-column-two-thirds">
            <div className="nhsuk-grid-row">
              <div className="nhsuk-grid-column-one-third">
                <Button
                  secondary
                  onClick={() => {
                    setIsSubmitting(true);
                    saveDraftForm(formName, formAData, history);
                  }}
                  disabled={isSubmitting}
                  data-cy="BtnSaveDraft"
                >
                  Save for later
                </Button>
              </div>
              <div className="nhsuk-grid-column-one-third">
                <Button
                  onClick={(e: { preventDefault: () => void }) => {
                    e.preventDefault();
                    setIsSubmitting(true);
                    handleSubClick(formAData);
                    // TODO need to clear the local storage after successful submission
                  }}
                  disabled={isSubmitting}
                  data-cy="BtnSubmit"
                >
                  Submit Form
                </Button>
              </div>
            </div>
          </div>
        </div>
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
