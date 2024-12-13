import dayjs from "dayjs";
import * as Yup from "yup";

const wteMsg = "WTE must be between 1 and 100";

export const cctValidationSchema = Yup.object().shape({
  programmeMembership: Yup.object().shape({
    wte: Yup.number()
      .typeError("WTE must be a number")
      .min(0.01, wteMsg)
      .max(1, wteMsg)
      .nullable()
      .required("Current WTE is Required")
  }),
  changes: Yup.array().of(
    Yup.object().shape({
      type: Yup.string().nullable().required("Change type is required"),
      startDate: Yup.date()
        .nullable()
        .min(
          dayjs().format("YYYY-MM-DD"),
          "Change date cannot be before today."
        )
        .required("Please enter a start date")
        .test(
          "is-before-the-current-cct-date",
          "Change date must be before the current completion date",
          function (startDate) {
            const currentCctDate =
              this.options?.context?.programmeMembership.endDate;
            return dayjs(startDate).isBefore(dayjs(currentCctDate));
          }
        )
        .test(
          "is-on-or-after-programme-start",
          "Change date must be on or after the programme start date",
          function (startDate) {
            const programmeStartDate =
              this.options?.context?.programmeMembership.startDate;
            return dayjs(startDate).isSameOrAfter(dayjs(programmeStartDate));
          }
        ),
      wte: Yup.number()
        .typeError("Proposed WTE must be a number")
        .min(0.01, wteMsg)
        .max(1, wteMsg)
        .nullable()
        .required("Please enter a Proposed WTE")
        .test(
          "is-different-from-programme-wte",
          "WTE values must be different",
          function (wte) {
            const p = this.options?.context?.programmeMembership.wte;
            return wte !== p;
          }
        )
    })
  )
});
