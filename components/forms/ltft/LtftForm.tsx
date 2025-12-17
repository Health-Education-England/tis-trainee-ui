import { LtftObj, LtftObjNew } from "../../../models/LtftTypes";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../../redux/slices/traineeProfileSlice";
import { makeProgrammeOptions } from "../../../utilities/CctUtilities";
import { isPastIt } from "../../../utilities/DateUtilities";
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

  const ltftReasonsExceptional = [
    {
      value: "Disability",
      label: "I have a disability and receive ongoing treatment at short notice"
    },
    {
      value: "Primary carer",
      label:
        "I am a primary carer and an unforeseen change in circumstances has occurred with serious consequences without my support"
    },
    {
      value: "Parental responsibilities",
      label:
        "I have parental responsibilities and an unforeseen change in circumstances has occurred with serious consequences without my support"
    },
    {
      value: "Personal safety issue",
      label: "I have a personal safety issue"
    },
    {
      value: "Armed forces partner",
      label:
        "I am the partner of a serving armed forces member who has been deployed at short notice"
    },
    {
      value: "Harassment or bullying",
      label: "I am facing issues of harassment or bullying"
    },
    {
      value: "Lack of suitable supervision",
      label:
        "There is a lack of suitable supervision in place in my current placement"
    },
    {
      value: "Newly appointed",
      label: "I am newly appointed to post within the last 16 weeks"
    }
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

  return formData ? (
    <div>
      <h2>Application form</h2>
      {/* <LtftStatusDetails {...formData}></LtftStatusDetails> */}
      <FormProvider
        initialData={formData}
        initialPageFields={initialPageFields}
        jsonForm={ltftJson as Form}
      >
        <FormBuilder
          options={{
            yesNo,
            ltftReasons,
            ltftRoles,
            pmOptions,
            ltftReasonsExceptional
          }}
          validationSchema={ltftValidationSchema}
        />
      </FormProvider>
    </div>
  ) : (
    <ErrorPage message="Please try again" />
  );
}
