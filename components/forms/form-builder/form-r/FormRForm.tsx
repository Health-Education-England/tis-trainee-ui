import { useEffect, useRef, useState } from "react";
import store from "../../../../redux/store/store";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../../redux/hooks/hooks";
import { FormProvider } from "../FormContext";
import { FormRBuilder } from "./FormRBuilder";
import Loading from "../../../common/Loading";
import ErrorPage from "../../../common/ErrorPage";
import { LifeCycleState } from "../../../../models/LifeCycleState";
import { loadSavedFormA } from "../../../../redux/slices/formASlice";
import { loadSavedFormB } from "../../../../redux/slices/formBSlice";
import history from "../../../navigation/history";
import { useFormRConfig } from "../../../../utilities/hooks/useFormRConfig";
import {
  FormRUtilities,
  makeWarningText
} from "../../../../utilities/FormRUtilities";
import { selectAllSubmittedforms } from "../../../../redux/slices/formsSlice";
import { ActionModal } from "../../../common/ActionModal";

type FormRParams = {
  id: string | undefined;
};

type UnifiedFormRFormProps = {
  formType: "A" | "B";
};

export function FormRForm({ formType }: Readonly<UnifiedFormRFormProps>) {
  const { id } = useParams<FormRParams>();
  const isNewForm = id === undefined;
  const basePath = formType === "A" ? "/formr-a" : "/formr-b";

  const { formJson, validationSchema, formOptions, initialData } =
    useFormRConfig(formType);

  const formLoadStatus = useAppSelector(state =>
    formType === "A" ? state.formA.status : state.formB.status
  );

  const newFormId = useAppSelector(state =>
    formType === "A" ? state.formA.newFormId : state.formB.newFormId
  );

  const traineeProfileData = useAppSelector(
    state => state.traineeProfile.traineeProfileData
  );

  const submittedForms = useAppSelector(selectAllSubmittedforms);

  const latestSubDate = submittedForms?.length
    ? submittedForms[0].submissionDate
    : null;

  const [hasConfirmedNewForm, setHasConfirmedNewForm] = useState(false);

  const recentSubmissionWarning = isNewForm
    ? makeWarningText("new", latestSubDate)
    : null;

  const showRecentSubmissionModal =
    !!recentSubmissionWarning && !hasConfirmedNewForm;

  const loadedFormIdRef = useRef(initialData?.id);
  loadedFormIdRef.current = initialData?.id;

  const isInitialisedRef = useRef(false);

  useEffect(() => {
    if (
      isNewForm &&
      !showRecentSubmissionModal &&
      !isInitialisedRef.current &&
      traineeProfileData?.traineeTisId
    ) {
      isInitialisedRef.current = true;
      FormRUtilities.loadNewForm(basePath, traineeProfileData);
    }
  }, [isNewForm, basePath, traineeProfileData, showRecentSubmissionModal]);

  useEffect(() => {
    if (isNewForm && newFormId) {
      history.replace(`${basePath}/${newFormId}/create`);
    }
  }, [isNewForm, newFormId, basePath]);

  useEffect(() => {
    if (id && loadedFormIdRef.current !== id) {
      if (formType === "A") {
        store.dispatch(loadSavedFormA({ id }));
      } else {
        store.dispatch(loadSavedFormB({ id }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, formType]);

  if (formLoadStatus === "loading") return <Loading />;

  if (formLoadStatus === "failed") {
    return (
      <ErrorPage
        message={`Failed to load your Form R Part ${formType}. Please try again.`}
      />
    );
  }

  if (initialData?.lifecycleState === LifeCycleState.Submitted) {
    return (
      <ErrorPage
        message={`This Form R Part ${formType} has already been submitted and cannot be edited.`}
      />
    );
  }

  if (showRecentSubmissionModal) {
    return (
      <ActionModal
        onSubmit={() => setHasConfirmedNewForm(true)}
        isOpen={true}
        onClose={() => history.push(basePath)}
        cancelBtnText="Cancel"
        warningLabel="Important"
        warningText={recentSubmissionWarning}
        submittingBtnText=""
        isSubmitting={false}
      />
    );
  }

  if (isNewForm && !initialData?.traineeTisId) return <Loading />;

  if (!isNewForm && initialData?.lifecycleState === LifeCycleState.New) {
    return (
      <ErrorPage
        message={`Please return to the Form R Part ${formType} home page and try again.`}
      />
    );
  }

  const initialPageFields = formJson.pages[0].sections.flatMap(
    section => section.fields
  );

  return (
    <FormProvider
      initialData={initialData}
      initialPageFields={initialPageFields}
      jsonForm={formJson}
    >
      <FormRBuilder options={formOptions} validationSchema={validationSchema} />
    </FormProvider>
  );
}
