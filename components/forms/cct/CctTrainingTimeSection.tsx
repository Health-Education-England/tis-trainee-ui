import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Button, Card, SummaryList, Table } from "nhsuk-react-components";
import { FormData } from "../form-builder/FormBuilder";
import {
  CctProgrammeDetails,
  CctResult,
  CctTrainingTime
} from "../../../models/CctTypes";
import {
  CCT_MAX_TRAINING_TIME_ENTRIES,
  CCT_NO_VALUE,
  CCT_NOT_CALCULATED
} from "../../../utilities/CctConstants";
import {
  deriveCctAdjustedLengthMonths,
  formatCctDate,
  isCctLengthAdjusted,
  mapFormDataToTrainingTime,
  mapTrainingTimeToFormData,
  sumCctTrainingTime
} from "../../../utilities/CctUtilities";
import { CctCalculationStatus } from "../../../utilities/hooks/useCctCalculation";
import { ActionModal } from "../../common/ActionModal";
import { CctNotes } from "./CctChangesSection";
import { CctTrainingTimeForm } from "./CctTrainingTimeForm";
import {
  CCT_TRAINING_TIME_KINDS,
  CctTrainingTimeKind
} from "./cctTrainingTimeKinds";

const addButtonId = (kind: CctTrainingTimeKind) => `cct-add-${kind.label}-time`;

const editButtonId = (kind: CctTrainingTimeKind, index: number) =>
  `cct-${kind.label}-time-${index}-edit`;

type CctTrainingTimeEditing = {
  kind: CctTrainingTimeKind;
  index: number | null;
};

type CctTrainingTimeSectionProps = {
  programmeDetails: CctProgrammeDetails;
  result: CctResult | null;
  calculationStatus: CctCalculationStatus;
  isFormOpen: boolean;
  onChange: (programmeDetails: CctProgrammeDetails) => void;
  onFormOpenChange: (isFormOpen: boolean) => void;
  onDirtyChange: (isDirty: boolean) => void;
};

export function CctTrainingTimeSection({
  programmeDetails,
  result,
  calculationStatus,
  isFormOpen,
  onChange,
  onFormOpenChange,
  onDirtyChange
}: Readonly<CctTrainingTimeSectionProps>) {
  const [editing, setEditing] = useState<CctTrainingTimeEditing | null>(null);

  const openForm = (kind: CctTrainingTimeKind, index: number | null) => {
    setEditing({ kind, index });
    onFormOpenChange(true);
  };

  const closeForm = (focusIds: string[]) => {
    flushSync(() => {
      setEditing(null);
      onFormOpenChange(false);
    });
    focusIds
      .map(id => document.getElementById(id))
      .find(element => element !== null)
      ?.focus();
  };

  const handleCancel = (kind: CctTrainingTimeKind, index: number | null) =>
    closeForm([index === null ? addButtonId(kind) : editButtonId(kind, index)]);

  const handleSubmit = (formData: FormData) => {
    if (!editing) return;
    const { kind, index } = editing;
    const entries = programmeDetails[kind.field];
    const entry = mapFormDataToTrainingTime(formData);
    onChange({
      ...programmeDetails,
      [kind.field]:
        index === null
          ? [...entries, entry]
          : entries.map((existing, i) => (i === index ? entry : existing))
    });
    closeForm(
      index === null
        ? [addButtonId(kind), editButtonId(kind, entries.length)]
        : [editButtonId(kind, index)]
    );
  };

  const handleRemove = (kind: CctTrainingTimeKind, index: number) =>
    onChange({
      ...programmeDetails,
      [kind.field]: programmeDetails[kind.field].filter((_, i) => i !== index)
    });

  return (
    <Card feature data-cy="cct-training-time-section">
      <Card.Heading>Training time adjustments</Card.Heading>
      {CCT_TRAINING_TIME_KINDS.map(kind => {
        const entries = programmeDetails[kind.field];
        const editingIndex = editing?.kind === kind ? editing.index : null;
        return (
          <div key={kind.label} data-cy={`cct-${kind.label}-time`}>
            <h3 className="nhsuk-heading-s">{kind.title}</h3>
            <p>{kind.intro}</p>
            <CctTrainingTimeTable
              kind={kind}
              entries={entries}
              editingIndex={editingIndex}
              isFormOpen={isFormOpen}
              onEdit={index => openForm(kind, index)}
              onRemove={index => handleRemove(kind, index)}
            />
            {editing?.kind === kind ? (
              <CctTrainingTimeForm
                key={editingIndex ?? "new"}
                kind={kind}
                programmeDetails={programmeDetails}
                otherEntries={entries.filter((_, i) => i !== editingIndex)}
                initialData={mapTrainingTimeToFormData(
                  editingIndex === null ? null : entries[editingIndex]
                )}
                isEditing={editingIndex !== null}
                onSubmit={handleSubmit}
                onCancel={() => handleCancel(kind, editingIndex)}
                onDirtyChange={onDirtyChange}
              />
            ) : (
              <CctAddTrainingTimeControl
                kind={kind}
                entryCount={entries.length}
                isFormOpen={isFormOpen}
                onAdd={() => openForm(kind, null)}
              />
            )}
          </div>
        );
      })}
      <CctAdjustedLengthSummary
        programmeDetails={programmeDetails}
        result={result}
        calculationStatus={calculationStatus}
        headingLevel="h3"
      />
    </Card>
  );
}

