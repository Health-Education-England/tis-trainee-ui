import { useAppSelector } from "../../../redux/hooks/hooks";
import {
  OutstandingSummaryActions,
  getAllOutstandingSummaryActions
} from "../../ActionSummaryUtilities";

export function useOutstandingActions() {
  const unsignedCojs = useAppSelector(
    state => state.traineeProfile.unsignedCojs
  );
  const incompleteActions = useAppSelector(
    state => state.traineeProfile.incompleteActions
  );

  const { unsignedCojCount, incompleteActionCount }: OutstandingSummaryActions =
    getAllOutstandingSummaryActions(unsignedCojs, incompleteActions);

  return { unsignedCojCount, incompleteActionCount };
}
