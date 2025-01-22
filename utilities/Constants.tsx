import {
  faCircle,
  faCircleQuestion,
  faEnvelope,
  faShare,
  faUserFriends
} from "@fortawesome/free-solid-svg-icons";

import { Declaration, Work } from "../models/FormRPartB";
import { Link } from "react-router-dom";

export const CCT_DECLARATION =
  "I have been appointed to a programme leading to award of CCT";

export const MEDICAL_CURRICULUM = "MEDICAL_CURRICULUM";

export const YES_NO_OPTIONS = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" }
];

export const ARCP_OPTIONS = [
  { label: "ARCP/Annual Submission", value: "true" },
  { label: "New Starter", value: "false" }
];

export const MFA_OPTIONS = [
  {
    label: `generated by my Authenticator App
  (recommended)`,
    value: "TOTP"
  },
  {
    label: "sent by SMS to my phone",
    value: "SMS"
  }
];

export const COJ_EPOCH = new Date(
  process.env.NEXT_PUBLIC_CONDITIONS_OF_JOINING_EPOCH as string
);

export const COJ_DECLARATIONS_9 = [
  {
    id: "isDeclareProvisional",
    label:
      "I understand that programme and post allocations are provisional and subject to change until confirmed by HEE/NES/HEIW/NIMDTA and/or my employing organisation."
  },
  {
    id: "isDeclareSatisfy",
    label:
      "I understand that I will need to satisfy all requirements of the programme and curriculum to enable satisfactory sign off, and that this may require a specific time commitment."
  },
  {
    id: "isDeclareProvide",
    label:
      "I will obtain and provide my training programme and HEE/NES/HEIW/NIMDTA with a professional email address."
  },
  {
    id: "isDeclareInform",
    label:
      "I will inform my training programme and HEE/NES/HEIW/NIMDTA of any change of my personal contact details and/or personal circumstances that may affect my training programme arrangements."
  },
  {
    id: "isDeclareUpToDate",
    label:
      "I will keep myself up to date with the latest information available via HEE/NES/HEIW/NIMDTA as well as via the relevant educational and regulatory websites."
  },
  {
    id: "isDeclareAttend",
    label:
      "I will attend the minimum number of formal teaching days as required by my training programme."
  },
  {
    id: "isDeclareEngage",
    label:
      "Where applicable, I will fully engage with immigration and employer requirements relating to skilled worker visas (formerly Tier 2 and Tier 4 UK visas)."
  }
];

export const COJ_DECLARATIONS_10 = [
  {
    id: "isDeclareProvisional",
    label:
      "I understand that programme and post allocations are provisional, and are subject to change until confirmed by NHSE WTE/NES/HEIW/NIMDTA and/or my employing organisation."
  },
  {
    id: "isDeclareSatisfy",
    label:
      "I understand that I will need to satisfy all requirements of the programme and curriculum to enable satisfactory sign off, and that this may require a specific time commitment."
  },
  {
    id: "isDeclareProvide",
    label:
      "I will obtain a professional email address, and will provide this to my training programme and NHSE WTE/NES/HEIW/NIMDTA."
  },
  {
    id: "isDeclareInform",
    label:
      "I will inform my training programme and NHSE WTE/NES/HEIW/NIMDTA of any change to my personal contact details and/or personal circumstances that may affect my training programme arrangements."
  },
  {
    id: "isDeclareUpToDate",
    label:
      "I will keep myself up to date with the latest information available via NHSE WTE/NES/HEIW/NIMDTA as well as via the relevant educational and regulatory websites."
  },
  {
    id: "isDeclareAttend",
    label:
      "I will attend the minimum number of formal teaching days as required by my training programme."
  },
  {
    id: "isDeclareContacted",
    label:
      "I understand that I will be contacted by NHSE WTE/NES/HEIW/NIMDTA about matters that are relevant to my teaching, training or personal development."
  },
  {
    id: "isDeclareEngage",
    label:
      "Where applicable, I will fully engage with immigration and employer requirements relating to skilled worker visas (formerly Tier 2 and Tier 4 UK visas)."
  }
];

