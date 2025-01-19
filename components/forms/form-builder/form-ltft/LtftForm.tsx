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
  const ltftReasons = [
    { value: "Caring responsibilities", label: "Caring responsibilities" },
    { value: "Disability or illness", label: "Disability or illness" },
    { value: "Non-medical development", label: "Non-medical development" },
    { value: "Religious commitment", label: "Religious commitment" },
    {
      value: "Training / career development",
      label: "Training / career development"
    },
    { value: "Unique opportunities", label: "Unique opportunities" },
    { value: "Welfare & wellbeing", label: "Welfare & wellbeing" }
  ];

  const ltftRoles = [
    { value: "tpd", label: "Training Programme Director (TPD)" },
    { value: "es", label: "Educational Supervisor (ES)" }
  ];

  return formData?.declarations.discussedWithTpd ? (
    <div>
      <h2>Main application form</h2>
      <FormBuilder
        jsonForm={formJson}
        fetchedFormData={formData}
        options={{ yesNo, ltftReasons, ltftRoles }}
        validationSchema={ltftValidationSchema}
        history={history}
      />
    </div>
  ) : (
    <ErrorPage message="Please try again" />
  );
}
