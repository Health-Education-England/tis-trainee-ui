export type OnboardingActionType =
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

export type OnboardingActionStatus =
  | "outstanding"
  | "completed"
  | "not available"
  | "not tracked"
  | null;
