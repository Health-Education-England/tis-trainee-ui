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
          const savedStateId = store.getState().dsp.stateId;
          if (savedStateId) {
            handleVerifyClick(savedStateId);
          } else return <Redirect to="/credential/invalid" />;
        }}
        data-cy="dspVerifyIdentity"
      >
        Click to verify your identity
      </Button>
    </WarningCallout>
  );
};

export default CredentialVerify;

async function handleVerifyClick(dspSavedStateId: string) {
  await store.dispatch(verifyDspIdentity(dspSavedStateId));
  const dspSuccessCode = store.getState().dsp.successCode;
  const verifyUri = store.getState().dsp.gatewayUri;
  if (verifyUri && dspSuccessCode === 201) {
    window.location.href = verifyUri;
  } else return <Redirect to="/credential/invalid" />;
}
