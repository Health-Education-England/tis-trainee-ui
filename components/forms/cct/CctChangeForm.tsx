import { useEffect } from "react";
import { Button } from "nhsuk-react-components";
import { FormData } from "../form-builder/FormBuilder";
import { FormProvider, useFormContext } from "../form-builder/FormContext";
import { CctFields } from "./CctFields";
import { cctChangeFields, cctFieldOptions } from "./cctFormFields";

type CctChangeFormProps = {
  heading: string;
  initialData: FormData;
  submitLabel: string;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
};

export function CctChangeForm({
  heading,
  initialData,
  submitLabel,
  onSubmit,
  onCancel
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
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </FormProvider>
  );
}

type CctChangeFormBodyProps = Omit<CctChangeFormProps, "initialData">;

function CctChangeFormBody({
  heading,
  submitLabel,
  onSubmit,
  onCancel
}: Readonly<CctChangeFormBodyProps>) {
  const { formData, setFormData } = useFormContext();
  const { type, ltftDuration } = formData;

  // Note: an end date is asked for unless this is the LTFT change that runs to completion - that one becomes the projection, which has no end.
  useEffect(() => {
    setFormData(prevFormData => {
      const showEndDate =
        prevFormData.type !== "LTFT" ||
        prevFormData.ltftDuration !== "REMAINDER";
      if (prevFormData.showEndDate === showEndDate) return prevFormData;
      return { ...prevFormData, showEndDate };
    });
  }, [type, ltftDuration, setFormData]);

  return (
    <form
      id="cct-change-form"
      data-cy="cct-change-form"
      noValidate
      onSubmit={e => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      <h3 className="nhsuk-heading-s">{heading}</h3>
      <CctFields fields={cctChangeFields} options={cctFieldOptions} />
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
