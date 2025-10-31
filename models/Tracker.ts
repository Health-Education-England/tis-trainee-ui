export type TrackerActionType =
  | "WELCOME_EMAIL"
  | "WELCOME" // this is for ROYAL_SOCIETY_REGISTRATION details within the welcome notification
  | "REVIEW_PROGRAMME"
  | "SIGN_COJ"
  | "SIGN_FORM_R_PART_A"
  | "SIGN_FORM_R_PART_B"
  | "TRAINING_NUMBER"
  | "LTFT"
  | "DEFERRAL"
  | "PLACEMENT_CONFIRMATION"
  | "REVIEW_PLACEMENT"
  | "DAY_ONE_EMAIL"
  | "DAY_ONE";

export type OnboardingActionStatus =
  | "outstanding"
  | "completed"
  | "not available"
  | "not tracked"
  | null;
