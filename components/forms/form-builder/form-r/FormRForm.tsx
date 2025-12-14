import { useEffect, useRef } from "react";
import store from "../../../../redux/store/store";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../../redux/hooks/hooks";
import { FormProvider } from "../FormContext";
import FormBuilder, { FormName } from "../FormBuilder";
import Loading from "../../../common/Loading";
import ErrorPage from "../../../common/ErrorPage";
import { FormLinkerModal } from "../../form-linker/FormLinkerModal";
import { LinkedFormRDataType } from "../../form-linker/FormLinkerForm";
import { LifeCycleState } from "../../../../models/LifeCycleState";
import { resetForm } from "../../../../utilities/FormBuilderUtilities";
import {
  FormRUtilities,
  makeWarningText,
  processLinkedFormData
} from "../../../../utilities/FormRUtilities";
import { selectAllSubmittedforms } from "../../../../redux/slices/formsSlice";
import { loadSavedFormA } from "../../../../redux/slices/formASlice";
import { loadSavedFormB } from "../../../../redux/slices/formBSlice";
import history from "../../../navigation/history";
import { useFormRConfig } from "../../../../utilities/hooks/useFormRConfig";

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
  const formName: FormName = formType === "A" ? "formA" : "formB";

  const { formData, formJson, validationSchema, formOptions, initialData } =
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

  const showLinkerModal = isNewForm && !formData?.traineeTisId;

  const loadedFormIdRef = useRef(formData?.id);
  loadedFormIdRef.current = formData?.id;

  useEffect(() => {
    if (isNewForm && newFormId) {
      history.replace(`${basePath}/${newFormId}/create`, {
        newFormSaved: true
      });
    }
  }, [isNewForm, newFormId, basePath]);

  useEffect(() => {
    if (isNewForm) {
      resetForm(formName);
      return;
    }
    if (id && loadedFormIdRef.current !== id) {
      if (formType === "A") {
        store.dispatch(loadSavedFormA({ id }));
      } else {
        store.dispatch(loadSavedFormB({ id }));
      }
    }
  }, [id, isNewForm, formName, formType]);

  const handleModalSubmit = (data: LinkedFormRDataType) => {
    const processedFormRData = processLinkedFormData(
      data,
      traineeProfileData.programmeMemberships
    );

    FormRUtilities.loadNewForm(
      basePath,
      traineeProfileData,
      processedFormRData
    );
  };

  const handleModalClose = () => {
    history.push(basePath);
  };

  if (!isNewForm) {
    if (
      formLoadStatus === "loading" ||
      (formLoadStatus === "idle" && !formData?.traineeTisId)
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
  }

  if (formData?.lifecycleState === LifeCycleState.Submitted) {
    return (
      <ErrorPage
        message={`This Form R Part ${formType} has already been submitted and cannot be edited.`}
      />
    );
  }

  if (showLinkerModal) {
    return (
      <FormLinkerModal
        isOpen={true}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        warningText={makeWarningText("new", latestSubDate)}
        linkedFormData={{ isArcp: null, programmeMembershipId: null }}
      />
    );
  }

  if (!formData?.traineeTisId) {
    return (
      <ErrorPage
        message={`Could not load the draft form. Please return to the Form R Part ${formType} home page and try again.`}
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
      <FormBuilder options={formOptions} validationSchema={validationSchema} />
    </FormProvider>
  );
}
