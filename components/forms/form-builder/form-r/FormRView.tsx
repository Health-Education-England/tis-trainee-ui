import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import FormViewBuilder from "../FormViewBuilder";
import ScrollTo from "../../ScrollTo";
import FormSavePDF from "../../FormSavePDF";
import {
  Button,
  Col,
  Container,
  Row,
  WarningCallout
} from "nhsuk-react-components";
import { FormRUtilities } from "../../../../utilities/FormRUtilities";
import {
  saveDraftForm,
  createErrorObject,
  validateFields
} from "../../../../utilities/FormBuilderUtilities";
import { StartOverButton } from "../../StartOverButton";
import { Form, FormData, FormErrors } from "../FormBuilder";
import Declarations from "../../Declarations";
import { FormRPartA } from "../../../../models/FormRPartA";
import { FormRPartB } from "../../../../models/FormRPartB";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import { LifeCycleState } from "../../../../models/LifeCycleState";
import Loading from "../../../common/Loading";
import ErrorPage from "../../../common/ErrorPage";
import { loadSavedFormA } from "../../../../redux/slices/formASlice";
import { loadSavedFormB } from "../../../../redux/slices/formBSlice";
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [canSubmit, setCanSubmit] = useState(false);

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
                setIsSubmitting(true);
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
    </>
  );
};
