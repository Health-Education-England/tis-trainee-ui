import day from "dayjs";
import { FormData } from "../components/forms/form-builder/FormBuilder";
import {
  CctChange,
  CctChangeDto,
  CctPeriod,
  CctPeriodKind,
  CctProgrammeDetails,
  CctProjection,
  CctResult,
  CctTrainingGrade,
  CctType
} from "../models/CctTypes";
import {
  CCT_CHANGE_TYPE_LABELS,
  CCT_CHANGE_TYPE_SHORT_LABELS,
  CCT_NO_VALUE,
  CCT_NOTES_PREVIEW_LENGTH,
  CCT_OPTIONAL_CREDIT_TYPES,
  CCT_WTE_TYPES,
  findCctSpecialty
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
  changes.map(({ id: _id, ...change }) => change);

export function pickCctPeriods(
  result: CctResult | null,
  kind: CctPeriodKind,
  expectedCount: number
): (CctPeriod | null)[] {
  const matched = result?.periods?.filter(period => period.kind === kind) ?? [];
  if (matched.length !== expectedCount)
    return Array(expectedCount).fill(null) as null[];
  return matched;
}

export const findCctProjectionPeriod = (result: CctResult | null) =>
  result?.periods?.find(period => period.kind === "PROJECTION") ?? null;

export type CctMonthTotals = {
  calendarMonths: number | null;
  wteMonths: number | null;
};

export function sumCctMonths(periods: (CctPeriod | null)[]): CctMonthTotals {
  const known = periods.filter((period): period is CctPeriod => !!period);
  if (known.length === 0) return { calendarMonths: null, wteMonths: null };
  return {
    calendarMonths: known.reduce(
      (sum, period) => sum + (period.calendarMonths ?? 0),
      0
    ),
    wteMonths: known.reduce((sum, period) => sum + (period.wteMonths ?? 0), 0)
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

export function mapProgrammeDetailsToFormData(
  programmeDetails: CctProgrammeDetails | null
): FormData {
  if (!programmeDetails) return {};
  const specialtyDefault = findCctSpecialty(programmeDetails.specialty);
  return {
    ...programmeDetails,
    lengthMonths: String(programmeDetails.lengthMonths),
    additionalMonths: programmeDetails.additionalMonths
      ? String(programmeDetails.additionalMonths)
      : null,
    acceleratedMonths: programmeDetails.acceleratedMonths
      ? String(programmeDetails.acceleratedMonths)
      : null,
    startGradeOverridden:
      !!specialtyDefault &&
      programmeDetails.startGrade !== specialtyDefault.entryGrade,
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

export const findProjectingChange = (changes: CctChange[]) =>
  changes.find(isOpenLtftChange) ?? null;

const datedChanges = <T extends CctChangeDto>(changes: T[]) =>
  changes.filter(change => !isOpenLtftChange(change));

// Note: mirrors the POC's deriveQuickProjection - an open LTFT change projects at its own WTE, otherwise the projection is full time from the day after the last change ends.
export function deriveCctProjection(
  programmeDetails: CctProgrammeDetails | null,
  changes: CctChange[]
): CctProjection | null {
  if (!programmeDetails) return null;

  const projectingChange = findProjectingChange(changes);
  if (projectingChange)
    return {
      startDate: projectingChange.startDate,
      wte: projectingChange.wte ?? 1
    };

  const latestEnd = datedChanges(changes).reduce(
    (latest, change) =>
      change.endDate && (!latest || day(change.endDate).isAfter(day(latest)))
        ? change.endDate
        : latest,
    ""
  );
  return {
    startDate: latestEnd
      ? day(latestEnd).add(1, "day").format("YYYY-MM-DD")
      : programmeDetails.startDate,
    wte: 1
  };
}

export type CctAssumedPeriod = {
  id: string;
  startDate: string;
  endDate: string;
};

const makeAssumedPeriod = (
  start: day.Dayjs,
  end: day.Dayjs
): CctAssumedPeriod => ({
  id: `assumed-${start.format("YYYY-MM-DD")}-${end.format("YYYY-MM-DD")}`,
  startDate: start.format("YYYY-MM-DD"),
  endDate: end.format("YYYY-MM-DD")
});

const assumedGapBefore = (
  cursor: day.Dayjs,
  changeStart: day.Dayjs,
  projectionStart: day.Dayjs
): CctAssumedPeriod | null => {
  if (!changeStart.isAfter(cursor)) return null;
  const dayBeforeChange = changeStart.subtract(1, "day");
  const gapEnd = dayBeforeChange.isBefore(projectionStart)
    ? dayBeforeChange
    : projectionStart.subtract(1, "day");
  return gapEnd.isBefore(cursor) ? null : makeAssumedPeriod(cursor, gapEnd);
};

// Note: ported from the POC's inferredFullTimePeriods - every stretch between the programme start and the projection that no change covers is full time by default.
export function deriveCctAssumedPeriods(
  programmeDetails: CctProgrammeDetails | null,
  changes: CctChangeDto[],
  projectionStartDate: string | undefined
): CctAssumedPeriod[] {
  if (!programmeDetails || !projectionStartDate) return [];

  const projectionStart = day(projectionStartDate);
  const sorted = [...datedChanges(changes)].sort(
    (a, b) => day(a.startDate).valueOf() - day(b.startDate).valueOf()
  );
  const periods: CctAssumedPeriod[] = [];
  let cursor = day(programmeDetails.startDate);

  for (const change of sorted) {
    if (!cursor.isBefore(projectionStart)) break;

    const gap = assumedGapBefore(
      cursor,
      day(change.startDate),
      projectionStart
    );
    if (gap) periods.push(gap);

    const dayAfterChange = day(change.endDate).add(1, "day");
    if (dayAfterChange.isAfter(cursor)) cursor = dayAfterChange;
  }

  const finalGapEnd = projectionStart.subtract(1, "day");
  if (cursor.isBefore(projectionStart) && !finalGapEnd.isBefore(cursor))
    periods.push(makeAssumedPeriod(cursor, finalGapEnd));

  return periods;
}
