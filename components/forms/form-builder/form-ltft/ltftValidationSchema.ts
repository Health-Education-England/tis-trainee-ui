import * as yup from "yup";
export const ltftValidationSchema = yup.object({
  forename: yup.string().required("Forename is required")
});
