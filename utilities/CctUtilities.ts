import { FormData } from "../components/forms/form-builder/FormBuilder";
import {
  CctAssumedFullTimePeriod,
  CctCalculatedChange,
  CctChange,
  CctChangeDto,
  CctProgrammeDetails,
  CctResult,
  CctSpecialty,
  CctTrainingGrade,
  CctType
} from "../models/CctTypes";
import {
  CCT_CHANGE_TYPE_LABELS,
  CCT_CHANGE_TYPE_SHORT_LABELS,
  CCT_NO_VALUE,
  CCT_NOTES_PREVIEW_LENGTH,
  CCT_OPTIONAL_CREDIT_TYPES,
  CCT_WTE_TYPES
} from "./CctConstants";
import { DateUtilities } from "./DateUtilities";

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toText = (value: unknown) => (typeof value === "string" ? value : "");

const toGrade = (value: unknown) =>
  value ? (value as CctTrainingGrade) : null;

// Note: the trainee enters whole percentages; every stored wte is a fraction of full time.
export const wteFractionFromPercent = (percent: unknown) => {
  const parsed = Number(percent);
  return Number.isFinite(parsed) && parsed > 0 ? parsed / 100 : null;
};

export const wtePercentFromFraction = (wte: number | null | undefined) =>
  wte === null || wte === undefined ? "" : String(Math.round(wte * 100));

export const formatCctWte = (wte: number | null | undefined) =>
  wte === null || wte === undefined
    ? CCT_NO_VALUE
    : `${Math.round(wte * 100)}%`;

export const formatCctDate = (date: string | null | undefined) =>
  date ? DateUtilities.ToLocalDate(date) : CCT_NO_VALUE;

export const formatCctMonths = (months: number | null | undefined) =>
  months === null || months === undefined
    ? CCT_NO_VALUE
    : String(Number(months.toFixed(1)));

export const isCctLengthAdjusted = ({
  additionalMonths,
  acceleratedMonths
}: CctProgrammeDetails) => additionalMonths > 0 || acceleratedMonths > 0;

export const deriveCctAdjustedLengthMonths = ({
  lengthMonths,
  additionalMonths,
  acceleratedMonths
}: CctProgrammeDetails) => lengthMonths + additionalMonths - acceleratedMonths;

export const sortCctChanges = (changes: CctChange[]): CctChange[] =>
  [...changes].sort((a, b) => a.startDate.localeCompare(b.startDate));

export const toCctChangeDtos = (changes: CctChange[]): CctChangeDto[] =>
  changes.map(({ id: _id, ...change }) => ({
    ...change,
    endDate: change.endDate || null
  }));

let lastCctChangeId = 0;
export const newCctChangeId = () => {
  lastCctChangeId += 1;
  return `cct-change-${lastCctChangeId}`;
};

export const fromCctChangeDtos = (
  changes: CctCalculatedChange[]
): CctChange[] =>
  changes.map(
    ({
      calendarMonths: _calendarMonths,
      wteMonths: _wteMonths,
      ...change
    }) => ({
      ...change,
      id: newCctChangeId(),
      endDate: change.endDate ?? ""
    })
  );

export const cctChangeIndexFromPointer = (pointer: string) => {
  const index = /^#\/changes\[(\d+)\]\//.exec(pointer)?.[1];
  return index === undefined ? null : Number(index);
};

export function pickCctCalculatedChanges(
  calculatedChanges: CctCalculatedChange[],
  expectedCount: number
): (CctCalculatedChange | null)[] {
  if (calculatedChanges.length !== expectedCount)
    return new Array<null>(expectedCount).fill(null);
  return calculatedChanges;
}

export type CctMonthTotals = {
  calendarMonths: number | null;
  wteMonths: number | null;
};

export function sumCctMonths(
  periods: (CctMonthTotals | null)[]
): CctMonthTotals {
  const known = periods.filter((period): period is CctMonthTotals => !!period);
  if (known.length === 0) return { calendarMonths: null, wteMonths: null };
  return {
    calendarMonths: known.reduce(
      (sum, period) => sum + (period.calendarMonths ?? 0),
      0
    ),
    wteMonths: known.reduce((sum, period) => sum + (period.wteMonths ?? 0), 0)
  };
}

export type CctChangesTableRow =
  | {
      kind: "change";
      change: CctChange;
      calculated: CctCalculatedChange | null;
    }
  | { kind: "assumed"; period: CctAssumedFullTimePeriod };

const rowStartDate = (row: CctChangesTableRow) =>
  row.kind === "change" ? row.change.startDate : row.period.startDate;

export function deriveCctChangesTable(
  changes: CctChange[],
  calculatedChanges: CctCalculatedChange[],
  result: CctResult | null
) {
  const pickedChanges = pickCctCalculatedChanges(
    calculatedChanges,
    changes.length
  );
  const assumedPeriods = result?.assumedFullTimePeriods ?? [];
  const assumedMonths = assumedPeriods.map(({ months }) => ({
    calendarMonths: months,
    wteMonths: months
  }));

  const rows = [
    ...changes.map(
      (change, index): CctChangesTableRow => ({
        kind: "change",
        change,
        calculated: pickedChanges[index]
      })
    ),
    ...assumedPeriods.map(
      (period): CctChangesTableRow => ({ kind: "assumed", period })
    )
  ].sort((a, b) => rowStartDate(a).localeCompare(rowStartDate(b)));

  return {
    rows,
    enteredTotals: sumCctMonths(pickedChanges),
    allTotals: sumCctMonths([...pickedChanges, ...assumedMonths]),
    completionTotals: sumCctMonths([
      ...pickedChanges,
      ...assumedMonths,
      result?.projection ?? null
    ])
  };
}

