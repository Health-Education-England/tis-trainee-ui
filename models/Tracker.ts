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

export type OnboardingActionState =
  | "incomplete"
  | "completed"
  | "unsubmitted"
  | "submitted"
  | "draft"
  | "not available"
  | "not tracked"
  | null;

export type OnboardingTrackerStatusActionType = {
  action: OnboardingActionType;
  state: OnboardingActionState;
  date: Date | null;
};

export type OnboardingTrackerType = {
  programmeMembershipId: string;
  traineeTisId: string;
  trackerStatus: OnboardingTrackerStatusActionType[];
};
