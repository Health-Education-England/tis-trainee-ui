import dayjs from "dayjs";
import * as Yup from "yup";
import { PmType } from "../../../redux/slices/cctSlice";

const createBaseStartDateSchema = () => {
  return Yup.date()
    .typeError("Start date must be a date")
    .min(dayjs().format("YYYY-MM-DD"), "Change date cannot be before today.")
    .required("Please enter a start date");
};

const createBaseWteSchema = (
  min: number,
  max: number,
  isDecimal: boolean = true
) => {
  const wteMsg = `WTE must be between ${min} and ${max}`;

  return Yup.number()
    .typeError(`${isDecimal ? "" : "Proposed "}WTE must be a number`)
    .min(min, wteMsg)
    .max(max, wteMsg)
    .nullable()
    .required(`Please enter a ${isDecimal ? "" : "Proposed "}WTE`);
};

// Main validation schema
export const cctValidationSchema = Yup.object().shape({
  programmeMembership: Yup.object().shape({
    wte: createBaseWteSchema(0.01, 1)
  }),
  changes: Yup.array().of(
    Yup.object().shape({
      type: Yup.string().nullable().required("Change type is required"),
      startDate: createBaseStartDateSchema()
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
      wte: createBaseWteSchema(0.01, 1, false).test(
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

export const getStartDateValidationSchema = (programmeMembership: PmType) => {
  return createBaseStartDateSchema()
    .test(
      "is-before-the-current-cct-date",
      "Change date must be before the current completion date",
      function (startDate) {
        const currentCctDate = programmeMembership.endDate;
        return dayjs(startDate).isBefore(dayjs(currentCctDate));
      }
    )
    .test(
      "is-on-or-after-programme-start",
      "Change date must be on or after the programme start date",
      function (startDate) {
        const programmeStartDate = programmeMembership.startDate;
        return dayjs(startDate).isSameOrAfter(dayjs(programmeStartDate));
      }
    );
};

export const getWteValidationSchema = (programmeMembership: PmType) => {
  return createBaseWteSchema(1, 100, false).test(
    "is-different-from-programme-wte",
    "WTE values must be different",
    function (wte) {
      const p = (programmeMembership.wte as number) * 100;
      return wte !== p;
    }
  );
};