export const FORMR_PARTA_DECLARATIONS = [
  CCT_DECLARATION,
  "I will be seeking specialist registration by application for a CESR",
  "I will be seeking specialist registration by application for a CESR CP",
  "I will be seeking specialist registration by application for a CEGPR",
  "I will be seeking specialist registration by application for a CEGPR CP",
  "I am a CORE trainee, not yet eligible for CCT"
];

export const FORMR_PARTB_ACCEPTANCE =
  "This form is a true and accurate declaration at this point in time and will immediately notify the Deanery/HEE local team and my employer if I am aware of any changes to the information provided in this form.";

export const FORMR_PARTB_CONSENT =
  "I give permission for my past and present ARCP/RITA portfolios and / or appraisal documentation to be viewed by my Responsible Officer and any appropriate person nominated by the Responsible Officer. Additionally if my Responsible Officer or Designated Body changes during my training period, I give permission for my current Responsible Officer to share this information with my new Responsible Officer for the purposes of Revalidation.";

export const COVID_RESULT_DECLARATIONS = [
  {
    label:
      "Below expectations for stage of training - needs further development"
  },
  {
    label:
      "Satisfactory progress meeting expectations for stage of training but some required competencies not met due to COVID 19"
  },
  {
    label:
      "Satisfactory progress for stage of training and required competencies met"
  }
];

export const NEED_DISCUSSION_WITH_SUPERVISOR =
  "I would like to have discussion about my training or current situation with my supervisor";

export const NEED_DISCUSSION_WITH_SOMEONE =
  "I have concerns with my training and / or wellbeing at the moment and would like to discuss with someone";

export const IMMIGRATION_STATUS_OTHER_TISIDS = ["12", "13"];

export const CHECK_PHONE_REGEX = /^\+?(?:\d\s?){10,15}$/;

export const CHECK_WHOLE_TIME_EQUIVALENT_REGEX =
  /^((0\.[1-9])?|(0\.(\d[1-9]|[1-9]\d))|1(\.0{1,2})?)$/;

export const CHECK_POSTCODE_REGEX = /[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}/i;

export const VALUE_NOT_GIVEN = "Value not given";

export const NEW_WORK: Work = {
  typeOfWork: "",
  startDate: "",
  endDate: "",
  trainingPost: "",
  site: "",
  siteLocation: "",
  siteKnownAs: ""
};

export const NEW_DECLARATION: Declaration = {
  declarationType: undefined,
  dateOfEntry: undefined,
  title: "",
  locationOfEntry: ""
};

export type PanelKeys = {
  placements: string;
  programmeMemberships: string;
  site: string;
  siteLocation: string;
  siteKnownAs: string;
  otherSites: string;
  startDate: string;
  endDate: string;
  wholeTimeEquivalent: string;
  specialty: string;
  subSpecialty: string;
  grade: string;
  placementType: string;
  employingBody: string;
  trainingBody: string;
  programmeName: string;
  programmeNumber: string;
  managingDeanery: string;
  programmeMembershipType: string;
  curricula: string;
  conditionsOfJoining: string;
};

export const PANEL_KEYS: any = {
  placements: "Placements",
  programmememberships: "Programmes",
  programmeMemberships: "Programmes",
  site: "Site",
  siteLocation: "Site Location",
  siteKnownAs: "Site Known As",
  otherSites: "Other Sites",
  startDate: "Starts",
  endDate: "Ends",
  wholeTimeEquivalent: "Whole Time Equivalent",
  specialty: "Specialty",
  subSpecialty: "Sub specialty",
  otherSpecialties: "Other Specialties",
  grade: "Grade",
  placementType: "Placement Type",
  employingBody: "Employing Body",
  trainingBody: "Training Body",
  programmeName: "Programme Name",
  programmeNumber: "Programme Number",
  managingDeanery: "Owner",
  responsibleOfficer: "Responsible Officer",
  trainingNumber: "Training Number (NTN/DRN)",
  programmeMembershipType: "Type",
  curricula: "Curricula",
  conditionsOfJoining: "Conditions of Joining"
};

const dodgyConnection = "Please check your internet connection and try again.";

