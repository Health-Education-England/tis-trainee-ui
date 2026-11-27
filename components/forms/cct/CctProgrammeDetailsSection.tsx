import {
  Button,
  Card,
  ErrorSummary,
  InsetText,
  SummaryList,
  WarningCallout
} from "nhsuk-react-components";
import { FormData } from "../form-builder/FormBuilder";
import {
  CctProgrammeDetails,
  CctResult,
  CctSpecialty
} from "../../../models/CctTypes";
import Loading from "../../common/Loading";
import {
  CCT_NO_VALUE,
  CCT_NOT_CALCULATED,
  CCT_PAGES
} from "../../../utilities/CctConstants";
import {
  applyCctEighteenMonthDefault,
  CctInvalidAdjustment,
  CctProgrammeDetailsErrorTarget,
  deriveCctAdjustedLengthMonths,
  findCctSpecialty,
  formatCctDate,
  isCctLengthAdjusted,
  isCctLengthOverridden,
  isCctStartGradeOverridden,
  mapFormDataToProgrammeDetails,
  mapProgrammeDetailsToFormData,
  sumCctTrainingTime
} from "../../../utilities/CctUtilities";
import { CctCalculationStatus } from "../../../utilities/hooks/useCctCalculation";
import { CctSpecialtiesStatus } from "../../../utilities/hooks/useCctSpecialties";
import { CctProgrammeDetailsForm } from "./CctProgrammeDetailsForm";
import { CctRequestError } from "./CctRequestError";
import { editButtonId as trainingTimeEditButtonId } from "./CctTrainingTimeSection";
import { CCT_TRAINING_TIME_KINDS } from "./cctTrainingTimeKinds";

type CctProgrammeDetailsSectionProps = {
  programmeDetails: CctProgrammeDetails | null;
  specialties: CctSpecialty[];
  specialtiesStatus: CctSpecialtiesStatus;
  isRetryingSpecialties: boolean;
  onRetrySpecialties: () => void;
  isEditing: boolean;
  result: CctResult | null;
  calculationStatus: CctCalculationStatus;
  isRetryingCalculation: boolean;
  onRetryCalculation: () => void;
  hasInvalidChanges: boolean;
  invalidAdjustments: CctInvalidAdjustment[];
  onChange: (programmeDetails: CctProgrammeDetails) => void;
  onEditingChange: (isEditing: boolean) => void;
  onDirtyChange: (isDirty: boolean) => void;
};

export function CctProgrammeDetailsSection({
  programmeDetails,
  specialties,
  specialtiesStatus,
  isRetryingSpecialties,
  onRetrySpecialties,
  isEditing,
  result,
  calculationStatus,
  isRetryingCalculation,
  onRetryCalculation,
  hasInvalidChanges,
  invalidAdjustments,
  onChange,
  onEditingChange,
  onDirtyChange
}: Readonly<CctProgrammeDetailsSectionProps>) {
  const handleSubmit = (formData: FormData) => {
    onChange(
      applyCctEighteenMonthDefault(
        programmeDetails,
        mapFormDataToProgrammeDetails(formData),
        specialties
      )
    );
    onEditingChange(false);
  };

  return (
    <>
      <Card feature>
        <Card.Heading>Programme details</Card.Heading>
        {isEditing || !programmeDetails ? (
          <>
            {specialtiesStatus === "loading" && <Loading />}
            {specialtiesStatus === "failed" && (
              <CctRequestError
                isRetrying={isRetryingSpecialties}
                onRetry={onRetrySpecialties}
                message="We could not load the list of specialties."
              />
            )}
            {specialtiesStatus !== "succeeded" && programmeDetails && (
              <Button
                secondary
                type="button"
                onClick={() => onEditingChange(false)}
                data-cy="cct-programme-details-cancel"
              >
                Cancel
              </Button>
            )}
            {specialtiesStatus === "succeeded" && (
              <CctProgrammeDetailsForm
                initialData={mapProgrammeDetailsToFormData(
                  programmeDetails,
                  specialties
                )}
                specialties={specialties}
                submitLabel="Confirm programme details"
                onSubmit={handleSubmit}
                onCancel={
                  programmeDetails ? () => onEditingChange(false) : undefined
                }
                onDirtyChange={onDirtyChange}
              />
            )}
          </>
        ) : (
          <>
            {calculationStatus === "failed" && (
              <CctRequestError
                isRetrying={isRetryingCalculation}
                onRetry={onRetryCalculation}
                message="We could not calculate your programme end date."
              />
            )}
            {hasInvalidChanges && <CctInvalidChangesNotice />}
            <CctProgrammeDetailsSummary
              programmeDetails={programmeDetails}
              specialties={specialties}
              result={result}
              calculationStatus={calculationStatus}
            />
            <Button
              id="cct-edit-programme-details"
              secondary
              type="button"
              onClick={() => onEditingChange(true)}
              data-cy="cct-edit-programme-details"
            >
              Edit programme details
            </Button>
          </>
        )}
      </Card>
      {programmeDetails && !isEditing && invalidAdjustments.length > 0 && (
        <CctInvalidAdjustmentsSummary
          programmeDetails={programmeDetails}
          invalidAdjustments={invalidAdjustments}
        />
      )}
    </>
  );
}

