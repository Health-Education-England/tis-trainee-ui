import { useEffect, useRef, useState } from "react";
import day from "dayjs";
import { Button, Card, ErrorSummary, Table, Tag } from "nhsuk-react-components";
import { FormData } from "../form-builder/FormBuilder";
import {
  CctAssumedFullTimePeriod,
  CctCalculatedChange,
  CctChange,
  CctProgrammeDetails,
  CctResult
} from "../../../models/CctTypes";
import {
  CCT_NOT_APPLICABLE,
  CCT_NOT_CALCULATED,
  CCT_NO_VALUE
} from "../../../utilities/CctConstants";
import {
  CctMonthTotals,
  findCctNotesPreviewEnd,
  findProjectingChange,
  formatCctDate,
  formatCctMonths,
  formatCctWte,
  getCctChangeTypeShortLabel,
  isOpenLtftChange,
  mapChangeToFormData,
  mapFormDataToChange,
  pickCctCalculatedChanges,
  sumCctMonths
} from "../../../utilities/CctUtilities";
import { CctCalculationStatus } from "../../../utilities/hooks/useCctCalculation";
import { CctChangeForm } from "./CctChangeForm";
import style from "./CctChanges.module.scss";
import { CctRequestError } from "./CctRequestError";

type CctChangesSectionProps = {
  programmeDetails: CctProgrammeDetails | null;
  changes: CctChange[];
  calculatedChanges: CctCalculatedChange[];
  result: CctResult | null;
  cctDate: string | null;
  invalidChanges: CctInvalidChange[];
  calculationStatus: CctCalculationStatus;
  isRetrying: boolean;
  isFormOpen: boolean;
  onRetry: () => void;
  onChange: (changes: CctChange[]) => void;
  onFormOpenChange: (isFormOpen: boolean) => void;
};

type CctInvalidChange = {
  change: CctChange;
  pointer: string;
  message: string;
};

const editButtonId = (changeId: string) => `cct-edit-change-${changeId}`;

let lastChangeId = 0;
const newChangeId = () => {
  lastChangeId += 1;
  return `cct-change-${lastChangeId}`;
};

export function CctChangesSection({
  programmeDetails,
  changes,
  calculatedChanges,
  result,
  cctDate,
  invalidChanges,
  calculationStatus,
  isRetrying,
  isFormOpen,
  onRetry,
  onChange,
  onFormOpenChange
}: Readonly<CctChangesSectionProps>) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const noResultText =
    calculationStatus === "failed" ? CCT_NO_VALUE : CCT_NOT_CALCULATED;

  useEffect(() => {
    if (!isFormOpen) return;
    document
      .getElementById("cct-change-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById("type")?.focus({ preventScroll: true });
  }, [isFormOpen]);

  const editingChange = changes.find(change => change.id === editingId) ?? null;
  const hasChanges = changes.length > 0;
  const isProjectionInvalid =
    !!cctDate &&
    !!result &&
    day(result.projection.startDate).diff(cctDate, "day") > 1;

  const closeForm = () => {
    setEditingId(null);
    onFormOpenChange(false);
  };

  const handleSubmit = (formData: FormData) => {
    const change = mapFormDataToChange(formData, editingId ?? newChangeId());
    onChange(
      editingChange
        ? changes.map(existing =>
            existing.id === editingId ? change : existing
          )
        : [...changes, change]
    );
    closeForm();
    setTimeout(() => {
      const table = document.getElementById("cct-changes-scroll");
      table?.scrollIntoView({ behavior: "smooth", block: "start" });
      table?.focus({ preventScroll: true });
    }, 0);
  };

  return (
    <Card feature>
      <Card.Heading>Changes</Card.Heading>
      <p>
        Add all your past or planned changes to your training (e.g. LTFT, OOP,
        parental leave).
      </p>
      <p>
        Any gaps are assumed to be full-time, at 100% whole-time equivalent
        (WTE).
      </p>

      {invalidChanges.length > 0 && (
        <CctInvalidChangesSummary invalidChanges={invalidChanges} />
      )}

      <CctChangesTable
        changes={changes}
        calculatedChanges={calculatedChanges}
        result={result}
        invalidChangeIds={invalidChanges.map(({ change }) => change.id)}
        isProjectionInvalid={isProjectionInvalid}
        editingId={editingId}
        isFormOpen={isFormOpen}
        onEdit={id => {
          setEditingId(id);
          onFormOpenChange(true);
        }}
        onRemove={id => onChange(changes.filter(change => change.id !== id))}
      />

      {calculationStatus === "failed" && (
        <CctRequestError isRetrying={isRetrying} onRetry={onRetry} />
      )}

      {/* Note: the completion date is engine output. Do not derive it from the programme end date */}
      <div className="nhsuk-inset-text nhsuk-u-margin-top-2">
        <p className="nhsuk-u-margin-bottom-0" data-cy="cct-projected-cct-date">
          Projected Completion of Training Date:{" "}
          <strong>
            {result ? formatCctDate(result.cctDate) : noResultText}
          </strong>
          {!hasChanges && " (no changes added yet)"}
        </p>
      </div>

      {hasChanges && (
        <p className="nhsuk-hint nhsuk-u-margin-top-1">
          The final highlighted row projects from your last change through to
          the Projected Completion of Training Date. The table updates
          automatically when you add, edit or remove changes.
        </p>
      )}

      {isFormOpen ? (
        <CctChangeForm
          key={editingId ?? "new-change"}
          heading={editingChange ? "Edit change" : "Add a change"}
          initialData={mapChangeToFormData(editingChange)}
          submitLabel={editingChange ? "Save change" : "Add change"}
          validationContext={{
            programmeDetails,
            otherChanges: changes.filter(change => change.id !== editingId),
            cctDate
          }}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      ) : (
        <Button
          secondary
          type="button"
          onClick={() => onFormOpenChange(true)}
          data-cy="cct-add-change"
        >
          Add change
        </Button>
      )}
    </Card>
  );
}

