import { useEffect } from "react";
import store from "../../../../../redux/store/store";
import { useLocation, useParams } from "react-router-dom";
import { loadSavedFormB } from "../../../../../redux/slices/formBSlice";
import { useAppSelector } from "../../../../../redux/hooks/hooks";
import { useSelectFormData } from "../../../../../utilities/hooks/useSelectFormData";
import formBJson from "./formB.json";
import { FormRPartB } from "../../../../../models/FormRPartB";
import {
  transformReferenceData,
  resetForm
} from "../../../../../utilities/FormBuilderUtilities";
import { selectAllReference } from "../../../../../redux/slices/referenceSlice";
import FormBuilder, { Form, FormName } from "../../FormBuilder";
import { YES_NO_OPTIONS } from "../../../../../utilities/Constants";
import Loading from "../../../../common/Loading";
import { LifeCycleState } from "../../../../../models/LifeCycleState";
import ErrorPage from "../../../../common/ErrorPage";
import { FormProvider } from "../../FormContext";
import { getFormBValidationSchema } from "./formBValidationSchema";
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

type LocationState = {
  fieldName?: boolean;
};

export function FormRPartBForm() {
  const location = useLocation<LocationState>();

  const { id } = useParams<FormRParams>();
  const formName = "formB";

  // Selectors
  const formLoadStatus = useAppSelector(state => state.formB.status);
  const formData = useSelectFormData(formBJson.name as FormName) as FormRPartB;
  const referenceData = transformReferenceData(
    useAppSelector(selectAllReference)
  );
  const traineeProfileData = useAppSelector(
    state => state.traineeProfile.traineeProfileData
  );
  const submittedForms = useAppSelector(selectAllSubmittedforms);
  const activeCovid = useAppSelector(state => state.formB.displayCovid);

  // Derived State
  const latestSubDate = submittedForms?.length
    ? submittedForms[0].submissionDate
    : null;
  const isNewForm = id === undefined;

  // Show modal if new and no pre-pop data
  const showLinkerModal = isNewForm && !formData?.traineeTisId;

  useEffect(() => {
    if (isNewForm) {
      resetForm(formName);
      // Don't reload form if coming from View to edit
    } else if (id && !location.state?.fieldName) {
      store.dispatch(loadSavedFormB({ id }));
    }
  }, [id, isNewForm, location.state?.fieldName]);

  const handleModalSubmit = (data: LinkedFormRDataType) => {
    const processedFormRData = processLinkedFormData(
      data,
      traineeProfileData.programmeMemberships
    );

    // Populate new form
    FormRUtilities.loadNewForm(
      "/formr-b",
      traineeProfileData,
      processedFormRData
    );
  };

  const handleModalClose = () => {
    history.push("/formr-b");
  };

  if (!isNewForm && formLoadStatus === "loading") {
    return <Loading />;
  }

  if (!isNewForm && formLoadStatus === "failed") {
    return (
      <ErrorPage message="Failed to load your Form R Part B. Please try again." />
    );
  }

  if (formData?.lifecycleState === LifeCycleState.Submitted) {
    return (
      <ErrorPage message="This Form R Part B has already been submitted and cannot be edited." />
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
      <ErrorPage message="Could not load the draft form. Please return to the Form R Part B home page and try again." />
    );
  }

  // Main Form Render
  const formOptions = {
    ...referenceData,
    yesNo: YES_NO_OPTIONS
  };

  const formJson = formBJson as Form;
  const formValidationSchema = getFormBValidationSchema(activeCovid);
  const finalFormJson = activeCovid
    ? formJson
    : {
        ...formJson,
        pages: formJson.pages.filter(
          page => page.pageName !== "COVID 19 self-assessment & declarations"
        )
      };

  const initialPageFields = finalFormJson.pages[0].sections.flatMap(
    section => section.fields
  );

  return (
    <FormProvider
      initialData={formData}
      initialPageFields={initialPageFields}
      jsonForm={finalFormJson}
    >
      <FormBuilder
        options={formOptions}
        validationSchema={formValidationSchema}
      />
    </FormProvider>
  );
}
