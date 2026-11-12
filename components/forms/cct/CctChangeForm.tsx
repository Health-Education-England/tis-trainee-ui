import { useEffect } from "react";
import { Button } from "nhsuk-react-components";
import { FormData, FormErrors } from "../form-builder/FormBuilder";
import { FormProvider, useFormContext } from "../form-builder/FormContext";
import { CctFields } from "./CctFields";
import { cctChangeFields, cctFieldOptions } from "./cctFormFields";
import {
  buildCctChangeValidationSchema,
  CctChangeValidationContext
} from "./cctValidationSchema";
import { isCctWteShown } from "../../../utilities/CctUtilities";
import { useCctFormErrors } from "../../../utilities/hooks/useCctFormErrors";
import { useReportCctFormDirty } from "../../../utilities/hooks/useReportCctFormDirty";

type CctChangeFormProps = {
  heading: string;
  initialData: FormData;
  submitLabel: string;
  validationContext: CctChangeValidationContext;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  onDirtyChange: (isDirty: boolean) => void;
};

export function CctChangeForm({
  heading,
  initialData,
  submitLabel,
  validationContext,
  onSubmit,
  onCancel,
  onDirtyChange
}: Readonly<CctChangeFormProps>) {
  return (
    <FormProvider
      initialData={initialData}
      initialPageFields={cctChangeFields}
      autosave={false}
    >
      <CctChangeFormBody
        heading={heading}
        submitLabel={submitLabel}
        validationContext={validationContext}
        onSubmit={onSubmit}
        onCancel={onCancel}
        onDirtyChange={onDirtyChange}
      />
    </FormProvider>
  );
}

type CctChangeFormBodyProps = Omit<CctChangeFormProps, "initialData">;

function CctChangeFormBody({
  heading,
  submitLabel,
  validationContext,
  onSubmit,
  onCancel,
  onDirtyChange
}: Readonly<CctChangeFormBodyProps>) {
  const { formData, setFormData } = useFormContext();
  const { type, ltftDuration, countsTowardsCompletion } = formData;
  const { errors, isValidOnSubmit } = useCctFormErrors(
    cctChangeFields,
    buildCctChangeValidationSchema(validationContext)
  );
  useReportCctFormDirty(onDirtyChange);

  // Note: Once a type is chosen, end date is shown, unless the LTFT change runs to completion - whihc then becomes the projection, which has no end!
  useEffect(() => {
    setFormData(prevFormData => {
      const showEndDate = Boolean(
        prevFormData.type &&
          (prevFormData.type !== "LTFT" ||
            prevFormData.ltftDuration === "END_DATE")
      );
      if (prevFormData.showEndDate === showEndDate) return prevFormData;
      return { ...prevFormData, showEndDate };
    });
  }, [type, ltftDuration, setFormData]);

  useEffect(() => {
    setFormData(prevFormData => {
      const showWte = isCctWteShown(
        prevFormData.type,
        prevFormData.countsTowardsCompletion
      );
      if (prevFormData.showWte === showWte) return prevFormData;
      return { ...prevFormData, showWte };
    });
  }, [type, countsTowardsCompletion, setFormData]);

  return (
    <form
      id="cct-change-form"
      data-cy="cct-change-form"
      noValidate
      onSubmit={e => {
        e.preventDefault();
        if (isValidOnSubmit()) onSubmit(formData);
      }}
    >
      <h3 className="nhsuk-heading-s">{heading}</h3>
      <CctFields
        fields={cctChangeFields}
        options={cctFieldOptions}
        errors={errors}
      />
      {Object.keys(errors).length > 0 && <FormErrors formErrors={errors} />}
      <div className="nhsuk-button-group">
        <Button type="submit" data-cy="cct-change-form-submit">
          {submitLabel}
        </Button>
        <Button
          secondary
          type="button"
          onClick={onCancel}
          data-cy="cct-change-form-cancel"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
