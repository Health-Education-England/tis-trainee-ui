import * as yup from "yup";
import { DateUtilities } from "../../../utilities/DateUtilities";
import { StringValidationSchema } from "../../../components/forms/StringValidationSchema";

const dateValidationSchema = (fieldName: string) =>
  yup.date().nullable().required(`${fieldName} is required`);

const leaveValidation = (fieldName: string) =>
  yup
    .number()
    .integer(`${fieldName} must be rounded up to a whole number`)
    .typeError(`${fieldName} must be a positive number or zero`)
    .min(0, `${fieldName} must be a positive number or zero`)
    .max(999, `${fieldName} must not be more than 999`)
    .required(`${fieldName} is required`);

const panelSchema = yup.object({
  declarationType: yup.string(),
  title: yup.string(),
  locationOfEntry: yup.string(),
  dateOfEntry: yup.date()
});

const panelSchemaValidation = yup.array(
  yup.object({
    declarationType: StringValidationSchema("Declaration type"),
    title: StringValidationSchema("Title"),
    locationOfEntry: StringValidationSchema("Location of entry"),
    dateOfEntry: dateValidationSchema("Date of entry").test(
      "dateOfEntry",
      " please choose a date from the past",
      value => DateUtilities.IsPastDate(value)
    )
  })
);

export const Section1ValidationSchema = yup.object({
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
  dualSpecialty: yup.string()
});

export const Section2ValidationSchema = yup.object({
  work: yup
    .array(
      yup.object({
        typeOfWork: StringValidationSchema("Type of Work"),
        trainingPost: StringValidationSchema("Training Post"),
        site: StringValidationSchema("Site Name"),
        siteLocation: StringValidationSchema("Site Location"),
        startDate: yup
          .date()
          .required("Start date is required")
          .test(
            "startDate",
            "The date is outside the allowed date range",
            value => DateUtilities.IsInsideDateRange(value)
          ),
        endDate: yup
          .date()
          .required("End date is required")
          .min(yup.ref("startDate"), "End date must be later than Start date")
          .test(
            "endDate",
            "The date is outside the allowed date range",
            value => DateUtilities.IsInsideDateRange(value)
          )
      })
    )
    .min(1, "At least one type of work should be added"),
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
  totalLeave: leaveValidation("Total")
});

const acceptanceValidation = yup
  .bool()
  .nullable()
  .oneOf([true], "You must confirm your acceptance")
  .required("You must confirm your acceptance");

export const Section3ValidationSchema = yup.object({
  isHonest: acceptanceValidation,
  isHealthy: acceptanceValidation,
  isWarned: yup.boolean().nullable().required("You must select yes or no"),
  isComplying: yup.boolean().nullable().when("isWarned", {
    is: true,
    then: acceptanceValidation
  })
});

export const Section4ValidationSchema = yup.object({
  havePreviousDeclarations: yup
    .boolean()
    .nullable()
    .required("You must select yes or no"),
  havePreviousUnresolvedDeclarations: yup
    .boolean()
    .nullable()
    .required("You must select yes or no"),
  previousDeclarations: yup
    .array(panelSchema)
    .when("havePreviousDeclarations", {
      is: true,
      then: panelSchemaValidation
    }),
  previousDeclarationSummary: yup
    .string()
    .nullable()
    .when("havePreviousUnresolvedDeclarations", {
      is: true,
      then: yup
        .string()
        .nullable()
        .required("A summary of previous unresolved declarations is required")
    })
});

export const Section5ValidationSchema = yup.object({
  haveCurrentDeclarations: yup
    .boolean()
    .nullable()
    .required("You must select yes or no"),
  haveCurrentUnresolvedDeclarations: yup
    .boolean()
    .nullable()
    .required("You must select yes or no"),
  currentDeclarations: yup.array(panelSchema).when("haveCurrentDeclarations", {
    is: true,
    then: panelSchemaValidation
  }),
  currentDeclarationSummary: yup
    .string()
    .nullable()
    .when("haveCurrentUnresolvedDeclarations", {
      is: true,
      then: yup
        .string()
        .nullable()
        .required("A summary of new unresolved declarations is required")
    })
});

export const Section7ValidationSchema = yup.object({
  isDeclarationAccepted: acceptanceValidation,
  isConsentAccepted: acceptanceValidation
});

export const CovidSectionValidationSchema = yup.object({
  haveCovidDeclarations: yup
    .boolean()
    .nullable()
    .required("You must select yes or no"),
  covidDeclarationDto: yup
    .object()
    .nullable()
    .when("haveCovidDeclarations", {
      is: true,
      then: yup
        .object({
          selfRateForCovid: StringValidationSchema(
            "Covid Training Progress",
            300
          ),
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
            .required("You must select yes or no"),
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
