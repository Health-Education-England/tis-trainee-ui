import * as yup from "yup";
import day from "dayjs";
import { Field, FormData } from "../form-builder/FormBuilder";
import {
  createErrorObject,
  showFormField
} from "../../../utilities/FormBuilderUtilities";
import {
  CctChangeDto,
  CctProgrammeDetails,
  CctTrainingTime
} from "../../../models/CctTypes";
import {
  CCT_MAX_TRAINING_TIME_MONTHS,
  CCT_NOTES_MAX_LENGTH,
  CCT_NOTES_TOO_LONG_ERROR
} from "../../../utilities/CctConstants";
import {
  deriveCctAdjustedLengthMonths,
  formatCctDate,
  isOpenLtftChange,
  mapFormDataToProgrammeDetails,
  mapFormDataToTrainingTime,
  sumCctTrainingTime
} from "../../../utilities/CctUtilities";
import { DateUtilities } from "../../../utilities/DateUtilities";
import { CctTrainingTimeKind } from "./cctTrainingTimeKinds";

type FindMessage = (
  value: unknown,
  formData: FormData
) => string | null | undefined;

const messageTest = (findMessage: FindMessage) =>
  function (this: yup.TestContext, value: unknown) {
    const message = findMessage(value, this.parent);
    return message ? this.createError({ message }) : true;
  };

const textOf = (value: unknown) => (typeof value === "string" ? value : "");

const isEmpty = (value: unknown) =>
  value === null || value === undefined || value === "";

const requiredText = (message: string) =>
  yup.string().nullable().trim().required(message);

const ADJUSTED_LENGTH_ERROR =
  "Adjusted training duration must be greater than zero.";

const isWholeMonths = (value: unknown, maxMonths: number) => {
  const months = Number(value);
  return (
    !isEmpty(value) &&
    Number.isInteger(months) &&
    months >= 1 &&
    months <= maxMonths
  );
};

const lengthMessage = (value: unknown, formData: FormData) => {
  if (!isWholeMonths(value, 120))
    return "Programme length must be a whole number of months between 1 and 120.";
  return deriveCctAdjustedLengthMonths(
    mapFormDataToProgrammeDetails(formData)
  ) <= 0
    ? ADJUSTED_LENGTH_ERROR
    : null;
};

const dateRangeMessage = (value: unknown) => {
  const date = textOf(value);
  return DateUtilities.IsNotBeforeUnixEpoch(date) &&
    DateUtilities.IsLessThanMaxDate(date)
    ? null
    : "Date must be between 01/01/1970 and 50 years from today.";
};

export const cctProgrammeDetailsValidationSchema = yup.object({
  specialty: yup.string().nullable().required("Please choose a specialty."),
  lengthMonths: yup
    .mixed()
    .nullable()
    .test("length-months", "", messageTest(lengthMessage)),
  lengthOverrideNotes: requiredText(
    "Please enter a reason for a different programme length."
  ),
  startDate: yup
    .string()
    .nullable()
    .required("Please enter a programme start date.")
    .test("start-date", "", messageTest(dateRangeMessage)),
  startGrade: yup.string().nullable().required("Please choose a start grade."),
  startGradeOverrideNotes: requiredText(
    "Please enter a reason for overriding the default start grade."
  )
});

export const cctGradeProgressionValidationSchema = yup.object({
  eighteenMonthFinalGradeNotes: requiredText(
    "Please enter a reason for the 18-month final year."
  ),
  skippedGrade: yup
    .string()
    .nullable()
    .required("Please choose the grade year to skip."),
  skippedGradeNotes: requiredText(
    "Please enter a reason for skipping a grade year."
  )
});

export const buildCctTrainingTimeValidationSchema = (
  { field, label, maxTotalMonths }: CctTrainingTimeKind,
  programmeDetails: CctProgrammeDetails,
  otherEntries: CctTrainingTime[]
) =>
  yup.object({
    grade: yup.string().nullable().required("Please choose a grade."),
    months: yup
      .mixed()
      .nullable()
      .test(
        "months",
        "",
        messageTest((value, formData) => {
          if (!isWholeMonths(value, CCT_MAX_TRAINING_TIME_MONTHS))
            return `Enter a whole number of months between 1 and ${CCT_MAX_TRAINING_TIME_MONTHS}.`;
          const entries = [
            ...otherEntries,
            mapFormDataToTrainingTime(formData)
          ];
          if (sumCctTrainingTime(entries) > maxTotalMonths)
            return `Total ${label} training time cannot be more than ${maxTotalMonths} months.`;
          return deriveCctAdjustedLengthMonths({
            ...programmeDetails,
            [field]: entries
          }) <= 0
            ? ADJUSTED_LENGTH_ERROR
            : null;
        })
      ),
    notes: requiredText(
      `Please enter a reason for ${label} training time.`
    ).max(
      CCT_NOTES_MAX_LENGTH,
      `Reason must be ${CCT_NOTES_MAX_LENGTH} characters or less`
    )
  });

export const cctSaveValidationSchema = yup.object({
  calculationName: requiredText("Please enter a name for your calculation.")
});

export type CctChangeValidationContext = {
  programmeDetails: CctProgrammeDetails | null;
  otherChanges: CctChangeDto[];
  cctDate: string | null;
};

type CctChangeCandidate = {
  startDate: string;
  endDate: string;
  isOpen: boolean;
};

type CctChangeIssues = Partial<
  Record<"startDate" | "ltftDuration" | "endDate", string>
>;

const cctDateLimitMessage = (dateLabel: string, cctDate: string) =>
  `${dateLabel} cannot be after the current projected Completion of Training Date (${formatCctDate(
    cctDate
  )}).`;

