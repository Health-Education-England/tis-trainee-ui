import { Button, Card, InsetText, SummaryList } from "nhsuk-react-components";
import { FormData } from "../form-builder/FormBuilder";
import {
  CctProgrammeDetails,
  CctResult,
  CctSpecialty
} from "../../../models/CctTypes";
import Loading from "../../common/Loading";
import {
  CCT_NO_VALUE,
  CCT_NOT_CALCULATED
} from "../../../utilities/CctConstants";
import {
  deriveCctAdjustedLengthMonths,
  findCctSpecialty,
  formatCctDate,
  isCctLengthAdjusted,
  isCctStartGradeOverridden,
  mapFormDataToProgrammeDetails,
  mapProgrammeDetailsToFormData
} from "../../../utilities/CctUtilities";
import { CctCalculationStatus } from "../../../utilities/hooks/useCctCalculation";
import { CctSpecialtiesStatus } from "../../../utilities/hooks/useCctSpecialties";
import { CctProgrammeDetailsForm } from "./CctProgrammeDetailsForm";
import { CctRequestError } from "./CctRequestError";

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
  onChange: (programmeDetails: CctProgrammeDetails) => void;
  onEditingChange: (isEditing: boolean) => void;
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
  onChange,
  onEditingChange
}: Readonly<CctProgrammeDetailsSectionProps>) {
  const handleSubmit = (formData: FormData) => {
    onChange(mapFormDataToProgrammeDetails(formData));
    onEditingChange(false);
  };

  return (
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
          {specialtiesStatus === "succeeded" && (
            <CctProgrammeDetailsForm
              initialData={mapProgrammeDetailsToFormData(
                programmeDetails,
                specialties
              )}
              specialties={specialties}
              submitLabel="Save programme details"
              onSubmit={handleSubmit}
              onCancel={
                programmeDetails ? () => onEditingChange(false) : undefined
              }
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
          <CctProgrammeDetailsSummary
            programmeDetails={programmeDetails}
            specialties={specialties}
            result={result}
            calculationStatus={calculationStatus}
          />
          <Button
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
              programmeDetails.additionalMonths > 0 &&
                `+${programmeDetails.additionalMonths} additional`,
              programmeDetails.acceleratedMonths > 0 &&
                `-${programmeDetails.acceleratedMonths} accelerated`
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
  const isGradeOverridden = isCctStartGradeOverridden(
    specialtyDefault,
    programmeDetails.startGrade
  );
  const isLengthAdjusted = isCctLengthAdjusted(programmeDetails);
  const adjustedLengthMonths = deriveCctAdjustedLengthMonths(programmeDetails);

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
      {programmeDetails.additionalMonths > 0 && (
        <SummaryList.Row>
          <SummaryList.Key>Additional training time</SummaryList.Key>
          <SummaryList.Value>
            {`${programmeDetails.additionalMonths} months`}
            {programmeDetails.additionalMonthsNotes && (
              <div className="nhsuk-hint nhsuk-u-margin-top-1">
                {programmeDetails.additionalMonthsNotes}
              </div>
            )}
          </SummaryList.Value>
        </SummaryList.Row>
      )}
      {programmeDetails.acceleratedMonths > 0 && (
        <SummaryList.Row>
          <SummaryList.Key>Accelerated training time</SummaryList.Key>
          <SummaryList.Value>
            {`${programmeDetails.acceleratedMonths} months`}
            {programmeDetails.acceleratedMonthsNotes && (
              <div className="nhsuk-hint nhsuk-u-margin-top-1">
                {programmeDetails.acceleratedMonthsNotes}
              </div>
            )}
          </SummaryList.Value>
        </SummaryList.Row>
      )}
      {isLengthAdjusted && (
        <SummaryList.Row>
          <SummaryList.Key>Adjusted programme length</SummaryList.Key>
          <SummaryList.Value>{`${adjustedLengthMonths} months`}</SummaryList.Value>
        </SummaryList.Row>
      )}
      {isLengthAdjusted && (
        <SummaryList.Row>
          <SummaryList.Key>
            Adjusted programme end date before changes
          </SummaryList.Key>
          <SummaryList.Value>
            {result
              ? formatCctDate(result.adjustedProgrammeEndDate)
              : noResultText}
            <span className="nhsuk-hint nhsuk-u-margin-left-2">
              (based on programme length and training-time adjustments only)
            </span>
          </SummaryList.Value>
        </SummaryList.Row>
      )}
      {programmeDetails.eighteenMonthFinalGrade && (
        <SummaryList.Row>
          <SummaryList.Key>18-month final year</SummaryList.Key>
          <SummaryList.Value>
            {programmeDetails.eighteenMonthFinalGrade}
            {programmeDetails.eighteenMonthFinalGradeNotes && (
              <div className="nhsuk-hint nhsuk-u-margin-top-1">
                {programmeDetails.eighteenMonthFinalGradeNotes}
              </div>
            )}
          </SummaryList.Value>
        </SummaryList.Row>
      )}
      {programmeDetails.skippedGrade && (
        <SummaryList.Row>
          <SummaryList.Key>Skipped grade year</SummaryList.Key>
          <SummaryList.Value>
            {programmeDetails.skippedGrade}
            {programmeDetails.skippedGradeNotes && (
              <div className="nhsuk-hint nhsuk-u-margin-top-1">
                {programmeDetails.skippedGradeNotes}
              </div>
            )}
          </SummaryList.Value>
        </SummaryList.Row>
      )}
    </SummaryList>
  );
}
