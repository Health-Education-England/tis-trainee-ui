import { LtftObj } from "../../../../redux/slices/ltftSlice";
import { useSelectFormData } from "../../../../utilities/hooks/useSelectFormData";
import ErrorPage from "../../../common/ErrorPage";
import history from "../../../navigation/history";
import FormBuilder, { Form, FormName } from "../FormBuilder";
import ltftJson from "./ltft.json";
import { ltftValidationSchema } from "./ltftValidationSchema";

export function LtftForm() {
  const formData = useSelectFormData(ltftJson.name as FormName) as LtftObj;
  const formJson = ltftJson as Form;
  const yesNo = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" }
  ];

  return formData?.declarations.discussedWithTpd ? (
    <div>
      <h2>Main application form</h2>
      <FormBuilder
        jsonForm={formJson}
        fetchedFormData={formData}
        options={{ yesNo }}
        validationSchema={ltftValidationSchema}
        history={history}
      />
    </div>
  ) : (
    <ErrorPage message="Please try again" />
  );
}
