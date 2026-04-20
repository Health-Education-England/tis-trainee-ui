import dayjs from "dayjs";
import * as Yup from "yup";
import { CalculationType, CctChangeType } from "../../../redux/slices/cctSlice";
import { hasWteChangeField } from "../../../utilities/CctUtilities";

const changeSchema = Yup.object().shape({
  type: Yup.string().nullable().required("Please select a change type"),

  startDate: Yup.date()
    .typeError("Start date must be a valid date")
    .required("Please enter a start date")
    .test(
      "not-before-programme-start",
      "Start date must not be before the programme start date",
      function (startDate) {
        const programmeStartDate =
          this.options?.context?.programmeMembership?.startDate;
        if (!startDate || !programmeStartDate) return true;
        return !dayjs(startDate).isBefore(dayjs(programmeStartDate));
      }
    ),

  endDate: Yup.date()
    .nullable()
    .transform((value, originalValue) => {
      if (!originalValue || originalValue === "") return null;
      return value;
    })
    .required("Please enter an end date or select until end of programme")
    .test(
      "not-before-start-date",
      "End date must not be before start date",
      function (endDate) {
        const { startDate } = this.parent;
        if (!endDate || !startDate) return true;
        return !dayjs(endDate).isBefore(dayjs(startDate));
      }
    )
    .test(
      "not-after-programme-end",
      "End date must not be after the programme end date",
      function (endDate) {
        const programmeEndDate =
          this.options?.context?.programmeMembership?.endDate;
        if (!endDate || !programmeEndDate) return true;
        return !dayjs(endDate).isAfter(dayjs(programmeEndDate));
      }
    ),

  wte: Yup.number()
    .nullable()
    .when("type", {
      is: (type: CalculationType) => hasWteChangeField(type),
      then: schema =>
        schema
          .typeError("LTFT percentage must be a number")
          .min(0.01, "Percentage must be between 1 and 99")
          .max(0.99, "Percentage must be between 1 and 99")
          .required("Please enter a valid LTFT percentage"),
      otherwise: schema => schema.notRequired()
    })
});

export const cctValidationSchema = Yup.object().shape({
  changes: Yup.array()
    .of(changeSchema)
    .test(
      "until-end-must-be-last",
      'A change with "until end of programme" must be the last change by start date',
      function (changes) {
        if (!changes || changes.length < 2) return true;
        const sorted = [...changes]
          .map((c, i) => ({
            change: c as unknown as CctChangeType,
            origIndex: i
          }))
          .filter(item => item.change.startDate)
          .sort((a, b) =>
            dayjs(a.change.startDate).diff(dayjs(b.change.startDate))
          );

        for (let i = 0; i < sorted.length - 1; i++) {
          const programmeEndDate =
            this.options?.context?.programmeMembership?.endDate;
          if (
            programmeEndDate &&
            dayjs(sorted[i].change.endDate).isSame(
              dayjs(programmeEndDate),
              "day"
            )
          ) {
            return this.createError({
              path: `changes[${sorted[i].origIndex}].endDate`,
              message: `Change ${
                sorted[i].origIndex + 1
              }: "until end of programme" must be the last change by start date`
            });
          }
        }
        return true;
      }
    )
    .test(
      "no-overlapping-changes",
      "Changes must not have overlapping date ranges",
      function (changes) {
        if (!changes || changes.length < 2) return true;

        const sorted = [...changes]
          .map((c, i) => ({
            change: c as unknown as CctChangeType,
            origIndex: i
          }))
          .filter(item => item.change.startDate && item.change.endDate)
          .sort((a, b) =>
            dayjs(a.change.startDate).diff(dayjs(b.change.startDate))
          );

        for (let i = 0; i < sorted.length - 1; i++) {
          const current = sorted[i].change;
          const next = sorted[i + 1].change;
          const currentEnd = current.endDate as string;
          const nextStart = next.startDate as string;

          if (
            currentEnd &&
            dayjs(nextStart).isBefore(dayjs(currentEnd).add(1, "day"))
          ) {
            return this.createError({
              path: `changes[${sorted[i + 1].origIndex}].startDate`,
              message: `Change ${
                sorted[i + 1].origIndex + 1
              } overlaps with Change ${
                sorted[i].origIndex + 1
              }. Start date must be after ${dayjs(currentEnd).format(
                "DD/MM/YYYY"
              )}`
            });
          }
        }
        return true;
      }
    )
});
