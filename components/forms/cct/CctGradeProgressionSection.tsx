import { useState } from "react";
import {
  Button,
  Card,
  ErrorMessage,
  SummaryList,
  Table
} from "nhsuk-react-components";
import { FormData, FormErrors } from "../form-builder/FormBuilder";
import { FormProvider, useFormContext } from "../form-builder/FormContext";
import {
  CctGradeYear,
  CctProgrammeDetails,
  CctResult,
  CctSpecialty,
  CctTrainingGrade
} from "../../../models/CctTypes";
import { CCT_NO_VALUE } from "../../../utilities/CctConstants";
import {
  CctInvalidAdjustment,
  findCctEighteenMonthFinalGrade,
  findCctProgressionGrades,
  formatCctDate,
  isCctEighteenMonthDefault,
  mapFormDataToProgrammeDetails,
  mapProgrammeDetailsToFormData,
  toCctGradeOptions
} from "../../../utilities/CctUtilities";
import { useCctFormErrors } from "../../../utilities/hooks/useCctFormErrors";
import { useReportCctFormDirty } from "../../../utilities/hooks/useReportCctFormDirty";
import { CctFields } from "./CctFields";
import { cctGradeProgressionFields } from "./cctFormFields";
import { cctGradeProgressionValidationSchema } from "./cctValidationSchema";

const CCT_GRADE_PROGRESSION_HINT =
  "These change how your grades progress, not your total training time.";

type CctGradeProgressionSectionProps = {
  programmeDetails: CctProgrammeDetails;
  specialties: CctSpecialty[];
  result: CctResult | null;
  invalidAdjustments: CctInvalidAdjustment[];
  isFormOpen: boolean;
  onChange: (programmeDetails: CctProgrammeDetails) => void;
  onFormOpenChange: (isFormOpen: boolean) => void;
  onDirtyChange: (isDirty: boolean) => void;
};

export function CctGradeProgressionSection({
  programmeDetails,
  specialties,
  result,
  invalidAdjustments,
  isFormOpen,
  onChange,
  onFormOpenChange,
  onDirtyChange
}: Readonly<CctGradeProgressionSectionProps>) {
  const [isEditing, setIsEditing] = useState(false);
  const hasAdjustment =
    !!programmeDetails.eighteenMonthFinalGrade ||
    !!programmeDetails.skippedGrade;
  const skippableGrades = findCctProgressionGrades(
    programmeDetails.startGrade,
    result
  ).filter(grade => grade !== programmeDetails.startGrade);
  const canAdjust =
    hasAdjustment ||
    skippableGrades.length > 0 ||
    !!findCctEighteenMonthFinalGrade(
      programmeDetails.startGrade,
      programmeDetails.lengthMonths,
      null
    );

  const setEditing = (editing: boolean) => {
    setIsEditing(editing);
    onFormOpenChange(editing);
  };

  if (!canAdjust)
    return (
      <Card feature data-cy="cct-grade-progression-section">
        <Card.Heading>Grade progression adjustments</Card.Heading>
        <p className="nhsuk-hint" data-cy="cct-no-grade-progression-options">
          No grade progression adjustments apply to this programme.
        </p>
      </Card>
    );

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
              skippableGrades={skippableGrades}
              programmeDetails={programmeDetails}
              isEighteenMonthDefault={isCctEighteenMonthDefault(
                specialties,
                programmeDetails
              )}
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
          <CctGradeProgressionSummary
            programmeDetails={programmeDetails}
            invalidAdjustments={invalidAdjustments}
          />
          <Button
            id="cct-edit-grade-progression"
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
  skippableGrades: CctTrainingGrade[];
  programmeDetails: CctProgrammeDetails;
  isEighteenMonthDefault: boolean;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  onDirtyChange: (isDirty: boolean) => void;
};

function CctGradeProgressionFormBody({
  skippableGrades,
  programmeDetails,
  isEighteenMonthDefault,
  onSubmit,
  onCancel,
  onDirtyChange
}: Readonly<CctGradeProgressionFormBodyProps>) {
  const { formData } = useFormContext();
  const options = {
    skippableGrades: toCctGradeOptions(
      skippableGrades,
      programmeDetails.skippedGrade,
      formData.skippedGrade
    )
  };
  const eighteenMonthFinalGrade =
    findCctEighteenMonthFinalGrade(
      programmeDetails.startGrade,
      programmeDetails.lengthMonths,
      formData.skippedGrade as string | null
    ) ?? programmeDetails.eighteenMonthFinalGrade;
  const [eighteenMonthCheckbox, eighteenMonthNotes, ...skippedGradeFields] =
    cctGradeProgressionFields;
  const eighteenMonthNotesFields = isEighteenMonthDefault
    ? []
    : [eighteenMonthNotes];
  const otherFields =
    options.skippableGrades.length > 0
      ? [...eighteenMonthNotesFields, ...skippedGradeFields]
      : eighteenMonthNotesFields;
  const { errors, isValidOnSubmit } = useCctFormErrors(
    [eighteenMonthCheckbox, ...eighteenMonthNotesFields, ...skippedGradeFields],
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
        if (isValidOnSubmit())
          onSubmit({
            ...formData,
            eighteenMonthFinalGrade: formData.hasEighteenMonthFinalYear
              ? eighteenMonthFinalGrade
              : null
          });
      }}
    >
      {eighteenMonthFinalGrade && (
        <CctFields
          fields={[eighteenMonthCheckbox]}
          options={options}
          errors={errors}
        />
      )}
      {eighteenMonthFinalGrade && formData.hasEighteenMonthFinalYear && (
        <div
          className="nhsuk-form-group"
          data-cy="cct-eighteen-month-final-grade"
        >
          <p className="nhsuk-body nhsuk-u-margin-bottom-1">
            Final grade lasting 18 months: <b>{eighteenMonthFinalGrade}</b>
          </p>
          <p className="nhsuk-hint">
            For specialties with an 18-month final year, for example intensive
            care medicine with a dual specialty. This changes grade progression,
            not total training time.
          </p>
          {isEighteenMonthDefault && (
            <p className="nhsuk-hint" data-cy="cct-eighteen-month-default-hint">
              Your specialty has an 18-month final year, so this is set for you
              and needs no reason. Untick it if it does not apply to you.
            </p>
          )}
        </div>
      )}
      <CctFields fields={otherFields} options={options} errors={errors} />
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
  invalidAdjustments?: CctInvalidAdjustment[];
};

