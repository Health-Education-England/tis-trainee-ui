import * as yup from "yup";
import { DateUtilities } from "../../../../../utilities/DateUtilities";
import {
  StringValidationSchema,
  StringValidationSchemaOptional
} from "../../../StringValidationSchema";

const honestValidationString =
  "Please confirm your acceptance to Good Medical Practice honesty & integrity obligations";
const healthyValidationString =
  "Please confirm your acceptance to Good Medical Practice personal health obligations";
const warningsValidationString =
  "Please select Yes or No relating to conditions, warnings, or undertakings";
const complyingValidationString =
  "Please confirm you are complying with these conditions, warnings or undertakings";
const havePreviousDeclarationsString =
  "Please select Yes or No for previous declarations";
const haveCurrentDeclarationsString =
  "Please select Yes or No for new declarations";
const hasCovidDeclarationString =
  "Please select Yes or No for if Covid has affected your training";

const booleanValidationSchema = (validationString: string) =>
  yup
    .boolean()
    .typeError(validationString)
    .nullable()
    .oneOf([true], validationString)
    .required(validationString);

const dateValidationSchema = (fieldName: string) =>
  yup
    .date()
    .typeError(`${fieldName} must be a valid date`)
    .nullable()
    .required(`${fieldName} is required`);

const leaveValidation = (fieldName: string) =>
  yup
    .number()
    .integer(`${fieldName} must be rounded up to a whole number`)
    .typeError(`${fieldName} must be a positive number or zero`)
    .min(0, `${fieldName} must be a positive number or zero`)
    .required(`${fieldName} is required`);

const leaveTotalValidation = (fieldName: string) =>
  yup.number().max(9999, `${fieldName} cannot exceed 9999 days`);

const panelSchemaValidation = yup.object().shape({
  declarationType: StringValidationSchema("Declaration type"),
  title: StringValidationSchema("Title"),
  locationOfEntry: StringValidationSchema("Location of entry"),
  dateOfEntry: dateValidationSchema("Date of entry").test(
    "dateOfEntry",
    " please choose a date from the past",
    value => DateUtilities.IsPastDate(value)
  )
});

const WorkValidationSchema = yup.object().shape({
  typeOfWork: StringValidationSchema("Type of Work"),
  trainingPost: StringValidationSchema("Training Post"),
  site: StringValidationSchema("Site Name"),
  siteLocation: StringValidationSchema("Site Location"),
  siteKnownAs: StringValidationSchemaOptional("Site Known As"),
  startDate: yup
    .date()
    .typeError("Start date must be a valid date")
    .required("Start date is required")
    .test("startDate", "The date is outside the allowed date range", value =>
      DateUtilities.IsInsideDateRange(value)
    ),
  endDate: yup
    .date()
    .typeError("End date must be a valid date")
    .required("End date is required")
    .test(
      "end-is-greater",
      "End date must be later than or equal to Start date",
      function (endDate) {
        const { startDate } = this.parent;
        if (startDate && endDate) {
          return new Date(startDate).getTime() <= new Date(endDate).getTime();
        }
        return false;
      }
    )
    .test("endDate", "The date is outside the allowed date range", value =>
      DateUtilities.IsInsideDateRange(value)
    )
});

const covid19ValidationSchema = yup.object().shape({
  selfRateForCovid: yup
    .string()
    .nullable()
    .required("Self-rating your own performance is required"),
  reasonOfSelfRate: yup
    .string()
    .nullable()
    .required("Reason for self-rate is required"),
  discussWithSupervisorChecked: yup
    .boolean()
    .nullable()
    .required("Please select yes or no to discuss with supervisor"),
  discussWithSomeoneChecked: yup
    .boolean()
    .nullable()
    .required("Please select yes or no to discuss with someone"),
  otherInformationForPanel: yup
    .string()
    .nullable()
    .max(1000, "You have reached the maximum length allowed"),
  educationSupervisorEmail: yup
    .string()
    .nullable()
    .email("Email address is invalid")
    .max(255, "Email must be shorter than 255 characters"),
  haveChangesToPlacement: yup
    .boolean()
    .nullable()
    .required("Please select yes or no to changes made to placement"),
  changeCircumstances: yup
    .string()
    .nullable()
    .required("Circumstance of change is required"),
  changeCircumstanceOther: yup
    .string()
    .nullable()
    .required("Other circumstance is required"),
  howPlacementAdjusted: yup
    .string()
    .nullable()
    .required("How your placement was adjusted is required")
});

