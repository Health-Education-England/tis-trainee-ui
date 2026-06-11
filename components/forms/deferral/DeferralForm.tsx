import { useEffect } from "react";
import { DeferralObj } from "../../../models/DeferralTypes";
import { useSelectFormData } from "../../../utilities/hooks/useSelectFormData";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { selectPmsNotPast } from "../../../redux/slices/traineeProfileSlice";
import { findLinkedProgramme } from "../../../utilities/CctUtilities";
import { getDeferralProgrammeDetails } from "../../../utilities/deferralUtilities";
import ErrorPage from "../../common/ErrorPage";
import FormBuilder, { Form, FormName } from "../form-builder/FormBuilder";
import { FormProvider, useFormContext } from "../form-builder/FormContext";
import deferralJson from "./deferral.json";
import { deferralValidationSchema } from "./deferralValidationSchema";

type DeferralFormProps = {
  pmOptions: { value: string; label: string }[];
};

// Keep read-only programme fields in the form's local state.
function DeferralProgrammeSync() {
  const { formData, setFormData } = useFormContext();
  const pmsNotPast = useAppSelector(selectPmsNotPast);
  const { pmId } = formData;

  useEffect(() => {
    const linkedProgramme = findLinkedProgramme(pmId, pmsNotPast);
    const programmeDetails = getDeferralProgrammeDetails(linkedProgramme);

    setFormData(previous => {
      if (
        previous.pmName === programmeDetails.pmName &&
        previous.pmStartDate === programmeDetails.pmStartDate &&
        previous.pmEndDate === programmeDetails.pmEndDate
      ) {
        return previous;
      }
      return { ...previous, ...programmeDetails };
    });
  }, [pmId, pmsNotPast, setFormData]);

  return null;
}

export function DeferralForm({ pmOptions }: Readonly<DeferralFormProps>) {
  const formData = useSelectFormData(
    deferralJson.name as FormName
  ) as DeferralObj;
  const formJson = deferralJson as Form;
  const initialPageFields = formJson.pages[0].sections.flatMap(
    section => section.fields
  );

  // Statutory grounds for deferral per the GMC Gold Guide (v10, 3.38).
  const deferralReasonOptions = [
    { value: "Adoption leave", label: "Adoption leave" },
    {
      value: "Defence Medical Services operational requirement",
      label: "Defence Medical Services operational requirement"
    },
    { value: "Ill health", label: "Ill health" },
    { value: "Maternity leave", label: "Maternity leave" },
    { value: "Paternity leave", label: "Paternity leave" },
    { value: "other reason", label: "other reason" }
  ];

  return formData?.traineeTisId ? (
    <div>
      <h2>Application form</h2>
      <FormProvider
        initialData={formData}
        initialPageFields={initialPageFields}
        jsonForm={formJson}
      >
        <DeferralProgrammeSync />
        <FormBuilder
          options={{
            pmOptions,
            deferralReasonOptions
          }}
          validationSchema={deferralValidationSchema}
        />
      </FormProvider>
    </div>
  ) : (
    <ErrorPage message="Please start a new deferral application from the Deferral home page." />
  );
}
