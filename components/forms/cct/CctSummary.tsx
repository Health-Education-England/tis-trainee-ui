import { Card, SummaryList, Table } from "nhsuk-react-components";
import {
  CctChange,
  CctProgrammeDetails,
  CctProjection,
  CctResult
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
import { CctCalculationError } from "./CctCalculationError";
import { CctChangesTable } from "./CctChangesSection";
import { CctProgrammeDetailsSummary } from "./CctProgrammeDetailsSection";

type CctSummaryProps = {
  programmeDetails: CctProgrammeDetails | null;
  changes: CctChange[];
  projection: CctProjection | null;
  result: CctResult | null;
  calculationStatus: CctCalculationStatus;
  isRetrying: boolean;
  onRetry: () => void;
};

export function CctSummary({
  programmeDetails,
  changes,
  projection,
  result,
  calculationStatus,
  isRetrying,
  onRetry
}: Readonly<CctSummaryProps>) {
  const noResultText =
    calculationStatus === "failed" ? CCT_NO_VALUE : CCT_NOT_CALCULATED;

  return (
    <>
      <Card feature>
        <Card.Heading>Your indicative completion date</Card.Heading>
        {calculationStatus === "failed" && (
          <CctCalculationError isRetrying={isRetrying} onRetry={onRetry} />
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
          programmeDetails={programmeDetails}
          changes={changes}
          projection={projection}
          result={result}
        />
      </Card>

      <Card feature>
        <Card.Heading>Grade progression</Card.Heading>
        <CctGradeProgressionTable result={result} />
      </Card>
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
