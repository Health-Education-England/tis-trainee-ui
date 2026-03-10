import * as yup from "yup";
import { DateUtilities } from "../../../../../utilities/DateUtilities";
import { formBValidationSchemaDefaultJson } from "../part-b/formBValidationSchema";

// Custom validator: at least one of the given fields is a non-blank string
const atLeastOneNonBlank = (fields: string[], message: string) =>
  yup.string().test("at-least-one-non-blank", message, function () {
    const parent = this.parent || {};
    return fields.some(
      field =>
        !!(
          parent[field] &&
          typeof parent[field] === "string" &&
          parent[field].trim()
        )
    );
  });

const formBValidationSchemaDefault = yup.object({
  ...formBValidationSchemaDefaultJson,
  gmcNumber: atLeastOneNonBlank(
    ["gmcNumber", "gdcNumber", "publicHealthNumber"],
    "At least one of GMC number, GDC number, or Public Health number must be provided"
  )
    .nullable()
    .max(20, "GMC Number must be shorter than 20 characters"),
  gdcNumber: atLeastOneNonBlank(
    ["gmcNumber", "gdcNumber", "publicHealthNumber"],
    "At least one of GMC number, GDC number, or Public Health number must be provided"
  )
    .nullable()
    .max(20, "GDC Number must be shorter than 20 characters"),
  publicHealthNumber: atLeastOneNonBlank(
    ["gmcNumber", "gdcNumber", "publicHealthNumber"],
    "At least one of GMC number, GDC number, or Public Health number must be provided"
  )
    .nullable()
    .max(20, "Public Health Number must be shorter than 20 characters"),
  currRevalDate: yup
    .mixed()
    .test(
      "currRevalDate",
      "Current Revalidation Date must be empty for Public Health non-medical trainees, and is required otherwise",
      function (value) {
        const { gmcNumber, publicHealthNumber } = this.parent || {};
        const isPH =
          (!gmcNumber || gmcNumber.trim() === "") &&
          publicHealthNumber &&
          publicHealthNumber.trim() !== "";
        if (isPH) {
          // PH non-medical: must be empty
          return value === null || value === undefined || value === "";
        } else {
          // All others: must NOT be empty and must be a valid date in the allowed range
          return (
            value !== null &&
            value !== undefined &&
            value !== "" &&
            DateUtilities.IsInsideDateRange(value)
          );
        }
      }
    )
});

export function getFormBValidationSchema(activeCovidSection: boolean) {
  let formBValidationSchema = formBValidationSchemaDefault;
  if (activeCovidSection) return formBValidationSchema;
  return formBValidationSchema.omit([
    "haveCovidDeclarations",
    "covidDeclarationDto"
  ]);
}
