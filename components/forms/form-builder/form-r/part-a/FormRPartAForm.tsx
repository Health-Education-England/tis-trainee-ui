import { useEffect } from "react";
import store from "../../../../../redux/store/store";
import { useParams } from "react-router-dom";
import { loadSavedFormA } from "../../../../../redux/slices/formASlice";
import { useAppSelector } from "../../../../../redux/hooks/hooks";
import { useSelectFormData } from "../../../../../utilities/hooks/useSelectFormData";
import formAJson from "./formA.json";
import { FormRPartA } from "../../../../../models/FormRPartA";
import { transformReferenceData } from "../../../../../utilities/FormBuilderUtilities";
import { selectAllReference } from "../../../../../redux/slices/referenceSlice";
import FormBuilder, { Form, FormName } from "../../FormBuilder";
import { FORMR_PARTA_DECLARATIONS } from "../../../../../utilities/Constants";
import Loading from "../../../../common/Loading";
import { LifeCycleState } from "../../../../../models/LifeCycleState";
import ErrorPage from "../../../../common/ErrorPage";
import { FormProvider } from "../../FormContext";
import { formAValidationSchema } from "./formAValidationSchema";

type FormRParams = {
  id: string;
};

export function FormRPartAForm() {
  const { id } = useParams<FormRParams>();

  useEffect(() => {
    if (id && id !== "new") {
      store.dispatch(loadSavedFormA({ id }));
    }
  }, [id]);
  const formLoadStatus = useAppSelector(state => state.formA.status);

  const formData = useSelectFormData(formAJson.name as FormName) as FormRPartA;
  const referenceData = transformReferenceData(
    useAppSelector(selectAllReference)
  );

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
  const formRAStatus = formData?.lifecycleState;

  if (formLoadStatus === "loading") {
    return <Loading />;
  }

  if (formLoadStatus === "failed") {
    return (
      <ErrorPage message="Failed to load your Form R Part A. Please try again." />
    );
  }

  if (formRAStatus === LifeCycleState.Submitted) {
    return (
      <ErrorPage message="This Form R Part A has already been submitted and cannot be edited." />
    );
  }

  if (!formData.traineeTisId) {
    return (
      <ErrorPage message="Could not load the draft form. Please return to the Form R Part A home page and try again." />
    );
  }

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
