import { useAppSelector } from "../../../redux/hooks/hooks";
import {
  OutstandingSummaryActions,
  getAllOutstandingSummaryActions
} from "../../ActionSummaryUtilities";

export function useOutstandingActions() {
  const unsignedCojs = useAppSelector(
    state => state.traineeProfile.unsignedCojs
  );

  const { unsignedCojCount }: OutstandingSummaryActions =
    getAllOutstandingSummaryActions(unsignedCojs);

  return { unsignedCojCount };
}
