import { OnboardingTrackerType } from "../models/Tracker";

export const mockOnboardingTrackerStatus1: OnboardingTrackerType = {
  programmeMembershipId: "a6de88b8-de41-48dd-9492-a518f5001176",
  traineeTisId: "47165",
  trackerStatus: [
    {
      action: "WELCOME_EMAIL",
      state: "completed",
      date: new Date("2024-08-17")
    },
    {
      action: "ROYAL_SOCIETY_REGISTRATION",
      state: "not tracked",
      date: null
    },
    {
      action: "REVIEW_PROGRAMME",
      state: "completed",
      date: new Date("2024-08-18")
    },
    {
      action: "SIGN_COJ",
      state: "incomplete",
      date: null
    },
    {
      action: "FORMR_PARTA",
      state: "not tracked", // if tracker tracks then only show the state (and date) if the form is linked to this programme?
      date: null
    },
    {
      action: "FORMR_PARTB",
      state: "not tracked", // (as above)
      date: null
    },
    {
      action: "TRAINING_NUMBER",
      state: "not tracked", // if the tracker tracks formr status then the default state is "not available" until conditions met (this action will be greyed-out until then)
      date: null
    },
    {
      action: "LTFT",
      state: "not tracked",
      date: null
    },
    {
      action: "DEFER",
      state: "not tracked",
      date: null
    },
    {
      action: "PLACEMENT_CONFIRMATION",
      state: "not available",
      date: null
    },
    {
      action: "REVIEW_PLACEMENT",
      state: "not available",
      date: null
    },
    {
      action: "DAY_ONE_EMAIL",
      state: "not available",
      date: null
    },
    {
      action: "CONNECT_RO",
      state: "not tracked",
      date: null
    }
  ]
};
