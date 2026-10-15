import {
  Card,
  SummaryList,
  Table,
  WarningCallout
} from "nhsuk-react-components";
import {
  CctChange,
  CctProgrammeDetails,
  CctProjection,
  CctResult
} from "../../../models/CctTypes";
import {
  CCT_NOT_CALCULATED,
  CCT_NO_VALUE
} from "../../../utilities/CctConstants";
import { formatCctDate } from "../../../utilities/CctUtilities";
import { CctChangesTable } from "./CctChangesSection";
import { CctProgrammeDetailsSummary } from "./CctProgrammeDetailsSection";

type CctSummaryProps = {
  programmeDetails: CctProgrammeDetails | null;
  changes: CctChange[];
  projection: CctProjection | null;
  result: CctResult | null;
};

export function CctSummary({
  programmeDetails,
  changes,
  projection,
  result
}: Readonly<CctSummaryProps>) {
  return (
    <>
      <Card feature>
        <Card.Heading>Your indicative completion date</Card.Heading>
        {!result && (
          <WarningCallout data-cy="cct-no-result-warning">
            <WarningCallout.Heading visuallyHiddenText="">
              Important
            </WarningCallout.Heading>
            <p>
              The calculation is not available yet. Your dates and grade
              progression will appear here once the calculator is connected.
            </p>
          </WarningCallout>
        )}
        <SummaryList data-cy="cct-result-summary">
          <SummaryList.Row>
            <SummaryList.Key>
              Projected Completion of Training Date
            </SummaryList.Key>
            <SummaryList.Value>
              <strong>
                {result ? formatCctDate(result.cctDate) : CCT_NOT_CALCULATED}
              </strong>
            </SummaryList.Value>
          </SummaryList.Row>
          <SummaryList.Row>
            <SummaryList.Key>Total WTE completed (months)</SummaryList.Key>
            <SummaryList.Value>
              {result?.totalWteMonthsCompleted ?? CCT_NO_VALUE}
            </SummaryList.Value>
          </SummaryList.Row>
          <SummaryList.Row>
            <SummaryList.Key>Training remaining (months)</SummaryList.Key>
            <SummaryList.Value>
              {result?.monthsRemaining ?? CCT_NO_VALUE}
            </SummaryList.Value>
          </SummaryList.Row>
        </SummaryList>
      </Card>

      <Card feature>
        <Card.Heading>Programme details</Card.Heading>
        {programmeDetails ? (
          <CctProgrammeDetailsSummary programmeDetails={programmeDetails} />
        ) : (
          <p data-cy="cct-summary-no-programme-details">
            <em>No programme details added yet.</em>
          </p>
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
