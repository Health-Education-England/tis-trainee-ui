import {
  Button,
  Card,
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
  CCT_NOT_CALCULATED
} from "../../../utilities/CctConstants";
import {
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
import { CctGradeProgressionSection } from "./CctGradeProgressionSection";
import { CctProgrammeDetailsForm } from "./CctProgrammeDetailsForm";
import { CctRequestError } from "./CctRequestError";
import { CctTrainingTimeSection } from "./CctTrainingTimeSection";

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
  isAdjustmentFormOpen: boolean;
  onChange: (programmeDetails: CctProgrammeDetails) => void;
  onEditingChange: (isEditing: boolean) => void;
  onAdjustmentFormOpenChange: (isFormOpen: boolean) => void;
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
  isAdjustmentFormOpen,
  onChange,
  onEditingChange,
  onAdjustmentFormOpenChange,
  onDirtyChange
}: Readonly<CctProgrammeDetailsSectionProps>) {
  const handleSubmit = (formData: FormData) => {
    onChange(mapFormDataToProgrammeDetails(formData));
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
            {hasInvalidChanges && (
              <WarningCallout data-cy="cct-invalid-changes-notice">
                <WarningCallout.Heading visuallyHiddenText="">
                  Important
                </WarningCallout.Heading>
                <p>
                  Some of your changes no longer fit within your programme
                  dates. Check them on the Changes page.
                </p>
              </WarningCallout>
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
              disabled={isAdjustmentFormOpen}
              onClick={() => onEditingChange(true)}
              data-cy="cct-edit-programme-details"
            >
              Edit programme details
            </Button>
          </>
        )}
      </Card>
      {programmeDetails && !isEditing && (
        <>
          <CctTrainingTimeSection
            programmeDetails={programmeDetails}
            result={result}
            calculationStatus={calculationStatus}
            isFormOpen={isAdjustmentFormOpen}
            onChange={onChange}
            onFormOpenChange={onAdjustmentFormOpenChange}
            onDirtyChange={onDirtyChange}
          />
          <CctGradeProgressionSection
            programmeDetails={programmeDetails}
            specialties={specialties}
            isFormOpen={isAdjustmentFormOpen}
            onChange={onChange}
            onFormOpenChange={onAdjustmentFormOpenChange}
            onDirtyChange={onDirtyChange}
          />
        </>
      )}
    </>
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
