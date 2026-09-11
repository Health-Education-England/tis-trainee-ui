import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import FormViewBuilder from "../FormViewBuilder";
import ScrollTo from "../../ScrollTo";
import FormSavePDF from "../../FormSavePDF";
import {
  Button,
  Col,
  Container,
  InsetText,
  Row,
  WarningCallout
} from "nhsuk-react-components";
import {
  clearLinkageSection,
  FormRUtilities,
  hasStaleLinkage,
  makeWarningText
} from "../../../../utilities/FormRUtilities";
import {
  formRLegacyLinkageNotice,
  formRStaleLinkageGateLabel,
  formRStaleLinkageGateText,
  formRStaleLinkageNoticeText
} from "../../../../utilities/Constants";
import {
  saveDraftForm,
  createErrorObject,
  getEditPageLocation,
  setEditPageNumber,
  validateFields
} from "../../../../utilities/FormBuilderUtilities";
import { ActionModal } from "../../../common/ActionModal";
import history from "../../../navigation/history";
import { StartOverButton } from "../../StartOverButton";
import { Form, FormData, FormErrors } from "../FormBuilder";
import Declarations from "../../Declarations";
import { FormRPartA } from "../../../../models/FormRPartA";
import { FormRPartB } from "../../../../models/FormRPartB";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import { LifeCycleState } from "../../../../models/LifeCycleState";
import Loading from "../../../common/Loading";
import ErrorPage from "../../../common/ErrorPage";
import {
  loadSavedFormA,
  updatedFormA
} from "../../../../redux/slices/formASlice";
import {
  loadSavedFormB,
  updatedFormB
} from "../../../../redux/slices/formBSlice";
import { useFormRViewConfig } from "../../../../utilities/hooks/useFormRViewConfig";

type FormRParams = {
  id: string | undefined;
};

type LocationState = {
  fromFormCreate?: boolean;
};

type UnifiedFormRViewProps = {
  formType: "A" | "B";
};

const PROG_LINK_PAGE_NAME = "Programme Linkage";

