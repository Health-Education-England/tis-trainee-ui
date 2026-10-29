import { InsetText, SummaryList, Table } from "nhsuk-react-components";
import {
  CctCalculatedChange,
  CctChange,
  CctProgrammeDetails,
  CctResult,
  CctSpecialty
} from "../../../models/CctTypes";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../../redux/slices/traineeProfileSlice";
import {
  CCT_NO_CHANGES_TEXT,
  CCT_NO_VALUE,
  CCT_NOT_APPLICABLE
} from "../../../utilities/CctConstants";
import {
  CctMonthTotals,
  deriveCctChangesTable,
  findProjectingChange,
  formatCctDate,
  formatCctMonths,
  formatCctWte,
  getCctChangeTypeShortLabel,
  isOpenLtftChange
} from "../../../utilities/CctUtilities";
import { DateUtilities } from "../../../utilities/DateUtilities";
import { CctProgrammeDetailsSummary } from "./CctProgrammeDetailsSection";
import style from "./CctPrintSummary.module.scss";

type CctPrintSummaryProps = {
  programmeDetails: CctProgrammeDetails;
  specialties: CctSpecialty[];
  changes: CctChange[];
  calculatedChanges: CctCalculatedChange[];
  result: CctResult;
  savedName: string;
};

export function CctPrintSummary({
  programmeDetails,
  specialties,
  changes,
  calculatedChanges,
  result,
  savedName
}: Readonly<CctPrintSummaryProps>) {
  const { personalDetails } = useAppSelector(selectTraineeProfile);
  const traineeName = [personalDetails.forenames, personalDetails.surname]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={style.printSummary} data-cy="cct-print-summary">
      <h1 className="nhsuk-heading-l">
        Certificate of Completion of Training (CCT) calculation
      </h1>
      <SummaryList data-cy="cct-print-trainee-details">
        <SummaryList.Row>
          <SummaryList.Key>Name</SummaryList.Key>
          <SummaryList.Value>{traineeName || CCT_NO_VALUE}</SummaryList.Value>
        </SummaryList.Row>
        <SummaryList.Row>
          <SummaryList.Key>GMC number</SummaryList.Key>
          <SummaryList.Value>
            {personalDetails.gmcNumber || CCT_NO_VALUE}
          </SummaryList.Value>
        </SummaryList.Row>
        {savedName && (
          <SummaryList.Row>
            <SummaryList.Key>Calculation name</SummaryList.Key>
            <SummaryList.Value>{savedName}</SummaryList.Value>
          </SummaryList.Row>
        )}
        <SummaryList.Row>
          <SummaryList.Key>Printed on</SummaryList.Key>
          <SummaryList.Value>
            {DateUtilities.ToLocalDate(new Date())}
          </SummaryList.Value>
        </SummaryList.Row>
      </SummaryList>

      <h2 className="nhsuk-heading-m">Your indicative completion date</h2>
      <SummaryList data-cy="cct-print-result">
        <SummaryList.Row>
          <SummaryList.Key>
            Projected Completion of Training Date
          </SummaryList.Key>
          <SummaryList.Value>
            <strong>{formatCctDate(result.cctDate)}</strong>
          </SummaryList.Value>
        </SummaryList.Row>
        <SummaryList.Row>
          <SummaryList.Key>Total WTE completed (months)</SummaryList.Key>
          <SummaryList.Value>
            {formatCctMonths(result.totalWteMonthsCompleted)}
          </SummaryList.Value>
        </SummaryList.Row>
        <SummaryList.Row>
          <SummaryList.Key>Training remaining (months)</SummaryList.Key>
          <SummaryList.Value>
            {formatCctMonths(result.monthsRemaining)}
          </SummaryList.Value>
        </SummaryList.Row>
      </SummaryList>
      <InsetText data-cy="cct-print-disclaimer">
        <p>
          <strong>
            The completion date is indicative; the official CCT date is agreed
            at your next ARCP.
          </strong>
        </p>
      </InsetText>

      <h2 className="nhsuk-heading-m">Programme details</h2>
      <CctProgrammeDetailsSummary
        programmeDetails={programmeDetails}
        specialties={specialties}
        result={result}
        calculationStatus="succeeded"
      />

      <h2 className="nhsuk-heading-m">Changes</h2>
      {changes.length === 0 ? (
        <p data-cy="cct-print-no-changes">{CCT_NO_CHANGES_TEXT}</p>
      ) : (
        <CctPrintChangesTable
          changes={changes}
          calculatedChanges={calculatedChanges}
          result={result}
        />
      )}

      {/* TODO: add the grade progression once /calculate returns it. The Summary's grade card says "This feature is coming soon." until then. */}
    </div>
  );
}

type CctPrintChangesTableProps = {
  changes: CctChange[];
  calculatedChanges: CctCalculatedChange[];
  result: CctResult;
};

