import { useState } from "react";
import { Button, Card, Table } from "nhsuk-react-components";
import { FormData } from "../form-builder/FormBuilder";
import {
  CctChange,
  CctProgrammeDetails,
  CctProjection
} from "../../../models/CctTypes";
import {
  CCT_NOT_APPLICABLE,
  CCT_NOT_CALCULATED,
  CCT_NO_VALUE
} from "../../../utilities/CctConstants";
import {
  CctAssumedPeriod,
  deriveCctAssumedPeriods,
  findProjectingChange,
  formatCctDate,
  formatCctWte,
  getCctChangeTypeShortLabel,
  isOpenLtftChange,
  mapChangeToFormData,
  mapFormDataToChange
} from "../../../utilities/CctUtilities";
import { CctChangeForm } from "./CctChangeForm";
import style from "./CctChanges.module.scss";

type CctChangesSectionProps = {
  programmeDetails: CctProgrammeDetails | null;
  changes: CctChange[];
  projection: CctProjection | null;
  onChange: (changes: CctChange[]) => void;
};

const newChangeId = () =>
  `cct-change-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function CctChangesSection({
  programmeDetails,
  changes,
  projection,
  onChange
}: Readonly<CctChangesSectionProps>) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const editingChange = changes.find(change => change.id === editingId) ?? null;
  const hasChanges = changes.length > 0;

  const closeForm = () => {
    setEditingId(null);
    setIsFormOpen(false);
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

      <CctChangesTable
        programmeDetails={programmeDetails}
        changes={changes}
        projection={projection}
        editingId={editingId}
        isFormOpen={isFormOpen}
        onEdit={id => {
          setEditingId(id);
          setIsFormOpen(true);
        }}
        onRemove={id => onChange(changes.filter(change => change.id !== id))}
      />

      {/* Note: the completion date is engine output. Do not derive it from the programme end date - the two disagree by a day for about half of programme lengths (round vs floor of months x 30.4). */}
      <div className="nhsuk-inset-text nhsuk-u-margin-top-2">
        <p className="nhsuk-u-margin-bottom-0" data-cy="cct-projected-cct-date">
          Projected Completion of Training Date:{" "}
          <strong>{CCT_NOT_CALCULATED}</strong>
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
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      ) : (
        <Button
          secondary
          type="button"
          onClick={() => setIsFormOpen(true)}
          data-cy="cct-add-change"
        >
          Add change
        </Button>
      )}
    </Card>
  );
}

type CctChangesTableProps = {
  programmeDetails: CctProgrammeDetails | null;
  changes: CctChange[];
  projection: CctProjection | null;
  editingId?: string | null;
  isFormOpen?: boolean;
  onEdit?: (id: string) => void;
  onRemove?: (id: string) => void;
};

type ChangeRow =
  | { kind: "change"; change: CctChange }
  | { kind: "assumed"; period: CctAssumedPeriod };

const rowStartDate = (row: ChangeRow) =>
  row.kind === "change" ? row.change.startDate : row.period.startDate;

export function CctChangesTable({
  programmeDetails,
  changes,
  projection,
  editingId,
  isFormOpen,
  onEdit,
  onRemove
}: Readonly<CctChangesTableProps>) {
  const [hideAssumedPeriods, setHideAssumedPeriods] = useState(false);
  const isReadOnly = !onEdit && !onRemove;

  if (changes.length === 0) return null;

  const assumedPeriods = deriveCctAssumedPeriods(
    programmeDetails,
    changes,
    projection?.startDate
  );
  const projectingChange = findProjectingChange(changes);

  const changeRows: ChangeRow[] = changes.map(change => ({
    kind: "change",
    change
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

  const totalsRow = (label: string, cypressName: string) => (
    <Table.Row className={style.totalRow} data-cy={cypressName}>
      <Table.Cell>
        <strong>{label}</strong>
      </Table.Cell>
      {[1, 2, 3, 4, 5].map(column => (
        <Table.Cell key={column} className={style.emptyCell} />
      ))}
      {/* Note: both month totals are engine output, so they stay blank until the calculate endpoint is wired up. */}
      <Table.Cell>
        <strong>{CCT_NO_VALUE}</strong>
      </Table.Cell>
      <Table.Cell>
        <strong>{CCT_NO_VALUE}</strong>
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
      <Table.Container>
        <Table
          responsive
          className={style.changesTable}
          data-cy="cct-changes-table"
        >
          <Table.Head>
            <Table.Row>
              <Table.Cell>Type</Table.Cell>
              <Table.Cell>Notes</Table.Cell>
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
                  key={row.period.id}
                  className={style.assumedRow}
                  data-cy="cct-assumed-row"
                >
                  <Table.Cell>Assumed full-time</Table.Cell>
                  <Table.Cell>Not added by you</Table.Cell>
                  <Table.Cell>{formatCctDate(row.period.startDate)}</Table.Cell>
                  <Table.Cell>{formatCctDate(row.period.endDate)}</Table.Cell>
                  <Table.Cell>100%</Table.Cell>
                  <Table.Cell>Yes</Table.Cell>
                  <Table.Cell>{CCT_NO_VALUE}</Table.Cell>
                  <Table.Cell>{CCT_NO_VALUE}</Table.Cell>
                  {!isReadOnly && <Table.Cell>Read only</Table.Cell>}
                </Table.Row>
              ) : (
                <CctChangeRow
                  key={row.change.id}
                  change={row.change}
                  isReadOnly={isReadOnly}
                  editingId={editingId}
                  isFormOpen={isFormOpen}
                  onEdit={onEdit}
                  onRemove={onRemove}
                />
              )
            )}

            {hideAssumedPeriods
              ? totalsRow("Entered changes total", "cct-entered-total-row")
              : totalsRow("Total", "cct-total-row")}
            {hideAssumedPeriods &&
              assumedPeriods.length > 0 &&
              totalsRow(
                "Including assumed full-time total (hidden)",
                "cct-assumed-total-row"
              )}

            {projection && (
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
                </Table.Cell>
                <Table.Cell>Projects to completion</Table.Cell>
                <Table.Cell>{formatCctDate(projection.startDate)}</Table.Cell>
                {/* Note: this is where the projected CCT date lands; it is engine output, so for now only the inset below the table spells out that it is not calculated yet. */}
                <Table.Cell>
                  <strong>{CCT_NO_VALUE}</strong>
                </Table.Cell>
                <Table.Cell>{formatCctWte(projection.wte)}</Table.Cell>
                <Table.Cell>Yes</Table.Cell>
                <Table.Cell>{CCT_NO_VALUE}</Table.Cell>
                <Table.Cell>{CCT_NO_VALUE}</Table.Cell>
                {/* Note: the projection is always derived, so there is nothing to edit here - the only way to alter it is to add, edit or remove a change. */}
                {!isReadOnly && <Table.Cell>Read only</Table.Cell>}
              </Table.Row>
            )}

            {totalsRow("Total to completion", "cct-completion-total-row")}
          </Table.Body>
        </Table>
      </Table.Container>
    </>
  );
}

type CctChangeRowProps = {
  change: CctChange;
  isReadOnly: boolean;
  editingId?: string | null;
  isFormOpen?: boolean;
  onEdit?: (id: string) => void;
  onRemove?: (id: string) => void;
};

function CctChangeRow({
  change,
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
      <Table.Cell>{getCctChangeTypeShortLabel(change.type)}</Table.Cell>
      <Table.Cell>{change.notes || CCT_NO_VALUE}</Table.Cell>
      <Table.Cell>{formatCctDate(change.startDate)}</Table.Cell>
      <Table.Cell>
        {isOpen ? "For remainder of training" : formatCctDate(change.endDate)}
      </Table.Cell>
      <Table.Cell>{formatCctWte(change.wte)}</Table.Cell>
      <Table.Cell>{change.countsTowardsCompletion ? "Yes" : "No"}</Table.Cell>
      <Table.Cell>{isOpen ? CCT_NOT_APPLICABLE : CCT_NO_VALUE}</Table.Cell>
      <Table.Cell>{isOpen ? CCT_NOT_APPLICABLE : CCT_NO_VALUE}</Table.Cell>
      {!isReadOnly && (
        <Table.Cell>
          <div className={style.actions}>
            {onEdit && (
              <Button
                secondary
                small
                type="button"
                disabled={!!isFormOpen && editingId !== change.id}
                onClick={() => onEdit(change.id)}
                data-cy={`cct-edit-change-${change.id}`}
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