function CctInvalidChangesSummary({
  invalidChanges
}: Readonly<{ invalidChanges: CctInvalidChange[] }>) {
  return (
    <ErrorSummary
      aria-labelledby="cct-invalid-changes-title"
      disableAutoFocus
      data-cy="cct-invalid-changes-summary"
    >
      <ErrorSummary.Title id="cct-invalid-changes-title">
        There is a problem with your changes
      </ErrorSummary.Title>
      <ErrorSummary.List>
        {invalidChanges.map(({ change, pointer, message }) => (
          <ErrorSummary.ListItem
            key={`${change.id}-${pointer}`}
            href={`#${editButtonId(change.id)}`}
            onClick={e => {
              e.preventDefault();
              const editButton = document.getElementById(
                editButtonId(change.id)
              );
              editButton?.scrollIntoView({
                behavior: "smooth",
                block: "center"
              });
              editButton?.focus({ preventScroll: true });
            }}
          >
            {`${getCctChangeTypeShortLabel(change.type)} (${formatCctDate(
              change.startDate
            )} - ${
              isOpenLtftChange(change)
                ? "remainder of training"
                : formatCctDate(change.endDate)
            }): ${message}`}
          </ErrorSummary.ListItem>
        ))}
      </ErrorSummary.List>
    </ErrorSummary>
  );
}

type CctChangesTableProps = {
  changes: CctChange[];
  calculatedChanges: CctCalculatedChange[];
  result: CctResult | null;
  invalidChangeIds?: string[];
  isProjectionInvalid?: boolean;
  editingId?: string | null;
  isFormOpen?: boolean;
  onEdit?: (id: string) => void;
  onRemove?: (id: string) => void;
};

type ChangeRow =
  | {
      kind: "change";
      change: CctChange;
      calculated: CctCalculatedChange | null;
    }
  | { kind: "assumed"; period: CctAssumedFullTimePeriod };

const rowStartDate = (row: ChangeRow) =>
  row.kind === "change" ? row.change.startDate : row.period.startDate;

