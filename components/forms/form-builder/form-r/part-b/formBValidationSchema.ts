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
    .max(9999, `${fieldName} must not be more than 9999`)
    .required(`${fieldName} is required`);

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
      "End date must be later than Start date",
      function (endDate) {
        const { startDate } = this.parent;
        if (startDate && endDate) {
          return new Date(startDate).getTime() < new Date(endDate).getTime();
        }
        return false;
      }
    )
    .test("endDate", "The date is outside the allowed date range", value =>
      DateUtilities.IsInsideDateRange(value)
    )
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
  currRevalDate: dateValidationSchema("Current Revalidation date")
    .test("currRevalDate", "The date has to be on or after today", value =>
      DateUtilities.IsFutureDate(value)
    )
    .test(
      "currRevalDate",
      "The date is outside the allowed date range",
      value => DateUtilities.IsInsideDateRange(value)
    ),
  prevRevalDate: yup
    .string()
    .nullable()
    .test("prevRevalDate", " please choose a date from the past", value =>
      DateUtilities.IsPastDate(value)
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

  // Declarations relating to Good Medical Practice - section 4
  isHonest: booleanValidationSchema(honestValidationString),
  isHealthy: booleanValidationSchema(healthyValidationString),
  isWarned: yup
    .boolean()
    .typeError(warningsValidationString)
    .required(warningsValidationString),
  isComplying: yup
    .boolean()
    .nullable()
    .when("isWarned", {
      is: true,
      then: booleanValidationSchema(complyingValidationString)
    }),

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
  covidDeclarationDto: yup
    .object()
    .nullable()
    .when("haveCovidDeclarations", {
      is: true,
      then: yup
        .object({
          selfRateForCovid: yup
            .string()
            .nullable()
            .required("Self-rating your own preformance is required"),
          reasonOfSelfRate: yup
            .string()
            .nullable()
            .when("selfRateForCovid", {
              is: (selfRate: string) =>
                selfRate !==
                "Satisfactory progress for stage of training and required competencies met",
              then: yup
                .string()
                .nullable()
                .required("Reason for self-rate is required")
            }),
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
            .required("Please select yes or no"),
          changeCircumstances: yup
            .string()
            .nullable()
            .when("haveChangesToPlacement", {
              is: true,
              then: yup
                .string()
                .nullable()
                .required("Circumstance of change is required")
            }),
          changeCircumstanceOther: yup
            .string()
            .nullable()
            .when("changeCircumstances", {
              is: (changeCircumstance: string) =>
                changeCircumstance === "Other",
              then: yup
                .string()
                .nullable()
                .required("Other circumstance is required")
            }),
          howPlacementAdjusted: yup
            .string()
            .nullable()
            .when("haveChangesToPlacement", {
              is: true,
              then: yup
                .string()
                .nullable()
                .required("How your placement was adjusted is required")
            })
        })
        .nullable()
    })
});

export function getFormBValidationSchema(activeCovidSection: boolean) {
  let formBValidationSchema = formBValidationSchemaDefault;
  if (activeCovidSection) return formBValidationSchema;
  return formBValidationSchema.omit([
    "haveCovidDeclarations",
    "covidDeclarationDto"
  ]);
}
