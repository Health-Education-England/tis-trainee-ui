import { OnboardingActionStatus } from "../models/Tracker";
import { GroupedTraineeActionsForProgramme } from "../models/TraineeAction";
import {
  ProgOnboardingTagType,
  traineeActionsCompletedWhenNotOutstanding
} from "./Constants";

export function getActionStatus(
  actionTag: ProgOnboardingTagType,
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
  details: Record<ProgOnboardingTagType, OnboardingActionStatus>;
} {
  const dependentActions: ProgOnboardingTagType[] = [
    "SIGN_COJ",
    "SIGN_FORM_R_PART_A",
    "SIGN_FORM_R_PART_B"
  ];

  const details: Record<ProgOnboardingTagType, OnboardingActionStatus> =
    {} as Record<ProgOnboardingTagType, OnboardingActionStatus>;

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
