import dayjs from "dayjs";
import { UserFeaturesType } from "../models/FeatureFlags";
import { OnboardingActionStatus, TrackerActionType } from "../models/Tracker";
import { GroupedTraineeActionsForProgramme } from "../models/TraineeAction";
import { traineeActionsCompletedWhenNotOutstanding } from "./Constants";

export function getActionStatus(
  actionTag: TrackerActionType,
  filteredActionsBelongingToThisProg: GroupedTraineeActionsForProgramme
): OnboardingActionStatus {
  if (actionTag === "TRAINING_NUMBER") {
    return calcTrainingNumStatus(filteredActionsBelongingToThisProg)
      .overallStatus;
  }

  let isOutstanding = false;
  if (actionTag === "REVIEW_PLACEMENT") {
    isOutstanding = isReviewActionOutstanding(
      filteredActionsBelongingToThisProg,
      "PLACEMENT"
    );
  } else if (actionTag === "REVIEW_PROGRAMME") {
    isOutstanding = isReviewActionOutstanding(
      filteredActionsBelongingToThisProg,
      "PROGRAMME_MEMBERSHIP"
    );
  } else {
    isOutstanding = filteredActionsBelongingToThisProg[
      "Outstanding actions"
    ]?.some(action => action.type === actionTag);
  }

  if (isOutstanding) {
    return "outstanding";
  }
  if (traineeActionsCompletedWhenNotOutstanding.includes(actionTag)) {
    return "completed";
  }
  return "not tracked";
}

export function calcTrainingNumStatus(
  filteredActionsBelongingToThisProg: GroupedTraineeActionsForProgramme
): {
  overallStatus: OnboardingActionStatus;
  details: Record<TrackerActionType, OnboardingActionStatus>;
} {
  const dependentActions: TrackerActionType[] = [
    "SIGN_COJ",
    "SIGN_FORM_R_PART_A",
    "SIGN_FORM_R_PART_B"
  ];

  const details: Record<TrackerActionType, OnboardingActionStatus> =
    {} as Record<TrackerActionType, OnboardingActionStatus>;

  for (const depTag of dependentActions) {
    const isOutstanding = filteredActionsBelongingToThisProg[
      "Outstanding actions"
    ]?.some(action => action.type === depTag);
    details[depTag] = isOutstanding ? "outstanding" : "completed";
  }

  const isAnyOutstanding = Object.values(details).some(
    status => status === "outstanding"
  );
  const overallStatus: OnboardingActionStatus = isAnyOutstanding
    ? "outstanding"
    : "completed";

  return { overallStatus, details };
}

function isReviewActionOutstanding(
  filteredActions: GroupedTraineeActionsForProgramme,
  tisReferenceType: string
): boolean {
  return filteredActions["Outstanding actions"]?.some(
    action =>
      action.type === "REVIEW_DATA" &&
      action.tisReferenceInfo?.type === tisReferenceType
  );
}

const actionFeatureMap: Record<
  TrackerActionType,
  (features: UserFeaturesType) => boolean
> = {
  WELCOME_EMAIL: () => true,
  WELCOME: () => true,
  REVIEW_PROGRAMME: () => true,
  SIGN_COJ: features => features.details.programmes.conditionsOfJoining.enabled,
  SIGN_FORM_R_PART_A: features => features.forms.formr.enabled,
  SIGN_FORM_R_PART_B: features => features.forms.formr.enabled,
  TRAINING_NUMBER: () => true, // TODO: not sure about this for non-specialty users?
  LTFT: features => features.forms.ltft.enabled,
  DEFERRAL: () => true, // TODO: not sure about this for non-specialty users?
  PLACEMENT_CONFIRMATION: () => true,
  REVIEW_PLACEMENT: () => true,
  DAY_ONE_EMAIL: () => true,
  DAY_ONE: () => true
};

export function getTrackerSections(userFeatures: UserFeaturesType) {
  const baseSections = [
    {
      digit: 1,
      headerName: "Welcome (16 weeks)",
      color: "#002D88",
      isActive: (startDate: string) =>
        dayjs(startDate)
          .startOf("day")
          .isSameOrBefore(dayjs().add(16, "weeks").startOf("day")),
      actions: [] as TrackerActionType[] // Will be filtered dynamically
    },
    {
      digit: 2,
      headerName: "Placement (12 weeks)",
      color: "#002D88",
      isActive: (startDate: string) =>
        dayjs(startDate)
          .startOf("day")
          .isSameOrBefore(dayjs().add(12, "weeks").startOf("day")),
      actions: [
        "PLACEMENT_CONFIRMATION",
        "REVIEW_PLACEMENT"
      ] as TrackerActionType[]
    },
    {
      digit: 3,
      headerName: "In post (Day One)",
      color: "#002D88",
      isActive: (startDate: string) =>
        dayjs(startDate).startOf("day").isSameOrBefore(dayjs().startOf("day")),
      actions: ["DAY_ONE_EMAIL", "DAY_ONE"] as TrackerActionType[]
    }
  ];

  // Define all possible actions for digit 1
  const all16WeekActions: TrackerActionType[] = [
    "WELCOME_EMAIL",
    "WELCOME",
    "REVIEW_PROGRAMME",
    "SIGN_COJ",
    "SIGN_FORM_R_PART_A",
    "SIGN_FORM_R_PART_B",
    "TRAINING_NUMBER",
    "LTFT",
    "DEFERRAL"
  ];

  // Note: Only 16 week actions need Filter I think?
  baseSections[0].actions = all16WeekActions.filter(action =>
    actionFeatureMap[action](userFeatures)
  );

  return baseSections;
}