export const getCctChangeTypeLabel = (type: CctType) =>
  CCT_CHANGE_TYPE_LABELS[type] ?? type;

export const getCctChangeTypeShortLabel = (type: CctType) =>
  CCT_CHANGE_TYPE_SHORT_LABELS[type] ?? type;

export function mapFormDataToProgrammeDetails(
  formData: FormData
): CctProgrammeDetails {
  return {
    specialty: toText(formData.specialty),
    startDate: toText(formData.startDate),
    lengthMonths: toNumber(formData.lengthMonths),
    startGrade: formData.startGrade as CctTrainingGrade,
    startGradeOverrideNotes: toText(formData.startGradeOverrideNotes),
    additionalMonths: toNumber(formData.additionalMonths),
    additionalMonthsNotes: toText(formData.additionalMonthsNotes),
    acceleratedMonths: toNumber(formData.acceleratedMonths),
    acceleratedMonthsNotes: toText(formData.acceleratedMonthsNotes),
    eighteenMonthFinalGrade: toGrade(formData.eighteenMonthFinalGrade),
    eighteenMonthFinalGradeNotes: toText(formData.eighteenMonthFinalGradeNotes),
    skippedGrade: toGrade(formData.skippedGrade),
    skippedGradeNotes: toText(formData.skippedGradeNotes)
  };
}

export const findCctSpecialty = (
  specialties: CctSpecialty[],
  name: string | null | undefined
) => specialties.find(specialty => specialty.name === name);

export const isCctStartGradeOverridden = (
  specialty: CctSpecialty | undefined,
  startGrade: string | null | undefined
) => !!specialty && !!startGrade && startGrade !== specialty.entryGrade;

export function mapProgrammeDetailsToFormData(
  programmeDetails: CctProgrammeDetails | null,
  specialties: CctSpecialty[]
): FormData {
  if (!programmeDetails) return {};
  const specialtyDefault = findCctSpecialty(
    specialties,
    programmeDetails.specialty
  );
  return {
    ...programmeDetails,
    lengthMonths: String(programmeDetails.lengthMonths),
    additionalMonths: programmeDetails.additionalMonths
      ? String(programmeDetails.additionalMonths)
      : null,
    acceleratedMonths: programmeDetails.acceleratedMonths
      ? String(programmeDetails.acceleratedMonths)
      : null,
    startGradeOverridden: isCctStartGradeOverridden(
      specialtyDefault,
      programmeDetails.startGrade
    ),
    hasAdditionalTraining: programmeDetails.additionalMonths > 0,
    hasAcceleratedTraining: programmeDetails.acceleratedMonths > 0,
    hasEighteenMonthFinalYear: !!programmeDetails.eighteenMonthFinalGrade,
    hasSkippedGrade: !!programmeDetails.skippedGrade
  };
}

export function mapFormDataToChange(formData: FormData, id: string): CctChange {
  const type = formData.type as CctType;
  return {
    id,
    type,
    startDate: toText(formData.startDate),
    endDate: toText(formData.endDate),
    wte: CCT_WTE_TYPES.includes(type)
      ? wteFractionFromPercent(formData.wtePercent)
      : null,
    countsTowardsCompletion: CCT_OPTIONAL_CREDIT_TYPES.includes(type)
      ? !!formData.countsTowardsCompletion
      : type === "LTFT",
    notes: toText(formData.notes).trim()
  };
}

export const isCctWteShown = (
  type: unknown,
  countsTowardsCompletion: unknown
) => type === "LTFT" || (type === "OOPR" && !!countsTowardsCompletion);

export function findCctNotesPreviewEnd(notes: string): number | null {
  if (notes.length <= CCT_NOTES_PREVIEW_LENGTH) return null;
  const lastSpace = notes.lastIndexOf(" ", CCT_NOTES_PREVIEW_LENGTH);
  return lastSpace > 0 ? lastSpace : CCT_NOTES_PREVIEW_LENGTH;
}

export function mapChangeToFormData(change: CctChange | null): FormData {
  if (!change) return { showEndDate: true };
  const isOpen = isOpenLtftChange(change);
  return {
    ...change,
    ltftDuration: change.type === "LTFT" && isOpen ? "REMAINDER" : "END_DATE",
    showEndDate: !isOpen,
    showWte: isCctWteShown(change.type, change.countsTowardsCompletion),
    wtePercent: wtePercentFromFraction(change.wte)
  };
}

// Note: an LTFT change the trainee marks as lasting for the rest of their training is stored with no end date, which is what makes it the one that projects.
export const isOpenLtftChange = (change: CctChangeDto) =>
  change.type === "LTFT" && !change.endDate;

export const findProjectingChange = <T extends CctChangeDto>(changes: T[]) =>
  changes.find(isOpenLtftChange) ?? null;
