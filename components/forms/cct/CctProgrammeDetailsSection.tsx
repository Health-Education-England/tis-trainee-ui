import { useState } from "react";
import { Button, Card, SummaryList } from "nhsuk-react-components";
import { FormData } from "../form-builder/FormBuilder";
import { CctProgrammeDetails } from "../../../models/CctTypes";
import { findCctSpecialty } from "../../../utilities/CctConstants";
import {
  formatCctDate,
  mapFormDataToProgrammeDetails,
  mapProgrammeDetailsToFormData
} from "../../../utilities/CctUtilities";
import { CctProgrammeDetailsForm } from "./CctProgrammeDetailsForm";

type CctProgrammeDetailsSectionProps = {
  programmeDetails: CctProgrammeDetails | null;
  onChange: (programmeDetails: CctProgrammeDetails) => void;
};

export function CctProgrammeDetailsSection({
  programmeDetails,
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
          <CctProgrammeDetailsSummary programmeDetails={programmeDetails} />
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

type CctProgrammeDetailsSummaryProps = {
  programmeDetails: CctProgrammeDetails;
};

export function CctProgrammeDetailsSummary({
  programmeDetails
}: Readonly<CctProgrammeDetailsSummaryProps>) {
  const specialtyDefault = findCctSpecialty(programmeDetails.specialty);
  const isGradeOverridden =
    !!specialtyDefault &&
    programmeDetails.startGrade !== specialtyDefault.entryGrade;

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
