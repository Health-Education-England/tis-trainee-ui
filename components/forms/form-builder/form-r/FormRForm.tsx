import { useEffect, useMemo, useRef } from "react";
import store from "../../../../redux/store/store";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../../redux/hooks/hooks";
import { useSelectFormData } from "../../../../utilities/hooks/useSelectFormData";

import { FormProvider } from "../FormContext";
import FormBuilder, { Form, FormName } from "../FormBuilder";

import Loading from "../../../common/Loading";
import ErrorPage from "../../../common/ErrorPage";

import { FormLinkerModal } from "../../form-linker/FormLinkerModal";
import { LinkedFormRDataType } from "../../form-linker/FormLinkerForm";

import { FormRPartA } from "../../../../models/FormRPartA";
import { FormRPartB } from "../../../../models/FormRPartB";
import { LifeCycleState } from "../../../../models/LifeCycleState";

import {
  transformReferenceData,
  resetForm
} from "../../../../utilities/FormBuilderUtilities";
import {
  FormRUtilities,
  makeWarningText,
  processLinkedFormData
} from "../../../../utilities/FormRUtilities";

import { selectAllReference } from "../../../../redux/slices/referenceSlice";
import { selectAllSubmittedforms } from "../../../../redux/slices/formsSlice";
import { loadSavedFormA } from "../../../../redux/slices/formASlice";
import { loadSavedFormB } from "../../../../redux/slices/formBSlice";

import {
  FORMR_PARTA_DECLARATIONS,
  YES_NO_OPTIONS
} from "../../../../utilities/Constants";

import history from "../../../navigation/history";

import formAJson from "./part-a/formA.json";
import formBJson from "./part-b/formB.json";
import { formAValidationSchema } from "./part-a/formAValidationSchema";
import { getFormBValidationSchema } from "./part-b/formBValidationSchema";

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

  const activeCovid = useAppSelector(state => state.formB.displayCovid);

  const formLoadStatus = useAppSelector(state =>
    formType === "A" ? state.formA.status : state.formB.status
  );

  const newFormId = useAppSelector(state =>
    formType === "A" ? state.formA.newFormId : state.formB.newFormId
  );

  const formConfig = useMemo(() => {
    if (formType === "A") {
      return {
        formJson: formAJson as Form,
        validationSchema: formAValidationSchema
      };
    }

    const baseFormJson = formBJson as Form;
    const validationSchema = getFormBValidationSchema(activeCovid);

    const finalFormJson = activeCovid
      ? baseFormJson
      : {
          ...baseFormJson,
          pages: baseFormJson.pages.filter(
            page => page.pageName !== "COVID 19 self-assessment & declarations"
          )
        };

    return { formJson: finalFormJson, validationSchema };
  }, [formType, activeCovid]);

  const formData = useSelectFormData(formConfig.formJson.name as FormName) as
    | FormRPartA
    | FormRPartB;

  const referenceData = transformReferenceData(
    useAppSelector(selectAllReference)
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

  const formOptions =
    formType === "A"
      ? {
          ...referenceData,
          programmeDeclarationOptions: FORMR_PARTA_DECLARATIONS.map(
            (declaration: string) => ({
              label: declaration,
              value: declaration
            })
          )
        }
      : { ...referenceData, yesNo: YES_NO_OPTIONS };

  const initialPageFields = formConfig.formJson.pages[0].sections.flatMap(
    section => section.fields
  );

  return (
    <FormProvider
      initialData={formData}
      initialPageFields={initialPageFields}
      jsonForm={formConfig.formJson}
    >
      <FormBuilder
        options={formOptions}
        validationSchema={formConfig.validationSchema}
      />
    </FormProvider>
  );
}