export function FormRView({ formType }: Readonly<UnifiedFormRViewProps>) {
  const { id } = useParams<FormRParams>();
  const location = useLocation<LocationState>();
  const dispatch = useAppDispatch();
  const fromCreate = location.state?.fromFormCreate;

  const { formData, formJson, validationSchemaForView, formOptions } =
    useFormRViewConfig(formType);

  const formLoadStatus = useAppSelector(state =>
    formType === "A" ? state.formA.status : state.formB.status
  );

  useEffect(() => {
    if (id) {
      if (!fromCreate || formData?.lifecycleState === LifeCycleState.New) {
        if (formType === "A") {
          dispatch(loadSavedFormA({ id }));
        } else {
          dispatch(loadSavedFormB({ id }));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, formType, fromCreate]);

  if (
    formLoadStatus === "loading" ||
    (id &&
      formLoadStatus === "idle" &&
      formData?.lifecycleState === LifeCycleState.New)
  ) {
    return <Loading />;
  }

  if (formLoadStatus === "failed") {
    return (
      <ErrorPage
        message={`Failed to load your Form R Part ${formType}. Please try again.`}
      />
    );
  }

  if (formData?.lifecycleState === LifeCycleState.New) {
    return (
      <ErrorPage
        message={`Please return to Form R Part ${formType} home and try again.`}
      />
    );
  }

  return (
    <FormRReviewView
      formData={formData}
      formJson={formJson}
      validationSchemaForView={validationSchemaForView}
      formOptions={formOptions}
    />
  );
}

type FormReviewViewProps = {
  formData: FormData;
  formJson: Form;
  validationSchemaForView?: any;
  formOptions?: any;
};

const FormRReviewView = ({
  formData,
  formJson,
  validationSchemaForView,
  formOptions
}: FormReviewViewProps) => {
  const canEdit =
    formData?.lifecycleState === LifeCycleState.Draft ||
    formData?.lifecycleState === LifeCycleState.New ||
    formData?.lifecycleState === LifeCycleState.Unsubmitted;

  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [canSubmit, setCanSubmit] = useState(false);
  const [showStaleLinkageModal, setShowStaleLinkageModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const showStaleLinkageNotice =
    canEdit &&
    hasStaleLinkage(
      formData?.lifecycleState,
      formData?.isArcp,
      formData?.programmeMembershipId
    );

  const showLegacyLinkageNotice =
    !canEdit && typeof formData?.isArcp !== "boolean";

  const goToLinkagePage = () => {
    setEditPageNumber(
      formJson.name,
      formJson.pages.findIndex(page => page.pageName === PROG_LINK_PAGE_NAME)
    );
    history.push(getEditPageLocation(formJson.name, "programmeMembershipId"));
  };

  const handleStaleLinkageEditConfirm = () => {
    const clearedFormData = clearLinkageSection(formData);
    if (formJson.name === "formA") {
      dispatch(updatedFormA(clearedFormData as FormRPartA));
    } else {
      dispatch(updatedFormB(clearedFormData as FormRPartB));
    }
    setShowStaleLinkageModal(false);
    goToLinkagePage();
  };

  const handleSubmitConfirm = async () => {
    setIsSubmitting(true);
    await saveDraftForm(
      formJson,
      formData as FormRPartA | FormRPartB,
      false,
      true
    );
    setIsSubmitting(false);
    setShowSubmitModal(false);
  };

  const allPagesFields = useMemo(() => {
    return formJson.pages.flatMap(page =>
      page.sections.flatMap(section => section.fields)
    );
  }, [formJson.pages]);

  useEffect(() => {
    if (canEdit && !isSubmitting) {
      validateFields(allPagesFields, formData, validationSchemaForView)
        .then(() => setErrors({}))
        .catch((err: { inner: { path: string; message: string }[] }) => {
          setErrors(() => createErrorObject(err));
        });
    }
  }, [
    formData,
    validationSchemaForView,
    allPagesFields,
    isSubmitting,
    canEdit
  ]);

  let linkagePageNotice;
  if (showStaleLinkageNotice) {
    linkagePageNotice = {
      [PROG_LINK_PAGE_NAME]: (
        <StaleLinkageNotice
          onEditClick={() => setShowStaleLinkageModal(true)}
        />
      )
    };
  } else if (showLegacyLinkageNotice) {
    linkagePageNotice = {
      [PROG_LINK_PAGE_NAME]: (
        <InsetText data-cy="legacyLinkageNote">
          {formRLegacyLinkageNotice}
        </InsetText>
      )
    };
  }

  return (
    <>
      <ScrollTo />
      {!canEdit && <FormSavePDF pmId="" />}
      {canEdit && <h2 data-cy="reviewSubmitHeader">Review & submit</h2>}

      {!canEdit &&
        FormRUtilities.displaySubmissionDate(
          formData.submissionDate,
          "submissionDateTop"
        )}

      {Object.keys(errors).length > 0 && <FormErrors formErrors={errors} />}

      <FormViewBuilder
        jsonForm={formJson}
        formData={formData}
        canEdit={canEdit}
        formErrors={errors}
        options={formOptions}
        pageNotices={linkagePageNotice}
        lockedFields={
          showStaleLinkageNotice
            ? new Set(["isArcp", "programmeMembershipId"])
            : undefined
        }
        hiddenFields={
          showLegacyLinkageNotice
            ? new Set(["isArcp", "programmeMembershipId"])
            : undefined
        }
      />

      <WarningCallout>
        <WarningCallout.Heading>Declarations</WarningCallout.Heading>
        <form>
          <Declarations
            setCanSubmit={setCanSubmit}
            canEdit={canEdit}
            formDeclarations={formJson.declarations}
          />
          {canEdit && (
            <Button
              onClick={(e: { preventDefault: () => void }) => {
                e.preventDefault();
                setShowSubmitModal(true);
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
      {!canEdit &&
        FormRUtilities.displaySubmissionDate(
          formData.submissionDate,
          "submissionDate"
        )}
      <ActionModal
        onSubmit={handleSubmitConfirm}
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        cancelBtnText="Cancel"
        warningLabel="Submit"
        warningText={makeWarningText("preSub") ?? ""}
        submittingBtnText="Submitting"
        isSubmitting={isSubmitting}
      />
      <ActionModal
        onSubmit={handleStaleLinkageEditConfirm}
        isOpen={showStaleLinkageModal}
        onClose={() => setShowStaleLinkageModal(false)}
        cancelBtnText="Cancel"
        warningLabel={formRStaleLinkageGateLabel}
        warningText={formRStaleLinkageGateText}
        submittingBtnText=""
        isSubmitting={false}
      />
    </>
  );
};

function StaleLinkageNotice({
  onEditClick
}: Readonly<{ onEditClick: () => void }>) {
  return (
    <InsetText data-cy="staleLinkageNote">
      <p>{formRStaleLinkageNoticeText}</p>
      <Button type="button" data-cy="updateStaleLinkage" onClick={onEditClick}>
        Update programme linkage
      </Button>
    </InsetText>
  );
}
