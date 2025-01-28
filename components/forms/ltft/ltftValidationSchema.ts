import * as yup from "yup";
import { StringValidationSchema } from "../StringValidationSchema";
import { CHECK_PHONE_REGEX } from "../../../utilities/Constants";

const yesNoError =
  "Please select Yes or No for: Are you a Tier 2 / Skilled Worker Visa holder?";
const reasonError = "At least one reason is required";

const emailValidation = yup
  .string()
  .email("Email address is invalid")
  .max(255, "Email must be shorter than 255 characters")
  .required("Email address is required");

const phoneValidation = (fieldName: string) =>
  StringValidationSchema(fieldName).matches(
    CHECK_PHONE_REGEX,
    `${fieldName} is not valid`
  );

const DiscussionsValidationSchema = yup.object().shape({
  name: StringValidationSchema("Name"),
  email: emailValidation,
  role: StringValidationSchema("Role")
});

const personalDetailsDtoValidationSchema = yup.object().shape({
  forenames: StringValidationSchema("Forename"),
  surname: StringValidationSchema("GMC-Registered Surname"),
  gmcNumber: StringValidationSchema("GMC number", 20),
  telephoneNumber: phoneValidation("Contact Telephone"),
  mobileNumber: phoneValidation("Mobile Number"),
  email: emailValidation,
  skilledWorkerVisaHolder: yup
    .boolean()
    .typeError(yesNoError)
    .required(yesNoError)
});

export const ltftValidationSchema = yup.object({
  tpdName: StringValidationSchema("TPD Name"),
  tpdEmail: emailValidation,
  otherDiscussions: yup.array().of(DiscussionsValidationSchema).nullable(),
  reasonsSelected: yup.array().min(1, reasonError).required(reasonError),
  personalDetails: personalDetailsDtoValidationSchema
});
