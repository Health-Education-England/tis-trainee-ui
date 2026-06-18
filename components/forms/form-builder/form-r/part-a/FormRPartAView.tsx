import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  useAppSelector,
  useAppDispatch
} from "../../../../../redux/hooks/hooks";
import { loadSavedFormA } from "../../../../../redux/slices/formASlice";
import { useSelectFormData } from "../../../../../utilities/hooks/useSelectFormData";
import formAJson from "./formA.json";
import { FormRPartA } from "../../../../../models/FormRPartA";
import { FormRView } from "../FormRView";
import Loading from "../../../../common/Loading";
import ErrorPage from "../../../../common/ErrorPage";
import { Form, FormName } from "../../FormBuilder";
import { formAValidationSchema } from "./formAValidationSchema";

type FormRParams = {
  id: string | undefined;
};

type LocationState = {
  fromFormCreate?: boolean;
};

export function FormRPartAView() {
  const { id } = useParams<FormRParams>();
  const location = useLocation<LocationState>();
  const dispatch = useAppDispatch();

  // Selectors
  const formData = useSelectFormData(formAJson.name as FormName) as FormRPartA;
  const formLoadStatus = useAppSelector(state => state.formA.status);

  const isNewForm = id === undefined;
  const fromCreate = location.state?.fromFormCreate;

  useEffect(() => {
    if (fromCreate) return;
    if (id) {
      dispatch(loadSavedFormA({ id }));
    }
  }, [id, dispatch]);

  if (!isNewForm && !fromCreate && formLoadStatus === "loading") {
    return <Loading />;
  }

  if (!isNewForm && !fromCreate && formLoadStatus === "failed") {
    return (
      <ErrorPage message="Failed to load your Form R Part A. Please try again." />
    );
  }

  if (isNewForm && !formData?.traineeTisId) {
    return <ErrorPage message="No form data found. Please start a new form." />;
  }

  if (!isNewForm && !formData?.traineeTisId) {
    return <ErrorPage message="Could not load the form data." />;
  }

  return (
    <FormRView
      formData={formData}
      formJson={formAJson as Form}
      validationSchemaForView={formAValidationSchema}
    />
  );
}
