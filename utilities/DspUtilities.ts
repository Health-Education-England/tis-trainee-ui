import { nanoid } from "nanoid";
import {
  issueDspCredential,
  updatedCredentials
} from "../redux/slices/dspSlice";
import store from "../redux/store/store";
import { CredentialDspType } from "../models/Dsp";
import { mockDspPlacementCredentials } from "../mock-data/dsp-credentials";

async function dispatchIssueDspCredential(issueName: string, stateId: string) {
  await store.dispatch(issueDspCredential({ issueName, stateId }));
}

export async function handleIssueCredential(
  stateP: string,
  storedPName: string
) {
  localStorage.removeItem(stateP);
  const stateId = nanoid();
  const issueName = storedPName.slice(0, -1);
  await dispatchIssueDspCredential(issueName, stateId);
  const newIssueUri = store.getState().dsp.gatewayUri;
  return newIssueUri;
}

// TODO - remove temp function when API is ready
export function fetchCredentials(credentialType: CredentialDspType) {
  store.dispatch(updatedCredentials(mockDspPlacementCredentials));
}

// export async function fetchCredentials(credentialType: CredentialDspType) {
//   await store.dispatch(loadCredentials(credentialType));
// }
