import { useAppSelector } from "../../redux/hooks/hooks";
import { groupAllActionsByProgrammeMembership } from "../../utilities/TraineeActionsUtilities";

export function useTraineeActions() {
  const traineeProfile = useAppSelector(
    state => state.traineeProfile.traineeProfileData
  );

  const programmeMemberships = traineeProfile.programmeMemberships;
  const traineeOutstandingActions = useAppSelector(
    state => state.traineeActions.traineeActionsData
  );
  const groupedOutstandingActions = groupAllActionsByProgrammeMembership(
    traineeOutstandingActions,
    programmeMemberships,
    traineeProfile
  );

  return {
    groupedOutstandingActions,
    hasOutstandingActions: groupedOutstandingActions.length > 0
  };
}
