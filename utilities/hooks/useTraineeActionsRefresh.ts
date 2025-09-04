import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import {
  fetchTraineeActionsData,
  setActionsRefreshNeeded
} from "../../redux/slices/traineeActionsSlice";

export const useTraineeActionsRefresh = () => {
  const dispatch = useAppDispatch();
  const refreshNeeded = useAppSelector(
    state => state.traineeActions.refreshNeeded
  );

  useEffect(() => {
    if (refreshNeeded) {
      dispatch(fetchTraineeActionsData());
      dispatch(setActionsRefreshNeeded(false));
    }
  }, [refreshNeeded, dispatch]);
};