function findStartDateLimitMessage(
  start: day.Dayjs,
  { programmeDetails, cctDate }: CctChangeValidationContext
) {
  if (programmeDetails && start.isBefore(programmeDetails.startDate))
    return `Start date cannot be before programme start (${formatCctDate(
      programmeDetails.startDate
    )}).`;
  if (cctDate && start.isAfter(cctDate))
    return cctDateLimitMessage("Start date", cctDate);
  return undefined;
}

function findCctChangeIssues(
  candidate: CctChangeCandidate,
  context: CctChangeValidationContext
): CctChangeIssues {
  if (!candidate.startDate) return {};
  const start = day(candidate.startDate);
  const startLimitMessage = findStartDateLimitMessage(start, context);
  const otherOpenChange = context.otherChanges.find(isOpenLtftChange);
  const otherDatedChanges = context.otherChanges.filter(
    change => !isOpenLtftChange(change)
  );

  if (candidate.isOpen)
    return {
      startDate:
        startLimitMessage ??
        (otherDatedChanges.some(other => !start.isAfter(other.endDate))
          ? "Projected change not added as it must begin after all other completed changes."
          : undefined),
      ltftDuration: otherOpenChange
        ? "Only one LTFT change can project the remaining training time."
        : undefined
    };

  if (!candidate.endDate) return { startDate: startLimitMessage };
  const end = day(candidate.endDate);
  const overlappingChange = otherDatedChanges.find(
    other => !end.isBefore(other.startDate) && !start.isAfter(other.endDate)
  );

  return {
    startDate:
      startLimitMessage ??
      (overlappingChange &&
        `This change overlaps an existing change (${formatCctDate(
          overlappingChange.startDate
        )} – ${formatCctDate(overlappingChange.endDate)}).`),
    endDate:
      otherOpenChange && !end.isBefore(otherOpenChange.startDate)
        ? "Change not added as you already have a projected change that covers the remainder of your training."
        : undefined
  };
}

const toCandidate = (formData: FormData): CctChangeCandidate => ({
  startDate: textOf(formData.startDate),
  endDate: formData.showEndDate ? textOf(formData.endDate) : "",
  isOpen: formData.type === "LTFT" && formData.ltftDuration === "REMAINDER"
});

const isOoptCreditOverTwelveMonths = (formData: FormData) => {
  const { startDate, endDate } = toCandidate(formData);
  return (
    formData.type === "OOPT" &&
    !!formData.countsTowardsCompletion &&
    !!startDate &&
    !!endDate &&
    day(endDate).isAfter(day(startDate).add(12, "month").subtract(1, "day"))
  );
};

const wteMessage = (value: unknown, type: unknown) => {
  const wte = Number(value);
  const isWholeNumber = !isEmpty(value) && Number.isInteger(wte);
  if (type === "LTFT" && !(isWholeNumber && wte >= 1 && wte <= 99))
    return "LTFT WTE must be a whole number between 1 and 99.";
  if (type === "OOPR" && !(isWholeNumber && wte >= 1 && wte <= 100))
    return "Approved OOPR credit must be a whole number between 1 and 100.";
  return null;
};

export const buildCctChangeValidationSchema = (
  context: CctChangeValidationContext
) => {
  const issuesFor = (formData: FormData) =>
    findCctChangeIssues(toCandidate(formData), context);

  return yup.object({
    type: yup.string().nullable().required("Please choose a change type."),
    startDate: yup
      .string()
      .nullable()
      .required("Please enter a start date.")
      .test(
        "start-date",
        "",
        messageTest((value, formData) => {
          if (isEmpty(value)) return null;
          const message = dateRangeMessage(value);
          if (message) return message;
          const { endDate } = toCandidate(formData);
          if (endDate && day(textOf(value)).isAfter(endDate))
            return "Start date cannot be after end date.";
          return issuesFor(formData).startDate;
        })
      ),
    ltftDuration: yup
      .string()
      .nullable()
      .required("Please choose how long this LTFT change lasts.")
      .test(
        "ltft-duration",
        "",
        messageTest((_value, formData) => issuesFor(formData).ltftDuration)
      ),
    endDate: yup
      .string()
      .nullable()
      .required("Please enter an end date.")
      .test(
        "end-date",
        "",
        messageTest((value, formData) => {
          if (isEmpty(value)) return null;
          const message = dateRangeMessage(value);
          if (message) return message;
          if (isOoptCreditOverTwelveMonths(formData))
            return "OOPT counted as training cannot be more than 12 months.";
          return issuesFor(formData).endDate;
        })
      ),
    wtePercent: yup
      .mixed()
      .nullable()
      .test(
        "wte",
        "",
        messageTest((value, formData) => wteMessage(value, formData.type))
      ),
    notes: yup
      .string()
      .nullable()
      .trim()
      .max(CCT_NOTES_MAX_LENGTH, CCT_NOTES_TOO_LONG_ERROR)
  });
};

export function validateCctFields(
  fields: Field[],
  formData: FormData,
  schema: yup.AnyObjectSchema
): Record<string, string> {
  const visibleFieldsSchema = yup.object(
    Object.fromEntries(
      fields
        .filter(
          field => schema.fields[field.name] && showFormField(field, formData)
        )
        .map(field => [field.name, schema.fields[field.name]])
    )
  );
  try {
    visibleFieldsSchema.validateSync(formData, { abortEarly: false });
    return {};
  } catch (error) {
    if (!(error instanceof yup.ValidationError)) throw error;
    return createErrorObject(
      error as { inner: { path: string; message: string }[] }
    ) as Record<string, string>;
  }
}