type CctAddTrainingTimeControlProps = {
  kind: CctTrainingTimeKind;
  entryCount: number;
  isFormOpen: boolean;
  onAdd: () => void;
};

function CctAddTrainingTimeControl({
  kind,
  entryCount,
  isFormOpen,
  onAdd
}: Readonly<CctAddTrainingTimeControlProps>) {
  if (entryCount >= CCT_MAX_TRAINING_TIME_ENTRIES)
    return (
      <div className="nhsuk-inset-text" data-cy={`cct-max-${kind.label}-time`}>
        <p>
          {`You have reached the maximum of ${CCT_MAX_TRAINING_TIME_ENTRIES} ${kind.label} training time entries. Edit or remove an entry to make room for another.`}
        </p>
      </div>
    );

  return (
    <Button
      id={addButtonId(kind)}
      secondary
      type="button"
      disabled={isFormOpen}
      onClick={onAdd}
      data-cy={addButtonId(kind)}
    >
      {`Add ${kind.label} training time`}
    </Button>
  );
}

type HeadingLevel = "h3" | "h4";

type CctTrainingTimeSummaryProps = {
  programmeDetails: CctProgrammeDetails;
  result: CctResult | null;
  calculationStatus: CctCalculationStatus;
  headingLevel: HeadingLevel;
  isPrint?: boolean;
};

export function CctTrainingTimeSummary({
  programmeDetails,
  result,
  calculationStatus,
  headingLevel: Heading,
  isPrint
}: Readonly<CctTrainingTimeSummaryProps>) {
  return (
    <div data-cy="cct-training-time-summary">
      {CCT_TRAINING_TIME_KINDS.map(kind => (
        <div key={kind.label}>
          <Heading className="nhsuk-heading-s">{kind.title}</Heading>
          <CctTrainingTimeTable
            kind={kind}
            entries={programmeDetails[kind.field]}
            isPrint={isPrint}
          />
        </div>
      ))}
      <CctAdjustedLengthSummary
        programmeDetails={programmeDetails}
        result={result}
        calculationStatus={calculationStatus}
        headingLevel={Heading}
      />
    </div>
  );
}

type CctTrainingTimeTableProps = {
  kind: CctTrainingTimeKind;
  entries: CctTrainingTime[];
  isPrint?: boolean;
  editingIndex?: number | null;
  isFormOpen?: boolean;
  onEdit?: (index: number) => void;
  onRemove?: (index: number) => void;
};

function CctTrainingTimeTable({
  kind,
  entries,
  isPrint,
  editingIndex,
  isFormOpen,
  onEdit,
  onRemove
}: Readonly<CctTrainingTimeTableProps>) {
  if (entries.length === 0)
    return (
      <p className="nhsuk-hint" data-cy={`cct-no-${kind.label}-time`}>
        {`No ${kind.label} training time recorded.`}
      </p>
    );

  const hasActions = !!onEdit && !!onRemove;

  return (
    <Table responsive={!isPrint} data-cy={`cct-${kind.label}-time-table`}>
      <Table.Head>
        <Table.Row>
          <Table.Cell>Grade</Table.Cell>
          <Table.Cell>{kind.timeHeading}</Table.Cell>
          <Table.Cell>Reason</Table.Cell>
          {hasActions && <Table.Cell aria-label="Actions" />}
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {entries.map((entry, index) => (
          <CctTrainingTimeRow
            key={index}
            kind={kind}
            entry={entry}
            index={index}
            isFormOpen={isFormOpen}
            isEditing={editingIndex === index}
            onEdit={onEdit}
            onRemove={onRemove}
          />
        ))}
        <Table.Row data-cy={`cct-${kind.label}-time-total-row`}>
          <Table.Cell>
            <strong>Total</strong>
          </Table.Cell>
          <Table.Cell>
            <strong>{`${sumCctTrainingTime(entries)} months`}</strong>
          </Table.Cell>
          <Table.Cell />
          {hasActions && <Table.Cell />}
        </Table.Row>
      </Table.Body>
    </Table>
  );
}

