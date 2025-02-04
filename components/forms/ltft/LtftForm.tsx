import { LtftObj } from "../../../redux/slices/ltftSlice";
import { useSelectFormData } from "../../../utilities/hooks/useSelectFormData";
import ErrorPage from "../../common/ErrorPage";
import history from "../../navigation/history";
import FormBuilder, { Form, FormName } from "../form-builder/FormBuilder";
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
    { value: "Welfare & wellbeing", label: "Welfare & wellbeing" },
    { value: "other", label: "other reason" }
  ];

  const ltftRoles = [
    { value: "Associate Dean", label: "Associate Dean" },
    {
      value: "Educational Supervisor (ES)",
      label: "Educational Supervisor (ES)"
    },
    { value: "LTFT champion", label: "LTFT champion" },
    { value: "Medical Staffing Manager", label: "Medical Staffing Manager" },
    { value: "Practice Manager", label: "Practice Manager" },
    {
      value: "Training Programme Director (TPD)",
      label: "Training Programme Director (TPD)"
    },
    { value: "Trust Administrator", label: "Trust Administrator" }
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