export const toastErrText = {
  deleteFormA: "Couldn't delete your draft Form R (Part A).",
  deleteFormB: "Couldn't delete your draft Form R (Part B).",
  fetchFeatureFlags:
    "Couldn't load some of your new form data (feature flags).",
  fetchForms: " Couldn't load your list of saved forms.",
  fetchReference:
    "Couldn't fetch the data to pre-populate your new form (reference data).",
  loadSavedFormA: "Couldn't load your saved Form R (Part A).",
  loadSavedFormB: "Couldn't load your saved Form R (Part B).",
  saveFormA: "Couldn't save your Form R (Part A).",
  saveFormB: "Couldn't save your Form R (Part B).",
  updateFormA: "Couldn't update your Form R (Part A).",
  updateFormB: "Couldn't update your Form R (Part B).",
  fetchTraineeProfileData:
    "Couldn't load your personal details (profile data).",
  updateUserAttributes:
    "Couldn't update your user information (user attributes).",
  verifyPhone: "Couldn't send you an SMS code to sign in (verify phone).",
  verifyUserAttributeSubmit:
    "verify your identification with that code (user attributes).",
  setPreferredMfa:
    "Couldn't set your preferred MFA method and log in (user attributes).",
  updateTotpCode:
    "Couldn't continue. MFA set-up session has expired. Please refresh the page and try again.",
  verifyTotp:
    "Couldn't verify your identification with that Authentication code.",
  signCoj: "Couldn't sign your Conditions of Joining.",
  fetchTraineeActionsData: "Couldn't load your task checklist (to-do actions).",
  completeTraineeAction: "Couldn't update trainee actions.",
  fetchAllNotifications: "Couldn't load your notifications.",
  markNotificationAsRead: `Couldn't open this message and mark as read. ${dodgyConnection}`,
  markNotificationAsUnread: `Couldn't mark this message as unread. ${dodgyConnection}`,
  archiveNotification: `Couldn't archive this message. ${dodgyConnection}`,
  fetchNotificationMessage: `Couldn't load this message. ${dodgyConnection}`,
  loadCctSummaryListMessage: `Couldn't load your list of saved calculations. ${dodgyConnection}`,
  loadSavedCctCalcMessage: `Couldn't load your saved calculation. ${dodgyConnection}`,
  saveCctCalcMessage: `Couldn't save your CCT calculation. ${dodgyConnection}`,
  updateCctCalcMessage: `Couldn't update your CCT calculation. ${dodgyConnection}`,
  loadLtftSummaryListMessage: `Couldn't load your list of saved Changing hours (LTFT) forms. ${dodgyConnection}`
};

export const toastSuccessText = {
  deleteFormA: "Your draft Form R (Part A) has been deleted.",
  deleteFormB: "Your draft Form R (Part B) has been deleted.",
  saveFormA: "Your Form R (Part A) has been saved.",
  saveFormB: "Your Form R (Part B) has been saved.",
  updateFormA: "Your Form R (Part A) has been updated.",
  updateFormB: "Your Form R (Part B) has been updated.",
  submitFormA: "Your Form R (Part A) has been submitted.",
  submitFormB: "Your Form R (Part B) has been submitted.",
  verifyPhone:
    "Your phone has been verified. An SMS code from HEE should arrive soon",
  getPreferredMfaSms:
    "SMS MFA is now set up. When prompted, provide a new 6-digit code (sent to your phone) when you next log in.",
  getPreferredMfaTotp:
    "Authenticator MFA is now set up. When prompted, provide a new 6-digit code from your app when you next log in.",
  signCoj: "Your Conditions of Joining has been signed.",
  completeTraineeAction: "Your Outstanding Action has been updated.",
  saveCctCalcMessage: "Your CCT calculation has been saved.",
  updateCctCalcMessage: "Your CCT calculation has been updated."
};