export function CctGradeProgressionSummary({
  programmeDetails,
  invalidAdjustments
}: Readonly<CctGradeProgressionSummaryProps>) {
  const {
    eighteenMonthFinalGrade,
    eighteenMonthFinalGradeNotes,
    skippedGrade,
    skippedGradeNotes
  } = programmeDetails;
  const errorsFor = (field: "eighteenMonthFinalGrade" | "skippedGrade") =>
    invalidAdjustments
      ?.filter(
        adjustment =>
          adjustment.field === field || adjustment.field === `${field}Notes`
      )
      .map(({ pointer, message }) => (
        <ErrorMessage key={pointer} data-cy={`cct-${field}-error`}>
          {message}
        </ErrorMessage>
      ));

  return (
    <>
      <p className="nhsuk-hint">{CCT_GRADE_PROGRESSION_HINT}</p>
      {eighteenMonthFinalGrade || skippedGrade ? (
        <SummaryList data-cy="cct-grade-progression-summary">
          {eighteenMonthFinalGrade && (
            <SummaryList.Row>
              <SummaryList.Key>18-month final year</SummaryList.Key>
              <SummaryList.Value>
                {errorsFor("eighteenMonthFinalGrade")}
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
                {errorsFor("skippedGrade")}
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

type CctGradeYearsTableProps = {
  gradeYears: CctGradeYear[];
  programmeDetails: CctProgrammeDetails;
  isPrint?: boolean;
};

export function CctGradeYearsTable({
  gradeYears,
  programmeDetails,
  isPrint
}: Readonly<CctGradeYearsTableProps>) {
  const hasEighteenMonthYear = gradeYears.some(
    year => year.extendedToEighteenMonths
  );
  const hasSkippedGrade = gradeYears.some(
    year => year.skippedGradeBeforeThisRow !== null
  );
  const hasYearPastHighestGrade = gradeYears.some(
    year => year.exceedsKnownTrainingGrade
  );
  const hasTrainingTime = gradeYears.some(
    year => year.additionalMonths > 0 || year.acceleratedMonths > 0
  );

  return (
    <>
      <Table responsive={!isPrint} data-cy="cct-grade-years-table">
        <Table.Head>
          <Table.Row>
            <Table.Cell>Training year</Table.Cell>
            <Table.Cell>Grade</Table.Cell>
            <Table.Cell>Grade end date</Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {gradeYears.map(year => (
            <Table.Row
              key={year.yearNumber}
              data-cy={`cct-grade-year-${year.yearNumber}-row`}
            >
              <Table.Cell>{`Year ${year.yearNumber}`}</Table.Cell>
              <Table.Cell>
                {year.grade ?? CCT_NO_VALUE}
                {year.skippedGradeBeforeThisRow &&
                  ` (${year.skippedGradeBeforeThisRow} skipped)`}
                {year.extendedToEighteenMonths && " (18-month final year)"}
                {year.additionalMonths > 0 &&
                  ` (+${year.additionalMonths} months additional)`}
                {year.acceleratedMonths > 0 &&
                  ` (-${year.acceleratedMonths} months accelerated)`}
                {year.exceedsKnownTrainingGrade &&
                  " (grade label not automatically assigned)"}
              </Table.Cell>
              <Table.Cell>{formatCctDate(year.endDate)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <p className="nhsuk-hint" data-cy="cct-grade-years-hint">
        Grade end dates are calculated from your entries and may not match your
        official training record.
      </p>
      {hasEighteenMonthYear && (
        <p className="nhsuk-hint" data-cy="cct-grade-years-eighteen-month-hint">
          {`${programmeDetails.eighteenMonthFinalGrade} is an 18-month final year. It uses six months already in the programme length, so it does not move the completion date.`}
        </p>
      )}
      {hasSkippedGrade && (
        <p className="nhsuk-hint" data-cy="cct-grade-years-skipped-hint">
          {`${programmeDetails.skippedGrade} is skipped, so later years move up a grade. This does not shorten training; any reduction is recorded as accelerated training time.`}
        </p>
      )}
      {hasTrainingTime && (
        <p className="nhsuk-hint" data-cy="cct-grade-years-training-time-hint">
          Additional training time moves that grade&apos;s end date and every
          later grade on. Accelerated training time brings them forward.
        </p>
      )}
      {hasYearPastHighestGrade && (
        <p className="nhsuk-hint" data-cy="cct-grade-years-past-highest-hint">
          Some years go past the highest grade the calculator assigns, so they
          have no grade. Check your official training record.
        </p>
      )}
    </>
  );
}
