import { nanoid } from "nanoid";
import { issueDspCredential } from "../redux/slices/dspSlice";
import store from "../redux/store/store";

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