export function CctChangesTable({
  changes,
  calculatedChanges,
  result,
  invalidChangeIds,
  isProjectionInvalid,
  editingId,
  isFormOpen,
  onEdit,
  onRemove
}: Readonly<CctChangesTableProps>) {
  const [hideAssumedPeriods, setHideAssumedPeriods] = useState(false);
  const [scrollEdges, setScrollEdges] = useState({ left: false, right: false });
  const scrollRef = useRef<HTMLDivElement>(null);
  const isReadOnly = !onEdit && !onRemove;

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const updateScrollEdges = () => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const left = container.scrollLeft > 1;
      const right = container.scrollLeft < maxScrollLeft - 1;
      setScrollEdges(prevEdges =>
        prevEdges.left === left && prevEdges.right === right
          ? prevEdges
          : { left, right }
      );
    };

    updateScrollEdges();
    container.addEventListener("scroll", updateScrollEdges, { passive: true });
    window.addEventListener("resize", updateScrollEdges);
    return () => {
      container.removeEventListener("scroll", updateScrollEdges);
      window.removeEventListener("resize", updateScrollEdges);
    };
  }, [changes, result, isReadOnly, hideAssumedPeriods]);

  if (changes.length === 0) return null;

  const projectingChange = findProjectingChange(calculatedChanges);

  const pickedChanges = pickCctCalculatedChanges(
    calculatedChanges,
    changes.length
  );
  const assumedPeriods = result?.assumedFullTimePeriods ?? [];
  const assumedMonths = assumedPeriods.map(({ months }) => ({
    calendarMonths: months,
    wteMonths: months
  }));

  const changeRows: ChangeRow[] = changes.map((change, index) => ({
    kind: "change",
    change,
    calculated: pickedChanges[index]
  }));
  const rows = (
    hideAssumedPeriods
      ? changeRows
      : [
          ...changeRows,
          ...assumedPeriods.map(
            (period): ChangeRow => ({ kind: "assumed", period })
          )
        ]
  ).sort((a, b) => rowStartDate(a).localeCompare(rowStartDate(b)));

  const enteredTotals = sumCctMonths(pickedChanges);
  const allTotals = sumCctMonths([...pickedChanges, ...assumedMonths]);
  const completionTotals = sumCctMonths([
    ...pickedChanges,
    ...assumedMonths,
    result?.projection ?? null
  ]);

  const totalsRow = (
    label: string,
    cypressName: string,
    totals: CctMonthTotals
  ) => (
    <Table.Row className={style.totalRow} data-cy={cypressName}>
      <Table.Cell>
        <strong>{label}</strong>
      </Table.Cell>
      {[1, 2, 3, 4, 5].map(column => (
        <Table.Cell key={column} className={style.emptyCell} />
      ))}
      <Table.Cell>
        <strong>{formatCctMonths(totals.calendarMonths)}</strong>
      </Table.Cell>
      <Table.Cell>
        <strong>{formatCctMonths(totals.wteMonths)}</strong>
      </Table.Cell>
      {!isReadOnly && <Table.Cell className={style.emptyCell} />}
    </Table.Row>
  );

  return (
    <>
      {assumedPeriods.length > 0 && (
        <div className="nhsuk-checkboxes nhsuk-u-margin-bottom-3">
          <div className="nhsuk-checkboxes__item">
            <input
              className="nhsuk-checkboxes__input"
              id="cct-hide-assumed-periods"
              data-cy="cct-hide-assumed-periods"
              type="checkbox"
              checked={hideAssumedPeriods}
              onChange={e => setHideAssumedPeriods(e.target.checked)}
            />
            <label
              className="nhsuk-label nhsuk-checkboxes__label"
              htmlFor="cct-hide-assumed-periods"
            >
              Hide assumed full-time periods
            </label>
          </div>
        </div>
      )}

      {/* Note: the container scrolls the table sideways on a tablet; responsive stacks each row under its column labels below 768px, so no column is out of reach on a phone. */}
      <div
        className={style.tableScrollArea}
        data-cy="cct-changes-scroll-area"
        data-scroll-left={scrollEdges.left}
        data-scroll-right={scrollEdges.right}
      >
        <Table.Container
          ref={scrollRef}
          id="cct-changes-scroll"
          tabIndex={0}
          role="region"
          aria-label="Changes to your training"
          data-cy="cct-changes-scroll"
        >
          <Table
            responsive
            className={style.changesTable}
            data-cy="cct-changes-table"
          >
            <Table.Head>
              <Table.Row>
                <Table.Cell>Type</Table.Cell>
                <Table.Cell className={style.notesHeader}>Notes</Table.Cell>
                <Table.Cell>Start</Table.Cell>
                <Table.Cell>End</Table.Cell>
                <Table.Cell>WTE %</Table.Cell>
                <Table.Cell>Counted as training?</Table.Cell>
                <Table.Cell>Calendar months</Table.Cell>
                <Table.Cell>WTE months</Table.Cell>
                {!isReadOnly && <Table.Cell aria-label="Actions" />}
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {rows.map(row =>
                row.kind === "assumed" ? (
                  <Table.Row
                    key={`assumed-${row.period.startDate}`}
                    className={style.assumedRow}
                    data-cy="cct-assumed-row"
                  >
                    <Table.Cell>Assumed full-time</Table.Cell>
                    <Table.Cell>Not added by you</Table.Cell>
                    <Table.Cell>
                      {formatCctDate(row.period.startDate)}
                    </Table.Cell>
                    <Table.Cell>{formatCctDate(row.period.endDate)}</Table.Cell>
                    <Table.Cell>100%</Table.Cell>
                    <Table.Cell>Yes</Table.Cell>
                    <Table.Cell>
                      {formatCctMonths(row.period.months)}
                    </Table.Cell>
                    <Table.Cell>
                      {formatCctMonths(row.period.months)}
                    </Table.Cell>
                    {!isReadOnly && <Table.Cell>Read only</Table.Cell>}
                  </Table.Row>
                ) : (
                  <CctChangeRow
                    key={row.change.id}
                    change={row.change}
                    calculated={row.calculated}
                    isInvalid={!!invalidChangeIds?.includes(row.change.id)}
                    isReadOnly={isReadOnly}
                    editingId={editingId}
                    isFormOpen={isFormOpen}
                    onEdit={onEdit}
                    onRemove={onRemove}
                  />
                )
              )}

              {hideAssumedPeriods
                ? totalsRow(
                    "Entered changes total",
                    "cct-entered-total-row",
                    enteredTotals
                  )
                : totalsRow("Total", "cct-total-row", allTotals)}
              {hideAssumedPeriods &&
                assumedPeriods.length > 0 &&
                totalsRow(
                  "Including assumed full-time total (hidden)",
                  "cct-assumed-total-row",
                  allTotals
                )}

              {result && (
                <Table.Row
                  className={style.projectionRow}
                  data-cy="cct-projection-row"
                >
                  <Table.Cell>
                    <strong>
                      {projectingChange
                        ? "LTFT projection"
                        : "Full-time projection"}
                    </strong>
                    {isProjectionInvalid && (
                      <>
                        {" "}
                        <Tag modifier="red" data-cy="cct-invalid-projection">
                          Invalid
                        </Tag>
                      </>
                    )}
                  </Table.Cell>
                  <Table.Cell>Projects to completion</Table.Cell>
                  <Table.Cell>
                    {formatCctDate(result.projection.startDate)}
                  </Table.Cell>
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
                  {/* Note: the projection is always derived, so there is nothing to edit here - the only way to alter it is to add, edit or remove a change. */}
                  {!isReadOnly && <Table.Cell>Read only</Table.Cell>}
                </Table.Row>
              )}

              {totalsRow(
                "Total to completion",
                "cct-completion-total-row",
                completionTotals
              )}
            </Table.Body>
          </Table>
        </Table.Container>
      </div>
    </>
  );
}

