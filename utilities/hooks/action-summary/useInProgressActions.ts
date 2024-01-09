import { useAppSelector } from "../../../redux/hooks/hooks";
import { getAllInProgressSummaryActions } from "../../ActionSummaryUtilities";

export function useInProgressActions() {
  const formAList = useAppSelector(state => state.formA.formAList);
  const formBList = useAppSelector(state => state.formB.formBList);

  const { isInProgressFormA, isInProgressFormB } =
    getAllInProgressSummaryActions(formAList, formBList);

  return { isInProgressFormA, isInProgressFormB };
}
