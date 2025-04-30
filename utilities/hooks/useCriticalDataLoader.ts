import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks/hooks";
import { fetchTraineeProfileData } from "../../redux/slices/traineeProfileSlice";
import { fetchReference } from "../../redux/slices/referenceSlice";
import { fetchFeatureFlags } from "../../redux/slices/featureFlagsSlice";

export const useCriticalDataLoader = () => {
  const dispatch = useAppDispatch();

  // Get all critical data statuses
  const traineeProfileStatus = useAppSelector(
    state => state.traineeProfile.status
  );
  const referenceStatus = useAppSelector(state => state.reference.status);
  const featureFlagsStatus = useAppSelector(state => state.featureFlags.status);

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

  const isCriticalLoading =
    traineeProfileStatus === "loading" ||
    referenceStatus === "loading" ||
    featureFlagsStatus === "loading";

  const isCriticalSuccess =
    traineeProfileStatus === "succeeded" &&
    referenceStatus === "succeeded" &&
    featureFlagsStatus === "succeeded";

  const hasCriticalError =
    traineeProfileStatus === "failed" ||
    referenceStatus === "failed" ||
    featureFlagsStatus === "failed";

  return {
    isCriticalLoading,
    isCriticalSuccess,
    hasCriticalError
  };
};