export function CctInvalidChangesNotice() {
  return (
    <WarningCallout data-cy="cct-invalid-changes-notice">
      <WarningCallout.Heading visuallyHiddenText="">
        Important
      </WarningCallout.Heading>
      <p>
        Some of your changes no longer fit within your programme dates. Check
        them on the Changes page.
      </p>
    </WarningCallout>
  );
}

const CCT_GRADE_PROGRESSION_ERROR_FIELDS = new Set([
  "skippedGrade",
  "skippedGradeNotes",
  "eighteenMonthFinalGrade",
  "eighteenMonthFinalGradeNotes"
]);

export const cctAdjustmentErrorPage = ({ field }: CctInvalidAdjustment) => {
  if (CCT_TRAINING_TIME_KINDS.some(kind => kind.field === field))
    return CCT_PAGES.trainingTime;
  if (CCT_GRADE_PROGRESSION_ERROR_FIELDS.has(field))
    return CCT_PAGES.gradeProgression;
  return CCT_PAGES.programmeDetails;
};

const describeInvalidAdjustment = (
  programmeDetails: CctProgrammeDetails,
  { field, index }: CctProgrammeDetailsErrorTarget
) => {
  const kind = CCT_TRAINING_TIME_KINDS.find(kind => kind.field === field);
  if (kind && index !== null) {
    const entry = programmeDetails[kind.field][index];
    return {
      label: `${kind.title} (${entry.grade}, ${entry.months} months)`,
      editButtonId: trainingTimeEditButtonId(kind, index)
    };
  }
  if (kind)
    return {
      label: kind.title,
      editButtonId: trainingTimeEditButtonId(kind, 0)
    };
  if (field === "skippedGrade" || field === "skippedGradeNotes")
    return {
      label: "Skipped grade year",
      editButtonId: "cct-edit-grade-progression"
    };
  if (
    field === "eighteenMonthFinalGrade" ||
    field === "eighteenMonthFinalGradeNotes"
  )
    return {
      label: "18-month final year",
      editButtonId: "cct-edit-grade-progression"
    };
  return {
    label: "Programme details",
    editButtonId: "cct-edit-programme-details"
  };
};

export const cctInvalidAdjustmentText = (
  programmeDetails: CctProgrammeDetails,
  adjustment: CctInvalidAdjustment
) =>
  `${describeInvalidAdjustment(programmeDetails, adjustment).label}: ${
    adjustment.message
  }`;

type CctInvalidAdjustmentsSummaryProps = {
  programmeDetails: CctProgrammeDetails;
  invalidAdjustments: CctInvalidAdjustment[];
};

export function CctInvalidAdjustmentsSummary({
  programmeDetails,
  invalidAdjustments
}: Readonly<CctInvalidAdjustmentsSummaryProps>) {
  return (
    <ErrorSummary
      aria-labelledby="cct-invalid-adjustments-title"
      disableAutoFocus
      data-cy="cct-invalid-adjustments-summary"
    >
      <ErrorSummary.Title id="cct-invalid-adjustments-title">
        There is a problem with your adjustments
      </ErrorSummary.Title>
      <ErrorSummary.List>
        {invalidAdjustments.map(adjustment => {
          const { editButtonId } = describeInvalidAdjustment(
            programmeDetails,
            adjustment
          );
          return (
            <ErrorSummary.ListItem
              key={`${adjustment.pointer}-${adjustment.message}`}
              href={`#${editButtonId}`}
              onClick={e => {
                e.preventDefault();
                const editButton = document.getElementById(editButtonId);
                editButton?.scrollIntoView({
                  behavior: "smooth",
                  block: "center"
                });
                editButton?.focus({ preventScroll: true });
              }}
            >
              {cctInvalidAdjustmentText(programmeDetails, adjustment)}
            </ErrorSummary.ListItem>
          );
        })}
      </ErrorSummary.List>
    </ErrorSummary>
  );
}

type CctProgrammeDetailsInsetProps = {
  programmeDetails: CctProgrammeDetails | null;
  result: CctResult | null;
  onEdit: () => void;
};

