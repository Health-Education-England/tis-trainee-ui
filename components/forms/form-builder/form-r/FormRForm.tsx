import { useEffect, useRef } from "react";
import store from "../../../../redux/store/store";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../../redux/hooks/hooks";
import { FormProvider } from "../FormContext";
import FormBuilder from "../FormBuilder";
import Loading from "../../../common/Loading";
import ErrorPage from "../../../common/ErrorPage";
import { LifeCycleState } from "../../../../models/LifeCycleState";
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

  const { formJson, validationSchema, formOptions, initialData } =
    useFormRConfig(formType);

  const formLoadStatus = useAppSelector(state =>
    formType === "A" ? state.formA.status : state.formB.status
  );

  const newFormId = useAppSelector(state =>
    formType === "A" ? state.formA.newFormId : state.formB.newFormId
  );

  const loadedFormIdRef = useRef(initialData?.id);
  loadedFormIdRef.current = initialData?.id;

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

  if (initialData?.lifecycleState === LifeCycleState.New) {
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
      <FormBuilder options={formOptions} validationSchema={validationSchema} />
    </FormProvider>
  );
}
