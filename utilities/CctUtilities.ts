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
  CctTrainingTime,
  CctType
} from "../models/CctTypes";
import {
  CCT_CHANGE_TYPE_LABELS,
  CCT_CHANGE_TYPE_SHORT_LABELS,
  CCT_NO_VALUE,
  CCT_NOTES_PREVIEW_LENGTH,
  CCT_OPTIONAL_CREDIT_TYPES,
  CCT_TRAINING_GRADES,
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

const toTrainingTime = (value: unknown) =>
  Array.isArray(value) ? (value as CctTrainingTime[]) : [];

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

export const sumCctTrainingTime = (entries: CctTrainingTime[]) =>
  entries.reduce((sum, entry) => sum + entry.months, 0);

export const isCctLengthAdjusted = ({
  additionalTrainingTime,
  acceleratedTrainingTime
}: CctProgrammeDetails) =>
  additionalTrainingTime.length > 0 || acceleratedTrainingTime.length > 0;

export const deriveCctAdjustedLengthMonths = ({
  lengthMonths,
  additionalTrainingTime,
  acceleratedTrainingTime
}: CctProgrammeDetails) =>
  lengthMonths +
  sumCctTrainingTime(additionalTrainingTime) -
  sumCctTrainingTime(acceleratedTrainingTime);

export const findCctTrainingTimeGrades = (startGrade: CctTrainingGrade) => {
  const gradeKind = (grade: string) => grade.replace(/\d/g, "");
  const sameKindGrades = CCT_TRAINING_GRADES.filter(
    grade => gradeKind(grade) === gradeKind(startGrade)
  );
  return sameKindGrades.slice(sameKindGrades.indexOf(startGrade));
};

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
  const index = /^#\/changes\/(\d+)\//.exec(pointer)?.[1];
  return index === undefined ? null : Number(index);
};

export type CctProgrammeDetailsErrorTarget = {
  field: string;
  index: number | null;
  property: string | null;
};

export type CctInvalidAdjustment = CctProgrammeDetailsErrorTarget & {
  pointer: string;
  message: string;
};

export const cctProgrammeDetailsErrorTarget = (
  pointer: string
): CctProgrammeDetailsErrorTarget | null => {
  const match = /^#\/programmeDetails\/(\w+)(?:\/(\d+))?(?:\/(\w+))?$/.exec(
    pointer
  );
  if (!match) return null;
  return {
    field: match[1],
    index: match[2] === undefined ? null : Number(match[2]),
    property: match[3] ?? null
  };
};

export const findCctProgressionGrades = (
  startGrade: CctTrainingGrade,
  result: CctResult | null
) =>
  result && result.gradeProgression.length > 0
    ? CCT_TRAINING_GRADES.filter(grade =>
        result.gradeProgression.some(year => year.grade === grade)
      )
    : findCctTrainingTimeGrades(startGrade);

export const findCctEighteenMonthFinalGrade = (
  startGrade: CctTrainingGrade,
  lengthMonths: number,
  skippedGrade: string | null | undefined
) => {
  const fullYears = Math.floor(lengthMonths / 12);
  if (lengthMonths % 12 !== 6 || fullYears < 1) return null;
  const numbered = /^([A-Z]+)(\d+)$/.exec(startGrade);
  if (!numbered) return fullYears === 1 ? startGrade : null;
  const grades = Array.from(
    { length: fullYears + 1 },
    (_, years) => `${numbered[1]}${Number(numbered[2]) + years}`
  );
  const isSkipped = grades.slice(0, fullYears).includes(skippedGrade ?? "");
  const grade = grades[isSkipped ? fullYears : fullYears - 1];
  return CCT_TRAINING_GRADES.find(known => known === grade) ?? null;
};

export const toCctGradeOptions = (
  grades: CctTrainingGrade[],
  ...currentGrades: (string | null | undefined)[]
) =>
  CCT_TRAINING_GRADES.filter(
    grade => grades.includes(grade) || currentGrades.includes(grade)
  ).map(grade => ({ value: grade, label: grade }));

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
    allTotals: {
      calendarMonths: result?.totalCalendarMonthsCompleted ?? null,
      wteMonths: result?.totalWteMonthsCompleted ?? null
    },
    completionTotals: {
      calendarMonths: result
        ? result.totalCalendarMonthsCompleted + result.projection.calendarMonths
        : null,
      wteMonths: result
        ? result.totalWteMonthsCompleted + result.projection.wteMonths
        : null
    }
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
    lengthOverrideNotes: toText(formData.lengthOverrideNotes),
    startGrade: formData.startGrade as CctTrainingGrade,
    startGradeOverrideNotes: toText(formData.startGradeOverrideNotes),
    additionalTrainingTime: toTrainingTime(formData.additionalTrainingTime),
    acceleratedTrainingTime: toTrainingTime(formData.acceleratedTrainingTime),
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

export const isCctLengthOverridden = (
  specialty: CctSpecialty | undefined,
  lengthMonths: string | number | null | undefined
) =>
  !!specialty &&
  !!lengthMonths &&
  Number(lengthMonths) !== specialty.lengthMonths;

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
    lengthOverridden: isCctLengthOverridden(
      specialtyDefault,
      programmeDetails.lengthMonths
    ),
    startGradeOverridden: isCctStartGradeOverridden(
      specialtyDefault,
      programmeDetails.startGrade
    ),
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

export const mapFormDataToTrainingTime = (
  formData: FormData
): CctTrainingTime => ({
  grade: formData.grade as CctTrainingGrade,
  months: toNumber(formData.months),
  notes: toText(formData.notes).trim()
});

export const mapTrainingTimeToFormData = (
  entry: CctTrainingTime | null
): FormData => (entry ? { ...entry, months: String(entry.months) } : {});

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
