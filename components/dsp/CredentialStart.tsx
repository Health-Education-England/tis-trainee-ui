import { Button, WarningCallout } from "nhsuk-react-components";
import { Redirect } from "react-router-dom";
import {
  issueDspCredential,
  verifyDspIdentity
} from "../../redux/slices/dspSlice";
import store from "../../redux/store/store";
import DSPPanel from "./DSPPanel";

const CredentialStart: React.FC = () => {
  const issueUri = store.getState().dsp.gatewayUri;
  const dspErrCode = store.getState().dsp.errorCode;
  const issuingState = store.getState().dsp.isIssuing;
  const storedPanelData = store.getState().dsp.dspPanelObj;
  const storedPanelName = store.getState().dsp.dspPanelObjName;

  if (issuingState && dspErrCode === "401") {
    return (
      <WarningCallout>
        <WarningCallout.Label visuallyHiddenText={false}>
          Important
        </WarningCallout.Label>
        <p>
          Before you can issue this credential to you DSP wallet you must verify
          your identity.
        </p>
        <DSPPanel profName={storedPanelName} profData={storedPanelData} />
        <Button
          onClick={() => {
            handleVerifyClick();
          }}
          data-cy="dspVerifyIdentity"
        >
          Click to verify your identity
        </Button>
      </WarningCallout>
    );
  }

  if (issuingState && issueUri) {
    return (
      <WarningCallout>
        <WarningCallout.Label visuallyHiddenText={false}>
          Important
        </WarningCallout.Label>
        <p>You are about to issue this credential to your DSP wallet.</p>
        <DSPPanel profName={storedPanelName} profData={storedPanelData} />
        <Button
          onClick={() => {
            window.location.href = issueUri;
          }}
          data-cy="dspIssueCred"
        >
          Click to add credential to your wallet
        </Button>
      </WarningCallout>
    );
  }
  localStorage.removeItem("verification");
  return <Redirect to="/home" />;
  // Note: No state param in URI when aborting verify ID in Gateway, so no key to access and remove DSP local storage data.
  // (One hacky fix could be to store the dsp local storage key under it's own named key?)
};

export default CredentialStart;

async function handleVerifyClick() {
  localStorage.setItem("verification", "yes");
  await store.dispatch(verifyDspIdentity());
  const verifyUri = store.getState().dsp.gatewayUri;
  if (verifyUri) {
    const issueName = store.getState().dsp.dspPanelObjName.slice(0, -1);
    await store.dispatch(issueDspCredential(issueName));
    const issueUri = store.getState().dsp.gatewayUri;
    if (issueUri) {
      window.location.href = issueUri;
    }
  } else return <Redirect to="/credential/invalid" />;
}