export const supportCatOptions = [
  { value: "Authenticator", label: "Authenticator" },
  { value: "Conditions of Joining", label: "Conditions of Joining" },
  { value: "Data Quality", label: "Data Quality" },
  { value: "Digital Staff Passport", label: "Digital Staff Passport" },
  { value: "FormR", label: "FormR" },
  { value: "Login", label: "Login" },
  { value: "Personal data", label: "Personal data" },
  { value: "Placement data", label: "Placement data" },
  { value: "Programme data", label: "Programme data" },
  { value: "Sign up", label: "Sign up" },
  { value: "SMS", label: "SMS" }
];

type localOfficeContactsProps = {
  [key: string]: string;
};

export const localOfficeContacts: localOfficeContactsProps = {
  "East Midlands": "england.tis.em@nhs.net",
  "East of England": "england.tis.eoe@nhs.net",
  "Kent, Surrey and Sussex": "PGMDE support portal",
  "North Central and East London": "PGMDE support portal",
  "North East": "england.specialtytraining.ne@nhs.net",
  "North West": "england.wpi.nw@nhs.net",
  "North West London": "PGMDE support portal",
  "South London": "PGMDE support portal",
  "South West": "england.tisqueries.sw@nhs.net",
  "Thames Valley": "england.formr.tv@nhs.net",
  Wessex: "england.formr.wx@nhs.net",
  "West Midlands": "england.tis.wm@nhs.net",
  "Yorkshire and the Humber": "england.tis.yh@nhs.net"
};

export const strDateRegex = /^\d{4}-\d{2}-\d{2}$/;

// Onboarding Tracker Actions
const welcomeEmailText =
  "Receive 'Welcome' email 16 weeks prior to starting in post";
const royalSocietyText = "Register with Royal Society/ Faculty";
const reviewProgrammeText = "Review your Programme data";
const signCojText = "Sign Conditions of Joining (CoJ) Agreement";
const formRPartAText = "Submit Form R (Part A)";
const formRPartBText = "Submit Form R (Part B)";
const trainingNumberText =
  "Your Training Number (NTN/DRN) is made available in Programme details";
const ltftText =
  "Apply for Less Than Full Time (LTFT). See notification for details.";
const deferText = "Deferral. See notification for details.";
const placementConfirmationText =
  "Receive 'Placement Confirmation' email 12 weeks prior to starting in post";
const reviewPlacementText = "Review your Placement details";
const dayOneEmailText = "Receive 'Day One' email when your post begins";
const connectRoText =
  "Connect with your Responsible Officer (RO)/ Designated Body (DB)";

export const onboardingTrackerActionText = {
  WELCOME_EMAIL: {
    actionText: welcomeEmailText,
    textLink: null,
    faIcon: faEnvelope
  },
  ROYAL_SOCIETY_REGISTRATION: {
    actionText: royalSocietyText,
    faIcon: faUserFriends,
    textLink: null
  },
  REVIEW_PROGRAMME: {
    actionText: reviewProgrammeText,
    textLink: "/programmes",
    faIcon: faCircle
  },
  SIGN_COJ: {
    actionText: signCojText,
    textLink: "/programmes",
    faIcon: faCircle
  },
  FORMR_PARTA: {
    actionText: formRPartAText,
    textLink: "/formr-a",
    faIcon: faCircle
  },
  FORMR_PARTB: {
    actionText: formRPartBText,
    textLink: "/formr-b",
    faIcon: faCircle
  },
  TRAINING_NUMBER: {
    actionText: trainingNumberText,
    textLink: "/programmes",
    faIcon: faShare
  },
  LTFT: {
    actionText: ltftText,
    textLink: "/notifications",
    faIcon: faCircleQuestion
  },
  DEFER: {
    actionText: deferText,
    textLink: "/notifications",
    faIcon: faCircleQuestion
  },
  PLACEMENT_CONFIRMATION: {
    actionText: placementConfirmationText,
    textLink: null,
    faIcon: faEnvelope
  },
  REVIEW_PLACEMENT: {
    actionText: reviewPlacementText,
    textLink: "/placements",
    faIcon: faCircle
  },
  DAY_ONE_EMAIL: {
    actionText: dayOneEmailText,
    textLink: null,
    faIcon: faEnvelope
  },
  CONNECT_RO: {
    actionText: connectRoText,
    textLink: null,
    faIcon: faUserFriends
  }
};

