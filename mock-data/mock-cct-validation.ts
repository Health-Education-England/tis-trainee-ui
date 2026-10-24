import day from "dayjs";
import { CctChangeDto, CctProgrammeDetails } from "../models/CctTypes";
import {
  CCT_CHANGE_TYPE_LABELS,
  CCT_NOTES_MAX_LENGTH,
  CCT_NOTES_TOO_LONG_ERROR,
  CCT_TRAINING_GRADES,
  findCctSpecialty
} from "../utilities/CctConstants";
import { formatCctDate } from "../utilities/CctUtilities";

export type CctValidationError = { pointer: string; detail: string };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const isIsoDate = (value: unknown): value is string =>
  typeof value === "string" &&
  ISO_DATE.test(value) &&
  day(value).format("YYYY-MM-DD") === value;

const hasValue = (value: unknown) => value !== null && value !== undefined;

const isBlank = (value: unknown) =>
  !hasValue(value) || (typeof value === "string" && value.trim() === "");

const isNumberBetween = (value: unknown, min: number, max: number) =>
  typeof value === "number" &&
  Number.isFinite(value) &&
  value >= min &&
  value <= max;

const isWholePercent = (fraction: unknown, maxPercent: number) => {
  if (typeof fraction !== "number") return false;
  const percent = Math.round(fraction * 100);
  return (
    Math.abs(fraction * 100 - percent) < 1e-9 &&
    percent >= 1 &&
    percent <= maxPercent
  );
};

const compareText = (a: string, b: string) => {
  if (a < b) return -1;
  return a > b ? 1 : 0;
};

function validateProgrammeDetails(details: CctProgrammeDetails) {
  const errors: CctValidationError[] = [];
  const add = (field: string, detail: string) =>
    errors.push({ pointer: `#/programmeDetails/${field}`, detail });
  const requireNote = (
    isNeeded: boolean,
    notesField: keyof CctProgrammeDetails,
    detail: string
  ) => {
    if (isNeeded && isBlank(details[notesField])) add(notesField, detail);
  };

  if (isBlank(details.specialty))
    add("specialty", "Please choose a specialty.");
  if (!isIsoDate(details.startDate))
    add("startDate", "Please enter a programme start date.");
  if (!CCT_TRAINING_GRADES.includes(details.startGrade))
    add("startGrade", "Please choose a start grade.");
  if (!isNumberBetween(details.lengthMonths, 1, 120))
    add("lengthMonths", "Programme length must be between 1 and 120 months.");
  if (!isNumberBetween(details.additionalMonths, 0, 24))
    add(
      "additionalMonths",
      "Additional training time must be between 0 and 24 months."
    );
  if (!isNumberBetween(details.acceleratedMonths, 0, 12))
    add(
      "acceleratedMonths",
      "Accelerated training time must be between 0 and 12 months."
    );
  else if (
    isNumberBetween(details.lengthMonths, 1, 120) &&
    isNumberBetween(details.additionalMonths, 0, 24) &&
    details.lengthMonths +
      details.additionalMonths -
      details.acceleratedMonths <=
      0
  )
    add(
      "acceleratedMonths",
      "Adjusted training duration must be greater than zero."
    );

  const entryGrade = findCctSpecialty(details.specialty)?.entryGrade;
  requireNote(
    details.additionalMonths > 0,
    "additionalMonthsNotes",
    "Please enter a reason for additional training time."
  );
  requireNote(
    details.acceleratedMonths > 0,
    "acceleratedMonthsNotes",
    "Please enter a reason for accelerated training time."
  );
  requireNote(
    !!entryGrade && details.startGrade !== entryGrade,
    "startGradeOverrideNotes",
    "Please enter a reason for overriding the default start grade."
  );
  requireNote(
    hasValue(details.eighteenMonthFinalGrade),
    "eighteenMonthFinalGradeNotes",
    "Please enter a reason for the 18-month final year."
  );
  requireNote(
    hasValue(details.skippedGrade),
    "skippedGradeNotes",
    "Please enter a reason for skipping a grade year."
  );
  return errors;
}

type AddError = (field: string, detail: string) => void;

function validateChangeDates(change: CctChangeDto, add: AddError) {
  const hasStart = isIsoDate(change.startDate);
  const hasEnd = isIsoDate(change.endDate);
  if (!hasStart) add("startDate", "Please enter a start date.");
  if (hasValue(change.endDate) ? !hasEnd : change.type !== "LTFT")
    add("endDate", "Please enter an end date.");
  else if (hasStart && hasEnd && day(change.startDate).isAfter(change.endDate))
    add("startDate", "Start date cannot be after end date.");
}

