import { useParams } from "react-router-dom";
import { LtftObj } from "../../../models/LtftTypes";
import { useSelectFormData } from "../../../utilities/hooks/useSelectFormData";
import ErrorPage from "../../common/ErrorPage";
import FormBuilder, { Form, FormName } from "../form-builder/FormBuilder";
import { FormProvider } from "../form-builder/FormContext";
import ltftJson from "./ltft.json";
import { LtftStatusDetails } from "./LtftStatusDetails";
import { ltftValidationSchema } from "./ltftValidationSchema";
import { useEffect } from "react";
import { loadSavedLtft } from "../../../redux/slices/ltftSlice";
import store from "../../../redux/store/store";
import { useAppSelector } from "../../../redux/hooks/hooks";
import Loading from "../../common/Loading";

export function LtftForm() {
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    if (id) {
      store.dispatch(loadSavedLtft(id));
    }
  }, [id]);

  const formLoadStatus = useAppSelector(state => state.ltft.status);
  const formData = useSelectFormData(ltftJson.name as FormName) as LtftObj;
  const ltftStatus = formData?.status?.current?.state;
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

  if (formLoadStatus === "loading") return <Loading />;

  if (
    formLoadStatus === "failed" ||
    (ltftStatus !== "DRAFT" && ltftStatus !== "UNSUBMITTED")
  )
    return (
      <ErrorPage message="Failed to load LTFT form data. Please try again." />
    );

  return (
    <div>
      <h2>Main application form</h2>
      <LtftStatusDetails {...formData}></LtftStatusDetails>
      <FormProvider
        initialData={formData}
        initialPageFields={initialPageFields}
        jsonForm={ltftJson as Form}
      >
        <FormBuilder
          options={{ yesNo, ltftReasons, ltftRoles }}
          validationSchema={ltftValidationSchema}
        />
      </FormProvider>
    </div>
  );
}
