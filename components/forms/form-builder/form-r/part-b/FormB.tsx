import { FormRPartB } from "../../../../../models/FormRPartB";
import { useAppSelector } from "../../../../../redux/hooks/hooks";
import { selectSavedFormB } from "../../../../../redux/slices/formBSlice";
import { selectAllReference } from "../../../../../redux/slices/referenceSlice";
import FormBuilder from "../../FormBuilder";
import formBJson from "./formB.json";
import { formBValidationSchema } from "./formBValidationSchema";
import { Redirect } from "react-router-dom";
import history from "../../../../navigation/history";
import { transformReferenceData } from "../../../../../utilities/FormBuilderUtilities";
import { DesignatedBodyKeyValue } from "../../../../../models/DesignatedBodyKeyValue";

export default function FormB() {
  const formBData: FormRPartB = useAppSelector(selectSavedFormB);
  const referenceData = useAppSelector(selectAllReference);
  const dbcInternal = [
    ...referenceData.dbc.filter((db: DesignatedBodyKeyValue) => db.internal),
    { label: "other", value: "other" }
  ];
  const dbcExternal = referenceData.dbc.filter(
    (db: DesignatedBodyKeyValue) => !db.internal
  );
  const trainingPost = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" }
  ];

  const formBOptions = transformReferenceData({
    ...referenceData,
    dbcInternal,
    dbcExternal,
    trainingPost
  });

  return formBData.traineeTisId ? (
    <FormBuilder
      jsonForm={formBJson}
      fetchedFormData={formBData}
      options={formBOptions}
      validationSchema={formBValidationSchema}
      history={history}
    />
  ) : (
    <Redirect to="/formr-b" />
  );
}
