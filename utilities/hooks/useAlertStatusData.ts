import { useAppSelector } from "../../redux/hooks/hooks";
import { useInfoActions } from "./action-summary/useInfoActions";
import { useInProgressActions } from "./action-summary/useInProgressActions";
import { useOutstandingActions } from "./action-summary/useOutstandingActions";

export interface AlertStatusData {
  unsignedCoJ: boolean;
  inProgressFormR: boolean;
  importantInfo: boolean;
  unreviewedProgramme: boolean;
  unreviewedPlacement: boolean;
  showActionsSummaryAlert: boolean;
}

export function useAlertStatusData(): AlertStatusData {
  // ACTION SUMMARY
  const draftFormProps = !!useAppSelector(state => state.forms?.draftFormProps);
  const { unsignedCojCount, programmeActions, placementActions } =
    useOutstandingActions();
  const unsignedCoJ = unsignedCojCount > 0;
  const unreviewedProgramme = programmeActions.length > 0;
  const unreviewedPlacement = placementActions.length > 0;

  const { isInProgressFormA, isInProgressFormB } = useInProgressActions();
  const inProgressFormR =
    isInProgressFormA || isInProgressFormB || draftFormProps;

  const { noSubFormRA, noSubFormRB, infoActionsA, infoActionsB } =
    useInfoActions();
  const importantInfo: boolean =
    !!infoActionsA.isForInfoYearPlusSubForm ||
    !!infoActionsB.isForInfoYearPlusSubForm ||
    noSubFormRA ||
    noSubFormRB;

  const showActionsSummaryAlert =
    unsignedCoJ ||
    inProgressFormR ||
    draftFormProps ||
    importantInfo ||
    unreviewedProgramme ||
    unreviewedPlacement;

  return {
    unsignedCoJ,
    inProgressFormR,
    importantInfo,
    unreviewedProgramme,
    unreviewedPlacement,
    showActionsSummaryAlert
  };
}