function CctPrintChangesTable({
  changes,
  calculatedChanges,
  result
}: Readonly<CctPrintChangesTableProps>) {
  const projectingChange = findProjectingChange(calculatedChanges);
  const { rows, allTotals, completionTotals } = deriveCctChangesTable(
    changes,
    calculatedChanges,
    result
  );

  const totalsRow = (label: string, totals: CctMonthTotals) => (
    <Table.Row className={style.totalRow}>
      <Table.Cell colSpan={5}>
        <strong>{label}</strong>
      </Table.Cell>
      <Table.Cell>
        <strong>{formatCctMonths(totals.calendarMonths)}</strong>
      </Table.Cell>
      <Table.Cell>
        <strong>{formatCctMonths(totals.wteMonths)}</strong>
      </Table.Cell>
    </Table.Row>
  );

  return (
    <Table className={style.changesTable} data-cy="cct-print-changes-table">
      <colgroup>
        <col className={style.typeColumn} />
        <col className={style.dateColumn} />
        <col className={style.dateColumn} />
        <col className={style.wteColumn} />
        <col className={style.countsColumn} />
        <col className={style.monthsColumn} />
        <col className={style.monthsColumn} />
      </colgroup>
      <Table.Head>
        <Table.Row>
          <Table.Cell>Type</Table.Cell>
          <Table.Cell>Start</Table.Cell>
          <Table.Cell>End</Table.Cell>
          <Table.Cell>WTE %</Table.Cell>
          <Table.Cell>Counted as training?</Table.Cell>
          <Table.Cell>Calendar months</Table.Cell>
          <Table.Cell>WTE months</Table.Cell>
        </Table.Row>
      </Table.Head>
      {rows.map(row =>
        row.kind === "assumed" ? (
          <Table.Body key={`assumed-${row.period.startDate}`}>
            <Table.Row>
              <Table.Cell>Assumed full-time</Table.Cell>
              <Table.Cell>{formatCctDate(row.period.startDate)}</Table.Cell>
              <Table.Cell>{formatCctDate(row.period.endDate)}</Table.Cell>
              <Table.Cell>100%</Table.Cell>
              <Table.Cell>Yes</Table.Cell>
              <Table.Cell>{formatCctMonths(row.period.months)}</Table.Cell>
              <Table.Cell>{formatCctMonths(row.period.months)}</Table.Cell>
            </Table.Row>
          </Table.Body>
        ) : (
          <CctPrintChangeRows
            key={row.change.id}
            change={row.change}
            calculated={row.calculated}
          />
        )
      )}
      <Table.Body>
        {totalsRow("Total", allTotals)}
        <Table.Row className={style.projectionRow}>
          <Table.Cell>
            <strong>
              {projectingChange ? "LTFT projection" : "Full-time projection"}
            </strong>
          </Table.Cell>
          <Table.Cell>{formatCctDate(result.projection.startDate)}</Table.Cell>
          <Table.Cell>
            <strong>{formatCctDate(result.cctDate)}</strong>
          </Table.Cell>
          <Table.Cell>{formatCctWte(result.projection.wte)}</Table.Cell>
          <Table.Cell>Yes</Table.Cell>
          <Table.Cell>
            {formatCctMonths(result.projection.calendarMonths)}
          </Table.Cell>
          <Table.Cell>
            {formatCctMonths(result.projection.wteMonths)}
          </Table.Cell>
        </Table.Row>
        {totalsRow("Total to completion", completionTotals)}
      </Table.Body>
    </Table>
  );
}

type CctPrintChangeRowsProps = {
  change: CctChange;
  calculated: CctCalculatedChange | null;
};

function CctPrintChangeRows({
  change,
  calculated
}: Readonly<CctPrintChangeRowsProps>) {
  const isOpen = isOpenLtftChange(change);

  return (
    <Table.Body>
      <Table.Row className={change.notes ? style.rowWithNotes : undefined}>
        <Table.Cell>{getCctChangeTypeShortLabel(change.type)}</Table.Cell>
        <Table.Cell>{formatCctDate(change.startDate)}</Table.Cell>
        <Table.Cell>
          {isOpen ? "For remainder of training" : formatCctDate(change.endDate)}
        </Table.Cell>
        <Table.Cell>{formatCctWte(change.wte)}</Table.Cell>
        <Table.Cell>{change.countsTowardsCompletion ? "Yes" : "No"}</Table.Cell>
        <Table.Cell>
          {isOpen
            ? CCT_NOT_APPLICABLE
            : formatCctMonths(calculated?.calendarMonths)}
        </Table.Cell>
        <Table.Cell>
          {isOpen ? CCT_NOT_APPLICABLE : formatCctMonths(calculated?.wteMonths)}
        </Table.Cell>
      </Table.Row>
      {change.notes && (
        <Table.Row>
          <Table.Cell colSpan={7} className={style.notesCell}>
            <strong>Notes:</strong> {change.notes}
          </Table.Cell>
        </Table.Row>
      )}
    </Table.Body>
  );
}
