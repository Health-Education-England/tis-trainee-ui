import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { loadFormAList } from "../../redux/slices/formASlice";
import { loadFormBList } from "../../redux/slices/formBSlice";
import { fetchTraineeActionsData } from "../../redux/slices/traineeActionsSlice";

export const useActionsAndAlertsDataLoader = () => {
  const dispatch = useAppDispatch();
  const formAListStatus = useAppSelector(state => state.formA.status);
  const formBListStatus = useAppSelector(state => state.formB.status);
  const traineeActionsDataStatus = useAppSelector(
    state => state.traineeActions.status
  );

  useEffect(() => {
    if (formAListStatus === "idle") {
      dispatch(loadFormAList());
    }
  }, [dispatch, formAListStatus]);

  useEffect(() => {
    if (formBListStatus === "idle") {
      dispatch(loadFormBList());
    }
  }, [dispatch, formBListStatus]);

  useEffect(() => {
    if (traineeActionsDataStatus === "idle") {
      dispatch(fetchTraineeActionsData());
    }
  }, [dispatch, traineeActionsDataStatus]);

  // Determine overall loading state
  const isActionsAndAlertLoading =
    formAListStatus === "loading" ||
    formBListStatus === "loading" ||
    traineeActionsDataStatus === "loading";
  // Determine if all non-critical data has loaded successfully
  const isActionsAndAlertSuccess =
    formAListStatus === "succeeded" &&
    formBListStatus === "succeeded" &&
    traineeActionsDataStatus === "succeeded";
  // Check for any errors
  const isActionsAndAlertError =
    formAListStatus === "failed" ||
    formBListStatus === "failed" ||
    traineeActionsDataStatus === "failed";

  return {
    isActionsAndAlertLoading,
    isActionsAndAlertSuccess,
    isActionsAndAlertError
  };
};
