import { useEffect } from "react";
import store from "../../../../../redux/store/store";
import { useParams } from "react-router-dom";
import { loadSavedFormA } from "../../../../../redux/slices/formASlice";
import { useAppSelector } from "../../../../../redux/hooks/hooks";
import { useSelectFormData } from "../../../../../utilities/hooks/useSelectFormData";
import formAJson from "./formA.json";
import { FormRPartA } from "../../../../../models/FormRPartA";
import {
  transformReferenceData,
  resetForm
} from "../../../../../utilities/FormBuilderUtilities";
import { selectAllReference } from "../../../../../redux/slices/referenceSlice";
import FormBuilder, { Form, FormName } from "../../FormBuilder";
import { FORMR_PARTA_DECLARATIONS } from "../../../../../utilities/Constants";
import Loading from "../../../../common/Loading";
import { LifeCycleState } from "../../../../../models/LifeCycleState";
import ErrorPage from "../../../../common/ErrorPage";
import { FormProvider } from "../../FormContext";
import { formAValidationSchema } from "./formAValidationSchema";
import {
  FormRUtilities,
  makeWarningText,
  processLinkedFormData
} from "../../../../../utilities/FormRUtilities";
import { selectAllSubmittedforms } from "../../../../../redux/slices/formsSlice";
import { FormLinkerModal } from "../../../form-linker/FormLinkerModal";
import { LinkedFormRDataType } from "../../../form-linker/FormLinkerForm";
import history from "../../../../navigation/history";

type FormRParams = {
  id: string | undefined;
};

export function FormRPartAForm() {
  const { id } = useParams<FormRParams>();
  const formName = "formA";

  // Selectors
  const formLoadStatus = useAppSelector(state => state.formA.status);
  const formData = useSelectFormData(formAJson.name as FormName) as FormRPartA;
  const referenceData = transformReferenceData(
    useAppSelector(selectAllReference)
  );
  const traineeProfileData = useAppSelector(
    state => state.traineeProfile.traineeProfileData
  );
  const submittedForms = useAppSelector(selectAllSubmittedforms);

  // Derived State
  const latestSubDate = submittedForms?.length
    ? submittedForms[0].submissionDate
    : null;
  const isNewForm = id === undefined;

  // Show modal if new and no pre-pop data
  const showLinkerModal = isNewForm && !formData?.traineeTisId;

  // handle URL replacement on autosave success
  // TODO - This is not great UX i.e. flicker when remounting comp on URL change
  const newFormId = useAppSelector(state => state.formA.newFormId);
  useEffect(() => {
    if (isNewForm && newFormId) {
      history.replace(`/formr-a/${newFormId}/create`);
    }
  }, [isNewForm, newFormId]);

  useEffect(() => {
    if (isNewForm) {
      resetForm(formName);
    } else if (id) {
      store.dispatch(loadSavedFormA({ id }));
    }
  }, [id, isNewForm]);

  const handleModalSubmit = (data: LinkedFormRDataType) => {
    const processedFormRData = processLinkedFormData(
      data,
      traineeProfileData.programmeMemberships
    );

    // Populate new form
    FormRUtilities.loadNewForm(
      "/formr-a",
      traineeProfileData,
      processedFormRData
    );
  };

  const handleModalClose = () => {
    history.push("/formr-a");
  };

  if (!isNewForm && formLoadStatus === "loading") {
    return <Loading />;
  }

  if (!isNewForm && formLoadStatus === "failed") {
    return (
      <ErrorPage message="Failed to load your Form R Part A. Please try again." />
    );
  }

  if (formData?.lifecycleState === LifeCycleState.Submitted) {
    return (
      <ErrorPage message="This Form R Part A has already been submitted and cannot be edited." />
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

  // 5. Missing Data Error (edge case)
  if (!formData.traineeTisId) {
    return (
      <ErrorPage message="Could not load the draft form. Please return to the Form R Part A home page and try again." />
    );
  }

  // Main Form Render
  const programmeDeclarationOptions = FORMR_PARTA_DECLARATIONS.map(
    (declaration: string) => ({ label: declaration, value: declaration })
  );

  const formOptions = {
    ...referenceData,
    programmeDeclarationOptions
  };

  const formJson = formAJson as Form;
  const initialPageFields = formJson.pages[0].sections.flatMap(
    section => section.fields
  );

  return (
    <FormProvider
      initialData={formData}
      initialPageFields={initialPageFields}
      jsonForm={formJson}
    >
      <FormBuilder
        options={formOptions}
        validationSchema={formAValidationSchema}
      />
    </FormProvider>
  );
}
