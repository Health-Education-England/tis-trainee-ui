import * as yup from "yup";
import dayjs from "dayjs";
import { StringValidationSchema } from "../StringValidationSchema";
import { CHECK_PHONE_REGEX } from "../../../utilities/Constants";
import store from "../../../redux/store/store";
import { isPastIt } from "../../../utilities/DateUtilities";
import { findLinkedProgramme } from "../../../utilities/CctUtilities";

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

const changeStartDateValidation = yup
  .date()
  .typeError("Start Date is not a valid date")
  .required("Start Date is required")
  .test(
    "is-on-or-after-today",
    "Change cannot begin before today",
    function (value) {
      if (!value) {
        return true;
      }
      const changeStartDate = dayjs(value).startOf("day");
      const today = dayjs().startOf("day");
      return changeStartDate.isSame(today) || changeStartDate.isAfter(today);
    }
  )
  .test(
    "is-before-programme-end",
    "Change cannot begin after the programme end date",
    function (value) {
      const { pmId } = this.parent;
      if (!value || !pmId) {
        return true;
      }
      const progsArrNotPast = store
        .getState()
        .traineeProfile.traineeProfileData.programmeMemberships.filter(
          prog => !isPastIt(prog.endDate)
        );
      const linkedProgramme = findLinkedProgramme(pmId, progsArrNotPast);

      if (linkedProgramme) {
        const changeStartDate = dayjs(value).startOf("day");
        const programmeEndDate = dayjs(linkedProgramme.endDate).startOf("day");
        return (
          changeStartDate.isBefore(programmeEndDate) ||
          changeStartDate.isSame(programmeEndDate)
        );
      }
      return true;
    }
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
  pmId: StringValidationSchema("Programme"),
  tpdName: StringValidationSchema("TPD Name"),
  tpdEmail: emailValidation,
  otherDiscussions: yup.array().of(DiscussionsValidationSchema).nullable(),
  reasonsSelected: yup
    .array()
    .min(1, reasonError)
    .required(reasonError)
    .nullable(),
  personalDetails: personalDetailsDtoValidationSchema,
  startDate: changeStartDateValidation
});
