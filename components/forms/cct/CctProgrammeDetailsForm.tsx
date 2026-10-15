import { useEffect } from "react";
import { Button } from "nhsuk-react-components";
import { FormData } from "../form-builder/FormBuilder";
import { FormProvider, useFormContext } from "../form-builder/FormContext";
import { findCctSpecialty } from "../../../utilities/CctConstants";
import { CctFields } from "./CctFields";
import {
  cctFieldOptions,
  cctProgrammeDetailsFields,
  cctProgrammeRemainingFields,
  cctSpecialtyFields
} from "./cctFormFields";

type CctProgrammeDetailsFormProps = {
  initialData: FormData;
  submitLabel: string;
  onSubmit: (formData: FormData) => void;
  onCancel?: () => void;
};

export function CctProgrammeDetailsForm({
  initialData,
  submitLabel,
  onSubmit,
  onCancel
}: Readonly<CctProgrammeDetailsFormProps>) {
  return (
    <FormProvider
      initialData={initialData}
      initialPageFields={cctProgrammeDetailsFields}
      autosave={false}
    >
      <CctProgrammeDetailsFormBody
        submitLabel={submitLabel}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </FormProvider>
  );
}

type CctProgrammeDetailsFormBodyProps = Omit<
  CctProgrammeDetailsFormProps,
  "initialData"
>;

function CctProgrammeDetailsFormBody({
  submitLabel,
  onSubmit,
  onCancel
}: Readonly<CctProgrammeDetailsFormBodyProps>) {
  const { formData, setFormData } = useFormContext();
  const { specialty, startGrade } = formData;
  const selectedSpecialty = findCctSpecialty(specialty);

  // Note: the programme length and start grade are both defaulted from the specialty, so they are reconciled together in one effect.
  useEffect(() => {
    const matchedSpecialty = findCctSpecialty(specialty);
    if (!matchedSpecialty) return;
    setFormData(prevFormData => {
      const lengthMonths = String(matchedSpecialty.lengthMonths);
      if (
        prevFormData.lengthMonths === lengthMonths &&
        prevFormData.startGrade === matchedSpecialty.entryGrade
      )
        return prevFormData;
      return {
        ...prevFormData,
        lengthMonths,
        startGrade: matchedSpecialty.entryGrade
      };
    });
  }, [specialty, setFormData]);

  // Note: this reveals the reason field by comparing the grade against the specialty default, so there is no checkbox the trainee can leave unticked to dodge it. Kept apart from the defaults effect above because that one must not react to startGrade.
  useEffect(() => {
    const matchedSpecialty = findCctSpecialty(specialty);
    setFormData(prevFormData => {
      const startGradeOverridden =
        !!matchedSpecialty &&
        !!startGrade &&
        startGrade !== matchedSpecialty.entryGrade;
      if (prevFormData.startGradeOverridden === startGradeOverridden)
        return prevFormData;
      return { ...prevFormData, startGradeOverridden };
    });
  }, [specialty, startGrade, setFormData]);

  return (
    <form
      id="cct-programme-details-form"
      data-cy="cct-programme-details-form"
      noValidate
      onSubmit={e => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      <CctFields fields={cctSpecialtyFields} options={cctFieldOptions} />
      {selectedSpecialty && (
        <CctFields
          fields={cctProgrammeRemainingFields}
          options={cctFieldOptions}
        />
      )}
      <div className="nhsuk-button-group">
        <Button
          type="submit"
          disabled={!selectedSpecialty}
          data-cy="cct-programme-details-submit"
        >
          {submitLabel}
        </Button>
        {onCancel && (
          <Button
            secondary
            type="button"
            onClick={onCancel}
            data-cy="cct-programme-details-cancel"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