function validateChangeCredit(change: CctChangeDto, add: AddError) {
  const { type, wte, countsTowardsCompletion: counts } = change;
  if (type === "LTFT") {
    if (!counts)
      add("countsTowardsCompletion", "LTFT must count towards completion.");
    if (!isWholePercent(wte, 99))
      add("wte", "LTFT WTE must be a whole number between 1 and 99.");
  } else if (type === "OOPR") {
    if (counts && !isWholePercent(wte, 100))
      add(
        "wte",
        "Approved OOPR credit must be a whole number between 1 and 100."
      );
    if (!counts && hasValue(wte))
      add("wte", "Only an OOPR counted as training can have a credit.");
  } else {
    if (hasValue(wte)) add("wte", `${type} cannot have a WTE.`);
    if (type !== "OOPT" && counts)
      add(
        "countsTowardsCompletion",
        `${type} cannot count towards completion.`
      );
  }

  if (
    type === "OOPT" &&
    counts &&
    isIsoDate(change.startDate) &&
    isIsoDate(change.endDate) &&
    day(change.endDate).isAfter(
      day(change.startDate).add(12, "month").subtract(1, "day")
    )
  )
    add("endDate", "OOPT counted as training cannot be more than 12 months.");
}

function validateChange(change: CctChangeDto, index: number) {
  const errors: CctValidationError[] = [];
  const add: AddError = (field, detail) =>
    errors.push({ pointer: `#/changes[${index}]/${field}`, detail });

  if (!Object.keys(CCT_CHANGE_TYPE_LABELS).includes(change.type)) {
    add("type", "Please choose a change type.");
    return errors;
  }

  validateChangeDates(change, add);
  validateChangeCredit(change, add);
  if (
    typeof change.notes === "string" &&
    change.notes.trim().length > CCT_NOTES_MAX_LENGTH
  )
    add("notes", CCT_NOTES_TOO_LONG_ERROR);
  return errors;
}

function validateAcrossChanges(changes: CctChangeDto[]) {
  const errors: CctValidationError[] = [];
  const add = (index: number, field: string, detail: string) =>
    errors.push({ pointer: `#/changes[${index}]/${field}`, detail });
  const entries = changes.map((change, index) => ({ change, index }));
  const dated = entries.filter(
    ({ change }) => isIsoDate(change.startDate) && isIsoDate(change.endDate)
  );
  const open = entries.filter(
    ({ change }) =>
      change.type === "LTFT" &&
      !hasValue(change.endDate) &&
      isIsoDate(change.startDate)
  );

  dated.forEach(({ change, index }) => {
    const overlapped = dated.find(
      other =>
        other.index < index &&
        !day(change.endDate).isBefore(other.change.startDate) &&
        !day(change.startDate).isAfter(other.change.endDate)
    );
    if (overlapped)
      add(
        index,
        "startDate",
        `This change overlaps an existing change (${formatCctDate(
          overlapped.change.startDate
        )} – ${formatCctDate(overlapped.change.endDate)}).`
      );
  });

  open
    .slice(1)
    .forEach(({ index }) =>
      add(
        index,
        "endDate",
        "Only one LTFT change can project the remaining training time."
      )
    );
  open.forEach(({ change, index }) => {
    if (
      dated.some(other => !day(change.startDate).isAfter(other.change.endDate))
    )
      add(
        index,
        "startDate",
        "Projected change must begin after all other completed changes."
      );
  });
  return errors;
}

export function validateCctCalculateRequest(
  programmeDetails: CctProgrammeDetails | null | undefined,
  changes: CctChangeDto[] | null | undefined
): CctValidationError[] {
  const errors: CctValidationError[] = [];
  if (!programmeDetails)
    errors.push({ pointer: "#/programmeDetails", detail: "must not be null" });
  else errors.push(...validateProgrammeDetails(programmeDetails));

  if (!changes)
    errors.push({ pointer: "#/changes", detail: "must not be null" });
  else {
    changes.forEach((change, index) =>
      errors.push(...validateChange(change, index))
    );
    errors.push(...validateAcrossChanges(changes));
  }

  return errors.sort(
    (a, b) =>
      compareText(a.pointer, b.pointer) || compareText(a.detail, b.detail)
  );
}
