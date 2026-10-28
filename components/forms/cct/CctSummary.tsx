import { Button, Card, SummaryList, Table } from "nhsuk-react-components";
import {
  CctCalculatedChange,
  CctChange,
  CctProgrammeDetails,
  CctResult,
  CctSpecialty
} from "../../../models/CctTypes";
import {
  CCT_NO_VALUE,
  CCT_NOT_CALCULATED
} from "../../../utilities/CctConstants";
import {
  formatCctDate,
  formatCctMonths
} from "../../../utilities/CctUtilities";
import { CctCalculationStatus } from "../../../utilities/hooks/useCctCalculation";
import { CctSaveStatus } from "../../../redux/slices/cctSlice";
import { CctChangesTable } from "./CctChangesSection";
import { CctProgrammeDetailsSummary } from "./CctProgrammeDetailsSection";
import { CctRequestError } from "./CctRequestError";
import { CctSaveForm } from "./CctSaveForm";

type CctSummaryProps = {
  programmeDetails: CctProgrammeDetails | null;
  specialties: CctSpecialty[];
  changes: CctChange[];
  calculatedChanges: CctCalculatedChange[];
  result: CctResult | null;
  calculationStatus: CctCalculationStatus;
  isRetrying: boolean;
  onRetry: () => void;
  hasInvalidChanges: boolean;
  onGoToChanges: () => void;
  savedName: string;
  saveStatus: CctSaveStatus;
  onSave: (name: string) => void;
};

export function CctSummary({
  programmeDetails,
  specialties,
  changes,
  calculatedChanges,
  result,
  calculationStatus,
  isRetrying,
  onRetry,
  hasInvalidChanges,
  onGoToChanges,
  savedName,
  saveStatus,
  onSave
}: Readonly<CctSummaryProps>) {
  const noResultText =
    calculationStatus === "failed" ? CCT_NO_VALUE : CCT_NOT_CALCULATED;

  return (
    <>
      <Card feature>
        <Card.Heading>Your indicative completion date</Card.Heading>
        {calculationStatus === "failed" && (
          <CctRequestError isRetrying={isRetrying} onRetry={onRetry} />
        )}
        <SummaryList data-cy="cct-result-summary">
          <SummaryList.Row>
            <SummaryList.Key>
              Projected Completion of Training Date
            </SummaryList.Key>
            <SummaryList.Value>
              <strong>
                {result ? formatCctDate(result.cctDate) : noResultText}
              </strong>
            </SummaryList.Value>
          </SummaryList.Row>
          <SummaryList.Row>
            <SummaryList.Key>Total WTE completed (months)</SummaryList.Key>
            <SummaryList.Value>
              {formatCctMonths(result?.totalWteMonthsCompleted)}
            </SummaryList.Value>
          </SummaryList.Row>
          <SummaryList.Row>
            <SummaryList.Key>Training remaining (months)</SummaryList.Key>
            <SummaryList.Value>
              {formatCctMonths(result?.monthsRemaining)}
            </SummaryList.Value>
          </SummaryList.Row>
        </SummaryList>
      </Card>

      <Card feature>
        <Card.Heading>Programme details</Card.Heading>
        {programmeDetails && (
          <CctProgrammeDetailsSummary
            programmeDetails={programmeDetails}
            specialties={specialties}
            result={result}
            calculationStatus={calculationStatus}
          />
        )}
      </Card>

      <Card feature>
        <Card.Heading>Changes</Card.Heading>
        {changes.length === 0 && (
          <p data-cy="cct-summary-no-changes">
            <em>
              No changes recorded, so your whole programme is treated as full
              time at 100% WTE.
            </em>
          </p>
        )}
        <CctChangesTable
          changes={changes}
          calculatedChanges={calculatedChanges}
          result={result}
        />
      </Card>

      <Card feature>
        <Card.Heading>Grade progression</Card.Heading>
        <CctGradeProgressionTable result={result} />
      </Card>

      {calculationStatus === "succeeded" && (
        <Card feature>
          <Card.Heading>Save your calculation</Card.Heading>
          {hasInvalidChanges ? (
            <>
              <p data-cy="cct-save-blocked">
                There is a problem with your changes. You need to fix it before
                you can save this calculation.
              </p>
              <Button
                secondary
                type="button"
                onClick={onGoToChanges}
                data-cy="cct-go-to-changes"
              >
                Go to changes
              </Button>
            </>
          ) : (
            <CctSaveForm
              savedName={savedName}
              saveStatus={saveStatus}
              onSave={onSave}
            />
          )}
        </Card>
      )}
    </>
  );
}

type CctGradeProgressionTableProps = {
  result: CctResult | null;
};

function CctGradeProgressionTable({
  result
}: Readonly<CctGradeProgressionTableProps>) {
  const gradeProgression = result?.gradeProgression ?? [];

  if (gradeProgression.length === 0) {
    return (
      <p data-cy="cct-no-grade-progression">
        <em>{CCT_NOT_CALCULATED}</em>
      </p>
    );
  }

  return (
    <Table responsive data-cy="cct-grade-progression-table">
      <Table.Head>
        <Table.Row>
          <Table.Cell>Year</Table.Cell>
          <Table.Cell>Grade</Table.Cell>
          <Table.Cell>End date</Table.Cell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {gradeProgression.map(gradeYear => (
          <Table.Row key={gradeYear.yearNumber}>
            <Table.Cell>{gradeYear.yearNumber}</Table.Cell>
            <Table.Cell>{gradeYear.grade}</Table.Cell>
            <Table.Cell>{formatCctDate(gradeYear.endDate)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