export function CctProgrammeDetailsInset({
  programmeDetails,
  result,
  onEdit
}: Readonly<CctProgrammeDetailsInsetProps>) {
  if (!programmeDetails) return null;
  const additionalMonths = sumCctTrainingTime(
    programmeDetails.additionalTrainingTime
  );
  const acceleratedMonths = sumCctTrainingTime(
    programmeDetails.acceleratedTrainingTime
  );

  return (
    <InsetText data-cy="cct-programme-details-inset">
      <p>
        <strong>{programmeDetails.specialty}</strong>
        {`, ${deriveCctAdjustedLengthMonths(programmeDetails)} months`}
        {isCctLengthAdjusted(programmeDetails) && (
          <>
            <br />
            {`(${[
              `${programmeDetails.lengthMonths} months`,
              additionalMonths > 0 && `+${additionalMonths} additional`,
              acceleratedMonths > 0 && `-${acceleratedMonths} accelerated`
            ]
              .filter(Boolean)
              .join(", ")})`}
          </>
        )}
        <br />
        {`Start date ${formatCctDate(
          programmeDetails.startDate
        )}, start grade ${programmeDetails.startGrade}`}
        {result && (
          <>
            <br />
            {`End date ${formatCctDate(
              result.adjustedProgrammeEndDate
            )} (before changes)`}
          </>
        )}
      </p>
      <p>
        <button
          type="button"
          className="link-button"
          onClick={onEdit}
          data-cy="cct-programme-details-inset-link"
        >
          Change programme details
        </button>
      </p>
    </InsetText>
  );
}

type CctProgrammeDetailsSummaryProps = {
  programmeDetails: CctProgrammeDetails;
  specialties: CctSpecialty[];
  result: CctResult | null;
  calculationStatus: CctCalculationStatus;
};

export function CctProgrammeDetailsSummary({
  programmeDetails,
  specialties,
  result,
  calculationStatus
}: Readonly<CctProgrammeDetailsSummaryProps>) {
  const noResultText =
    calculationStatus === "failed" ? CCT_NO_VALUE : CCT_NOT_CALCULATED;
  const specialtyDefault = findCctSpecialty(
    specialties,
    programmeDetails.specialty
  );
  const isLengthOverridden = isCctLengthOverridden(
    specialtyDefault,
    programmeDetails.lengthMonths
  );
  const isGradeOverridden = isCctStartGradeOverridden(
    specialtyDefault,
    programmeDetails.startGrade
  );
  return (
    <SummaryList data-cy="cct-programme-details-summary">
      <SummaryList.Row>
        <SummaryList.Key>Specialty</SummaryList.Key>
        <SummaryList.Value>{programmeDetails.specialty}</SummaryList.Value>
      </SummaryList.Row>
      <SummaryList.Row>
        <SummaryList.Key>Programme length</SummaryList.Key>
        <SummaryList.Value>
          {`${programmeDetails.lengthMonths} months`}
          {isLengthOverridden && (
            <span className="nhsuk-hint nhsuk-u-margin-left-2">
              {`(default for this specialty is ${specialtyDefault?.lengthMonths} months)`}
            </span>
          )}
          {isLengthOverridden && programmeDetails.lengthOverrideNotes && (
            <div className="nhsuk-hint nhsuk-u-margin-top-1">
              {programmeDetails.lengthOverrideNotes}
            </div>
          )}
        </SummaryList.Value>
      </SummaryList.Row>
      <SummaryList.Row>
        <SummaryList.Key>Programme start date</SummaryList.Key>
        <SummaryList.Value>
          {formatCctDate(programmeDetails.startDate)}
        </SummaryList.Value>
      </SummaryList.Row>
      <SummaryList.Row>
        <SummaryList.Key>Original programme end date</SummaryList.Key>
        <SummaryList.Value>
          {result
            ? formatCctDate(result.originalProgrammeEndDate)
            : noResultText}
        </SummaryList.Value>
      </SummaryList.Row>
      <SummaryList.Row>
        <SummaryList.Key>Start grade</SummaryList.Key>
        <SummaryList.Value>
          {programmeDetails.startGrade}
          {isGradeOverridden && (
            <span className="nhsuk-hint nhsuk-u-margin-left-2">
              {`(default for this specialty is ${specialtyDefault?.entryGrade})`}
            </span>
          )}
          {isGradeOverridden && programmeDetails.startGradeOverrideNotes && (
            <div className="nhsuk-hint nhsuk-u-margin-top-1">
              {programmeDetails.startGradeOverrideNotes}
            </div>
          )}
        </SummaryList.Value>
      </SummaryList.Row>
    </SummaryList>
  );
}
