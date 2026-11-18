import { useEffect, useRef } from "react";
import { Button } from "nhsuk-react-components";
import { FormData, FormErrors } from "../form-builder/FormBuilder";
import { FormProvider, useFormContext } from "../form-builder/FormContext";
import { CctProgrammeDetails, CctTrainingTime } from "../../../models/CctTypes";
import { findCctTrainingTimeGrades } from "../../../utilities/CctUtilities";
import { useCctFormErrors } from "../../../utilities/hooks/useCctFormErrors";
import { useReportCctFormDirty } from "../../../utilities/hooks/useReportCctFormDirty";
import { CctFields } from "./CctFields";
import { buildCctTrainingTimeFields } from "./cctFormFields";
import { CctTrainingTimeKind } from "./cctTrainingTimeKinds";
import { buildCctTrainingTimeValidationSchema } from "./cctValidationSchema";

type CctTrainingTimeFormProps = {
  kind: CctTrainingTimeKind;
  programmeDetails: CctProgrammeDetails;
  otherEntries: CctTrainingTime[];
  initialData: FormData;
  isEditing: boolean;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  onDirtyChange: (isDirty: boolean) => void;
};

export function CctTrainingTimeForm({
  initialData,
  ...props
}: Readonly<CctTrainingTimeFormProps>) {
  return (
    <FormProvider
      initialData={initialData}
      initialPageFields={buildCctTrainingTimeFields(props.kind)}
      autosave={false}
    >
      <CctTrainingTimeFormBody {...props} />
    </FormProvider>
  );
}

function CctTrainingTimeFormBody({
  kind,
  programmeDetails,
  otherEntries,
  isEditing,
  onSubmit,
  onCancel,
  onDirtyChange
}: Readonly<Omit<CctTrainingTimeFormProps, "initialData">>) {
  const { formData } = useFormContext();
  const fields = buildCctTrainingTimeFields(kind);
  const { errors, isValidOnSubmit } = useCctFormErrors(
    fields,
    buildCctTrainingTimeValidationSchema(kind, programmeDetails, otherEntries)
  );
  useReportCctFormDirty(onDirtyChange);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById("grade")?.focus({ preventScroll: true });
  }, []);

  const options = {
    trainingTimeGrades: findCctTrainingTimeGrades(
      programmeDetails.startGrade
    ).map(grade => ({ value: grade, label: grade }))
  };

  return (
    <form
      ref={formRef}
      data-cy="cct-training-time-form"
      noValidate
      onSubmit={e => {
        e.preventDefault();
        if (isValidOnSubmit()) onSubmit(formData);
      }}
    >
      <h3 className="nhsuk-heading-s">
        {`${isEditing ? "Edit" : "Add"} ${kind.label} training time`}
      </h3>
      <CctFields fields={fields} options={options} errors={errors} />
      {Object.keys(errors).length > 0 && <FormErrors formErrors={errors} />}
      <div className="nhsuk-button-group">
        <Button type="submit" data-cy="cct-training-time-form-submit">
          {isEditing ? "Confirm" : `Add ${kind.label} training time`}
        </Button>
        <Button
          secondary
          type="button"
          onClick={onCancel}
          data-cy="cct-training-time-form-cancel"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
