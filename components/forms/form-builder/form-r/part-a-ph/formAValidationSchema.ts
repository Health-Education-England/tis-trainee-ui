import * as yup from "yup";
import { formAValidationSchemaDefault as parentSchema } from "../part-a/formAValidationSchema";

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

const formAValidationSchemaDefault = {
  ...parentSchema,
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
    .max(20, "Public Health Number must be shorter than 20 characters")
};

export const formAValidationSchema = yup.object(formAValidationSchemaDefault);

export const formAValidationSchemaView = yup.object({
  ...formAValidationSchemaDefault,
  cctSpecialty1: yup
    .string()
    .nullable()
    .when("declarationType", {
      is: "I have been appointed to a programme leading to award of CCT",
      then: yup.string().required("Specialty 1 for Award of CCT is required")
    })
});
