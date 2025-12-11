import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  useAppSelector,
  useAppDispatch
} from "../../../../../redux/hooks/hooks";
import { loadSavedFormB } from "../../../../../redux/slices/formBSlice";
import { useSelectFormData } from "../../../../../utilities/hooks/useSelectFormData";
import formBJson from "./formB.json";
import { FormRPartB } from "../../../../../models/FormRPartB";
import { FormRView } from "../FormRView";
import Loading from "../../../../common/Loading";
import ErrorPage from "../../../../common/ErrorPage";
import { Form, FormName } from "../../FormBuilder";
import { getFormBValidationSchema } from "./formBValidationSchema";

type FormRParams = {
  id: string | undefined;
};

type LocationState = {
  fromFormCreate?: boolean;
};

export function FormRPartBView() {
  const { id } = useParams<FormRParams>();
  const location = useLocation<LocationState>();
  const dispatch = useAppDispatch();

  // Selectors
  const formData = useSelectFormData(formBJson.name as FormName) as FormRPartB;
  const formLoadStatus = useAppSelector(state => state.formB.status);
  const activeCovid = useAppSelector(state => state.formB.displayCovid);

  const isNewForm = id === undefined;
  const fromCreate = location.state?.fromFormCreate;

  useEffect(() => {
    if (fromCreate) return;
    if (id) {
      dispatch(loadSavedFormB({ id }));
    }
  }, [id, dispatch]);

  if (!isNewForm && !fromCreate && formLoadStatus === "loading") {
    return <Loading />;
  }

  if (!isNewForm && !fromCreate && formLoadStatus === "failed") {
    return (
      <ErrorPage message="Failed to load your Form R Part B. Please try again." />
    );
  }

  if (isNewForm && !formData?.traineeTisId) {
    return <ErrorPage message="No form data found. Please start a new form." />;
  }

  if (!isNewForm && !formData?.traineeTisId) {
    return <ErrorPage message="Could not load the form data." />;
  }

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

  return (
    <FormRView
      formData={formData}
      formJson={finalFormJson}
      validationSchemaForView={formValidationSchema}
    />
  );
}