type CctTrainingTimeRowProps = {
  kind: CctTrainingTimeKind;
  entry: CctTrainingTime;
  index: number;
  isFormOpen?: boolean;
  isEditing: boolean;
  onEdit?: (index: number) => void;
  onRemove?: (index: number) => void;
};

function CctTrainingTimeRow({
  kind,
  entry,
  index,
  isFormOpen,
  isEditing,
  onEdit,
  onRemove
}: Readonly<CctTrainingTimeRowProps>) {
  const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);
  const removeButtonRef = useRef<HTMLButtonElement>(null);
  const rowLabel = `${entry.grade} ${kind.label} training time`;
  const rowCy = `cct-${kind.label}-time-${index}`;

  return (
    <Table.Row data-cy={`${rowCy}-row`}>
      <Table.Cell>{entry.grade}</Table.Cell>
      <Table.Cell>{`${entry.months} months`}</Table.Cell>
      <Table.Cell>
        <CctNotes
          notes={entry.notes}
          rowLabel={rowLabel}
          toggleCy={`${rowCy}-notes-toggle`}
        />
      </Table.Cell>
      {onEdit && onRemove && (
        <Table.Cell>
          <div className="nhsuk-button-group">
            <Button
              id={editButtonId(kind, index)}
              secondary
              small
              type="button"
              disabled={!!isFormOpen && !isEditing}
              onClick={() => onEdit(index)}
              data-cy={editButtonId(kind, index)}
            >
              Edit
            </Button>
            <Button
              ref={removeButtonRef}
              warning
              small
              type="button"
              disabled={!!isFormOpen}
              onClick={() => setIsConfirmingRemove(true)}
              data-cy={`${rowCy}-remove`}
            >
              Remove
            </Button>
          </div>
          {isConfirmingRemove && (
            <ActionModal
              onSubmit={() => {
                setIsConfirmingRemove(false);
                onRemove(index);
              }}
              isOpen={isConfirmingRemove}
              onClose={() => {
                flushSync(() => setIsConfirmingRemove(false));
                removeButtonRef.current?.focus();
              }}
              cancelBtnText="Cancel"
              warningLabel="Remove"
              warningText={`Are you sure you want to remove the ${entry.months} months of ${rowLabel}? You cannot undo this.`}
              submittingBtnText="Removing"
              isSubmitting={false}
            />
          )}
        </Table.Cell>
      )}
    </Table.Row>
  );
}

type CctAdjustedLengthSummaryProps = {
  programmeDetails: CctProgrammeDetails;
  result: CctResult | null;
  calculationStatus: CctCalculationStatus;
  headingLevel: HeadingLevel;
};

function CctAdjustedLengthSummary({
  programmeDetails,
  result,
  calculationStatus,
  headingLevel: Heading
}: Readonly<CctAdjustedLengthSummaryProps>) {
  if (!isCctLengthAdjusted(programmeDetails)) return null;
  const additionalMonths = sumCctTrainingTime(
    programmeDetails.additionalTrainingTime
  );
  const acceleratedMonths = sumCctTrainingTime(
    programmeDetails.acceleratedTrainingTime
  );
  const noResultText =
    calculationStatus === "failed" ? CCT_NO_VALUE : CCT_NOT_CALCULATED;

  return (
    <>
      <Heading className="nhsuk-heading-s">Adjusted programme length</Heading>
      <SummaryList data-cy="cct-adjusted-length">
        <SummaryList.Row>
          <SummaryList.Key>Initial programme length</SummaryList.Key>
          <SummaryList.Value>{`${programmeDetails.lengthMonths} months`}</SummaryList.Value>
        </SummaryList.Row>
        {additionalMonths > 0 && (
          <SummaryList.Row>
            <SummaryList.Key>Additional training time</SummaryList.Key>
            <SummaryList.Value>{`+${additionalMonths} months`}</SummaryList.Value>
          </SummaryList.Row>
        )}
        {acceleratedMonths > 0 && (
          <SummaryList.Row>
            <SummaryList.Key>Accelerated training time</SummaryList.Key>
            <SummaryList.Value>{`-${acceleratedMonths} months`}</SummaryList.Value>
          </SummaryList.Row>
        )}
        <SummaryList.Row>
          <SummaryList.Key>Adjusted programme length</SummaryList.Key>
          <SummaryList.Value data-cy="cct-adjusted-length-months">
            {`${deriveCctAdjustedLengthMonths(programmeDetails)} months`}
          </SummaryList.Value>
        </SummaryList.Row>
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
      </SummaryList>
    </>
  );
}
