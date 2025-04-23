import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks/hooks";
import { fetchTraineeProfileData } from "../../redux/slices/traineeProfileSlice";
import { fetchReference } from "../../redux/slices/referenceSlice";
import { fetchFeatureFlags } from "../../redux/slices/featureFlagsSlice";
import {
  fetchUserAuthInfo,
  getPreferredMfa
} from "../../redux/slices/userSlice";

export const useCriticalDataLoader = () => {
  const dispatch = useAppDispatch();
  const [authActionsDispatched, setAuthActionsDispatched] = useState(false);

  // Get all critical data statuses
  const traineeProfileStatus = useAppSelector(
    state => state.traineeProfile.status
  );
  const referenceStatus = useAppSelector(state => state.reference.status);
  const featureFlagsStatus = useAppSelector(state => state.featureFlags.status);
  const userStatus = useAppSelector(state => state.user.status);

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

  // Fetch user auth data if not already dispatched
  useEffect(() => {
    if (!authActionsDispatched) {
      dispatch(getPreferredMfa());
      dispatch(fetchUserAuthInfo());
      setAuthActionsDispatched(true);
    }
  }, [authActionsDispatched, dispatch]);

  const isCriticalLoading =
    traineeProfileStatus === "loading" ||
    referenceStatus === "loading" ||
    featureFlagsStatus === "loading" ||
    userStatus === "loading";

  const isCriticalSuccess =
    traineeProfileStatus === "succeeded" &&
    referenceStatus === "succeeded" &&
    featureFlagsStatus === "succeeded" &&
    (userStatus === "succeeded" || userStatus === "idle");

  const hasCriticalError =
    traineeProfileStatus === "failed" ||
    referenceStatus === "failed" ||
    featureFlagsStatus === "failed" ||
    userStatus === "failed";

  return {
    isCriticalLoading,
    isCriticalSuccess,
    hasCriticalError
  };
};
