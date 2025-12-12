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
import {
  FormRUtilities,
  makeWarningText,
  processLinkedFormData
} from "../../../utilities/FormRUtilities";
import {
  saveDraftForm,
  createErrorObject,
  validateFields
} from "../../../utilities/FormBuilderUtilities";
import { StartOverButton } from "../StartOverButton";
import { Form, FormData, FormErrors } from "./FormBuilder";
import Declarations from "../Declarations";
import { FormLinkerModal } from "../form-linker/FormLinkerModal";
import { LinkedFormRDataType } from "../form-linker/FormLinkerForm";
import { FormLinkerSummary } from "../form-linker/FormLinkerSummary";
import { FormRPartA } from "../../../models/FormRPartA";
import { FormRPartB } from "../../../models/FormRPartB";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { StringUtilities } from "../../../utilities/StringUtilities";

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
  const [formKey, setFormKey] = useState(Date.now());
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [canSubmit, setCanSubmit] = useState(false);

  const allPagesFields = useMemo(() => {
    return formJson.pages.flatMap(page =>
      page.sections.flatMap(section => section.fields)
    );
  }, [formJson.pages]);

  const ProgMems = useAppSelector(
    state => state.traineeProfile.traineeProfileData.programmeMemberships
  );

  // Note: need to check for isSubmitting too so the error obj is not created when the formData is being manipulated for submission
  useEffect(() => {
    if (canEditStatus && !isSubmitting) {
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
  }, [
    canEditStatus,
    formData,
    validationSchemaForView,
    allPagesFields,
    isSubmitting
  ]);

  const linkedFormData: LinkedFormRDataType = {
    isArcp: StringUtilities.convertToBool(formData.isArcp),
    programmeMembershipId: formData.programmeMembershipId,
    localOfficeName: formData.localOfficeName
  };

  const handleSubClick = () => {
    setShowModal(true);
  };

  const handleModalFormSubmit = (data: LinkedFormRDataType) => {
    setIsSubmitting(true);
    const processedFormData = processLinkedFormData(data, ProgMems);
    const { isArcp, programmeMembershipId, localOfficeName } =
      processedFormData;

    const updatedFormData = {
      ...formData,
      isArcp,
      programmeMembershipId,
      localOfficeName,
      programmeSpecialty: processedFormData.linkedProgramme?.programmeName,
      programmeName: processedFormData.linkedProgramme?.programmeName
    } as FormRPartA | FormRPartB;
    setShowModal(false);
    saveDraftForm(formJson, updatedFormData, false, true);
    setIsSubmitting(false);
  };

  const handleModalFormClose = () => {
    setShowModal(false);
    setIsSubmitting(false);
    setFormKey(Date.now());
  };

  const warningText = makeWarningText("preSub");

  return formData?.traineeTisId ? (
    <>
      <ScrollTo />
      {!canEditStatus && <FormSavePDF pmId="" />}
      {canEditStatus && <h2 data-cy="reviewSubmitHeader">Review & submit</h2>}
      {!canEditStatus &&
        FormRUtilities.displaySubmissionDate(
          formData.submissionDate,
          "submissionDateTop"
        )}
      {!canEditStatus && <FormLinkerSummary {...linkedFormData} />}
      <FormViewBuilder
        jsonForm={formJson}
        formData={formData}
        canEdit={canEditStatus}
        formErrors={errors}
      />
      {Object.keys(errors).length > 0 && <FormErrors formErrors={errors} />}

      <WarningCallout>
        <WarningCallout.Label>Declarations</WarningCallout.Label>
        <form>
          <Declarations
            setCanSubmit={setCanSubmit}
            canEdit={canEditStatus}
            formDeclarations={formJson.declarations}
          />
          {canEditStatus && (
            <Button
              onClick={(e: { preventDefault: () => void }) => {
                e.preventDefault();
                setIsSubmitting(true);
                handleSubClick();
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
                onClick={async () => {
                  setIsSubmitting(true);
                  await saveDraftForm(
                    formJson,
                    formData as FormRPartA | FormRPartB
                  );
                  setIsSubmitting(false);
                }}
                disabled={isSubmitting}
                data-cy="BtnSaveDraft"
              >
                {"Save & exit"}
              </Button>
            </Col>
            <Col width="one-quarter">
              <StartOverButton
                formName={formJson.name}
                btnLocation="formView"
              />
            </Col>
          </Row>
        </Container>
      )}
      {!canEditStatus &&
        FormRUtilities.displaySubmissionDate(
          formData.submissionDate,
          "submissionDate"
        )}
      <FormLinkerModal
        key={formKey}
        onSubmit={handleModalFormSubmit}
        isOpen={showModal}
        onClose={handleModalFormClose}
        warningText={warningText}
        linkedFormData={linkedFormData}
      />
    </>
  ) : (
    <Redirect to={redirectPath} />
  );
};
