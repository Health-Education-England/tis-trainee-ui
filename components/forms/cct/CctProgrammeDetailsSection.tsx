import { useState } from "react";
import { Button, Card, InsetText, SummaryList } from "nhsuk-react-components";
import { FormData } from "../form-builder/FormBuilder";
import { CctProgrammeDetails, CctResult } from "../../../models/CctTypes";
import {
  CCT_NOT_CALCULATED,
  findCctSpecialty
} from "../../../utilities/CctConstants";
import {
  deriveCctAdjustedLengthMonths,
  formatCctDate,
  isCctLengthAdjusted,
  mapFormDataToProgrammeDetails,
  mapProgrammeDetailsToFormData
} from "../../../utilities/CctUtilities";
import { CctProgrammeDetailsForm } from "./CctProgrammeDetailsForm";

type CctProgrammeDetailsSectionProps = {
  programmeDetails: CctProgrammeDetails | null;
  result: CctResult | null;
  onChange: (programmeDetails: CctProgrammeDetails) => void;
};

export function CctProgrammeDetailsSection({
  programmeDetails,
  result,
  onChange
}: Readonly<CctProgrammeDetailsSectionProps>) {
  const [isEditing, setIsEditing] = useState(programmeDetails === null);

  const handleSubmit = (formData: FormData) => {
    onChange(mapFormDataToProgrammeDetails(formData));
    setIsEditing(false);
  };

  return (
    <Card feature>
      <Card.Heading>Programme details</Card.Heading>
      {isEditing || !programmeDetails ? (
        <CctProgrammeDetailsForm
          initialData={mapProgrammeDetailsToFormData(programmeDetails)}
          submitLabel={
            programmeDetails ? "Save programme details" : "Save and continue"
          }
          onSubmit={handleSubmit}
          onCancel={programmeDetails ? () => setIsEditing(false) : undefined}
        />
      ) : (
        <>
          <CctProgrammeDetailsSummary
            programmeDetails={programmeDetails}
            result={result}
          />
          <Button
            secondary
            type="button"
            onClick={() => setIsEditing(true)}
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
  return (
    <InsetText data-cy="cct-programme-details-inset">
      {programmeDetails ? (
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
          {result?.adjustedProgrammeEndDate && (
            <>
              <br />
              {`End date ${formatCctDate(
                result.adjustedProgrammeEndDate
              )} (before changes)`}
            </>
          )}
        </p>
      ) : (
        <p>
          <em>No programme details added yet.</em>
        </p>
      )}
      <p>
        <button
          type="button"
          className="link-button"
          onClick={onEdit}
          data-cy="cct-programme-details-inset-link"
        >
          {programmeDetails
            ? "Change programme details"
            : "Add programme details"}
        </button>
      </p>
    </InsetText>
  );
}

type CctProgrammeDetailsSummaryProps = {
  programmeDetails: CctProgrammeDetails;
  result: CctResult | null;
};

export function CctProgrammeDetailsSummary({
  programmeDetails,
  result
}: Readonly<CctProgrammeDetailsSummaryProps>) {
  const specialtyDefault = findCctSpecialty(programmeDetails.specialty);
  const isGradeOverridden =
    !!specialtyDefault &&
    programmeDetails.startGrade !== specialtyDefault.entryGrade;
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
            : CCT_NOT_CALCULATED}
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
              : CCT_NOT_CALCULATED}
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
