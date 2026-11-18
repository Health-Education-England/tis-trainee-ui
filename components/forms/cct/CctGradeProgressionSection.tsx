import { useState } from "react";
import { Button, Card, SummaryList } from "nhsuk-react-components";
import { FormData, FormErrors } from "../form-builder/FormBuilder";
import { FormProvider, useFormContext } from "../form-builder/FormContext";
import { CctProgrammeDetails, CctSpecialty } from "../../../models/CctTypes";
import {
  mapFormDataToProgrammeDetails,
  mapProgrammeDetailsToFormData
} from "../../../utilities/CctUtilities";
import { useCctFormErrors } from "../../../utilities/hooks/useCctFormErrors";
import { useReportCctFormDirty } from "../../../utilities/hooks/useReportCctFormDirty";
import { CctFields } from "./CctFields";
import { cctFieldOptions, cctGradeProgressionFields } from "./cctFormFields";
import { cctGradeProgressionValidationSchema } from "./cctValidationSchema";

const CCT_GRADE_PROGRESSION_HINT =
  "These change how your grades progress, not your total training time.";

type CctGradeProgressionSectionProps = {
  programmeDetails: CctProgrammeDetails;
  specialties: CctSpecialty[];
  isFormOpen: boolean;
  onChange: (programmeDetails: CctProgrammeDetails) => void;
  onFormOpenChange: (isFormOpen: boolean) => void;
  onDirtyChange: (isDirty: boolean) => void;
};

export function CctGradeProgressionSection({
  programmeDetails,
  specialties,
  isFormOpen,
  onChange,
  onFormOpenChange,
  onDirtyChange
}: Readonly<CctGradeProgressionSectionProps>) {
  const [isEditing, setIsEditing] = useState(false);
  const hasAdjustment =
    !!programmeDetails.eighteenMonthFinalGrade ||
    !!programmeDetails.skippedGrade;

  const setEditing = (editing: boolean) => {
    setIsEditing(editing);
    onFormOpenChange(editing);
  };

  return (
    <Card feature data-cy="cct-grade-progression-section">
      <Card.Heading>Grade progression adjustments</Card.Heading>
      {isEditing ? (
        <>
          <p className="nhsuk-hint">{CCT_GRADE_PROGRESSION_HINT}</p>
          <FormProvider
            initialData={mapProgrammeDetailsToFormData(
              programmeDetails,
              specialties
            )}
            initialPageFields={cctGradeProgressionFields}
            autosave={false}
          >
            <CctGradeProgressionFormBody
              onSubmit={formData => {
                onChange(mapFormDataToProgrammeDetails(formData));
                setEditing(false);
              }}
              onCancel={() => setEditing(false)}
              onDirtyChange={onDirtyChange}
            />
          </FormProvider>
        </>
      ) : (
        <>
          <CctGradeProgressionSummary programmeDetails={programmeDetails} />
          <Button
            secondary
            type="button"
            disabled={isFormOpen}
            onClick={() => setEditing(true)}
            data-cy="cct-edit-grade-progression"
          >
            {hasAdjustment
              ? "Edit grade progression adjustments"
              : "Add grade progression adjustments"}
          </Button>
        </>
      )}
    </Card>
  );
}

type CctGradeProgressionFormBodyProps = {
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  onDirtyChange: (isDirty: boolean) => void;
};

function CctGradeProgressionFormBody({
  onSubmit,
  onCancel,
  onDirtyChange
}: Readonly<CctGradeProgressionFormBodyProps>) {
  const { formData } = useFormContext();
  const { errors, isValidOnSubmit } = useCctFormErrors(
    cctGradeProgressionFields,
    cctGradeProgressionValidationSchema
  );
  useReportCctFormDirty(onDirtyChange);

  return (
    <form
      id="cct-grade-progression-form"
      data-cy="cct-grade-progression-form"
      noValidate
      onSubmit={e => {
        e.preventDefault();
        if (isValidOnSubmit()) onSubmit(formData);
      }}
    >
      <CctFields
        fields={cctGradeProgressionFields}
        options={cctFieldOptions}
        errors={errors}
      />
      {Object.keys(errors).length > 0 && <FormErrors formErrors={errors} />}
      <div className="nhsuk-button-group">
        <Button type="submit" data-cy="cct-grade-progression-submit">
          Confirm grade progression adjustments
        </Button>
        <Button
          secondary
          type="button"
          onClick={onCancel}
          data-cy="cct-grade-progression-cancel"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

type CctGradeProgressionSummaryProps = {
  programmeDetails: CctProgrammeDetails;
};

export function CctGradeProgressionSummary({
  programmeDetails
}: Readonly<CctGradeProgressionSummaryProps>) {
  const {
    eighteenMonthFinalGrade,
    eighteenMonthFinalGradeNotes,
    skippedGrade,
    skippedGradeNotes
  } = programmeDetails;

  return (
    <>
      <p className="nhsuk-hint">{CCT_GRADE_PROGRESSION_HINT}</p>
      {eighteenMonthFinalGrade || skippedGrade ? (
        <SummaryList data-cy="cct-grade-progression-summary">
          {eighteenMonthFinalGrade && (
            <SummaryList.Row>
              <SummaryList.Key>18-month final year</SummaryList.Key>
              <SummaryList.Value>
                {eighteenMonthFinalGrade}
                {eighteenMonthFinalGradeNotes && (
                  <div className="nhsuk-hint nhsuk-u-margin-top-1">
                    {eighteenMonthFinalGradeNotes}
                  </div>
                )}
              </SummaryList.Value>
            </SummaryList.Row>
          )}
          {skippedGrade && (
            <SummaryList.Row>
              <SummaryList.Key>Skipped grade year</SummaryList.Key>
              <SummaryList.Value>
                {skippedGrade}
                {skippedGradeNotes && (
                  <div className="nhsuk-hint nhsuk-u-margin-top-1">
                    {skippedGradeNotes}
                  </div>
                )}
              </SummaryList.Value>
            </SummaryList.Row>
          )}
        </SummaryList>
      ) : (
        <p
          className="nhsuk-hint"
          data-cy="cct-no-grade-progression-adjustments"
        >
          No grade progression adjustments recorded.
        </p>
      )}
    </>
  );
}
