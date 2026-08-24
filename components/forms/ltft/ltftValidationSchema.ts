import * as yup from "yup";
import dayjs from "dayjs";
import { StringValidationSchema } from "../StringValidationSchema";
import { CHECK_PHONE_REGEX } from "../../../utilities/Constants";
import store from "../../../redux/store/store";
import { isPastIt } from "../../../utilities/DateUtilities";
import { findLinkedProgramme } from "../../../utilities/ProfileUtilities";
import { isDateWithin16WeeksOfFirstDate } from "../../../utilities/FormBuilderUtilities";

export const LtftVisaError =
  "Please select Yes or No for Skilled Worker visa status";
export const ltftReasonsError = "At least one reason is required";
export const ltftNoticeError =
  "Please select Yes or No for whether you will provide a start date at least 16 weeks from today";
export const ltftExceptionalReasonsError =
  "Please give your exceptional reason(s) for not being able to give 16 weeks' notice to change your working hours";

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

const isOnOrBeforeProgrammeEnd = (
  value: Date | null | undefined,
  pmId: string | undefined
) => {
  if (!value || !pmId) return true;
  const progsArrNotPast = store
    .getState()
    .traineeProfile.traineeProfileData.programmeMemberships.filter(
      prog => !isPastIt(prog.endDate)
    );
  const linkedProgramme = findLinkedProgramme(pmId, progsArrNotPast);
  if (!linkedProgramme) return true;
  const changeStartDate = dayjs(value).startOf("day");
  const programmeEndDate = dayjs(linkedProgramme.endDate).startOf("day");
  return (
    changeStartDate.isBefore(programmeEndDate) ||
    changeStartDate.isSame(programmeEndDate)
  );
};

const changeStartDateValidation = yup
  .date()
  .typeError("Please provide a valid Start Date")
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
      return isOnOrBeforeProgrammeEnd(value, this.parent.pmId);
    }
  )
  .test(
    "is-at-least-16-weeks",
    "Change cannot begin less than 16 weeks from today",
    function (value) {
      if (!value || this.parent.canGiveCompliantStartDate !== true) return true;
      return !isDateWithin16WeeksOfFirstDate(value);
    }
  );

const exceptionalReasonsDateValidation = yup
  .date()
  .typeError("Please provide a valid date")
  .required("Please provide the date you would like this change to begin")
  .test(
    "exceptional-on-or-after-today",
    "The date cannot be before today",
    function (value) {
      if (!value) return true;
      const exceptionalDate = dayjs(value).startOf("day");
      const today = dayjs().startOf("day");
      return exceptionalDate.isSame(today) || exceptionalDate.isAfter(today);
    }
  )
  .test(
    "exceptional-less-than-16-weeks",
    "The date must be less than 16 weeks from today",
    value => !value || isDateWithin16WeeksOfFirstDate(value)
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
  email: emailValidation
});

const wteValidation = (fieldName: string) =>
  yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required(`${fieldName} is required`)
    .min(1, `${fieldName} cannot be zero`)
    .max(100, `${fieldName} cannot exceed 100`);

export const ltftValidationSchema = yup.object({
  pmId: StringValidationSchema("Programme"),
  wteBeforeChange: wteValidation(
    "The percentage of full time hours before your proposed change"
  ),
  wte: wteValidation("The proposed percentage of full time hours").test(
    "not-equal-to-before",
    "Your proposed change must be different from the percentage you gave in Part 2",
    function (value) {
      return value !== Number(this.parent.wteBeforeChange);
    }
  ),
  tpdName: StringValidationSchema("Pre-approver name"),
  tpdEmail: emailValidation,
  otherDiscussions: yup.array().of(DiscussionsValidationSchema).nullable(),
  reasonsSelected: yup
    .array()
    .min(1, ltftReasonsError)
    .required(ltftReasonsError)
    .nullable(),
  personalDetails: personalDetailsDtoValidationSchema,
  canGiveCompliantStartDate: yup
    .boolean()
    .typeError(ltftNoticeError)
    .required(ltftNoticeError)
    .nullable(),
  startDate: changeStartDateValidation,
  exceptionalReasons: yup
    .string()
    .required(ltftExceptionalReasonsError)
    .nullable(),
  exceptionalReasonsDate: exceptionalReasonsDateValidation,
  skilledWorkerVisaHolder: yup
    .boolean()
    .typeError(LtftVisaError)
    .required(LtftVisaError),
  supportingInformation: yup
    .string()
    .required("Supporting information is required")
    .nullable()
});
