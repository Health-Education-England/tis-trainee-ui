import { Declaration, Work } from "../models/FormRPartB";

export const CCT_DECLARATION =
  "I have been appointed to a programme leading to award of CCT";

export const MEDICAL_CURRICULUM = "MEDICAL_CURRICULUM";

export const YES_NO_OPTIONS = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" }
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

export const COJ_DECLARATIONS = [
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
  "Below expectations for stage of training - needs further development",
  "Satisfactory progress meeting expectations for stage of training but some required competencies not met due to COVID 19",
  "Satisfactory progress for stage of training and required competencies met"
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

export const GOLD_GUIDE_VERSION_REGEX = /^GG(\d+)$/;

export const VALUE_NOT_GIVEN = "Value not given";

export const NEW_WORK: Work = {
  typeOfWork: "",
  startDate: "",
  endDate: "",
  trainingPost: "",
  site: "",
  siteLocation: ""
};

export const NEW_DECLARATION: Declaration = {
  declarationType: undefined,
  dateOfEntry: undefined,
  title: "",
  locationOfEntry: ""
};

export const dialogBoxWarnings = {
  formSubMsg:
    "Please think carefully before submitting as the current process for deleting or re-submitting a new form isn't straightforward. You can save a draft copy if needed. But if you are ready to submit then please click OK."
};

export type PanelKeys = {
  placements: string;
  programmeMemberships: string;
  site: string;
  siteLocation: string;
  startDate: string;
  endDate: string;
  wholeTimeEquivalent: string;
  specialty: string;
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
  programmeMemberships: "Programmes",
  site: "Site",
  siteLocation: "Site Location",
  startDate: "Starts",
  endDate: "Ends",
  wholeTimeEquivalent: "Whole Time Equivalent",
  specialty: "Specialty",
  grade: "Grade",
  placementType: "Placement Type",
  employingBody: "Employing Body",
  trainingBody: "Training Body",
  programmeName: "Programme Name",
  programmeNumber: "Programme Number",
  managingDeanery: "Owner",
  programmeMembershipType: "Type",
  curricula: "Curricula",
  conditionsOfJoining: "Conditions of Joining"
};
