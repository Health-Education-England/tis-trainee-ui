import { useEffect, useRef } from "react";
import { Button, SummaryList } from "nhsuk-react-components";
import { FormData, FormErrors } from "../form-builder/FormBuilder";
import { FormProvider, useFormContext } from "../form-builder/FormContext";
import { CctProgrammeDetails, CctSpecialty } from "../../../models/CctTypes";
import {
  deriveCctAdjustedLengthMonths,
  findCctSpecialty,
  isCctLengthAdjusted,
  isCctStartGradeOverridden,
  mapFormDataToProgrammeDetails
} from "../../../utilities/CctUtilities";
import { useCctFormErrors } from "../../../utilities/hooks/useCctFormErrors";
import { CctFields } from "./CctFields";
import {
  cctFieldOptions,
  cctGradeProgressionFields,
  cctProgrammeDetailsFields,
  cctProgrammeRemainingFields,
  cctSpecialtyFields
} from "./cctFormFields";
import { cctProgrammeDetailsValidationSchema } from "./cctValidationSchema";

type CctProgrammeDetailsFormProps = {
  initialData: FormData;
  specialties: CctSpecialty[];
  submitLabel: string;
  onSubmit: (formData: FormData) => void;
  onCancel?: () => void;
};

export function CctProgrammeDetailsForm({
  initialData,
  specialties,
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
        specialties={specialties}
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
  specialties,
  submitLabel,
  onSubmit,
  onCancel
}: Readonly<CctProgrammeDetailsFormBodyProps>) {
  const { formData, setFormData } = useFormContext();
  const { specialty, startGrade } = formData;
  const selectedSpecialty = findCctSpecialty(specialties, specialty);
  const options = {
    ...cctFieldOptions,
    specialties: specialties.map(({ name }) => ({
      value: name,
      label: name
    }))
  };
  const { errors, isValidOnSubmit } = useCctFormErrors(
    selectedSpecialty ? cctProgrammeDetailsFields : cctSpecialtyFields,
    cctProgrammeDetailsValidationSchema
  );

  const lastSpecialtyRef = useRef(specialty);

  // Note: prog length and start grade are both defaulted from the specialty, so they are reconciled together in one effect.
  useEffect(() => {
    const isSpecialtyChanged = specialty !== lastSpecialtyRef.current;
    lastSpecialtyRef.current = specialty;
    const matchedSpecialty = findCctSpecialty(specialties, specialty);
    if (!matchedSpecialty) return;
    setFormData(prevFormData => {
      const lengthMonths = String(matchedSpecialty.lengthMonths);
      const defaultedStartGrade = isSpecialtyChanged
        ? matchedSpecialty.entryGrade
        : prevFormData.startGrade;
      if (
        prevFormData.lengthMonths === lengthMonths &&
        prevFormData.startGrade === defaultedStartGrade
      )
        return prevFormData;
      return {
        ...prevFormData,
        lengthMonths,
        startGrade: defaultedStartGrade
      };
    });
  }, [specialties, specialty, setFormData]);

  // Note: this reveals the reason field by comparing the grade against the specialty default ie. there's no checkbox to leave unchecked to dodge it. Kept apart from the defaults effect above because that one must not react to startGrade.
  useEffect(() => {
    const matchedSpecialty = findCctSpecialty(specialties, specialty);
    setFormData(prevFormData => {
      const startGradeOverridden = isCctStartGradeOverridden(
        matchedSpecialty,
        startGrade
      );
      if (prevFormData.startGradeOverridden === startGradeOverridden)
        return prevFormData;
      return { ...prevFormData, startGradeOverridden };
    });
  }, [specialties, specialty, startGrade, setFormData]);

  return (
    <form
      id="cct-programme-details-form"
      data-cy="cct-programme-details-form"
      noValidate
      onSubmit={e => {
        e.preventDefault();
        if (isValidOnSubmit()) onSubmit(formData);
      }}
    >
      <CctFields
        fields={cctSpecialtyFields}
        options={options}
        errors={errors}
      />
      {selectedSpecialty && (
        <>
          <CctFields
            fields={cctProgrammeRemainingFields}
            options={options}
            errors={errors}
          />
          <CctLengthBreakdown
            programmeDetails={mapFormDataToProgrammeDetails(formData)}
          />
          <CctFields
            fields={cctGradeProgressionFields}
            options={options}
            errors={errors}
          />
        </>
      )}
      {Object.keys(errors).length > 0 && <FormErrors formErrors={errors} />}
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

type CctLengthBreakdownProps = {
  programmeDetails: CctProgrammeDetails;
};

function CctLengthBreakdown({
  programmeDetails
}: Readonly<CctLengthBreakdownProps>) {
  const { lengthMonths, additionalMonths, acceleratedMonths } =
    programmeDetails;
  if (!isCctLengthAdjusted(programmeDetails)) return null;

  return (
    <SummaryList data-cy="cct-length-breakdown">
      <SummaryList.Row>
        <SummaryList.Key>Initial programme length</SummaryList.Key>
        <SummaryList.Value>{`${lengthMonths} months`}</SummaryList.Value>
      </SummaryList.Row>
      {additionalMonths > 0 && (
        <SummaryList.Row>
          <SummaryList.Key>Additional training time</SummaryList.Key>
          <SummaryList.Value>{`${additionalMonths} months`}</SummaryList.Value>
        </SummaryList.Row>
      )}
      {acceleratedMonths > 0 && (
        <SummaryList.Row>
          <SummaryList.Key>Accelerated training time</SummaryList.Key>
          <SummaryList.Value>{`-${acceleratedMonths} months`}</SummaryList.Value>
        </SummaryList.Row>
      )}
      <SummaryList.Row>
        <SummaryList.Key>Adjusted programme length</SummaryList.Key>
        <SummaryList.Value>
          {`${deriveCctAdjustedLengthMonths(programmeDetails)} months`}
        </SummaryList.Value>
      </SummaryList.Row>
    </SummaryList>
  );
}
