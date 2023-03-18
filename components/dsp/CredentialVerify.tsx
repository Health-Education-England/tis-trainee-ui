import { nanoid } from "nanoid";
import { Button, WarningCallout } from "nhsuk-react-components";
import React from "react";
import { Redirect } from "react-router-dom";
import { verifyDspIdentity } from "../../redux/slices/dspSlice";
import store from "../../redux/store/store";
import DSPPanel from "./DSPPanel";

const CredentialVerify: React.FC = () => {
  const storedPanelName = store.getState().dsp.dspPanelObjName;
  const storedPanelData = store.getState().dsp.dspPanelObj;

  return (
    <WarningCallout>
      <WarningCallout.Label visuallyHiddenText={false}>
        Important
      </WarningCallout.Label>
      <p>
        Before you can issue this credential to your DSP wallet you must verify
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
};

export default CredentialVerify;

async function handleVerifyClick() {
  const stateId = nanoid();
  await store.dispatch(verifyDspIdentity(stateId));
  const dspSuccessCode = store.getState().dsp.successCode;
  const verifyUri = store.getState().dsp.gatewayUri;
  if (verifyUri && dspSuccessCode === 201) {
    window.location.href = verifyUri;
  } else {
    localStorage.removeItem(stateId);
    return <Redirect to="/credential/invalid" />;
  }
}
