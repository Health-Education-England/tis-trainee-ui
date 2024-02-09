import { useAppSelector } from "../../../redux/hooks/hooks";
import {
  OutstandingSummaryActions,
  getAllOutstandingSummaryActions
} from "../../ActionSummaryUtilities";

export function useOutstandingActions() {
  const unsignedCojs = useAppSelector(
    state => state.traineeProfile.unsignedCojs
  );
  const traineeActionsData = useAppSelector(
    state => state.traineeActions.traineeActionsData
  );

  const { unsignedCojCount, incompleteActionCount }: OutstandingSummaryActions =
    getAllOutstandingSummaryActions(unsignedCojs, traineeActionsData);

  return { unsignedCojCount, incompleteActionCount };
}
