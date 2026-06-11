import * as yup from "yup";
import dayjs from "dayjs";
import { StringValidationSchema } from "../StringValidationSchema";
import store from "../../../redux/store/store";
import { isPastIt } from "../../../utilities/DateUtilities";
import { findLinkedProgramme } from "../../../utilities/CctUtilities";
import { CHECK_PHONE_REGEX } from "../../../utilities/Constants";
import { isDeferralOver12Months } from "../../../utilities/deferralUtilities";

// NOTE: best-guess validation for the Deferral POC - expected to evolve.

export const deferralReasonError = "Please select a reason";
export const supportingInformationOver12MonthsError =
  "Supporting information is required for a deferral of more than 12 months";

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

const personalDetailsDtoValidationSchema = yup.object().shape({
  forenames: StringValidationSchema("Forename"),
  surname: StringValidationSchema("GMC-Registered Surname"),
  gmcNumber: StringValidationSchema("GMC number", 20),
  telephoneNumber: phoneValidation("Contact Telephone"),
  mobileNumber: phoneValidation("Mobile Number"),
  email: emailValidation
});

const getLinkedProgramme = (pmId: string | undefined) => {
  if (!pmId) return undefined;
  const progsArrNotPast = store
    .getState()
    .traineeProfile.traineeProfileData.programmeMemberships.filter(
      prog => !isPastIt(prog.endDate)
    );
  return findLinkedProgramme(pmId, progsArrNotPast);
};

const isOnOrBeforeProgrammeEnd = (
  value: Date | null | undefined,
  pmId: string | undefined
) => {
  if (!value || !pmId) return true;
  const linkedProgramme = getLinkedProgramme(pmId);
  if (!linkedProgramme) return true;
  const inputDate = dayjs(value).startOf("day");
  const programmeEndDate = dayjs(linkedProgramme.endDate).startOf("day");
  return (
    inputDate.isBefore(programmeEndDate) || inputDate.isSame(programmeEndDate)
  );
};

const isAfterProgrammeStart = (
  value: Date | null | undefined,
  pmId: string | undefined
) => {
  if (!value || !pmId) return true;
  const linkedProgramme = getLinkedProgramme(pmId);
  if (!linkedProgramme) return true;
  const inputDate = dayjs(value).startOf("day");
  const programmeStartDate = dayjs(linkedProgramme.startDate).startOf("day");
  return inputDate.isAfter(programmeStartDate);
};

// The maximum deferral period is 24 months from the current programme start date.
export const MAX_DEFERRAL_MONTHS = 24;

const isWithinMaxDeferral = (
  value: Date | null | undefined,
  pmId: string | undefined
) => {
  if (!value || !pmId) return true;
  const linkedProgramme = getLinkedProgramme(pmId);
  if (!linkedProgramme) return true;
  const inputDate = dayjs(value).startOf("day");
  const maxDate = dayjs(linkedProgramme.startDate)
    .startOf("day")
    .add(MAX_DEFERRAL_MONTHS, "month");
  return inputDate.isBefore(maxDate) || inputDate.isSame(maxDate);
};

const newStartDateValidation = yup
  .date()
  .nullable()
  .transform((value, originalValue) => (originalValue === "" ? null : value))
  .typeError("New programme start date is not a valid date")
  .required("Please give your new programme start date")
  .test(
    "is-after-today",
    "Your new programme start date must be in the future",
    value => {
      if (!value) return true;
      return dayjs(value).startOf("day").isAfter(dayjs().startOf("day"));
    }
  )
  .test(
    "is-after-programme-start",
    "Your deferred programme start date must be at least a day after the original programme start date",
    function (value) {
      return isAfterProgrammeStart(value, this.parent.pmId);
    }
  )
  .test(
    "within-max-deferral",
    `You cannot defer for more than ${MAX_DEFERRAL_MONTHS} months from your original programme start date`,
    function (value) {
      return isWithinMaxDeferral(value, this.parent.pmId);
    }
  )
  .test(
    "is-before-programme-end",
    "Your deferred programme start date cannot be after the programme end date",
    function (value) {
      return isOnOrBeforeProgrammeEnd(value, this.parent.pmId);
    }
  );

export const deferralValidationSchema = yup.object({
  pmId: StringValidationSchema("Programme"),
  pmStartDate: yup.string().nullable(),
  newStartDate: newStartDateValidation,
  reasonSelected: yup.string().required(deferralReasonError).nullable(),
  reasonOtherDetail: yup
    .string()
    .required("Please provide details for your other reason")
    .nullable(),
  personalDetails: personalDetailsDtoValidationSchema,
  supportingInformation: yup
    .string()
    .trim()
    .nullable()
    .test({
      name: "required-for-deferral-over-12-months",
      message: supportingInformationOver12MonthsError,
      test(value) {
        const linkedProgramme = getLinkedProgramme(this.parent.pmId);
        const exceeds12Months = isDeferralOver12Months(
          linkedProgramme?.startDate ?? this.parent.pmStartDate,
          this.parent.newStartDate
        );
        return !exceeds12Months || Boolean(value);
      }
    })
});
