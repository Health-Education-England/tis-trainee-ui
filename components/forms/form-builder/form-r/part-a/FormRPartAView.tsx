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

  const formData = useSelectFormData(formAJson.name as FormName) as FormRPartA;
  const formLoadStatus = useAppSelector(state => state.formA.status);

  const isNewForm = id === undefined;
  const fromCreate = location.state?.fromFormCreate;

  useEffect(() => {
    if (id) {
      if (!fromCreate || !formData?.traineeTisId)
        dispatch(loadSavedFormA({ id }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dispatch, fromCreate]);

  if (formLoadStatus === "loading") {
    return <Loading />;
  }

  if (!isNewForm && !formData?.traineeTisId) {
    if (formLoadStatus === "failed") {
      return (
        <ErrorPage message="Failed to load your Form R Part A. Please try again." />
      );
    }
    return <Loading />;
  }

  if (isNewForm && !formData?.traineeTisId) {
    return <ErrorPage message="No form data found. Please start a new form." />;
  }

  return (
    <FormRView
      formData={formData}
      formJson={formAJson as Form}
      validationSchemaForView={formAValidationSchema}
    />
  );
}
