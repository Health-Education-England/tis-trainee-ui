import { LtftObjNew } from "../../../models/LtftTypes";
import { useSelectFormData } from "../../../utilities/hooks/useSelectFormData";
import ErrorPage from "../../common/ErrorPage";
import FormBuilder, { Form, FormName } from "../form-builder/FormBuilder";
import { FormProvider } from "../form-builder/FormContext";
import ltftJson from "./ltft.json";
import { LtftStatusDetails } from "./LtftStatusDetails";
import { ltftValidationSchema } from "./ltftValidationSchema";

type LtftFormProps = {
  pmOptions: { value: string; label: string }[];
};

export function LtftForm({ pmOptions }: LtftFormProps) {
  const formData = useSelectFormData(ltftJson.name as FormName) as LtftObjNew;
  const formJson = ltftJson as Form;
  const initialPageFields = formJson.pages[0].sections.flatMap(
    section => section.fields
  );
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
    { value: "Clinical Supervisor", label: "Clinical Supervisor" },
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

  return formData?.declarations?.discussedWithTpd ? (
    <div>
      <h2>Application form</h2>
      <LtftStatusDetails {...formData}></LtftStatusDetails>
      <FormProvider
        initialData={formData}
        initialPageFields={initialPageFields}
        jsonForm={ltftJson as Form}
      >
        <FormBuilder
          options={{ yesNo, ltftReasons, ltftRoles, pmOptions }}
          validationSchema={ltftValidationSchema}
        />
      </FormProvider>
    </div>
  ) : (
    <ErrorPage message="Please try again" />
  );
}
