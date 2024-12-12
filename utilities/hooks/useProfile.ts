import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { resetMfaJourney } from "../../redux/slices/userSlice";
import { fetchCredentials } from "../../utilities/DspUtilities";

import { CredentialDspType } from "../../models/Dsp";

export const useProfile = (fetchType: CredentialDspType) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetMfaJourney());
  }, [dispatch]);

  useEffect(() => {
    fetchCredentials(fetchType);
  }, []);

  const preferredMfa = useAppSelector(state => state.user.preferredMfa);
  const dspStatus = useAppSelector(state => state.dsp.status);

  return { preferredMfa, dspStatus };
};
