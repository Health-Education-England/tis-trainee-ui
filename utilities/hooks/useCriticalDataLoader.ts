import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks/hooks";
import { fetchTraineeProfileData } from "../../redux/slices/traineeProfileSlice";
import { fetchReference } from "../../redux/slices/referenceSlice";
import { fetchFeatureFlags } from "../../redux/slices/featureFlagsSlice";
import { fetchTraineeActionsData } from "../../redux/slices/traineeActionsSlice";

export const useCriticalDataLoader = () => {
  const dispatch = useAppDispatch();

  // Get all critical data statuses
  const traineeProfileStatus = useAppSelector(
    state => state.traineeProfile.status
  );
  const referenceStatus = useAppSelector(state => state.reference.status);
  const featureFlagsStatus = useAppSelector(state => state.featureFlags.status);
  const traineeActionsStatus = useAppSelector(
    state => state.traineeActions.status
  );

  useEffect(() => {
    if (traineeProfileStatus === "idle") {
      dispatch(fetchTraineeProfileData());
    }
  }, [traineeProfileStatus, dispatch]);

  useEffect(() => {
    if (referenceStatus === "idle") {
      dispatch(fetchReference());
    }
  }, [referenceStatus, dispatch]);

  useEffect(() => {
    if (featureFlagsStatus === "idle") {
      dispatch(fetchFeatureFlags());
    }
  }, [featureFlagsStatus, dispatch]);

  useEffect(() => {
    if (traineeActionsStatus === "idle") {
      dispatch(fetchTraineeActionsData());
    }
  }, [traineeActionsStatus, dispatch]);

  const isCriticalLoading =
    traineeProfileStatus === "loading" ||
    referenceStatus === "loading" ||
    featureFlagsStatus === "loading" ||
    traineeActionsStatus === "loading";

  const isCriticalSuccess =
    traineeProfileStatus === "succeeded" &&
    referenceStatus === "succeeded" &&
    featureFlagsStatus === "succeeded" &&
    traineeActionsStatus === "succeeded";

  const hasCriticalError =
    traineeProfileStatus === "failed" ||
    referenceStatus === "failed" ||
    featureFlagsStatus === "failed" ||
    traineeActionsStatus === "failed";

  return {
    isCriticalLoading,
    isCriticalSuccess,
    hasCriticalError
  };
};
