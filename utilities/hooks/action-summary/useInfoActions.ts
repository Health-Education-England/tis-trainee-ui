import { useAppSelector } from "../../../redux/hooks/hooks";
import { getAllInfoFormRSubmissionSummaryActions } from "../../../utilities/ActionSummaryUtilities";

export function useInfoActions() {
  const formAList = useAppSelector(state => state.formA.formAList);
  const formBList = useAppSelector(state => state.formB.formBList);

  const { noSubFormRA, noSubFormRB, infoActionsA, infoActionsB } =
    getAllInfoFormRSubmissionSummaryActions(formAList, formBList);

  return {
    noSubFormRA,
    noSubFormRB,
    infoActionsA,
    infoActionsB
  };
}