const formBValidationSchemaDefault = yup.object({
  // Personal details - section 1
  forename: StringValidationSchema("Forename"),
  surname: StringValidationSchema("GMC-Registered Surname"),
  gmcNumber: StringValidationSchema("GMC number", 20),
  email: yup
    .string()
    .email("Email address is invalid")
    .max(255, "Email must be shorter than 255 characters")
    .required("Email is required"),
  localOfficeName: StringValidationSchema("Deanery / HEE Local Office"),
  prevRevalBody: yup.string().nullable(),
  prevRevalBodyOther: yup.string().nullable(),
  currRevalDate: yup
    .date()
    .typeError("Current Revalidation date must be a valid date")
    .required("Current Revalidation is required")
    .test(
      "currRevalDate",
      "Current Revalidation date has to be on or after today",
      value => DateUtilities.IsFutureDate(value)
    )
    .test(
      "currRevalDate",
      "The date is outside the allowed date range",
      value => DateUtilities.IsInsideDateRange(value)
    ),
  prevRevalDate: yup
    .string()
    .nullable()
    .test(
      "prevRevalDate",
      " please choose a previous Revalidation date from the past",
      value => DateUtilities.IsPastDate(value)
    ),
  programmeSpecialty: StringValidationSchema("Programme / Training Specialty"),
  dualSpecialty: yup.string(),

  // Work - section 2
  work: yup
    .array()
    .of(WorkValidationSchema)
    .min(1, "At least one Type of Work is required"),

  // TOOT - section 3
  sicknessAbsence: leaveValidation("Short and Long-term sickness absence"),
  parentalLeave: leaveValidation(
    "Parental leave (incl Maternity / Paternity leave)"
  ),
  careerBreaks: leaveValidation(
    "Career breaks within a Programme (OOPC) and non-training placements for experience (OOPE)"
  ),
  paidLeave: leaveValidation(
    "Paid / unpaid leave (e.g. compassionate, jury service)"
  ),
  unauthorisedLeave: leaveValidation(
    "Unpaid/unauthorised leave including industrial action"
  ),
  otherLeave: leaveValidation("Other"),
  totalLeave: leaveTotalValidation("Total leave"),

  // Declarations relating to Good Medical Practice - section 4
  isHonest: booleanValidationSchema(honestValidationString),
  isHealthy: booleanValidationSchema(healthyValidationString),
  isWarned: yup
    .boolean()
    .typeError(warningsValidationString)
    .required(warningsValidationString),
  isComplying: booleanValidationSchema(complyingValidationString),
  // Summary of previous resolved/unresolved Form R Declarations - section 5/6
  havePreviousDeclarations: yup
    .boolean()
    .typeError(havePreviousDeclarationsString)
    .required(havePreviousDeclarationsString),
  havePreviousUnresolvedDeclarations: yup
    .boolean()
    .typeError(havePreviousDeclarationsString)
    .required(havePreviousDeclarationsString),
  previousDeclarations: yup
    .array()
    .typeError("At least one Previous Declaration is required")
    .of(panelSchemaValidation)
    .min(1, "At least one Previous Declaration is required"),
  previousDeclarationSummary: StringValidationSchema(
    "Summary of Previous Declarations",
    4096
  ),

  // Summary of current resolved/ unresolved Form R Declarations - section 7/8
  haveCurrentDeclarations: yup
    .boolean()
    .typeError(haveCurrentDeclarationsString)
    .required(haveCurrentDeclarationsString),
  haveCurrentUnresolvedDeclarations: yup
    .boolean()
    .typeError(haveCurrentDeclarationsString)
    .required(haveCurrentDeclarationsString),
  currentDeclarations: yup
    .array()
    .typeError("At least one Current Declaration is required")
    .of(panelSchemaValidation)
    .min(1, "At least one Current Declaration is required"),
  currentDeclarationSummary: StringValidationSchema(
    "Summary of Current Declarations",
    4096
  ),

  // Covid section
  haveCovidDeclarations: yup
    .boolean()
    .nullable()
    .required(hasCovidDeclarationString),
  covidDeclarationDto: covid19ValidationSchema
});

export function getFormBValidationSchema(activeCovidSection: boolean) {
  let formBValidationSchema = formBValidationSchemaDefault;
  if (activeCovidSection) return formBValidationSchema;
  return formBValidationSchema.omit([
    "haveCovidDeclarations",
    "covidDeclarationDto"
  ]);
}