export type ProgOnboardingTagType =
  | "WELCOME_EMAIL"
  | "ROYAL_SOCIETY_REGISTRATION"
  | "REVIEW_PROGRAMME"
  | "SIGN_COJ"
  | "FORMR_PARTA"
  | "FORMR_PARTB"
  | "TRAINING_NUMBER"
  | "LTFT"
  | "DEFER"
  | "PLACEMENT_CONFIRMATION"
  | "REVIEW_PLACEMENT"
  | "DAY_ONE_EMAIL"
  | "CONNECT_RO";

const formRTxt =
  " (and sign your Conditions of Joining Agreement), your Training Number will be made available in the Details section of your ";

export const onboardingTrackerInfoText = {
  WELCOME_EMAIL: (
    <p>
      The Welcome email is sent to the email address you use to sign in to TIS
      Self-Service.
    </p>
  ),
  ROYAL_SOCIETY_REGISTRATION: (
    <p>
      Royal Society / Faculty registration is done outside of TIS Self-Service.
    </p>
  ),
  REVIEW_PROGRAMME: (
    <p>
      If you do notice any discrepancies when reviewing the{" "}
      <Link to="/programmes">Programme</Link> data, please contact{" "}
      <Link to="/support">Local Office support</Link>.
    </p>
  ),
  SIGN_COJ: (
    <>
      <p>
        You can sign / view the signed Conditions of Joining Agreement via the
        link in the Details section of your{" "}
        <Link to="/programmes">Programme</Link>.
      </p>
      <p>
        When you sign your Conditions of Joining Agreement (and submit your
        FormR Parts A & B), your Training Number will be made available in the
        Details section of your <Link to="/programmes">Programme</Link>.
      </p>
    </>
  ),
  FORMR_PARTA: (
    <p>
      When you submit your <Link to="/formr-a">FormR Part A</Link> & Part B
      {formRTxt}
      <Link to="/programmes">Programme</Link>.
    </p>
  ),
  FORMR_PARTB: (
    <p>
      When you submit your <Link to="/formr-b">FormR Part B</Link> & Part A
      {formRTxt}
      <Link to="/programmes">Programme</Link>.
    </p>
  ),
  TRAINING_NUMBER: (
    <p>
      Your training number is made available in the Details section of your{" "}
      <Link to="/programmes">Programme</Link> when you: (1) Sign your Conditions
      of Joining Agreement, (2) Submit FormR (Part A & B).
    </p>
  ),
  LTFT: (
    <p>
      To learn more about the Less Than Full Time (LTFT) application process,
      please look for the LTFT message in your{" "}
      <Link to="/notifications">Notifications</Link>.
    </p>
  ),
  DEFER: (
    <p>
      To learn more about the Deferral process, please look for the Defer
      message in your <Link to="/notifications">Notifications</Link>.
    </p>
  ),
  PLACEMENT_CONFIRMATION: (
    <p>
      The 'Placement Confirmation' email is sent to the email address you use to
      sign in to TIS Self-Service.
    </p>
  ),
  REVIEW_PLACEMENT: (
    <>
      <p>
        When you receive the 'Placement Confirmation' email 12 weeks before your
        start date, your Placement should be in{" "}
        <Link to="/placements">Upcoming Placements</Link> for you to review.
      </p>
      <p>
        If you do notice any discrepancies when reviewing the Placement details,
        please contact <Link to="/support">Local Office support</Link>.
      </p>
    </>
  ),
  DAY_ONE_EMAIL: (
    <p>
      The 'Day One' email is sent to email address you use to sign in to TIS
      Self-Service.
    </p>
  ),
  CONNECT_RO: (
    <p>Connecting with your RO/DB is done outside of TIS Self-Service.</p>
  )
};

export const getProfilePanelFutureWarningText = (
  profileName: string
): string => {
  return `The information we have for future ${profileName} with a start date more than 12 weeks from today is not yet finalised and may be subject to change.`;
};

export const fteOptions = [
  { value: 100, label: "100%" },
  { value: 80, label: "80%" },
  { value: 70, label: "70%" },
  { value: 60, label: "60%" },
  { value: 50, label: "50%" }
];
