import { Button, ErrorSummary } from "nhsuk-react-components";
import { FormErrors } from "../form-builder/FormBuilder";
import { FormProvider, useFormContext } from "../form-builder/FormContext";
import { CctFields } from "./CctFields";
import { cctFieldOptions, cctSaveFields } from "./cctFormFields";
import { cctSaveValidationSchema } from "./cctValidationSchema";
import { CctSaveStatus } from "../../../redux/slices/cctSlice";
import { useCctFormErrors } from "../../../utilities/hooks/useCctFormErrors";
import { useReportCctFormDirty } from "../../../utilities/hooks/useReportCctFormDirty";

type CctSaveFormProps = {
  savedName: string;
  saveStatus: CctSaveStatus;
  onSave: (name: string) => void;
  onDirtyChange: (isDirty: boolean) => void;
};

type CctSaveFormBodyProps = Omit<CctSaveFormProps, "savedName">;

export function CctSaveForm({
  savedName,
  saveStatus,
  onSave,
  onDirtyChange
}: Readonly<CctSaveFormProps>) {
  return (
    <FormProvider
      initialData={{ calculationName: savedName }}
      initialPageFields={cctSaveFields}
      autosave={false}
    >
      <CctSaveFormBody
        saveStatus={saveStatus}
        onSave={onSave}
        onDirtyChange={onDirtyChange}
      />
    </FormProvider>
  );
}

function CctSaveFormBody({
  saveStatus,
  onSave,
  onDirtyChange
}: Readonly<CctSaveFormBodyProps>) {
  const { formData } = useFormContext();
  const { errors, isValidOnSubmit } = useCctFormErrors(
    cctSaveFields,
    cctSaveValidationSchema
  );
  useReportCctFormDirty(onDirtyChange);
  const hasErrors = Object.keys(errors).length > 0;
  const isSaving = saveStatus === "loading";

  return (
    <form
      data-cy="cct-save-form"
      noValidate
      onSubmit={e => {
        e.preventDefault();
        if (isValidOnSubmit()) onSave(formData.calculationName.trim());
      }}
    >
      <CctFields
        fields={cctSaveFields}
        options={cctFieldOptions}
        errors={errors}
      />
      {hasErrors && <FormErrors formErrors={errors} />}
      {saveStatus === "failed" && !hasErrors && (
        <ErrorSummary data-cy="cct-save-error">
          <ErrorSummary.Title>Oops! Something went wrong</ErrorSummary.Title>
          <p>We could not save your calculation. Try again.</p>
        </ErrorSummary>
      )}
      <Button type="submit" disabled={isSaving} data-cy="cct-save-submit">
        {isSaving ? "Saving…" : "Save calculation"}
      </Button>
    </form>
  );
}
