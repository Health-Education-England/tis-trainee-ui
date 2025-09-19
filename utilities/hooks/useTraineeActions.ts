import { GroupedTraineeActionsForProgramme } from "../../models/TraineeAction";
import { useAppSelector } from "../../redux/hooks/hooks";
import { groupAllActionsByProgrammeMembership } from "../../utilities/TraineeActionsUtilities";

export function useTraineeActions(panelId?: string) {
  let filteredActionsBelongingToThisProg: GroupedTraineeActionsForProgramme = {
    "Programme ID": "",
    "Programme Membership name": "",
    "Outstanding actions": []
  };
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

  if (panelId) {
    filteredActionsBelongingToThisProg = groupedOutstandingActions.filter(
      group => group["Programme ID"] === panelId
    )[0] || { actions: [] };
  }

  return {
    groupedOutstandingActions,
    hasOutstandingActions: groupedOutstandingActions.length > 0,
    filteredActionsBelongingToThisProg
  };
}