type CctChangeRowProps = {
  change: CctChange;
  calculated: CctCalculatedChange | null;
  isInvalid: boolean;
  isReadOnly: boolean;
  editingId?: string | null;
  isFormOpen?: boolean;
  onEdit?: (id: string) => void;
  onRemove?: (id: string) => void;
};

function CctChangeRow({
  change,
  calculated,
  isInvalid,
  isReadOnly,
  editingId,
  isFormOpen,
  onEdit,
  onRemove
}: Readonly<CctChangeRowProps>) {
  // Note: an open LTFT change has no end of its own and accrues nothing - the projection row below the table reports both on its behalf.
  const isOpen = isOpenLtftChange(change);

  return (
    <Table.Row data-cy={`cct-change-row-${change.id}`}>
      <Table.Cell>
        {getCctChangeTypeShortLabel(change.type)}
        {isInvalid && (
          <>
            {" "}
            <Tag modifier="red" data-cy={`cct-invalid-change-${change.id}`}>
              Invalid
            </Tag>
          </>
        )}
      </Table.Cell>
      <Table.Cell className={style.notesCell}>
        {change.notes ? (
          <CctNotes
            notes={change.notes}
            rowLabel={`${getCctChangeTypeShortLabel(
              change.type
            )} starting ${formatCctDate(change.startDate)}`}
            toggleCy={`cct-notes-toggle-${change.id}`}
          />
        ) : (
          CCT_NO_VALUE
        )}
      </Table.Cell>
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
      {!isReadOnly && (
        <Table.Cell>
          <div className={style.actions}>
            {onEdit && (
              <Button
                id={editButtonId(change.id)}
                secondary
                small
                type="button"
                disabled={!!isFormOpen && editingId !== change.id}
                onClick={() => onEdit(change.id)}
                data-cy={editButtonId(change.id)}
              >
                Edit
              </Button>
            )}
            {onRemove && (
              <Button
                secondary
                small
                type="button"
                disabled={!!isFormOpen}
                onClick={() => onRemove(change.id)}
                data-cy={`cct-remove-change-${change.id}`}
              >
                Remove
              </Button>
            )}
          </div>
        </Table.Cell>
      )}
    </Table.Row>
  );
}

type CctNotesProps = {
  notes: string;
  rowLabel: string;
  toggleCy: string;
};

function CctNotes({ notes, rowLabel, toggleCy }: Readonly<CctNotesProps>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const previewEnd = findCctNotesPreviewEnd(notes);
  if (previewEnd === null) return <>{notes}</>;

  return (
    <>
      {notes.slice(0, previewEnd)}
      <span className={isExpanded ? undefined : style.collapsedNotes}>
        {notes.slice(previewEnd)}
      </span>
      {!isExpanded && <span aria-hidden="true">…</span>}{" "}
      <button
        type="button"
        className="link-button"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded(prevIsExpanded => !prevIsExpanded)}
        data-cy={toggleCy}
      >
        {isExpanded ? "Hide" : "Show all"}
        <span className="nhsuk-u-visually-hidden"> notes for {rowLabel}</span>
      </button>
    </>
  );
}
